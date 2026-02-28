"use client";

import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";

const STEPS = [
  { label: "Order Received", done: true },
  { label: "Preparing", done: true },
  { label: "On the Way", active: true },
  { label: "Delivered", done: false },
];

export default function RSV07() {
  const { navigate, goBack } = useKiosk();

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left — Status */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 28px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <button onClick={() => goBack()} style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 800, color: "var(--text)", letterSpacing: -0.3 }}>Order Status</h1>
              <p style={{ fontSize: "0.5625rem", color: "var(--text-secondary)", marginTop: 1 }}>Tracking your room service order</p>
            </div>
            <div style={{ padding: "8px 14px", borderRadius: "var(--radius-md)", background: "color-mix(in srgb, var(--primary) 8%, transparent)", textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontSize: "0.4375rem", color: "var(--primary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Est. Arrival</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "0.875rem", fontWeight: 800, color: "var(--primary)", marginTop: 1 }}>15 min</div>
            </div>
          </div>

          {/* Steps */}
          <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", padding: "14px 16px", marginBottom: 10 }}>
            {STEPS.map((step, i) => (
              <div key={step.label} style={{ display: "flex", gap: 14, position: "relative" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: step.done ? "var(--success)" : step.active ? "var(--primary)" : "var(--bg-elevated)",
                    border: !step.done && !step.active ? "1px solid var(--border)" : "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    animation: step.active ? "pulse 2s infinite" : undefined,
                    flexShrink: 0,
                  }}>
                    {step.done ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                    ) : step.active ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    ) : (
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--border)" }} />
                    )}
                  </div>
                  {i < STEPS.length - 1 && <div style={{ width: 2, height: 18, background: step.done ? "var(--success)" : "var(--border)" }} />}
                </div>
                <div style={{ paddingTop: 4 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: step.done || step.active ? 700 : 400, fontSize: "0.8125rem", color: step.done || step.active ? "var(--text)" : "var(--text-tertiary)" }}>{step.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Order info */}
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ flex: 1, padding: "8px 10px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
              <div style={{ fontSize: "0.4375rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: 1 }}>Order</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.75rem", color: "var(--text)" }}>ORD-4821</div>
            </div>
            <div style={{ flex: 1, padding: "8px 10px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
              <div style={{ fontSize: "0.4375rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: 1 }}>Room</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.75rem", color: "var(--text)" }}>1247</div>
            </div>
            <div style={{ flex: 1, padding: "8px 10px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
              <div style={{ fontSize: "0.4375rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: 1 }}>Total</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.75rem", color: "var(--text)" }}>$105.04</div>
            </div>
          </div>

          <div style={{ flex: 1 }} />

          <button className="btn btn-primary" onClick={() => navigate("DSH-01")} style={{ width: "100%", minHeight: 44, fontSize: "0.75rem" }}>Back to Dashboard</button>
        </div>

        {/* Right — Map placeholder */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1564501049412-61c2a3083791.jpg') center/cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.4))" }} />
          <div className="grain" />

          {/* Delivery indicator */}
          <div style={{ position: "absolute", bottom: 20, left: 16, right: 16, zIndex: 2, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "var(--radius-lg)", padding: "16px 18px", textAlign: "center" }}>
            <div style={{ fontSize: "0.5rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Delivering To</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 800, color: "#fff" }}>Room 1247 · Deluxe King</div>
            <div style={{ fontSize: "0.625rem", color: "rgba(255,255,255,0.5)", marginTop: 4 }}>Floor 12 · West Wing</div>
          </div>
        </div>
      </div>
    </div>
  );
}
