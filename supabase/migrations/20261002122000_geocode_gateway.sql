create table if not exists public.geocode_cache (
  cache_key text primary key,
  action text not null check (action in ('search', 'reverse')),
  response jsonb not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  constraint geocode_cache_key_length check (char_length(cache_key) between 1 and 220)
);

create index if not exists geocode_cache_expires_at_idx
  on public.geocode_cache (expires_at);

alter table public.geocode_cache enable row level security;
revoke all on table public.geocode_cache from anon, authenticated;

create table if not exists public.geocode_rate_limits (
  client_hash text primary key,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0 check (request_count >= 0),
  updated_at timestamptz not null default now(),
  constraint geocode_rate_limits_hash_length check (char_length(client_hash) between 16 and 128)
);

alter table public.geocode_rate_limits enable row level security;
revoke all on table public.geocode_rate_limits from anon, authenticated;

create table if not exists public.geocode_service_state (
  singleton boolean primary key default true check (singleton),
  last_upstream_request_at timestamptz
);

insert into public.geocode_service_state (singleton)
values (true)
on conflict (singleton) do nothing;

alter table public.geocode_service_state enable row level security;
revoke all on table public.geocode_service_state from anon, authenticated;

create or replace function public.reserve_geocode_request(p_client_hash text)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_window_started_at timestamptz;
  v_request_count integer;
  v_last_upstream timestamptz;
  v_retry_ms integer;
begin
  if p_client_hash is null
    or char_length(p_client_hash) < 16
    or char_length(p_client_hash) > 128 then
    return -1;
  end if;

  perform pg_advisory_xact_lock(hashtextextended('vibe-quest-geocode-gateway', 0));

  delete from public.geocode_rate_limits
  where updated_at < v_now - interval '1 day';

  select window_started_at, request_count
  into v_window_started_at, v_request_count
  from public.geocode_rate_limits
  where client_hash = p_client_hash;

  if not found or v_window_started_at <= v_now - interval '1 minute' then
    insert into public.geocode_rate_limits (
      client_hash,
      window_started_at,
      request_count,
      updated_at
    ) values (
      p_client_hash,
      v_now,
      0,
      v_now
    )
    on conflict (client_hash) do update
      set window_started_at = excluded.window_started_at,
          request_count = 0,
          updated_at = excluded.updated_at;
    v_request_count := 0;
  end if;

  if v_request_count >= 20 then
    return -1;
  end if;

  select last_upstream_request_at
  into v_last_upstream
  from public.geocode_service_state
  where singleton = true
  for update;

  if v_last_upstream is not null and v_last_upstream > v_now - interval '1 second' then
    v_retry_ms := greatest(
      50,
      ceil(1000 - extract(epoch from (v_now - v_last_upstream)) * 1000)::integer
    );
    return v_retry_ms;
  end if;

  update public.geocode_rate_limits
  set request_count = request_count + 1,
      updated_at = v_now
  where client_hash = p_client_hash;

  update public.geocode_service_state
  set last_upstream_request_at = v_now
  where singleton = true;

  return 0;
end;
$$;

revoke all on function public.reserve_geocode_request(text) from public, anon, authenticated;
grant execute on function public.reserve_geocode_request(text) to service_role;

