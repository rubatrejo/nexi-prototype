"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import ScreenLayout from "@/components/layout/ScreenLayout";

const PREFS = [
  { category: "Floor", options: ["High", "Mid", "Low"], icons: ["M3 7l9-4 9 4v10l-9 4-9-4V7z", "M3 12h18", "M3 17l9 4 9-4"] },
  { category: "View", options: ["Ocean", "City", "Garden"], icons: ["M2 20l4-8 4 4 4-6 4 6 4-4", "M3 21h18M5 21V7l4-4h6l4 4v14", "M12 22c-4 0-8-2-8-6 0-6 8-14 8-14s8 8 8 14c0 4-4 6-8 6z"] },
  { category: "Bed", options: ["King", "Two Queens"], icons: ["M3 18V9a2 2 0 012-2h14a2 2 0 012 2v9M3 18h18", "M3 18V9a2 2 0 012-2h4v4h6V7h4a2 2 0 012 2v9M3 18h18"] },
  { category: "Near", options: ["Elevator", "Pool", "Quiet"], icons: ["M3 3h6v18H3zM9 12h6", "M12 22c-4 0-8-3-8-8s4-8 8-8 8 3 8 8-4 8-8 8z", "M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l3.707-3.707A1 1 0 0111 6v12a1 1 0 01-1.707.707L5.586 15z"] },
];

export default function FloorRoomPreference() {
  const { navigate } = useKiosk();
  const { t } = useI18n();
  const [selected, setSelected] = useState<Record<string, string>>({});

  const toggle = (cat: string, opt: string) => {
    setSelected((s) => ({ ...s, [cat]: s[cat] === opt ? "" : opt }));
  };

  return (
    <ScreenLayout
      footer={
        <>
          <button className="btn btn-ghost btn-lg" onClick={() => navigate("CKI-12")}>Skip</button>
          <button className="btn btn-primary btn-lg" onClick={() => navigate("CKI-12")}>Confirm</button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28, flex: 1, paddingTop: 32, paddingBottom: 32 }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "var(--text)" }}>Choose Your Preferences</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: 4 }}>Select your ideal room setup</p>
        </div>

        <div style={{ width: "100%", maxWidth: 600, display: "flex", flexDirection: "column", gap: 20 }}>
          {PREFS.map((pref) => (
            <div key={pref.category}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>{pref.category}</div>
              <div style={{ display: "flex", gap: 8 }}>
                {pref.options.map((opt, i) => {
                  const active = selected[pref.category] === opt;
                  return (
                    <button key={opt} onClick={() => toggle(pref.category, opt)} style={{ flex: 1, padding: "14px 12px", background: active ? "var(--primary-light)" : "var(--bg-card)", border: `1.5px solid ${active ? "var(--primary)" : "var(--border)"}`, borderRadius: "var(--radius-md)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transition: "all 200ms" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--primary)" : "var(--text-tertiary)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d={pref.icons[Math.min(i, pref.icons.length - 1)]} />
                      </svg>
                      <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: active ? "var(--primary)" : "var(--text)" }}>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScreenLayout>
  );
}
