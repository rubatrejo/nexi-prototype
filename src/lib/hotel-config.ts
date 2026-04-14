/**
 * NEXI Hotel Configuration
 * ========================
 * Single source of truth for all hotel-specific data.
 * When onboarding a new client, duplicate this file and update values.
 * In production, the CMS generates this configuration dynamically.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HotelBrand {
  name: string;
  tagline: string;
  website: string;     // Hotel's own marketing site (internal, not shown in kiosk)
  notes: string;       // Internal sales/onboarding notes — never rendered in kiosk
  logo: string;        // Primary logo (for light backgrounds)
  logoWhite: string;   // White logo (for dark backgrounds / photo overlays)
  icon: string;        // Square icon (favicon, app icon)
  iconWhite: string;
  poweredBy: string;   // "Powered by" badge
  poweredByWhite: string;
}

export interface HotelIntegrations {
  // Avatar / video
  heygenApiKey: string;
  tavusApiKey: string;
  didApiKey: string;
  // Email
  resendApiKey: string;
  // PMS (property management systems)
  cloudbedsApiKey: string;
  mewsApiKey: string;
  oracleApiKey: string;        // Oracle Hospitality / OPERA
  // Payments
  stripeApiKey: string;
  // Destination / experiences
  simpleViewApiKey: string;    // SimpleView DMO CMS
  trybeApiKey: string;         // Trybe spa + experiences
  book4timeApiKey: string;     // Book4Time spa booking
  skyNavApiKey: string;        // SkyNav wayfinding
  threshold360ApiKey: string;  // Threshold 360 virtual tours
}

/**
 * Visual variants for an ad.
 * - popup      : center-screen modal with header photo + body (legacy behaviour)
 * - hero       : 16:9 centered card, background photo with overlaid text + CTA
 * - bottomBar  : full-width strip fixed to the bottom of the kiosk frame
 * - sideBanner : tall narrow strip fixed to the left or right edge
 */
export type AdType = "popup" | "hero" | "bottomBar" | "sideBanner";

/**
 * One advertisement shown on the dashboard popup, as an inline hero
 * card, a bottom bar, or a side banner. Managed from the /admin Ads
 * tab when the "ads" module is enabled.
 */
export interface AdItem {
  id: string;
  type?: AdType;           // defaults "popup" for legacy items
  title: string;
  subtitle?: string;
  image: string;           // data URL or external URL
  ctaLabel?: string;       // primary button text (e.g. "Book Now")
  ctaTarget?: string;      // screen ID to navigate to (e.g. "UPS-01") or "" for dismiss-only
  dismissLabel?: string;   // secondary button text (e.g. "Maybe Later")
  enabled: boolean;
  /**
   * Pattern matched against the current screen id. Supports:
   *   "*"                  — every screen
   *   "DSH-01"             — exact match
   *   "CKI-*"              — prefix wildcard
   *   "DSH-01,IDL-01"      — comma-separated list
   * Popup ads ignore this (they trigger on dashboard mount via the
   * global settings) and default to "DSH-01"; overlay ads default
   * to "*".
   */
  screenPattern?: string;
  /** Only honoured when type === "sideBanner". Default "right". */
  side?: "left" | "right";
}

/**
 * Dashboard advertisement configuration. Keeping shape conservative
 * for the prototype — one popup pattern with a list of variants and
 * global timing knobs.
 */
export interface AdsConfig {
  items: AdItem[];
  /** Show the popup on DSH-01 after the guest lands on the dashboard. */
  showOnDashboard: boolean;
  /** Milliseconds after DSH-01 mounts before the first ad appears. */
  dashboardDelayMs: number;
  /** Optional auto-dismiss timer; 0 disables. */
  autoDismissMs: number;
  /** How to pick the ad when multiple are enabled. */
  rotation: "first" | "random";
}

export type SurveyQuestionType = "rating" | "text" | "choice" | "yesno";

export interface SurveyQuestion {
  id: string;
  type: SurveyQuestionType;
  text: string;
  required: boolean;
  options?: string[];   // only for type === "choice"
  maxRating?: number;   // only for type === "rating" (default 5)
}

/**
 * Guest satisfaction survey shown after checkout (CKO-04 feedback
 * screen). Managed from the /admin Survey tab when the "survey"
 * module is enabled.
 */
export interface SurveyConfig {
  title: string;
  subtitle?: string;
  questions: SurveyQuestion[];
  thankYouMessage?: string;
  showAfterCheckOut: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

/**
 * FAQ content rendered on FAQ-01. Categories are freeform strings —
 * each item's `category` must match one in `categories` or the item
 * goes under "General".
 */
export interface FaqConfig {
  categories: string[];
  items: FaqItem[];
}

/**
 * Hotel policies document uploaded by the client. Rendered on the
 * check-in signature screen (CKI-08). Either a data URL for a PDF
 * or Word document, or a plain text block the kiosk renders inline.
 */
export interface HotelPolicies {
  filename?: string;           // original filename for display
  mimeType?: string;           // application/pdf, application/vnd.openxmlformats...
  dataUrl?: string;            // base64 data URL for rendering / download
  text?: string;               // optional plain text fallback shown inline on the kiosk
}

/**
 * Custom font imported by the client via the /admin Fonts tab.
 * Injected into document.head at runtime by ThemeProvider so the
 * kiosk can use any Google Fonts, Adobe Fonts (Typekit), or
 * manually uploaded .woff2/.woff/.ttf/.otf file.
 */
export interface CustomFont {
  /** Font-family value used in CSS (e.g. "Playfair Display"). */
  family: string;
  source: "google" | "adobe" | "upload";
  /**
   * - google : full Google Fonts CSS URL (fonts.googleapis.com/css2?family=...)
   * - adobe  : full Typekit CSS URL (use.typekit.net/{id}.css)
   * - upload : data URL of the font file (data:font/woff2;base64,...)
   */
  url: string;
}

export interface HotelColors {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryGlow: string;
  amber: string;
  amberLight: string;
  success: string;
  error: string;
  warning: string;
  purple: string;
  // Light mode
  light: {
    bg: string;
    bgCard: string;
    bgElevated: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    borderHover: string;
  };
  // Dark mode
  dark: {
    bg: string;
    bgCard: string;
    bgElevated: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    borderHover: string;
  };
}

export interface HotelFonts {
  display: string;     // Headlines, hero text
  body: string;        // Body copy, UI elements
  mono?: string;       // Code, data displays
}

export interface HotelModule {
  id: string;
  label: string;
  /** Optional i18n key. When set, screens prefer t(labelKey) over label. */
  labelKey?: string;
  icon: string;
  entryScreen: string;
  enabled: boolean;
  color: string;
  /**
   * Optional placement on the Dashboard grid. Modules without this field are
   * considered "internal" (still usable via navigate) and don't render in the
   * DSH-01 grid. Modules with this field render sorted ascending.
   */
  dashboardOrder?: number;
}

export interface RoomType {
  id: string;
  name: string;
  description: string;
  maxGuests: number;
  bedType: string;
  sizeSqFt: number;
  baseRate: number;
  currency: string;
  image: string;         // primary card image
  gallery?: string[];    // additional photos shown on the room-assigned gallery screen
  tag?: string;
}

export interface UpgradeOption {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;         // primary card image
  gallery?: string[];    // optional gallery shown when guest taps the upgrade
}

/**
 * Rich asset union for hero backgrounds. Currently only `heroExterior`
 * supports this via the optional `heroExteriorAsset` field below — other
 * heroes stay as plain strings. When set, `heroExteriorAsset` takes
 * precedence over the plain `heroExterior` string which is kept as a
 * poster / fallback / backward-compat anchor.
 */
export type HeroAsset =
  | { kind: "image"; url: string }
  | { kind: "slideshow"; images: string[]; intervalMs?: number }
  | { kind: "video"; url: string; poster?: string }
  | { kind: "gradient"; from: string; to: string; angle?: number };

export interface HotelImages {
  // Main hero photos — shown on idle, dashboard, etc.
  heroExterior: string;
  /** Optional rich asset for the idle/attract screen. Falls back to heroExterior. */
  heroExteriorAsset?: HeroAsset;
  heroLobby: string;
  heroPool: string;
  heroSpa: string;
  heroRestaurant: string;
  // Flow backdrops — each reused across multiple screens
  heroWelcome: string;      // brand-facing hero used by check-in intro, checkout intro, payment intro
  heroSuccess: string;      // confirmation / success cards (CKO06, PAY03, etc.)
  heroKey: string;          // duplicate key flow (DKY01/02/03)
  heroNight: string;        // nighttime / late-stay (CKI13, CKO06)
  heroBooking: string;      // booking flow (BKG08)
  heroLoading: string;      // loading / processing backdrops (CKO02/04, PAY02)
  heroEvents: string;       // events flow backdrop (EVT03/04)
  // Room backgrounds
  roomDeluxe: string;
  roomSuite: string;
  roomPresidential: string;
  // General backgrounds (used across screens)
  backgrounds: string[];
  // Food & beverage
  foodGeneric: string;
  // Fallback
  placeholder: string;
}

export interface GuestDefaults {
  /** Default name shown ONLY in demo mode. Real guest name comes from onboarding/PMS. */
  demoName: string;
  demoRoom: string;
  demoReservationId: string;
  demoCheckIn: string;
  demoCheckOut: string;
  demoRoomType: string;
}

export interface HotelInfo {
  address: string;
  phone: string;
  email: string;
  wifi: {
    networkName: string;
    password: string;
    instructions: string;
  };
  checkInTime: string;
  checkOutTime: string;
  lateCheckOutDeadline: string;
  earlyCheckInTime: string;
  currency: string;
  timezone: string;
}

export interface HotelConfig {
  /**
   * URL-friendly identifier used as the KV key (`config:{slug}`) and as
   * the `?client={slug}` query param on the kiosk. Must be lowercase with
   * hyphens only, e.g. "hilton-miami-downtown".
   */
  slug: string;
  brand: HotelBrand;
  colors: HotelColors;
  fonts: HotelFonts;
  modules: HotelModule[];
  rooms: RoomType[];
  upgrades: UpgradeOption[];
  images: HotelImages;
  guestDefaults: GuestDefaults;
  info: HotelInfo;
  inactivity: {
    warningAfterMs: number;   // Show "Are you still there?" (default 90s)
    resetAfterMs: number;     // Reset to idle after warning (default 30s)
  };
  orientation: "landscape" | "portrait";
  integrations: HotelIntegrations;
  /**
   * Locale codes the kiosk exposes in its language picker. Subset of the
   * full LOCALES list in @/lib/i18n/types. Ignored when the "languages"
   * module is disabled. Undefined means "all supported locales" — used by
   * legacy configs stored in KV before this field existed.
   */
  enabledLocales?: string[];
  /**
   * Fonts imported by the client via /admin Fonts tab. ThemeProvider
   * injects these into document.head so the kiosk can render with them.
   */
  customFonts?: CustomFont[];
  /**
   * Uploaded hotel policies document (PDF or Word). Referenced by the
   * check-in signature screen.
   */
  policies?: HotelPolicies;
  /**
   * Dashboard ads configuration. Ignored when the "ads" module is
   * disabled. Undefined on legacy configs — the app falls back to
   * a single default ad matching the old hardcoded popup.
   */
  ads?: AdsConfig;
  /** Guest survey questions shown on the post-checkout feedback screen. */
  survey?: SurveyConfig;
  /** FAQ content rendered on FAQ-01. */
  faq?: FaqConfig;
}

// ---------------------------------------------------------------------------
// NEXI Demo Hotel Configuration
// ---------------------------------------------------------------------------

export const hotelConfig: HotelConfig = {
  slug: "nexi-demo-hotel",
  brand: {
    name: "NEXI Demo Hotel",
    tagline: "Your Stay, Your Way",
    website: "",
    notes: "",
    logo: "/logos/nexi-logo-full.svg",
    logoWhite: "/logos/nexi-logo-full.svg",
    icon: "/logos/nexi-icon.svg",
    iconWhite: "/logos/nexi-icon-white.svg",
    poweredBy: "/logos/powered-by-trueomni.svg",
    poweredByWhite: "/logos/powered-by-trueomni-white.svg",
  },

  colors: {
    primary: "#1288FF",
    primaryHover: "#0B6FD4",
    primaryLight: "rgba(18,136,255,0.08)",
    primaryGlow: "rgba(18,136,255,0.25)",
    amber: "#D4960A",
    amberLight: "rgba(212,150,10,0.08)",
    success: "#16A34A",
    error: "#DC2626",
    warning: "#D4960A",
    purple: "#8B5CF6",
    light: {
      bg: "#F5F5F0",
      bgCard: "#FFFFFF",
      bgElevated: "#FFFFFF",
      text: "#1A1A1A",
      textSecondary: "#6B7280",
      textTertiary: "#9CA3AF",
      border: "#E8E8E3",
      borderHover: "#D1D1CC",
    },
    dark: {
      bg: "#0C0C0E",
      bgCard: "#1A1A1F",
      bgElevated: "#222228",
      text: "#F0F0F0",
      textSecondary: "#8E93A4",
      textTertiary: "#5A5E6E",
      border: "#2A2A30",
      borderHover: "#3A3A42",
    },
  },

  fonts: {
    display: "Mona Sans",
    body: "Inter",
    mono: "JetBrains Mono",
  },

  modules: [
    { id: "check-in",       label: "Check In",        labelKey: "dsh.checkin",       icon: "log-in",         entryScreen: "CKI-01",  enabled: true,  color: "var(--primary)"        },
    { id: "check-out",      label: "Check Out",       labelKey: "dsh.checkout",      icon: "log-out",        entryScreen: "CKO-01",  enabled: true,  color: "var(--error)",          dashboardOrder: 9 },
    { id: "booking",        label: "Booking",         labelKey: "dsh.booking",       icon: "calendar-plus",  entryScreen: "BKG-01",  enabled: true,  color: "var(--purple)"         },
    { id: "room-service",   label: "Room Service",    labelKey: "dsh.roomService",   icon: "concierge-bell", entryScreen: "RSV-01",  enabled: true,  color: "var(--primary)",        dashboardOrder: 1 },
    { id: "events",         label: "Events",          labelKey: "dsh.events",        icon: "calendar",       entryScreen: "EVT-01",  enabled: true,  color: "var(--purple)",         dashboardOrder: 2 },
    { id: "explore",        label: "Explore",         labelKey: "dsh.explore",       icon: "compass",        entryScreen: "LST-01",  enabled: true,  color: "var(--success)",        dashboardOrder: 3 },
    { id: "wayfinding",     label: "Wayfinding",      labelKey: "dsh.wayfinding",    icon: "map-pin",        entryScreen: "WAY-01",  enabled: true,  color: "var(--amber)",          dashboardOrder: 4 },
    { id: "wifi",           label: "Wi-Fi",           labelKey: "dsh.wifi",          icon: "wifi",           entryScreen: "WIF-01",  enabled: true,  color: "var(--primary)",        dashboardOrder: 5 },
    { id: "faq",            label: "FAQ",             labelKey: "dsh.faq",           icon: "help-circle",    entryScreen: "FAQ-01",  enabled: true,  color: "var(--text-secondary)", dashboardOrder: 6 },
    { id: "duplicate-key",  label: "Duplicate Key",   labelKey: "dsh.duplicateKey",  icon: "key",            entryScreen: "DKY-01",  enabled: true,  color: "var(--amber)",          dashboardOrder: 7 },
    { id: "late-checkout",  label: "Late Check-out",  labelKey: "dsh.lateCheckout",  icon: "clock",          entryScreen: "LCO-01",  enabled: true,  color: "var(--purple)",         dashboardOrder: 8 },
    { id: "upsells",        label: "Upsells",         labelKey: "dsh.upsells",       icon: "gift",           entryScreen: "UPS-01",  enabled: true,  color: "var(--amber)"          },
    { id: "ads",            label: "Advertisements",  labelKey: "dsh.ads",           icon: "megaphone",      entryScreen: "ADS-01",  enabled: true,  color: "var(--orange)"         },
    { id: "payments",       label: "TruePay",         labelKey: "dsh.payments",      icon: "credit-card",    entryScreen: "PAY-01",  enabled: true,  color: "var(--success)"        },
    { id: "early-checkin",  label: "Early Check-in",  labelKey: "dsh.earlyCheckin",  icon: "sunrise",        entryScreen: "ECI-01",  enabled: true,  color: "var(--amber)"          },
    { id: "ai-avatar",      label: "AI Concierge",    labelKey: "dsh.aiConcierge",   icon: "bot",            entryScreen: "AVT-01",  enabled: true,  color: "var(--primary)"        },
    { id: "languages",      label: "Languages",       labelKey: "dsh.languages",     icon: "globe",          entryScreen: "ONB-02",  enabled: true,  color: "var(--primary)"        },
    { id: "survey",         label: "Survey",          labelKey: "dsh.survey",        icon: "clipboard",      entryScreen: "CKO-04",  enabled: true,  color: "var(--purple)"         },
  ],

  rooms: [
    {
      id: "deluxe-king",
      name: "Deluxe King",
      description: "Spacious room with king bed, city view, and premium amenities",
      maxGuests: 2,
      bedType: "King",
      sizeSqFt: 420,
      baseRate: 189,
      currency: "USD",
      image: "/images/unsplash/photo-1611892440504-42a792e24d32.jpg",
      gallery: [
        "/images/unsplash/photo-1611892440504-42a792e24d32.jpg",
        "/images/unsplash/photo-1552321554-5fefe8c9ef14.jpg",
        "/images/unsplash/photo-1507652313519-d4e9174996dd.jpg",
      ],
      tag: "Best Value",
    },
    {
      id: "ocean-suite",
      name: "Ocean Suite",
      description: "Elegant suite with separate living area and ocean views",
      maxGuests: 3,
      bedType: "King + Sofa",
      sizeSqFt: 680,
      baseRate: 329,
      currency: "USD",
      image: "/images/unsplash/photo-1582719478250-c89cae4dc85b.jpg",
      gallery: [
        "/images/unsplash/photo-1582719478250-c89cae4dc85b.jpg",
        "/images/unsplash/photo-1590490360182-c33d57733427.jpg",
        "/images/unsplash/photo-1571896349842-33c89424de2d.jpg",
      ],
      tag: "Popular",
    },
    {
      id: "presidential-suite",
      name: "Presidential Suite",
      description: "Ultimate luxury with panoramic views, dining area, and butler service",
      maxGuests: 4,
      bedType: "King + Twin",
      sizeSqFt: 1200,
      baseRate: 599,
      currency: "USD",
      image: "/images/unsplash/photo-1631049307264-da0ec9d70304.jpg",
      gallery: [
        "/images/unsplash/photo-1631049307264-da0ec9d70304.jpg",
        "/images/unsplash/photo-1617098474202-0d0d7f60c56b.jpg",
        "/images/unsplash/photo-1618773928121-c32242e63f39.jpg",
      ],
      tag: "Premium",
    },
  ],

  upgrades: [
    {
      id: "suite-upgrade",
      title: "Suite Upgrade",
      description: "Upgrade to a spacious suite with separate living area",
      price: "$89/night",
      image: "/images/unsplash/photo-1590490360182-c33d57733427.jpg",
    },
    {
      id: "breakfast-package",
      title: "Breakfast Package",
      description: "Full breakfast buffet for your entire stay",
      price: "$35/person",
      image: "/images/unsplash/photo-1504674900247-0877df9cc836.jpg",
    },
    {
      id: "spa-access",
      title: "Spa Access",
      description: "Unlimited access to spa, sauna, and wellness center",
      price: "$45",
      image: "/images/unsplash/photo-1544161515-4ab6ce6db874.jpg",
    },
  ],

  images: {
    heroExterior: "/images/unsplash/photo-1566073771259-6a8506099945.jpg",
    heroLobby: "/images/unsplash/photo-1551882547-ff40c63fe5fa.jpg",
    heroPool: "/images/unsplash/photo-1507525428034-b723cf961d3e.jpg",
    heroSpa: "/images/unsplash/photo-1544161515-4ab6ce6db874.jpg",
    heroRestaurant: "/images/unsplash/photo-1517248135467-4c7edcad34c4.jpg",
    heroWelcome: "/images/unsplash/photo-1551882547-ff40c63fe5fa.jpg",
    heroSuccess: "/images/unsplash/photo-1566073771259-6a8506099945.jpg",
    heroKey: "/images/unsplash/photo-1582719478250-c89cae4dc85b.jpg",
    heroNight: "/images/unsplash/photo-1571896349842-33c89424de2d.jpg",
    heroBooking: "/images/unsplash/photo-1542314831-068cd1dbfeeb.jpg",
    heroLoading: "/images/unsplash/photo-1520250497591-112f2f40a3f4.jpg",
    heroEvents: "/images/unsplash/photo-1510812431401-41d2bd2722f3.jpg",
    roomDeluxe: "/images/unsplash/photo-1611892440504-42a792e24d32.jpg",
    roomSuite: "/images/unsplash/photo-1582719478250-c89cae4dc85b.jpg",
    roomPresidential: "/images/unsplash/photo-1631049307264-da0ec9d70304.jpg",
    backgrounds: [
      "/images/unsplash/photo-1566073771259-6a8506099945.jpg",
      "/images/unsplash/photo-1542314831-068cd1dbfeeb.jpg",
      "/images/unsplash/photo-1571896349842-33c89424de2d.jpg",
      "/images/unsplash/photo-1520250497591-112f2f40a3f4.jpg",
      "/images/unsplash/photo-1582719478250-c89cae4dc85b.jpg",
      "/images/unsplash/photo-1590490360182-c33d57733427.jpg",
    ],
    foodGeneric: "/images/unsplash/photo-1504674900247-0877df9cc836.jpg",
    placeholder: "/logos/nexi-icon.svg",
  },

  guestDefaults: {
    demoName: "Guest",
    demoRoom: "1247",
    demoReservationId: "RES-2026-48291",
    demoCheckIn: "Feb 22, 2026",
    demoCheckOut: "Feb 25, 2026",
    demoRoomType: "Deluxe King",
  },

  info: {
    address: "100 Ocean Drive, Miami Beach, FL 33139",
    phone: "+1 (305) 555-0100",
    email: "front.desk@nexidemo.com",
    wifi: {
      networkName: "NEXI-Guest",
      password: "Room + Last Name (e.g., 1247Mitchell)",
      instructions: "Connect to the network, enter your room number and last name as password.",
    },
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM",
    lateCheckOutDeadline: "2:00 PM",
    earlyCheckInTime: "12:00 PM",
    currency: "USD",
    timezone: "America/New_York",
  },

  inactivity: {
    warningAfterMs: 90_000,
    resetAfterMs: 30_000,
  },

  orientation: "landscape",

  integrations: {
    heygenApiKey: "",
    tavusApiKey: "",
    didApiKey: "",
    resendApiKey: "",
    cloudbedsApiKey: "",
    mewsApiKey: "",
    oracleApiKey: "",
    stripeApiKey: "",
    simpleViewApiKey: "",
    trybeApiKey: "",
    book4timeApiKey: "",
    skyNavApiKey: "",
    threshold360ApiKey: "",
  },

  enabledLocales: ["en", "es", "fr", "ja"],

  customFonts: [],

  policies: { text: "" },

  survey: {
    title: "How was your stay?",
    subtitle: "Your feedback helps us improve.",
    thankYouMessage: "Thank you for your feedback!",
    showAfterCheckOut: true,
    questions: [
      { id: "q1", type: "rating", text: "Overall experience", required: true, maxRating: 5 },
      { id: "q2", type: "rating", text: "Room cleanliness", required: true, maxRating: 5 },
      { id: "q3", type: "rating", text: "Staff friendliness", required: true, maxRating: 5 },
      { id: "q4", type: "text", text: "Any comments or suggestions?", required: false },
    ],
  },

  faq: {
    categories: ["General", "Room", "Dining", "Activities", "Policies"],
    items: [
      { id: "g1", category: "General", question: "What are the check-in and check-out times?", answer: "Check-in begins at 3:00 PM and check-out is at 11:00 AM. Early check-in and late check-out may be available upon request, subject to availability. Please contact the front desk for arrangements." },
      { id: "g2", category: "General", question: "Is breakfast included?", answer: "A complimentary continental breakfast is served daily from 6:30 AM to 10:00 AM in the Grand Dining Room. Full breakfast menu available for an additional charge." },
      { id: "g3", category: "General", question: "How do I connect to Wi-Fi?", answer: "Network: NEXI-Guest-Premium. Password: WELCOME2026. You can also connect via the Wi-Fi section on the kiosk." },
      { id: "g4", category: "General", question: "Where is the gym located?", answer: "The fitness center is located on the 2nd floor, east wing. Open 24 hours for hotel guests. Access with your room key card." },
      { id: "g5", category: "General", question: "Is there a shuttle to the airport?", answer: "Complimentary airport shuttle runs every 30 minutes from 5:00 AM to 11:00 PM. Pick-up is at the main entrance." },
      { id: "g6", category: "General", question: "What is the cancellation policy?", answer: "Free cancellation up to 48 hours before check-in. Cancellations within 48 hours are subject to a one-night charge. No-shows will be charged the full stay." },
      { id: "r1", category: "Room", question: "How do I request extra towels?", answer: "You can request extra towels through Room Service on the kiosk, by calling the front desk, or speaking with our AI Concierge." },
      { id: "r2", category: "Room", question: "Is there a safe in the room?", answer: "Yes, every room has a digital safe located in the wardrobe. Instructions are on the safe door. Contact the front desk if you need assistance." },
      { id: "r3", category: "Room", question: "How do I adjust the thermostat?", answer: "The thermostat panel is located on the wall near the entrance. Tap the display to wake it, then use +/- to set your preferred temperature." },
      { id: "d1", category: "Dining", question: "What are the restaurant hours?", answer: "The Grand Dining Room serves breakfast (6:30-10:00 AM), lunch (11:30 AM-2:00 PM), and dinner (5:30-10:00 PM). The Lobby Bar is open 11:00 AM to midnight." },
      { id: "d2", category: "Dining", question: "Is room service available 24/7?", answer: "Room service is available 24/7. The full menu is available from 6:00 AM to 11:00 PM, with a limited menu overnight." },
      { id: "d3", category: "Dining", question: "Can you accommodate dietary restrictions?", answer: "Absolutely. Our kitchen accommodates vegetarian, vegan, gluten-free, and allergy-specific diets. Please inform your server or note it when ordering via the kiosk." },
      { id: "a1", category: "Activities", question: "What are the pool hours?", answer: "The pool is open daily from 6:00 AM to 10:00 PM. Towels are provided poolside. The hot tub closes at 9:00 PM." },
      { id: "a2", category: "Activities", question: "Is there a spa on-site?", answer: "Yes, the Serenity Spa is located on the 3rd floor. Open daily 9:00 AM to 8:00 PM. Book treatments at the front desk or through the kiosk." },
      { id: "a3", category: "Activities", question: "Are there activities for children?", answer: "The Kids Club operates daily from 9:00 AM to 5:00 PM for ages 4-12. Activities include arts & crafts, games, and supervised pool time." },
      { id: "p1", category: "Policies", question: "Is smoking allowed?", answer: "The hotel is entirely non-smoking indoors. Designated smoking areas are located at the north terrace and pool deck garden." },
      { id: "p2", category: "Policies", question: "What is the pet policy?", answer: "We welcome pets under 30 lbs with a $50/night pet fee. Pet-friendly rooms are available on floors 2-4. Service animals are always welcome at no charge." },
      { id: "p3", category: "Policies", question: "Is parking available?", answer: "Self-parking is $25/night and valet parking is $40/night. The parking garage is accessible from the north entrance. Electric vehicle charging stations available." },
    ],
  },

  ads: {
    items: [
      {
        id: "spa-offer",
        type: "popup",
        title: "Exclusive Spa Offer",
        subtitle: "20% off all treatments today",
        image: "/images/unsplash/photo-1544161515-4ab6ce6db874.jpg",
        ctaLabel: "Book Now",
        ctaTarget: "UPS-01",
        dismissLabel: "Maybe Later",
        enabled: true,
        screenPattern: "DSH-01",
      },
    ],
    showOnDashboard: true,
    dashboardDelayMs: 3000,
    autoDismissMs: 0,
    rotation: "first",
  },
};
