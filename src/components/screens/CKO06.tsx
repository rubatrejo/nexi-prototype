"use client";

import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import GlobalHeader from "@/components/layout/GlobalHeader";
import { CheckCircle } from "@/components/ui/Icons";
import { useToast } from "@/lib/use-toast";

export default function CheckOutComplete() {
  const { navigate, guestName } = useKiosk();
  const { t } = useI18n();
  const toast = useToast();

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1571896349842-33c89424de2d.jpg') center/cover", animation: "kenBurns 20s ease-in-out infinite alternate" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.7))" }} />
      <div className="grain" />

      {/* Centered glass card */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
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
            {t("cko.complete.titleWithName").replace("{name}", guestName.split(" ")[0])}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.8125rem", marginTop: 6 }}>
            {t("cko.complete.subtitle")}
          </p>

          {/* Info row */}
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 20, padding: "10px 0", borderTop: "1px solid rgba(255,255,255,0.12)", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
            {[
              { labelKey: "cko.complete.emailReceipt", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg> },
              { labelKey: "cko.complete.printReceipt", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg> },
            ].map((opt) => (
              <button key={opt.labelKey} onClick={() => toast.show(`${t(opt.labelKey)} sent`)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "var(--radius-full)", color: "#fff", cursor: "pointer", fontSize: "0.6875rem", fontWeight: 500, minHeight: 36 }}>
                {opt.icon}
                {t(opt.labelKey)}
              </button>
            ))}
          </div>

          {/* CTA */}
          <button
            className="btn btn-primary"
            onClick={() => navigate("IDL-01")}
            style={{ width: "100%", marginTop: 20, minHeight: 44, fontSize: "0.8125rem" }}
          >
            {t("cko.complete.finish")}
          </button>
        </div>
      </div>

      {toast.Toast}
    </div>
  );
}
