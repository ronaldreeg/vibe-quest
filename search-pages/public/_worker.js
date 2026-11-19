// Cloudflare Pages advanced-mode Worker. All database requests use the public
// key and anonymous RLS; never use a user token or a Supabase service key here.
const FIELDS = "id,title,description,city,location_name,location_visibility,location_accuracy,type,vibes,price_label,listing_mode,start_date,start_time,recurring_day,recurring_time,status,time_zone,last_confirmed_at,created_at,updated_at";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PAGE_SIZE = 40;
const SITEMAP_BATCH = 1000;
const MAX_SITEMAP_LISTINGS = 49999;

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function origin(value) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new Error("Invalid origin");
  return url.origin;
}

function config(env) {
  const result = {
    publicOrigin: origin(env.PUBLIC_ORIGIN),
    appOrigin: origin(env.APP_ORIGIN),
    supabaseOrigin: origin(env.SUPABASE_URL),
    key: env.SUPABASE_ANON_KEY
  };
  if (!result.key || typeof result.key !== "string" || !result.supabaseOrigin.endsWith(".supabase.co")) throw new Error("Invalid database configuration");
  return result;
}

function dateInZone(timeZone, now) {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: timeZone || "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
    const byType = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
    return `${byType.year}-${byType.month}-${byType.day}`;
  } catch {
    // Do not expose a listing whose time zone cannot be checked.
    return null;
  }
}

function discoverable(row, now = new Date()) {
  if (!row || row.status !== "published" || !UUID.test(String(row.id || ""))) return false;
  if (row.listing_mode === "one-time") {
    const today = dateInZone(row.time_zone, now);
    return Boolean(today && /^\d{4}-\d{2}-\d{2}$/.test(row.start_date || "") && row.start_date >= today);
  }
  if (!["recurring", "anytime"].includes(row.listing_mode)) return false;
  const confirmed = Date.parse(row.last_confirmed_at || row.updated_at || row.created_at || "");
  return Number.isFinite(confirmed) && confirmed >= now.getTime() - 90 * 86400000;
}

async function queryActivities(cfg, { id, offset = 0, limit = PAGE_SIZE } = {}) {
  const endpoint = new URL("/rest/v1/activities", cfg.supabaseOrigin);
  endpoint.searchParams.set("select", FIELDS);
  endpoint.searchParams.set("status", "eq.published");
  endpoint.searchParams.set("order", "created_at.desc,id.asc");
  endpoint.searchParams.set("offset", String(offset));
  endpoint.searchParams.set("limit", String(limit));
  if (id) endpoint.searchParams.set("id", `eq.${id}`);
  const response = await fetch(endpoint, {
    headers: { apikey: cfg.key, Accept: "application/json" },
    signal: AbortSignal.timeout(10000)
  });
  if (!response.ok) throw new Error(`Database returned ${response.status}`);
  const rows = await response.json();
  if (!Array.isArray(rows)) throw new Error("Unexpected database response");
  return { rawCount: rows.length, rows: rows.filter((row) => discoverable(row)) };
}

function activityUrl(cfg, id) { return `${cfg.publicOrigin}/activities/${id}`; }
function mapUrl(cfg, id) { return `${cfg.appOrigin}/?activity=${encodeURIComponent(id)}`; }
function when(row) {
  const clock = (value) => {
    const match = /^(\d{2}):(\d{2})/.exec(value || "");
    if (!match || Number(match[1]) > 23 || Number(match[2]) > 59) return "";
    const hour = Number(match[1]);
    return `${hour % 12 || 12}:${match[2]} ${hour < 12 ? "AM" : "PM"}`;
  };
  if (row.listing_mode === "one-time") {
    const date = new Date(`${row.start_date}T12:00:00Z`);
    const formatted = Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat("en-US", { timeZone: "UTC", dateStyle: "long" }).format(date) : row.start_date;
    return [formatted, clock(row.start_time)].filter(Boolean).join(" at ");
  }
  if (row.listing_mode === "recurring") {
    const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][row.recurring_day];
    return day ? [`Every ${day}`, clock(row.recurring_time)].filter(Boolean).join(" at ") : "Recurring";
  }
  return "Available anytime";
}

function layout({ title, description, canonical, content, noindex = false }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><meta property="og:type" content="website"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(description)}">${canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}"><meta property="og:url" content="${escapeHtml(canonical)}">` : ""}${noindex ? '<meta name="robots" content="noindex">' : ""}<style>body{margin:0;background:#242522;color:#f7f1e5;font:16px/1.6 system-ui,sans-serif}header,main,footer{max-width:850px;margin:auto;padding:24px}header{border-bottom:1px solid #626459;display:flex;justify-content:space-between;gap:16px;align-items:center}header img{display:block;width:170px;max-width:42vw;height:auto}a{color:#9edbd2}header a{font-weight:800;text-decoration:none}h1{font-size:clamp(2rem,6vw,3.5rem);line-height:1.08}h2{line-height:1.2}p{white-space:pre-wrap}.label{color:#eccd82;font-weight:700}.card{background:#343632;border-radius:16px;padding:22px;margin:16px 0}.card a{font-size:1.2rem;font-weight:700}.button{display:inline-block;background:#eecb78;color:#242522;padding:12px 18px;border-radius:10px;font-weight:700;text-decoration:none}.muted{color:#d1cbbd}footer{font-size:.9rem}</style></head><body><header><a href="https://www.vibe-quest.net/"><img src="https://www.vibe-quest.net/assets/brand/vibe-quest-sept23.svg" alt="Vibe Quest home" width="170"></a><a href="/">Discover activities</a></header><main>${content}</main><footer>Find your next real-world adventure on <a href="https://www.vibe-quest.net/">Vibe Quest</a>.</footer></body></html>`;
}

function listingPage(row, cfg) {
  const title = `${row.title} in ${row.city} | Vibe Quest`;
  const url = activityUrl(cfg, row.id);
  const location = row.location_visibility === "private" ? `${row.city} area · Exact meetup details are private` : row.location_accuracy === "approximate" ? `${row.location_name} · Approximate area` : row.location_name;
  // The current schema doesn't guarantee a verified street address or an
  // approved cover image. Do not assert rich-event eligibility or use a photo.
  const content = `<p class="label">${escapeHtml(row.type || "Activity")} · ${escapeHtml(row.city)}</p><h1>${escapeHtml(row.title)}</h1><p>${escapeHtml(row.description)}</p><div class="card"><p><strong>When:</strong> ${escapeHtml(when(row))}</p><p><strong>Where:</strong> ${escapeHtml(location)}</p>${row.price_label ? `<p><strong>Price:</strong> ${escapeHtml(row.price_label)}</p>` : ""}${Array.isArray(row.vibes) && row.vibes.length ? `<p><strong>Vibes:</strong> ${escapeHtml(row.vibes.join(", "))}</p>` : ""}</div><p><a class="button" href="${escapeHtml(mapUrl(cfg, row.id))}">Open this activity on the map</a></p>`;
  return layout({ title, description: String(row.description || "").slice(0, 160), canonical: url, content });
}

function directoryPage(rows, cfg, page, hasNext) {
  const cards = rows.map((row) => `<article class="card"><a href="${escapeHtml(activityUrl(cfg, row.id))}">${escapeHtml(row.title)}</a><p class="muted">${escapeHtml(row.city)} · ${escapeHtml(when(row))}</p><p>${escapeHtml(row.description)}</p></article>`).join("");
  const navigation = `${page > 1 ? `<a href="${page === 2 ? "/" : `/?page=${page - 1}`}">Previous activities</a> ` : ""}${hasNext ? `<a href="/?page=${page + 1}">More activities</a>` : ""}`;
  return layout({ title: "Discover local activities and pop-ups | Vibe Quest", description: "Find local activities, pop-ups, workshops, and adventures on Vibe Quest.", canonical: `${cfg.publicOrigin}/${page > 1 ? `?page=${page}` : ""}`, content: `<p class="label">VIBE QUEST</p><h1>Find your next adventure.</h1><p>Explore real-world activities, local pop-ups, and creative things to do.</p><p><a class="button" href="${escapeHtml(cfg.appOrigin)}/">Explore the map</a></p>${cards || '<p>No activities are available right now. Check the map for ideas.</p>'}<nav>${navigation}</nav>` });
}

const commonHeaders = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin", "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; img-src https:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'" };
function response(body, status = 200, type = "text/html; charset=utf-8", extra = {}) {
  return new Response(body, { status, headers: { ...commonHeaders, "Content-Type": type, ...extra } });
}
function missing() {
  return response(layout({ title: "Activity unavailable | Vibe Quest", description: "This activity is no longer available.", content: '<h1>Activity unavailable</h1><p>This activity may have ended or been removed.</p><p><a href="/">Explore current activities</a></p>', noindex: true }), 404, undefined, { "X-Robots-Tag": "noindex" });
}

async function handle(request, env) {
  if (!["GET", "HEAD"].includes(request.method)) return response("Method not allowed", 405, "text/plain; charset=utf-8", { Allow: "GET, HEAD" });
  let result;
  try {
    const cfg = config(env);
    const url = new URL(request.url);
    if (url.pathname === "/robots.txt") {
      result = response(`User-agent: *\nAllow: /\nSitemap: ${cfg.publicOrigin}/sitemap.xml\n`, 200, "text/plain; charset=utf-8");
    } else if (url.pathname === "/sitemap.xml") {
      const all = [];
      let offset = 0;
      while (true) {
        const batch = await queryActivities(cfg, { offset, limit: SITEMAP_BATCH });
        all.push(...batch.rows);
        if (all.length > MAX_SITEMAP_LISTINGS) throw new Error("Sitemap capacity exceeded");
        if (batch.rawCount < SITEMAP_BATCH) break;
        offset += SITEMAP_BATCH;
        if (offset > MAX_SITEMAP_LISTINGS + SITEMAP_BATCH) throw new Error("Sitemap capacity exceeded");
      }
      const entries = [`<url><loc>${escapeHtml(`${cfg.publicOrigin}/`)}</loc></url>`, ...all.map((row) => `<url><loc>${escapeHtml(activityUrl(cfg, row.id))}</loc>${row.updated_at && !Number.isNaN(Date.parse(row.updated_at)) ? `<lastmod>${escapeHtml(new Date(row.updated_at).toISOString())}</lastmod>` : ""}</url>`)];
      result = response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join("")}</urlset>`, 200, "application/xml; charset=utf-8");
    } else if (url.pathname === "/") {
      const pageParam = url.searchParams.get("page") || "1";
      const page = /^\d+$/.test(pageParam) ? Number(pageParam) : 0;
      if (!Number.isSafeInteger(page) || page < 1 || page > 1000) result = missing();
      else {
        const batch = await queryActivities(cfg, { offset: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE + 1 });
        result = response(directoryPage(batch.rows.slice(0, PAGE_SIZE), cfg, page, batch.rawCount > PAGE_SIZE));
      }
    } else {
      const match = /^\/activities\/([^/]+)\/?$/.exec(url.pathname);
      if (!match || !UUID.test(match[1])) result = missing();
      else {
        const batch = await queryActivities(cfg, { id: match[1], limit: 1 });
        result = batch.rows.length ? response(listingPage(batch.rows[0], cfg)) : missing();
      }
    }
  } catch (error) {
    console.error("Discovery service error", error instanceof Error ? error.message : "unknown error");
    result = response("Discovery is temporarily unavailable. Please try again shortly.", 503, "text/plain; charset=utf-8", { "Retry-After": "60" });
  }
  return request.method === "HEAD" ? new Response(null, { status: result.status, headers: result.headers }) : result;
}

export default { fetch: handle };
