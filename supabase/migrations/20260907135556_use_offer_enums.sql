create type public.offer_sport as enum ('Calcio', 'Tennis', 'Basket', 'Motori', 'Altro');
create type public.offer_outcome as enum ('pending', 'won', 'lost', 'void');

alter table public.offers
  drop constraint offers_sport_check,
  drop constraint offers_outcome_check,
  alter column outcome drop default,
  alter column sport type public.offer_sport using sport::public.offer_sport,
  alter column outcome type public.offer_outcome using outcome::public.offer_outcome,
  alter column outcome set default 'pending'::public.offer_outcome;
