"use client";

import { useKiosk } from "@/lib/kiosk-context";
import { useToast } from "@/lib/use-toast";

export default function EVT03s() {
  const { navigate } = useKiosk();
  const toast = useToast();

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1510812431401-41d2bd2722f3.jpg') center/cover", animation: "kenBurns 20s ease-in-out infinite alternate" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.7))" }} />
      <div className="grain" />

      <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          maxWidth: 380, width: "100%", textAlign: "center",
          padding: "24px 28px",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "var(--radius-lg)",
        }}>
          <p style={{ fontSize: "0.5rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>Event Reservation</p>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 800, color: "#fff", letterSpacing: 1.5, marginBottom: 4 }}>Wine Tasting</div>
          <div style={{ fontSize: "0.625rem", color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>Sat, Feb 22 · 7:00 PM · Rooftop Lounge</div>

          {/* QR Code */}
          <div style={{ width: 120, height: 120, background: "#fff", borderRadius: "var(--radius-sm)", margin: "0 auto 6px", display: "flex", alignItems: "center", justifyContent: "center", padding: 8 }}>
            <div style={{ width: "100%", height: "100%", display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gridTemplateRows: "repeat(8, 1fr)", gap: 1.5 }}>
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} style={{ background: [0,1,2,3,6,7,8,15,16,23,24,31,32,39,40,47,48,55,56,57,58,59,62,63,10,13,18,21,27,29,34,36,42,44,50,52].includes(i) ? "#000" : "#fff", borderRadius: 0.5 }} />
              ))}
            </div>
          </div>
          <p style={{ fontSize: "0.5625rem", color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Scan to add to your calendar</p>

          {/* Share options */}
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 16 }}>
            {[
              { label: "Email", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg> },
              { label: "SMS", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg> },
            ].map((opt) => (
              <button key={opt.label} onClick={() => toast.show(`${opt.label} sent`)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "var(--radius-full)", color: "#fff", cursor: "pointer", fontSize: "0.6875rem", fontWeight: 500, minHeight: 36 }}>
                {opt.icon}{opt.label}
              </button>
            ))}
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.1)", marginBottom: 14 }} />

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => navigate("EVT-01")} style={{ flex: 1, fontSize: "0.6875rem", padding: "10px 16px", color: "#fff", borderColor: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.06)" }}>Back to Events</button>
            <button className="btn btn-primary" onClick={() => navigate("DSH-01")} style={{ flex: 1, fontSize: "0.6875rem", padding: "10px 16px" }}>Dashboard</button>
          </div>
        </div>
      </div>
    </div>
  );
}
