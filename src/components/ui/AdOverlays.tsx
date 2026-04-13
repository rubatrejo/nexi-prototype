"use client";

import { useState, useEffect } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import { useHotel } from "@/lib/theme-provider";
import type { AdItem } from "@/lib/hotel-config";
import type { ScreenId } from "@/lib/navigation";

/**
 * Match an ad's `screenPattern` against the current screen id.
 * Supports "*", exact, prefix-wildcard ("CKI-*"), and comma lists.
 */
function matchesScreen(pattern: string | undefined, currentScreen: string): boolean {
  const p = (pattern ?? "*").trim();
  if (!p || p === "*") return true;
  return p.split(",").map((s) => s.trim()).some((part) => {
    if (!part) return false;
    if (part === "*") return true;
    if (part.endsWith("*")) return currentScreen.startsWith(part.slice(0, -1));
    return part === currentScreen;
  });
}

/**
 * AdOverlays — mounted inside the KioskFrame, reads the hotel config
 * and the current screen, and renders non-popup ad types as absolute
 * overlays: hero card, bottom bar, and side banners. Popup ads are
 * still handled by the existing DSH01 → ADS01 flow so modal state
 * doesn't fight with these inline overlays.
 *
 * The ads module toggle and the "ads" module being enabled are both
 * respected upstream by DSH01; here we just filter out disabled items
 * and the popup type.
 */
export default function AdOverlays() {
  const { currentScreen, navigate } = useKiosk();
  const { ads, modules } = useHotel();

  // Kill switch: if the "ads" module is disabled, render nothing.
  const adsEnabled = modules.find((m) => m.id === "ads")?.enabled !== false;
  if (!adsEnabled) return null;

  const items = (ads?.items ?? []).filter((a) => {
    if (!a.enabled) return false;
    if ((a.type ?? "popup") === "popup") return false;
    return matchesScreen(a.screenPattern, currentScreen);
  });

  if (items.length === 0) return null;

  // One of each type per side; later items in the array are ignored
  // for a given slot.
  const hero = items.find((a) => a.type === "hero");
  const bottomBar = items.find((a) => a.type === "bottomBar");
  const leftBanner = items.find((a) => a.type === "sideBanner" && a.side === "left");
  const rightBanner = items.find((a) => a.type === "sideBanner" && a.side !== "left");

  const goCta = (ad: AdItem) => {
    if (ad.ctaTarget) navigate(ad.ctaTarget as ScreenId);
  };

  return (
    <>
      {hero && <HeroAdCard ad={hero} onCta={() => goCta(hero)} />}
      {bottomBar && <BottomBarAd ad={bottomBar} onCta={() => goCta(bottomBar)} />}
      {leftBanner && <SideBannerAd ad={leftBanner} side="left" onCta={() => goCta(leftBanner)} />}
      {rightBanner && <SideBannerAd ad={rightBanner} side="right" onCta={() => goCta(rightBanner)} />}
    </>
  );
}

// ─── Hero card ───────────────────────────────────────────────────

function HeroAdCard({ ad, onCta }: { ad: AdItem; onCta: () => void }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 90,
      display: "flex", alignItems: "center", justifyContent: "center",
      pointerEvents: "none",
    }}>
      <div style={{
        width: "55%",
        aspectRatio: "16/9",
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
        background: `linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.8) 100%), url('${ad.image}') center/cover, #222`,
        boxShadow: "0 24px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)",
        pointerEvents: "auto",
      }}>
        <button
          onClick={() => setDismissed(true)}
          style={{ position: "absolute", top: 12, right: 12, zIndex: 3, width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
        <div style={{ position: "absolute", left: 32, right: 32, bottom: 28, color: "#fff" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.01em", marginBottom: 6, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>{ad.title}</h2>
          {ad.subtitle && (
            <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.88)", marginBottom: 16, textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>{ad.subtitle}</p>
          )}
          {ad.ctaLabel && (
            <button onClick={onCta} className="btn btn-amber" style={{ fontSize: "0.875rem" }}>{ad.ctaLabel}</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Bottom bar ──────────────────────────────────────────────────

function BottomBarAd({ ad, onCta }: { ad: AdItem; onCta: () => void }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 95,
      height: "18%",
      minHeight: 80,
      background: `linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%), url('${ad.image}') center/cover, #111`,
      borderTop: "1px solid rgba(255,255,255,0.1)",
      display: "flex", alignItems: "center",
      padding: "0 32px", gap: 20,
      color: "#fff",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 800, letterSpacing: "-0.01em", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{ad.title}</div>
        {ad.subtitle && (
          <div style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.85)", marginTop: 2, textShadow: "0 1px 4px rgba(0,0,0,0.5)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ad.subtitle}</div>
        )}
      </div>
      {ad.ctaLabel && (
        <button onClick={onCta} className="btn btn-amber" style={{ flexShrink: 0, fontSize: "0.8125rem" }}>{ad.ctaLabel}</button>
      )}
      <button
        onClick={() => setDismissed(true)}
        style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>
    </div>
  );
}

// ─── Side banner ─────────────────────────────────────────────────

function SideBannerAd({ ad, side, onCta }: { ad: AdItem; side: "left" | "right"; onCta: () => void }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div
      onClick={onCta}
      style={{
        position: "absolute",
        top: "50%", transform: "translateY(-50%)",
        [side]: 12,
        width: "12%",
        aspectRatio: "1/3.5",
        minWidth: 78,
        zIndex: 92,
        borderRadius: 14,
        overflow: "hidden",
        cursor: ad.ctaTarget ? "pointer" : "default",
        background: `linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.85) 100%), url('${ad.image}') center/cover, #222`,
        boxShadow: "0 18px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: "14px 12px",
        color: "#fff",
      } as React.CSSProperties}
    >
      <button
        onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
        style={{ position: "absolute", top: 6, right: 6, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
      >
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.01em", textShadow: "0 1px 4px rgba(0,0,0,0.5)", marginBottom: 4 }}>{ad.title}</div>
      {ad.subtitle && (
        <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.82)", lineHeight: 1.3, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{ad.subtitle}</div>
      )}
      {ad.ctaLabel && (
        <div style={{ marginTop: 8, padding: "5px 10px", background: "var(--amber, #D4960A)", color: "#fff", borderRadius: 999, fontSize: "0.6rem", fontWeight: 700, textAlign: "center", textTransform: "uppercase", letterSpacing: 0.5 }}>{ad.ctaLabel}</div>
      )}
    </div>
  );
}
