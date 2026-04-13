"use client";

import { NexiIcon } from "@/components/ui/Icons";
import { useHotel } from "@/lib/theme-provider";
import { useI18n } from "@/lib/i18n";
import { useClock, formatLongDate, formatClock12h } from "@/lib/use-clock";

export default function GlobalHeader({ variant }: { variant?: "default" | "cinematic" } = {}) {
  const isCinematic = variant === "cinematic";
  const { brand } = useHotel();
  const { locale } = useI18n();
  const now = useClock();
  const localeTag = locale === "es" ? "es-ES" : locale === "fr" ? "fr-FR" : locale === "ja" ? "ja-JP" : "en-US";

  return (
    <div
      style={{
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: isCinematic ? "rgba(0,0,0,0.5)" : "var(--bg-card)",
        backdropFilter: isCinematic ? "blur(12px)" : undefined,
        WebkitBackdropFilter: isCinematic ? "blur(12px)" : undefined,
        borderBottom: isCinematic ? "1px solid rgba(255,255,255,0.1)" : "1px solid var(--border)",
        flexShrink: 0,
        zIndex: 10,
        position: "relative",
      }}
    >
      {/* Left — Hotel Name */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <NexiIcon size={20} color={isCinematic ? "#fff" : undefined} />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "0.875rem",
            color: isCinematic ? "#fff" : "var(--text)",
            letterSpacing: "0.5px",
          }}
        >
          {brand.name}
        </span>
      </div>

      {/* Center — Date/Time (live) */}
      <span style={{ fontSize: "0.75rem", color: isCinematic ? "rgba(255,255,255,0.6)" : "var(--text-secondary)" }}>
        {formatLongDate(now, localeTag)} &mdash; {formatClock12h(now, localeTag)}
      </span>

      {/* Right — Weather */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: "0.75rem",
          color: isCinematic ? "rgba(255,255,255,0.6)" : "var(--text-secondary)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        72°F Partly Cloudy
      </div>
    </div>
  );
}
