create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  acct text := coalesce(new.raw_user_meta_data->>'account_type', 'buyer');
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));

  -- everyone can buy
  insert into public.user_roles (user_id, role) values (new.id, 'buyer')
  on conflict do nothing;

  -- only sellers get the seller role
  if acct = 'seller' then
    insert into public.user_roles (user_id, role) values (new.id, 'seller')
    on conflict do nothing;
  end if;

  return new;
end;
$$;