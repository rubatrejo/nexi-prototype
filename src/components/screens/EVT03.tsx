"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import { CheckCircle } from "@/components/ui/Icons";

export default function EVT03() {
  const { navigate } = useKiosk();
  const [calendarAdded, setCalendarAdded] = useState(false);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1510812431401-41d2bd2722f3.jpg') center/cover", animation: "kenBurns 20s ease-in-out infinite alternate" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.7))" }} />
      <div className="grain" />

      {/* Centered glass card — same as BKG-07 */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
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

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#fff", marginTop: 14 }}>You're In!</h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.75rem", marginTop: 4 }}>Your spot has been reserved</p>

          {/* Event details */}
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "var(--radius-md)", padding: "14px 16px", marginTop: 16 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fff", marginBottom: 8 }}>Wine Tasting</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "Date", value: "Sat, Feb 22" },
                { label: "Time", value: "7:00 PM" },
                { label: "Location", value: "Rooftop Lounge" },
                { label: "Charged", value: "$45 · Room 1247" },
              ].map((item) => (
                <div key={item.label} style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "0.4375rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: "0.625rem", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
            <button className="btn btn-ghost" onClick={() => navigate("EVT-03s")} style={{ flex: 1, fontSize: "0.6875rem", padding: "12px 16px", color: "#fff", borderColor: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Add to Calendar
            </button>
            <button className="btn btn-primary" onClick={() => navigate("EVT-01")} style={{ flex: 1, fontSize: "0.6875rem", padding: "12px 16px" }}>Back to Events</button>
          </div>
        </div>
      </div>
    </div>
  );
}
