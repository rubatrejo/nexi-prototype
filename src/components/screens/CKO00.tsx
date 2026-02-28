"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import GlobalHeader from "@/components/layout/GlobalHeader";
import { SearchIcon } from "@/components/ui/Icons";

export default function CheckoutLookup() {
  const { navigate, goBack } = useKiosk();
  const { t } = useI18n();
  const [step, setStep] = useState<1 | 2>(1);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ height: 4, background: "var(--border)", position: "relative" }}>
        <div style={{ height: "100%", width: `${(1/5)*100}%`, background: "var(--primary)", borderRadius: 2, transition: "width 500ms ease" }} />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 48px", gap: 32 }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, color: "var(--text)" }}>
            {t("cko.lookup.title")}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", marginTop: 8, lineHeight: 1.6 }}>
            {t("cko.lookup.subtitle")}
          </p>
        </div>

        {/* Two inputs */}
        <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6, display: "block" }}>
              {t("cko.lookup.confirmationLabel")}
            </label>
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "14px 16px",
            }}>
              <SearchIcon size={18} color="var(--text-tertiary)" />
              <input
                type="text"
                placeholder={t("cko.lookup.confirmationPlaceholder")}
                readOnly
                defaultValue="RES-2026-48291"
                style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: "0.9375rem", color: "var(--text)", fontFamily: "Inter, sans-serif" }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6, display: "block" }}>
              {t("cko.lookup.lastNameLabel")}
            </label>
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "14px 16px",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              <input
                type="text"
                placeholder={t("cko.lookup.lastNamePlaceholder")}
                readOnly
                defaultValue="Mitchell"
                style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: "0.9375rem", color: "var(--text)", fontFamily: "Inter, sans-serif" }}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => goBack()} className="btn btn-ghost">{t("common.back")}</button>
          <button onClick={() => navigate("CKO-02")} className="btn btn-primary">{t("cko.lookup.findReservation")}</button>
        </div>
      </div>
    </div>
  );
}
