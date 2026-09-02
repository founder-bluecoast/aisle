-- Events are truth. The TV / board is a projection. Do not UPDATE or DELETE rows.
-- job_state remains disposable.

create or replace function aisle_traveler_events_immutable()
returns trigger
language plpgsql
as $$
begin
  raise exception 'traveler_events are append-only';
end;
$$;

drop trigger if exists traveler_events_immutable on traveler_events;
create trigger traveler_events_immutable
  before update or delete on traveler_events
  for each row
  execute function aisle_traveler_events_immutable();
