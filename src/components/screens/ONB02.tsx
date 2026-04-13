"use client";

import { useKiosk } from "@/lib/kiosk-context";
import { useI18n, LOCALES } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { useHotel } from "@/lib/theme-provider";
import BrandLogo from "@/components/ui/BrandLogo";

const ACTIONS = [
  {
    id: "CKI-01",
    titleKey: "action.checkin.title",
    subtitleKey: "action.checkin.subtitle",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 14l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: "BKG-01",
    titleKey: "action.booking.title",
    subtitleKey: "action.booking.subtitle",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
  {
    id: "CKO-00",
    titleKey: "action.checkout.title",
    subtitleKey: "action.checkout.subtitle",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
  },
  {
    id: "DSH-01",
    titleKey: "action.explore.title",
    subtitleKey: "action.explore.subtitle",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
];

export default function OnboardingAction() {
  const { navigate } = useKiosk();
  const { locale, setLocale, t } = useI18n();
  const { images, modules } = useHotel();
  const languagesEnabled = modules.find((m) => m.id === "languages")?.enabled !== false;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `url('${images.heroExterior}') center/cover`, animation: "kenBurns 20s ease-in-out infinite alternate" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)" }} />
      <div className="grain" />

      {/* Top Bar */}
      <div style={{ position: "absolute", top: "5%", left: "6%", right: "6%", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 5 }}>
        <BrandLogo theme="dark" height={28} color="#fff" />
        {/* Language pills — hidden when the "languages" module is disabled */}
        {languagesEnabled && (
          <div style={{ display: "flex", gap: 6 }}>
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLocale(l.code as Locale)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "var(--radius-full)",
                  border: "none",
                  background: locale === l.code ? "var(--primary)" : "rgba(255,255,255,0.15)",
                  backdropFilter: locale === l.code ? "none" : "blur(12px)",
                  color: "#fff",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  transition: "all 200ms ease",
                  letterSpacing: "0.5px",
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Center Content */}
      <div style={{ position: "absolute", inset: 0, zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: 40 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 700, color: "#fff", marginBottom: 8 }}>
          {t("action.welcome")}
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "rgba(255,255,255,0.6)", fontWeight: 400, marginBottom: 48 }}>
          {t("action.subtitle")}
        </p>

        {/* Action Cards */}
        <div style={{ display: "flex", gap: 12 }}>
          {ACTIONS.map((action) => (
            <button
              key={action.id}
              onClick={() => navigate(action.id as any)}
              style={{
                width: 180, padding: "24px 18px",
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "var(--radius-lg)",
                cursor: "pointer", display: "flex", flexDirection: "column",
                alignItems: "center", gap: 16, transition: "all 250ms ease", textAlign: "center",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.18)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ opacity: 0.9 }}>{action.icon}</div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9375rem", color: "#fff", marginBottom: 4 }}>
                  {t(action.titleKey)}
                </div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>
                  {t(action.subtitleKey)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
