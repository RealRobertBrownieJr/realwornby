
-- Enums
create type public.app_role as enum ('admin', 'seller', 'buyer');
create type public.listing_status as enum ('active', 'sold', 'withdrawn');
create type public.tx_status as enum ('pending', 'paid', 'shipped', 'delivered', 'released', 'disputed', 'refunded');
create type public.verification_status as enum ('unverified', 'verified', 'verified_plus');

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  bio text,
  avatar_url text,
  country text,
  age_band text,
  body_type text,
  verification verification_status not null default 'unverified',
  premium_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);
create policy "Users can insert their own profile"
  on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "Users can update their own profile"
  on public.profiles for update to authenticated using (auth.uid() = id);

-- Roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create policy "Users can view their own roles"
  on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- Auto-create profile + default roles on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  insert into public.user_roles (user_id, role) values (new.id, 'buyer');
  insert into public.user_roles (user_id, role) values (new.id, 'seller');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Listings
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  price_cents integer not null check (price_cents > 0),
  currency text not null default 'USD',
  fabric text,
  wear_duration text,
  region text,
  body_type text,
  customizable boolean not null default false,
  customization_fee_cents integer not null default 0,
  images text[] not null default '{}',
  status listing_status not null default 'active',
  is_premium boolean not null default false,
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on public.listings (status, created_at desc);
create index on public.listings (seller_id);

grant select on public.listings to anon, authenticated;
grant insert, update, delete on public.listings to authenticated;
grant all on public.listings to service_role;

alter table public.listings enable row level security;

create policy "Active listings are viewable by everyone"
  on public.listings for select using (status = 'active' or auth.uid() = seller_id);
create policy "Sellers can create listings"
  on public.listings for insert to authenticated with check (auth.uid() = seller_id);
create policy "Sellers can update their own listings"
  on public.listings for update to authenticated using (auth.uid() = seller_id);
create policy "Sellers can delete their own listings"
  on public.listings for delete to authenticated using (auth.uid() = seller_id);

-- Transactions (escrow)
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete restrict,
  buyer_id uuid not null references auth.users(id) on delete restrict,
  seller_id uuid not null references auth.users(id) on delete restrict,
  amount_cents integer not null,
  fee_cents integer not null default 0,
  customization_notes text,
  status tx_status not null default 'pending',
  tracking_number text,
  shipped_at timestamptz,
  delivered_at timestamptz,
  release_due_at timestamptz,
  released_at timestamptz,
  disputed_at timestamptz,
  dispute_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on public.transactions (buyer_id);
create index on public.transactions (seller_id);
create index on public.transactions (status, release_due_at);

grant select, insert, update on public.transactions to authenticated;
grant all on public.transactions to service_role;

alter table public.transactions enable row level security;

create policy "Buyers and sellers can view their transactions"
  on public.transactions for select to authenticated
  using (auth.uid() = buyer_id or auth.uid() = seller_id);
create policy "Buyers can create transactions"
  on public.transactions for insert to authenticated with check (auth.uid() = buyer_id);
create policy "Buyer or seller can update their transaction"
  on public.transactions for update to authenticated
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

-- Feedback
create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.transactions(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid not null references auth.users(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (transaction_id, author_id)
);

create index on public.feedback (subject_id);

grant select on public.feedback to anon, authenticated;
grant insert on public.feedback to authenticated;
grant all on public.feedback to service_role;

alter table public.feedback enable row level security;

create policy "Feedback is viewable by everyone"
  on public.feedback for select using (true);
create policy "Users can leave feedback for their transactions"
  on public.feedback for insert to authenticated
  with check (
    auth.uid() = author_id
    and exists (
      select 1 from public.transactions t
      where t.id = transaction_id
        and t.status in ('delivered', 'released')
        and (auth.uid() = t.buyer_id or auth.uid() = t.seller_id)
        and subject_id in (t.buyer_id, t.seller_id)
        and subject_id <> auth.uid()
    )
  );

-- Premium memberships
create table public.premium_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  amount_cents integer not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index on public.premium_memberships (user_id, active);

grant select on public.premium_memberships to authenticated;
grant all on public.premium_memberships to service_role;

alter table public.premium_memberships enable row level security;

create policy "Users can view their own memberships"
  on public.premium_memberships for select to authenticated using (auth.uid() = user_id);

-- updated_at trigger helper
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
create trigger listings_touch before update on public.listings for each row execute function public.touch_updated_at();
create trigger transactions_touch before update on public.transactions for each row execute function public.touch_updated_at();
