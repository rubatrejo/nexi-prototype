"use client";

import { useEffect } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import GlobalHeader from "@/components/layout/GlobalHeader";
import BrandLogo from "@/components/ui/BrandLogo";

export default function EncodingKeyCard() {
  const { navigate } = useKiosk();
  const { t } = useI18n();

  useEffect(() => {
    const timer = setTimeout(() => navigate("CKI-12"), 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1571896349842-33c89424de2d.jpg') center/cover", animation: "kenBurns 20s ease-in-out infinite alternate" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.7))" }} />
      <div className="grain" />

      <div style={{ position: "relative", zIndex: 2 }}>
        <GlobalHeader variant="cinematic" />
      </div>

      <div style={{ position: "relative", zIndex: 2, height: "calc(100% - 48px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
        {/* Spinning brand icon — white-labelled clients show their own mark */}
        <div style={{ animation: "spin 8s linear infinite" }}>
          <BrandLogo variant="icon" theme="dark" height={48} color="#fff" />
        </div>

        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "#fff" }}>
            {t("cki.keycard.encoding")}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", marginTop: 8 }}>
            {t("cki.keycard.preparing")}
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ width: 280, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", background: "var(--primary)", borderRadius: 2, animation: "encodeProgress 5s ease-in-out forwards" }} />
        </div>

        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes encodeProgress { from { width: 0%; } to { width: 100%; } }
        `}</style>
      </div>
    </div>
  );
}
