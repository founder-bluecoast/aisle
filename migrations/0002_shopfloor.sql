-- Aisle shop-floor schema. Unowned rows (no user accounts).
-- Events are append-only. job_state is a disposable projection.

create table if not exists stations (
  id text primary key,
  name text not null,
  pin_hash text not null,
  active boolean not null default true
);

create table if not exists jobs (
  traveler_id text primary key,
  erp_id text,
  nickname text not null,
  customer text,
  qty integer,
  due_date text,
  source_batch_id text,
  updated_at timestamptz not null default now()
);

create table if not exists operations (
  traveler_id text not null references jobs (traveler_id) on delete cascade,
  seq integer not null,
  name text not null,
  workcenter text,
  primary key (traveler_id, seq)
);

create table if not exists import_batches (
  id text primary key,
  filename text,
  row_count integer not null default 0,
  jobs_upserted integer not null default 0,
  ops_upserted integer not null default 0,
  skipped integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists traveler_events (
  id text primary key,
  traveler_id text not null,
  seq integer not null,
  type text not null,
  station_id text,
  blocker_code text,
  blocker_text text,
  client_event_id text,
  ts timestamptz not null default now()
);

create unique index if not exists traveler_events_client_id
  on traveler_events (client_event_id)
  where client_event_id is not null;

create index if not exists traveler_events_job_ts
  on traveler_events (traveler_id, ts, id);

create table if not exists job_state (
  traveler_id text primary key references jobs (traveler_id) on delete cascade,
  current_seq integer,
  current_op_name text,
  status text not null,
  blocker_code text,
  blocker_text text,
  state_entered_at timestamptz,
  last_station_id text,
  last_event_id text
);
