create index if not exists activity_private_locations_owner_idx
  on public.activity_private_locations (owner_id);

create index if not exists activity_reports_reviewed_by_idx
  on public.activity_reports (reviewed_by)
  where reviewed_by is not null;

create index if not exists moderation_actions_moderator_idx
  on public.moderation_actions (moderator_id)
  where moderator_id is not null;

drop policy if exists users_update_own_activities on public.activities;
drop policy if exists admins_update_activities on public.activities;
create policy owners_and_admins_update_activities
on public.activities for update
to authenticated
using (
  owner_id = (select auth.uid())
  or private.is_admin()
)
with check (
  private.is_admin()
  or (
    owner_id = (select auth.uid())
    and status in ('draft', 'pending', 'published', 'paused', 'cancelled', 'archived')
  )
);

drop policy if exists reporters_read_own_activity_reports on public.activity_reports;
drop policy if exists admins_read_all_activity_reports on public.activity_reports;
create policy reporters_and_admins_read_activity_reports
on public.activity_reports for select
to authenticated
using (
  reporter_id = (select auth.uid())
  or private.is_admin()
);

