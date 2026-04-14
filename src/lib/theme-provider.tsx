"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { hotelConfig, type HotelConfig, type CustomFont } from "./hotel-config";

const CUSTOM_FONT_ATTR = "data-nexi-custom-font";

/**
 * Defensive: only accept simple solid color values for CSS variables that
 * are also used as `stroke` / `fill` on SVGs. A gradient string like
 * "linear-gradient(...)" works as a `background` but breaks every icon
 * (stroke goes invalid → invisible) and every coloured progress bar.
 *
 * Accepted shapes:
 *   - #RGB, #RRGGBB, #RRGGBBAA
 *   - rgb()/rgba()
 *   - hsl()/hsla()
 *   - color()
 *   - named colors (red, blue, …) — we accept any single-token alphabetic
 *     value as a heuristic since enumerating CSS named colors is overkill
 *
 * Anything that contains "(" without matching one of the above (i.e.
 * "linear-gradient(…)" / "radial-gradient(…)" / "conic-gradient(…)") is
 * rejected and the caller falls back to the supplied default.
 */
function sanitizeColor(value: string | undefined, fallback: string): string {
  if (!value || typeof value !== "string") return fallback;
  const v = value.trim();
  if (!v) return fallback;
  // Hex
  if (/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v)) return v;
  // rgb/rgba/hsl/hsla/color
  if (/^(rgb|rgba|hsl|hsla|color)\s*\(/i.test(v)) return v;
  // Single-token alphabetic (named colors like "red", "transparent")
  if (/^[a-zA-Z]+$/.test(v)) return v;
  // Anything else (gradients, expressions, malformed) → fallback
  return fallback;
}

/**
 * Validate a CSS gradient string. Used for fields like primaryGradient
 * where the user explicitly wants a gradient (and we want to reject any
 * accidentally-pasted solid color so the button doesn't lose its
 * intended look). Empty/undefined returns null which the caller treats
 * as "no gradient set, fall back to solid primary".
 */
function sanitizeGradient(value: string | undefined): string | null {
  if (!value || typeof value !== "string") return null;
  const v = value.trim();
  if (!v) return null;
  if (/^(linear|radial|conic|repeating-linear|repeating-radial|repeating-conic)-gradient\s*\(/i.test(v)) return v;
  return null;
}

/**
 * Inject (and re-sync) custom fonts from a HotelConfig into document.head.
 * Google and Adobe entries become <link rel="stylesheet">; upload entries
 * become <style>@font-face</style>. All injected nodes carry a
 * data-nexi-custom-font attribute so subsequent runs can clean up
 * stale ones when the config changes.
 */
function applyCustomFonts(fonts: CustomFont[] | undefined) {
  if (typeof document === "undefined") return;
  // Remove previously injected nodes — config changes should never
  // leave orphaned font tags behind.
  document.querySelectorAll(`[${CUSTOM_FONT_ATTR}]`).forEach((n) => n.remove());
  if (!fonts || fonts.length === 0) return;
  for (const f of fonts) {
    if (!f.family || !f.url) continue;
    if (f.source === "google" || f.source === "adobe") {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = f.url;
      link.setAttribute(CUSTOM_FONT_ATTR, f.family);
      document.head.appendChild(link);
    } else if (f.source === "upload") {
      // Guess format from the data URL mime; default to woff2.
      let format = "woff2";
      if (f.url.includes("font/woff2") || f.url.includes("woff2")) format = "woff2";
      else if (f.url.includes("font/woff") || f.url.includes("woff")) format = "woff";
      else if (f.url.includes("font/ttf") || f.url.includes("truetype")) format = "truetype";
      else if (f.url.includes("font/otf") || f.url.includes("opentype")) format = "opentype";
      const style = document.createElement("style");
      style.setAttribute(CUSTOM_FONT_ATTR, f.family);
      style.textContent = `@font-face { font-family: "${f.family}"; src: url("${f.url}") format("${format}"); font-display: swap; }`;
      document.head.appendChild(style);
    }
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ThemeContext = createContext<HotelConfig>(hotelConfig);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface ThemeProviderProps {
  children: ReactNode;
  config?: HotelConfig;
}

/**
 * ThemeProvider injects hotel-specific CSS variables and exposes
 * the full HotelConfig to any component via useHotel().
 *
 * Usage:
 *   <ThemeProvider>          ← uses default hotelConfig
 *   <ThemeProvider config={customConfig}>  ← override for specific hotel
 */
export function ThemeProvider({ children, config }: ThemeProviderProps) {
  const activeConfig = config || hotelConfig;

  // Inject CSS custom properties from config colors
  useEffect(() => {
    const root = document.documentElement;
    const c = activeConfig.colors;
    const def = hotelConfig.colors;

    // Shared colors (both modes) — sanitized so a malformed value like
    // a gradient string in primary doesn't break every SVG icon (which
    // uses the same variable for stroke/fill).
    const safePrimary = sanitizeColor(c.primary, def.primary);
    root.style.setProperty("--primary", safePrimary);
    root.style.setProperty("--primary-hover", sanitizeColor(c.primaryHover, def.primaryHover));
    root.style.setProperty("--primary-light", sanitizeColor(c.primaryLight, def.primaryLight));
    root.style.setProperty("--primary-glow", sanitizeColor(c.primaryGlow, def.primaryGlow));
    // --primary-bg: optional gradient for buttons / progress bars / pills.
    // Falls back to the solid primary when no gradient is configured so
    // unconfigured clients render the same as before.
    const grad = sanitizeGradient(c.primaryGradient);
    root.style.setProperty("--primary-bg", grad ?? safePrimary);
    root.style.setProperty("--amber", sanitizeColor(c.amber, def.amber));
    root.style.setProperty("--amber-light", sanitizeColor(c.amberLight, def.amberLight));
    root.style.setProperty("--success", sanitizeColor(c.success, def.success));
    root.style.setProperty("--error", sanitizeColor(c.error, def.error));
    root.style.setProperty("--warning", sanitizeColor(c.warning, def.warning));
    root.style.setProperty("--purple", sanitizeColor(c.purple, def.purple));

    // Mode-specific colors are handled via data-theme attribute
    // and the CSS variables in globals.css — but we override the base values
    // so a new hotel's colors propagate automatically.
    const theme = root.getAttribute("data-theme") || "light";
    const modeColors = theme === "dark" ? c.dark : c.light;
    const defModeColors = theme === "dark" ? def.dark : def.light;

    root.style.setProperty("--bg", sanitizeColor(modeColors.bg, defModeColors.bg));
    root.style.setProperty("--bg-card", sanitizeColor(modeColors.bgCard, defModeColors.bgCard));
    root.style.setProperty("--bg-elevated", sanitizeColor(modeColors.bgElevated, defModeColors.bgElevated));
    root.style.setProperty("--text", sanitizeColor(modeColors.text, defModeColors.text));
    root.style.setProperty("--text-secondary", sanitizeColor(modeColors.textSecondary, defModeColors.textSecondary));
    root.style.setProperty("--text-tertiary", sanitizeColor(modeColors.textTertiary, defModeColors.textTertiary));
    root.style.setProperty("--border", sanitizeColor(modeColors.border, defModeColors.border));
    root.style.setProperty("--border-hover", sanitizeColor(modeColors.borderHover, defModeColors.borderHover));

    // Font family
    root.style.setProperty("--font-display", activeConfig.fonts.display);
    root.style.setProperty("--font-body", activeConfig.fonts.body);
    if (activeConfig.fonts.mono) {
      root.style.setProperty("--font-mono", activeConfig.fonts.mono);
    }

    // Inject / refresh custom fonts imported via /admin
    applyCustomFonts(activeConfig.customFonts);
  }, [activeConfig]);

  // Listen for theme changes to re-apply mode colors
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const root = document.documentElement;
      const theme = root.getAttribute("data-theme") || "light";
      const c = activeConfig.colors;
      const def = hotelConfig.colors;
      const modeColors = theme === "dark" ? c.dark : c.light;
      const defModeColors = theme === "dark" ? def.dark : def.light;

      root.style.setProperty("--bg", sanitizeColor(modeColors.bg, defModeColors.bg));
      root.style.setProperty("--bg-card", sanitizeColor(modeColors.bgCard, defModeColors.bgCard));
      root.style.setProperty("--bg-elevated", sanitizeColor(modeColors.bgElevated, defModeColors.bgElevated));
      root.style.setProperty("--text", sanitizeColor(modeColors.text, defModeColors.text));
      root.style.setProperty("--text-secondary", sanitizeColor(modeColors.textSecondary, defModeColors.textSecondary));
      root.style.setProperty("--text-tertiary", sanitizeColor(modeColors.textTertiary, defModeColors.textTertiary));
      root.style.setProperty("--border", sanitizeColor(modeColors.border, defModeColors.border));
      root.style.setProperty("--border-hover", sanitizeColor(modeColors.borderHover, defModeColors.borderHover));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, [activeConfig]);

  return (
    <ThemeContext.Provider value={activeConfig}>
      {children}
    </ThemeContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Access the hotel configuration from any component.
 *
 * const { brand, colors, modules, rooms, images, info } = useHotel();
 */
export function useHotel() {
  return useContext(ThemeContext);
}
