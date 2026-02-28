"use client";

import { useState } from "react";
import { NexiLogoFull } from "@/components/ui/Icons";

export default function OrientationSelect({ name, onSelect }: { name?: string; onSelect: (mode: "landscape" | "portrait") => void }) {
  const [selected, setSelected] = useState<"landscape" | "portrait" | null>(null);

  return (
    <div style={{
      width: "100vw", height: "100vh", background: "#F5F5F0",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
      transition: "padding 400ms ease",
      paddingBottom: selected === "landscape" ? 80 : 0,
    }}>
      {/* NEXI Logo */}
      <div style={{ marginBottom: 24 }}>
        <NexiLogoFull color="#1A1A1A" height={40} />
      </div>

      <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 3, color: "#9CA3AF", fontWeight: 600, marginBottom: 12 }}>
        Select Display Mode
      </div>
      <h2 style={{
        fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800,
        color: "#1A1A1A", marginBottom: 8, textAlign: "center",
      }}>
        {name ? `${name.split(" ")[0]}, Choose Your Orientation` : "Choose Your Orientation"}
      </h2>
      <p style={{ fontSize: "0.9375rem", color: "#6B7280", marginBottom: 48, textAlign: "center" }}>
        Select the kiosk display mode for the interactive demo
      </p>

      <div className="onb-orientation-cards">
        {/* Landscape — Active */}
        <div
          onClick={() => setSelected("landscape")}
          style={{
            cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
            transition: "transform 200ms",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          <div style={{
            width: 320, height: 200, borderRadius: 12,
            border: selected === "landscape" ? "3px solid #1288FF" : "3px solid transparent",
            overflow: "hidden", position: "relative",
            boxShadow: selected === "landscape" ? "0 8px 32px rgba(18,136,255,0.15)" : "0 4px 16px rgba(0,0,0,0.08)",
            background: "#fff", transition: "all 300ms ease",
          }}>
            {/* Mini Idle screen preview */}
            <div style={{ position: "absolute", inset: 0, background: "#1a1a1a", overflow: "hidden" }}>
              {/* Background hotel photo */}
              <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/images/unsplash/photo-1566073771259-6a8506099945.jpg)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.75 }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)" }} />
              {/* Simulated kiosk UI */}
              <div style={{ position: "absolute", top: 10, left: 14, display: "flex", alignItems: "center", gap: 4 }}>
                <img src="/logos/nexi-icon-white.svg" alt="NEXI" style={{ width: 14, height: 14 }} />
                <span style={{ color: "#fff", fontSize: 5, fontWeight: 700, fontFamily: "var(--font-display)" }}>NEXI Hotel</span>
              </div>
              {/* Center content */}
              <div style={{ position: "absolute", bottom: 20, left: 14, right: 14 }}>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 4, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>Welcome to</div>
                <div style={{ color: "#fff", fontSize: 11, fontWeight: 800, fontFamily: "var(--font-display)", lineHeight: 1.1, marginBottom: 6 }}>NEXI Hotel</div>
                <div style={{ width: 60, height: 14, borderRadius: 7, background: "#1288FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#fff", fontSize: 4.5, fontWeight: 700 }}>Touch to Begin</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            color: selected === "landscape" ? "#1288FF" : "#1A1A1A", fontSize: "1rem",
            transition: "color 300ms",
          }}>
            Landscape
          </div>
          <div style={{
            padding: "6px 20px", background: "#1288FF", color: "#fff",
            borderRadius: 9999, fontSize: "0.75rem", fontWeight: 700,
          }}>
            Available
          </div>
        </div>

        {/* Portrait — Coming Soon */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
          opacity: 0.45, cursor: "not-allowed",
          filter: "grayscale(100%)",
        }}>
          <div style={{
            width: 150, height: 267, borderRadius: 12,
            border: "2px solid #D4D4CF",
            overflow: "hidden", position: "relative",
            background: "#E8E8E3",
          }}>
            {/* Mini Idle screen preview (portrait) */}
            <div style={{ position: "absolute", inset: 0, background: "#1a1a1a", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/images/unsplash/photo-1542314831-068cd1dbfeeb.jpg)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.75 }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)" }} />
              <div style={{ position: "absolute", top: 10, left: 10, display: "flex", alignItems: "center", gap: 3 }}>
                <img src="/logos/nexi-icon-white.svg" alt="NEXI" style={{ width: 10, height: 10 }} />
                <span style={{ color: "#fff", fontSize: 4, fontWeight: 700 }}>NEXI</span>
              </div>
              <div style={{ position: "absolute", bottom: 30, left: 10, right: 10 }}>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 3, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 2 }}>Welcome to</div>
                <div style={{ color: "#fff", fontSize: 8, fontWeight: 800, fontFamily: "var(--font-display)", lineHeight: 1.1, marginBottom: 5 }}>NEXI Hotel</div>
                <div style={{ width: 40, height: 10, borderRadius: 5, background: "#1288FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#fff", fontSize: 3.5, fontWeight: 700 }}>Touch to Begin</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{
            fontFamily: "var(--font-display)", fontWeight: 700, color: "#9CA3AF", fontSize: "1rem",
          }}>
            Portrait
          </div>
          <div style={{
            padding: "6px 20px", background: "#D4D4CF", color: "#fff",
            borderRadius: 9999, fontSize: "0.75rem", fontWeight: 700,
          }}>
            Coming Soon
          </div>
        </div>
      </div>

      {/* CTA Button — appears when landscape is selected */}
      <div style={{
        marginTop: 40, opacity: selected === "landscape" ? 1 : 0,
        transform: selected === "landscape" ? "translateY(0)" : "translateY(8px)",
        transition: "all 400ms ease", pointerEvents: selected === "landscape" ? "auto" : "none",
      }}>
        <button
          onClick={() => onSelect("landscape")}
          style={{
            padding: "14px 40px", background: "#1288FF", color: "#fff",
            border: "none", borderRadius: 9999,
            fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700,
            cursor: "pointer", transition: "all 200ms",
            boxShadow: "0 4px 24px rgba(18,136,255,0.3)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#0A6FDB"; e.currentTarget.style.transform = "scale(1.03)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#1288FF"; e.currentTarget.style.transform = "scale(1)"; }}
        >
          Start Landscape Experience
        </button>
      </div>
    </div>
  );
}
