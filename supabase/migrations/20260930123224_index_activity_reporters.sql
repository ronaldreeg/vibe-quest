-- Cover reporter lookups and auth-user cascade checks.

create index activity_reports_reporter_idx
  on public.activity_reports (reporter_id, created_at desc);
