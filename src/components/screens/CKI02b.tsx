"use client";

import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import ScreenLayout from "@/components/layout/ScreenLayout";

// Field keys and values (will be translated in component)
const FIELDS_DATA = [
  { labelKey: "cki.details.fullName", value: "__GUEST_NAME__" },
  { labelKey: "cki.details.email", value: "sarah.mitchell@email.com" },
  { labelKey: "cki.details.phone", value: "+1 (555) 234-5678" },
  { labelKey: "cki.details.reservationId", value: "RES-2026-48291" },
  { labelKey: "cki.details.checkInDate", value: "February 22, 2026" },
  { labelKey: "cki.details.checkOutDate", value: "February 25, 2026" },
];

export default function GuestDetailsForm() {
  const { navigate, goBack, guestName } = useKiosk();
  const { t } = useI18n();
  const FIELDS = FIELDS_DATA.map(f => f.value === "__GUEST_NAME__" ? { ...f, value: guestName } : f);

  return (
    <ScreenLayout
      progressStep={2}
      footer={
        <>
          <button onClick={() => goBack()} className="btn btn-ghost">{t("common.back")}</button>
          <button onClick={() => navigate("CKI-03")} className="btn btn-primary">{t("cki.details.confirm")}</button>
        </>
      }
    >
      {/* Camera pill badge */}
      <div style={{ position: "absolute", top: 60, right: 24, zIndex: 10, display: "flex", alignItems: "center", gap: 8, background: "var(--primary-light)", border: "1px solid var(--primary)", borderRadius: "var(--radius-full)", padding: "6px 14px" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)" }} />
        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--primary)" }}>{t("cki.camera.active")}</span>
      </div>

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "var(--text)" }}>
          {t("cki.details.title")}
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: 4 }}>
          {t("cki.details.subtitle")}
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", gap: 12, marginTop: 20, marginBottom: 20 }}>
        {FIELDS.map((f) => (
          <div key={f.labelKey}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4, display: "block" }}>
              {t(f.labelKey)}
            </label>
            <div style={{ padding: "12px 16px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "0.9375rem", color: "var(--text)", fontWeight: 500 }}>
              {f.value}
            </div>
          </div>
        ))}
      </div>
    </ScreenLayout>
  );
}
