import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.50.0";

const ALLOWED_ORIGINS = new Set([
  "https://vibe-quest.net",
  "https://www.vibe-quest.net",
  "http://127.0.0.1:4173",
  "http://localhost:4173",
]);

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin) ? origin : "https://www.vibe-quest.net",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function json(request: Request, body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request), "Content-Type": "application/json" },
  });
}

async function listObjectPaths(
  admin: ReturnType<typeof createClient>,
  bucket: string,
  prefix: string,
  depth = 0,
): Promise<string[]> {
  if (depth > 5) return [];
  const paths: string[] = [];
  let offset = 0;
  const pageSize = 1000;

  while (true) {
    const { data, error } = await admin.storage.from(bucket).list(prefix, {
      limit: pageSize,
      offset,
      sortBy: { column: "name", order: "asc" },
    });
    if (error) throw error;
    const entries = data || [];
    for (const entry of entries) {
      const path = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.id) paths.push(path);
      else paths.push(...await listObjectPaths(admin, bucket, path, depth + 1));
    }
    if (entries.length < pageSize) break;
    offset += pageSize;
  }

  return paths;
}

async function removeUserObjects(admin: ReturnType<typeof createClient>, userId: string) {
  for (const bucket of ["activity-media", "adventure-media"]) {
    const paths = await listObjectPaths(admin, bucket, userId);
    for (let index = 0; index < paths.length; index += 100) {
      const { error } = await admin.storage.from(bucket).remove(paths.slice(index, index + 100));
      if (error) throw error;
    }
  }
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(request) });
  }
  if (request.method !== "POST") return json(request, { error: "Method not allowed" }, 405);

  const origin = request.headers.get("origin") || "";
  if (origin && !ALLOWED_ORIGINS.has(origin)) return json(request, { error: "Origin not allowed" }, 403);

  const authorization = request.headers.get("Authorization") || "";
  const token = authorization.replace(/^Bearer\s+/i, "");
  if (!token) return json(request, { error: "Authentication required" }, 401);

  const body = await request.json().catch(() => ({}));
  if (body?.confirmation !== "DELETE") return json(request, { error: "Confirmation required" }, 400);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return json(request, { error: "Server configuration unavailable" }, 500);
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: userData, error: userError } = await userClient.auth.getUser(token);
  if (userError || !userData.user) return json(request, { error: "Session expired" }, 401);

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    await removeUserObjects(admin, userData.user.id);
    const { error: deleteError } = await admin.auth.admin.deleteUser(userData.user.id);
    if (deleteError) throw deleteError;
    return json(request, { deleted: true });
  } catch (error) {
    console.error("delete-account failed", error);
    return json(request, { error: "Account deletion failed" }, 500);
  }
});
