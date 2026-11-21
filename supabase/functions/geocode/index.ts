import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.50.0";
import censusPlaces from "./census-places-2025.json" with { type: "json" };

const ALLOWED_ORIGINS = new Set([
  "https://vibe-quest.net",
  "https://www.vibe-quest.net",
  "http://127.0.0.1:4173",
  "http://localhost:4173",
  "null",
]);

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin) ? origin : "https://www.vibe-quest.net",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Cache-Control": "no-store",
    "Vary": "Origin",
  };
}

function json(request: Request, body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request), "Content-Type": "application/json" },
  });
}

function normalizeQuery(value: unknown) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 160);
}

function finiteNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

// US Census 2025 Gazetteer internal points. This is an exact city lookup,
// never a guessed address or venue match. Ambiguous names require a state.
const STATE_ABBREVIATIONS: Record<string, string> = {
  alabama: "AL", alaska: "AK", arizona: "AZ", arkansas: "AR", california: "CA", colorado: "CO", connecticut: "CT",
  delaware: "DE", "district of columbia": "DC", florida: "FL", georgia: "GA", hawaii: "HI", idaho: "ID", illinois: "IL",
  indiana: "IN", iowa: "IA", kansas: "KS", kentucky: "KY", louisiana: "LA", maine: "ME", maryland: "MD",
  massachusetts: "MA", michigan: "MI", minnesota: "MN", mississippi: "MS", missouri: "MO", montana: "MT", nebraska: "NE",
  nevada: "NV", "new hampshire": "NH", "new jersey": "NJ", "new mexico": "NM", "new york": "NY",
  "north carolina": "NC", "north dakota": "ND", ohio: "OH", oklahoma: "OK", oregon: "OR", pennsylvania: "PA",
  "rhode island": "RI", "south carolina": "SC", "south dakota": "SD", tennessee: "TN", texas: "TX", utah: "UT",
  vermont: "VT", virginia: "VA", washington: "WA", "west virginia": "WV", wisconsin: "WI", wyoming: "WY", "puerto rico": "PR",
};

function censusCity(query: string) {
  const parts = query.split(",").map((part) => part.trim().toLocaleLowerCase("en-US"));
  if (parts.length > 2 || !parts[0]) return null;
  const state = parts[1] ? (STATE_ABBREVIATIONS[parts[1]] || parts[1].toUpperCase()) : "";
  if (state && !/^[A-Z]{2}$/.test(state)) return null;
  const matches = censusPlaces.filter(([name, region]) => String(name).toLocaleLowerCase("en-US") === parts[0]
    && (!state || region === state));
  if (matches.length !== 1) return null;
  const [name, region, lat, lon] = matches[0];
  return {
    lat: String(lat), lon: String(lon), name, display_name: `${name}, ${region}, United States`,
    type: "city", addresstype: "city", importance: 1,
    address: { city: name, state_code: `US-${region}`, country: "United States", country_code: "us" },
  };
}

function photonFeatureToPlace(feature: Record<string, any>) {
  const properties = feature?.properties || {};
  const coordinates = Array.isArray(feature?.geometry?.coordinates)
    ? feature.geometry.coordinates.map(Number)
    : [];
  const longitude = coordinates[0];
  const latitude = coordinates[1];
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  const locality = properties.city
    || properties.town
    || properties.village
    || (properties.type === "city" ? properties.name : "");
  const displayParts = [
    properties.housenumber,
    properties.name,
    properties.street,
    properties.locality,
    properties.district,
    locality,
    properties.county,
    properties.state,
    properties.postcode,
    properties.country,
  ].filter((value, index, values) => value && values.indexOf(value) === index);
  const extent = Array.isArray(properties.extent) ? properties.extent.map(Number) : [];
  const boundingbox = extent.length === 4 && extent.every(Number.isFinite)
    ? [String(extent[3]), String(extent[1]), String(extent[0]), String(extent[2])]
    : undefined;

  return {
    lat: String(latitude),
    lon: String(longitude),
    display_name: displayParts.join(", "),
    name: properties.name || properties.street || locality || "",
    category: properties.osm_key || "place",
    type: properties.type || properties.osm_value || "place",
    addresstype: properties.type || properties.osm_value || "place",
    importance: 0.5,
    boundingbox,
    address: {
      house_number: properties.housenumber || undefined,
      road: properties.street || undefined,
      neighbourhood: properties.district || properties.locality || undefined,
      city: locality || undefined,
      county: properties.county || undefined,
      state: properties.state || undefined,
      postcode: properties.postcode || undefined,
      country: properties.country || undefined,
      country_code: String(properties.countrycode || "").toLowerCase() || undefined,
    },
  };
}

function censusMatchToPlace(match: Record<string, any>) {
  const latitude = Number(match?.coordinates?.y);
  const longitude = Number(match?.coordinates?.x);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  const address = match?.addressComponents || {};
  const road = [
    address.preDirection,
    address.streetName,
    address.suffixType,
    address.suffixDirection,
  ].filter(Boolean).join(" ");

  return {
    lat: String(latitude),
    lon: String(longitude),
    display_name: String(match?.matchedAddress || ""),
    name: [address.fromAddress, road].filter(Boolean).join(" "),
    category: "place",
    type: "house",
    addresstype: "house",
    importance: 1,
    address: {
      house_number: address.fromAddress || undefined,
      road: road || undefined,
      city: address.city || undefined,
      state: address.state || undefined,
      state_code: address.state ? `US-${String(address.state).toUpperCase()}` : undefined,
      postcode: address.zip || undefined,
      country: "United States",
      country_code: "us",
    },
  };
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(request) });
  }
  if (request.method !== "POST") return json(request, { error: "Method not allowed" }, 405);

  const origin = request.headers.get("origin") || "";
  if (origin && !ALLOWED_ORIGINS.has(origin)) return json(request, { error: "Origin not allowed" }, 403);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return json(request, { error: "Server configuration unavailable" }, 500);
  }
  if (request.headers.get("apikey") !== anonKey) {
    return json(request, { error: "Invalid client key" }, 401);
  }

  const body = await request.json().catch(() => ({}));
  const action = body?.action === "reverse" ? "reverse" : body?.action === "search" ? "search" : "";
  if (!action) return json(request, { error: "Invalid geocode action" }, 400);

  let cacheKey = "";
  let upstreamUrl = "";
  let fallbackUrl = "";
  let responseKey = "";
  let provider = "photon";
  // Private addresses must not be stored in the shared query cache or sent to
  // an additional provider. Existing Census/Photon lookups still apply.
  const sensitive = body?.sensitive !== false;

  if (action === "search") {
    const query = normalizeQuery(body?.query);
    const limit = Math.min(8, Math.max(1, Math.round(finiteNumber(body?.limit) || 5)));
    if (query.length < 2) return json(request, { error: "Enter a longer location" }, 400);
    cacheKey = `v3:search:${query.toLocaleLowerCase("en-US")}:${limit}`;
    fallbackUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&countrycodes=us&limit=${limit}&q=${encodeURIComponent(query)}`;
    if (/^\s*\d{1,7}\s+\S+/.test(query)) {
      provider = "census";
      upstreamUrl = `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?benchmark=Public_AR_Current&format=json&address=${encodeURIComponent(query)}`;
    } else {
      upstreamUrl = `https://photon.komoot.io/api/?lang=en&limit=${limit}&q=${encodeURIComponent(query)}`;
    }
    responseKey = "results";
  } else {
    const latitude = finiteNumber(body?.latitude);
    const longitude = finiteNumber(body?.longitude);
    if (latitude === null || longitude === null || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return json(request, { error: "Invalid coordinates" }, 400);
    }
    const roundedLatitude = latitude.toFixed(5);
    const roundedLongitude = longitude.toFixed(5);
    cacheKey = `v2:reverse:${roundedLatitude}:${roundedLongitude}`;
    upstreamUrl = `https://photon.komoot.io/reverse?lang=en&limit=1&lat=${roundedLatitude}&lon=${roundedLongitude}`;
    responseKey = "result";
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: cached } = sensitive ? { data: null } : await admin
    .from("geocode_cache")
    .select("response")
    .eq("cache_key", cacheKey)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (cached?.response !== undefined) {
    return json(request, { [responseKey]: cached.response, cached: true });
  }

  if (action === "search" && !sensitive) {
    const place = censusCity(normalizeQuery(body?.query));
    if (place) {
      const response = [place];
      const { error } = await admin.from("geocode_cache").upsert({
        cache_key: cacheKey, action, response, created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
      });
      if (error) {
        console.error("geocode cache write failed", error);
        return json(request, { error: "Location search is temporarily unavailable" }, 503);
      }
      return json(request, { results: response, cached: false });
    }
  }

  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const dailySalt = new Date().toISOString().slice(0, 10);
  const clientHash = await sha256(`${dailySalt}|${forwardedFor}|${userAgent}`);
  async function reserveRequest() {
    const { data, error } = await admin.rpc("reserve_geocode_request", { p_client_hash: clientHash });
    if (error) {
      console.error("geocode reservation failed", error);
      return json(request, { error: "Location search is temporarily unavailable" }, 503);
    }
    if (data === -1) return json(request, { error: "Too many location searches. Try again shortly." }, 429);
    if (Number(data) > 0) {
      return json(request, { error: "Location search is busy. Try again in a moment.", retryAfterMs: data }, 429);
    }
    return null;
  }

  const reservationError = await reserveRequest();
  if (reservationError) return reservationError;

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: {
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.8",
        "Referer": "https://www.vibe-quest.net/",
        "User-Agent": "VibeQuest/1.0 (https://www.vibe-quest.net; hello@vibe-quest.net)",
      },
      signal: AbortSignal.timeout(8000),
    }).catch(() => null);
    let places: Record<string, any>[] = [];
    if (upstream?.ok) {
      const payload = await upstream.json();
      places = provider === "census"
        ? (Array.isArray(payload?.result?.addressMatches) ? payload.result.addressMatches.map(censusMatchToPlace).filter(Boolean) : [])
        : (Array.isArray(payload?.features) ? payload.features.map(photonFeatureToPlace).filter(Boolean)
          .filter((place: Record<string, any>) => place.address?.country_code === "us") : []);
    } else {
      console.error("geocode upstream failed", provider, upstream?.status || "network error");
    }

    if (action === "search" && !sensitive && (!upstream?.ok || places.length === 0)) {
      // A second reservation is required: globally no more than one request a
      // second may reach the public Nominatim service, even under concurrency.
      let fallbackReservationError = await reserveRequest();
      for (let attempt = 0; fallbackReservationError?.status === 429 && attempt < 3; attempt++) {
        const body = await fallbackReservationError.clone().json();
        if (!Number.isFinite(body.retryAfterMs)) break;
        await new Promise((resolve) => setTimeout(resolve, Math.min(1500, body.retryAfterMs + 100)));
        fallbackReservationError = await reserveRequest();
      }
      if (fallbackReservationError) return fallbackReservationError;
      const fallback = await fetch(fallbackUrl, { headers: {
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.8",
        "Referer": "https://www.vibe-quest.net/",
        "User-Agent": "VibeQuest/1.0 (https://www.vibe-quest.net; hello@vibe-quest.net)",
      }, signal: AbortSignal.timeout(8000) });
      if (!fallback.ok) {
        console.error("geocode fallback failed", fallback.status);
        return json(request, { error: "Location search is temporarily unavailable" }, 503);
      }
      const payload = await fallback.json();
      if (!Array.isArray(payload)) return json(request, { error: "Location search is temporarily unavailable" }, 503);
      places = payload;
    } else if (!upstream?.ok) {
      return json(request, { error: "Location search is temporarily unavailable" }, 503);
    }
    const response = action === "search" ? places.slice(0, 8) : (places[0] || {});
    const expiresAt = new Date(Date.now() + (action === "search" ? 7 : 30) * 86400000).toISOString();

    const { error: cacheError } = sensitive ? { error: null } : await admin.from("geocode_cache").upsert({
      cache_key: cacheKey,
      action,
      response,
      created_at: new Date().toISOString(),
      expires_at: expiresAt,
    });
    if (cacheError) console.error("geocode cache write failed", cacheError);

    return json(request, { [responseKey]: response, cached: false });
  } catch (error) {
    console.error("geocode request failed", error);
    return json(request, { error: "Location search is temporarily unavailable" }, 503);
  }
});
