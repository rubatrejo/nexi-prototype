"use client";

import { useKiosk } from "@/lib/kiosk-context";

export default function ADS01({ onClose }: { onClose?: () => void }) {
  const { goBack, navigate } = useKiosk();
  const dismiss = onClose || goBack;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)" }}>
      <div style={{ width: "100%", maxWidth: 380, borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--bg-card)", border: "1px solid var(--border)", position: "relative", boxShadow: "var(--shadow-lg)" }}>
        <button onClick={dismiss} style={{ position: "absolute", top: 10, right: 10, zIndex: 3, width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <div style={{ height: 150, background: "url('/images/unsplash/photo-1544161515-4ab6ce6db874.jpg') center/cover" }} />
        <div style={{ padding: "20px 24px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Exclusive Spa Offer</h2>
          <p style={{ fontSize: "0.8125rem", color: "var(--amber)", fontWeight: 600, marginBottom: 14 }}>20% off all treatments today</p>
          <div style={{ width: 64, height: 64, margin: "0 auto 8px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="4" height="4"/><path d="M21 14v3h-3M21 21h-3v-3"/></svg>
          </div>
          <p style={{ fontSize: "0.5625rem", color: "var(--text-tertiary)", marginBottom: 16 }}>Scan to book your treatment</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-amber" onClick={() => navigate("UPS-01")} style={{ flex: 1, fontSize: "0.6875rem" }}>Book Now</button>
            <button className="btn btn-ghost" onClick={dismiss} style={{ flex: 1, fontSize: "0.6875rem" }}>Maybe Later</button>
          </div>
        </div>
      </div>
    </div>
  );
}
