-- Tighten public media access and cover common relationship lookups.

drop policy if exists public_activity_media_objects_are_readable
on storage.objects;

drop policy if exists public_editorial_media_objects_are_readable
on storage.objects;

create index activity_media_uploaded_by_idx
  on public.activity_media (uploaded_by);
create index adventure_logs_activity_idx
  on public.adventure_logs (activity_id);
create index out_there_author_idx
  on public.out_there_posts (author_id);
create index saved_activities_activity_idx
  on public.saved_activities (activity_id);
