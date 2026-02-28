"use client";

import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import GlobalHeader from "@/components/layout/GlobalHeader";

const TIPS = [
  { icon: "M9 12l2 2 4-4", key: "cki.id.tipNotExpired" },
  { icon: "M12 3v18M3 12h18", key: "cki.id.tipFaceDown" },
  { icon: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", key: "cki.id.tipPhotoVisible" },
];

export default function ScanPassport() {
  const { navigate, goBack } = useKiosk();
  const { t } = useI18n();

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      {/* Progress bar step 3/8 */}
      <div style={{ height: 4, background: "var(--border)", position: "relative" }}>
        <div style={{ height: "100%", width: `${(3/8)*100}%`, background: "var(--primary)", borderRadius: 2, transition: "width 500ms ease" }} />
      </div>

      <div style={{ flex: 1, display: "flex" }}>
        {/* Left */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 40px" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
            {t("cki.id.title")}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", textAlign: "center", maxWidth: 340, lineHeight: 1.6, marginBottom: 32 }}>
            {t("cki.id.subtitle")}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 320 }}>
            {TIPS.map((tip, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round">
                    <path d={tip.icon} />
                  </svg>
                </div>
                <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{t(tip.key)}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
            <button onClick={() => goBack()} className="btn btn-ghost">{t("common.back")}</button>
            <button onClick={() => navigate("CKI-03b")} className="btn btn-primary">{t("cki.id.placedId")}</button>
          </div>
        </div>

        {/* Right — Passport scan video */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#000" }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            src="/passport-scan.mp4"
          />
        </div>
      </div>
    </div>
  );
}
