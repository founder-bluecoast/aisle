-- Close-the-loop floor objects: OSP send-out, packet, program gate, ship, bay notes.
-- Still no user accounts, no APS, no purchasing, no WMS.

alter table jobs add column if not exists program_status text not null default 'unknown';
alter table jobs add column if not exists dispatch_rank integer;
alter table jobs add column if not exists packet_drawing boolean not null default false;
alter table jobs add column if not exists packet_cert boolean not null default false;
alter table jobs add column if not exists packet_fai boolean not null default false;
alter table jobs add column if not exists packet_coc boolean not null default false;
alter table jobs add column if not exists ship_status text not null default 'open';

create table if not exists sendouts (
  id text primary key,
  traveler_id text not null,
  vendor text not null,
  process text not null,
  qty integer,
  sent_at timestamptz,
  due_back text,
  received_at timestamptz,
  cert_ok boolean not null default false,
  notes text,
  status text not null default 'sent'
);

create index if not exists sendouts_traveler_idx on sendouts (traveler_id);
create index if not exists sendouts_status_idx on sendouts (status);

create table if not exists bay_notes (
  id text primary key,
  station_id text not null,
  body text not null,
  initials text,
  ts timestamptz not null default now()
);

create index if not exists bay_notes_station_idx on bay_notes (station_id, ts desc);
