const LISTING_TYPES = [
  "Pop-ups & Events",
  "Classes",
  "Tours & Culture",
  "Markets",
  "Food & Drink",
  "Groups",
  "Arts & Music",
  "Outdoors",
  "Wellness",
  "Nightlife",
  "Random"
];

const VIBE_FILTERS = [
  "Free",
  "Low-key",
  "Lively",
  "Social",
  "Creative",
  "Active",
  "Curious",
  "Offbeat",
  "Local Lore",
  "Date-worthy",
  "Solo-friendly",
  "Play"
];

const LISTING_MODES = ["one-time", "recurring", "anytime"];
const MAX_UPLOAD_MEGABYTES = 40;
const MAX_UPLOAD_BYTES = MAX_UPLOAD_MEGABYTES * 1024 * 1024;
const MAX_STORED_PHOTO_BYTES = 1400000;

const DEMO_SCHEDULES = {
  "sunset-paddle": { listingMode: "one-time", dayOffset: 0, startTime: "18:30" },
  "secret-supper": { listingMode: "one-time", dayOffset: 1, startTime: "19:00" },
  "neon-sketch": { listingMode: "one-time", dayOffset: 2, startTime: "17:30" },
  "coffee-soft-launch": { listingMode: "one-time", dayOffset: 0, startTime: "09:00" },
  "dockside-dance": { listingMode: "one-time", dayOffset: 3, startTime: "19:30" },
  "night-ride": { listingMode: "anytime" },
  "market-morning": { listingMode: "anytime" },
  "silent-book-hour": { listingMode: "recurring", weekdayOffset: 3, startTime: "18:00" },
  "porch-sale-trail": { listingMode: "one-time", dayOffset: 0, startTime: "08:00" },
  "storm-stories-walk": { listingMode: "recurring", weekdayOffset: 1, startTime: "10:00" },
  "dumpling-class": { listingMode: "one-time", dayOffset: 5, startTime: "18:30" },
  "sunrise-run-club": { listingMode: "recurring", weekdayOffset: 0, startTime: "06:30" }
};

const TYPE_STYLE = {
  "Pop-ups & Events": ["#6ee7c8", "#7c5cff"],
  Classes: ["#59a8ff", "#6ee7c8"],
  "Tours & Culture": ["#f6c85f", "#ff7a59"],
  Markets: ["#34d399", "#f6c85f"],
  "Food & Drink": ["#f6c85f", "#ff6b7a"],
  Groups: ["#ff7a59", "#7c5cff"],
  "Arts & Music": ["#b77cff", "#59a8ff"],
  Outdoors: ["#34d399", "#59a8ff"],
  Wellness: ["#6ee7c8", "#34d399"],
  Nightlife: ["#ff6b7a", "#7c5cff"],
  Random: ["#8b8277", "#5f6967"]
};

const MARKER_STYLE = {
  "Pop-ups & Events": "#3f6b64",
  Classes: "#49677f",
  "Tours & Culture": "#9a723b",
  Markets: "#617744",
  "Food & Drink": "#9a5e52",
  Groups: "#6b5876",
  "Arts & Music": "#725e8a",
  Outdoors: "#3f6950",
  Wellness: "#4f7777",
  Nightlife: "#684c5b",
  Random: "#70675e"
};

const LEGACY_TYPE_MAP = {
  Chill: "Wellness",
  Thrill: "Outdoors",
  Foodie: "Food & Drink",
  Artsy: "Arts & Music",
  Social: "Groups",
  Nature: "Outdoors",
  "Markets & Sales": "Markets"
};

const LEGACY_VIBE_MAP = {
  Chill: ["Low-key"],
  Thrill: ["Active"],
  Foodie: ["Local Lore"],
  Artsy: ["Creative"],
  Social: ["Social"],
  Nature: ["Active", "Local Lore"]
};

const LEGACY_VIBE_LABEL_MAP = {
  "Date Night": "Date-worthy",
  "Date-worthy": "Date-worthy",
  "Solo-friendly": "Solo-friendly",
  "Local Flavor": "Local Lore"
};

const CITY_CENTERS = {
  galveston: [29.3013, -94.7977],
  "galveston, tx": [29.3013, -94.7977],
  houston: [29.7604, -95.3698],
  "houston, tx": [29.7604, -95.3698],
  austin: [30.2672, -97.7431],
  "austin, tx": [30.2672, -97.7431]
};

const DEFAULT_ADVENTURES = [
  {
    id: "sunset-paddle",
    title: "Sunset Paddle Meet-up",
    city: "Galveston, TX",
    area: "East End Lagoon",
    category: "Outdoors",
    type: "Outdoors",
    vibes: ["Active", "Social", "Local Lore"],
    price: "$42",
    seats: 6,
    distance: 2.4,
    lat: 29.3247406,
    lng: -94.7540168,
    photo: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    host: "Bay Current Guides",
    description: "Easygoing water time with a small group, golden-hour views, and a simple post-paddle snack stop.",
    links: [
      { label: "Website", url: "https://example.com/bay-current-guides" },
      { label: "Reserve", url: "https://example.com/bay-current-guides/sunset-paddle" }
    ],
    x: 74,
    y: 28
  },
  {
    id: "secret-supper",
    title: "Back Patio Secret Supper",
    city: "Galveston, TX",
    area: "The Strand",
    category: "Food & Drink",
    type: "Food & Drink",
    vibes: ["Local Lore", "Social", "Date-worthy"],
    price: "$58",
    seats: 10,
    distance: 1.1,
    lat: 29.3069,
    lng: -94.7932,
    photo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    host: "Mina's Table",
    description: "A compact tasting menu built around Gulf flavors, shared tables, and an after-dinner walk route.",
    links: [
      { label: "Website", url: "https://example.com/minas-table" },
      { label: "Sign up", url: "https://example.com/minas-table/secret-supper" }
    ],
    x: 48,
    y: 54
  },
  {
    id: "neon-sketch",
    title: "Neon Sketch Crawl",
    city: "Galveston, TX",
    area: "Downtown",
    category: "Arts & Music",
    type: "Arts & Music",
    vibes: ["Creative", "Offbeat", "Curious"],
    price: "$24",
    seats: 12,
    distance: 1.7,
    lat: 29.3035,
    lng: -94.7975,
    photo: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80",
    host: "Local Lines Studio",
    description: "Bring a pencil, visit three bright corners of the city, and leave with a mini field journal.",
    links: [
      { label: "Studio page", url: "https://example.com/local-lines" },
      { label: "Instagram", url: "https://example.com/local-lines/social" }
    ],
    x: 42,
    y: 39
  },
  {
    id: "coffee-soft-launch",
    title: "Coffee Shop Soft Launch",
    city: "Galveston, TX",
    area: "Postoffice District",
    category: "Pop-ups & Events",
    type: "Pop-ups & Events",
    vibes: ["Low-key", "Local Lore", "Solo-friendly"],
    price: "Free",
    seats: 18,
    distance: 0.8,
    lat: 29.305,
    lng: -94.7921,
    photo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    host: "Third Light Coffee",
    description: "Low-pressure tasting flight, playlist voting, and a first look at a neighborhood coffee bar.",
    links: [
      { label: "Instagram", url: "https://example.com/third-light/social" },
      { label: "Menu", url: "https://example.com/third-light/menu" }
    ],
    x: 36,
    y: 62
  },
  {
    id: "dockside-dance",
    title: "Dockside Dance Hour",
    city: "Galveston, TX",
    area: "Pier 21",
    category: "Nightlife",
    type: "Nightlife",
    vibes: ["Social", "Lively", "Date-worthy"],
    price: "$18",
    seats: 20,
    distance: 1.9,
    lat: 29.3095,
    lng: -94.79,
    photo: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
    host: "Harbor Social Club",
    description: "Beginner-friendly salsa basics on the pier with a casual group walk to live music afterward.",
    links: [
      { label: "Event page", url: "https://example.com/harbor-social/dance" },
      { label: "Tickets", url: "https://example.com/harbor-social/tickets" }
    ],
    x: 55,
    y: 24
  },
  {
    id: "night-ride",
    title: "Seawall Night Ride",
    city: "Galveston, TX",
    area: "Seawall",
    category: "Outdoors",
    type: "Outdoors",
    vibes: ["Active", "Offbeat", "Play"],
    price: "$31",
    seats: 8,
    distance: 3.5,
    lat: 29.2722,
    lng: -94.8171,
    photo: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80",
    host: "Island Wheel Co.",
    description: "A guided electric bike loop with ocean air, glow lights, and a few photo stops along the way.",
    links: [
      { label: "Website", url: "https://example.com/island-wheel" },
      { label: "Book ride", url: "https://example.com/island-wheel/night-ride" }
    ],
    x: 67,
    y: 72
  },
  {
    id: "market-morning",
    title: "Market Morning Loop",
    city: "Houston, TX",
    area: "Heights",
    category: "Markets",
    type: "Markets",
    vibes: ["Local Lore", "Low-key", "Solo-friendly"],
    price: "$16",
    seats: 14,
    distance: 52,
    lat: 29.8024,
    lng: -95.3988,
    photo: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80",
    host: "Northside Tastemakers",
    description: "A flexible weekend route through coffee, flowers, baked goods, and two tiny hidden shops.",
    links: [
      { label: "Route map", url: "https://example.com/northside-tastemakers/market-loop" },
      { label: "Instagram", url: "https://example.com/northside-tastemakers/social" }
    ],
    x: 22,
    y: 31
  },
  {
    id: "silent-book-hour",
    title: "Silent Book Hour",
    city: "Austin, TX",
    area: "East Austin",
    category: "Groups",
    type: "Groups",
    vibes: ["Low-key", "Curious", "Solo-friendly"],
    price: "$8",
    seats: 16,
    distance: 210,
    lat: 30.2626,
    lng: -97.7145,
    photo: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1200&q=80",
    host: "Paper Lantern",
    description: "A cozy no-pressure reading hour with tea, optional intros, and a tiny take-home recommendation card.",
    links: [
      { label: "Meetup page", url: "https://example.com/paper-lantern/book-hour" },
      { label: "Book list", url: "https://example.com/paper-lantern/recs" }
    ],
    x: 25,
    y: 68
  },
  {
    id: "porch-sale-trail",
    title: "East End Porch Sale Trail",
    city: "Galveston, TX",
    area: "East End Historic District",
    category: "Markets",
    type: "Markets",
    vibes: ["Local Lore", "Offbeat", "Low-key"],
    price: "Free",
    seats: 40,
    distance: 1.4,
    lat: 29.3048,
    lng: -94.7749,
    photo: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&w=1200&q=80",
    host: "East End Neighbors",
    description: "A casual garage-sale route with porch tables, vintage finds, lemonade stands, and handwritten maps.",
    links: [
      { label: "Map", url: "https://example.com/east-end/porch-sale-map" },
      { label: "Facebook event", url: "https://example.com/east-end/porch-sale-social" }
    ],
    x: 60,
    y: 46
  },
  {
    id: "storm-stories-walk",
    title: "Storm Stories Walking Tour",
    city: "Galveston, TX",
    area: "Historic Strand",
    category: "Tours & Culture",
    type: "Tours & Culture",
    vibes: ["Curious", "Local Lore", "Solo-friendly"],
    price: "$22",
    seats: 14,
    distance: 0.9,
    lat: 29.3061,
    lng: -94.7967,
    photo: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    host: "Island History Walks",
    description: "A local guide connects architecture, legends, hurricanes, and a few overlooked corners downtown.",
    links: [
      { label: "Tour page", url: "https://example.com/island-history/storm-stories" },
      { label: "Tickets", url: "https://example.com/island-history/tickets" }
    ],
    x: 45,
    y: 44
  },
  {
    id: "dumpling-class",
    title: "Island Dumpling Class",
    city: "Galveston, TX",
    area: "Midtown",
    category: "Classes",
    type: "Classes",
    vibes: ["Creative", "Social"],
    price: "$35",
    seats: 10,
    distance: 2.1,
    lat: 29.2879,
    lng: -94.8064,
    photo: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80",
    host: "Kitchen Table Club",
    description: "Hands-on folding, sauces, and a shared table at the end. Beginners very welcome.",
    links: [
      { label: "Class page", url: "https://example.com/kitchen-table/dumpling-class" },
      { label: "Sign up", url: "https://example.com/kitchen-table/register" }
    ],
    x: 52,
    y: 69
  },
  {
    id: "sunrise-run-club",
    title: "Seawall Sunrise Run Club",
    city: "Galveston, TX",
    area: "39th Street Seawall",
    category: "Groups",
    type: "Groups",
    vibes: ["Active", "Social", "Play"],
    price: "Free",
    seats: 30,
    distance: 2.8,
    lat: 29.2728,
    lng: -94.8124,
    photo: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1200&q=80",
    host: "Island Miles",
    description: "A no-drop morning run with pace groups, coffee after, and an easy way to meet active locals.",
    links: [
      { label: "Run club page", url: "https://example.com/island-miles" },
      { label: "Instagram", url: "https://example.com/island-miles/social" }
    ],
    x: 63,
    y: 75
  }
];

const store = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }
};

const state = {
  view: "discover",
  authMode: "signin",
  activeTiming: "all",
  activeType: "All",
  activeVibe: "All",
  location: "",
  mapCenter: CITY_CENTERS.galveston,
  mapNeedsFit: true,
  session: store.get("vv_session", null),
  authBusy: false,
  editingAdventureId: null,
  pendingDeleteId: null,
  outThereSlideIndex: 0,
  backendEnabled: Boolean(window.vvSupabase),
  remoteUser: null,
  remoteActivities: [],
  remoteSavedIds: []
};

const els = {
  navTabs: document.querySelectorAll(".nav-tab"),
  locationInput: document.querySelector("#locationInput"),
  timingFilters: document.querySelector("#timingFilters"),
  typeFilters: document.querySelector("#typeFilters"),
  vibeFilters: document.querySelector("#vibeFilters"),
  adventureGrid: document.querySelector("#adventureGrid"),
  savedGrid: document.querySelector("#savedGrid"),
  realMap: document.querySelector("#realMap"),
  legendCount: document.querySelector("#legendCount"),
  resultsMeta: document.querySelector("#resultsMeta"),
  resultsTitle: document.querySelector("#resultsTitle"),
  savedView: document.querySelector("#savedView"),
  outThereView: document.querySelector("#outThereView"),
  outThereSlideCount: document.querySelector("#outThereSlideCount"),
  hostView: document.querySelector("#hostView"),
  profilePill: document.querySelector(".profile-pill"),
  authModal: document.querySelector("#authModal"),
  authForm: document.querySelector("#authForm"),
  authTitle: document.querySelector("#authTitle"),
  authModeLabel: document.querySelector("#authModeLabel"),
  authSubmit: document.querySelector("#authSubmit"),
  authMessage: document.querySelector("#authMessage"),
  profileModal: document.querySelector("#profileModal"),
  profileForm: document.querySelector("#profileForm"),
  profileSavedList: document.querySelector("#profileSavedList"),
  profileHostedList: document.querySelector("#profileHostedList"),
  detailModal: document.querySelector("#detailModal"),
  detailContent: document.querySelector("#detailContent"),
  deleteModal: document.querySelector("#deleteModal"),
  deletePostTitle: document.querySelector("#deletePostTitle"),
  hostForm: document.querySelector("#hostForm"),
  shareAuthPrompt: document.querySelector("#shareAuthPrompt"),
  hostModeLabel: document.querySelector("#hostModeLabel"),
  hostFormTitle: document.querySelector("#hostFormTitle"),
  hostFormCopy: document.querySelector("#hostFormCopy"),
  hostSubmitButton: document.querySelector("#hostSubmitButton"),
  cancelEditButton: document.querySelector("#cancelEditButton"),
  locationFeedback: document.querySelector("#locationFeedback"),
  toast: document.querySelector("#toast")
};

function getUsers() {
  const users = store.get("vv_users", []);
  return Array.isArray(users) ? users : [];
}

function setUsers(users) {
  return store.set("vv_users", users);
}

function getCurrentUser() {
  if (state.backendEnabled) return state.remoteUser;
  if (!state.session) return null;
  return getUsers().find((user) => user.id === state.session.userId) || null;
}

function hashString(value) {
  return String(value || "").split("").reduce((hash, char) => hash + char.charCodeAt(0), 0);
}

function createId(prefix = "id") {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ""));
}

function isPlaceholderArea(value) {
  return ["host submitted", "shared locally"].includes(normalize(value));
}

function looksLikeStreetAddress(value) {
  return /\d/.test(String(value || ""));
}

function normalizeAdventureRecord(adventure, index, users = getUsers()) {
  const owner = adventure.createdBy
    ? users.find((user) => user.id === adventure.createdBy)
    : null;
  const normalizedAdventure = isPlaceholderArea(adventure.area) && adventure.city
    ? {
        ...adventure,
        area: adventure.locationQuery
          || (looksLikeStreetAddress(adventure.city) ? adventure.city : "Location shared by host"),
        city: owner?.city || adventure.city
      }
    : adventure;
  if (Number.isFinite(normalizedAdventure.lat) && Number.isFinite(normalizedAdventure.lng)) {
    return normalizedAdventure;
  }
  const center = knownCenterForLocation(normalizedAdventure.city) || CITY_CENTERS.galveston;
  const hash = hashString(normalizedAdventure.id || normalizedAdventure.title || index);
  return {
    ...normalizedAdventure,
    lat: center[0] + ((hash % 17) - 8) * 0.0022,
    lng: center[1] + (((hash / 17) % 17) - 8) * 0.0022
  };
}

function getAdventures() {
  if (state.backendEnabled) {
    return [...DEFAULT_ADVENTURES, ...state.remoteActivities].map((adventure, index) => normalizeAdventureRecord(adventure, index));
  }
  const userAdventures = store.get("vv_adventures", []);
  const hosted = Array.isArray(userAdventures) ? userAdventures : [];
  const users = getUsers();
  return [...DEFAULT_ADVENTURES, ...hosted].map((adventure, index) => normalizeAdventureRecord(adventure, index, users));
}

function getSavedIds() {
  if (state.backendEnabled) return state.remoteSavedIds;
  const user = getCurrentUser();
  if (!user) return [];
  const storedSaves = store.get("vv_saves", {});
  const saves = storedSaves && typeof storedSaves === "object" && !Array.isArray(storedSaves) ? storedSaves : {};
  return Array.isArray(saves[user.id]) ? saves[user.id] : [];
}

function setSavedIds(ids) {
  if (state.backendEnabled) {
    state.remoteSavedIds = ids;
    return true;
  }
  const user = getCurrentUser();
  if (!user) return false;
  const storedSaves = store.get("vv_saves", {});
  const saves = storedSaves && typeof storedSaves === "object" && !Array.isArray(storedSaves) ? storedSaves : {};
  saves[user.id] = ids;
  return store.set("vv_saves", saves);
}

function publicActivityPhoto(path) {
  if (!path || !window.vvSupabase) return "";
  return window.vvSupabase.storage.from("activity-media").getPublicUrl(path).data.publicUrl || "";
}

function normalizeDatabaseTime(value) {
  const normalized = String(value || "");
  return normalized.match(/^\d{1,2}:\d{2}/)?.[0] || "";
}

function mapRemoteActivity(row, linkRows, profileMap) {
  const links = linkRows
    .filter((link) => link.activity_id === row.id)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((link) => ({ label: link.label, url: link.url }));
  const host = profileMap.get(row.owner_id)?.display_name || "Vibe Explorer";
  return {
    id: row.id,
    title: row.title,
    city: row.city,
    area: row.location_name,
    locationQuery: row.location_query || row.location_name,
    locationAccuracy: row.location_accuracy,
    geocodeLabel: row.location_name,
    category: row.type,
    type: row.type,
    vibes: Array.isArray(row.vibes) ? row.vibes : [],
    price: row.price_label || "Free",
    seats: 12,
    distance: 1.5,
    lat: Number(row.latitude),
    lng: Number(row.longitude),
    photo: publicActivityPhoto(row.cover_photo_path),
    photoPath: row.cover_photo_path || "",
    host,
    description: row.description,
    links,
    listingMode: row.listing_mode,
    startDate: row.start_date || "",
    startTime: normalizeDatabaseTime(row.start_time),
    recurringDay: row.recurring_day,
    recurringTime: normalizeDatabaseTime(row.recurring_time),
    createdBy: row.owner_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function loadRemoteActivities() {
  if (!state.backendEnabled) return;
  const { data: rows, error } = await window.vvSupabase
    .from("activities")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;

  const activities = Array.isArray(rows) ? rows : [];
  const ids = activities.map((row) => row.id);
  const [linksResult, profilesResult] = await Promise.all([
    ids.length
      ? window.vvSupabase.from("activity_links").select("*").in("activity_id", ids)
      : Promise.resolve({ data: [], error: null }),
    window.vvSupabase.from("profiles").select("id, display_name")
  ]);
  if (linksResult.error) throw linksResult.error;
  if (profilesResult.error) throw profilesResult.error;
  const profileMap = new Map((profilesResult.data || []).map((profile) => [profile.id, profile]));
  state.remoteActivities = activities.map((row) => mapRemoteActivity(row, linksResult.data || [], profileMap));
}

async function loadRemoteSavedIds() {
  const user = getCurrentUser();
  if (!state.backendEnabled || !user) {
    state.remoteSavedIds = [];
    return;
  }
  const { data, error } = await window.vvSupabase
    .from("saved_activities")
    .select("activity_id")
    .eq("user_id", user.id);
  if (error) throw error;
  const demoSaves = store.get("vv_demo_saves", {});
  const localDemoIds = Array.isArray(demoSaves?.[user.id]) ? demoSaves[user.id] : [];
  state.remoteSavedIds = [...new Set([...(data || []).map((item) => item.activity_id), ...localDemoIds])];
}

async function syncRemoteSession(session) {
  state.remoteUser = null;
  if (!session?.user) {
    state.remoteSavedIds = [];
    render();
    return;
  }
  const authUser = session.user;
  const { data: profile, error } = await window.vvSupabase
    .from("profiles")
    .select("id, display_name, city, bio, avatar_path, created_at")
    .eq("id", authUser.id)
    .maybeSingle();
  if (error) throw error;
  state.remoteUser = {
    id: authUser.id,
    name: profile?.display_name || authUser.user_metadata?.name || "Vibe Explorer",
    email: authUser.email || "",
    city: profile?.city || authUser.user_metadata?.city || "",
    bio: profile?.bio || "",
    avatarPath: profile?.avatar_path || "",
    createdAt: profile?.created_at || authUser.created_at
  };
  state.location = state.remoteUser.city || state.location;
  state.mapCenter = knownCenterForLocation(state.location) || state.mapCenter;
  els.locationInput.value = state.location;
  await loadRemoteSavedIds();
  render();
}

async function bootstrapSupabase() {
  if (!state.backendEnabled) return false;
  try {
    const { data, error } = await window.vvSupabase.auth.getSession();
    if (error) throw error;
    await loadRemoteActivities();
    await syncRemoteSession(data.session);
    window.vvSupabase.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => syncRemoteSession(session).catch(() => {
        toast("Your account session needs a refresh. Please sign in again.");
      }), 0);
    });
    return true;
  } catch {
    state.remoteActivities = [];
    toast("The discovery backend is waking up. Demo listings are still available.");
    return false;
  }
}

async function legacyHashPassword(value) {
  const encoded = new TextEncoder().encode(`vibeventure-demo:${value}`);
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(value, salt) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(String(value || "")),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const buffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode(String(salt || "vibeventure-demo")),
      iterations: 120000,
      hash: "SHA-256"
    },
    key,
    256
  );
  return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function listingRank(adventure) {
  const schedule = getListingSchedule(adventure);
  if (schedule.occurrence) {
    return schedule.occurrence.getTime();
  }
  const hostedBoost = adventure.createdAt ? -2 : 0;
  return Number.MAX_SAFE_INTEGER - 1000 + Number(adventure.distance || 999) + hostedBoost;
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function parseLocalDate(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (Number.isNaN(date.getTime())) return null;
  return date.getFullYear() === Number(match[1])
    && date.getMonth() === Number(match[2]) - 1
    && date.getDate() === Number(match[3])
    ? date
    : null;
}

function formatInputDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatClock(value) {
  const match = String(value || "").match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return "";
  const date = new Date();
  date.setHours(Number(match[1]), Number(match[2]), 0, 0);
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(date);
}

function applyTime(date, value) {
  const match = String(value || "").match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return date;
  date.setHours(Number(match[1]), Number(match[2]), 0, 0);
  return date;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function getListingSchedule(adventure) {
  const demo = DEMO_SCHEDULES[adventure.id] || {};
  const listingMode = adventure.listingMode || demo.listingMode || "anytime";
  const today = startOfToday();

  if (listingMode === "anytime") {
    return { listingMode, bucket: "anytime", occurrence: null, time: "" };
  }

  if (listingMode === "one-time") {
    const date = parseLocalDate(adventure.startDate)
      || (Number.isFinite(demo.dayOffset) ? addDays(today, demo.dayOffset) : null);
    if (!date) return { listingMode, bucket: "expired", occurrence: null, time: adventure.startTime || demo.startTime || "" };
    const delta = Math.round((date.getTime() - today.getTime()) / 86400000);
    const time = adventure.startTime || demo.startTime || "";
    return {
      listingMode,
      bucket: delta === 0 ? "today" : delta > 0 ? "coming-up" : "expired",
      occurrence: applyTime(date, time),
      time
    };
  }

  const storedDay = Number(adventure.recurringDay);
  const weekday = Number.isInteger(storedDay) && storedDay >= 0 && storedDay <= 6
    ? storedDay
    : (today.getDay() + Number(demo.weekdayOffset || 0)) % 7;
  const daysAhead = (weekday - today.getDay() + 7) % 7;
  const time = adventure.recurringTime || demo.startTime || "";
  return {
    listingMode: "recurring",
    bucket: daysAhead === 0 ? "today" : "coming-up",
    occurrence: applyTime(addDays(today, daysAhead), time),
    weekday,
    time
  };
}

function timingLabel(adventure, full = false) {
  const schedule = getListingSchedule(adventure);
  const time = formatClock(schedule.time);
  if (schedule.listingMode === "anytime") return "Available anytime";
  if (!schedule.occurrence) return "Date unavailable";

  if (schedule.listingMode === "recurring" && full) {
    const weekday = new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(schedule.occurrence);
    return `Every ${weekday}${time ? ` · ${time}` : ""}`;
  }
  if (schedule.bucket === "today") return `Today${time ? ` · ${time}` : ""}`;

  const tomorrow = addDays(startOfToday(), 1);
  const dateLabel = isSameDay(schedule.occurrence, tomorrow)
    ? "Tomorrow"
    : new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(schedule.occurrence);
  return `${dateLabel}${time ? ` · ${time}` : ""}`;
}

function getListingType(adventure) {
  const raw = String(adventure.type || adventure.category || "").trim();
  if (!raw) return "Pop-ups & Events";
  if (LISTING_TYPES.includes(raw)) return raw;
  return LEGACY_TYPE_MAP[raw] || "Pop-ups & Events";
}

function isFreeListing(adventure) {
  return normalize(adventure.price).includes("free");
}

function getListingVibes(adventure) {
  const stored = Array.isArray(adventure.vibes) ? adventure.vibes : [];
  const legacy = LEGACY_VIBE_MAP[String(adventure.category || "").trim()] || [];
  const migrated = [
    ...stored.map((value) => LEGACY_VIBE_LABEL_MAP[value] || value),
    ...(Array.isArray(adventure.goodFor)
      ? adventure.goodFor.map((value) => LEGACY_VIBE_LABEL_MAP[value]).filter(Boolean)
      : [])
  ];
  const price = isFreeListing(adventure) ? ["Free"] : [];
  return [...new Set([...price, ...migrated, ...legacy])].filter((vibe) => VIBE_FILTERS.includes(vibe));
}

function filteredAdventures() {
  const location = normalize(state.location);
  return getAdventures()
    .filter((adventure) => {
      const bucket = getListingSchedule(adventure).bucket;
      return state.activeTiming === "all" ? bucket !== "expired" : bucket === state.activeTiming;
    })
    .filter((adventure) => state.activeType === "All" || getListingType(adventure) === state.activeType)
    .filter((adventure) => state.activeVibe === "All" || getListingVibes(adventure).includes(state.activeVibe))
    .filter((adventure) => {
      if (!location) return true;
      return normalize(adventure.city).includes(location) || normalize(adventure.area).includes(location);
    })
    .sort((a, b) => listingRank(a) - listingRank(b));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeImageSrc(src) {
  const value = String(src || "").trim();
  if (!value) return "";
  if (value.startsWith("data:image/")) return value;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function safeExternalUrl(src) {
  const rawValue = String(src || "").trim();
  if (!rawValue) return "";
  const value = /^@[a-z\d._-]+$/i.test(rawValue)
    ? `https://instagram.com/${rawValue.slice(1)}`
    : rawValue;
  if (/^[a-z][a-z\d+.-]*:/i.test(value) && !/^https?:\/\//i.test(value)) return "";
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withProtocol);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function getAdventureLinks(adventure) {
  const candidates = [
    ...(Array.isArray(adventure.links) ? adventure.links : []),
    adventure.websiteUrl ? { label: "Website or social", url: adventure.websiteUrl } : null,
    adventure.signupUrl ? { label: "Sign up", url: adventure.signupUrl } : null,
    adventure.linkUrl ? { label: "Website or social", url: adventure.linkUrl } : null
  ]
    .filter(Boolean)
    .filter((item) => normalize(item.label) !== "more info");

  const seen = new Set();
  return candidates.reduce((links, item) => {
    const url = safeExternalUrl(item.url);
    if (!url || seen.has(url)) return links;
    seen.add(url);
    links.push({
      label: String(item.label || "Open link").trim() || "Open link",
      url
    });
    return links;
  }, []);
}

function linkHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "external link";
  }
}

function formText(data, form, ...names) {
  for (const name of names) {
    const field = form?.querySelector(`[name="${name}"]`);
    if (field && typeof field.value === "string" && field.value.trim()) return field.value.trim();
  }
  for (const name of names) {
    const value = data?.get?.(name);
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function hostLinkInputs(data, form = null) {
  return [
    { label: "Website or social", value: formText(data, form, "websiteUrl", "linkUrl", "socialUrl", "instagramUrl") },
    { label: "Sign up", value: formText(data, form, "signupUrl", "registerUrl", "ticketUrl") }
  ];
}

function normalizeHostLinks(items) {
  return items
    .map((item) => ({ ...item, url: safeExternalUrl(item.value) }))
    .filter((item) => item.url)
    .map(({ label, url }) => ({ label, url }));
}

function photoMarkup(adventure, className = "card-photo") {
  const src = safeImageSrc(adventure.photo);
  if (!src) {
    return `<div class="${className} photo-fallback" aria-hidden="true"></div>`;
  }
  const alt = `${adventure.title || "Activity"}${adventure.area ? ` at ${adventure.area}` : ""}`;
  const loading = className === "detail-photo" ? "eager" : "lazy";
  return `<img class="${className}" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="${loading}" decoding="async" />`;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => reject(new Error("image-load-failed")));
    image.src = src;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

async function optimizeImageFile(file) {
  if (!(file instanceof File) || !file.size) return "";
  const isImage = String(file.type || "").startsWith("image/")
    || /\.(avif|gif|heic|heif|jpe?g|png|webp)$/i.test(String(file.name || ""));
  if (!isImage) throw new Error("image-type");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("image-too-large");

  const source = URL.createObjectURL(file);
  try {
    const image = await loadImage(source);
    const sourceWidth = image.naturalWidth || image.width;
    const sourceHeight = image.naturalHeight || image.height;
    if (!sourceWidth || !sourceHeight) throw new Error("image-load-failed");

    const maxDimension = 1600;
    const scale = Math.min(1, maxDimension / Math.max(sourceWidth, sourceHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(sourceWidth * scale));
    canvas.height = Math.max(1, Math.round(sourceHeight * scale));
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("canvas-unavailable");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    let blob = null;
    for (const quality of [0.82, 0.7, 0.58, 0.46, 0.36]) {
      blob = await canvasToBlob(canvas, "image/webp", quality)
        || await canvasToBlob(canvas, "image/jpeg", quality);
      if (blob && blob.size <= MAX_STORED_PHOTO_BYTES) break;
    }
    if (!blob || blob.size > MAX_STORED_PHOTO_BYTES) throw new Error("image-too-large-after-optimization");
    return fileToDataUrl(blob);
  } finally {
    URL.revokeObjectURL(source);
  }
}

function styleVars(source) {
  const type = typeof source === "string" ? source : getListingType(source);
  const [a, b] = TYPE_STYLE[type] || TYPE_STYLE["Pop-ups & Events"];
  return `--card-a:${a};--card-b:${b};--pin-color:${a}`;
}

function typeFilterMarkup(activeType, dataAttribute) {
  return ["All", ...LISTING_TYPES].map((type) => {
    const markerColor = MARKER_STYLE[type];
    return `
    <button
      class="chip type-chip ${type === "All" ? "type-all" : ""} ${type === activeType ? "is-active" : ""}"
      data-${dataAttribute}="${escapeHtml(type)}"
      aria-pressed="${type === activeType}"
      ${markerColor ? `style="--type-color:${markerColor}"` : ""}
    >
      ${escapeHtml(type)}
    </button>
  `;
  }).join("");
}

function vibeFilterMarkup(activeVibe, dataAttribute) {
  return ["All", ...VIBE_FILTERS].map((vibe) => `
    <button class="chip ${vibe === activeVibe ? "is-active" : ""}" data-${dataAttribute}="${escapeHtml(vibe)}" aria-pressed="${vibe === activeVibe}">
      ${escapeHtml(vibe)}
    </button>
  `).join("");
}

function renderFilters() {
  els.timingFilters.querySelectorAll("[data-timing-filter]").forEach((button) => {
    const active = button.dataset.timingFilter === state.activeTiming;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  els.typeFilters.innerHTML = typeFilterMarkup(state.activeType, "type-filter");
  els.vibeFilters.innerHTML = vibeFilterMarkup(state.activeVibe, "vibe-filter");
}

function adventureCard(adventure) {
  const saved = getSavedIds().includes(adventure.id);
  const type = getListingType(adventure);
  const vibes = getListingVibes(adventure).filter((vibe) => vibe !== "Free").slice(0, 3);
  return `
    <article class="adventure-card" style="${styleVars(adventure)}" data-action="open-detail" data-id="${escapeHtml(adventure.id)}" role="button" tabindex="0" aria-label="Open details for ${escapeHtml(adventure.title)}">
      <div class="card-art">
        ${photoMarkup(adventure)}
        <div class="badge-row">
          <span class="badge timing-badge">${escapeHtml(timingLabel(adventure))}</span>
          <span class="badge">${escapeHtml(type)}</span>
          <span class="badge">${escapeHtml(adventure.price)}</span>
        </div>
      </div>
      <div class="card-body">
        <h3>${escapeHtml(adventure.title)}</h3>
        <p>${escapeHtml(adventure.description)}</p>
        <div class="tag-row">
          ${vibes.map((vibe) => `<span class="mini-tag">${escapeHtml(vibe)}</span>`).join("")}
        </div>
        <div class="card-meta">
          <span>${escapeHtml(adventure.area)}</span>
          <span>Posted by ${escapeHtml(adventure.host)}</span>
        </div>
        <div class="card-actions">
          <button class="secondary-button" data-action="open-detail" data-id="${adventure.id}">Details</button>
          <button class="save-button ${saved ? "is-saved" : ""}" data-action="toggle-save" data-id="${adventure.id}" aria-label="${saved ? "Unsave" : "Save"} ${escapeHtml(adventure.title)}">★</button>
        </div>
      </div>
    </article>
  `;
}

let map;
let mapMarkers = [];
let outThereMap;
let latestLocationSearchRequest = 0;
const geocodeCache = new Map();

const BROAD_GEOCODE_TYPES = new Set([
  "administrative",
  "city",
  "county",
  "country",
  "municipality",
  "state",
  "town",
  "village"
]);

const APPROXIMATE_GEOCODE_TYPES = new Set([
  "borough",
  "neighbourhood",
  "quarter",
  "road",
  "route",
  "street",
  "suburb"
]);

const ROAD_GEOCODE_TYPES = new Set([
  "road",
  "route",
  "street"
]);

function knownCenterForLocation(location) {
  const key = normalize(location);
  return CITY_CENTERS[key] || null;
}

function initMap() {
  if (map || !els.realMap) return Boolean(map);
  if (!window.L) {
    els.realMap.innerHTML = `<div class="map-fallback">Map tiles are loading. Listings still work below.</div>`;
    return false;
  }
  map = L.map(els.realMap, {
    zoomControl: false,
    scrollWheelZoom: true,
    touchZoom: true,
    wheelDebounceTime: 40
  }).setView(state.mapCenter, 13);
  L.control.zoom({ position: "bottomright" }).addTo(map);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);
  setTimeout(() => map.invalidateSize(), 50);
  return true;
}

function markerIcon(adventure) {
  const color = MARKER_STYLE[getListingType(adventure)] || MARKER_STYLE["Pop-ups & Events"];
  const isToday = getListingSchedule(adventure).bucket === "today";
  return L.divIcon({
    className: "vv-marker-shell",
    html: `<span class="vv-marker ${isToday ? "is-today" : ""}" style="--pin-color:${color}" aria-hidden="true"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -12]
  });
}

function renderMap(adventures) {
  if (els.legendCount) {
    els.legendCount.textContent = `${adventures.length} ${adventures.length === 1 ? "activity" : "activities"}`;
  }
  const hasMap = initMap();
  if (!hasMap) return;

  mapMarkers.forEach((marker) => marker.remove());
  mapMarkers = [];

  const points = adventures.filter((adventure) => Number.isFinite(adventure.lat) && Number.isFinite(adventure.lng));
  points.slice(0, 40).forEach((adventure) => {
    const marker = L.marker([adventure.lat, adventure.lng], {
      icon: markerIcon(adventure),
      title: adventure.title,
      alt: adventure.title,
      riseOnHover: true
    })
      .addTo(map)
      .bindPopup(
        `<strong>${escapeHtml(adventure.title)}</strong><br>${escapeHtml(timingLabel(adventure))}<br>${escapeHtml(getListingType(adventure))} · ${escapeHtml(adventure.area)}${
          adventure.locationAccuracy === "approximate" ? "<br><em>Approximate area</em>" : ""
        }`
      )
      .bindTooltip(`${escapeHtml(adventure.title)}<br><span>${escapeHtml(timingLabel(adventure))}</span>`, {
        className: "vv-map-tooltip",
        direction: "top",
        offset: [0, -12],
        opacity: 1
      });
    marker.on("click", () => openDetail(adventure.id));
    marker.vvAdventureId = adventure.id;
    mapMarkers.push(marker);
  });

  if (state.mapNeedsFit) {
    if (points.length > 1) {
      map.fitBounds(points.map((item) => [item.lat, item.lng]), { padding: [34, 34], maxZoom: 14 });
    } else if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 14);
    } else {
      map.setView(state.mapCenter, 12);
    }
    state.mapNeedsFit = false;
  }
  setTimeout(() => map.invalidateSize(), 50);
}

function showAdventureOnMap(id) {
  const adventure = getAdventures().find((item) => item.id === id);
  if (!adventure || !Number.isFinite(adventure.lat) || !Number.isFinite(adventure.lng)) {
    toast("This activity does not have a map pin yet.");
    return;
  }

  if (els.detailModal.open) els.detailModal.close();
  state.view = "discover";
  state.location = adventure.city || "";
  state.mapCenter = [adventure.lat, adventure.lng];
  state.mapNeedsFit = true;
  state.activeType = "All";
  state.activeVibe = "All";
  state.activeTiming = "all";
  els.locationInput.value = state.location;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });

  setTimeout(() => {
    if (!map) return;
    map.setView([adventure.lat, adventure.lng], 16, { animate: true });
    const marker = mapMarkers.find((item) => item.vvAdventureId === id);
    if (marker) marker.openPopup();
  }, 120);
}

function initOutThereMap() {
  const mapElement = document.querySelector("#outThereMap");
  if (!mapElement || !window.L) return;
  if (!outThereMap) {
    const photoLocation = [29.5465, -95.0192];
    outThereMap = L.map(mapElement, {
      attributionControl: false,
      scrollWheelZoom: false,
      zoomControl: false
    }).setView(photoLocation, 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(outThereMap);
    L.marker(photoLocation, {
      icon: L.divIcon({
        className: "editorial-location-marker-shell",
        html: `<span class="editorial-location-marker" aria-hidden="true"></span>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      }),
      title: "Galveston Bay"
    }).addTo(outThereMap);
  }
  setTimeout(() => outThereMap.invalidateSize(), 50);
}

function updateOutThereSlideshow(index = state.outThereSlideIndex) {
  const slides = [...document.querySelectorAll("[data-out-there-slide]")];
  if (!slides.length) return;
  const parsedIndex = Number(index);
  const nextIndex = Number.isFinite(parsedIndex)
    ? ((parsedIndex % slides.length) + slides.length) % slides.length
    : 0;
  state.outThereSlideIndex = nextIndex;

  slides.forEach((slide, slideIndex) => {
    const active = slideIndex === nextIndex;
    slide.classList.toggle("is-active", active);
    slide.setAttribute("aria-hidden", active ? "false" : "true");
  });

  document.querySelectorAll("[data-action='out-there-slide']").forEach((dot) => {
    const active = Number(dot.dataset.slideIndex) === nextIndex;
    dot.classList.toggle("is-active", active);
    dot.setAttribute("aria-current", active ? "true" : "false");
  });

  if (els.outThereSlideCount) {
    els.outThereSlideCount.textContent = `${nextIndex + 1} / ${slides.length}`;
  }
}

function renderStats() {
  const user = getCurrentUser();
  els.profilePill.textContent = user ? user.name.split(" ")[0] : "Sign in";
  if (els.shareAuthPrompt) els.shareAuthPrompt.hidden = Boolean(user);
}

function renderViews() {
  const isDiscover = state.view === "discover";
  const isOutThere = state.view === "out-there";
  const isSaved = state.view === "saved";
  const isHost = state.view === "host";
  document.querySelector(".workspace").hidden = !isDiscover;
  els.outThereView.hidden = !isOutThere;
  els.savedView.hidden = !isSaved;
  els.hostView.hidden = !isHost;
  els.navTabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.view === state.view));
  if (isDiscover && map) setTimeout(() => map.invalidateSize(), 50);
  if (isOutThere) {
    initOutThereMap();
    updateOutThereSlideshow();
  }
}

function renderAdventures() {
  const adventures = filteredAdventures();
  els.adventureGrid.innerHTML = adventures.length
    ? adventures.map(adventureCard).join("")
    : `<div class="empty-state">Nothing matches this moment yet. Try another timing tab, city, type, or vibe.</div>`;
  renderMap(adventures);
  const timingMeta = state.activeTiming === "today"
    ? "Happening today"
    : state.activeTiming === "coming-up" ? "Worth planning for" : "Nearby finds";
  els.resultsMeta.textContent = state.location ? `${timingMeta} · ${state.location}` : timingMeta;
  const typeLabel = state.activeType === "All" ? "Local happenings" : state.activeType;
  const timingTitle = state.activeTiming === "today"
    ? "What’s happening today"
    : state.activeTiming === "coming-up" ? "Coming up" : "Local happenings";
  els.resultsTitle.textContent = state.activeType === "All" && state.activeVibe === "All"
    ? timingTitle
    : state.activeVibe === "All" ? typeLabel : `${state.activeVibe} ${typeLabel}`;
}

function renderSaved() {
  const savedIds = getSavedIds();
  const saved = getAdventures().filter((item) => savedIds.includes(item.id));
  els.savedGrid.innerHTML = saved.length
    ? saved.map(adventureCard).join("")
    : `<div class="empty-state">Your saved activities will live here after you tap the star.</div>`;
}

function profileListItem(item) {
  return `
    <button class="profile-list-item" type="button" data-action="open-detail" data-id="${item.id}">
      <span>
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(item.area)} · ${escapeHtml(item.city)}</small>
      </span>
      <em>${escapeHtml(item.price)}</em>
    </button>
  `;
}

function profileOwnedItem(item) {
  return `
    <div class="profile-owned-item">
      ${profileListItem(item)}
      <div class="profile-item-actions" aria-label="Manage ${escapeHtml(item.title)}">
        <button class="compact-button" type="button" data-action="edit-post" data-id="${item.id}">Edit</button>
        <button class="compact-button danger-button" type="button" data-action="delete-post" data-id="${item.id}">Delete</button>
      </div>
    </div>
  `;
}

function renderProfileLists() {
  const user = getCurrentUser();
  if (!user || !els.profileSavedList || !els.profileHostedList) return;
  const listings = getAdventures();
  const savedIds = getSavedIds();
  const saved = listings.filter((item) => savedIds.includes(item.id));
  const hosted = listings.filter((item) => item.createdBy === user.id);

  els.profileSavedList.innerHTML = saved.length
    ? saved.map(profileListItem).join("")
    : `<div class="empty-state">Saved activities will appear here.</div>`;

  els.profileHostedList.innerHTML = hosted.length
    ? hosted.map(profileOwnedItem).join("")
    : `<div class="empty-state">Activities you post will appear here.</div>`;
}

function render() {
  renderFilters();
  renderViews();
  renderAdventures();
  renderSaved();
  renderStats();
  renderProfileLists();
}

async function fetchGeocodeResults(location, limit = 5) {
  const query = String(location || "").trim();
  if (!query) return [];
  const cacheKey = `${normalize(query)}:${limit}`;
  if (geocodeCache.has(cacheKey)) return geocodeCache.get(cacheKey);
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&countrycodes=us&limit=${limit}&q=${encodeURIComponent(query)}`
    );
    if (!response.ok) return [];
    const results = await response.json();
    geocodeCache.set(cacheKey, Array.isArray(results) ? results : []);
    return geocodeCache.get(cacheKey);
  } catch {
    return [];
  }
}

async function geocodeFreeformLocation(location) {
  const known = knownCenterForLocation(location);
  if (known) return known;
  const [result] = await fetchGeocodeResults(location, 1);
  if (result?.lat && result?.lon) return [Number(result.lat), Number(result.lon)];
  return null;
}

function geocodeType(result) {
  return normalize(result?.addresstype || result?.type);
}

function geocodeBounds(result) {
  const values = Array.isArray(result?.boundingbox) ? result.boundingbox.map(Number) : [];
  if (values.length !== 4 || values.some((value) => !Number.isFinite(value))) return null;
  return {
    south: values[0],
    north: values[1],
    west: values[2],
    east: values[3]
  };
}

function pointNearBounds(lat, lng, bounds) {
  if (!bounds) return true;
  const latPadding = Math.max((bounds.north - bounds.south) * 0.35, 0.06);
  const lngPadding = Math.max((bounds.east - bounds.west) * 0.35, 0.06);
  return lat >= bounds.south - latPadding
    && lat <= bounds.north + latPadding
    && lng >= bounds.west - lngPadding
    && lng <= bounds.east + lngPadding;
}

function placeWords(value) {
  return normalize(value)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

function candidateScore(result, location, city, cityBounds) {
  const lat = Number(result?.lat);
  const lng = Number(result?.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !pointNearBounds(lat, lng, cityBounds)) return -Infinity;
  const display = normalize(result.display_name);
  const type = geocodeType(result);
  const locationWords = placeWords(location);
  const cityName = placeWords(String(city).split(",")[0]).join(" ");
  if (!cityBounds && cityName && !display.includes(cityName)) return -Infinity;
  const matchedWords = locationWords.filter((word) => display.includes(word)).length;
  let score = matchedWords * 12;
  if (cityName && display.includes(cityName)) score += 28;
  if (result.address?.house_number) score += 35;
  if (looksLikeStreetAddress(location) && ROAD_GEOCODE_TYPES.has(type)) score += 22;
  if (BROAD_GEOCODE_TYPES.has(type)) score -= 45;
  if (looksLikeStreetAddress(location) && APPROXIMATE_GEOCODE_TYPES.has(type) && !ROAD_GEOCODE_TYPES.has(type)) score -= 18;
  return score + Number(result.importance || 0);
}

function shortGeocodeLabel(result) {
  return String(result?.display_name || "")
    .split(",")
    .slice(0, 4)
    .join(",")
    .trim();
}

async function geocodeListingLocation(location, city) {
  const cleanLocation = String(location || "").trim();
  const cleanCity = String(city || "").trim();
  if (!cleanLocation || !cleanCity) {
    return { ok: false, message: "Add both a place or address and its city." };
  }

  const cityResults = await fetchGeocodeResults(cleanCity, 3);
  const cityResult = cityResults.find((result) => BROAD_GEOCODE_TYPES.has(geocodeType(result))) || cityResults[0];
  const cityBounds = geocodeBounds(cityResult);
  const combinedQuery = normalize(cleanLocation).includes(normalize(cleanCity))
    ? cleanLocation
    : `${cleanLocation}, ${cleanCity}`;
  const candidates = await fetchGeocodeResults(combinedQuery, 5);
  const ranked = candidates
    .map((result) => ({ result, score: candidateScore(result, cleanLocation, cleanCity, cityBounds) }))
    .filter((candidate) => Number.isFinite(candidate.score))
    .sort((a, b) => b.score - a.score);
  const best = ranked[0]?.result;

  if (!best) {
    return {
      ok: false,
      message: "We could not confidently place that pin in this city. Try a full address or a recognizable venue, park, or landmark."
    };
  }

  const type = geocodeType(best);
  const cityOnly = normalize(cleanLocation) === normalize(cleanCity)
    || normalize(cleanCity).startsWith(`${normalize(cleanLocation)},`);
  if (BROAD_GEOCODE_TYPES.has(type) && !cityOnly) {
    return {
      ok: false,
      message: "That match is too broad for a useful activity pin. Add a street address or a named local landmark."
    };
  }

  const roadLevelAddressMatch = looksLikeStreetAddress(cleanLocation) && ROAD_GEOCODE_TYPES.has(type);
  const approximate = BROAD_GEOCODE_TYPES.has(type) || (APPROXIMATE_GEOCODE_TYPES.has(type) && !roadLevelAddressMatch);
  return {
    ok: true,
    lat: Number(best.lat),
    lng: Number(best.lon),
    accuracy: approximate ? "approximate" : "exact",
    requiresConfirmation: approximate,
    label: shortGeocodeLabel(best) || cleanLocation,
    message: roadLevelAddressMatch
      ? `Address accepted. Pin placed near ${shortGeocodeLabel(best)}.`
      : approximate
      ? `Approximate pin: ${shortGeocodeLabel(best)}. Add a street address or named venue for greater precision.`
      : `Pin matched to ${shortGeocodeLabel(best)}.`
  };
}

async function geocodeLocation(location) {
  const result = await geocodeFreeformLocation(location);
  if (result) return result;
  toast("Could not update the map for that location yet.");
  return state.mapCenter;
}

async function applyFilters() {
  const requestId = ++latestLocationSearchRequest;
  const nextCenter = await geocodeLocation(state.location);
  if (requestId !== latestLocationSearchRequest) return;
  state.mapCenter = nextCenter;
  state.mapNeedsFit = true;
  render();
}

async function repairHostedCoordinates() {
  const storedHosted = store.get("vv_adventures", []);
  const hosted = Array.isArray(storedHosted) ? storedHosted : [];
  let changed = false;
  const repaired = [];
  for (const item of hosted) {
    const legacyCombinedLocation = isPlaceholderArea(item.area) && !item.locationQuery && item.city;
    if (!legacyCombinedLocation) {
      repaired.push(item);
      continue;
    }
    const center = await geocodeFreeformLocation(item.city);
    if (!center) {
      repaired.push(item);
      continue;
    }
    const moved = Math.abs(Number(item.lat) - center[0]) > 0.0005 || Math.abs(Number(item.lng) - center[1]) > 0.0005;
    repaired.push(moved ? { ...item, lat: center[0], lng: center[1] } : item);
    changed = changed || moved;
  }
  if (changed) {
    store.set("vv_adventures", repaired);
    state.mapNeedsFit = true;
    render();
  }
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  clearTimeout(window.vvToastTimer);
  window.vvToastTimer = setTimeout(() => els.toast.classList.remove("is-visible"), 2400);
}

function setLocationFeedback(message = "", tone = "") {
  if (!els.locationFeedback) return;
  els.locationFeedback.textContent = message;
  els.locationFeedback.className = `location-feedback${tone ? ` is-${tone}` : ""}`;
}

function showAuth(mode = "signin") {
  state.authMode = mode;
  updateAuthMode();
  els.authMessage.textContent = "";
  els.authForm.reset();
  els.authModal.showModal();
}

function updateAuthMode() {
  const signup = state.authMode === "signup";
  els.authForm.classList.toggle("is-signup", signup);
  els.authTitle.textContent = signup ? "Create your Vibe Ventures profile" : "Sign in to Vibe Ventures";
  els.authModeLabel.textContent = signup ? "Save your vibe" : "Welcome back";
  els.authSubmit.textContent = signup ? "Create account" : "Sign in";
  document.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.authMode === state.authMode);
  });
}

async function handleAuthSubmit(event) {
  if (state.authBusy) return;
  state.authBusy = true;
  els.authSubmit.disabled = true;
  try {
    await handleAuthSubmitWork(event);
  } catch {
    els.authMessage.textContent = "Something went wrong while saving your profile. Please try again.";
  } finally {
    state.authBusy = false;
    els.authSubmit.disabled = false;
  }
}

async function handleRemoteAuthSubmit(data, email, password) {
  const name = String(data.get("name") || "").trim();
  const city = String(data.get("city") || "").trim();
  if (password.length < 8) {
    els.authMessage.textContent = "Use at least 8 characters.";
    return;
  }
  if (state.authMode === "signup" && !name) {
    els.authMessage.textContent = "Add your name so your profile feels human.";
    return;
  }

  const credentials = state.authMode === "signup"
    ? {
        email,
        password,
        options: {
          data: { name, city },
          ...(window.location.protocol === "http:" || window.location.protocol === "https:"
            ? { emailRedirectTo: `${window.location.origin}${window.location.pathname}` }
            : {})
        }
      }
    : { email, password };
  const result = state.authMode === "signup"
    ? await window.vvSupabase.auth.signUp(credentials)
    : await window.vvSupabase.auth.signInWithPassword(credentials);

  if (result.error) {
    els.authMessage.textContent = result.error.message || "We could not complete that request.";
    return;
  }
  if (state.authMode === "signup" && !result.data.session) {
    els.authMessage.textContent = "Check your email to confirm your account, then come back to sign in.";
    return;
  }
  if (result.data.session) await syncRemoteSession(result.data.session);
  els.authModal.close();
  toast(state.authMode === "signup" ? "Your profile is ready." : `Welcome back, ${getCurrentUser()?.name?.split(" ")[0] || "explorer"}.`);
  render();
}

async function handleAuthSubmitWork(event) {
  event.preventDefault();
  const data = new FormData(els.authForm);
  const email = normalize(data.get("email"));
  const password = String(data.get("password") || "");
  if (state.backendEnabled) {
    await handleRemoteAuthSubmit(data, email, password);
    return;
  }
  const users = getUsers();

  if (password.length < 8) {
    els.authMessage.textContent = "Use at least 8 characters.";
    return;
  }

  if (state.authMode === "signup") {
    if (users.some((user) => normalize(user.email) === email)) {
      els.authMessage.textContent = "That email already has an account.";
      return;
    }
    const name = String(data.get("name") || "").trim();
    if (!name) {
      els.authMessage.textContent = "Add your name so your profile feels human.";
      return;
    }
    const id = createId("user");
    const passwordSalt = createId("salt");
    const user = {
      id,
      name,
      email,
      passwordSalt,
      passwordHash: await hashPassword(password, passwordSalt),
      city: String(data.get("city") || "Galveston, TX").trim(),
      createdAt: new Date().toISOString()
    };
    if (!setUsers([...users, user])) {
      els.authMessage.textContent = "This browser cannot save the profile yet. Try clearing a little local space and try again.";
      return;
    }
    state.session = { userId: user.id, signedInAt: new Date().toISOString() };
    if (!store.set("vv_session", state.session)) {
      els.authMessage.textContent = "Your profile was created, but this browser could not keep you signed in.";
      state.session = null;
      return;
    }
    state.location = user.city;
    state.mapCenter = knownCenterForLocation(user.city) || state.mapCenter;
    state.mapNeedsFit = true;
    els.locationInput.value = user.city;
    els.authModal.close();
    toast("Profile created and saved on this device.");
    render();
    return;
  }

  const user = users.find((candidate) => normalize(candidate.email) === email);
  const secureHash = user ? await hashPassword(password, user.passwordSalt) : "";
  const legacyHash = user ? await legacyHashPassword(password) : "";
  if (!user || (user.passwordHash !== secureHash && user.passwordHash !== legacyHash)) {
    els.authMessage.textContent = "Email or password does not match.";
    return;
  }
  if (!user.passwordSalt || user.passwordHash === legacyHash) {
    const passwordSalt = createId("salt");
    const passwordHash = await hashPassword(password, passwordSalt);
    const upgradedUsers = users.map((candidate) => candidate.id === user.id
      ? { ...candidate, passwordSalt, passwordHash }
      : candidate);
    setUsers(upgradedUsers);
  }
  state.session = { userId: user.id, signedInAt: new Date().toISOString() };
  if (!store.set("vv_session", state.session)) {
    els.authMessage.textContent = "This browser could not keep you signed in. Try again after clearing a little local space.";
    state.session = null;
    return;
  }
  state.location = user.city || "";
  state.mapCenter = knownCenterForLocation(state.location) || state.mapCenter;
  state.mapNeedsFit = true;
  els.locationInput.value = state.location;
  els.authModal.close();
  toast(`Welcome back, ${user.name.split(" ")[0]}.`);
  render();
}

function requireUser(action) {
  if (getCurrentUser()) return true;
  showAuth("signup");
  toast(action || "Create a profile to keep this saved.");
  return false;
}

async function toggleSave(id) {
  if (!requireUser("Create a profile to save activities.")) return;
  const saved = new Set(getSavedIds());
  const user = getCurrentUser();
  const wasSaved = saved.has(id);
  if (state.backendEnabled && user && isUuid(id)) {
    const result = wasSaved
      ? await window.vvSupabase.from("saved_activities").delete().eq("user_id", user.id).eq("activity_id", id)
      : await window.vvSupabase.from("saved_activities").insert({ user_id: user.id, activity_id: id });
    if (result.error) {
      toast("We could not update your saved list yet.");
      return;
    }
  } else if (state.backendEnabled && user) {
    const demoSaves = store.get("vv_demo_saves", {});
    const saves = demoSaves && typeof demoSaves === "object" && !Array.isArray(demoSaves) ? demoSaves : {};
    const ids = new Set(Array.isArray(saves[user.id]) ? saves[user.id] : []);
    if (wasSaved) ids.delete(id); else ids.add(id);
    saves[user.id] = [...ids];
    store.set("vv_demo_saves", saves);
  } else {
    const nextSaved = new Set(saved);
    if (wasSaved) nextSaved.delete(id); else nextSaved.add(id);
    if (!setSavedIds([...nextSaved])) {
      toast("This browser could not save that yet. Try clearing a little local space.");
      return;
    }
  }
  if (wasSaved) {
    saved.delete(id);
    toast("Removed from saved.");
  } else {
    saved.add(id);
    toast("Saved to your profile.");
  }
  if (state.backendEnabled) state.remoteSavedIds = [...saved];
  render();
  if (els.detailModal.open) openDetail(id);
}

function openDetail(id) {
  const adventure = getAdventures().find((item) => item.id === id);
  if (!adventure) return;
  const user = getCurrentUser();
  const type = getListingType(adventure);
  const links = getAdventureLinks(adventure);
  const saved = getSavedIds().includes(adventure.id);
  const isOwner = Boolean(user && adventure.createdBy === user.id);
  const ownerActions = isOwner
    ? `
      <section class="owner-panel">
        <div>
          <span class="mini-label">Your post</span>
          <p>Keep the details current or remove this activity.</p>
        </div>
        <div class="owner-actions">
          <button class="compact-button" type="button" data-action="edit-post" data-id="${adventure.id}">Edit post</button>
          <button class="compact-button danger-button" type="button" data-action="delete-post" data-id="${adventure.id}">Delete post</button>
        </div>
      </section>
    `
    : "";
  els.detailContent.innerHTML = `
    <div class="detail-hero" style="${styleVars(adventure)}">${photoMarkup(adventure, "detail-photo")}</div>
    <span class="detail-location-label">${escapeHtml(adventure.area)} · ${escapeHtml(adventure.city)}</span>
    <h2>${escapeHtml(adventure.title)}</h2>
    <p>${escapeHtml(adventure.description)}</p>
    <div class="detail-list">
      <button
        class="detail-map-link"
        type="button"
        data-action="show-on-map"
        data-id="${adventure.id}"
        aria-label="Show ${escapeHtml(adventure.title)} on the map"
      >
        <span>Where</span>
        <strong>${escapeHtml(adventure.area)}</strong>
        ${adventure.locationAccuracy === "approximate" ? `<em class="location-accuracy">Approximate map area</em>` : ""}
      </button>
      <div><span>Price</span><strong>${escapeHtml(adventure.price)}</strong></div>
      <div><span>When</span><strong>${escapeHtml(timingLabel(adventure, true))}</strong></div>
      <div><span>Type</span><strong>${escapeHtml(type)}</strong></div>
    </div>
    <p><strong>Posted by:</strong> ${escapeHtml(adventure.host)}</p>
    ${ownerActions}
    <section class="links-panel">
      <div class="compact-heading">
        <span class="mini-label">Links</span>
        <h3>Where to go next</h3>
      </div>
      <div class="link-list">
        ${links.length ? links.map((link) => `
          <a class="listing-link-card" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">
            <span>${escapeHtml(link.label)}</span>
            <strong>${escapeHtml(linkHost(link.url))}</strong>
          </a>
        `).join("") : `<div class="empty-state">No links yet.</div>`}
      </div>
    </section>
    <div class="modal-actions">
      <button class="secondary-button" type="button" data-action="show-on-map" data-id="${adventure.id}">
        Show on map
      </button>
      <button class="primary-button" data-action="toggle-save" data-id="${adventure.id}">
        ${saved ? "Remove from saved" : "Save activity"}
      </button>
    </div>
  `;
  if (!els.detailModal.open) els.detailModal.showModal();
}

function openProfile() {
  const user = getCurrentUser();
  if (!user) {
    showAuth("signin");
    return;
  }
  els.profileForm.elements.name.value = user.name;
  els.profileForm.elements.city.value = user.city || "";
  renderProfileLists();
  els.profileModal.showModal();
}

async function saveProfile(event) {
  event.preventDefault();
  const user = getCurrentUser();
  if (!user) return;
  const name = els.profileForm.elements.name.value.trim();
  const city = els.profileForm.elements.city.value.trim();
  if (state.backendEnabled) {
    const { data, error } = await window.vvSupabase
      .from("profiles")
      .update({ display_name: name, city })
      .eq("id", user.id)
      .select("id, display_name, city, bio, avatar_path, created_at")
      .single();
    if (error) {
      toast("We could not update your profile yet.");
      return;
    }
    state.remoteUser = {
      ...user,
      name: data.display_name,
      city: data.city || "",
      bio: data.bio || "",
      avatarPath: data.avatar_path || "",
      createdAt: data.created_at
    };
    state.location = city;
    state.mapCenter = knownCenterForLocation(state.location) || state.mapCenter;
    state.mapNeedsFit = true;
    els.locationInput.value = state.location;
    els.profileModal.close();
    toast("Profile updated.");
    render();
    return;
  }
  const users = getUsers().map((candidate) => {
    if (candidate.id !== user.id) return candidate;
    return {
      ...candidate,
      name,
      city
    };
  });
  if (!setUsers(users)) {
    toast("This browser could not save your profile yet.");
    return;
  }
  state.location = els.profileForm.elements.city.value.trim();
  state.mapCenter = knownCenterForLocation(state.location) || state.mapCenter;
  state.mapNeedsFit = true;
  els.locationInput.value = state.location;
  els.profileModal.close();
  toast("Profile updated.");
  render();
}

async function signOut() {
  if (state.backendEnabled) {
    const { error } = await window.vvSupabase.auth.signOut();
    if (error) {
      toast("We could not sign you out yet.");
      return;
    }
    state.remoteUser = null;
    state.remoteSavedIds = [];
    els.profileModal.close();
    toast("Signed out.");
    render();
    return;
  }
  resetHostForm();
  state.session = null;
  store.set("vv_session", null);
  els.profileModal.close();
  toast("Signed out.");
  render();
}

function getStoredAdventure(id) {
  if (state.backendEnabled) {
    return state.remoteActivities.find((item) => item.id === id) || null;
  }
  const storedAdventures = store.get("vv_adventures", []);
  return (Array.isArray(storedAdventures) ? storedAdventures : []).find((item) => item.id === id) || null;
}

function hostLinkValue(adventure, labels) {
  const links = getAdventureLinks(adventure);
  return links.find((link) => labels.includes(normalize(link.label)))?.url || "";
}

function updateHostFormMode() {
  const editing = Boolean(state.editingAdventureId);
  els.hostModeLabel.textContent = editing ? "Edit mode" : "Share mode";
  els.hostFormTitle.textContent = editing ? "Update your post." : "Post something worth showing up for.";
  els.hostFormCopy.textContent = editing
    ? "Make any changes below. Your listing, map pin, and profile will update together."
    : "Share a pop-up, meet-up, class, running group, special event, or one-off local find with people nearby.";
  els.hostSubmitButton.textContent = editing ? "Save changes" : (state.backendEnabled ? "Post activity" : "Post locally");
  els.cancelEditButton.hidden = !editing;
}

function updateScheduleFields() {
  const mode = els.hostForm.elements.listingMode.value || "one-time";
  els.hostForm.querySelectorAll("[data-schedule-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.schedulePanel !== mode;
  });
  els.hostForm.elements.startDate.required = mode === "one-time";
  els.hostForm.elements.startTime.required = mode === "one-time";
  els.hostForm.elements.recurringDay.required = mode === "recurring";
  els.hostForm.elements.recurringTime.required = mode === "recurring";
}

function resetHostForm() {
  state.editingAdventureId = null;
  els.hostForm.reset();
  const todayInput = els.hostForm.elements.startDate;
  todayInput.min = formatInputDate(startOfToday());
  todayInput.value = formatInputDate(startOfToday());
  els.hostForm.elements.startTime.value = "18:00";
  els.hostForm.elements.recurringDay.value = String(startOfToday().getDay());
  els.hostForm.elements.recurringTime.value = "18:00";
  updateScheduleFields();
  delete els.hostForm.dataset.approximateLocationKey;
  setLocationFeedback();
  updateHostFormMode();
}

function startNewPost() {
  resetHostForm();
  state.view = "host";
  render();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function dataUrlToBlob(dataUrl) {
  const match = String(dataUrl || "").match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("invalid-image-data");
  const binary = atob(match[2]);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new Blob([bytes], { type: match[1] });
}

async function uploadRemoteActivityPhoto(activityId, dataUrl) {
  if (!dataUrl) return "";
  const blob = dataUrlToBlob(dataUrl);
  const path = `${getCurrentUser().id}/${activityId}/${Date.now()}.${blob.type === "image/jpeg" ? "jpg" : "webp"}`;
  const { error } = await window.vvSupabase.storage
    .from("activity-media")
    .upload(path, blob, { cacheControl: "31536000", contentType: blob.type, upsert: false });
  if (error) throw error;
  return path;
}

async function saveRemoteActivity(adventure, existing, photoDataUrl) {
  const user = getCurrentUser();
  if (!user) throw new Error("auth-required");
  const photoPath = photoDataUrl
    ? await uploadRemoteActivityPhoto(adventure.id, photoDataUrl)
    : existing?.photoPath || "";
  const record = {
    id: adventure.id,
    owner_id: user.id,
    title: adventure.title,
    description: adventure.description,
    location_name: adventure.area,
    location_query: adventure.locationQuery,
    city: adventure.city,
    latitude: adventure.lat,
    longitude: adventure.lng,
    location_accuracy: adventure.locationAccuracy,
    type: adventure.type,
    vibes: adventure.vibes,
    price_label: adventure.price || "Free",
    listing_mode: adventure.listingMode,
    start_date: adventure.startDate || null,
    start_time: adventure.startTime || null,
    recurring_day: Number.isInteger(adventure.recurringDay) ? adventure.recurringDay : null,
    recurring_time: adventure.recurringTime || null,
    status: "published",
    cover_photo_path: photoPath || null
  };
  let activityResult;
  try {
    activityResult = existing
      ? await window.vvSupabase.from("activities").update(record).eq("id", existing.id).eq("owner_id", user.id).select("*").single()
      : await window.vvSupabase.from("activities").insert(record).select("*").single();
    if (activityResult.error) throw activityResult.error;

    const { error: deleteLinksError } = await window.vvSupabase
      .from("activity_links")
      .delete()
      .eq("activity_id", adventure.id);
    if (deleteLinksError) throw deleteLinksError;
    if (adventure.links.length) {
      const { error: linkError } = await window.vvSupabase.from("activity_links").insert(
        adventure.links.map((link, index) => ({
          activity_id: adventure.id,
          label: link.label,
          url: link.url,
          sort_order: index
        }))
      );
      if (linkError) throw linkError;
    }
    if (photoDataUrl && photoPath) {
      const { error: mediaError } = await window.vvSupabase.from("activity_media").insert({
        activity_id: adventure.id,
        uploaded_by: user.id,
        storage_path: photoPath,
        alt_text: `${adventure.title} at ${adventure.area}`,
        moderation_status: "approved"
      });
      if (mediaError) throw mediaError;
    }
  } catch (error) {
    if (photoPath && photoPath !== existing?.photoPath) {
      await window.vvSupabase.storage.from("activity-media").remove([photoPath]).catch(() => {});
    }
    throw error;
  }
  await loadRemoteActivities();
}

function editPost(id) {
  const user = getCurrentUser();
  const adventure = getStoredAdventure(id);
  if (!user || !adventure || adventure.createdBy !== user.id) {
    toast("Only the person who posted this activity can edit it.");
    return;
  }

  state.editingAdventureId = id;
  const form = els.hostForm.elements;
  form.title.value = adventure.title || "";
  const legacyCombinedLocation = isPlaceholderArea(adventure.area) && !adventure.locationQuery;
  form.location.value = adventure.locationQuery || (legacyCombinedLocation ? adventure.city : adventure.area) || "";
  form.city.value = legacyCombinedLocation ? (user.city || adventure.city || "") : (adventure.city || "");
  form.type.value = getListingType(adventure);
  const schedule = getListingSchedule(adventure);
  form.listingMode.value = schedule.listingMode;
  form.startDate.value = adventure.startDate || (schedule.listingMode === "one-time" && schedule.occurrence ? formatInputDate(schedule.occurrence) : "");
  form.startTime.value = adventure.startTime || schedule.time || "";
  form.recurringDay.value = String(adventure.recurringDay ?? schedule.weekday ?? startOfToday().getDay());
  form.recurringTime.value = adventure.recurringTime || schedule.time || "";
  form.description.value = adventure.description || "";
  form.price.value = adventure.price || "";
  form.websiteUrl.value = hostLinkValue(adventure, ["website or social", "website", "instagram", "facebook"]);
  form.signupUrl.value = hostLinkValue(adventure, ["sign up", "signup", "register", "reserve", "tickets", "book ride"]);
  const selectedVibes = new Set(getListingVibes(adventure));
  els.hostForm.querySelectorAll('input[name="vibes"]').forEach((input) => {
    input.checked = selectedVibes.has(input.value);
  });
  updateScheduleFields();

  updateHostFormMode();
  els.detailModal.close();
  els.profileModal.close();
  state.view = "host";
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
  toast("Editing your post.");
}

function requestDeletePost(id) {
  const user = getCurrentUser();
  const adventure = getStoredAdventure(id);
  if (!user || !adventure || adventure.createdBy !== user.id) {
    toast("Only the person who posted this activity can delete it.");
    return;
  }
  state.pendingDeleteId = id;
  els.deletePostTitle.textContent = adventure.title;
  els.deleteModal.showModal();
}

function cancelDeletePost() {
  state.pendingDeleteId = null;
  els.deleteModal.close();
}

async function removeRemoteActivity(adventure) {
  const user = getCurrentUser();
  if (!user) throw new Error("auth-required");
  const { error } = await window.vvSupabase
    .from("activities")
    .delete()
    .eq("id", adventure.id)
    .eq("owner_id", user.id);
  if (error) throw error;
  if (adventure.photoPath) {
    await window.vvSupabase.storage.from("activity-media").remove([adventure.photoPath]);
  }
  await loadRemoteActivities();
  await loadRemoteSavedIds();
}

async function confirmDeletePost() {
  const id = state.pendingDeleteId;
  const user = getCurrentUser();
  const adventure = getStoredAdventure(id);
  if (!id || !user || !adventure || adventure.createdBy !== user.id) {
    cancelDeletePost();
    toast("That post is no longer available.");
    return;
  }
  if (state.backendEnabled) {
    try {
      await removeRemoteActivity(adventure);
    } catch {
      cancelDeletePost();
      toast("We could not delete that post yet.");
      return;
    }
    if (state.editingAdventureId === id) resetHostForm();
    state.pendingDeleteId = null;
    els.deleteModal.close();
    els.detailModal.close();
    toast("Post deleted.");
    render();
    return;
  }
  const storedAdventures = store.get("vv_adventures", []);
  const remaining = (Array.isArray(storedAdventures) ? storedAdventures : []).filter((item) => item.id !== id);
  if (!store.set("vv_adventures", remaining)) {
    cancelDeletePost();
    toast("This browser could not delete the post yet.");
    return;
  }

  const storedSaves = store.get("vv_saves", {});
  const saves = storedSaves && typeof storedSaves === "object" && !Array.isArray(storedSaves) ? storedSaves : {};
  Object.keys(saves).forEach((userId) => {
    saves[userId] = (Array.isArray(saves[userId]) ? saves[userId] : []).filter((savedId) => savedId !== id);
  });
  store.set("vv_saves", saves);

  if (state.editingAdventureId === id) resetHostForm();
  state.pendingDeleteId = null;
  els.deleteModal.close();
  els.detailModal.close();
  toast("Post deleted.");
  render();
}

async function publishAdventure(event) {
  event.preventDefault();
  if (!requireUser("Create a profile before sharing an activity.")) return;
  const user = getCurrentUser();
  const data = new FormData(els.hostForm);
  const submittedLinkInputs = hostLinkInputs(null, els.hostForm);
  const type = String(data.get("type") || data.get("category") || "Pop-ups & Events");
  const listingMode = LISTING_MODES.includes(String(data.get("listingMode")))
    ? String(data.get("listingMode"))
    : "one-time";
  const vibes = [...new Set(data.getAll("vibes").map(String))].slice(0, 3);
  const title = String(data.get("title") || "").trim();
  const location = String(data.get("location") || "").trim();
  const city = String(data.get("city") || "").trim();
  const description = String(data.get("description") || "").trim();
  const price = String(data.get("price") || "").trim();
  const invalidLink = submittedLinkInputs.find((item) => String(item.value || "").trim() && !safeExternalUrl(item.value));
  if (title.length < 3 || title.length > 120) {
    toast("Give the activity a title between 3 and 120 characters.");
    return;
  }
  if (description.length < 10 || description.length > 900) {
    toast("Add a short description between 10 and 900 characters.");
    return;
  }
  if (invalidLink) {
    toast(`${invalidLink.label} needs a valid web address, such as https://example.com.`);
    return;
  }

  els.hostSubmitButton.disabled = true;
  try {
    setLocationFeedback("Checking this location against the map...", "checking");
    const geocode = await geocodeListingLocation(location, city);
    if (!geocode.ok) {
      updateHostFormMode();
      setLocationFeedback(geocode.message, "error");
      toast("Please check the activity location.");
      return;
    }
    setLocationFeedback(geocode.message, geocode.accuracy === "approximate" ? "approximate" : "success");
    const approximateLocationKey = normalize(`${location}|${city}|${geocode.lat}|${geocode.lng}`);
    if (geocode.requiresConfirmation && els.hostForm.dataset.approximateLocationKey !== approximateLocationKey) {
      els.hostForm.dataset.approximateLocationKey = approximateLocationKey;
      setLocationFeedback(`${geocode.message} Check the match, then click again to use this approximate pin.`, "approximate");
      els.hostSubmitButton.textContent = state.editingAdventureId ? "Save with approximate pin" : "Post with approximate pin";
      return;
    }
    delete els.hostForm.dataset.approximateLocationKey;
    const center = [geocode.lat, geocode.lng];
    const photoFile = data.get("photoFile");
    let uploadedPhoto = "";
    if (photoFile instanceof File && photoFile.size) {
      uploadedPhoto = await optimizeImageFile(photoFile);
    }
    const links = normalizeHostLinks(submittedLinkInputs);
    const existing = state.editingAdventureId ? getStoredAdventure(state.editingAdventureId) : null;
    if (state.editingAdventureId && (!existing || existing.createdBy !== user.id)) {
      resetHostForm();
      toast("That post is no longer available to edit.");
      return;
    }
    const adventure = {
      ...(existing || {}),
      id: existing?.id || createId("hosted"),
      title,
      city,
      area: location,
      locationQuery: location,
      locationAccuracy: geocode.accuracy,
      geocodeLabel: geocode.label,
      category: type,
      type,
      listingMode,
      startDate: listingMode === "one-time" ? String(data.get("startDate") || "") : "",
      startTime: listingMode === "one-time" ? String(data.get("startTime") || "") : "",
      recurringDay: listingMode === "recurring" ? Number(data.get("recurringDay")) : undefined,
      recurringTime: listingMode === "recurring" ? String(data.get("recurringTime") || "") : "",
      vibes,
      goodFor: undefined,
      price,
      seats: 12,
      distance: 1.5,
      lat: center[0],
      lng: center[1],
      photo: uploadedPhoto || existing?.photo || "",
      links,
      linkUrl: links[0]?.url || "",
      host: user.name,
      description,
      x: existing?.x || 28 + Math.round(Math.random() * 44),
      y: existing?.y || 24 + Math.round(Math.random() * 48),
      createdBy: user.id,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: existing ? new Date().toISOString() : undefined
    };
    if (state.backendEnabled) {
      try {
        await saveRemoteActivity(adventure, existing, uploadedPhoto);
      } catch {
        setLocationFeedback("We could not save this activity to the shared map yet. Please try again.", "error");
        toast("Your activity could not be published yet.");
        return;
      }
      const wasEditing = Boolean(existing);
      resetHostForm();
      state.view = "discover";
      state.location = city;
      state.mapCenter = center;
      state.mapNeedsFit = true;
      state.activeType = type;
      state.activeVibe = "All";
      const publishedBucket = getListingSchedule(adventure).bucket;
      state.activeTiming = publishedBucket === "anytime" ? "all" : publishedBucket === "expired" ? "coming-up" : publishedBucket;
      els.locationInput.value = city;
      toast(wasEditing ? "Your post has been updated." : "Your activity is live.");
      render();
      return;
    }
    const storedAdventures = store.get("vv_adventures", []);
    const adventures = Array.isArray(storedAdventures) ? storedAdventures : [];
    const saved = store.set(
      "vv_adventures",
      existing
        ? adventures.map((item) => item.id === existing.id ? adventure : item)
        : [adventure, ...adventures]
    );
    if (!saved) {
      setLocationFeedback("This browser is out of local space. Try a smaller photo or clear old prototype data.", "error");
      toast("Your activity could not be saved in this browser.");
      return;
    }
    const wasEditing = Boolean(existing);
    resetHostForm();
    state.view = "discover";
    state.location = city;
    state.mapCenter = center;
    state.mapNeedsFit = true;
    state.activeType = type;
    state.activeVibe = "All";
    const publishedBucket = getListingSchedule(adventure).bucket;
    state.activeTiming = publishedBucket === "anytime" ? "all" : publishedBucket === "expired" ? "coming-up" : publishedBucket;
    els.locationInput.value = city;
    toast(wasEditing ? "Your post has been updated." : "Your activity is live.");
    render();
  } catch (error) {
    const message = error?.message === "image-too-large"
      ? `That original photo is over ${MAX_UPLOAD_MEGABYTES} MB. Choose a standard photo instead of a RAW or ProRAW file.`
      : error?.message === "image-too-large-after-optimization"
        ? "We could not shrink that photo enough. Try cropping it or choose a different photo."
        : ["image-type", "image-load-failed", "canvas-unavailable"].includes(error?.message)
          ? "We could not read that photo format. Try a standard JPG, HEIC, PNG, or WebP photo."
          : "We could not finish that post. Check the details and try again.";
    setLocationFeedback(message, "error");
    toast(message);
  } finally {
    els.hostSubmitButton.disabled = false;
  }
}

function setView(view) {
  state.view = view;
  render();
  window.scrollTo({ top: 0, behavior: "auto" });
}

document.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-action], [data-view], [data-timing-filter], [data-type-filter], [data-vibe-filter], [data-auth-mode]");
  if (!target) return;

  if (target.dataset.view) {
    if (target.dataset.view === "host") {
      startNewPost();
    } else {
      setView(target.dataset.view);
    }
    return;
  }

  if ("typeFilter" in target.dataset) {
    state.activeType = target.dataset.typeFilter;
    render();
    return;
  }

  if ("timingFilter" in target.dataset) {
    state.activeTiming = target.dataset.timingFilter;
    render();
    return;
  }

  if ("vibeFilter" in target.dataset) {
    state.activeVibe = target.dataset.vibeFilter;
    render();
    return;
  }

  if (target.dataset.authMode) {
    state.authMode = target.dataset.authMode;
    updateAuthMode();
    return;
  }

  const action = target.dataset.action;
  if (action === "home") setView("discover");
  if (action === "focus-search") els.locationInput.focus();
  if (action === "apply-filters") await applyFilters();
  if (action === "explore-galveston") {
    state.location = "Galveston, TX";
    state.mapCenter = CITY_CENTERS["galveston, tx"];
    state.mapNeedsFit = true;
    state.activeType = "All";
    state.activeVibe = "All";
    state.activeTiming = "all";
    els.locationInput.value = state.location;
    setView("discover");
  }
  if (action === "use-profile") {
    const user = getCurrentUser();
    if (!user) {
      showAuth("signup");
    } else {
      state.location = user.city;
      state.mapCenter = knownCenterForLocation(user.city) || state.mapCenter;
      state.mapNeedsFit = true;
      els.locationInput.value = user.city;
      render();
    }
  }
  if (action === "open-profile") openProfile();
  if (action === "open-signup") showAuth("signup");
  if (action === "close-auth") els.authModal.close();
  if (action === "close-profile") els.profileModal.close();
  if (action === "toggle-save") await toggleSave(target.dataset.id);
  if (action === "open-detail") openDetail(target.dataset.id);
  if (action === "close-detail") els.detailModal.close();
  if (action === "show-on-map") showAdventureOnMap(target.dataset.id);
  if (action === "out-there-prev") updateOutThereSlideshow(state.outThereSlideIndex - 1);
  if (action === "out-there-next") updateOutThereSlideshow(state.outThereSlideIndex + 1);
  if (action === "out-there-slide") updateOutThereSlideshow(target.dataset.slideIndex);
  if (action === "edit-post") editPost(target.dataset.id);
  if (action === "delete-post") requestDeletePost(target.dataset.id);
  if (action === "cancel-delete") cancelDeletePost();
  if (action === "confirm-delete") await confirmDeletePost();
  if (action === "cancel-edit") {
    resetHostForm();
    state.view = "discover";
    render();
  }
  if (action === "toggle-theme") {
    const next = document.documentElement.dataset.theme === "light" ? "" : "light";
    document.documentElement.dataset.theme = next;
    store.set("vv_theme", next);
  }
  if (action === "sign-out") await signOut();
});

els.locationInput.addEventListener("input", (event) => {
  state.location = event.target.value;
  state.mapCenter = knownCenterForLocation(state.location) || state.mapCenter;
  clearTimeout(window.vvLocationFilterTimer);
  window.vvLocationFilterTimer = setTimeout(() => renderAdventures(), 180);
});

els.locationInput.addEventListener("keydown", async (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  await applyFilters();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest?.('.adventure-card[data-action="open-detail"]');
  if (!card || event.target !== card) return;
  event.preventDefault();
  openDetail(card.dataset.id);
});

document.addEventListener("error", (event) => {
  if (!(event.target instanceof HTMLImageElement)) return;
  event.target.classList.add("is-broken");
}, true);

els.authForm.addEventListener("submit", handleAuthSubmit);
els.profileForm.addEventListener("submit", saveProfile);
els.hostForm.addEventListener("submit", publishAdventure);
els.hostForm.addEventListener("change", (event) => {
  const input = event.target;
  if (input instanceof HTMLInputElement && input.name === "listingMode") {
    updateScheduleFields();
    return;
  }
  if (!(input instanceof HTMLInputElement) || input.name !== "vibes" || !input.checked) return;
  const selected = els.hostForm.querySelectorAll('input[name="vibes"]:checked');
  if (selected.length <= 3) return;
  input.checked = false;
  toast("Choose up to three vibes.");
});
els.hostForm.querySelectorAll('input[name="location"], input[name="city"]').forEach((input) => {
  input.addEventListener("input", () => {
    delete els.hostForm.dataset.approximateLocationKey;
    setLocationFeedback();
    updateHostFormMode();
  });
});

document.documentElement.dataset.theme = store.get("vv_theme", "");
resetHostForm();
render();

if (state.backendEnabled) {
  state.session = null;
  bootstrapSupabase().then(() => updateHostFormMode());
} else {
  const user = getCurrentUser();
  if (user) {
    state.location = user.city || "";
    state.mapCenter = knownCenterForLocation(state.location) || state.mapCenter;
    state.mapNeedsFit = true;
    els.locationInput.value = state.location;
  }
  repairHostedCoordinates().catch(() => {});
}
