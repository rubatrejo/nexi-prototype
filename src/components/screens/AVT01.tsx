"use client";

import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";

export default function AVT01() {
  const { navigate } = useKiosk();

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)", position: "relative" }}>
      <GlobalHeader />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 48px" }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1" style={{ marginBottom: 16 }}>
          <path d="M12 2L9 7l-5 1 3.5 3.5L7 17l5-2.5L17 17l-.5-5.5L20 8l-5-1z"/>
        </svg>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>Need help?</h2>
        <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)" }}>Tap the assistant to get started</p>
      </div>
      <button onClick={() => navigate("AVT-02")} style={{ position: "absolute", bottom: 32, right: 32, width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), #0a2540)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(18,136,255,0.4)", zIndex: 10 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
          <path d="M12 2L9 7l-5 1 3.5 3.5L7 17l5-2.5L17 17l-.5-5.5L20 8l-5-1z"/>
        </svg>
      </button>
    </div>
  );
}
