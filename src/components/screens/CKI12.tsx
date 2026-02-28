"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import GlobalHeader from "@/components/layout/GlobalHeader";
import { useToast } from "@/lib/use-toast";

const AMENITIES = ["WiFi", "Mini Bar", "Balcony", "Room Service", "Safe", "Iron", "Coffee Maker", "Bathrobe", "Smart TV"];

const ROOM_PHOTOS = [
  { url: "photo-1611892440504-42a792e24d32", labelKey: "cki.room.gallery.bedroom" },
  { url: "photo-1552321554-5fefe8c9ef14", labelKey: "cki.room.gallery.livingArea" },
  { url: "photo-1507652313519-d4e9174996dd", labelKey: "cki.room.gallery.bathroom" },
  { url: "photo-1582719478250-c89cae4dc85b", labelKey: "cki.room.gallery.view" },
  { url: "photo-1590490360182-c33d57733427", labelKey: "cki.room.gallery.balcony" },
  { url: "photo-1571896349842-33c89424de2d", labelKey: "cki.room.gallery.lounge" },
];

export default function RoomAssigned() {
  const { navigate, guestName, roomNumber } = useKiosk();
  const { t } = useI18n();
  const [showRoomMap, setShowRoomMap] = useState(false);
  const [showShareQR, setShowShareQR] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const toast = useToast();

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ height: 4, background: "var(--border)", position: "relative" }}>
        <div style={{ height: "100%", width: "100%", background: "var(--primary)", borderRadius: 2, transition: "width 500ms ease" }} />
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left — Room Info */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 32px", gap: 24 }}>
          {/* Guest name + Room number */}
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{ guestName }</div>
            <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 6 }}>{t("cki.room.title")} </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "3rem", fontWeight: 800, color: "var(--text)", lineHeight: 1, letterSpacing: -2 }}>1247</div>
            <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>12th {t("cki.room.floor")}</span>
              <span style={{ color: "var(--border)" }}>|</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Deluxe King</span>
              <span style={{ color: "var(--border)" }}>|</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Ocean View</span>
            </div>
          </div>

          {/* Amenity Pills */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {AMENITIES.map((a) => (
              <div key={a} style={{ padding: "6px 14px", borderRadius: "var(--radius-full)", background: "var(--bg-elevated)", border: "1px solid var(--border)", fontSize: "0.6875rem", fontWeight: 500, color: "var(--text)" }}>
                {a}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => navigate("CKI-03")} className="btn btn-ghost" style={{ flex: 1, justifyContent: "center", gap: 6, display: "flex", alignItems: "center", fontSize: "0.75rem" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
                {t("cki.room.addGuest")}
              </button>
              <button onClick={() => setShowRoomMap(true)} className="btn btn-ghost" style={{ flex: 1, justifyContent: "center", gap: 6, display: "flex", alignItems: "center", fontSize: "0.75rem" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                {t("cki.room.getToRoom")}
              </button>
            </div>
            <button onClick={() => navigate("CKI-16")} className="btn btn-primary" style={{ width: "100%" }}>{t("cki.room.continue")} </button>
          </div>
        </div>

        {/* Right — Photo Gallery */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {/* Main photo */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: `url('/images/unsplash/${ROOM_PHOTOS[activePhoto].url}.jpg') center/cover`,
            transition: "background 400ms ease",
          }} />
          {/* Thumbnail strip — overlaid at bottom */}
          <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, zIndex: 2 }}>
            <div className="cki12-thumbs" style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}>
              <style>{`.cki12-thumbs::-webkit-scrollbar { display: none; }`}</style>
              {ROOM_PHOTOS.map((photo, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhoto(i)}
                  style={{
                    width: 64,
                    height: 48,
                    flexShrink: 0,
                    border: activePhoto === i ? "2px solid #fff" : "2px solid rgba(255,255,255,0.4)",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    opacity: activePhoto === i ? 1 : 0.7,
                    transition: "all 200ms",
                    padding: 0,
                    background: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}
                >
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: `url('/images/unsplash/${photo.url}.jpg') center/cover`,
                    borderRadius: 6,
                  }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Room Directions Modal ─── */}
      {showRoomMap && !showShareQR && (
        <div style={{ position: "absolute", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={() => setShowRoomMap(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "relative", zIndex: 1, width: 620, height: 340, background: "var(--bg-card)", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden", boxShadow: "0 24px 48px rgba(0,0,0,0.2)", display: "flex" }}>

            {/* Left — Directions + Buttons */}
            <div style={{ width: "45%", padding: "20px 22px", display: "flex", flexDirection: "column", borderRight: "1px solid var(--border)" }}>
              <button onClick={() => setShowRoomMap(false)} style={{ position: "absolute", top: 10, left: 10, width: 28, height: 28, borderRadius: 8, border: "none", background: "var(--bg-elevated)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>

              <div style={{ marginTop: 14 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "0.875rem", fontWeight: 800, color: "var(--text)", marginBottom: 2 }}>
                  {t("cki.room.directions.title")} {roomNumber || "1247"}
                </div>
                <div style={{ fontSize: "0.5625rem", color: "var(--text-secondary)", marginBottom: 12 }}>{t("cki.room.floor")} 12 &middot; Deluxe King &middot; Ocean View</div>
              </div>

              {/* Steps */}
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  t("cki.room.directions.step1"),
                  t("cki.room.directions.step2"),
                  t("cki.room.directions.step3"),
                  t("cki.room.directions.step4").replace("{roomNumber}", roomNumber || "1247"),
                ].map((step, i, arr) => (
                  <div key={i} style={{ display: "flex", gap: 8, padding: "6px 0" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%",
                        background: i === arr.length - 1 ? "#1288FF" : "var(--bg-elevated)",
                        border: "2px solid " + (i === arr.length - 1 ? "#1288FF" : "var(--border)"),
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: i === arr.length - 1 ? "#fff" : "var(--text-secondary)",
                        fontSize: "0.5rem", fontWeight: 700,
                      }}>
                        {i === arr.length - 1 ? "\u2713" : i + 1}
                      </div>
                      {i < arr.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 8, background: "var(--border)", marginTop: 2 }} />}
                    </div>
                    <div style={{ fontSize: "0.625rem", color: "var(--text)", lineHeight: 1.5, paddingTop: 1 }}>{step}</div>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                <button onClick={() => setShowRoomMap(false)} className="btn btn-primary" style={{ flex: 1, padding: "9px 0", borderRadius: 10, fontSize: "0.625rem", fontWeight: 700 }}>{t("cki.room.directions.gotIt")}</button>
                <button onClick={() => setShowShareQR(true)} style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
                </button>
                <button onClick={() => { setShowRoomMap(false); navigate("WAY-01"); }} style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
                </button>
              </div>
            </div>

            {/* Right — Floor Plan Map */}
            <div style={{ flex: 1, background: "linear-gradient(145deg, #FAF8F5, #F0EDE8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
              <svg viewBox="0 0 300 280" style={{ width: "100%", height: "100%" }}>
                {/* Building */}
                <rect x="5" y="5" width="290" height="270" rx="10" fill="#FFFEFA" stroke="#C8C0B4" strokeWidth="1.5" />
                {/* Floor label */}
                <text x="150" y="22" textAnchor="middle" fontSize="8" fill="#9CA3AF" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="2">FLOOR 12</text>
                {/* Corridor */}
                <rect x="5" y="130" width="290" height="20" rx="0" fill="#EDE9E1" />
                {/* Elevator */}
                <rect x="12" y="132" width="35" height="16" rx="4" fill="#D5CFC6" />
                <text x="29" y="143" textAnchor="middle" fontSize="5.5" fill="#9CA3AF" fontWeight="700" fontFamily="Inter, sans-serif">ELEV</text>
                {/* You are here */}
                <circle cx="29" cy="115" r="5" fill="#1288FF" opacity="0.15"><animate attributeName="r" from="5" to="12" dur="2s" repeatCount="indefinite" /><animate attributeName="opacity" from="0.3" to="0" dur="2s" repeatCount="indefinite" /></circle>
                <circle cx="29" cy="115" r="4" fill="#1288FF" stroke="#fff" strokeWidth="1.5" />
                <rect x="37" y="108" width="46" height="14" rx="7" fill="#1288FF" />
                <text x="60" y="118" textAnchor="middle" fontSize="5" fill="#fff" fontWeight="700" fontFamily="Inter, sans-serif">You Are Here</text>
                {/* Top rooms (1244-1250) */}
                {Array.from({length: 7}, (_, i) => i).map(i => {
                  const isTarget = i === 3;
                  return (
                    <g key={"rt-" + i}>
                      <rect x={55 + i * 34} y={30} width="30" height="95" rx="4"
                        fill={isTarget ? "#1288FF18" : "#F5F0E8"}
                        stroke={isTarget ? "#1288FF" : "#D5CFC6"}
                        strokeWidth={isTarget ? 2 : 1}
                      />
                      <text x={55 + i * 34 + 15} y={82} textAnchor="middle" fontSize="7" fill={isTarget ? "#1288FF" : "#B8B0A4"} fontWeight="700" fontFamily="Inter, sans-serif">
                        {1244 + i}
                      </text>
                      {isTarget && <rect x={55 + i * 34 + 8} y={40} width="14" height="10" rx="3" fill="#1288FF" opacity="0.15" />}
                    </g>
                  );
                })}
                {/* Bottom rooms (1251-1257) */}
                {Array.from({length: 7}, (_, i) => i).map(i => (
                  <g key={"rb-" + i}>
                    <rect x={55 + i * 34} y={155} width="30" height="95" rx="4" fill="#F5F0E8" stroke="#D5CFC6" strokeWidth="1" />
                    <text x={55 + i * 34 + 15} y={207} textAnchor="middle" fontSize="7" fill="#B8B0A4" fontWeight="700" fontFamily="Inter, sans-serif">
                      {1251 + i}
                    </text>
                  </g>
                ))}
                {/* Walking path */}
                <path d="M 29,125 L 29,140 L 157,140 L 157,125" fill="none" stroke="#1288FF" strokeWidth="2.5" strokeDasharray="5 3" strokeLinecap="round" opacity="0.6">
                  <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1.5s" repeatCount="indefinite" />
                </path>
                {/* Destination pin */}
                <circle cx="157" cy="77" r="7" fill="none" stroke="#1288FF" strokeWidth="1" opacity="0.3"><animate attributeName="r" from="5" to="12" dur="1.5s" repeatCount="indefinite" /><animate attributeName="opacity" from="0.3" to="0" dur="1.5s" repeatCount="indefinite" /></circle>
                <circle cx="157" cy="77" r="4" fill="#1288FF" stroke="#fff" strokeWidth="1.5" />
                {/* Plants */}
                <circle cx="100" cy="140" r="3" fill="#22C55E" opacity="0.2" /><circle cx="100" cy="140" r="1.5" fill="#22C55E" opacity="0.35" />
                <circle cx="220" cy="140" r="3" fill="#22C55E" opacity="0.2" /><circle cx="220" cy="140" r="1.5" fill="#22C55E" opacity="0.35" />
                {/* Restroom */}
                <rect x="255" y="258" width="35" height="15" rx="3" fill="#F0ECE6" stroke="#D5CFC6" strokeWidth="0.75" />
                <text x="272" y="269" textAnchor="middle" fontSize="5" fill="#B8B0A4" fontWeight="600" fontFamily="Inter, sans-serif">WC</text>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* ─── Share QR Modal ─── */}
      {showShareQR && (
        <div style={{ position: "absolute", inset: 0, zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={() => setShowShareQR(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "relative", zIndex: 1, width: 300, background: "var(--bg-card)", borderRadius: 16, border: "1px solid var(--border)", padding: "24px", boxShadow: "0 24px 48px rgba(0,0,0,0.2)", textAlign: "center" }}>
            <button onClick={() => setShowShareQR(false)} style={{ position: "absolute", top: 10, right: 10, width: 28, height: 28, borderRadius: 8, border: "none", background: "var(--bg-elevated)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>{t("cki.room.shareQR.title")}</div>
            <p style={{ fontSize: "0.5625rem", color: "var(--text-secondary)", marginBottom: 16 }}>{t("cki.room.shareQR.subtitle").replace("{roomNumber}", roomNumber || "1247")}</p>
            <div style={{ width: 140, height: 140, margin: "0 auto 14px", borderRadius: 12, background: "#fff", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", padding: 10 }}>
              <svg viewBox="0 0 100 100" width="120" height="120">
                {Array.from({length: 10}, (_, r) => Array.from({length: 10}, (_, c) => {
                  const fill = ((r + c) % 3 === 0 || (r * c) % 5 < 2) ? "#1A1A1A" : "#fff";
                  return <rect key={r + "-" + c} x={c*10} y={r*10} width="9" height="9" rx="1.5" fill={fill} />;
                }))}
                <rect x="0" y="0" width="30" height="30" rx="4" fill="none" stroke="#1A1A1A" strokeWidth="3" />
                <rect x="5" y="5" width="20" height="20" rx="2" fill="#1A1A1A" />
                <rect x="70" y="0" width="30" height="30" rx="4" fill="none" stroke="#1A1A1A" strokeWidth="3" />
                <rect x="75" y="5" width="20" height="20" rx="2" fill="#1A1A1A" />
                <rect x="0" y="70" width="30" height="30" rx="4" fill="none" stroke="#1A1A1A" strokeWidth="3" />
                <rect x="5" y="75" width="20" height="20" rx="2" fill="#1A1A1A" />
                <circle cx="50" cy="50" r="8" fill="#1288FF" />
                <circle cx="50" cy="50" r="4" fill="#fff" />
              </svg>
            </div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
              <button onClick={() => toast.show("Email sent")} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", fontFamily: "inherit", color: "var(--text-secondary)", fontSize: "0.5rem", fontWeight: 600 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
                Email
              </button>
              <button onClick={() => toast.show("SMS sent")} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", fontFamily: "inherit", color: "var(--text-secondary)", fontSize: "0.5rem", fontWeight: 600 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                SMS
              </button>
              <button onClick={() => toast.show("Printing...")} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", fontFamily: "inherit", color: "var(--text-secondary)", fontSize: "0.5rem", fontWeight: 600 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                Print
              </button>
            </div>
          </div>
        </div>
      )}
      {toast.Toast}
    </div>
  );
}
