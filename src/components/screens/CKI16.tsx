"use client";

import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import { PoweredByTrueOmni } from "@/components/ui/Icons";
import BrandLogo from "@/components/ui/BrandLogo";

export default function WelcomeComplete() {
  const { navigate, guestName } = useKiosk();
  const { t } = useI18n();

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1590490360182-c33d57733427.jpg') center/cover", animation: "kenBurns 20s ease-in-out infinite alternate" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.6))" }} />
      <div className="grain" />

      <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 48px" }}>
        {/* Center content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <BrandLogo theme="dark" height={28} color="#fff" />
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "#fff", letterSpacing: -0.5, marginTop: 8 }}>
            {t("cki.welcome.home").replace("{name}", guestName.split(" ")[0])}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem", fontWeight: 500 }}>
            {t("cki.welcome.roomInfo")}
          </p>

          <button onClick={() => navigate("DSH-01")} className="btn btn-primary" style={{ marginTop: 24 }}>{t("cki.welcome.gotoDashboard")}</button>
        </div>

        {/* Footer */}
        <div style={{ paddingBottom: 8 }}>
          <PoweredByTrueOmni variant="white" />
        </div>
      </div>
    </div>
  );
}
