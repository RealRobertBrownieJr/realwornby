
create extension if not exists pg_cron;

create or replace function public.auto_release_escrow()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.transactions
  set status = 'released', released_at = now()
  where status = 'delivered'
    and release_due_at is not null
    and release_due_at <= now();

  update public.listings l
  set status = 'sold'
  where l.status = 'active'
    and exists (
      select 1 from public.transactions t
      where t.listing_id = l.id and t.status in ('released', 'paid', 'shipped', 'delivered')
    );
end;
$$;

revoke execute on function public.auto_release_escrow() from public, anon, authenticated;

select cron.schedule(
  'auto-release-escrow',
  '*/15 * * * *',
  $$ select public.auto_release_escrow(); $$
);
