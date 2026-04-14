"use client";

import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import GlobalHeader from "@/components/layout/GlobalHeader";

export default function CheckOutStart() {
  const { navigate, guestName } = useKiosk();
  const { t } = useI18n();

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ height: 4, background: "var(--border)", position: "relative" }}>
        <div style={{ height: "100%", width: `${(1/5)*100}%`, background: "var(--primary-bg, var(--primary))", borderRadius: 2, transition: "width 500ms ease" }} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 48px", gap: 20 }}>
        {/* Icon */}
        <div style={{ width: 52, height: 52, borderRadius: "var(--radius-md)", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
        </div>

        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", fontWeight: 800, color: "var(--text)", letterSpacing: -0.5 }}>
            {t("cko.start.title")}
          </h1>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: 4 }}>
            {t("cko.start.subtitle")}
          </p>
        </div>

        {/* Guest Info Card */}
        <div style={{ width: "100%", maxWidth: 380, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: "var(--radius-full)", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.8125rem" }}>
              SM
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem", color: "var(--text)" }}>{ guestName }</div>
              <div style={{ fontSize: "0.6875rem", color: "var(--text-secondary)" }}>RES-2026-48291</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: t("cko.start.room"), value: "1247" },
              { label: t("cki.found.roomType"), value: "Deluxe King" },
              { label: t("cki.found.checkIn"), value: "Feb 22, 2026" },
              { label: t("cki.found.checkOut"), value: "Feb 25, 2026" },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ fontSize: "0.5625rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-tertiary)", marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.8125rem", color: "var(--text)" }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => navigate("DSH-01")}>{t("cko.start.backToDashboard")}</button>
          <button className="btn btn-primary" onClick={() => navigate("CKO-02")}>{t("cko.start.reviewStay")}</button>
        </div>
      </div>
    </div>
  );
}
