-- Human-friendly editorial locations and the original Maceo's Field Note.

alter table public.out_there_posts
  add column if not exists address text;

alter table public.out_there_posts
  drop constraint if exists out_there_posts_address_length_check;

alter table public.out_there_posts
  add constraint out_there_posts_address_length_check
    check (address is null or char_length(address) between 2 and 300);

do $$
declare
  maceos_post_id uuid;
  admin_user_id uuid;
  next_available_number bigint;
begin
  select id
  into admin_user_id
  from public.profiles
  where role = 'admin'
  order by created_at
  limit 1;

  select id
  into maceos_post_id
  from public.out_there_posts
  where lower(title) = lower('The Maceos History and Lore')
  order by created_at
  limit 1;

  maceos_post_id := coalesce(maceos_post_id, gen_random_uuid());

  select coalesce(max(field_note_number), 0) + 1
  into next_available_number
  from public.out_there_posts
  where id <> maceos_post_id;

  update public.out_there_posts
  set field_note_number = next_available_number
  where field_note_number = 1
    and id <> maceos_post_id;

  insert into public.out_there_posts (
    id,
    author_id,
    field_note_number,
    title,
    dek,
    body,
    city,
    address,
    map_label,
    map_note,
    latitude,
    longitude,
    cover_photo_path,
    status,
    featured,
    published_at
  ) values (
    maceos_post_id,
    admin_user_id,
    1,
    'The Maceos History and Lore',
    null,
    $story$There is a particular kind of magic along the island at the edge of the day: the air cools, the lights come on, and familiar places start to feel newly discovered.

This is the spirit of Out There: a closer look at the people, places, and local possibilities that can turn an ordinary afternoon into somewhere worth going.$story$,
    'Galveston, TX',
    '2706 Market St., Galveston, TX 77550',
    'Maceo Spice & Import Co.',
    '2706 Market St., Galveston, TX 77550',
    29.304208359478,
    -94.798627945951,
    'site:assets/out-there/field-note-001-harbor.jpg',
    'published',
    true,
    now()
  )
  on conflict (id) do update set
    author_id = excluded.author_id,
    field_note_number = excluded.field_note_number,
    title = excluded.title,
    dek = excluded.dek,
    body = excluded.body,
    city = excluded.city,
    address = excluded.address,
    map_label = excluded.map_label,
    map_note = excluded.map_note,
    latitude = excluded.latitude,
    longitude = excluded.longitude,
    cover_photo_path = excluded.cover_photo_path,
    status = excluded.status,
    featured = excluded.featured,
    published_at = coalesce(public.out_there_posts.published_at, excluded.published_at);

  update public.out_there_posts
  set featured = false
  where id <> maceos_post_id
    and featured;

  insert into public.out_there_media (
    post_id,
    storage_path,
    alt_text,
    sort_order
  ) values
    (
      maceos_post_id,
      'site:assets/out-there/field-note-001-harbor.jpg',
      'Shrimp boat returning across Galveston harbor with seabirds overhead',
      0
    ),
    (
      maceos_post_id,
      'site:assets/out-there/field-note-001-martini.jpg',
      'Vintage blue-toned photograph of the Martini Theatre facade in Galveston',
      1
    ),
    (
      maceos_post_id,
      'site:assets/out-there/field-note-001-maceo.jpg',
      'Black-and-white view of Maceo Spice and Import Company beneath storm clouds',
      2
    ),
    (
      maceos_post_id,
      'site:assets/out-there/field-note-001-maceo-interior.jpg',
      'Black-and-white portrait inside Maceo Spice and Import Company',
      3
    )
  on conflict (post_id, storage_path) do update set
    alt_text = excluded.alt_text,
    sort_order = excluded.sort_order;

  perform setval(
    pg_get_serial_sequence('public.out_there_posts', 'field_note_number'),
    greatest((select coalesce(max(field_note_number), 1) from public.out_there_posts), 1),
    true
  );
end
$$;
