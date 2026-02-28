"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";

const METHODS = [
  { id: "card", label: "Credit/Debit Card", desc: "Visa, Mastercard, Amex", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg> },
  { id: "mobile", label: "Mobile Pay", desc: "Apple Pay, Google Pay", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg> },
  { id: "room", label: "Room Charge", desc: "Charge to Room 1247", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg> },
];

export default function PAY01() {
  const { navigate, goBack } = useKiosk();
  const [selected, setSelected] = useState(0);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {/* Left */}
        <div style={{ padding: 40, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <button onClick={() => goBack()} style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)", marginBottom: 20 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </button>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", marginBottom: 24 }}>Select Payment Method</h1>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {METHODS.map((m, i) => (
              <button
                key={m.id}
                onClick={() => setSelected(i)}
                style={{
                  display: "flex", alignItems: "center", gap: 16, padding: "18px 20px",
                  background: "var(--bg-card)", border: i === selected ? "2px solid var(--primary)" : "1px solid var(--border)",
                  borderRadius: "var(--radius-md)", cursor: "pointer", textAlign: "left",
                  transition: "border-color 200ms ease",
                }}
              >
                <div style={{ width: 20, height: 20, borderRadius: "50%", border: i === selected ? "6px solid var(--primary)" : "2px solid var(--border)", flexShrink: 0, transition: "border 200ms ease" }} />
                <div style={{ color: "var(--text)", flexShrink: 0 }}>{m.icon}</div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.9375rem", color: "var(--text)" }}>{m.label}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: 2 }}>{m.desc}</div>
                </div>
              </button>
            ))}
          </div>

          <button className="btn btn-primary" onClick={() => navigate("PAY-02")} style={{ marginTop: 28, alignSelf: "flex-start" }}>Continue</button>
        </div>

        {/* Right */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1551882547-ff40c63fe5fa.jpg') center/cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.5))" }} />
          <div style={{ position: "absolute", bottom: 32, left: 32, right: 32, zIndex: 2 }}>
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Reservation Summary</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.7)" }}>3 nights - Deluxe King</span>
                <span style={{ fontSize: "0.8125rem", color: "#fff", fontWeight: 600 }}>$1,247.50</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.7)" }}>Taxes & fees</span>
                <span style={{ fontSize: "0.8125rem", color: "#fff", fontWeight: 600 }}>$246.04</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.15)", marginTop: 8 }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#fff" }}>Total</span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.125rem", color: "#fff" }}>$1,493.54</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
