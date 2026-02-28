"use client";

import { useKiosk } from "@/lib/kiosk-context";

export default function WIF01() {
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
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#fff", marginBottom: 4 }}>Wi-Fi Connect</h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.6875rem", marginBottom: 16 }}>Connect to high-speed internet</p>

          {/* Network + Password */}
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 16, padding: "10px 0", borderTop: "1px solid rgba(255,255,255,0.12)", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
            <div>
              <div style={{ fontSize: "0.5625rem", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Network</div>
              <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#fff" }}>NEXI-Guest-Premium</div>
            </div>
            <div style={{ width: 1, background: "rgba(255,255,255,0.12)" }} />
            <div>
              <div style={{ fontSize: "0.5625rem", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Password</div>
              <span style={{ fontSize: "0.8125rem", fontFamily: "monospace", fontWeight: 700, color: "#fff", letterSpacing: 2 }}>WELCOME2026</span>
            </div>
          </div>

          {/* QR Code */}
          <div style={{ width: 80, height: 80, margin: "0 auto 10px", background: "rgba(255,255,255,0.08)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.15)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="4" height="4"/><path d="M21 14v3h-3M21 21h-3v-3"/></svg>
          </div>
          <p style={{ fontSize: "0.5625rem", color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Scan QR code with your phone to auto-connect</p>

          <button className="btn btn-primary" onClick={() => navigate("DSH-01")} style={{ width: "100%", fontSize: "0.6875rem" }}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
}
