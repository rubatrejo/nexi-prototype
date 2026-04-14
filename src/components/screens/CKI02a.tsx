"use client";

import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import GlobalHeader from "@/components/layout/GlobalHeader";

export default function CameraPermission() {
  const { navigate } = useKiosk();
  const { t } = useI18n();

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      {/* Progress bar step 2/8 */}
      <div style={{ height: 4, background: "var(--border)", position: "relative" }}>
        <div style={{ height: "100%", width: `${(2/8)*100}%`, background: "var(--primary-bg, var(--primary))", borderRadius: 2, transition: "width 500ms ease" }} />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 48px", gap: 24 }}>
        {/* Camera Icon */}
        <div style={{ width: 56, height: 56, borderRadius: "var(--radius-md)", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </div>

        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "var(--text)" }}>
            {t("cki.camera.title")}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.8125rem", marginTop: 8, lineHeight: 1.6 }}>
            {t("cki.camera.subtitle")}
          </p>
        </div>

        {/* Info Box */}
        <div style={{ maxWidth: 520, width: "100%", padding: "14px 18px", background: "var(--primary-light)", border: "1px solid var(--primary)", borderRadius: "var(--radius-md)", display: "flex", gap: 10, alignItems: "flex-start" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <div style={{ fontSize: "0.75rem", color: "var(--primary)", lineHeight: 1.5 }}>
            {t("cki.camera.info")}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => navigate("CKI-03")} className="btn btn-ghost">{t("cki.camera.skip")}</button>
          <button onClick={() => navigate("CKI-02b")} className="btn btn-primary">{t("cki.camera.allow")}</button>
        </div>
      </div>
    </div>
  );
}
