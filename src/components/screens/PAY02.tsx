"use client";

import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";
import { useEffect } from "react";

export default function PAY02() {
  const { navigate, flowData } = useKiosk();

  useEffect(() => {
    const timer = setTimeout(() => navigate("PAY-03"), 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1566073771259-6a8506099945.jpg') center/cover", animation: "kenBurns 20s ease-in-out infinite alternate" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.5))" }} />
      <div className="grain" />

      <div style={{ position: "relative", zIndex: 2 }}>
        <GlobalHeader variant="cinematic" />
      </div>

      <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
        {/* Spinner */}
        <div style={{ width: 72, height: 72, position: "relative" }}>
          <svg width="72" height="72" viewBox="0 0 72 72" style={{ animation: "spin 8s linear infinite" }}>
            <circle cx="36" cy="36" r="32" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
            <circle cx="36" cy="36" r="32" fill="none" stroke="var(--primary)" strokeWidth="3" strokeDasharray="50 151" strokeLinecap="round" />
          </svg>
        </div>

        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "#fff" }}>Processing Payment...</h1>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 800, color: "#fff" }}>{flowData?.payAmount ? `$${flowData.payAmount}` : "$1,493.54"}</p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 20px", borderRadius: "var(--radius-full)", background: "rgba(234,179,8,0.2)", border: "1px solid rgba(234,179,8,0.3)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="2"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
          <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fff" }}>Complete payment on the terminal</span>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
