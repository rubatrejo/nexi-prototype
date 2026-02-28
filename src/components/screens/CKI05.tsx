"use client";

import { useEffect } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import { NexiIcon } from "@/components/ui/Icons";

export default function ProcessingScanning() {
  const { navigate } = useKiosk();
  const { t } = useI18n();

  useEffect(() => {
    const timer = setTimeout(() => navigate("CKI-06"), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--bg)", gap: 32 }}>
      {/* Spinning NEXI logo */}
      <div style={{ animation: "spin 8s linear infinite" }}>
        <NexiIcon size={64} color="var(--primary)" />
      </div>

      {/* Progress bar */}
      <div style={{ width: 280, height: 4, background: "var(--border)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: "60%", background: "var(--primary)", borderRadius: 2, animation: "progressPulse 2s ease-in-out infinite" }} />
      </div>

      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 600, color: "var(--text)" }}>
          {t("cki.verified.verifying")}
        </p>
        <p style={{ color: "var(--text-tertiary)", fontSize: "0.8125rem", marginTop: 8 }}>
          {t("cki.verified.waitMessage")}
        </p>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes progressPulse { 0% { width: 20%; } 50% { width: 80%; } 100% { width: 20%; } }
      `}</style>
    </div>
  );
}
