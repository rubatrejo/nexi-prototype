"use client";

import { useEffect, useMemo } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import { useHotel } from "@/lib/theme-provider";
import type { AdItem } from "@/lib/hotel-config";
import type { ScreenId } from "@/lib/navigation";

export default function ADS01({ onClose }: { onClose?: () => void }) {
  const { goBack, navigate } = useKiosk();
  const hotel = useHotel();
  const dismiss = onClose || goBack;

  // Pick the ad to show from config. Rotation: "first" always shows the
  // first enabled item; "random" picks one at random each mount.
  const ad: AdItem | null = useMemo(() => {
    const items = hotel.ads?.items?.filter((i) => i.enabled) ?? [];
    if (items.length === 0) return null;
    if (hotel.ads?.rotation === "random") {
      return items[Math.floor(Math.random() * items.length)];
    }
    return items[0];
  }, [hotel.ads]);

  // Optional auto-dismiss timer — fires when autoDismissMs > 0.
  useEffect(() => {
    const ms = hotel.ads?.autoDismissMs ?? 0;
    if (!ms || ms <= 0) return;
    const id = setTimeout(dismiss, ms);
    return () => clearTimeout(id);
  }, [hotel.ads?.autoDismissMs, dismiss]);

  // If the config has no enabled ads, self-dismiss on the next tick so
  // DSH-01's `showAd` state doesn't leave us rendering an empty card.
  useEffect(() => {
    if (!ad) dismiss();
  }, [ad, dismiss]);

  if (!ad) return null;

  const handleCTA = () => {
    if (ad.ctaTarget) {
      navigate(ad.ctaTarget as ScreenId);
    } else {
      dismiss();
    }
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)" }}>
      <div style={{ width: "100%", maxWidth: 380, borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--bg-card)", border: "1px solid var(--border)", position: "relative", boxShadow: "var(--shadow-lg)" }}>
        <button onClick={dismiss} style={{ position: "absolute", top: 10, right: 10, zIndex: 3, width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <div style={{ height: 150, background: `url('${ad.image}') center/cover` }} />
        <div style={{ padding: "20px 24px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{ad.title}</h2>
          {ad.subtitle && (
            <p style={{ fontSize: "0.8125rem", color: "var(--amber)", fontWeight: 600, marginBottom: 14 }}>{ad.subtitle}</p>
          )}
          <div style={{ width: 64, height: 64, margin: "0 auto 8px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="4" height="4"/><path d="M21 14v3h-3M21 21h-3v-3"/></svg>
          </div>
          <p style={{ fontSize: "0.5625rem", color: "var(--text-tertiary)", marginBottom: 16 }}>Scan to book your treatment</p>
          <div style={{ display: "flex", gap: 8 }}>
            {ad.ctaLabel && (
              <button className="btn btn-amber" onClick={handleCTA} style={{ flex: 1, fontSize: "0.6875rem" }}>{ad.ctaLabel}</button>
            )}
            <button className="btn btn-ghost" onClick={dismiss} style={{ flex: ad.ctaLabel ? 1 : undefined, fontSize: "0.6875rem" }}>{ad.dismissLabel || "Dismiss"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
