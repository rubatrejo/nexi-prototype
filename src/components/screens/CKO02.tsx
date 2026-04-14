"use client";

import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import GlobalHeader from "@/components/layout/GlobalHeader";

const TOTAL = 1543.74;

export default function StaySummary() {
  const { navigate } = useKiosk();
  const { t } = useI18n();

  const LINE_ITEMS = [
    { label: t("cko.summary.roomCharges"), amount: 1247.50 },
    { label: t("cko.summary.roomService"), amount: 86.40 },
    { label: t("cko.summary.miniBar"), amount: 24.50 },
    { label: t("cko.summary.parking"), amount: 45.00 },
    { label: t("cko.summary.taxFees"), amount: 140.34 },
  ];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ height: 4, background: "var(--border)", position: "relative" }}>
        <div style={{ height: "100%", width: `${(2/5)*100}%`, background: "var(--primary-bg, var(--primary))", borderRadius: 2, transition: "width 500ms ease" }} />
      </div>
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left: Invoice */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ flex: 1, padding: "20px 28px", overflow: "auto" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", fontWeight: 800, color: "var(--text)", marginBottom: 2 }}>{t("cko.summary.title")}</h1>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: 14 }}>Feb 22 - Feb 25, 2026 &middot; 3 nights &middot; Room 1247</p>

            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
              {LINE_ITEMS.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: i < LINE_ITEMS.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text)" }}>{item.label}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.75rem", color: "var(--text)" }}>${item.amount.toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "var(--bg-elevated)", borderTop: "2px solid var(--border)" }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem", color: "var(--text)" }}>{t("cko.summary.total")}</span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.125rem", color: "var(--primary)" }}>${TOTAL.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Fixed footer buttons */}
          <div style={{ flexShrink: 0, padding: "12px 28px 16px", display: "flex", gap: 10, borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
            <button className="btn btn-ghost" onClick={() => navigate("CKO-03")}>{t("cko.summary.disputeCharge")}</button>
            <button className="btn btn-primary" onClick={() => navigate("CKO-04")}>{t("cko.summary.proceedToPayment")}</button>
          </div>
        </div>

        {/* Right: Hotel photo */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1520250497591-112f2f40a3f4.jpg') center/cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.5))" }} />
          <div className="grain" />
          <div style={{ position: "absolute", bottom: 32, left: 32, right: 32, zIndex: 2 }}>
            <div style={{ padding: 20, textAlign: "center", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "var(--radius-lg)" }}>
              <div style={{ fontSize: "0.625rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>{t("cko.summary.totalCharges")}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "#fff" }}>${TOTAL.toFixed(2)}</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{t("cko.summary.nightsAndRoom")}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
