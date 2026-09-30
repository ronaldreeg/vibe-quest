-- Private trust-and-safety intake for published activity listings.

create table public.activity_reports (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text not null
    check (reason in ('incorrect', 'cancelled', 'spam', 'unsafe', 'duplicate', 'other')),
  details text
    check (details is null or char_length(details) between 1 and 1000),
  status text not null default 'open'
    check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

comment on table public.activity_reports is
  'Private activity reports submitted by signed-in users for moderator review.';

create index activity_reports_activity_idx
  on public.activity_reports (activity_id, created_at desc);

create index activity_reports_moderation_queue_idx
  on public.activity_reports (status, created_at asc)
  where status in ('open', 'reviewing');

create unique index activity_reports_one_open_per_user_idx
  on public.activity_reports (activity_id, reporter_id)
  where status in ('open', 'reviewing');

alter table public.activity_reports enable row level security;

revoke all on table public.activity_reports from anon, authenticated;
grant select, insert on table public.activity_reports to authenticated;

create policy reporters_read_own_activity_reports
on public.activity_reports for select
to authenticated
using ((select auth.uid()) = reporter_id);

create policy signed_in_users_report_published_activities
on public.activity_reports for insert
to authenticated
with check (
  (select auth.uid()) = reporter_id
  and exists (
    select 1
    from public.activities a
    where a.id = activity_id
      and a.status = 'published'
      and a.owner_id is distinct from (select auth.uid())
  )
);
