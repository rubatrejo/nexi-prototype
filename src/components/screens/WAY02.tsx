"use client";

import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";

const STEPS = [
  "Exit the elevator on Floor 1",
  "Turn left and walk past the front desk",
  "Continue straight through the main lobby",
  "The Pool entrance is on your right",
];

export default function WAY02() {
  const { goBack } = useKiosk();

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ flex: 1, display: "flex" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 48px" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>Directions to Pool</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Estimated walk: 3 minutes</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 16, position: "relative" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: i === STEPS.length - 1 ? "var(--success)" : "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                  {i < STEPS.length - 1 && <div style={{ width: 2, flex: 1, background: "var(--border)", minHeight: 24 }} />}
                </div>
                <p style={{ fontSize: "0.9375rem", color: "var(--text)", paddingBottom: 24, lineHeight: 1.5 }}>{step}</p>
              </div>
            ))}
          </div>
          <button className="btn btn-ghost" onClick={goBack} style={{ marginTop: 16, alignSelf: "flex-start" }}>Back</button>
        </div>
        <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "var(--bg-elevated)" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "80%", height: "80%", border: "2px solid var(--border)", borderRadius: "var(--radius-lg)", position: "relative" }}>
              <svg width="100%" height="100%" viewBox="0 0 200 200" style={{ position: "absolute", inset: 0 }}>
                <path d="M30 170 L30 100 L100 100 L100 50 L170 50" fill="none" stroke="var(--primary)" strokeWidth="3" strokeDasharray="8 4" strokeLinecap="round" />
                <circle cx="30" cy="170" r="6" fill="var(--primary)" />
                <circle cx="170" cy="50" r="6" fill="var(--success)" />
              </svg>
              <span style={{ position: "absolute", bottom: 12, left: 20, fontSize: "0.6875rem", color: "var(--text-tertiary)", fontWeight: 600 }}>You are here</span>
              <span style={{ position: "absolute", top: 30, right: 10, fontSize: "0.6875rem", color: "var(--success)", fontWeight: 600 }}>Pool</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
