-- Product slice: AS9100-shaped traveler fields, shop settings, sign-off, rework.
-- Still no user accounts. Station/office PINs only.

alter table jobs add column if not exists part_no text;
alter table jobs add column if not exists drawing_rev text;
alter table jobs add column if not exists material text;
alter table jobs add column if not exists heat_lot text;
alter table jobs add column if not exists po text;
alter table jobs add column if not exists notes text;

alter table operations add column if not exists inspect boolean not null default false;
alter table operations add column if not exists notes text;

alter table traveler_events add column if not exists qty integer;
alter table traveler_events add column if not exists initials text;
alter table traveler_events add column if not exists note text;

alter table stations add column if not exists workcenter text;

create table if not exists shop_settings (
  id text primary key,
  name text not null default 'Aisle shop',
  office_pin_hash text not null,
  traveler_template_rev text not null default 'A'
);
