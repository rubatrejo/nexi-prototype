"use client";

import { useHotel } from "@/lib/theme-provider";
import { NexiLogoFull, NexiIcon } from "@/components/ui/Icons";

interface BrandLogoProps {
  /** "full" renders the wordmark; "icon" renders the square mark. */
  variant?: "full" | "icon";
  /** Use the light-background SVG variant. Defaults to light. */
  theme?: "light" | "dark";
  /** Passed through to the inline NEXI SVG fallback; ignored for custom uploaded logos. */
  color?: string;
  /** Pixel height applied to both inline SVG and <img> modes. */
  height?: number;
}

/**
 * Renders the active hotel's logo. Reads brand.logo / brand.icon from
 * HotelConfig. If the path points to the default NEXI assets, falls back
 * to the inline SVG component (which accepts a runtime `color` prop). For
 * any other path — a custom uploaded logo for a white-labelled client —
 * renders an <img> tag so arbitrary SVGs and PNGs are supported.
 */
export default function BrandLogo({
  variant = "full",
  theme = "light",
  color,
  height = 38,
}: BrandLogoProps) {
  const { brand } = useHotel();

  const path =
    variant === "icon"
      ? theme === "dark"
        ? brand.iconWhite
        : brand.icon
      : theme === "dark"
        ? brand.logoWhite
        : brand.logo;

  const isDefaultNexi =
    !path ||
    path.startsWith("/logos/nexi-logo-full") ||
    path.startsWith("/logos/nexi-icon");

  if (isDefaultNexi) {
    return variant === "icon" ? (
      <NexiIcon size={height} color={color} />
    ) : (
      <NexiLogoFull height={height} color={color} />
    );
  }

  return (
    <img
      src={path}
      alt={brand.name}
      style={{ height, width: "auto", display: "block" }}
    />
  );
}
