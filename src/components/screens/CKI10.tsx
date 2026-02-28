"use client";

import { useEffect, useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import { CheckCircle } from "@/components/ui/Icons";
import GlobalHeader from "@/components/layout/GlobalHeader";

export default function Payment() {
  const { goBack, navigate } = useKiosk();
  const { t } = useI18n();
  const [approved, setApproved] = useState(false);

  const LINE_ITEMS = [
    { key: "cki.payment.roomNights", amount: "$1,247.50" },
    { key: "cki.payment.taxesFees", amount: "$156.19" },
    { key: "cki.payment.resortFee", amount: "$89.85" },
  ];

  useEffect(() => {
    const showModal = setTimeout(() => setApproved(true), 5000);
    const goNext = setTimeout(() => navigate("CKI-13"), 7000);
    return () => { clearTimeout(showModal); clearTimeout(goNext); };
  }, [navigate]);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ height: 4, background: "var(--border)", position: "relative" }}>
        <div style={{ height: "100%", width: `${(7/8)*100}%`, background: "var(--primary)", borderRadius: 2, transition: "width 500ms ease" }} />
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {/* Left - Payment Summary */}
        <div style={{ padding: 32, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "var(--text)", marginBottom: 24 }}>
            {t("cki.payment.title")}
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {LINE_ITEMS.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: "0.9375rem", color: "var(--text-secondary)" }}>{t(item.key)}</span>
                <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text)" }}>{item.amount}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700, color: "var(--text)" }}>{t("cki.payment.total")}</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "var(--primary)" }}>$1,493.54</span>
            </div>
          </div>

          <button onClick={() => goBack()} className="btn btn-ghost" style={{ marginTop: 32, alignSelf: "flex-start" }}>{t("common.back")}</button>
        </div>

        {/* Right - Terminal */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1582719478250-c89cae4dc85b.jpg') center/cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="glass-card" style={{ maxWidth: 300, textAlign: "center", padding: "32px 28px" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" style={{ margin: "0 auto 16px" }}>
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
              </svg>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "#fff" }}>
                {t("cki.payment.insertCard")}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8125rem", marginTop: 8 }}>
                {t("cki.payment.waitingPayment")}
              </p>
              <div style={{ marginTop: 16, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: "40%", background: "var(--primary)", borderRadius: 2, animation: "progressPulse 2s ease-in-out infinite" }} />
              </div>
            </div>
          </div>
          <style>{`@keyframes progressPulse { 0% { width: 20%; } 50% { width: 80%; } 100% { width: 20%; } }`}</style>
        </div>
      </div>

      {/* Payment Approved Modal */}
      {approved && (
        <div style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "fadeIn 300ms ease",
        }}>
          <div style={{
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "var(--radius-lg)",
            padding: "32px 40px",
            textAlign: "center",
            maxWidth: 320,
          }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CheckCircle size={44} />
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#fff", marginTop: 16 }}>
              {t("cki.payment.approved")}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8125rem", marginTop: 6 }}>
              {t("cki.payment.chargedSuccessfully")}
            </p>
          </div>
          <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>
      )}
    </div>
  );
}
