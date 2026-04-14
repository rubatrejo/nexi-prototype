"use client";

import { useState, useEffect } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";

export default function BookingSummaryPayment() {
  const { navigate, goBack, guestName } = useKiosk();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (processing) {
      const timer = setTimeout(() => navigate("BKG-07"), 4000);
      return () => clearTimeout(timer);
    }
  }, [processing, navigate]);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ height: 3, background: "var(--border)" }}>
        <div style={{ height: "100%", width: `${(5/6)*100}%`, background: "var(--primary-bg, var(--primary))", borderRadius: 2 }} />
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left — Summary */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 24px 12px", flexShrink: 0 }}>
            <button onClick={() => goBack()} style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 800, color: "var(--text)", letterSpacing: -0.3 }}>Booking Summary</h1>
              <p style={{ fontSize: "0.625rem", color: "var(--text-secondary)", marginTop: 1 }}>Review and confirm your reservation</p>
            </div>
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflow: "auto", padding: "0 24px" }}>

          {/* Reservation details */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "12px 14px", marginBottom: 10 }}>
            <div style={{ fontSize: "0.5rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Reservation</div>
            {[
              { label: "Room Type", value: "Deluxe King" },
              { label: "Check-in", value: "Feb 22, 2026" },
              { label: "Check-out", value: "Feb 25, 2026" },
              { label: "Duration", value: "3 nights" },
              { label: "Guests", value: "2 Adults" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: "0.625rem", color: "var(--text-secondary)" }}>{item.label}</span>
                <span style={{ fontSize: "0.625rem", fontWeight: 600, color: "var(--text)" }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "12px 14px" }}>
            <div style={{ fontSize: "0.5rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Payment</div>
            {[
              { label: "Rate ($299 × 3 nights)", value: "$897.00" },
              { label: "Taxes & Fees", value: "$171.33" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                <span style={{ fontSize: "0.625rem", color: "var(--text-secondary)" }}>{item.label}</span>
                <span style={{ fontSize: "0.625rem", fontWeight: 600, color: "var(--text)" }}>{item.value}</span>
              </div>
            ))}
            <div style={{ height: 1, background: "var(--border)", margin: "6px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text)" }}>Total</span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem", color: "var(--primary)" }}>$1,068.33</span>
            </div>
          </div>

          </div>{/* end scrollable */}

          {/* CTA — fixed at bottom */}
          <div style={{ flexShrink: 0, padding: "12px 24px 16px", borderTop: "1px solid var(--border)" }}>
          <button
            className="btn btn-primary"
            onClick={() => setProcessing(true)}
            disabled={processing}
            style={{ width: "100%", minHeight: 40, fontSize: "0.75rem", opacity: processing ? 0.6 : 1 }}
          >
            {processing ? "Processing..." : "Confirm & Pay"}
          </button>
          </div>
        </div>

        {/* Right — Photo + Terminal */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1566073771259-6a8506099945.jpg') center/cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.55))" }} />
          <div className="grain" />

          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
            <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "var(--radius-lg)", padding: "28px 32px", textAlign: "center", maxWidth: 300 }}>
              {processing ? (
                <>
                  <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 10h20" /><path d="M6 14h4" />
                    </svg>
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "0.875rem", fontWeight: 700, color: "#fff", marginBottom: 4 }}>Processing Payment</div>
                  <div style={{ fontSize: "0.625rem", color: "rgba(255,255,255,0.5)" }}>Please tap or insert your card</div>
                  <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 14 }}>
                    {[0, 1, 2].map((i) => (
                      <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--primary)", opacity: 0.4, animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite` }} />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "#fff", marginBottom: 6 }}>$1,068.33</div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>Deluxe King · 3 nights</div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", marginTop: 2 }}>Feb 22 - 25, 2026</div>
                  <div style={{ height: 1, background: "rgba(255,255,255,0.12)", margin: "14px 0 12px" }} />
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#fff" }}>{ guestName }</div>
                  <div style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.55)", marginTop: 4 }}>sarah.mitchell@email.com</div>
                  <div style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.55)", marginTop: 2 }}>+1 (555) 234-5678</div>
                  <div style={{ fontSize: "0.625rem", color: "rgba(255,255,255,0.35)", marginTop: 6, fontStyle: "italic" }}>Late check-in, high floor preferred</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
