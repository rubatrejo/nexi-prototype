"use client";

import { useKiosk } from "@/lib/kiosk-context";
import { NexiLogoFull } from "@/components/ui/Icons";

const OPTIONS = [
  {
    id: "ECI-02",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round">
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4M4 7l8 4M4 7v10l8 4m0-10v10"/>
      </svg>
    ),
    title: "Store Luggage",
    subtitle: "We'll let you know when it's ready",
    badge: "Free",
    badgeColor: "#22c55e",
  },
  {
    id: "ECI-03",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: "Early Check-in",
    subtitle: "Get immediate room access now",
    badge: "$45",
    badgeColor: "var(--amber)",
  },
];

export default function ECI01() {
  const { navigate, goBack } = useKiosk();

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1566073771259-6a8506099945.jpg') center/cover", animation: "kenBurns 20s ease-in-out infinite alternate" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)" }} />
      <div className="grain" />

      <div style={{ position: "absolute", top: "5%", left: "6%", right: "6%", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 3 }}>
        <NexiLogoFull height={28} color="#fff" />
      </div>

      <div style={{ position: "absolute", inset: 0, zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: 40 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 700, color: "#fff", marginBottom: 8 }}>
          Almost There
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "rgba(255,255,255,0.7)", fontWeight: 500, marginBottom: 24 }}>
          Your room isn't quite ready yet — here are your options
        </p>

        <div style={{ display: "flex", gap: 12 }}>
          {OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => navigate(opt.id as any)}
              style={{
                width: 200,
                padding: "20px 18px",
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "var(--radius-lg)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                transition: "all 250ms ease",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.18)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ opacity: 0.9 }}>{opt.icon}</div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9375rem", color: "#fff", marginBottom: 4 }}>
                  {opt.title}
                </div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>
                  {opt.subtitle}
                </div>
              </div>
              {opt.badge && (
                <div style={{ padding: "4px 12px", borderRadius: "var(--radius-full)", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", fontSize: "0.8125rem", fontWeight: 700, color: opt.badgeColor || "#fff" }}>
                  {opt.badge}
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={goBack}
          style={{
            marginTop: 20,
            padding: "10px 24px",
            background: "var(--primary)",
            border: "none",
            borderRadius: "var(--radius-full)",
            color: "#fff",
            fontSize: "0.75rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 200ms",
          }}
        >
          Back to Selection
        </button>
      </div>
    </div>
  );
}
