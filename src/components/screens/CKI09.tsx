"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import GlobalHeader from "@/components/layout/GlobalHeader";

const UPGRADES = [
  { name: "Suite", price: "$189", tag: "Popular", desc: "Spacious living area with panoramic views", img: "photo-1590490360182-c33d57733427" },
  { name: "Ocean View", price: "$149", tag: "Popular", desc: "Wake up to stunning ocean sunrises", img: "photo-1609766857041-ed402ea8069a" },
  { name: "Club Level", price: "$129", tag: "Upgrade", desc: "Exclusive lounge access and amenities", img: "photo-1611892440504-42a792e24d32" },
  { name: "Penthouse", price: "$349", tag: "Upgrade", desc: "Top-floor luxury with private terrace", img: "photo-1631049307264-da0ec9d70304" },
  { name: "Garden", price: "$109", tag: "Upgrade", desc: "Peaceful garden patio with direct access", img: "photo-1602002418816-5c0aeef426aa" },
  { name: "Executive", price: "$169", tag: "Upgrade", desc: "Business-ready with premium workspace", img: "photo-1618773928121-c32242e63f39" },
];

export default function RoomUpgrades() {
  const { navigate } = useKiosk();
  const { t } = useI18n();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ height: 4, background: "var(--border)", position: "relative" }}>
        <div style={{ height: "100%", width: `${(7/8)*100}%`, background: "var(--primary)", borderRadius: 2, transition: "width 500ms ease" }} />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 32px 16px", overflow: "hidden" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "var(--text)" }}>
            {t("cki.upgrades.title")}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: 4 }}>
            {t("cki.upgrades.subtitle")}
          </p>
        </div>

        {/* Horizontal scroll row with hidden scrollbar + right fade */}
        <div style={{ flex: 1, position: "relative", overflow: "visible", minHeight: 0 }}>
          {/* Right fade gradient to hint more content */}
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 64, background: "linear-gradient(to left, var(--bg), transparent)", zIndex: 2, pointerEvents: "none" }} />

          <div className="cki09-scroll" style={{ display: "flex", gap: 16, overflowX: "auto", height: "100%", alignItems: "stretch", scrollbarWidth: "none", msOverflowStyle: "none", paddingBottom: 4 }}>
            <style>{`.cki09-scroll::-webkit-scrollbar { display: none; }`}</style>
            {UPGRADES.map((u, i) => {
              const isSelected = selectedIdx === i;
              return (
              <div key={i} onClick={() => setSelectedIdx(isSelected ? null : i)} style={{
                minWidth: 200, background: "var(--bg-card)",
                border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border)",
                borderRadius: "var(--radius-lg)", overflow: "hidden", flexShrink: 0, cursor: "pointer",
                boxShadow: isSelected ? "0 0 0 3px rgba(18,136,255,0.15), 0 8px 24px rgba(18,136,255,0.12)" : "none",
                transform: isSelected ? "translateY(-4px)" : "none",
                transition: "all 200ms cubic-bezier(.4,0,.2,1)",
                position: "relative",
              }}>
                {/* Checkmark */}
                {isSelected && (
                  <div style={{ position: "absolute", top: 8, left: 8, zIndex: 3, width: 24, height: 24, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(18,136,255,0.4)" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                )}
                <div style={{ height: 90, background: `url('/images/unsplash/${u.img}.jpg') center/cover`, position: "relative" }}>
                  <div style={{ position: "absolute", top: 8, right: 8, padding: "3px 10px", borderRadius: "var(--radius-full)", background: u.tag === "Popular" ? "var(--amber)" : "var(--primary)", color: "#fff", fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase" }}>
                    {t(u.tag === "Popular" ? "cki.upgrades.popular" : "cki.upgrades.upgrade")}
                  </div>
                </div>
                <div style={{ padding: "12px 14px" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.875rem", color: isSelected ? "var(--primary)" : "var(--text)" }}>{u.name}</div>
                  <p style={{ fontSize: "0.6875rem", color: "var(--text-secondary)", marginTop: 3, lineHeight: 1.4 }}>{u.desc}</p>
                  <div style={{ fontSize: "0.8125rem", color: "var(--primary)", fontWeight: 600, marginTop: 6 }}>{u.price}<span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>{t("cki.upgrades.perNight")}</span></div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12, padding: "16px 32px", borderTop: "1px solid var(--border)" }}>
        <button onClick={() => navigate("CKI-10")} className="btn btn-ghost">{t("cki.upgrades.noThanks")} </button>
        <button onClick={() => navigate("CKI-10")} className="btn btn-primary" style={{ opacity: selectedIdx === null ? 0.5 : 1, pointerEvents: selectedIdx === null ? "none" : "auto" }}>
          {selectedIdx !== null ? `${t("cki.upgrades.select")} ${UPGRADES[selectedIdx].name} — ${UPGRADES[selectedIdx].price}${t("cki.upgrades.perNight")}` :`${t("cki.upgrades.select")} ${t("cki.upgrades.upgrade")}`}
        </button>
      </div>
    </div>
  );
}
