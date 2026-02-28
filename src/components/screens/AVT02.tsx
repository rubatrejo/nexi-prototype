"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";
import { PoweredByTrueOmni } from "@/components/ui/Icons";

export default function AVT02() {
  const { goBack } = useKiosk();
  const [listening, setListening] = useState(false);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left — Rose video loop */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#0a0a0a" }}>
          <video
            src="https://cdn.replica.tavus.io/40242/2fe8396c.mp4"
            autoPlay loop muted playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* LIVE badge */}
          <div style={{
            position: "absolute", top: 16, left: 16,
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
            padding: "5px 12px", borderRadius: "9999px",
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444", animation: "pulse 2s ease-in-out infinite" }} />
            <span style={{ color: "#fff", fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.05em" }}>LIVE</span>
          </div>
        </div>

        {/* Right — Controls */}
        <div style={{
          width: "50%", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "16px 32px", gap: 14, flexShrink: 0,
          position: "relative",
        }}>
          {/* Close button */}
          <div style={{ position: "absolute", top: 12, right: 16 }}>
            <button onClick={goBack} style={{
              width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)", cursor: "pointer",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* TrueOmni logo */}
          <img src="/logos/trueomni-logo-color.svg" alt="TrueOmni" style={{ width: 110, height: "auto" }} />

          <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5, textAlign: "center", maxWidth: 260 }}>
            Tap the microphone and ask me anything about the hotel.
          </p>

          {/* Mic button */}
          <button
            onClick={() => setListening(!listening)}
            style={{
              width: 68, height: 68, borderRadius: "50%",
              background: listening ? "#EF4444" : "var(--primary)",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 250ms ease",
              animation: listening ? "listeningPulse 1.8s ease-in-out infinite" : "micIdlePulse 2.5s ease-in-out infinite",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10a7 7 0 0 0 14 0" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          </button>

          <p style={{ fontSize: "0.625rem", color: listening ? "#EF4444" : "var(--text-tertiary)", fontWeight: 600, margin: 0 }}>
            {listening ? "Listening..." : "Tap to speak"}
          </p>

          {/* Visualizer */}
          <div style={{ display: "flex", gap: 2, alignItems: "center", height: 28, opacity: listening ? 1 : 0.12, transition: "opacity 400ms" }}>
            {[...Array(20)].map((_, i) => (
              <div key={i} style={{
                width: 2.5, borderRadius: 2,
                height: 14 + ((i * 7 + 3) % 18),
                background: listening ? "var(--primary)" : "var(--border)",
                transformOrigin: "center",
                animation: listening ? `avBar${(i % 5) + 1} ${0.4 + (i % 7) * 0.08}s ease-in-out infinite` : "none",
                animationDelay: `${i * 0.03}s`,
              }} />
            ))}
          </div>

          {/* Suggestion pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", maxWidth: 300 }}>
            {["Pool hours?", "Room service menu", "Restaurant nearby", "Spa booking"].map(s => (
              <button key={s} onClick={() => setListening(true)} style={{
                padding: "6px 12px", borderRadius: "9999px",
                border: "1px solid var(--border)", background: "var(--bg-card)",
                fontSize: "0.5625rem", color: "var(--text-secondary)",
                cursor: "pointer", fontFamily: "'Inter', sans-serif",
              }}>
                {s}
              </button>
            ))}
          </div>

          {/* Powered by TrueOmni */}
          <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, display: "flex", justifyContent: "center", transform: "scale(0.7)", opacity: 0.6 }}>
            <PoweredByTrueOmni variant="dark" />
          </div>
        </div>
      </div>
    </div>
  );
}
