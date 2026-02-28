"use client";

import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";

export default function ECI03() {
  const { navigate, setFlowData } = useKiosk();

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ padding: 32, overflow: "auto", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", marginBottom: 24 }}>Early Check-in Fee</h1>
          <div style={{ padding: 20, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: "0.875rem" }}>
              <span style={{ color: "var(--text-secondary)" }}>Early Check-in</span>
              <span style={{ color: "var(--text)", fontWeight: 600 }}>$45.00</span>
            </div>
            <div style={{ height: 1, background: "var(--border)", margin: "12px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1rem" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text)" }}>Total</span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text)" }}>$45.00</span>
            </div>
          </div>
          <div style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)", lineHeight: 1.5 }}>
            <p>Room 1247 &middot; Deluxe King</p>
            <p>Immediate access upon payment</p>
          </div>
        </div>
        <div style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1551882547-ff40c63fe5fa.jpg') center/cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
          <div style={{ position: "relative", zIndex: 2, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="glass-card" style={{ maxWidth: 320, textAlign: "center", padding: 32 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" style={{ marginBottom: 12 }}>
                  <rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/>
                </svg>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#fff", fontSize: "1rem", marginBottom: 8 }}>Tap or Insert Card</h3>
                <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.6)" }}>Use the payment terminal below</p>
                <button className="btn btn-primary" style={{ width: "100%", marginTop: 20 }} onClick={() => { setFlowData({ payAmount: "$45.00", payNextScreen: "CKI-01", payTitle: "Early Check-in" }); navigate("PAY-02"); }}>Finish Payment</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
