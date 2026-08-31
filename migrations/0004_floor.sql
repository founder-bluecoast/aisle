-- Floor-native versions of quoting, dispatch, material, drawings, NCR, machines.
-- Still no user accounts, no AI scheduler, no MRP.

alter table jobs add column if not exists rush boolean not null default false;
alter table jobs add column if not exists quoted_hours double precision;
alter table jobs add column if not exists quoted_price double precision;
alter table jobs add column if not exists material_status text not null default 'unknown';
alter table jobs add column if not exists parent_traveler_id text;
alter table jobs add column if not exists quote_id text;

alter table operations add column if not exists planned_hours double precision;
alter table operations add column if not exists instructions text;

alter table stations add column if not exists machine_status text not null default 'up';
alter table stations add column if not exists machine_note text;

create table if not exists quotes (
  id text primary key,
  customer text not null,
  nickname text not null,
  part_no text,
  drawing_rev text,
  qty integer,
  due_date text,
  hours double precision,
  price double precision,
  status text not null default 'open',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists drawings (
  id text primary key,
  traveler_id text not null,
  name text not null,
  rev text,
  url text,
  notes text
);

create table if not exists ncrs (
  id text primary key,
  traveler_id text not null,
  seq integer,
  qty integer,
  disposition text not null,
  description text not null,
  initials text,
  ts timestamptz not null default now()
);

create table if not exists operators (
  initials text primary key,
  name text not null,
  trade text
);
