"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import CKO02 from "./CKO02";

export default function MinibarDispute() {
  const { navigate } = useKiosk();
  const { t } = useI18n();
  const [selectedCharge, setSelectedCharge] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const CHARGES = [
    { label: t("cko.summary.roomCharges"), amount: 1247.50 },
    { label: t("cko.summary.roomService"), amount: 86.40 },
    { label: t("cko.summary.miniBar"), amount: 24.50 },
    { label: t("cko.summary.parking"), amount: 45.00 },
    { label: t("cko.summary.taxFees"), amount: 140.34 },
  ];

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Background: CKO-02 screen */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <CKO02 />
      </div>
      {/* Backdrop */}
      <div onClick={() => navigate("CKO-02")} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)", zIndex: 10 }} />

      {/* Centered Modal */}
      <div style={{ position: "absolute", inset: 0, zIndex: 11, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <div style={{
          width: 360,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "24px",
          pointerEvents: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
        }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{t("cko.dispute.title")}</h2>
          <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: 20 }}>{t("cko.dispute.subtitle")}</p>

          {/* Charge select */}
          <label style={{ fontSize: "0.625rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-tertiary)", marginBottom: 6, display: "block" }}>{t("cko.dispute.chargeLabel")}</label>
          <select
            value={selectedCharge}
            onChange={(e) => setSelectedCharge(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text)", fontSize: "0.8125rem", marginBottom: 16, outline: "none", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
          >
            <option value="">{t("cko.dispute.selectCharge")}</option>
            {CHARGES.map((item, i) => (
              <option key={i} value={item.label}>{item.label} — ${item.amount.toFixed(2)}</option>
            ))}
          </select>

          {/* Reason */}
          <label style={{ fontSize: "0.625rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-tertiary)", marginBottom: 6, display: "block" }}>{t("cko.dispute.reasonLabel")}</label>
          <textarea
            data-kiosk-keyboard
            inputMode="none"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t("cko.dispute.reasonPlaceholder")}
            style={{ width: "100%", height: 72, padding: "10px 12px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text)", fontSize: "0.75rem", resize: "none", outline: "none", fontFamily: "Inter, sans-serif", lineHeight: 1.5 }}
          />

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button className="btn btn-ghost" onClick={() => navigate("CKO-02")} style={{ flex: 1 }}>{t("common.cancel")}</button>
            <button className="btn btn-primary" onClick={() => setSubmitted(true)} style={{ flex: 1 }}>{t("cko.dispute.submit")}</button>
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      {submitted && (
        <>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 20 }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 21, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{
              width: 320,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "28px 24px",
              textAlign: "center",
              boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
            }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>{t("cko.dispute.submitted")}</h3>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 20 }}>
                {t("cko.dispute.staffAssistance")}
              </p>
              <button className="btn btn-primary" onClick={() => navigate("CKO-02")} style={{ width: "100%" }}>{t("cko.dispute.backToSummary")}</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
