"use client";

import { useState, useEffect } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import { useHotel } from "@/lib/theme-provider";
import GlobalHeader from "@/components/layout/GlobalHeader";
import ADS01 from "@/components/screens/ADS01";

const MODULE_KEYS: { id: string; labelKey: string; icon: string; color: string }[] = [
  { id: "RSV-01", labelKey: "dsh.roomService", icon: "concierge-bell", color: "var(--primary)" },
  { id: "EVT-01", labelKey: "dsh.events", icon: "calendar", color: "var(--purple)" },
  { id: "LST-01", labelKey: "dsh.explore", icon: "compass", color: "var(--success)" },
  { id: "WAY-01", labelKey: "dsh.wayfinding", icon: "map-pin", color: "var(--amber)" },
  { id: "WIF-01", labelKey: "dsh.wifi", icon: "wifi", color: "var(--primary)" },
  { id: "FAQ-01", labelKey: "dsh.faq", icon: "help-circle", color: "var(--text-secondary)" },
  { id: "DKY-01", labelKey: "dsh.duplicateKey", icon: "key", color: "var(--amber)" },
  { id: "LCO-01", labelKey: "dsh.lateCheckout", icon: "clock", color: "var(--purple)" },
  { id: "CKO-01", labelKey: "dsh.checkout", icon: "log-out", color: "var(--error)" },
];

const UPGRADES = [
  {
    title: "Suite Upgrade",
    price: "$89/night",
    img: "/images/unsplash/photo-1590490360182-c33d57733427.jpg",
  },
  {
    title: "Breakfast Package",
    price: "$35/person",
    img: "/images/unsplash/photo-1504674900247-0877df9cc836.jpg",
  },
  {
    title: "Spa Access",
    price: "$45",
    img: "/images/unsplash/photo-1544161515-4ab6ce6db874.jpg",
  },
];

const AVAILABLE_ROOMS = [
  {
    title: "Deluxe King",
    price: "From $189/night",
    tag: "Best Value",
    img: "/images/unsplash/photo-1611892440504-42a792e24d32.jpg",
  },
  {
    title: "Ocean Suite",
    price: "From $329/night",
    tag: "Popular",
    img: "/images/unsplash/photo-1582719478250-c89cae4dc85b.jpg",
  },
  {
    title: "Presidential Suite",
    price: "From $599/night",
    tag: "Premium",
    img: "/images/unsplash/photo-1631049307264-da0ec9d70304.jpg",
  },
];

function ModuleIcon({ name, size = 20 }: { name: string; size?: number }) {
  const s = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const };
  switch (name) {
    case "concierge-bell": return <svg {...s}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
    case "calendar": return <svg {...s}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
    case "compass": return <svg {...s}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88" fill="currentColor" stroke="none"/></svg>;
    case "map-pin": return <svg {...s}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
    case "wifi": return <svg {...s}><path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>;
    case "help-circle": return <svg {...s}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>;
    case "key": return <svg {...s}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>;
    case "clock": return <svg {...s}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
    case "receipt": return <svg {...s}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
    case "log-out": return <svg {...s}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>;
    default: return <svg {...s}><circle cx="12" cy="12" r="10"/></svg>;
  }
}

export default function DashboardScreen() {
  const { navigate, guestName, roomNumber, roomType, checkOutDate, guestMode } = useKiosk();
  const { t } = useI18n();
  const { brand } = useHotel();
  const isCheckedIn = !guestMode && !!roomNumber;
  const [showAd, setShowAd] = useState(false);
  const [adDismissed, setAdDismissed] = useState(false);

  useEffect(() => {
    if (adDismissed) return;
    const timer = setTimeout(() => setShowAd(true), 3000);
    return () => clearTimeout(timer);
  }, [adDismissed]);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Main Content */}
        <div className="dsh-main" style={{ flex: 1, overflow: "auto", overflowX: "hidden", padding: 0, scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <style>{`.dsh-main::-webkit-scrollbar { display: none; }`}</style>
          {/* Hero */}
          <div
            style={{
              height: 215,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute", inset: 0,
              background: "url('/images/unsplash/photo-1551882547-ff40c63fe5fa.jpg') center/cover",
              animation: "kenBurns 20s ease-in-out infinite alternate",
            }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.6))" }} />
            <div className="grain" />
            {/* Room number card — only when checked in */}
            {isCheckedIn && (
              <div style={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 2,
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "var(--radius-md)",
                padding: "10px 16px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "0.5625rem", fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 2 }}>{t("dsh.yourRoom")}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{roomNumber}</div>
              </div>
            )}
            {/* My Receipts button — only when checked in */}
            {isCheckedIn && (
              <button
                onClick={() => navigate("RCT-01" as any)}
                style={{
                  position: "absolute",
                  bottom: 16,
                  right: 16,
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "var(--radius-full)",
                  cursor: "pointer",
                  transition: "all 200ms",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.25)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#fff" }}>{t("dsh.myReceipts")}</span>
              </button>
            )}
            <div style={{ position: "absolute", bottom: 24, left: 32, zIndex: 2 }}>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.2,
                }}
              >
                {isCheckedIn ? `${t("dsh.welcomeBack")}, ${guestName.split(" ")[0]}` : t("dsh.welcomeGuest").replace("{hotelName}", brand.name)}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.875rem", marginTop: 4, fontWeight: 600 }}>
                {isCheckedIn ? `${roomType} · ${t("dsh.checkout")} ${checkOutDate}` : t("dsh.exploreServices")}
              </p>
            </div>
          </div>

          {/* Module Grid */}
          <div style={{ padding: "24px 32px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
              }}
            >
              {MODULE_KEYS.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => navigate(mod.id as any)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "16px",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    transition: "all 200ms",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = mod.color;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "var(--radius-sm)",
                      background: `${mod.color}14`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: mod.color,
                      flexShrink: 0,
                    }}
                  >
                    <ModuleIcon name={mod.icon} size={18} />
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "0.8125rem",
                      color: "var(--text)",
                    }}
                  >
                    {t(mod.labelKey)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar — Upgrades */}
        <div
          style={{
            width: 260,
            borderLeft: "1px solid var(--border)",
            background: "var(--bg-card)",
            overflow: "auto",
            padding: 20,
            flexShrink: 0,
            scrollbarWidth: "none" as any,
            msOverflowStyle: "none" as any,
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: "var(--text-tertiary)",
              marginBottom: 16,
            }}
          >
            {isCheckedIn ? t("dsh.upgradesOffers") : t("dsh.availableRooms")}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(isCheckedIn ? UPGRADES : AVAILABLE_ROOMS).map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(roomNumber ? "UPS-01" as any : "BKG-01" as any)}
                style={{
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  background: "var(--bg)",
                  textAlign: "left",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    height: 80,
                    background: `url('${item.img}') center/cover`,
                  }}
                />
                {"tag" in item && (
                  <div style={{ position: "absolute", top: 6, right: 6, background: "var(--primary)", color: "#fff", fontSize: "0.5625rem", fontWeight: 700, padding: "2px 8px", borderRadius: "var(--radius-full)" }}>{(item as any).tag}</div>
                )}
                <div style={{ padding: "10px 12px" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "0.8125rem",
                      color: "var(--text)",
                    }}
                  >
                    {item.title}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--amber)", fontWeight: 600, marginTop: 2 }}>
                    {item.price}
                  </div>
                </div>
              </button>
            ))}
          </div>
          {!isCheckedIn && (
            <button className="btn btn-primary" onClick={() => navigate("BKG-01" as any)} style={{ width: "100%", marginTop: 12, fontSize: "0.6875rem" }}>{t("dsh.bookRoom")}</button>
          )}
        </div>
      </div>

      {/* Promo popup overlay — 3s after entering dashboard */}
      {showAd && (
        <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
          <ADS01 onClose={() => { setShowAd(false); setAdDismissed(true); }} />
        </div>
      )}
    </div>
  );
}
