"use client";

import React from "react";
import { NexiLogoFull } from "@/components/ui/Icons";

const MODULES = [
  { name: "Self Check-in / Check-out", desc: "Seamless arrival and departure in under 30 seconds with ID scan and facial verification.", icon: "🔑", photo: "/images/unsplash/photo-1582719478250-c89cae4dc85b.jpg" },
  { name: "Room Service", desc: "Browse menus, customize orders, and track delivery — all from the kiosk touchscreen.", icon: "🍽", photo: "/images/unsplash/photo-1551882547-ff40c63fe5fa.jpg" },
  { name: "AI Concierge", desc: "Voice-powered AI assistant that answers questions, makes recommendations, and speaks multiple languages.", icon: "🤖", photo: "/images/unsplash/photo-1590490360182-c33d57733427.jpg" },
  { name: "Booking", desc: "Walk-in guests can browse available rooms, compare options, and book on the spot.", icon: "📋", photo: "/images/unsplash/photo-1618773928121-c32242e63f39.jpg" },
  { name: "Wayfinding", desc: "Interactive maps with turn-by-turn directions to any location within the property.", icon: "🗺", photo: "/images/unsplash/photo-1564501049412-61c2a3083791.jpg" },
  { name: "Upsells & Upgrades", desc: "Intelligent upgrade offers and add-ons that drive incremental revenue per guest.", icon: "⬆", photo: "/images/unsplash/photo-1578683010236-d716f9a3f461.jpg" },
];

const MODULE_ICONS: Record<string, React.ReactNode> = {
  "Self Check-in / Check-out": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1288FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><circle cx="12" cy="16" r="1"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  "Room Service": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1288FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20h18M12 4v4M4 16c0-4.4 3.6-8 8-8s8 3.6 8 8"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  "AI Concierge": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1288FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 014 4v2H8V6a4 4 0 014-4z"/><rect x="4" y="8" width="16" height="12" rx="2"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/></svg>,
  "Booking": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1288FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>,
  "Wayfinding": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1288FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>,
  "Upsells & Upgrades": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1288FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
};

const STATS = [
  { value: "40%", label: "Revenue Increase", desc: "From Upsells & Upgrades" },
  { value: "24/7", label: "Self-Service", desc: "Zero Staff Needed" },
  { value: "5x", label: "Faster Check-in", desc: "vs Front Desk" },
  { value: "92%", label: "Guest Satisfaction", desc: "Average Rating" },
];

interface Props {
  slide: number;
  onClick?: () => void;
  onComplete?: () => void;
}

export default function OnboardingSlides({ slide, onClick, onComplete }: Props) {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Slide 0: Cinematic Takeover */}
      {slide === 0 && (
        <div style={{ width: "100%", height: "100%", position: "relative", cursor: "pointer" }} onClick={onClick}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url(/images/unsplash/photo-1542314831-068cd1dbfeeb.jpg)",
            backgroundSize: "cover", backgroundPosition: "center",
            animation: "kenBurns 20s ease-in-out infinite alternate",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.2) 100%)",
          }} />
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }}>
            <filter id="grain-s1"><feTurbulence baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /></filter>
            <rect width="100%" height="100%" filter="url(#grain-s1)" />
          </svg>

          <div style={{
            position: "relative", zIndex: 2, height: "100%",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            textAlign: "center", padding: "0 80px",
          }}>
            {/* NEXI Logo */}
            <div style={{ marginBottom: 32 }}>
              <NexiLogoFull color="#fff" height={48} />
            </div>

            <h1 style={{
              fontFamily: "var(--font-display)", fontSize: "4rem", fontWeight: 800,
              color: "#fff", lineHeight: 1.05, marginBottom: 20, maxWidth: 700,
            }}>
              The Complete Hotel Concierge Solution
            </h1>
            <p style={{
              fontSize: "1.5rem", fontWeight: 600, color: "#fff", maxWidth: 500,
              lineHeight: 1.5, marginBottom: 48,
              textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)",
            }}>
              Everything your guests need.
              <br />One elegant touchpoint.
            </p>

          </div>
        </div>
      )}

      {/* Slide 1: Module Showcase Cards (Light Mode) */}
      {slide === 1 && (
        <div style={{
          width: "100%", height: "100%", background: "#0C0C0E", position: "relative",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "48px 80px", cursor: "pointer", fontFamily: "var(--font-body), sans-serif",
        }} onClick={onClick}>
          {/* Subtle background photo */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url(/images/unsplash/photo-1542314831-068cd1dbfeeb.jpg)",
            backgroundSize: "cover", backgroundPosition: "center",
            opacity: 0.08,
          }} />
          <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 3, color: "#6B7280", fontWeight: 600, marginBottom: 12 }}>
            Modules
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 800,
            color: "#F0F0F0", textAlign: "center", marginBottom: 12, lineHeight: 1.1,
          }}>
            Everything Your Guests Need
          </h2>
          <p style={{ fontSize: "1rem", color: "#8E93A4", textAlign: "center", marginBottom: 48, maxWidth: 500 }}>
            16 integrated modules designed for the modern hotel experience
          </p>

          <div className="onb-slides-modules">
            {MODULES.map((mod) => (
              <div key={mod.name} style={{
                background: "#1A1A1F", borderRadius: 16, overflow: "hidden",
                border: "1px solid #2A2A30",
                boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
                transition: "transform 200ms, box-shadow 200ms",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.2)"; }}
              >
                <div style={{
                  height: 120, backgroundImage: `url(${mod.photo})`,
                  backgroundSize: "cover", backgroundPosition: "center",
                  position: "relative",
                }}>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)" }} />
                </div>
                <div style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    {MODULE_ICONS[mod.name]}
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.875rem", fontWeight: 700, color: "#F0F0F0" }}>
                      {mod.name}
                    </h3>
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "#8E93A4", lineHeight: 1.5 }}>
                    {mod.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          </div>

        </div>
      )}

      {/* Slide 2: Cinematic + Stats Bento */}
      {slide === 2 && (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url(/images/unsplash/photo-1566665797739-1674de7a421a.jpg)",
            backgroundSize: "cover", backgroundPosition: "center",
            animation: "kenBurns 20s ease-in-out infinite alternate",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.55) 100%)",
          }} />
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }}>
            <filter id="grain-s3"><feTurbulence baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /></filter>
            <rect width="100%" height="100%" filter="url(#grain-s3)" />
          </svg>

          <div style={{
            position: "relative", zIndex: 2, height: "100%",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            textAlign: "center", padding: "0 80px",
          }}>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 3, color: "rgba(255,255,255,0.5)", fontWeight: 600, marginBottom: 12 }}>
              By the Numbers
            </div>
            <h2 style={{
              fontFamily: "var(--font-display)", fontSize: "2.75rem", fontWeight: 800,
              color: "#fff", marginBottom: 48, lineHeight: 1.1,
            }}>
              Results That Speak
            </h2>

            {/* Bento Stats Grid */}
            <div className="onb-stats-grid" style={{ marginBottom: 48 }}>
              {STATS.map((stat) => (
                <div key={stat.label} style={{
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 16, padding: "28px 20px",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: 4,
                }}>
                  <div style={{
                    fontFamily: "var(--font-display)", fontSize: "2.25rem", fontWeight: 800,
                    color: "#1288FF", lineHeight: 1,
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: "0.8125rem", fontWeight: 700, color: "#fff", marginTop: 4,
                  }}>
                    {stat.label}
                  </div>
                  <div style={{
                    fontSize: "0.6875rem", color: "rgba(255,255,255,0.5)",
                  }}>
                    {stat.desc}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); onComplete?.(); }}
              style={{
                padding: "14px 40px", background: "#1288FF", color: "#fff",
                border: "none", borderRadius: 9999,
                fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700,
                cursor: "pointer", transition: "all 200ms",
                boxShadow: "0 4px 24px rgba(18,136,255,0.4)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#0A6FDB"; e.currentTarget.style.transform = "scale(1.03)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#1288FF"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              Start NEXI Experience
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
