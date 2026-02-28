"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";

const METHODS = [
  { id: "room", label: "Charge to Room", desc: "Add to Room 1247 bill", cta: "Charge to Room", route: "RSV-06" as const, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg> },
  { id: "terminal", label: "Pay with Terminal", desc: "Credit, debit or mobile pay", cta: "Pay Now", route: "PAY-02" as const, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20M6 16h4"/></svg> },
];

export default function RSV05p() {
  const { navigate, goBack } = useKiosk();
  const [selected, setSelected] = useState(0);

  const subtotal = 78;
  const delivery = 13;
  const tip = 14.04;
  const total = subtotal + delivery + tip;

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", overflow: "hidden" }}>
      {/* Left — Payment method */}
      <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 32px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <button onClick={() => goBack()} style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 800, color: "var(--text)", letterSpacing: -0.3 }}>Payment</h1>
              <p style={{ fontSize: "0.5625rem", color: "var(--text-secondary)", marginTop: 2 }}>Choose how to pay for your order</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {METHODS.map((m, i) => (
              <button
                key={m.id}
                onClick={() => setSelected(i)}
                style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                  background: "var(--bg-card)", border: selected === i ? "2px solid var(--primary)" : "1px solid var(--border)",
                  borderRadius: "var(--radius-md)", cursor: "pointer", textAlign: "left",
                }}
              >
                <div style={{ width: 18, height: 18, borderRadius: "50%", border: selected === i ? "5px solid var(--primary)" : "2px solid var(--border)", flexShrink: 0 }} />
                <div style={{ color: "var(--text)", flexShrink: 0 }}>{m.icon}</div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.8125rem", color: "var(--text)" }}>{m.label}</div>
                  <div style={{ fontSize: "0.625rem", color: "var(--text-secondary)", marginTop: 1 }}>{m.desc}</div>
                </div>
              </button>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          <button className="btn btn-primary" onClick={() => navigate(METHODS[selected].route)} style={{ width: "100%", minHeight: 44, fontSize: "0.75rem", fontWeight: 700 }}>
            {METHODS[selected].cta} · ${total.toFixed(2)}
          </button>
        </div>
      </div>

      {/* Right — Full-height photo + order summary */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1551218808-94e220e084d2.jpg') center/cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.6))" }} />
        <div className="grain" />

        <div style={{ position: "absolute", bottom: 24, left: 20, right: 20, zIndex: 2, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "var(--radius-lg)", padding: "18px 20px" }}>
          <div style={{ fontSize: "0.5625rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Order Summary</div>

          {[
            { label: "Subtotal (5 items)", value: `$${subtotal}` },
            { label: "Delivery fee (incl. express)", value: `$${delivery}` },
            { label: "Tip (18%)", value: `$${tip.toFixed(2)}` },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
              <span style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.55)" }}>{item.label}</span>
              <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#fff" }}>{item.value}</span>
            </div>
          ))}

          <div style={{ height: 1, background: "rgba(255,255,255,0.15)", margin: "10px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.8125rem", color: "#fff" }}>Total</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", color: "#fff" }}>${total.toFixed(2)}</span>
          </div>

          <div style={{ marginTop: 12, padding: "10px 0 0", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.625rem", color: "rgba(255,255,255,0.5)" }}>Delivery to</span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fff" }}>Room 1247 · Deluxe King</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
