"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";

const AMENITIES = ["High-Speed Wi-Fi", "55\" Smart TV", "Climate Control", "Premium Mini Bar", "In-Room Safe", "Nespresso Machine", "Rain Shower", "Bathrobe", "Room Service"];

const ROOM_PHOTOS = [
  { url: "photo-1611892440504-42a792e24d32", label: "Bedroom" },
  { url: "photo-1578683010236-d716f9a3f461", label: "Living Area" },
  { url: "photo-1552321554-5fefe8c9ef14", label: "Bathroom" },
  { url: "photo-1595576508898-0ad5c879a061", label: "View" },
  { url: "photo-1560448205-4d9b3e6bb6db", label: "Balcony" },
];

export default function RoomDetails() {
  const { navigate } = useKiosk();
  const [activePhoto, setActivePhoto] = useState(0);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      {/* Progress bar — step 3 of 6 */}
      <div style={{ height: 3, background: "var(--border)" }}>
        <div style={{ height: "100%", width: `${(3/6)*100}%`, background: "var(--primary)", borderRadius: 2 }} />
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left — Room Info */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 28px", gap: 16 }}>
          <div>
            <div style={{ fontSize: "0.625rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Room Details</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", lineHeight: 1.1, letterSpacing: -0.5, marginBottom: 4 }}>Deluxe King</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.125rem", color: "var(--primary)" }}>$299</span>
              <span style={{ fontSize: "0.6875rem", color: "var(--text-secondary)" }}>/night</span>
            </div>
          </div>

          {/* Quick specs */}
          <div style={{ display: "flex", gap: 8 }}>
            {[{ label: "Bed", value: "1 King" }, { label: "Max Guests", value: "2 Adults" }, { label: "Floor", value: "12th" }, { label: "Size", value: "450 sq ft" }].map((item) => (
              <div key={item.label} style={{ flex: 1, padding: "8px 10px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                <div style={{ fontSize: "0.5rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.6875rem", color: "var(--text)" }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <p style={{ fontSize: "0.6875rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
            Experience luxury in our beautifully appointed Deluxe King room, featuring panoramic city views, premium bedding, and a spacious marble bathroom with rain shower.
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
            <button onClick={() => navigate("BKG-02")} className="btn btn-ghost" style={{ flex: 1, fontSize: "0.75rem" }}>Back to Rooms</button>
            <button onClick={() => navigate("BKG-04")} className="btn btn-primary" style={{ flex: 1, fontSize: "0.75rem" }}>Book This Room</button>
          </div>
        </div>

        {/* Right — Photo Gallery (same pattern as CKI-12) */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: 0,
            background: `url('/images/unsplash/${ROOM_PHOTOS[activePhoto].url}.jpg') center/cover`,
            transition: "background 400ms ease",
          }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.3))" }} />
          {/* Thumbnail strip */}
          <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, zIndex: 2 }}>
            <div className="bkg03-thumbs" style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}>
              <style>{`.bkg03-thumbs::-webkit-scrollbar { display: none; }`}</style>
              {ROOM_PHOTOS.map((photo, i) => (
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
