export type Locale = "en" | "es" | "fr" | "ja";

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "EN", flag: "🇺🇸" },
  { code: "es", label: "ES", flag: "🇪🇸" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
  { code: "ja", label: "JP", flag: "🇯🇵" },
];

export type TranslationKeys = typeof import("./en").default;
