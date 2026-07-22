// The publishable key is safe to use in a browser. Never place a secret/service key here.
window.vvSupabase = window.supabase?.createClient(
  "https://wyebrsyiauxgoabzigrg.supabase.co",
  "sb_publishable_6I5XU6xWNs66UnBsEjRViQ_muAuooWJ",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
) || null;
