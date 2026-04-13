"use client";

import { useEffect } from "react";
import { NexiLogoFull, PoweredByTrueOmni } from "@/components/ui/Icons";
import { useI18n } from "@/lib/i18n";

interface Props {
  leadName: string;
  onBack: () => void;
  onBookDemo: () => void;
}

export default function ROICalculator({ leadName, onBack, onBookDemo }: Props) {
  const { t } = useI18n();
  const firstName = leadName.split(" ")[0] || "";

  // Load Elfsight script
  useEffect(() => {
    if (document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')) return;
    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div style={{
      width: "100vw", minHeight: "100vh", position: "relative",
      background: "#E8E8E3", fontFamily: "var(--font-body), sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      overflow: "auto",
    }}>
      {/* Top section — Logo + header text */}
      <div style={{
        width: "100%", maxWidth: 800, textAlign: "center",
        padding: "32px 32px 0",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
        flexShrink: 0,
      }}>
        <NexiLogoFull color="#1A1A1A" height={38} />
        <div>
          <div style={{
            fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: 3,
            color: "#1288FF", fontWeight: 700, marginBottom: 6,
          }}>
            {t("roi.badge")}
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "1.75rem",
            fontWeight: 800, color: "#1A1A1A", lineHeight: 1.15, marginBottom: 6,
          }}>
            {firstName ? `${firstName}, ${t("roi.titlePersonalized")}` : t("roi.title")}
          </h1>
          <p style={{ fontSize: "0.8125rem", color: "#6B7280", maxWidth: 460, margin: "0 auto" }}>
            {t("roi.subtitle")}
          </p>
        </div>
      </div>

      {/* Calculator — 16:9 container, 10% smaller, internal scroll */}
      <div style={{
        width: "80vw", maxWidth: 1000,
        aspectRatio: "16 / 9",
        padding: "0",
        overflow: "auto",
        borderRadius: 12,
        scrollbarWidth: "none", msOverflowStyle: "none" as any,
      }}>
        <style>{`.roi-calc-wrap::-webkit-scrollbar { display: none; }`}</style>
        <div className="roi-calc-wrap" style={{ width: "100%", minHeight: "100%", overflow: "auto", scrollbarWidth: "none" as any }}>
          <div
            className="elfsight-app-4daa8889-79a6-43c1-bf76-1d32bbf03229"
            data-elfsight-app-lazy=""
            style={{ width: "100%", minHeight: "100%" }}
          />
        </div>
      </div>

      {/* Footer — flows after calculator */}
      <div style={{
        width: "100%",
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 8, paddingBottom: 28, marginTop: "auto",
      }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={onBack}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 16px",
              background: "transparent",
              border: "1px solid #D4D4CF",
              borderRadius: "9999px",
              cursor: "pointer",
              color: "#6B7280",
              fontSize: "0.6875rem",
              fontWeight: 500,
              fontFamily: "var(--font-body), sans-serif",
              transition: "all 200ms",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1A1A1A"; e.currentTarget.style.color = "#1A1A1A"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#D4D4CF"; e.currentTarget.style.color = "#6B7280"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {t("roi.backToDemo")}
          </button>
          <button
            onClick={onBookDemo}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 16px",
              background: "#1288FF",
              border: "1px solid #1288FF",
              borderRadius: "9999px",
              cursor: "pointer",
              color: "#fff",
              fontSize: "0.6875rem",
              fontWeight: 600,
              fontFamily: "var(--font-body), sans-serif",
              transition: "all 200ms",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#0A6FDB"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#1288FF"; }}
          >
            {t("roi.bookDemo")}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div>
          <PoweredByTrueOmni variant="dark" />
        </div>
      </div>
    </div>
  );
}
