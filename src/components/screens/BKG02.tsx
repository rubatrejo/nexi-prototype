"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";

const FILTERS = ["All", "Standard", "Deluxe", "Suite"];

const ROOMS = [
  {
    type: "Standard King", bed: "1 King Bed", price: 199, sqft: 350, floor: "3rd - 8th",
    img: "/images/unsplash/photo-1590490360182-c33d57733427.jpg",
    gallery: [
      "/images/unsplash/photo-1590490360182-c33d57733427.jpg",
      "/images/unsplash/photo-1584132967334-10e028bd69f7.jpg",
      "/images/unsplash/photo-1552321554-5fefe8c9ef14.jpg",
      "/images/unsplash/photo-1609766857041-ed402ea8069a.jpg",
    ],
    amenities: ["Wi-Fi", "Smart TV", "A/C"],
    desc: "A comfortable room with city views, featuring a plush king bed, work desk, and modern bathroom with rain shower.",
  },
  {
    type: "Deluxe King", bed: "1 King Bed", price: 299, sqft: 450, floor: "9th - 15th",
    img: "/images/unsplash/photo-1611892440504-42a792e24d32.jpg",
    gallery: [
      "/images/unsplash/photo-1611892440504-42a792e24d32.jpg",
      "/images/unsplash/photo-1578683010236-d716f9a3f461.jpg",
      "/images/unsplash/photo-1595576508898-0ad5c879a061.jpg",
      "/images/unsplash/photo-1560448205-4d9b3e6bb6db.jpg",
    ],
    amenities: ["Wi-Fi", "Smart TV", "A/C", "Mini Bar"],
    desc: "Elevated comfort with premium linens, ocean-view balcony, mini bar, and spacious marble bathroom with soaking tub.",
  },
  {
    type: "Ocean Suite", bed: "1 King + Sofa Bed", price: 449, sqft: 650, floor: "16th - 20th",
    img: "/images/unsplash/photo-1582719478250-c89cae4dc85b.jpg",
    gallery: [
      "/images/unsplash/photo-1582719478250-c89cae4dc85b.jpg",
      "/images/unsplash/photo-1596394516093-501ba68a0ba6.jpg",
      "/images/unsplash/photo-1631049307264-da0ec9d70304.jpg",
      "/images/unsplash/photo-1618773928121-c32242e63f39.jpg",
    ],
    amenities: ["Wi-Fi", "Smart TV", "A/C", "Mini Bar", "Balcony"],
    desc: "Panoramic ocean views from a separate living area, walk-in closet, premium bathroom with dual vanity and rain shower.",
  },
  {
    type: "Penthouse", bed: "2 King Beds", price: 699, sqft: 1100, floor: "21st",
    img: "/images/unsplash/photo-1507525428034-b723cf961d3e.jpg",
    gallery: [
      "/images/unsplash/photo-1507525428034-b723cf961d3e.jpg",
      "/images/unsplash/photo-1602002418816-5c0aeef426aa.jpg",
      "/images/unsplash/photo-1564078516393-cf04bd966897.jpg",
      "/images/unsplash/photo-1590381105924-c72589b9ef3f.jpg",
    ],
    amenities: ["Wi-Fi", "Smart TV", "A/C", "Mini Bar", "Balcony", "Jacuzzi"],
    desc: "The ultimate luxury experience with wraparound terrace, private jacuzzi, butler service, and 360-degree views.",
  },
];

type Room = typeof ROOMS[number];

function RoomModal({ room, onClose, onSelect }: { room: Room; onClose: () => void; onSelect: () => void }) {
  const [activeImg, setActiveImg] = useState(0);
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} onClick={onClose} />
      <div style={{ position: "relative", zIndex: 2, width: 340, maxHeight: "75%", background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", boxShadow: "0 24px 80px rgba(0,0,0,0.2)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Close */}
        <button onClick={onClose} style={{ position: "absolute", top: 8, right: 8, zIndex: 3, width: 44, height: 44, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>✕</button>

        {/* Main image with thumbnails overlaid */}
        <div style={{ height: 200, background: `url('${room.gallery[activeImg]}') center/cover`, position: "relative", flexShrink: 0 }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 50%, rgba(0,0,0,0.4))" }} />
          {/* Thumbnails overlaid at bottom */}
          <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, display: "flex", gap: 4, justifyContent: "center", zIndex: 2 }}>
            {room.gallery.map((img, i) => (
              <div key={i} onClick={() => setActiveImg(i)} style={{ width: 56, height: 40, borderRadius: 6, background: `url('${img}') center/cover`, cursor: "pointer", opacity: activeImg === i ? 1 : 0.6, border: activeImg === i ? "2px solid #fff" : "2px solid rgba(255,255,255,0.3)", transition: "all 150ms", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }} />
            ))}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "14px 16px 16px", overflow: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 800, color: "var(--text)", marginBottom: 2 }}>{room.type}</h2>
              <p style={{ fontSize: "0.625rem", color: "var(--text-secondary)" }}>{room.bed} · {room.sqft} sq ft · Floor {room.floor}</p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", color: "var(--primary)" }}>${room.price}</span>
              <span style={{ fontSize: "0.625rem", color: "var(--text-secondary)" }}>/night</span>
            </div>
          </div>

          <p style={{ fontSize: "0.6875rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 10 }}>{room.desc}</p>

          {/* Amenities */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
            {[...room.amenities, "Safe", "Coffee Maker", "Hair Dryer", "Room Service"].map((a) => (
              <span key={a} style={{ padding: "3px 8px", borderRadius: 9999, fontSize: "0.5625rem", fontWeight: 500, background: "color-mix(in srgb, var(--primary) 8%, transparent)", color: "var(--primary)", border: "1px solid color-mix(in srgb, var(--primary) 20%, transparent)" }}>{a}</span>
            ))}
          </div>

          <button className="btn btn-primary" onClick={onSelect} style={{ width: "100%", minHeight: 40, fontSize: "0.75rem" }}>Select This Room</button>
        </div>
      </div>
    </div>
  );
}

export default function RoomSelection() {
  const { navigate, goBack } = useKiosk();
  const [filter, setFilter] = useState("All");
  const [modalRoom, setModalRoom] = useState<Room | null>(null);

  const filtered = filter === "All" ? ROOMS : ROOMS.filter((r) =>
    filter === "Suite" ? r.type.includes("Suite") || r.type.includes("Penthouse") : r.type.includes(filter)
  );

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />

      {/* Progress bar — step 2 of 6 */}
      <div style={{ height: 3, background: "var(--border)" }}>
        <div style={{ height: "100%", width: `${(2/6)*100}%`, background: "var(--primary)", borderRadius: 2 }} />
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "16px 28px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => goBack()} style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 800, color: "var(--text)", letterSpacing: -0.3 }}>Available Rooms</h1>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", minHeight: 36, borderRadius: "var(--radius-full)", border: "1px solid", borderColor: filter === f ? "var(--primary)" : "var(--border)", background: filter === f ? "var(--primary)" : "transparent", color: filter === f ? "#fff" : "var(--text-secondary)", fontSize: "0.6875rem", fontWeight: 600, cursor: "pointer" }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {filtered.map((room) => (
            <div key={room.type} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
              <div style={{ height: 90, background: `url('${room.img}') center/cover`, position: "relative" }}>
                <button
                  onClick={() => setModalRoom(room)}
                  style={{ position: "absolute", bottom: 6, right: 6, padding: "4px 10px", borderRadius: "var(--radius-full)", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: "0.5625rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
                  View Details
                </button>
              </div>
              <div style={{ padding: "10px 12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.8125rem", color: "var(--text)" }}>{room.type}</div>
                    <div style={{ fontSize: "0.625rem", color: "var(--text-secondary)", marginTop: 1 }}>{room.bed} · {room.sqft} sq ft</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.9375rem", color: "var(--primary)" }}>${room.price}</span>
                    <span style={{ fontSize: "0.5625rem", color: "var(--text-secondary)" }}>/night</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {room.amenities.slice(0, 3).map((a) => (
                      <span key={a} style={{ fontSize: "0.5625rem", color: "var(--text-secondary)", padding: "2px 6px", borderRadius: 9999, border: "1px solid var(--border)" }}>{a}</span>
                    ))}
                    {room.amenities.length > 3 && <span style={{ fontSize: "0.5625rem", color: "var(--text-secondary)", padding: "2px 6px" }}>+{room.amenities.length - 3}</span>}
                  </div>
                  <button className="btn btn-primary" onClick={() => navigate("BKG-03")} style={{ padding: "6px 16px", fontSize: "0.6875rem", minHeight: 32 }}>Select</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room Detail Modal */}
      {modalRoom && (
        <RoomModal room={modalRoom} onClose={() => setModalRoom(null)} onSelect={() => { setModalRoom(null); navigate("BKG-03"); }} />
      )}
    </div>
  );
}
