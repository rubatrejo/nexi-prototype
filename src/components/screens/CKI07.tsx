"use client";

import { useEffect, useState } from "react";
import GlobalHeader from "@/components/layout/GlobalHeader";
import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import { CheckCircle } from "@/components/ui/Icons";

export default function VerificationComplete() {
  const { navigate } = useKiosk();
  const { t } = useI18n();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => navigate("CKI-08"), 5000);
    const interval = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [navigate]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1551882547-ff40c63fe5fa.jpg') center/cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.7))" }} />
      <div className="grain" />

      {/* Dark glass header */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <GlobalHeader variant="cinematic" />
        <div style={{ height: 4, background: "rgba(255,255,255,0.1)" }}><div style={{ height: "100%", width: `${(5/8)*100}%`, background: "var(--primary-bg, var(--primary))", borderRadius: 2, transition: "width 500ms ease" }} /></div>
      </div>

      {/* Centered glass card */}
      <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100% - 48px)" }}>
        <div style={{
          maxWidth: 380,
          width: "100%",
          textAlign: "center",
          padding: "32px 36px",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "var(--radius-lg)",
        }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CheckCircle size={48} color="#22c55e" />
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#fff", marginTop: 16 }}>
            {t("cki.complete.title")}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.8125rem", marginTop: 6 }}>
            {t("cki.complete.subtitle")}
          </p>

          {/* Info row */}
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 20, padding: "10px 0", borderTop: "1px solid rgba(255,255,255,0.12)", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
            {[t("cki.complete.idVerified"), t("cki.complete.faceVerified"), t("cki.complete.matchPercent")].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><path d="M9 12l2 2 4-4" /></svg>
                <span style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Auto-redirect pill */}
          <div style={{ display: "inline-block", marginTop: 16, padding: "5px 14px", borderRadius: "var(--radius-full)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", fontSize: "0.6875rem", color: "rgba(255,255,255,0.5)" }}>
{t("cki.complete.continuingIn").replace("{seconds}", countdown.toString())}
          </div>
        </div>
      </div>
    </div>
  );
}
