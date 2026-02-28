"use client";

import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import GlobalHeader from "@/components/layout/GlobalHeader";

const TIPS = [
  { titleKey: "cki.faceTips.checkLighting", descKey: "cki.faceTips.checkLightingDesc" },
  { titleKey: "cki.faceTips.removeAccessories", descKey: "cki.faceTips.removeAccessoriesDesc" },
  { titleKey: "cki.faceTips.faceCamera", descKey: "cki.faceTips.faceCameraDesc" },
];

export default function VerificationFailed() {
  const { navigate } = useKiosk();
  const { t } = useI18n();

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 48px", gap: 24 }}>
        {/* Error icon */}
        <div style={{ width: 64, height: 64, borderRadius: "50%", border: "3px solid var(--error)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </div>

        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "var(--text)" }}>
            {t("cki.faceTips.title")}
          </h1>
          <div style={{ display: "inline-block", marginTop: 8, padding: "4px 14px", borderRadius: "var(--radius-full)", background: "var(--error)", color: "#fff", fontSize: "0.75rem", fontWeight: 600 }}>
            {t("cki.faceTips.attempt")} 1 {t("cki.faceTips.of")} 3
          </div>
        </div>

        {/* Tip cards */}
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          {TIPS.map((tip, i) => (
            <div key={i} style={{ flex: 1, maxWidth: 180, padding: "16px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.8125rem", color: "var(--text)", marginBottom: 4 }}>{t(tip.titleKey)}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>{t(tip.descKey)}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button onClick={() => navigate("CKI-04")} className="btn btn-primary">{t("common.tryAgain")}</button>
          <button className="btn btn-ghost" onClick={() => navigate("STF-01")}>{t("common.requestHelp")}</button>
        </div>
      </div>
    </div>
  );
}
