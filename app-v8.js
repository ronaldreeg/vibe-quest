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

const TYPE_FILTERS = [...LISTING_TYPES, "Free"];

const VIBE_FILTERS = [
  "Local Lore",
  "Game On",
  "Chill",
  "Adventure",
  "Getaway",
  "Random",
  "Divey",
  "Hidden Gem",
  "Crafty",
  "Wholesome",
  "Spooky",
  "Bazaar",
  "Creative",
  "Curious",
  "Groovy",
  "Healthy",
  "Weird",
  "Country",
  "Club",
  "Underground",
  "Gig",
  "Flea",
  "Tasty",
  "Shindig",
  "Fest"
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
  "Pop-ups & Events": ["#f45077", "#fa622e"],
  Classes: ["#0f8fb1", "#f8d23d"],
  "Tours & Culture": ["#f6a938", "#f45077"],
  Markets: ["#f8d23d", "#0f8fb1"],
  "Food & Drink": ["#fc8a43", "#fa622e"],
  Groups: ["#f45077", "#0f8fb1"],
  "Arts & Music": ["#f45077", "#f6a938"],
  Outdoors: ["#0f8fb1", "#f6a938"],
  Wellness: ["#f3e9c4", "#0f8fb1"],
  Nightlife: ["#2f3035", "#f45077"],
  Random: ["#fc8a43", "#f3e9c4"]
};

const MARKER_STYLE = {
  "Pop-ups & Events": "#f45077",
  Classes: "#0f8fb1",
  "Tours & Culture": "#f6a938",
  Markets: "#f8d23d",
  "Food & Drink": "#fa622e",
  Groups: "#fc8a43",
  "Arts & Music": "#d93f68",
  Outdoors: "#087d9c",
  Wellness: "#d9cda6",
  Nightlife: "#7a4058",
  Random: "#8f7854",
  Free: "#536b57"
};

const VIBE_FILTER_STYLE = {
  "Local Lore": ["#f6a938", "#2f3035"],
  "Game On": ["#f45077", "#2f3035"],
  Chill: ["#0f8fb1", "#f3e9c4"],
  Adventure: ["#fa622e", "#2f3035"],
  Getaway: ["#087d9c", "#f3e9c4"],
  Random: ["#fc8a43", "#2f3035"],
  Divey: ["#8f7854", "#f3e9c4"],
  "Hidden Gem": ["#f8d23d", "#2f3035"],
  Crafty: ["#d93f68", "#f3e9c4"],
  Wholesome: ["#d9cda6", "#2f3035"],
  Spooky: ["#7a4058", "#f3e9c4"],
  Bazaar: ["#f6a938", "#2f3035"],
  Creative: ["#f45077", "#2f3035"],
  Curious: ["#0f8fb1", "#f3e9c4"],
  Groovy: ["#fc8a43", "#2f3035"],
  Healthy: ["#536b57", "#f3e9c4"],
  Weird: ["#fa622e", "#2f3035"],
  Country: ["#8f7854", "#f3e9c4"],
  Club: ["#f45077", "#2f3035"],
  Underground: ["#7a4058", "#f3e9c4"],
  Gig: ["#d93f68", "#f3e9c4"],
  Flea: ["#d9cda6", "#2f3035"],
  Tasty: ["#fa622e", "#2f3035"],
  Shindig: ["#f6a938", "#2f3035"],
  Fest: ["#f8d23d", "#2f3035"]
};

// Horizontal centers in the master icon sprite.
const QUEST_MARKS = [
  { key: "tent", label: "Tent", center: 29.8, centerY: 62 },
  { key: "paddle-ball", label: "Flashlight", center: 89.8, centerY: 62.5 },
  { key: "party-popper", label: "Party popper", center: 154.2, centerY: 62.5 },
  { key: "bowl", label: "Cowboy hat", center: 223.8, centerY: 62.5 },
  { key: "beer-mug", label: "Beer mug", center: 294.6, centerY: 60.5 },
  { key: "sparkles", label: "Sparkles", center: 347.6, centerY: 61 },
  { key: "gift", label: "Portal", center: 402.6, centerY: 62.5 },
  { key: "key", label: "Key", center: 460.8, centerY: 63 },
  { key: "finish-flag", label: "Finish flag", center: 519.8, centerY: 63 },
  { key: "skull", label: "Paw print", center: 580.8, centerY: 61.5 },
  { key: "bicycle", label: "Bicycle", center: 646.2, centerY: 65 },
  { key: "lounge-chair", label: "Lounge chair", center: 720.6, centerY: 60 },
  { key: "ghost", label: "Secret emoji", center: 784, centerY: 63.5 },
  { key: "dice", label: "Dice", center: 848.4, centerY: 63 },
  { key: "music-note", label: "Music note", center: 913, centerY: 63 },
  { key: "taco", label: "Skateboard", center: 981, centerY: 66 },
  { key: "apple", label: "Apple", center: 1042.8, centerY: 60 },
  { key: "artist-palette", label: "Artist palette", center: 1100.2, centerY: 62 },
  { key: "typewriter", label: "Scroll", center: 1158.4, centerY: 61.5 },
  { key: "baseball", label: "Baseball", center: 1218.4, centerY: 63.5 },
  { key: "sword", label: "Sword", center: 1270.8, centerY: 64 },
  { key: "mushroom", label: "Mushroom", center: 1324.4, centerY: 65 },
  { key: "dumbbell", label: "Dumbbell", center: 1384, centerY: 64 },
  { key: "market-bag", label: "Coin purse", center: 1438.2, centerY: 65 },
  { key: "craft-tools", label: "Pointer finger", center: 1482.4, centerY: 63 },
  { key: "table-tennis", label: "Paddle", center: 1532, centerY: 63 },
  { key: "cheese", label: "Compass", center: 1592.4, centerY: 62.5 },
  { key: "hot-dog", label: "Hot dog", center: 1646.8, centerY: 64.5 },
  { key: "map", label: "Gem", center: 1704.6, centerY: 62.5 },
  { key: "bird", label: "Bird", center: 1761, centerY: 65 },
  { key: "cooking-pot", label: "Pottery", center: 1818, centerY: 65 },
  { key: "arcade", label: "Treasure", center: 1878, centerY: 66 },
  { key: "ship", label: "Boat", center: 1944.8, centerY: 62 },
  { key: "lightning", label: "Lightning", center: 2006.8, centerY: 63 },
  { key: "cassette", label: "Cassette", center: 2068, centerY: 64.5 },
  { key: "laptop", label: "Laptop", center: 2135.8, centerY: 63.5 },
  { key: "alien", label: "Ghost", center: 2201, centerY: 61.5 },
  { key: "puzzle", label: "Puzzle piece", center: 2265, centerY: 59 },
  { key: "horse", label: "Horse", center: 2326.8, centerY: 60.5 },
  { key: "trophy", label: "Trophy", center: 2385, centerY: 61.5 },
  { key: "feather", label: "Corn", center: 2448, centerY: 61.5 },
  { key: "roller-skate", label: "Roller skate", center: 2505.6, centerY: 59.5 },
  { key: "film-strip", label: "Film strip", center: 2564.2, centerY: 61 },
  { key: "magic-wand", label: "Magic wand", center: 2622, centerY: 61 },
  { key: "playground-slide", label: "Jersey", center: 2668.5, centerY: 61 },
  { key: "shopping-cart", label: "Shopping cart", center: 2719.5, centerY: 60.5 },
  { key: "arcade-machine", label: "Alert", center: 2762.5, centerY: 61.5 },
  { key: "barber-pole", label: "Barber pole", center: 2805.5, centerY: 61.5 },
  { key: "ufo", label: "UFO", center: 2848.5, centerY: 62 },
  { key: "knitting", label: "Knitting", center: 2892.9, centerY: 62.75 },
  { key: "fork-knife", label: "Fork and knife", center: 2928.7, centerY: 61.4 },
  { key: "unicorn", label: "Unicorn", center: 2968.7, centerY: 60.4 },
  { key: "night-owl", label: "Night owl", center: 3009.7, centerY: 60.9 },
  { key: "camera", label: "Camera", center: 3046.3, centerY: 61.1 },
  { key: "vintage-shirt", label: "Vintage shirt", center: 3078.8, centerY: 61.75 }
];

// Longest painted edge in the source sprite, used to equalize visual weight.
const QUEST_MARK_ART_SIZE = {
  tent: 50.75,
  "paddle-ball": 49.5,
  "party-popper": 44.75,
  bowl: 55.5,
  "beer-mug": 47,
  sparkles: 40.25,
  gift: 43.25,
  key: 46,
  "finish-flag": 46.5,
  skull: 44,
  bicycle: 62.25,
  "lounge-chair": 50.25,
  ghost: 44.25,
  dice: 48.25,
  "music-note": 47,
  taco: 50.75,
  apple: 50.75,
  "artist-palette": 43,
  typewriter: 43.5,
  baseball: 43.25,
  sword: 44,
  mushroom: 45,
  dumbbell: 49.5,
  "market-bag": 36.5,
  "craft-tools": 45.5,
  "table-tennis": 46.25,
  cheese: 41.5,
  "hot-dog": 43.75,
  map: 39.75,
  bird: 43,
  "cooking-pot": 41,
  arcade: 39.5,
  ship: 52,
  lightning: 40.5,
  cassette: 44.25,
  laptop: 46,
  alien: 45.5,
  puzzle: 42.5,
  horse: 42.75,
  trophy: 37.25,
  feather: 41.5,
  "roller-skate": 43.75,
  "film-strip": 40.75,
  "magic-wand": 38.75,
  "playground-slide": 36.75,
  "shopping-cart": 36,
  "arcade-machine": 33.25,
  "barber-pole": 33.75,
  ufo: 41,
  knitting: 28.25,
  "fork-knife": 30.75,
  unicorn: 30.75,
  "night-owl": 30.75,
  camera: 27.5,
  "vintage-shirt": 28
};

const QUEST_MARK_REFERENCE_SIZE = QUEST_MARK_ART_SIZE.tent;

const QUEST_MARK_BY_KEY = new Map(QUEST_MARKS.map((mark) => [mark.key, mark]));

const VIBE_ICON_KEY = {
  "Local Lore": "typewriter",
  "Game On": "trophy",
  Chill: "lounge-chair",
  Adventure: "sword",
  Getaway: "cheese",
  Random: "dice",
  Divey: "beer-mug",
  "Hidden Gem": "map",
  Crafty: "knitting",
  Wholesome: "apple",
  Spooky: "alien",
  Bazaar: "market-bag",
  Creative: "artist-palette",
  Curious: "puzzle",
  Groovy: "cassette",
  Healthy: "dumbbell",
  Weird: "unicorn",
  Country: "horse",
  Club: "sparkles",
  Underground: "gift",
  Gig: "music-note",
  Flea: "vintage-shirt",
  Tasty: "fork-knife",
  Shindig: "party-popper",
  Fest: "tent"
};

const TYPE_ICON_KEY = {
  "Pop-ups & Events": "party-popper",
  Classes: "typewriter",
  "Tours & Culture": "cheese",
  Markets: "market-bag",
  "Food & Drink": "fork-knife",
  Groups: "sparkles",
  "Arts & Music": "artist-palette",
  Outdoors: "tent",
  Wellness: "apple",
  Nightlife: "night-owl",
  Random: "dice"
};

const VIBE_ICON_SPRITE_HEIGHT = 40;
const VIBE_ICON_MAX_WIDTH = 20;
const VIBE_ICON_CROP_HEIGHT = 20;
const QUEST_MARK_PICKER_SPRITE_HEIGHT = 72;
const QUEST_MARK_PICKER_MAX_WIDTH = 44;
const QUEST_MARK_PICKER_CROP_HEIGHT = 54;

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
  Chill: ["Chill"],
  Thrill: ["Adventure"],
  Foodie: ["Local Lore"],
  Artsy: ["Creative"],
  Social: ["Groovy"],
  Nature: ["Adventure", "Healthy"]
};

const LEGACY_VIBE_LABEL_MAP = {
  "Low-key": "Chill",
  Easygoing: "Chill",
  Lively: "Groovy",
  Buzzing: "Groovy",
  Social: "Groovy",
  "Meet People": "Groovy",
  Creative: "Creative",
  "Make Something": "Crafty",
  Active: "Healthy",
  "Get Moving": "Healthy",
  Curious: "Curious",
  Offbeat: "Weird",
  "Wonder Hunt": "Curious",
  "Side Quest": "Weird",
  "Date Night": "Getaway",
  "Date Quest": "Getaway",
  "Date-worthy": "Getaway",
  "Solo Quest": "Curious",
  "Solo-friendly": "Curious",
  Play: "Game On",
  "Game On": "Game On",
  "Local Lore": "Local Lore",
  "Local Flavor": "Local Lore",
  "Swap Meet": "Underground",
  Expedition: "Fest"
};

const CITY_CENTERS = {
  galveston: [29.3013, -94.7977],
  "galveston, tx": [29.3013, -94.7977],
  houston: [29.7604, -95.3698],
  "houston, tx": [29.7604, -95.3698],
  austin: [30.2672, -97.7431],
  "austin, tx": [30.2672, -97.7431],
  marfa: [30.3095, -104.0206],
  "marfa, tx": [30.3095, -104.0206]
};

const DEFAULT_MAP_CENTER = [39.8283, -98.5795];
const LOCATION_STORAGE_KEY = "vv_location_preference";
const PUBLIC_SITE_URL = "https://www.vibe-quest.net/";
const SHARED_ACTIVITY_PARAM = "activity";

const DEFAULT_ADVENTURES = [
  {
    id: "sunset-paddle",
    title: "Sunset Paddle Meet-up",
    city: "Galveston, TX",
    area: "East End Lagoon",
    category: "Outdoors",
    type: "Outdoors",
    vibes: ["Adventure", "Chill", "Local Lore"],
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
    vibes: ["Local Lore", "Hidden Gem", "Getaway"],
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
    vibes: ["Crafty", "Creative", "Curious"],
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
    vibes: ["Chill", "Local Lore", "Hidden Gem"],
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
    vibes: ["Groovy", "Getaway", "Divey"],
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
    vibes: ["Adventure", "Weird", "Game On"],
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
    vibes: ["Bazaar", "Wholesome", "Local Lore"],
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
    vibes: ["Chill", "Curious", "Wholesome"],
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
    id: "marfa-night-signal",
    title: "Marfa Night Signal",
    city: "Marfa, TX",
    area: "Downtown Marfa",
    category: "Arts & Music",
    type: "Arts & Music",
    vibes: ["Weird", "Hidden Gem", "Local Lore"],
    price: "Free",
    seats: 24,
    distance: 375,
    lat: 30.3095,
    lng: -104.0206,
    photo: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1200&q=80",
    host: "Vibe Quest Field Office",
    description: "A dusk listening session with desert field recordings, short stories, and a clear view of the high-country sky.",
    links: [],
    x: 31,
    y: 43
  },
  {
    id: "porch-sale-trail",
    title: "East End Porch Sale Trail",
    city: "Galveston, TX",
    area: "East End Historic District",
    category: "Markets",
    type: "Markets",
    vibes: ["Bazaar", "Hidden Gem", "Local Lore"],
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
    vibes: ["Spooky", "Local Lore", "Curious"],
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
    vibes: ["Crafty", "Creative", "Wholesome"],
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
    vibes: ["Healthy", "Game On", "Adventure"],
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
  activeTypes: [],
  activeVibes: [],
  location: "",
  locationSource: "",
  locationStatus: "idle",
  locationIntentVersion: 0,
  mapCenter: DEFAULT_MAP_CENTER,
  mapNeedsFit: true,
  mapBounds: null,
  mapBrowseActive: false,
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

const REMOTE_ACTIVITY_LIMIT = 250;
const MAP_QUERY_PADDING_RATIO = 0.75;
const MAX_CACHED_MAP_AREAS = 12;
const DISCOVERY_AREA_ZOOM = 9;
let cachedRemoteMapAreas = [];

let lastRolledAdventureId = "";

const els = {
  topbar: document.querySelector(".topbar"),
  mobileNavToggle: document.querySelector(".mobile-nav-toggle"),
  mobileNavPanel: document.querySelector(".mobile-nav-panel"),
  navTabs: document.querySelectorAll(".nav-tab"),
  locationInput: document.querySelector("#locationInput"),
  locationButton: document.querySelector(".location-button"),
  timingFilters: document.querySelector("#timingFilters"),
  typeFilters: document.querySelector("#typeFilters"),
  vibeFilters: document.querySelector("#vibeFilters"),
  adventureGrid: document.querySelector("#adventureGrid"),
  savedGrid: document.querySelector("#savedGrid"),
  realMap: document.querySelector("#realMap"),
  mapInteractionButton: document.querySelector(".map-interaction-button"),
  mapInteractionLabel: document.querySelector("[data-map-interaction-label]"),
  legendCount: document.querySelector("#legendCount"),
  resultsMeta: document.querySelector("#resultsMeta"),
  resultsTitle: document.querySelector("#resultsTitle"),
  savedView: document.querySelector("#savedView"),
  outThereView: document.querySelector("#outThereView"),
  outThereSlideCount: document.querySelector("#outThereSlideCount"),
  hostView: document.querySelector("#hostView"),
  shareView: document.querySelector("#shareView"),
  profilePills: document.querySelectorAll(".profile-pill"),
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
  questMarkInput: document.querySelector("#questMarkInput"),
  questMarkSuggestions: document.querySelector("#questMarkSuggestions"),
  questMarkBank: document.querySelector("#questMarkBank"),
  questMarkBrowserToggle: document.querySelector("#questMarkBrowserToggle"),
  questMarkSuggestedButton: document.querySelector("#questMarkSuggestedButton"),
  questMarkPreviewPin: document.querySelector("#questMarkPreviewPin"),
  questMarkPreviewIcon: document.querySelector("#questMarkPreviewIcon"),
  questMarkPreviewLabel: document.querySelector("#questMarkPreviewLabel"),
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
  const center = knownCenterForLocation(normalizedAdventure.city) || DEFAULT_MAP_CENTER;
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
    iconKey: row.icon_key || "",
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

async function hydrateRemoteActivities(rows) {
  const activities = Array.isArray(rows) ? rows : [];
  const ids = activities.map((row) => row.id);
  const ownerIds = [...new Set(activities.map((row) => row.owner_id).filter(Boolean))];
  const [linksResult, profilesResult] = await Promise.all([
    ids.length
      ? window.vvSupabase.from("activity_links").select("*").in("activity_id", ids)
      : Promise.resolve({ data: [], error: null }),
    ownerIds.length
      ? window.vvSupabase.from("profiles").select("id, display_name").in("id", ownerIds)
      : Promise.resolve({ data: [], error: null })
  ]);
  if (linksResult.error) throw linksResult.error;
  if (profilesResult.error) throw profilesResult.error;
  const profileMap = new Map((profilesResult.data || []).map((profile) => [profile.id, profile]));
  return activities.map((row) => mapRemoteActivity(row, linksResult.data || [], profileMap));
}

function mergeRemoteActivities(activities) {
  const byId = new Map(state.remoteActivities.map((activity) => [activity.id, activity]));
  activities.forEach((activity) => byId.set(activity.id, activity));
  state.remoteActivities = [...byId.values()].sort((first, second) => (
    new Date(second.createdAt || 0).getTime() - new Date(first.createdAt || 0).getTime()
  ));
}

async function loadRemoteActivities({ bounds = null, merge = false } = {}) {
  if (!state.backendEnabled) return;
  let query = window.vvSupabase
    .from("activities")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(REMOTE_ACTIVITY_LIMIT);

  if (bounds) {
    query = query
      .gte("latitude", bounds.south)
      .lte("latitude", bounds.north);
    query = bounds.west <= bounds.east
      ? query.gte("longitude", bounds.west).lte("longitude", bounds.east)
      : query.or(`longitude.gte.${bounds.west},longitude.lte.${bounds.east}`);
  }

  const { data: rows, error } = await query;
  if (error) throw error;
  const activities = await hydrateRemoteActivities(rows);
  if (merge) mergeRemoteActivities(activities);
  else {
    state.remoteActivities = activities;
    cachedRemoteMapAreas = [];
  }
  return activities;
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
  prepareMapFocus(knownCenterForLocation(state.location) || state.mapCenter);
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

function matchesActiveTypes(adventure) {
  if (state.activeTypes.length === 0) return true;
  return state.activeTypes.includes(getListingType(adventure))
    || (state.activeTypes.includes("Free") && isFreeListing(adventure));
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
  return [...new Set([...migrated, ...legacy])].filter((vibe) => VIBE_FILTERS.includes(vibe));
}

function defaultQuestMarkKey(vibes, type) {
  return vibes.map((vibe) => VIBE_ICON_KEY[vibe]).find((key) => QUEST_MARK_BY_KEY.has(key))
    || TYPE_ICON_KEY[type]
    || "puzzle";
}

function suggestedQuestMarkKeys(vibes, type) {
  return [...new Set([
    ...vibes.map((vibe) => VIBE_ICON_KEY[vibe]),
    TYPE_ICON_KEY[type],
    "sparkles",
    "key",
    "map",
    "dice"
  ])]
    .filter((key) => QUEST_MARK_BY_KEY.has(key))
    .slice(0, 3);
}

function getAdventureQuestMarkKey(adventure) {
  const storedKey = String(adventure.iconKey || adventure.icon_key || "");
  if (QUEST_MARK_BY_KEY.has(storedKey)) return storedKey;
  return defaultQuestMarkKey(getListingVibes(adventure), getListingType(adventure));
}

function questMarkSpriteMetrics(mark, spriteHeight, maxWidth, cropHeight) {
  const index = QUEST_MARKS.indexOf(mark);
  const previousGap = index > 0 ? mark.center - QUEST_MARKS[index - 1].center : Infinity;
  const nextGap = index < QUEST_MARKS.length - 1 ? QUEST_MARKS[index + 1].center - mark.center : Infinity;
  const artSize = QUEST_MARK_ART_SIZE[mark.key] || QUEST_MARK_REFERENCE_SIZE;
  const scale = (spriteHeight / 115.56) * (QUEST_MARK_REFERENCE_SIZE / artSize);
  const safeWidth = Math.min(previousGap, nextGap) * scale;
  const width = Math.min(maxWidth, Number.isFinite(safeWidth) ? safeWidth : maxWidth);
  return {
    width,
    backgroundHeight: 115.56 * scale,
    offsetX: width / 2 - mark.center * scale,
    offsetY: cropHeight / 2 - mark.centerY * scale
  };
}

function matchesActiveTiming(adventure) {
  const bucket = getListingSchedule(adventure).bucket;
  return state.activeTiming === "all" ? bucket !== "expired" : bucket === state.activeTiming;
}

function matchesCurrentLocation(adventure) {
  const location = normalize(state.location);
  if (!location) return true;
  return normalize(adventure.city).includes(location) || normalize(adventure.area).includes(location);
}

function isWithinMapBounds(adventure, bounds) {
  const latitude = Number(adventure.lat);
  const longitude = Number(adventure.lng);
  if (!bounds || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return false;
  const withinLongitude = bounds.west <= bounds.east
    ? longitude >= bounds.west && longitude <= bounds.east
    : longitude >= bounds.west || longitude <= bounds.east;
  return latitude >= bounds.south && latitude <= bounds.north && withinLongitude;
}

function matchesDiscoveryArea(adventure) {
  if (state.mapBrowseActive && state.mapBounds && !state.mapNeedsFit) {
    return isWithinMapBounds(adventure, state.mapBounds);
  }
  return matchesCurrentLocation(adventure);
}

function discoveryCandidates() {
  return getAdventures()
    .filter(matchesActiveTiming)
    .filter(matchesActiveTypes)
    .filter((adventure) => {
      if (state.activeVibes.length === 0) return true;
      const listingVibes = getListingVibes(adventure);
      return state.activeVibes.some((vibe) => listingVibes.includes(vibe));
    })
    .sort((a, b) => listingRank(a) - listingRank(b));
}

function rollTheDice() {
  const candidates = getAdventures()
    .filter(matchesActiveTiming)
    .filter(matchesDiscoveryArea);

  if (candidates.length === 0) {
    toast(state.mapBrowseActive
      ? "No adventures are pinned in this map area yet. Try zooming out."
      : state.location
      ? `No adventures are ready to roll near ${state.location} yet.`
      : "No adventures are ready to roll yet.");
    return;
  }

  const pool = candidates.length > 1
    ? candidates.filter((adventure) => adventure.id !== lastRolledAdventureId)
    : candidates;
  const choice = pool[Math.floor(Math.random() * pool.length)];
  lastRolledAdventureId = choice.id;
  openDetail(choice.id);
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

async function encodeCanvasPhoto(canvas, quality) {
  const webp = await canvasToBlob(canvas, "image/webp", quality);
  if (webp?.type === "image/webp" && webp.size <= MAX_STORED_PHOTO_BYTES) return webp;

  const jpeg = await canvasToBlob(canvas, "image/jpeg", quality);
  const candidates = [webp, jpeg]
    .filter((blob) => blob && ["image/webp", "image/jpeg"].includes(blob.type))
    .sort((first, second) => first.size - second.size);
  return candidates[0] || null;
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

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("canvas-unavailable");

    let blob = null;
    let previousSize = "";
    for (const maxDimension of [1600, 1400, 1200, 1000, 800]) {
      const scale = Math.min(1, maxDimension / Math.max(sourceWidth, sourceHeight));
      const width = Math.max(1, Math.round(sourceWidth * scale));
      const height = Math.max(1, Math.round(sourceHeight * scale));
      const sizeKey = `${width}x${height}`;
      if (sizeKey === previousSize) continue;
      previousSize = sizeKey;

      canvas.width = width;
      canvas.height = height;
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);

      for (const quality of [0.82, 0.68, 0.54, 0.4, 0.3]) {
        blob = await encodeCanvasPhoto(canvas, quality);
        if (blob && blob.size <= MAX_STORED_PHOTO_BYTES) return fileToDataUrl(blob);
      }
    }
    throw new Error("image-too-large-after-optimization");
  } finally {
    URL.revokeObjectURL(source);
  }
}

function styleVars(source) {
  const type = typeof source === "string" ? source : getListingType(source);
  const [a, b] = TYPE_STYLE[type] || TYPE_STYLE["Pop-ups & Events"];
  return `--card-a:${a};--card-b:${b};--pin-color:${a}`;
}

function typeFilterMarkup(activeTypes, dataAttribute) {
  return ["All", ...TYPE_FILTERS].map((type) => {
    const markerColor = MARKER_STYLE[type];
    const active = type === "All" ? activeTypes.length === 0 : activeTypes.includes(type);
    return `
    <button
      class="chip type-chip ${type === "All" ? "type-all" : ""} ${active ? "is-active" : ""}"
      data-${dataAttribute}="${escapeHtml(type)}"
      aria-pressed="${active}"
      ${markerColor ? `style="--type-color:${markerColor}"` : ""}
    >
      ${escapeHtml(type)}
    </button>
  `;
  }).join("");
}

function vibeFilterMarkup(activeVibes, dataAttribute) {
  return ["All", ...VIBE_FILTERS].map((vibe) => {
    const [background, text] = VIBE_FILTER_STYLE[vibe] || [];
    const active = vibe === "All" ? activeVibes.length === 0 : activeVibes.includes(vibe);
    return `
      <button
        class="chip vibe-chip ${vibe === "All" ? "vibe-all" : ""} ${active ? "is-active" : ""}"
        data-${dataAttribute}="${escapeHtml(vibe)}"
        aria-pressed="${active}"
        ${background ? `style="--vibe-color:${background};--vibe-text:${text}"` : ""}
      >
        ${escapeHtml(vibe)}
      </button>
    `;
  }).join("");
}

function toggleFilterValue(values, value) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function renderFilters() {
  els.timingFilters.querySelectorAll("[data-timing-filter]").forEach((button) => {
    const active = button.dataset.timingFilter === state.activeTiming;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  els.typeFilters.innerHTML = typeFilterMarkup(state.activeTypes, "type-filter");
  els.vibeFilters.innerHTML = vibeFilterMarkup(state.activeVibes, "vibe-filter");
}

function adventureCard(adventure) {
  const saved = getSavedIds().includes(adventure.id);
  const type = getListingType(adventure);
  const vibes = getListingVibes(adventure).slice(0, 3);
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
let mobileMapInteractionEnabled = false;
const compactMapQuery = window.matchMedia("(max-width: 900px), (pointer: coarse)");
const MAX_MAP_MARKERS = 150;
let mapPinchDelta = 0;
let mapPinchResetTimer;
let mapViewportRenderTimer;
let suppressMapViewportSync = false;
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

function prepareMapFocus(center = state.mapCenter) {
  if (Array.isArray(center) && center.length === 2) state.mapCenter = center;
  state.mapBounds = null;
  state.mapBrowseActive = false;
  state.mapNeedsFit = true;
}

function visibleMapBounds() {
  if (!map) return null;
  const bounds = map.getBounds();
  if (!bounds?.isValid()) return null;
  return {
    south: bounds.getSouth(),
    west: bounds.getWest(),
    north: bounds.getNorth(),
    east: bounds.getEast()
  };
}

function wrapLongitude(value) {
  return ((value + 180) % 360 + 360) % 360 - 180;
}

function expandMapBounds(bounds, ratio = MAP_QUERY_PADDING_RATIO) {
  const latitudeSpan = Math.max(0.01, bounds.north - bounds.south);
  const longitudeSpan = bounds.west <= bounds.east
    ? Math.max(0.01, bounds.east - bounds.west)
    : Math.max(0.01, 360 - bounds.west + bounds.east);
  const expandedLongitudeSpan = Math.min(360, longitudeSpan * (1 + ratio * 2));
  const longitudeCenter = wrapLongitude(bounds.west + longitudeSpan / 2);

  return {
    south: Math.max(-90, bounds.south - latitudeSpan * ratio),
    west: expandedLongitudeSpan >= 360
      ? -180
      : wrapLongitude(longitudeCenter - expandedLongitudeSpan / 2),
    north: Math.min(90, bounds.north + latitudeSpan * ratio),
    east: expandedLongitudeSpan >= 360
      ? 180
      : wrapLongitude(longitudeCenter + expandedLongitudeSpan / 2)
  };
}

function longitudeRanges(bounds) {
  if (bounds.west <= bounds.east) return [[bounds.west, bounds.east]];
  return [[bounds.west, 180], [-180, bounds.east]];
}

function mapBoundsContain(outer, inner) {
  if (!outer || !inner || outer.south > inner.south || outer.north < inner.north) return false;
  const outerRanges = longitudeRanges(outer);
  return longitudeRanges(inner).every(([innerWest, innerEast]) => (
    outerRanges.some(([outerWest, outerEast]) => outerWest <= innerWest && outerEast >= innerEast)
  ));
}

async function loadRemoteActivitiesForMap(bounds) {
  if (!state.backendEnabled || !bounds) return false;
  const queryBounds = expandMapBounds(bounds);
  if (cachedRemoteMapAreas.some((area) => mapBoundsContain(area, bounds))) return false;

  cachedRemoteMapAreas.push(queryBounds);
  cachedRemoteMapAreas = cachedRemoteMapAreas.slice(-MAX_CACHED_MAP_AREAS);
  try {
    const activities = await loadRemoteActivities({ bounds: queryBounds, merge: true });
    return activities.length > 0;
  } catch (error) {
    cachedRemoteMapAreas = cachedRemoteMapAreas.filter((area) => area !== queryBounds);
    console.warn("Could not refresh activities for this map area.", error);
    return false;
  }
}

function mapBoundsMatch(first, second) {
  if (!first || !second) return false;
  return ["south", "west", "north", "east"]
    .every((edge) => Math.abs(first[edge] - second[edge]) < 0.000001);
}

function syncResultsToMapViewport({ force = false } = {}) {
  if (!map || suppressMapViewportSync || state.view !== "discover") return;
  const nextBounds = visibleMapBounds();
  if (!nextBounds) return;
  if (!force && state.mapBrowseActive && mapBoundsMatch(state.mapBounds, nextBounds)) return;

  const center = map.getCenter();
  state.mapBounds = nextBounds;
  state.mapBrowseActive = true;
  state.locationSource = "map";
  state.mapCenter = [center.lat, center.lng];
  renderAdventures();
  loadRemoteActivitiesForMap(nextBounds).then((foundActivities) => {
    if (foundActivities && state.view === "discover") renderAdventures();
  });
}

function scheduleMapViewportSync() {
  if (suppressMapViewportSync || state.view !== "discover") return;
  window.clearTimeout(mapViewportRenderTimer);
  mapViewportRenderTimer = window.setTimeout(() => syncResultsToMapViewport(), 90);
}

function updateMapInteractionMode(enabled = mobileMapInteractionEnabled) {
  const compact = compactMapQuery.matches;
  mobileMapInteractionEnabled = compact && Boolean(enabled);

  if (map) {
    map.scrollWheelZoom.disable();
    if (compact && !mobileMapInteractionEnabled) {
      map.dragging.disable();
      map.touchZoom.disable();
    } else {
      map.dragging.enable();
      map.touchZoom.enable();
    }
  }

  const mapBoard = els.realMap?.closest(".hero-map");
  mapBoard?.classList.toggle("is-page-scroll-mode", compact && !mobileMapInteractionEnabled);
  mapBoard?.classList.toggle("is-map-interaction-mode", compact && mobileMapInteractionEnabled);

  if (els.mapInteractionButton) {
    els.mapInteractionButton.hidden = !compact;
    els.mapInteractionButton.classList.toggle("is-active", mobileMapInteractionEnabled);
    els.mapInteractionButton.setAttribute("aria-pressed", mobileMapInteractionEnabled ? "true" : "false");
    els.mapInteractionButton.setAttribute(
      "aria-label",
      mobileMapInteractionEnabled ? "Stop moving the map and scroll the page" : "Enable map movement"
    );
  }
  if (els.mapInteractionLabel) {
    els.mapInteractionLabel.textContent = mobileMapInteractionEnabled ? "Scroll page" : "Move map";
  }
}

function handleMapPinchZoom(event) {
  if (!map || compactMapQuery.matches || !event.ctrlKey) return;
  event.preventDefault();
  window.clearTimeout(mapPinchResetTimer);
  mapPinchDelta += event.deltaY;
  mapPinchResetTimer = window.setTimeout(() => {
    mapPinchDelta = 0;
  }, 140);
  if (Math.abs(mapPinchDelta) < 18) return;

  const zoomDirection = mapPinchDelta < 0 ? 1 : -1;
  const nextZoom = Math.max(map.getMinZoom(), Math.min(map.getMaxZoom(), map.getZoom() + zoomDirection));
  map.setZoomAround(map.mouseEventToContainerPoint(event), nextZoom);
  mapPinchDelta = 0;
}

const VECTOR_MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/dark";
const VECTOR_MAP_PAINT = [
  ["background", "background-color", "#2f3035"],
  ["water", "fill-color", "#143f4b"],
  ["waterway", "line-color", "#1b5969"],
  ["waterway", "line-opacity", 0.5],
  ["landuse_park", "fill-color", "#263a34"],
  ["landuse_park", "fill-opacity", 0.72],
  ["landuse_residential", "fill-color", "#2b2d32"],
  ["landuse_residential", "fill-opacity", 0.24],
  ["road_area_pier", "fill-color", "#36383d"],
  ["road_pier", "line-color", "#626064"],
  ["road_pier", "line-opacity", 0.42],
  ["highway_minor", "line-color", "#53636a"],
  ["highway_minor", "line-opacity", 0.36],
  ["highway_minor", "line-width", ["interpolate", ["linear"], ["zoom"], 16, 0.55, 18, 1.4, 20, 2.2]],
  ["highway_major_casing", "line-color", "#20252a"],
  ["highway_major_inner", "line-color", "#0f8fb1"],
  ["highway_major_inner", "line-opacity", 0.88],
  ["highway_major_subtle", "line-color", "#0b6f89"],
  ["highway_major_subtle", "line-opacity", 0.42],
  ["highway_motorway_casing", "line-color", "#3a2420"],
  ["highway_motorway_inner", "line-color", "#fa622e"],
  ["highway_motorway_inner", "line-opacity", 0.92],
  ["highway_motorway_subtle", "line-color", "#b94726"],
  ["highway_name_other", "text-color", "#d8d1b4"],
  ["highway_name_other", "text-opacity", 0.72],
  ["highway_name_other", "text-halo-color", "#2f3035"],
  ["highway_name_other", "text-halo-width", 1.5],
  ["highway_name_motorway", "text-color", "#f8d23d"],
  ["highway_name_motorway", "text-halo-color", "#2f3035"],
  ["place_town", "text-color", "#f3e9c4"],
  ["place_city", "text-color", "#f8d23d"],
  ["place_city_large", "text-color", "#f8d23d"],
  ["boundary_state", "line-color", "#495057"],
  ["boundary_state", "line-opacity", 0.28]
];

const VECTOR_MAP_HIDDEN_LAYERS = [
  "landcover_wood",
  "water_name",
  "building",
  "aeroway-area",
  "aeroway-taxiway",
  "aeroway-runway-casing",
  "aeroway-runway",
  "highway_path",
  "road_oneway",
  "road_oneway_opposite",
  "railway_transit",
  "railway_transit_dashline",
  "railway_minor",
  "railway_minor_dashline",
  "railway",
  "railway_dashline",
  "place_other",
  "place_suburb",
  "place_village",
  "place_state",
  "place_country_other",
  "place_country_minor"
];

const VECTOR_MAP_ZOOM_RANGES = [
  ["highway_minor", 16, 24],
  ["highway_name_other", 15, 24]
];

const VECTOR_MAP_MAJOR_ROAD_FILTER = [
  "all",
  ["match", ["geometry-type"], ["LineString", "MultiLineString"], true, false],
  ["match", ["get", "class"], ["primary", "secondary", "trunk"], true, false]
];

const VECTOR_MAP_FILTERS = [
  [
    "highway_minor",
    [
      "all",
      ["match", ["geometry-type"], ["LineString", "MultiLineString"], true, false],
      ["==", ["get", "class"], "minor"]
    ]
  ],
  ["highway_major_casing", VECTOR_MAP_MAJOR_ROAD_FILTER],
  ["highway_major_inner", VECTOR_MAP_MAJOR_ROAD_FILTER],
  ["highway_major_subtle", VECTOR_MAP_MAJOR_ROAD_FILTER],
  ["highway_name_other", VECTOR_MAP_MAJOR_ROAD_FILTER]
];

function addRasterBasemap() {
  els.realMap.classList.remove("uses-vector-basemap");
  els.realMap.classList.add("uses-raster-basemap");
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);
}

function styleVectorBasemap(vectorMap) {
  VECTOR_MAP_PAINT.forEach(([layerId, property, value]) => {
    if (vectorMap.getLayer(layerId)) vectorMap.setPaintProperty(layerId, property, value);
  });
  VECTOR_MAP_HIDDEN_LAYERS.forEach((layerId) => {
    if (vectorMap.getLayer(layerId)) vectorMap.setLayoutProperty(layerId, "visibility", "none");
  });
  VECTOR_MAP_ZOOM_RANGES.forEach(([layerId, minZoom, maxZoom]) => {
    if (vectorMap.getLayer(layerId)) vectorMap.setLayerZoomRange(layerId, minZoom, maxZoom);
  });
  VECTOR_MAP_FILTERS.forEach(([layerId, filter]) => {
    if (vectorMap.getLayer(layerId)) vectorMap.setFilter(layerId, filter);
  });
}

function addPrimaryBasemap() {
  if (typeof L.maplibreGL !== "function") {
    addRasterBasemap();
    return;
  }

  try {
    els.realMap.classList.remove("uses-raster-basemap");
    els.realMap.classList.add("uses-vector-basemap");
    const vectorLayer = L.maplibreGL({
      style: VECTOR_MAP_STYLE_URL,
      interactive: false
    }).addTo(map);
    const vectorMap = vectorLayer.getMaplibreMap();
    vectorMap.on("styleimagemissing", (event) => {
      if (vectorMap.hasImage(event.id)) return;
      if (event.id === "circle-11") {
        vectorMap.addImage(event.id, { width: 1, height: 1, data: new Uint8Array([0, 0, 0, 0]) });
      }
      if (event.id === "wood-pattern") {
        vectorMap.addImage(event.id, { width: 1, height: 1, data: new Uint8Array([24, 37, 31, 255]) });
      }
    });
    vectorMap.once("load", () => styleVectorBasemap(vectorMap));
  } catch (error) {
    console.warn("Vector basemap unavailable; using the raster fallback.", error);
    addRasterBasemap();
  }
}

function initMap() {
  if (map || !els.realMap) return Boolean(map);
  if (!window.L) {
    els.realMap.innerHTML = `<div class="map-fallback">Map tiles are loading. Listings still work below.</div>`;
    return false;
  }
  map = L.map(els.realMap, {
    zoomControl: false,
    scrollWheelZoom: false,
    touchZoom: !compactMapQuery.matches,
    dragging: !compactMapQuery.matches,
    wheelDebounceTime: 40
  }).setView(state.mapCenter, 13);
  L.control.zoom({ position: "bottomright" }).addTo(map);
  addPrimaryBasemap();
  map.on("moveend zoomend dragend", scheduleMapViewportSync);
  updateMapInteractionMode(false);
  setTimeout(() => map.invalidateSize(), 50);
  return true;
}

function markerIcon(adventure) {
  const color = MARKER_STYLE[getListingType(adventure)] || MARKER_STYLE["Pop-ups & Events"];
  const mark = QUEST_MARK_BY_KEY.get(getAdventureQuestMarkKey(adventure)) || QUEST_MARK_BY_KEY.get("puzzle");
  const iconMetrics = questMarkSpriteMetrics(mark, VIBE_ICON_SPRITE_HEIGHT, VIBE_ICON_MAX_WIDTH, VIBE_ICON_CROP_HEIGHT);
  const isToday = getListingSchedule(adventure).bucket === "today";
  return L.divIcon({
    className: "vv-marker-shell",
    html: `
      <span class="vv-marker ${isToday ? "is-today" : ""}" style="--pin-color:${color}" aria-hidden="true">
        <span class="vv-marker-icon" style="--vibe-icon-x:${iconMetrics.offsetX.toFixed(2)}px;--vibe-icon-y:${iconMetrics.offsetY.toFixed(2)}px;--vibe-icon-w:${iconMetrics.width.toFixed(2)}px;--vibe-icon-bg-h:${iconMetrics.backgroundHeight.toFixed(2)}px"></span>
      </span>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -15]
  });
}

function renderMap(markerAdventures, visibleAdventures = markerAdventures) {
  if (els.legendCount) {
    els.legendCount.textContent = `${visibleAdventures.length} ${visibleAdventures.length === 1 ? "activity" : "activities"}`;
  }
  const hasMap = initMap();
  if (!hasMap) return;

  mapMarkers.forEach((marker) => marker.remove());
  mapMarkers = [];

  const visibleIds = new Set(visibleAdventures.map((adventure) => adventure.id));
  const points = [...visibleAdventures, ...markerAdventures.filter((adventure) => !visibleIds.has(adventure.id))]
    .filter((adventure) => Number.isFinite(adventure.lat) && Number.isFinite(adventure.lng));
  points.slice(0, MAX_MAP_MARKERS).forEach((adventure) => {
    const primaryVibe = getListingVibes(adventure)[0] || "Curious";
    const marker = L.marker([adventure.lat, adventure.lng], {
      icon: markerIcon(adventure),
      title: `${adventure.title} — ${primaryVibe}`,
      alt: `${adventure.title}, ${primaryVibe}`,
      riseOnHover: true
    })
      .addTo(map)
      .bindPopup(
        `<strong>${escapeHtml(adventure.title)}</strong><br>${escapeHtml(primaryVibe)} · ${escapeHtml(timingLabel(adventure))}<br>${escapeHtml(getListingType(adventure))} · ${escapeHtml(adventure.area)}${
          adventure.locationAccuracy === "approximate" ? "<br><em>Approximate area</em>" : ""
        }`
      )
      .bindTooltip(`${escapeHtml(adventure.title)}<br><span>${escapeHtml(primaryVibe)} · ${escapeHtml(timingLabel(adventure))}</span>`, {
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
    const fitPoints = visibleAdventures.filter((adventure) => Number.isFinite(adventure.lat) && Number.isFinite(adventure.lng));
    state.mapNeedsFit = false;
    suppressMapViewportSync = true;
    window.clearTimeout(mapViewportRenderTimer);
    if (state.locationSource === "geolocation" && !state.location) {
      map.setView(state.mapCenter, DISCOVERY_AREA_ZOOM, { animate: false });
    } else if (fitPoints.length > 1) {
      map.fitBounds(fitPoints.map((item) => [item.lat, item.lng]), {
        padding: [34, 34],
        maxZoom: DISCOVERY_AREA_ZOOM,
        animate: false
      });
    } else if (fitPoints.length === 1) {
      map.setView(state.mapCenter, DISCOVERY_AREA_ZOOM, { animate: false });
    } else {
      map.setView(state.mapCenter, DISCOVERY_AREA_ZOOM, { animate: false });
    }
    window.setTimeout(() => {
      suppressMapViewportSync = false;
      syncResultsToMapViewport({ force: true });
    }, 80);
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
  prepareMapFocus([adventure.lat, adventure.lng]);
  state.activeTypes = [];
  state.activeVibes = [];
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
  els.profilePills.forEach((pill) => {
    pill.textContent = user ? user.name.split(" ")[0] : "Sign in";
  });
  if (els.shareAuthPrompt) els.shareAuthPrompt.hidden = Boolean(user);
}

function renderViews() {
  const isDiscover = state.view === "discover";
  const isOutThere = state.view === "out-there";
  const isSaved = state.view === "saved";
  const isHost = state.view === "host";
  const isShare = state.view === "share";
  document.querySelector(".workspace").hidden = !isDiscover;
  els.outThereView.hidden = !isOutThere;
  els.savedView.hidden = !isSaved;
  els.hostView.hidden = !isHost;
  els.shareView.hidden = !isShare;
  els.navTabs.forEach((tab) => {
    const active = tab.dataset.view === state.view;
    tab.classList.toggle("is-active", active);
    if (active) tab.setAttribute("aria-current", "page");
    else tab.removeAttribute("aria-current");
  });
  if (isDiscover && map) setTimeout(() => map.invalidateSize(), 50);
  if (isOutThere) {
    updateOutThereSlideshow();
  }
  if (isShare) {
    window.vvFlyerStudio?.render();
    window.vvVibetineraryStudio?.render();
  }
}

function renderAdventures() {
  const mapAdventures = discoveryCandidates();
  const adventures = mapAdventures.filter(matchesDiscoveryArea);
  els.adventureGrid.innerHTML = adventures.length
    ? adventures.map(adventureCard).join("")
    : state.mapBrowseActive
      ? `<div class="empty-state">Nothing is pinned in this map area yet. Move the map or zoom out to keep exploring.</div>`
      : `<div class="empty-state">Nothing matches this moment yet. Try another timing tab, city, type, or vibe.</div>`;
  renderMap(mapAdventures, adventures);
  const timingMeta = state.activeTiming === "today"
    ? "Happening today"
    : state.activeTiming === "coming-up" ? "Worth planning for" : "Nearby finds";
  const areaMeta = state.mapBrowseActive
    ? `${adventures.length} ${adventures.length === 1 ? "find" : "finds"} in this map area`
    : state.location;
  els.resultsMeta.textContent = areaMeta ? `${timingMeta} · ${areaMeta}` : timingMeta;
  const timingTitle = state.activeTiming === "today"
    ? "What’s happening today"
    : state.activeTiming === "coming-up" ? "Coming up" : "Local happenings";
  const activeFilterCount = state.activeTypes.length + state.activeVibes.length;
  const onlyFilter = state.activeTypes[0] || state.activeVibes[0];
  els.resultsTitle.textContent = activeFilterCount === 0
    ? timingTitle
    : activeFilterCount === 1 ? onlyFilter : "Matching happenings";
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
  updateLocationUi();
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

function formatReverseGeocodeLabel(address = {}) {
  const locality = address.city
    || address.town
    || address.village
    || address.municipality
    || address.county
    || "Your area";
  const stateCode = String(address.state_code || "")
    .replace(/^us-/i, "")
    .trim()
    .toUpperCase();
  return stateCode ? `${locality}, ${stateCode}` : locality;
}

async function reverseGeocodeLocation(latitude, longitude) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=10&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`
    );
    if (!response.ok) return "";
    const result = await response.json();
    return formatReverseGeocodeLabel(result?.address || {});
  } catch {
    return "";
  }
}

function getBrowserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("geolocation-unavailable"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      maximumAge: 300000,
      timeout: 8000
    });
  });
}

function readStoredLocationPreference() {
  const preference = store.get(LOCATION_STORAGE_KEY, null);
  if (!preference || typeof preference !== "object" || !preference.label) return null;
  const lat = Number(preference.lat);
  const lng = Number(preference.lng);
  return {
    label: String(preference.label),
    center: Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null
  };
}

function applyStoredLocationPreference() {
  const preference = readStoredLocationPreference();
  if (!preference) return false;
  state.location = preference.label;
  state.locationSource = "manual";
  prepareMapFocus(preference.center || knownCenterForLocation(preference.label) || DEFAULT_MAP_CENTER);
  els.locationInput.value = state.location;
  return true;
}

function updateLocationUi() {
  if (els.locationInput && !els.locationInput.value) {
    els.locationInput.placeholder = state.locationStatus === "checking"
      ? "Finding your location..."
      : "City, town, village";
  }
  if (els.locationButton) {
    els.locationButton.setAttribute("aria-busy", state.locationStatus === "checking" ? "true" : "false");
  }
}

async function useBrowserLocation({ force = false } = {}) {
  const requestVersion = state.locationIntentVersion;
  state.locationStatus = "checking";
  updateLocationUi();
  try {
    const position = await getBrowserLocation();
    if (!force && requestVersion !== state.locationIntentVersion) return;
    const latitude = Number(position.coords.latitude);
    const longitude = Number(position.coords.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) throw new Error("invalid-location");
    const label = await reverseGeocodeLocation(latitude, longitude);
    if (!force && requestVersion !== state.locationIntentVersion) return;
    state.location = label;
    state.locationSource = "geolocation";
    state.locationStatus = "ready";
    prepareMapFocus([latitude, longitude]);
    store.set(LOCATION_STORAGE_KEY, null);
    els.locationInput.value = label;
    render();
    toast(label ? `Showing finds near ${label}.` : "Showing the map near you.");
  } catch {
    if (!force && requestVersion !== state.locationIntentVersion) return;
    state.locationStatus = "error";
    updateLocationUi();
    toast("Location access is off. Search a city to get started.");
  }
}

async function initializeLocation() {
  const user = getCurrentUser();
  if (user?.city) {
    state.location = user.city;
    state.locationSource = "profile";
    prepareMapFocus(knownCenterForLocation(user.city) || state.mapCenter);
    els.locationInput.value = user.city;
    render();
    return;
  }
  if (applyStoredLocationPreference()) {
    render();
    return;
  }
  await useBrowserLocation();
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
  state.locationSource = state.location ? "manual" : "";
  state.locationStatus = state.location ? "ready" : "idle";
  prepareMapFocus(nextCenter);
  if (state.location) {
    store.set(LOCATION_STORAGE_KEY, {
      label: state.location,
      lat: nextCenter[0],
      lng: nextCenter[1]
    });
  } else {
    store.set(LOCATION_STORAGE_KEY, null);
  }
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
    prepareMapFocus();
    render();
  }
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  clearTimeout(window.vvToastTimer);
  window.vvToastTimer = setTimeout(() => els.toast.classList.remove("is-visible"), 2400);
}

function activityShareUrl(id) {
  const isLocalPreview = window.location.protocol === "file:"
    || ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const url = new URL(isLocalPreview ? PUBLIC_SITE_URL : window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set(SHARED_ACTIVITY_PARAM, id);
  return url.toString();
}

async function copyShareUrl(url) {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    try {
      const input = document.createElement("textarea");
      input.value = url;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.append(input);
      input.select();
      const copied = document.execCommand("copy");
      input.remove();
      return copied;
    } catch {
      return false;
    }
  }
}

async function copyActivityLink(id) {
  const adventure = getAdventures().find((item) => item.id === id);
  if (!adventure) {
    toast("That activity is not available right now.");
    return;
  }

  const url = activityShareUrl(adventure.id);
  if (await copyShareUrl(url)) {
    toast("Activity link copied.");
  } else {
    window.prompt("Copy this activity link:", url);
  }
}

async function shareActivity(id) {
  const adventure = getAdventures().find((item) => item.id === id);
  if (!adventure) {
    toast("That activity is not available right now.");
    return;
  }

  const url = activityShareUrl(adventure.id);
  if (typeof navigator.share === "function") {
    try {
      await navigator.share({
        title: adventure.title,
        text: `${adventure.title} · ${adventure.area}, ${adventure.city}`,
        url
      });
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }

  if (await copyShareUrl(url)) {
    toast("Activity link copied.");
  } else {
    window.prompt("Copy this activity link:", url);
  }
}

function openSharedActivityFromUrl({ notifyMissing = false } = {}) {
  const id = new URL(window.location.href).searchParams.get(SHARED_ACTIVITY_PARAM)?.trim();
  if (!id) return false;
  const adventure = getAdventures().find((item) => item.id === id);
  if (!adventure) {
    if (notifyMissing) toast("That shared activity is no longer available.");
    return false;
  }
  state.view = "discover";
  render();
  openDetail(adventure.id);
  return true;
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
  els.authTitle.textContent = signup ? "Create your Vibe Quest profile" : "Sign in to Vibe Quest";
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
    prepareMapFocus(knownCenterForLocation(user.city) || state.mapCenter);
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
  prepareMapFocus(knownCenterForLocation(state.location) || state.mapCenter);
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
      <button class="secondary-button" type="button" data-action="share-activity" data-id="${escapeHtml(adventure.id)}" aria-label="Share activity link">
        Share link
      </button>
      <button class="secondary-button" type="button" data-action="copy-activity-link" data-id="${escapeHtml(adventure.id)}" aria-label="Copy activity URL">
        Copy link
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
    prepareMapFocus(knownCenterForLocation(state.location) || state.mapCenter);
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
  prepareMapFocus(knownCenterForLocation(state.location) || state.mapCenter);
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

function hostSelectedVibes() {
  return [...els.hostForm.querySelectorAll('input[name="vibes"]:checked')].map((input) => input.value);
}

function questMarkOptionMarkup(key, selectedKey) {
  const mark = QUEST_MARK_BY_KEY.get(key);
  if (!mark) return "";
  const iconMetrics = questMarkSpriteMetrics(mark, QUEST_MARK_PICKER_SPRITE_HEIGHT, QUEST_MARK_PICKER_MAX_WIDTH, QUEST_MARK_PICKER_CROP_HEIGHT);
  const selected = key === selectedKey;
  return `
    <button
      class="quest-mark-option ${selected ? "is-selected" : ""}"
      type="button"
      data-action="select-quest-mark"
      data-quest-mark="${escapeHtml(mark.key)}"
      aria-label="Use ${escapeHtml(mark.label)} quest mark"
      aria-pressed="${selected}"
      title="${escapeHtml(mark.label)}"
    >
      <span class="quest-mark-sprite" style="--quest-mark-x:${iconMetrics.offsetX.toFixed(2)}px;--quest-mark-y:${iconMetrics.offsetY.toFixed(2)}px;--quest-mark-w:${iconMetrics.width.toFixed(2)}px;--quest-mark-bg-h:${iconMetrics.backgroundHeight.toFixed(2)}px" aria-hidden="true"></span>
    </button>
  `;
}

function renderQuestMarkPicker() {
  if (!els.questMarkInput || !els.questMarkSuggestions || !els.questMarkBank) return;
  const vibes = hostSelectedVibes();
  const type = els.hostForm.elements.type.value || "Pop-ups & Events";
  const suggestedKeys = suggestedQuestMarkKeys(vibes, type);
  const suggestedKey = suggestedKeys[0] || "puzzle";
  const savedKey = String(els.questMarkInput.value || "");
  const manualSelection = els.questMarkInput.dataset.manual === "true" && QUEST_MARK_BY_KEY.has(savedKey);
  const selectedKey = manualSelection ? savedKey : suggestedKey;
  const selectedMark = QUEST_MARK_BY_KEY.get(selectedKey) || QUEST_MARK_BY_KEY.get("puzzle");
  const iconMetrics = questMarkSpriteMetrics(selectedMark, QUEST_MARK_PICKER_SPRITE_HEIGHT, QUEST_MARK_PICKER_MAX_WIDTH, QUEST_MARK_PICKER_CROP_HEIGHT);

  els.questMarkInput.value = selectedMark.key;
  els.questMarkInput.dataset.manual = String(manualSelection);
  els.questMarkSuggestions.innerHTML = suggestedKeys.map((key) => questMarkOptionMarkup(key, selectedMark.key)).join("");
  els.questMarkBank.innerHTML = QUEST_MARKS.map((mark) => questMarkOptionMarkup(mark.key, selectedMark.key)).join("");
  els.questMarkPreviewIcon.style.setProperty("--quest-mark-x", `${iconMetrics.offsetX.toFixed(2)}px`);
  els.questMarkPreviewIcon.style.setProperty("--quest-mark-y", `${iconMetrics.offsetY.toFixed(2)}px`);
  els.questMarkPreviewIcon.style.setProperty("--quest-mark-w", `${iconMetrics.width.toFixed(2)}px`);
  els.questMarkPreviewIcon.style.setProperty("--quest-mark-bg-h", `${iconMetrics.backgroundHeight.toFixed(2)}px`);
  els.questMarkPreviewPin.style.setProperty("--pin-color", MARKER_STYLE[type] || MARKER_STYLE["Pop-ups & Events"]);
  els.questMarkPreviewLabel.textContent = selectedMark.label;
  els.questMarkSuggestedButton.hidden = !manualSelection;
  els.questMarkSuggestedButton.textContent = `Use suggested: ${QUEST_MARK_BY_KEY.get(suggestedKey)?.label || "Puzzle piece"}`;
  els.questMarkBrowserToggle.textContent = els.questMarkBank.hidden ? "Browse all marks" : "Close icon bank";
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
  els.questMarkInput.dataset.manual = "false";
  els.questMarkBank.hidden = true;
  els.questMarkBrowserToggle.setAttribute("aria-expanded", "false");
  const todayInput = els.hostForm.elements.startDate;
  todayInput.min = formatInputDate(startOfToday());
  todayInput.value = formatInputDate(startOfToday());
  els.hostForm.elements.startTime.value = "18:00";
  els.hostForm.elements.recurringDay.value = String(startOfToday().getDay());
  els.hostForm.elements.recurringTime.value = "18:00";
  updateScheduleFields();
  renderQuestMarkPicker();
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
    icon_key: adventure.iconKey || null,
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
  const storedQuestMark = String(adventure.iconKey || "");
  form.iconKey.value = QUEST_MARK_BY_KEY.has(storedQuestMark) ? storedQuestMark : "";
  form.iconKey.dataset.manual = String(QUEST_MARK_BY_KEY.has(storedQuestMark));
  updateScheduleFields();
  renderQuestMarkPicker();

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
  const submittedIconKey = String(data.get("iconKey") || "");
  const iconKey = QUEST_MARK_BY_KEY.has(submittedIconKey)
    ? submittedIconKey
    : defaultQuestMarkKey(vibes, type);
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
      iconKey,
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
      prepareMapFocus(center);
      state.activeTypes = [type];
      state.activeVibes = [];
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
    prepareMapFocus(center);
    state.activeTypes = [type];
    state.activeVibes = [];
    const publishedBucket = getListingSchedule(adventure).bucket;
    state.activeTiming = publishedBucket === "anytime" ? "all" : publishedBucket === "expired" ? "coming-up" : publishedBucket;
    els.locationInput.value = city;
    toast(wasEditing ? "Your post has been updated." : "Your activity is live.");
    render();
  } catch (error) {
    const message = error?.message === "image-too-large"
      ? `That original photo is over ${MAX_UPLOAD_MEGABYTES} MB. Choose a standard photo instead of a RAW or ProRAW file.`
      : error?.message === "image-too-large-after-optimization"
        ? "We still could not prepare that photo. Try taking a screenshot of it, then upload the screenshot."
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
  setMobileNavOpen(false);
  state.view = view;
  render();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function setMobileNavOpen(open) {
  if (!els.mobileNavToggle || !els.mobileNavPanel) return;
  const nextOpen = Boolean(open);
  els.mobileNavPanel.hidden = !nextOpen;
  els.mobileNavToggle.setAttribute("aria-expanded", String(nextOpen));
  els.mobileNavToggle.setAttribute("aria-label", nextOpen ? "Close navigation" : "Open navigation");
  els.mobileNavToggle.title = nextOpen ? "Close navigation" : "Open navigation";
  els.topbar?.classList.toggle("is-mobile-nav-open", nextOpen);
}

document.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-action], [data-view], [data-timing-filter], [data-type-filter], [data-vibe-filter], [data-auth-mode]");
  if (!target) return;

  if (target.dataset.view) {
    setMobileNavOpen(false);
    if (target.dataset.view === "host") {
      startNewPost();
    } else {
      setView(target.dataset.view);
    }
    return;
  }

  if ("typeFilter" in target.dataset) {
    state.activeTypes = target.dataset.typeFilter === "All"
      ? []
      : toggleFilterValue(state.activeTypes, target.dataset.typeFilter);
    render();
    return;
  }

  if ("timingFilter" in target.dataset) {
    state.activeTiming = target.dataset.timingFilter;
    render();
    return;
  }

  if ("vibeFilter" in target.dataset) {
    state.activeVibes = target.dataset.vibeFilter === "All"
      ? []
      : toggleFilterValue(state.activeVibes, target.dataset.vibeFilter);
    render();
    return;
  }

  if (target.dataset.authMode) {
    state.authMode = target.dataset.authMode;
    updateAuthMode();
    return;
  }

  const action = target.dataset.action;
  if (action === "select-quest-mark") {
    const key = target.dataset.questMark;
    if (QUEST_MARK_BY_KEY.has(key)) {
      els.questMarkInput.value = key;
      els.questMarkInput.dataset.manual = "true";
      renderQuestMarkPicker();
    }
    return;
  }
  if (action === "use-suggested-mark") {
    els.questMarkInput.dataset.manual = "false";
    renderQuestMarkPicker();
    return;
  }
  if (action === "toggle-quest-mark-bank") {
    const nextOpen = els.questMarkBank.hidden;
    els.questMarkBank.hidden = !nextOpen;
    els.questMarkBrowserToggle.setAttribute("aria-expanded", String(nextOpen));
    renderQuestMarkPicker();
    return;
  }
  if (action === "toggle-mobile-nav") {
    setMobileNavOpen(els.mobileNavPanel?.hidden);
    return;
  }
  if (action === "home") setView("discover");
  if (action === "focus-search") els.locationInput.focus();
  if (action === "roll-the-dice") {
    rollTheDice();
    return;
  }
  if (action === "use-location") {
    state.locationIntentVersion += 1;
    await useBrowserLocation({ force: true });
  }
  if (action === "apply-filters") await applyFilters();
  if (action === "explore-galveston") {
    state.location = "Galveston, TX";
    state.locationSource = "manual";
    state.locationStatus = "ready";
    prepareMapFocus(CITY_CENTERS["galveston, tx"]);
    state.activeTypes = [];
    state.activeVibes = [];
    state.activeTiming = "all";
    els.locationInput.value = state.location;
    store.set(LOCATION_STORAGE_KEY, {
      label: state.location,
      lat: state.mapCenter[0],
      lng: state.mapCenter[1]
    });
    setView("discover");
  }
  if (action === "use-profile") {
    const user = getCurrentUser();
    if (!user) {
      showAuth("signup");
    } else {
      state.location = user.city;
      state.locationSource = "profile";
      state.locationStatus = "ready";
      prepareMapFocus(knownCenterForLocation(user.city) || state.mapCenter);
      els.locationInput.value = user.city;
      render();
    }
  }
  if (action === "open-profile") {
    setMobileNavOpen(false);
    openProfile();
  }
  if (action === "open-signup") showAuth("signup");
  if (action === "close-auth") els.authModal.close();
  if (action === "close-profile") els.profileModal.close();
  if (action === "toggle-save") await toggleSave(target.dataset.id);
  if (action === "open-detail") openDetail(target.dataset.id);
  if (action === "close-detail") els.detailModal.close();
  if (action === "show-on-map") showAdventureOnMap(target.dataset.id);
  if (action === "share-activity") await shareActivity(target.dataset.id);
  if (action === "copy-activity-link") await copyActivityLink(target.dataset.id);
  if (action === "toggle-map-interaction") updateMapInteractionMode(!mobileMapInteractionEnabled);
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
  if (action === "sign-out") await signOut();
});

document.addEventListener("click", (event) => {
  if (els.mobileNavPanel?.hidden) return;
  if (event.target.closest?.(".mobile-nav-panel, .mobile-nav-toggle")) return;
  setMobileNavOpen(false);
});

els.locationInput.addEventListener("input", (event) => {
  state.locationIntentVersion += 1;
  state.location = event.target.value;
  state.locationSource = state.location ? "manual" : "";
  state.locationStatus = state.location ? "idle" : "idle";
  clearTimeout(window.vvLocationFilterTimer);
});

els.locationInput.addEventListener("keydown", async (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  await applyFilters();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !els.mobileNavPanel?.hidden) {
    setMobileNavOpen(false);
    els.mobileNavToggle?.focus();
    return;
  }
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
  if (input instanceof HTMLSelectElement && input.name === "type") {
    renderQuestMarkPicker();
    return;
  }
  if (!(input instanceof HTMLInputElement) || input.name !== "vibes") return;
  const selected = els.hostForm.querySelectorAll('input[name="vibes"]:checked');
  if (input.checked && selected.length > 3) {
    input.checked = false;
    toast("Choose up to three vibes.");
  }
  renderQuestMarkPicker();
});
els.hostForm.querySelectorAll('input[name="location"], input[name="city"]').forEach((input) => {
  input.addEventListener("input", () => {
    delete els.hostForm.dataset.approximateLocationKey;
    setLocationFeedback();
    updateHostFormMode();
  });
});

let headerScrollFrame = 0;
let headerCompactTrigger = 80;
function updateHeaderScrollState() {
  headerScrollFrame = 0;
  if (!els.topbar) return;
  const isCompact = els.topbar.classList.contains("is-scrolled");
  if (!isCompact) {
    headerCompactTrigger = Math.max(80, Math.round(els.topbar.offsetHeight - 48));
  }
  const shouldCompact = isCompact
    ? window.scrollY > 8
    : window.scrollY > headerCompactTrigger;
  if (shouldCompact !== isCompact) {
    els.topbar.classList.toggle("is-scrolled", shouldCompact);
  }
}
window.addEventListener("scroll", () => {
  if (headerScrollFrame) return;
  headerScrollFrame = window.requestAnimationFrame(updateHeaderScrollState);
}, { passive: true });
window.addEventListener("resize", updateHeaderScrollState, { passive: true });
updateHeaderScrollState();
const handleCompactMapChange = () => updateMapInteractionMode(false);
if (compactMapQuery.addEventListener) compactMapQuery.addEventListener("change", handleCompactMapChange);
else compactMapQuery.addListener?.(handleCompactMapChange);
const mobileHeaderQuery = window.matchMedia("(max-width: 620px)");
const handleMobileHeaderChange = (event) => {
  if (!event.matches) setMobileNavOpen(false);
};
if (mobileHeaderQuery.addEventListener) mobileHeaderQuery.addEventListener("change", handleMobileHeaderChange);
else mobileHeaderQuery.addListener?.(handleMobileHeaderChange);
els.realMap?.addEventListener("wheel", handleMapPinchZoom, { passive: false });
resetHostForm();
render();

if (state.backendEnabled) {
  state.session = null;
  bootstrapSupabase().then(async () => {
    updateHostFormMode();
    const openedSharedActivity = openSharedActivityFromUrl({ notifyMissing: true });
    if (!openedSharedActivity && !getCurrentUser()) await initializeLocation();
  });
} else {
  const openedSharedActivity = openSharedActivityFromUrl({ notifyMissing: true });
  if (!openedSharedActivity) initializeLocation().catch(() => {});
  repairHostedCoordinates().catch(() => {});
}
