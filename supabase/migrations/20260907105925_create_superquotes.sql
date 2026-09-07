create table public.offers (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  sport text not null check (sport in ('Calcio', 'Tennis', 'Basket', 'Motori', 'Altro')),
  event text not null check (length(trim(event)) between 2 and 240),
  market text not null check (length(trim(market)) between 2 and 2000),
  original_odds numeric(9,4) check (original_odds > 1 and original_odds <= 10000),
  boosted_odds numeric(9,4) not null check (boosted_odds > 1 and boosted_odds <= 10000),
  outcome text not null default 'pending' check (outcome in ('pending', 'won', 'lost', 'void')),
  source_key text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint offers_boost_check check (original_odds is null or boosted_odds >= original_odds)
);

create index offers_active_date_idx on public.offers (date desc, id desc) where deleted_at is null;
create index offers_active_sport_date_idx on public.offers (sport, date desc) where deleted_at is null;

alter table public.offers enable row level security;
revoke all on public.offers from anon, authenticated;
grant select on public.offers to anon, authenticated;
grant insert, update on public.offers to authenticated;
grant all on public.offers to service_role;

create policy offers_public_read on public.offers for select to anon, authenticated
  using (deleted_at is null or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy offers_admin_insert on public.offers for insert to authenticated
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy offers_admin_update on public.offers for update to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create function public.touch_offer_updated_at() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
revoke all on function public.touch_offer_updated_at() from public, anon, authenticated;
create trigger offers_updated_at before update on public.offers
for each row execute function public.touch_offer_updated_at();
