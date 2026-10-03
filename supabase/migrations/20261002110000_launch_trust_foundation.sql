-- Launch trust foundation: listing lifecycle, protected locations, and moderation.

alter table public.profiles
  add column if not exists role text not null default 'member';

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('member', 'admin'));

-- A profile owner may edit their public profile fields, never their privilege level.
revoke insert, update on table public.profiles from anon, authenticated;
grant insert (id, display_name, city, bio, avatar_path) on table public.profiles to authenticated;
grant update (display_name, city, bio, avatar_path) on table public.profiles to authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'
  );
$$;

revoke all on function private.is_admin() from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.is_admin() to anon, authenticated;

alter table public.activities
  add column if not exists location_visibility text not null default 'public',
  add column if not exists time_zone text not null default 'America/Chicago',
  add column if not exists last_confirmed_at timestamptz not null default now();

alter table public.activities
  drop constraint if exists activities_location_visibility_check,
  drop constraint if exists activities_status_check,
  drop constraint if exists activities_time_zone_length_check;

alter table public.activities
  add constraint activities_location_visibility_check
    check (location_visibility in ('public', 'private')),
  add constraint activities_status_check
    check (status in ('draft', 'pending', 'published', 'paused', 'cancelled', 'archived', 'rejected')),
  add constraint activities_time_zone_length_check
    check (char_length(time_zone) between 1 and 80);

create or replace function private.validate_activity_time_zone()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from pg_catalog.pg_timezone_names
    where name = new.time_zone
  ) then
    raise exception using
      errcode = '22023',
      message = 'Unknown activity time zone.';
  end if;
  return new;
end;
$$;

drop trigger if exists activities_validate_time_zone on public.activities;
create trigger activities_validate_time_zone
before insert or update of time_zone on public.activities
for each row execute function private.validate_activity_time_zone();

create index if not exists activities_upcoming_discovery_idx
  on public.activities (status, listing_mode, start_date, created_at desc);

create index if not exists activities_confirmation_idx
  on public.activities (status, listing_mode, last_confirmed_at desc)
  where listing_mode in ('recurring', 'anytime');

create or replace function private.activity_is_discoverable(target_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.activities a
    where a.id = target_id
      and a.status = 'published'
      and (
        (
          a.listing_mode = 'one-time'
          and a.start_date is not null
          and a.start_date >= (now() at time zone a.time_zone)::date
        )
        or (
          a.listing_mode in ('recurring', 'anytime')
          and a.last_confirmed_at >= now() - interval '90 days'
        )
      )
  );
$$;

create or replace function private.can_manage_activity(target_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_admin() or exists (
    select 1
    from public.activities a
    where a.id = target_id
      and a.owner_id = (select auth.uid())
  );
$$;

create or replace function private.can_view_activity(target_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.activity_is_discoverable(target_id)
    or private.can_manage_activity(target_id);
$$;

revoke all on function private.activity_is_discoverable(uuid) from public;
revoke all on function private.can_manage_activity(uuid) from public;
revoke all on function private.can_view_activity(uuid) from public;
grant execute on function private.activity_is_discoverable(uuid) to anon, authenticated;
grant execute on function private.can_manage_activity(uuid) to anon, authenticated;
grant execute on function private.can_view_activity(uuid) to anon, authenticated;

drop policy if exists published_activities_are_public on public.activities;
create policy discoverable_or_owned_activities_are_visible
on public.activities for select
to anon, authenticated
using (
  private.activity_is_discoverable(id)
  or owner_id = (select auth.uid())
  or private.is_admin()
);

drop policy if exists users_insert_own_activities on public.activities;
create policy users_insert_own_activities
on public.activities for insert
to authenticated
with check (
  owner_id = (select auth.uid())
  and status in ('draft', 'pending', 'published', 'paused', 'cancelled', 'archived')
);

drop policy if exists users_update_own_activities on public.activities;
create policy users_update_own_activities
on public.activities for update
to authenticated
using (owner_id = (select auth.uid()))
with check (
  owner_id = (select auth.uid())
  and status in ('draft', 'pending', 'published', 'paused', 'cancelled', 'archived')
);

create policy admins_update_activities
on public.activities for update
to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists visible_activity_links_are_public on public.activity_links;
create policy visible_activity_links_are_public
on public.activity_links for select
to anon, authenticated
using (private.can_view_activity(activity_id));

drop policy if exists approved_activity_media_are_public on public.activity_media;
create policy approved_activity_media_are_public
on public.activity_media for select
to anon, authenticated
using (
  (moderation_status = 'approved' and private.activity_is_discoverable(activity_id))
  or uploaded_by = (select auth.uid())
  or private.can_manage_activity(activity_id)
);

drop policy if exists signed_in_users_report_published_activities on public.activity_reports;
create policy signed_in_users_report_published_activities
on public.activity_reports for insert
to authenticated
with check (
  reporter_id = (select auth.uid())
  and private.activity_is_discoverable(activity_id)
  and exists (
    select 1
    from public.activities a
    where a.id = activity_id
      and a.owner_id is distinct from (select auth.uid())
  )
);

-- Exact private-home or meetup coordinates never live on the public activity row.
create table if not exists public.activity_private_locations (
  activity_id uuid primary key references public.activities(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  location_name text not null check (char_length(location_name) between 2 and 180),
  location_query text not null check (char_length(location_query) between 2 and 300),
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists activity_private_locations_touch_updated_at on public.activity_private_locations;
create trigger activity_private_locations_touch_updated_at
before update on public.activity_private_locations
for each row execute function private.touch_updated_at();

alter table public.activity_private_locations enable row level security;
revoke all on table public.activity_private_locations from anon, authenticated;
grant select, insert, update, delete on table public.activity_private_locations to authenticated;

create policy owners_and_admins_read_private_locations
on public.activity_private_locations for select
to authenticated
using (owner_id = (select auth.uid()) or private.is_admin());

create policy owners_insert_private_locations
on public.activity_private_locations for insert
to authenticated
with check (
  owner_id = (select auth.uid())
  and private.can_manage_activity(activity_id)
);

create policy owners_and_admins_update_private_locations
on public.activity_private_locations for update
to authenticated
using (owner_id = (select auth.uid()) or private.is_admin())
with check (owner_id = (select auth.uid()) or private.is_admin());

create policy owners_and_admins_delete_private_locations
on public.activity_private_locations for delete
to authenticated
using (owner_id = (select auth.uid()) or private.is_admin());

alter table public.activity_reports
  add column if not exists reviewed_by uuid references auth.users(id) on delete set null,
  add column if not exists resolution_note text
    check (resolution_note is null or char_length(resolution_note) between 1 and 1000),
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists activity_reports_touch_updated_at on public.activity_reports;
create trigger activity_reports_touch_updated_at
before update on public.activity_reports
for each row execute function private.touch_updated_at();

grant update on table public.activity_reports to authenticated;

create policy admins_read_all_activity_reports
on public.activity_reports for select
to authenticated
using (private.is_admin());

create policy admins_update_activity_reports
on public.activity_reports for update
to authenticated
using (private.is_admin())
with check (private.is_admin());

create table if not exists public.moderation_actions (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references public.activity_reports(id) on delete set null,
  activity_id uuid references public.activities(id) on delete set null,
  moderator_id uuid references auth.users(id) on delete set null,
  action text not null check (action in (
    'reviewing', 'resolved', 'dismissed',
    'listing_paused', 'listing_published', 'listing_rejected'
  )),
  note text check (note is null or char_length(note) between 1 and 1000),
  created_at timestamptz not null default now()
);

create index if not exists moderation_actions_report_idx
  on public.moderation_actions (report_id, created_at desc);
create index if not exists moderation_actions_activity_idx
  on public.moderation_actions (activity_id, created_at desc);

alter table public.moderation_actions enable row level security;
revoke all on table public.moderation_actions from anon, authenticated;
grant select, insert on table public.moderation_actions to authenticated;

create policy admins_read_moderation_actions
on public.moderation_actions for select
to authenticated
using (private.is_admin());

create policy admins_insert_moderation_actions
on public.moderation_actions for insert
to authenticated
with check (
  private.is_admin()
  and moderator_id = (select auth.uid())
);

-- Deleting an account should remove listings rather than leave anonymous posts behind.
alter table public.activities
  drop constraint if exists activities_owner_id_fkey,
  add constraint activities_owner_id_fkey
    foreign key (owner_id) references auth.users(id) on delete cascade;
