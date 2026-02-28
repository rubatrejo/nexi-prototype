"use client";

import { useKiosk } from "@/lib/kiosk-context";
import { CheckCircle } from "@/components/ui/Icons";

export default function DKY03() {
  const { navigate, roomNumber } = useKiosk();

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1582719478250-c89cae4dc85b.jpg') center/cover", animation: "kenBurns 20s ease-in-out infinite alternate" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.7))" }} />
      <div className="grain" />

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

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#fff", marginTop: 14 }}>Key Card Ready</h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.6875rem", marginTop: 4, marginBottom: 16 }}>Please collect from dispenser below</p>

          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "var(--radius-md)", padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
              <span style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.4)" }}>Room</span>
              <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{roomNumber}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
              <span style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.4)" }}>Keys Issued</span>
              <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>1 Key Card</span>
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => navigate("DSH-01")} style={{ width: "100%", fontSize: "0.6875rem" }}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
}
