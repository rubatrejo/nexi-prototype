"use client";

import { useKiosk } from "@/lib/kiosk-context";
import { CheckCircle } from "@/components/ui/Icons";

export default function BookingConfirmed() {
  const { navigate } = useKiosk();

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1571896349842-33c89424de2d.jpg') center/cover", animation: "kenBurns 20s ease-in-out infinite alternate" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.7))" }} />
      <div className="grain" />

      {/* Centered glass card — same pattern as CKI-07 / CKO-06 */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <div style={{
          maxWidth: 380, width: "100%", textAlign: "center",
          padding: "28px 32px",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "var(--radius-lg)",
        }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CheckCircle size={48} color="#22c55e" />
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#fff", marginTop: 14 }}>Booking Confirmed!</h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.75rem", marginTop: 4 }}>Your reservation has been secured</p>

          {/* Confirmation details */}
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "var(--radius-md)", padding: "14px 16px", marginTop: 16 }}>
            <div style={{ fontSize: "0.5rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Confirmation Number</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 800, color: "#fff", letterSpacing: 1.5, marginBottom: 12 }}>BKG-2026-73951</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                { label: "Check-in", value: "Feb 22" },
                { label: "Check-out", value: "Feb 25" },
                { label: "Room", value: "Deluxe King" },
              ].map((item) => (
                <div key={item.label}>
                  <div style={{ fontSize: "0.5rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
            <button className="btn btn-ghost" onClick={() => navigate("BKG-08")} style={{ flex: 1, fontSize: "0.6875rem", color: "#fff", borderColor: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
              Share Ticket
            </button>
            <button className="btn btn-primary" onClick={() => navigate("CKI-02a")} style={{ flex: 1, fontSize: "0.6875rem" }}>Check In Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}
