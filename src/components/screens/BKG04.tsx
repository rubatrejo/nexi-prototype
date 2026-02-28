"use client";

import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";

export default function GuestInformation() {
  const { navigate, goBack, guestName } = useKiosk();
  const FIELDS = [
    { label: "First Name", value: guestName.split(" ")[0] },
    { label: "Last Name", value: guestName.split(" ").slice(1).join(" ") || "Guest" },
    { label: "Email", value: "guest@email.com", full: true },
    { label: "Phone", value: "+1 (555) 234-5678", full: true },
  ];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ height: 3, background: "var(--border)" }}>
        <div style={{ height: "100%", width: `${(4/6)*100}%`, background: "var(--primary)", borderRadius: 2 }} />
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left — Form */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 24px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <button onClick={() => goBack()} style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 800, color: "var(--text)", letterSpacing: -0.3 }}>Guest Information</h1>
              <p style={{ fontSize: "0.625rem", color: "var(--text-secondary)", marginTop: 1 }}>Please confirm your details</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {FIELDS.map((field) => (
              <div key={field.label} style={field.full ? { gridColumn: "1 / -1" } : {}}>
                <label style={{ fontSize: "0.5rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: 3, display: "block" }}>{field.label}</label>
                <input
                  readOnly
                  value={field.value}
                  style={{ width: "100%", padding: "8px 12px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text)", fontSize: "0.6875rem", outline: "none", fontFamily: "'Inter', sans-serif" }}
                />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 10 }}>
            <label style={{ fontSize: "0.5rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: 3, display: "block" }}>Special Requests</label>
            <textarea
              readOnly
              value="Late check-in, high floor preferred"
              style={{ width: "100%", height: 44, padding: "8px 12px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text)", fontSize: "0.6875rem", resize: "none", outline: "none", fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* CTA */}
          <button className="btn btn-primary" onClick={() => navigate("BKG-05")} style={{ width: "100%", minHeight: 40, fontSize: "0.75rem" }}>
            Continue to Payment
          </button>
        </div>

        {/* Right — Booking Summary + Photo */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Photo */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1611892440504-42a792e24d32.jpg') center/cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 40%, rgba(0,0,0,0.6))" }} />

            {/* Booking summary overlaid on photo */}
            <div style={{ position: "absolute", bottom: 16, left: 16, right: 16, zIndex: 2, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "var(--radius-md)", padding: "14px 16px" }}>
              <div style={{ fontSize: "0.5rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Booking Summary</div>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: "0.625rem", color: "rgba(255,255,255,0.8)" }}>Deluxe King · 3 nights</span>
                <span style={{ fontSize: "0.625rem", color: "#fff", fontWeight: 600 }}>$897.00</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: "0.625rem", color: "rgba(255,255,255,0.5)" }}>Tax & Fees</span>
                <span style={{ fontSize: "0.625rem", color: "rgba(255,255,255,0.5)" }}>$112.00</span>
              </div>
              <div style={{ height: 1, background: "rgba(255,255,255,0.12)", margin: "6px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#fff" }}>Total</span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem", color: "#fff" }}>$1,009.00</span>
              </div>

              {/* Room details row */}
              <div style={{ display: "flex", gap: 8, marginTop: 10, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                {["1 King Bed", "450 sq ft", "12th Floor", "Feb 22-25"].map((d) => (
                  <span key={d} style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>{d}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
