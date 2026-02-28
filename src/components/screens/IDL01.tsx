"use client";

import { useRef, useCallback } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import { NexiLogoFull, PoweredByTrueOmni } from "@/components/ui/Icons";

export default function IdleScreen() {
  const { navigate } = useKiosk();
  const { t } = useI18n();
  const tapCount = useRef(0);
  const tapTimer = useRef<NodeJS.Timeout | null>(null);

  const handleLogoTap = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      navigate("STF-01" as any);
      return;
    }
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 2000);
  }, [navigate]);

  return (
    <div
      onClick={() => navigate("ONB-02")/* Skip ONB-01, language is now in ONB-02 */}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      {/* Background Photo + Ken Burns */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "url('/images/unsplash/photo-1566073771259-6a8506099945.jpg') center/cover",
          animation: "kenBurns 20s ease-in-out infinite alternate",
        }}
      />
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      {/* Grain */}
      <div className="grain" />

      {/* Top Bar */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "6%",
          right: "6%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 3,
        }}
      >
        <div onClick={handleLogoTap} style={{ cursor: "pointer" }}>
          <NexiLogoFull height={30} color="#fff" />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            color: "rgba(255,255,255,0.8)",
            fontSize: "0.8125rem",
            fontWeight: 500,
          }}
        >
          <span>72°F Partly Cloudy</span>
          <span>Saturday, February 22</span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 700,
              letterSpacing: -0.5,
            }}
          >
            10:45
          </span>
        </div>
      </div>

      {/* Bottom Content */}
      <div
        style={{
          position: "absolute",
          bottom: "6%",
          left: "6%",
          right: "6%",
          zIndex: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "3rem",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.05,
              marginBottom: 12,
              letterSpacing: -1,
            }}
          >
            {t("idle.welcome")}
            <br />
            NEXI Hotel
          </h1>
          <p
            style={{
              fontSize: "1.125em",
              color: "rgba(255,255,255,0.7)",
              fontWeight: 500,
              marginBottom: 24,
            }}
          >
            {t("idle.subtitle")}
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "var(--primary)",
              color: "#fff",
              padding: "14px 32px",
              borderRadius: "var(--radius-full)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "0.9375rem",
            }}
          >
            {t("idle.touch")}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <PoweredByTrueOmni variant="white" />
          {/* ADA Wheelchair Button — official SVG from Ruben */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <svg width="22" height="26" viewBox="0 0 78.473 95" fill="#fff">
              <path d="M-910,1039.8a19.525,19.525,0,0,1-19.5-19.5,19.385,19.385,0,0,1,8.7-16.2l-.6-9.6a28.239,28.239,0,0,0-16.8,25.8,28.231,28.231,0,0,0,28.2,28.2,28.2,28.2,0,0,0,27.5-22h-9.1A19.536,19.536,0,0,1-910,1039.8Z" transform="translate(938.2 -953.5)" />
              <path d="M-859.8,1044.8l-7-31.5a8.726,8.726,0,0,0-7.5-6.7l-17.9-1.8a2.033,2.033,0,0,1-1.9-1.8l-.7-3.9,17.2.3a1.538,1.538,0,0,0,1.5-1.5v-3a1.415,1.415,0,0,0-1.3-1.4l-18.7-2.2-1.6-9.6a6.671,6.671,0,0,0-6.6-5.6h-4.3a6.731,6.731,0,0,0-6.7,7.1l1.7,26.5a10.823,10.823,0,0,0,10.8,10.1h24.7a2.159,2.159,0,0,1,2.1,1.6l6.3,24.2a3.3,3.3,0,0,0,3.2,2.5h4.2A2.711,2.711,0,0,0-859.8,1044.8Z" transform="translate(938.2 -953.5)" />
              <circle cx="9.9" cy="9.9" r="9.9" transform="translate(20.6 0)" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
