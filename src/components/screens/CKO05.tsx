"use client";

import { useEffect, useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import GlobalHeader from "@/components/layout/GlobalHeader";
import { CheckCircle } from "@/components/ui/Icons";

const ITEMS = [
  { labelKey: "cko.payment.roomNights", value: "$1,247.50" },
  { labelKey: "cko.payment.roomService", value: "$86.40" },
  { labelKey: "cko.payment.miniBar", value: "$24.50" },
  { labelKey: "cko.payment.parking", value: "$45.00" },
  { labelKey: "cko.payment.taxFees", value: "$140.34" },
  { labelKey: "cko.payment.prePaid", value: "-$1,247.50" },
];

export default function CheckOutPayment() {
  const { navigate } = useKiosk();
  const { t } = useI18n();
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    const showModal = setTimeout(() => setApproved(true), 5000);
    const goNext = setTimeout(() => navigate("CKO-06"), 7000);
    return () => { clearTimeout(showModal); clearTimeout(goNext); };
  }, [navigate]);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)", position: "relative" }}>
      <GlobalHeader />
      <div style={{ height: 4, background: "var(--border)", position: "relative" }}>
        <div style={{ height: "100%", width: `${(4/5)*100}%`, background: "var(--primary-bg, var(--primary))", borderRadius: 2, transition: "width 500ms ease" }} />
      </div>
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px 24px" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 800, color: "var(--text)", marginBottom: 2 }}>{t("cko.payment.title")}</h1>
          <p style={{ fontSize: "0.6875rem", color: "var(--text-secondary)", marginBottom: 12 }}>{t("cko.payment.subtitle")}</p>

          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 12 }}>
            {ITEMS.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", borderBottom: i < ITEMS.length - 1 ? "1px solid var(--border)" : "none" }}>
                <span style={{ fontSize: "0.6875rem", color: "var(--text-secondary)" }}>{t(item.labelKey)}</span>
                <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--text)" }}>{item.value}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "var(--bg-elevated)", borderTop: "2px solid var(--border)" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.8125rem", color: "var(--text)" }}>{t("cko.payment.totalDue")}</span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem", color: "var(--primary)" }}>$296.24</span>
            </div>
          </div>

          {/* Payment method */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
            <div style={{ width: 32, height: 22, borderRadius: 3, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="10" viewBox="0 0 20 14" fill="#fff"><rect width="20" height="14" rx="2" fill="var(--primary)" /><rect x="2" y="8" width="6" height="2" rx="1" fill="rgba(255,255,255,0.5)" /></svg>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text)" }}>Visa ending in 4892</div>
              <div style={{ fontSize: "0.625rem", color: "var(--text-tertiary)" }}>{t("cko.payment.cardOnFile")}</div>
            </div>
          </div>

          <div style={{ marginTop: "auto", paddingBottom: 12 }}>
            <button className="btn btn-ghost" onClick={() => navigate("CKO-02")}>{t("cko.payment.backToSummary")}</button>
          </div>
        </div>

        {/* Right */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1551882547-ff40c63fe5fa.jpg') center/cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.6))" }} />
          <div className="grain" />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
            <div style={{ padding: 28, textAlign: "center", maxWidth: 280, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "var(--radius-lg)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 10h20" /><path d="M6 14h4" />
                </svg>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: 4 }}>{t("cko.payment.processing")}</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>{t("cko.payment.tapCard")}</div>
              <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 16 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--primary)", opacity: 0.4, animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Approved Modal */}
      {approved && (
        <div style={{ position: "absolute", inset: 0, zIndex: 20, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 300ms ease" }}>
          <div style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "var(--radius-lg)", padding: "28px 36px", textAlign: "center", maxWidth: 300 }}>
            <div style={{ display: "flex", justifyContent: "center" }}><CheckCircle size={40} /></div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700, color: "#fff", marginTop: 14 }}>{t("cko.payment.approved")}</h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", marginTop: 4 }}>{t("cko.payment.chargedSuccess")}</p>
          </div>
          <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>
      )}
    </div>
  );
}
