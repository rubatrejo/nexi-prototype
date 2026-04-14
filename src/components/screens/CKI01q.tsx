"use client";

import { useEffect } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";

export default function CheckinQRScan() {
  const { navigate, goBack } = useKiosk();

  // Auto-transition: simulate successful scan after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => navigate("CKI-02b" as any), 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />

      {/* Progress bar step 1/8 */}
      <div style={{ height: 4, background: "var(--border)", position: "relative" }}>
        <div style={{ height: "100%", width: `${(1/8)*100}%`, background: "var(--primary-bg, var(--primary))", borderRadius: 2, transition: "width 500ms ease" }} />
      </div>

      <div style={{ flex: 1, display: "flex", gap: 0 }}>
        {/* Left — Instructions */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 48px", gap: 24 }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
              Scan Your QR Code
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>
              Hold your booking confirmation QR code up to the camera
            </p>
          </div>

          {/* Tips */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: "📱", text: "Open your booking confirmation email" },
              { icon: "📷", text: "Hold the QR code facing the camera" },
              { icon: "📏", text: "Keep it steady, about 6 inches away" },
            ].map((tip, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  background: "var(--bg-elevated)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round">
                    {i === 0 && <><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></>}
                    {i === 1 && <><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></>}
                    {i === 2 && <><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><path d="M12 22V12M3.27 6.96L12 12l8.73-5.04" /></>}
                  </svg>
                </div>
                <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{tip.text}</span>
              </div>
            ))}
          </div>

          {/* Back button */}
          <button onClick={() => goBack()} className="btn btn-ghost" style={{ alignSelf: "flex-start" }}>
            Back to Search
          </button>
        </div>

        {/* Right — Camera viewfinder */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-elevated)", position: "relative", overflow: "hidden" }}>
          {/* Simulated camera feed background */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", opacity: 0.95 }} />
          
          {/* Camera active badge */}
          <div style={{ position: "absolute", top: 16, right: 16, display: "flex", alignItems: "center", gap: 6, background: "rgba(18,136,255,0.9)", borderRadius: "var(--radius-full)", padding: "6px 14px", zIndex: 2 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E" }} />
            <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#fff" }}>Camera Active</span>
          </div>

          {/* QR Viewfinder */}
          <div style={{ position: "relative", zIndex: 2, width: 200, height: 200 }}>
            {/* Corner brackets */}
            <div style={{ position: "absolute", top: 0, left: 0, width: 40, height: 40, borderTop: "3px solid var(--primary)", borderLeft: "3px solid var(--primary)", borderRadius: "4px 0 0 0" }} />
            <div style={{ position: "absolute", top: 0, right: 0, width: 40, height: 40, borderTop: "3px solid var(--primary)", borderRight: "3px solid var(--primary)", borderRadius: "0 4px 0 0" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, width: 40, height: 40, borderBottom: "3px solid var(--primary)", borderLeft: "3px solid var(--primary)", borderRadius: "0 0 0 4px" }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 40, height: 40, borderBottom: "3px solid var(--primary)", borderRight: "3px solid var(--primary)", borderRadius: "0 0 4px 0" }} />

            {/* Scanning line */}
            <div style={{ position: "absolute", left: 10, right: 10, height: 2, background: "var(--primary)", boxShadow: "0 0 12px var(--primary-glow)", animation: "scanLine 2s ease-in-out infinite" }} />

            {/* Center QR icon */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1">
                <rect x="2" y="2" width="8" height="8" rx="1" />
                <rect x="14" y="2" width="8" height="8" rx="1" />
                <rect x="2" y="14" width="8" height="8" rx="1" />
                <rect x="14" y="14" width="4" height="4" />
                <rect x="18" y="18" width="4" height="4" />
                <rect x="14" y="18" width="4" height="4" />
                <rect x="18" y="14" width="4" height="4" />
              </svg>
            </div>
          </div>

          {/* Bottom label */}
          <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center", zIndex: 2 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)", borderRadius: "var(--radius-full)", padding: "8px 20px" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)", animation: "pulse 2s ease-in-out infinite" }} />
              <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>Waiting for QR code...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
