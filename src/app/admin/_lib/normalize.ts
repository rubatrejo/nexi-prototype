import { hotelConfig as defaultConfig, type HotelConfig } from "@/lib/hotel-config";

/**
 * Merge a HotelConfig loaded from KV with the current defaultConfig so
 * any new fields added since the config was last saved get populated.
 * Shallow per-section merge — preserves saved values but backfills
 * anything missing.
 */
export function normalizeConfig(cfg: HotelConfig): HotelConfig {
  const d = defaultConfig;
  return {
    ...d,
    ...cfg,
    brand: { ...d.brand, ...(cfg.brand ?? {}) },
    colors: {
      ...d.colors,
      ...(cfg.colors ?? {}),
      light: { ...d.colors.light, ...((cfg.colors as HotelConfig["colors"] | undefined)?.light ?? {}) },
      dark: { ...d.colors.dark, ...((cfg.colors as HotelConfig["colors"] | undefined)?.dark ?? {}) },
    },
    fonts: { ...d.fonts, ...(cfg.fonts ?? {}) },
    images: { ...d.images, ...(cfg.images ?? {}) },
    info: { ...d.info, ...(cfg.info ?? {}), wifi: { ...d.info.wifi, ...(cfg.info?.wifi ?? {}) } },
    inactivity: { ...d.inactivity, ...(cfg.inactivity ?? {}) },
    integrations: { ...d.integrations, ...(cfg.integrations ?? {}) },
    modules: (() => {
      // Merge saved modules over defaults: every module from the
      // current default list is present (so newly added modules like
      // Survey show up on legacy configs), saved values like enabled
      // / dashboardOrder are preserved when the id matches, and order
      // follows the default array so new modules land in their
      // intended position.
      const savedById = new Map((cfg.modules ?? []).map((m) => [m.id, m] as const));
      return d.modules.map((def) => {
        const saved = savedById.get(def.id);
        return saved ? { ...def, ...saved } : def;
      });
    })(),
    rooms: cfg.rooms ?? d.rooms,
    upgrades: cfg.upgrades ?? d.upgrades,
    guestDefaults: { ...d.guestDefaults, ...(cfg.guestDefaults ?? {}) },
    enabledLocales: cfg.enabledLocales ?? d.enabledLocales,
    customFonts: cfg.customFonts ?? [],
    policies: cfg.policies ?? d.policies,
  };
}

export function makeBlankConfig(baseSlug: string): HotelConfig {
  return {
    ...structuredClone(defaultConfig),
    slug: baseSlug,
    brand: { ...defaultConfig.brand, name: "New Client Hotel", tagline: "Your Stay, Your Way" },
  };
}
