-- Storage removal needs both SELECT and DELETE permission. Restrict object
-- metadata visibility to managers of the activity identified by its path.
create policy activity_managers_read_media_objects
on storage.objects for select
to authenticated
using (
  bucket_id = 'activity-media'
  and case
    when coalesce((storage.foldername(name))[2], '')
      ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    then private.can_manage_activity(((storage.foldername(name))[2])::uuid)
    else false
  end
);
