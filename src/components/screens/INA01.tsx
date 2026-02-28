"use client";

import { useKiosk } from "@/lib/kiosk-context";

export default function INA01() {
  const { navigate, goBack } = useKiosk();

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)" }}>
      <div className="glass-card" style={{ maxWidth: 400, textAlign: "center", padding: 40 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--warning)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: 8 }}>Are you still there?</h1>
        <p style={{ fontSize: "0.9375rem", color: "rgba(255,255,255,0.6)", marginBottom: 24 }}>Your session will end in 15 seconds</p>
        <div style={{ width: 80, height: 80, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.2)", margin: "0 auto 28px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <svg width="80" height="80" viewBox="0 0 80 80" style={{ position: "absolute", transform: "rotate(-90deg)" }}>
            <circle cx="40" cy="40" r="37" fill="none" stroke="var(--warning)" strokeWidth="3" strokeDasharray="232.5" strokeDashoffset="0" strokeLinecap="round" style={{ animation: "countdown 15s linear forwards" }} />
          </svg>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>15</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={goBack}>Continue</button>
          <button className="btn btn-ghost" style={{ width: "100%", color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.2)" }} onClick={() => navigate("IDL-01")}>End Session</button>
        </div>
      </div>
    </div>
  );
}
