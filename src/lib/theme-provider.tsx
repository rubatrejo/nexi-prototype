"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { hotelConfig, type HotelConfig } from "./hotel-config";

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

    // Shared colors (both modes)
    root.style.setProperty("--primary", c.primary);
    root.style.setProperty("--primary-hover", c.primaryHover);
    root.style.setProperty("--primary-light", c.primaryLight);
    root.style.setProperty("--primary-glow", c.primaryGlow);
    root.style.setProperty("--amber", c.amber);
    root.style.setProperty("--amber-light", c.amberLight);
    root.style.setProperty("--success", c.success);
    root.style.setProperty("--error", c.error);
    root.style.setProperty("--warning", c.warning);
    root.style.setProperty("--purple", c.purple);

    // Mode-specific colors are handled via data-theme attribute
    // and the CSS variables in globals.css — but we override the base values
    // so a new hotel's colors propagate automatically.
    const theme = root.getAttribute("data-theme") || "light";
    const modeColors = theme === "dark" ? c.dark : c.light;

    root.style.setProperty("--bg", modeColors.bg);
    root.style.setProperty("--bg-card", modeColors.bgCard);
    root.style.setProperty("--bg-elevated", modeColors.bgElevated);
    root.style.setProperty("--text", modeColors.text);
    root.style.setProperty("--text-secondary", modeColors.textSecondary);
    root.style.setProperty("--text-tertiary", modeColors.textTertiary);
    root.style.setProperty("--border", modeColors.border);
    root.style.setProperty("--border-hover", modeColors.borderHover);

    // Font family
    root.style.setProperty("--font-display", activeConfig.fonts.display);
    root.style.setProperty("--font-body", activeConfig.fonts.body);
    if (activeConfig.fonts.mono) {
      root.style.setProperty("--font-mono", activeConfig.fonts.mono);
    }
  }, [activeConfig]);

  // Listen for theme changes to re-apply mode colors
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const root = document.documentElement;
      const theme = root.getAttribute("data-theme") || "light";
      const c = activeConfig.colors;
      const modeColors = theme === "dark" ? c.dark : c.light;

      root.style.setProperty("--bg", modeColors.bg);
      root.style.setProperty("--bg-card", modeColors.bgCard);
      root.style.setProperty("--bg-elevated", modeColors.bgElevated);
      root.style.setProperty("--text", modeColors.text);
      root.style.setProperty("--text-secondary", modeColors.textSecondary);
      root.style.setProperty("--text-tertiary", modeColors.textTertiary);
      root.style.setProperty("--border", modeColors.border);
      root.style.setProperty("--border-hover", modeColors.borderHover);
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
