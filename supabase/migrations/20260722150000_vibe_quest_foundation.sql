-- Vibe Quest's first production data foundation.
-- Public discovery stays open; ownership and uploads are protected by RLS.

create extension if not exists pgcrypto;

create schema if not exists private;
revoke all on schema private from public;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Vibe Explorer',
  city text,
  bio text,
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
  title text not null check (char_length(title) between 3 and 120),
  description text not null check (char_length(description) between 10 and 2000),
  location_name text not null,
  location_query text,
  city text not null,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  location_accuracy text not null default 'approximate'
    check (location_accuracy in ('exact', 'approximate')),
  type text not null,
  vibes text[] not null default '{}',
  price_label text not null default 'Free',
  listing_mode text not null default 'one-time'
    check (listing_mode in ('one-time', 'recurring', 'anytime')),
  start_date date,
  start_time time,
  recurring_day smallint check (recurring_day between 0 and 6),
  recurring_time time,
  status text not null default 'published'
    check (status in ('draft', 'pending', 'published', 'archived', 'rejected')),
  cover_photo_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.activity_links (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  label text not null check (char_length(label) between 1 and 80),
  url text not null check (char_length(url) between 1 and 1000),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.activity_media (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  uploaded_by uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  caption text,
  sort_order integer not null default 0,
  moderation_status text not null default 'pending'
    check (moderation_status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create table public.saved_activities (
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_id uuid not null references public.activities(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, activity_id)
);

create table public.adventure_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_id uuid references public.activities(id) on delete set null,
  activity_title text,
  title text not null default 'Field note',
  notes text not null check (char_length(notes) between 1 and 5000),
  visited_on date not null default current_date,
  visibility text not null default 'private'
    check (visibility in ('private', 'public')),
  cover_photo_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.out_there_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users(id) on delete set null,
  title text not null,
  dek text,
  body text,
  city text,
  map_label text,
  latitude double precision check (latitude between -90 and 90),
  longitude double precision check (longitude between -180 and 180),
  cover_photo_path text,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index activities_public_discovery_idx
  on public.activities (status, city, created_at desc);
create index activities_owner_idx on public.activities (owner_id, created_at desc);
create index activity_links_activity_idx on public.activity_links (activity_id, sort_order);
create index activity_media_activity_idx on public.activity_media (activity_id, moderation_status, sort_order);
create index adventure_logs_user_idx on public.adventure_logs (user_id, visited_on desc);
create index out_there_published_idx on public.out_there_posts (status, featured, published_at desc);

create or replace function private.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function private.touch_updated_at();

create trigger activities_touch_updated_at
before update on public.activities
for each row execute function private.touch_updated_at();

create trigger adventure_logs_touch_updated_at
before update on public.adventure_logs
for each row execute function private.touch_updated_at();

create trigger out_there_posts_touch_updated_at
before update on public.out_there_posts
for each row execute function private.touch_updated_at();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, city)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'name'), ''), 'Vibe Explorer'),
    nullif(trim(new.raw_user_meta_data ->> 'city'), '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.activities enable row level security;
alter table public.activity_links enable row level security;
alter table public.activity_media enable row level security;
alter table public.saved_activities enable row level security;
alter table public.adventure_logs enable row level security;
alter table public.out_there_posts enable row level security;

create policy profiles_are_public
on public.profiles for select
to anon, authenticated
using (true);

create policy users_insert_own_profile
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = id);

create policy users_update_own_profile
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy published_activities_are_public
on public.activities for select
to anon, authenticated
using (status = 'published' or (select auth.uid()) = owner_id);

create policy users_insert_own_activities
on public.activities for insert
to authenticated
with check ((select auth.uid()) = owner_id);

create policy users_update_own_activities
on public.activities for update
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy users_delete_own_activities
on public.activities for delete
to authenticated
using ((select auth.uid()) = owner_id);

create policy visible_activity_links_are_public
on public.activity_links for select
to anon, authenticated
using (exists (
  select 1 from public.activities a
  where a.id = activity_id
    and (a.status = 'published' or (select auth.uid()) = a.owner_id)
));

create policy activity_owners_insert_links
on public.activity_links for insert
to authenticated
with check (exists (
  select 1 from public.activities a
  where a.id = activity_id and (select auth.uid()) = a.owner_id
));

create policy activity_owners_update_links
on public.activity_links for update
to authenticated
using (exists (
  select 1 from public.activities a
  where a.id = activity_id and (select auth.uid()) = a.owner_id
))
with check (exists (
  select 1 from public.activities a
  where a.id = activity_id and (select auth.uid()) = a.owner_id
));

create policy activity_owners_delete_links
on public.activity_links for delete
to authenticated
using (exists (
  select 1 from public.activities a
  where a.id = activity_id and (select auth.uid()) = a.owner_id
));

create policy approved_activity_media_are_public
on public.activity_media for select
to anon, authenticated
using (
  (
    moderation_status = 'approved'
    and exists (
      select 1 from public.activities a
      where a.id = activity_id and a.status = 'published'
    )
  )
  or (select auth.uid()) = uploaded_by
  or exists (
    select 1 from public.activities a
    where a.id = activity_id and (select auth.uid()) = a.owner_id
  )
);

create policy authenticated_users_upload_activity_media
on public.activity_media for insert
to authenticated
with check (
  (select auth.uid()) = uploaded_by
  and exists (
    select 1 from public.activities a
    where a.id = activity_id and a.status = 'published'
  )
);

create policy media_uploader_or_activity_owner_update
on public.activity_media for update
to authenticated
using (
  (select auth.uid()) = uploaded_by
  or exists (
    select 1 from public.activities a
    where a.id = activity_id and (select auth.uid()) = a.owner_id
  )
)
with check (
  (select auth.uid()) = uploaded_by
  or exists (
    select 1 from public.activities a
    where a.id = activity_id and (select auth.uid()) = a.owner_id
  )
);

create policy media_uploader_or_activity_owner_delete
on public.activity_media for delete
to authenticated
using (
  (select auth.uid()) = uploaded_by
  or exists (
    select 1 from public.activities a
    where a.id = activity_id and (select auth.uid()) = a.owner_id
  )
);

create policy users_manage_own_saves
on public.saved_activities for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy users_read_adventure_logs
on public.adventure_logs for select
to anon, authenticated
using (visibility = 'public' or (select auth.uid()) = user_id);

create policy users_insert_own_adventure_logs
on public.adventure_logs for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy users_update_own_adventure_logs
on public.adventure_logs for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy users_delete_own_adventure_logs
on public.adventure_logs for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy published_out_there_posts_are_public
on public.out_there_posts for select
to anon, authenticated
using (status = 'published');

grant select on public.profiles, public.activities, public.activity_links,
  public.activity_media, public.out_there_posts to anon, authenticated;
grant insert, update on public.profiles to authenticated;
grant insert, update, delete on public.activities, public.activity_links,
  public.activity_media, public.adventure_logs to authenticated;
grant select, insert, update, delete on public.saved_activities to authenticated;
grant select on public.adventure_logs to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('activity-media', 'activity-media', true, 10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]),
  ('adventure-media', 'adventure-media', false, 15728640,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]),
  ('editorial-media', 'editorial-media', true, 26214400,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy public_activity_media_objects_are_readable
on storage.objects for select
to anon, authenticated
using (bucket_id = 'activity-media');

create policy users_upload_activity_media_objects
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'activity-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy users_update_activity_media_objects
on storage.objects for update
to authenticated
using (
  bucket_id = 'activity-media'
  and owner_id = (select auth.uid())::text
)
with check (
  bucket_id = 'activity-media'
  and owner_id = (select auth.uid())::text
);

create policy users_delete_activity_media_objects
on storage.objects for delete
to authenticated
using (
  bucket_id = 'activity-media'
  and owner_id = (select auth.uid())::text
);

create policy users_read_own_adventure_media_objects
on storage.objects for select
to authenticated
using (
  bucket_id = 'adventure-media'
  and owner_id = (select auth.uid())::text
);

create policy users_upload_adventure_media_objects
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'adventure-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy users_update_adventure_media_objects
on storage.objects for update
to authenticated
using (
  bucket_id = 'adventure-media'
  and owner_id = (select auth.uid())::text
)
with check (
  bucket_id = 'adventure-media'
  and owner_id = (select auth.uid())::text
);

create policy users_delete_adventure_media_objects
on storage.objects for delete
to authenticated
using (
  bucket_id = 'adventure-media'
  and owner_id = (select auth.uid())::text
);

create policy public_editorial_media_objects_are_readable
on storage.objects for select
to anon, authenticated
using (bucket_id = 'editorial-media');
