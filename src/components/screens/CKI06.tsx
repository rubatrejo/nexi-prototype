"use client";

import { useEffect } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import GlobalHeader from "@/components/layout/GlobalHeader";

const STATUS_ITEMS = [
  { key: "cki.faceActive.faceDetected", done: true },
  { key: "cki.faceActive.analyzing", done: false },
  { key: "cki.faceActive.matching", done: false },
];

export default function FaceScanActive() {
  const { navigate } = useKiosk();
  const { t } = useI18n();

  useEffect(() => {
    const timer = setTimeout(() => navigate("CKI-07"), 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ height: 4, background: "var(--border)", position: "relative" }}>
        <div style={{ height: "100%", width: `${(4/8)*100}%`, background: "var(--primary)", borderRadius: 2 }} />
      </div>

      <div style={{ flex: 1, display: "flex" }}>
        {/* Left */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 40px" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, color: "var(--text)", marginBottom: 24 }}>
            {t("cki.faceActive.title")}
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 280 }}>
            {STATUS_ITEMS.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {item.done ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
                ) : (
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid var(--primary)", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
                )}
                <span style={{ fontSize: "0.9375rem", color: item.done ? "var(--success)" : "var(--text)", fontWeight: 500 }}>
                  {t(item.key)}{!item.done && "..."}
                </span>
              </div>
            ))}
          </div>

          <p style={{ color: "var(--text-tertiary)", fontSize: "0.8125rem", marginTop: 32 }}>
            {t("cki.faceActive.holdStill")}
          </p>
        </div>

        {/* Right — Face scan video + oval overlay */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#000" }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            src="/face-scan.mp4"
          />
          {/* Dark overlay */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />
          {/* Oval + scan line + label */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
            <div style={{ width: 180, height: 230, position: "relative" }}>
              <svg width="180" height="230" viewBox="0 0 180 230" fill="none" style={{ position: "absolute", inset: 0 }}>
                <ellipse cx="90" cy="115" rx="80" ry="105" stroke="var(--primary)" strokeWidth="2.5" opacity="0.8" />
              </svg>
              {/* Scanning line */}
              <div style={{ position: "absolute", left: 10, right: 10, height: 2, background: "var(--primary)", boxShadow: "0 0 16px var(--primary-glow)", animation: "scanLine 2.5s ease-in-out infinite" }} />
            </div>
            <div style={{ marginTop: 16, color: "#fff", fontSize: "0.8125rem", fontWeight: 600, textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
              {t("cki.faceActive.scanInProgress")}
            </div>
          </div>
          <style>{`
            @keyframes scanLine { 0%,100% { top: 10%; } 50% { top: 85%; } }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          `}</style>
        </div>
      </div>
    </div>
  );
}
