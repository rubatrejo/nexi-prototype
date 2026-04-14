// Locales the /admin Languages tab can toggle on the kiosk's language
// picker. Adding a new locale here is free — but its translations need
// to also exist in `src/lib/i18n/{code}.ts` to avoid runtime fallbacks.
export const ADMIN_LOCALES: { code: string; label: string; name: string; flag: string }[] = [
  { code: "en", label: "EN", name: "English",  flag: "🇺🇸" },
  { code: "es", label: "ES", name: "Español",  flag: "🇪🇸" },
  { code: "fr", label: "FR", name: "Français", flag: "🇫🇷" },
  { code: "ja", label: "JP", name: "日本語",   flag: "🇯🇵" },
];

// Curated Google Fonts list for the typography picker. The user can
// also add custom fonts via the Fonts tab — those flow into the
// `customFonts` array on HotelConfig and get appended at runtime.
export const GOOGLE_FONTS = [
  "Mona Sans",
  "Inter",
  "Playfair Display",
  "Space Grotesk",
  "DM Sans",
  "Manrope",
  "Instrument Serif",
  "Cormorant Garamond",
  "Fraunces",
  "Geist",
];

// The /admin tab strip — order, label and accompanying icon key. The
// `key` here is also the key used in `ICONS` (_lib/icons.tsx). Tabs
// 14 (survey) / 15 (faq) / 13 (ads) / 11 (languages) only render when
// their respective module is enabled in the Modules tab — that gating
// lives in AdminCMS, not here.
export const SECTIONS = [
  { key: "client", num: "01", label: "Client", title: "Client Profile", desc: "Who the client is — identity, logos, internal notes and the slug used to route the kiosk." },
  { key: "colors", num: "02", label: "Colors", title: "Colors", desc: "Primary accent and the light/dark surface palettes." },
  { key: "fonts", num: "03", label: "Typography", title: "Typography", desc: "Google Fonts for display and body across the kiosk." },
  { key: "images", num: "04", label: "Images", title: "Hero Imagery", desc: "Hotel photography used on idle, dashboard and action screens." },
  { key: "modules", num: "05", label: "Modules", title: "Kiosk Modules", desc: "What the guest can access. Pin modules to the dashboard grid." },
  { key: "rooms", num: "06", label: "Rooms", title: "Rooms", desc: "Available room types shown during the booking flow." },
  { key: "upgrades", num: "07", label: "Upgrades", title: "Upgrades & Offers", desc: "Paid extras shown in the dashboard sidebar after check-in." },
  { key: "info", num: "08", label: "Info", title: "Hotel Information", desc: "Operational details the kiosk shows to guests." },
  { key: "timers", num: "09", label: "Timers", title: "Inactivity Timers", desc: "Tune the auto-reset thresholds for your lobby traffic." },
  { key: "apis", num: "10", label: "API Credentials", title: "API Credentials", desc: "Third-party service keys used by this client. Stored privately, never rendered on the kiosk." },
  { key: "languages", num: "11", label: "Languages", title: "Supported Languages", desc: "Pick which locales the language picker exposes on the kiosk." },
  { key: "policies", num: "12", label: "Policies", title: "Hotel Policies", desc: "Upload the PDF or Word document guests sign on check-in, or paste the text inline." },
  { key: "ads", num: "13", label: "Ads", title: "Advertisements", desc: "Manage the promotional popups shown on the dashboard when the Ads module is enabled." },
  { key: "survey", num: "14", label: "Survey", title: "Guest Survey", desc: "Post-stay feedback questions shown after checkout when the Survey module is enabled." },
  { key: "faq", num: "15", label: "FAQ", title: "Frequently Asked Questions", desc: "Q&A content rendered on the FAQ screen when the FAQ module is enabled." },
];
