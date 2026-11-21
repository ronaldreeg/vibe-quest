-- Badges are separate from cover photos and are stored in the existing public
-- activity-media bucket. The path must belong to this activity and its owner;
-- it cannot refer to a URL or another user's file.
alter table public.activities
  add column if not exists badge_storage_path text;

alter table public.activities
  add constraint activities_badge_storage_path_format check (
    badge_storage_path is null
    or (
      -- Accounts can be deleted while a retained activity has a null owner.
      (owner_id is null or split_part(badge_storage_path, '/', 1) = owner_id::text)
      and split_part(badge_storage_path, '/', 2) = id::text
      and split_part(badge_storage_path, '/', 3) ~ '^badge-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}[.]png$'
      and cardinality(string_to_array(badge_storage_path, '/')) = 3
    )
  );

comment on column public.activities.badge_storage_path is
  'Optional owner-created badge in activity-media, separate from the cover photo.';
