"use client";

import { useHotel } from "@/lib/theme-provider";

interface BrandSpinnerProps {
  /** Pixel size of the spinner (square). */
  size?: number;
  /** Visual context — controls the generic ring colour for contrast. */
  tone?: "light" | "dark";
}

/**
 * Renders the active hotel's loading spinner.
 *
 * If `brand.spinner` is set in the hotel config, that image is rendered
 * spinning. If it's not set, falls back to a generic stroked-ring
 * spinner whose colour adapts to the surrounding context: dark tone
 * (cinematic photo backgrounds) gets a white ring, light tone (default
 * light bg) gets a `var(--primary)` ring.
 *
 * Replaces the previous BrandLogo-as-spinner pattern so unconfigured
 * clients see a clean, neutral loading indicator instead of NEXI's
 * brand mark — and so configured clients can drop in a custom mark
 * without it competing visually with the rest of the screen.
 */
export default function BrandSpinner({ size = 56, tone = "light" }: BrandSpinnerProps) {
  const { brand } = useHotel();
  const customSpinner = brand.spinner?.trim();

  if (customSpinner) {
    return (
      <img
        src={customSpinner}
        alt="Loading"
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          animation: "brandSpinnerSpin 1.4s linear infinite",
          display: "block",
        }}
      />
    );
  }

  const stroke = tone === "dark" ? "#fff" : "var(--primary, #1288FF)";
  const trackStroke = tone === "dark" ? "rgba(255,255,255,0.15)" : "var(--border, #E8E8E3)";

  return (
    <div style={{ width: size, height: size, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox="0 0 50 50" style={{ animation: "brandSpinnerSpin 1.1s linear infinite", display: "block" }}>
        <circle cx="25" cy="25" r="20" fill="none" stroke={trackStroke} strokeWidth="4" />
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={stroke}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="40 85"
        />
      </svg>
      <style>{`@keyframes brandSpinnerSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
