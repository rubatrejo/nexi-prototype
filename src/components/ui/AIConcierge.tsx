"use client";

import { useState, useEffect } from "react";
import { useKiosk } from "@/lib/kiosk-context";

const CAPTIONS = [
  "Hello! I'm your AI Concierge. How can I help you today?",
  "Ask me about dining, the pool, spa, events, or anything about the hotel.",
];

export default function AIConcierge() {
  const { currentScreen, inactivityVisible } = useKiosk();
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [listening, setListening] = useState(false);
  const [captionIdx, setCaptionIdx] = useState(0);

  useEffect(() => {
    if (!open) return;
    const timer = setInterval(() => setCaptionIdx(i => (i + 1) % CAPTIONS.length), 5000);
    return () => clearInterval(timer);
  }, [open]);

  // Reset dismissed when returning to dashboard
  useEffect(() => {
    if (currentScreen === "DSH-01") setDismissed(false);
  }, [currentScreen]);

  // Hide on idle, onboarding, staff screens
  const hideScreens = ["IDL-01", "ONB-01", "ONB-02", "STF-01", "STF-02", "STF-03", "AVT-02"];
  if (hideScreens.includes(currentScreen) || dismissed || inactivityVisible) return null;

  return (
    <>
      {/* FAB */}
      {!open && (
        <div style={{ position: "absolute", bottom: 16, right: 16, zIndex: 50 }}>
          {/* Close/dismiss bubble */}
          <button
            onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
            style={{
              position: "absolute", top: -8, right: -8, zIndex: 51,
              width: 24, height: 24, borderRadius: "50%",
              background: "linear-gradient(135deg, #1288FF, #0a5cbf)",
              border: "2px solid rgba(255,255,255,0.25)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(18,136,255,0.4)",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <button
            onClick={() => setOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 16px 8px 10px",
              borderRadius: "var(--radius-full)",
              background: "linear-gradient(135deg, #1288FF, #0a5cbf)",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(18,136,255,0.4)",
              transition: "transform 200ms, box-shadow 200ms",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(18,136,255,0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(18,136,255,0.4)"; }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" fill="#fff" strokeWidth="0"/>
              </svg>
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.75rem", color: "#fff" }}>AI Concierge</span>
          </button>
        </div>
      )}

      {/* Backdrop */}
      {open && (
        <div onClick={() => { setOpen(false); setListening(false); }} style={{
          position: "absolute", inset: 0, zIndex: 49,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }} />
      )}

      {/* Video Concierge Panel */}
      {open && (
        <div style={{
          position: "absolute",
          bottom: 16,
          right: 16,
          zIndex: 50,
          width: 546,
          aspectRatio: "16/9",
          borderRadius: "var(--radius-lg)",
          background: "#0a1628",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Close button */}
          <button onClick={() => { setOpen(false); setListening(false); }} style={{
            position: "absolute", top: 8, right: 8, zIndex: 3,
            width: 28, height: 28, borderRadius: "50%",
            background: "rgba(255,255,255,0.1)", border: "none",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>

          {/* Video area — Rose loop */}
          <div style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            background: "#0a0a0a",
          }}>
            <video
              src="https://cdn.replica.tavus.io/40242/2fe8396c.mp4"
              autoPlay loop muted playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* LIVE badge */}
            <div style={{
              position: "absolute", top: 8, left: 8,
              display: "flex", alignItems: "center", gap: 4,
              background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
              padding: "3px 8px", borderRadius: "9999px",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF4444", animation: "pulse 2s ease-in-out infinite" }} />
              <span style={{ color: "#fff", fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.05em" }}>LIVE</span>
            </div>
          </div>

          {/* Caption area */}
          <div style={{
            padding: "12px 16px",
            background: "rgba(255,255,255,0.03)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            minHeight: 48,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <p style={{
              fontSize: "0.6875rem", color: "rgba(255,255,255,0.6)",
              textAlign: "center", lineHeight: 1.5, margin: 0,
              transition: "opacity 300ms",
            }}>
              {listening ? "Listening..." : CAPTIONS[captionIdx]}
            </p>
          </div>

          {/* Mic button */}
          <div style={{
            padding: "12px 16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}>
            <button
              onClick={() => setListening(!listening)}
              style={{
                width: 48, height: 48, borderRadius: "50%",
                background: listening ? "#DC2626" : "var(--primary)",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: listening ? "0 0 20px rgba(220,38,38,0.4)" : "0 0 20px rgba(18,136,255,0.3)",
                transition: "all 200ms",
              }}
            >
              {listening ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                  <path d="M19 10v2a7 7 0 01-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              )}
            </button>
          </div>

          <style>{`@keyframes audioBar { from { transform: scaleY(0.4); } to { transform: scaleY(1); } }`}</style>
        </div>
      )}
    </>
  );
}
