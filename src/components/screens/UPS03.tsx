"use client";

import { useKiosk } from "@/lib/kiosk-context";
import { CheckCircle } from "@/components/ui/Icons";

export default function UPS03() {
  const { navigate } = useKiosk();

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1590490360182-c33d57733427.jpg') center/cover", animation: "kenBurns 20s ease-in-out infinite alternate" }} />
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

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#fff", marginTop: 14 }}>Upgrade Confirmed!</h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.6875rem", marginTop: 4, marginBottom: 16 }}>Your new room is ready</p>

          {/* Upgrade details */}
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "var(--radius-md)", padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
              <span style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.4)" }}>New Room</span>
              <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>Ocean View Suite 1847</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
              <span style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.4)" }}>Upgrade Cost</span>
              <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>+$89/night</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
              <span style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.4)" }}>Payment</span>
              <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--amber)" }}>Charged at check-out</span>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => navigate("CKI-12")} style={{ flex: 1, fontSize: "0.6875rem", color: "#fff", borderColor: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
              New Key Card
            </button>
            <button className="btn btn-primary" onClick={() => navigate("CKI-13")} style={{ flex: 1, fontSize: "0.6875rem" }}>Get New Key</button>
          </div>
        </div>
      </div>
    </div>
  );
}
