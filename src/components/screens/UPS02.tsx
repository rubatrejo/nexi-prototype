"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";

const AMENITIES = ["Panoramic Ocean View", "King Bed + Sofa Bed", "65\" Smart TV", "Private Balcony", "Jacuzzi Tub", "Premium Mini Bar", "Nespresso Machine", "Turndown Service", "Priority Room Service"];

const SUITE_PHOTOS = [
  { url: "photo-1590490360182-c33d57733427", label: "Suite" },
  { url: "photo-1582719478250-c89cae4dc85b", label: "Living Room" },
  { url: "photo-1560448205-4d9b3e6bb6db", label: "Balcony" },
  { url: "photo-1584132967334-10e028bd69f7", label: "Bathroom" },
  { url: "photo-1520250497591-112f2f40a3f4", label: "View" },
];

export default function UPS02() {
  const { navigate, goBack } = useKiosk();
  const [activePhoto, setActivePhoto] = useState(0);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left — Upgrade Info */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 28px", gap: 16 }}>
          <div>
            <div style={{ fontSize: "0.625rem", fontWeight: 700, color: "var(--amber)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Upgrade Available</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", lineHeight: 1.1, letterSpacing: -0.5, marginBottom: 4 }}>Ocean View Suite</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.125rem", color: "var(--amber)" }}>+$89</span>
              <span style={{ fontSize: "0.6875rem", color: "var(--text-secondary)" }}>/night upgrade</span>
            </div>
          </div>

          {/* Quick specs */}
          <div style={{ display: "flex", gap: 8 }}>
            {[{ label: "Bed", value: "1 King + Sofa" }, { label: "Max Guests", value: "3 Adults" }, { label: "Floor", value: "18th" }, { label: "Size", value: "720 sq ft" }].map((item) => (
              <div key={item.label} style={{ flex: 1, padding: "8px 10px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                <div style={{ fontSize: "0.5rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.6875rem", color: "var(--text)" }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <p style={{ fontSize: "0.6875rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
            Elevate your stay with our stunning Ocean View Suite. Enjoy breathtaking panoramic views, a separate living area, private balcony, and premium amenities for an unforgettable experience.
          </p>

          {/* Amenity Pills */}
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {AMENITIES.map((a) => (
              <div key={a} style={{ padding: "4px 10px", borderRadius: "var(--radius-full)", background: "var(--bg-elevated)", border: "1px solid var(--border)", fontSize: "0.5625rem", fontWeight: 500, color: "var(--text)" }}>
                {a}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={goBack} className="btn btn-ghost" style={{ flex: 1, fontSize: "0.75rem" }}>Back</button>
            <button onClick={() => navigate("UPS-03")} className="btn btn-primary" style={{ flex: 1, fontSize: "0.75rem" }}>Upgrade Now</button>
          </div>
        </div>

        {/* Right — Photo Gallery */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: 0,
            background: `url('/images/unsplash/${SUITE_PHOTOS[activePhoto].url}.jpg') center/cover`,
            transition: "background 400ms ease",
          }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.3))" }} />
          {/* Thumbnail strip */}
          <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, zIndex: 2 }}>
            <div className="ups02-thumbs" style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}>
              <style>{`.ups02-thumbs::-webkit-scrollbar { display: none; }`}</style>
              {SUITE_PHOTOS.map((photo, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhoto(i)}
                  style={{
                    width: 60, height: 44, flexShrink: 0,
                    border: activePhoto === i ? "2px solid #fff" : "2px solid rgba(255,255,255,0.4)",
                    borderRadius: "var(--radius-sm)", cursor: "pointer",
                    position: "relative", overflow: "hidden",
                    opacity: activePhoto === i ? 1 : 0.7,
                    transition: "all 200ms", padding: 0, background: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}
                >
                  <div style={{ position: "absolute", inset: 0, background: `url('/images/unsplash/${photo.url}.jpg') center/cover`, borderRadius: 6 }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
