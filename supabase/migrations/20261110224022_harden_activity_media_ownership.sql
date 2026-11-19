-- Listing photos belong to listing owners and admins. The original policies
-- also supported attendee uploads, a product path that is no longer exposed.

drop policy if exists authenticated_users_upload_activity_media
on public.activity_media;

drop policy if exists media_uploader_or_activity_owner_update
on public.activity_media;

drop policy if exists media_uploader_or_activity_owner_delete
on public.activity_media;

create policy activity_managers_insert_media
on public.activity_media for insert
to authenticated
with check (
  uploaded_by = (select auth.uid())
  and private.can_manage_activity(activity_id)
  and moderation_status = 'approved'
  and split_part(storage_path, '/', 1) = (select auth.uid())::text
  and split_part(storage_path, '/', 2) = activity_id::text
);

create policy activity_managers_delete_media
on public.activity_media for delete
to authenticated
using (private.can_manage_activity(activity_id));

drop policy if exists users_upload_activity_media_objects
on storage.objects;

drop policy if exists users_update_activity_media_objects
on storage.objects;

drop policy if exists users_delete_activity_media_objects
on storage.objects;

create policy activity_managers_upload_media_objects
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'activity-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and case
    when coalesce((storage.foldername(name))[2], '')
      ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    then private.can_manage_activity(((storage.foldername(name))[2])::uuid)
    else false
  end
);

create policy activity_managers_delete_media_objects
on storage.objects for delete
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
