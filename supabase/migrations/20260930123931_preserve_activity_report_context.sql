-- Preserve enough context to review a report after its listing is deleted.

alter table public.activity_reports
  add column activity_title_snapshot text,
  add column activity_owner_id_snapshot uuid,
  add column activity_location_snapshot text;

create or replace function private.capture_activity_report_snapshot()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  select
    a.title,
    a.owner_id,
    concat_ws(' · ', nullif(a.location_name, ''), nullif(a.city, ''))
  into
    new.activity_title_snapshot,
    new.activity_owner_id_snapshot,
    new.activity_location_snapshot
  from public.activities a
  where a.id = new.activity_id;

  if not found then
    raise exception using
      errcode = '23503',
      message = 'The reported activity does not exist.';
  end if;

  return new;
end;
$$;

create trigger activity_reports_capture_snapshot
before insert on public.activity_reports
for each row execute function private.capture_activity_report_snapshot();

alter table public.activity_reports
  alter column activity_title_snapshot set not null,
  alter column activity_id drop not null,
  drop constraint activity_reports_activity_id_fkey,
  add constraint activity_reports_activity_id_fkey
    foreign key (activity_id)
    references public.activities(id)
    on delete set null;
