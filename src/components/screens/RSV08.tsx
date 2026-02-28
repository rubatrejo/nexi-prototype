"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";

export default function RSV08() {
  const { navigate } = useKiosk();
  const [rating, setRating] = useState(4);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1517248135467-4c7edcad34c4.jpg') center/cover", animation: "kenBurns 20s ease-in-out infinite alternate" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.7))" }} />
      <div className="grain" />

      {/* Dark glass header */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <GlobalHeader variant="cinematic" />
      </div>

      {/* Centered glass card */}
      <div style={{ position: "relative", zIndex: 2, height: "calc(100% - 48px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="glass-card" style={{ maxWidth: 420, textAlign: "center", padding: 40 }}>
          {/* Green check */}
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: 8 }}>Enjoy Your Meal!</h1>
          <p style={{ fontSize: "0.9375rem", color: "rgba(255,255,255,0.7)", marginBottom: 28 }}>Your order has been delivered to Room 1247</p>

          {/* Star rating */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Rate your experience</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, transition: "transform 150ms ease" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill={star <= rating ? "#E5A91B" : "none"} stroke={star <= rating ? "#E5A91B" : "rgba(255,255,255,0.3)"} strokeWidth="1.5" style={{ transition: "fill 200ms ease, stroke 200ms ease" }}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => navigate("DSH-01")} style={{ width: "100%", marginTop: 24 }}>Done</button>
        </div>
      </div>
    </div>
  );
}
