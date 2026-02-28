"use client";

import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import GlobalHeader from "@/components/layout/GlobalHeader";

const TIPS = [
  { key: "cki.face.tipRemoveAccessories" },
  { key: "cki.face.tipEnsureLighting" },
  { key: "cki.face.tipFaceCamera" },
];

export default function FacialRecognitionPrompt() {
  const { navigate, goBack } = useKiosk();
  const { t } = useI18n();

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ height: 4, background: "var(--border)", position: "relative" }}>
        <div style={{ height: "100%", width: `${(4/8)*100}%`, background: "var(--primary)", borderRadius: 2, transition: "width 500ms ease" }} />
      </div>

      <div style={{ flex: 1, display: "flex" }}>
        {/* Left */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 40px" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
            {t("cki.face.title")}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", textAlign: "center", maxWidth: 340, lineHeight: 1.6, marginBottom: 32 }}>
            {t("cki.face.subtitle")}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 320 }}>
            {TIPS.map((tip, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round">
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{t(tip.key)}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
            <button onClick={() => goBack()} className="btn btn-ghost">{t("common.back")}</button>
            <button onClick={() => navigate("CKI-05")} className="btn btn-primary">{t("cki.face.startScan")}</button>
          </div>
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
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
          {/* Oval + instructions */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
            <div style={{ width: 180, height: 230, borderRadius: "50%", border: "3px dashed rgba(255,255,255,0.6)", position: "relative" }}>
              <svg width="180" height="230" viewBox="0 0 180 230" fill="none" style={{ position: "absolute", inset: 0 }}>
                <ellipse cx="90" cy="115" rx="80" ry="105" stroke="var(--primary)" strokeWidth="2" strokeDasharray="8 4" opacity="0.7" />
              </svg>
            </div>
            <div style={{ marginTop: 20, textAlign: "center", color: "#fff", fontSize: "0.875rem", fontWeight: 600, textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
              {t("cki.face.positionInOval")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
