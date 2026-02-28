"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";

const OPTIONS = [
  { time: "1:00 PM", price: "$25" },
  { time: "3:00 PM", price: "$50" },
  { time: "6:00 PM", price: "$75" },
];

export default function LCO01() {
  const { navigate, goBack, setFlowData } = useKiosk();
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 48px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>Late Check-out</h1>
        <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", marginBottom: 8 }}>Current checkout: 11:00 AM</p>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)", marginBottom: 32 }}>Select your preferred checkout time</p>
        <div style={{ display: "flex", gap: 16, marginBottom: 32, width: "100%", maxWidth: 500, justifyContent: "center" }}>
          {OPTIONS.map((opt, i) => (
            <button key={i} onClick={() => setSelected(i)} style={{ flex: 1, padding: 24, borderRadius: "var(--radius-lg)", border: selected === i ? "2px solid var(--primary)" : "1px solid var(--border)", background: selected === i ? "var(--primary-light)" : "var(--bg-card)", cursor: "pointer", textAlign: "center", transition: "all 200ms" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>{opt.time}</div>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--amber)" }}>{opt.price}</div>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-primary" onClick={() => { if (selected === null) return; setFlowData({ payAmount: OPTIONS[selected].price + ".00", payNextScreen: "LCO-02", payTitle: "Late Check-out Confirmed" }); navigate("PAY-02"); }} style={{ opacity: selected === null ? 0.5 : 1 }}>Request Late Check-out</button>
          <button className="btn btn-ghost" onClick={goBack}>Back</button>
        </div>
      </div>
    </div>
  );
}
