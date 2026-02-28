"use client";

import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import GlobalHeader from "@/components/layout/GlobalHeader";
import { CheckCircle } from "@/components/ui/Icons";

export default function IDVerifiedSuccess() {
  const { navigate, guestName } = useKiosk();
  const { t } = useI18n();
  const INFO = [
    { label: t("cki.idAlt.labelName"), value: guestName },
    { label: t("cki.idAlt.labelPassport"), value: "US****4521" },
    { label: t("cki.idAlt.labelNationality"), value: "United States" },
  ];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ height: 4, background: "var(--border)", position: "relative" }}>
        <div style={{ height: "100%", width: `${(3/8)*100}%`, background: "var(--primary)", borderRadius: 2, transition: "width 500ms ease" }} />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 48px", gap: 24 }}>
        <CheckCircle size={48} />

        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "var(--text)" }}>
            {t("cki.idAlt.title")}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: 4 }}>
            {t("cki.idAlt.subtitle")}
          </p>
        </div>

        {/* Info Card */}
        <div style={{ width: "100%", maxWidth: 400, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          {INFO.map((item) => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)" }}>{item.label}</span>
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)" }}>{item.value}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button className="btn btn-ghost">{t("cki.idAlt.storeLuggage")}</button>
          <button onClick={() => navigate("CKI-04")} className="btn btn-primary">{t("common.next")}</button>
        </div>
      </div>
    </div>
  );
}
