"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";

const ROOM_UPGRADES = [
  { title: "Ocean View Suite", price: "$89/night", img: "/images/unsplash/photo-1590490360182-c33d57733427.jpg" },
  { title: "Penthouse", price: "$199/night", img: "/images/unsplash/photo-1611892440504-42a792e24d32.jpg" },
  { title: "Corner Suite", price: "$69/night", img: "/images/unsplash/photo-1582719478250-c89cae4dc85b.jpg" },
];

const PACKAGES = [
  { title: "Spa Day", price: "$120", img: "/images/unsplash/photo-1544161515-4ab6ce6db874.jpg" },
  { title: "City Tour", price: "$85", img: "/images/unsplash/photo-1449824913935-59a10b8d2000.jpg" },
];

const ADDONS = [
  { title: "Late Checkout", price: "$50" },
  { title: "Extra Pillow", price: "Free" },
  { title: "Mini Bar Package", price: "$35" },
];

export default function UPS01() {
  const { navigate, goBack } = useKiosk();
  const [cart, setCart] = useState<string[]>([]);

  const toggle = (item: string) => setCart(c => c.includes(item) ? c.filter(x => x !== item) : [...c, item]);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ flex: 1, overflow: "auto", padding: "24px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={goBack} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", cursor: "pointer", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700, color: "var(--text)" }}>Upgrades & Packages</h1>
          </div>
          {cart.length > 0 && <button className="btn btn-amber btn-sm" onClick={() => navigate("UPS-02")}>{cart.length} in Cart</button>}
        </div>

        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--text-tertiary)", marginBottom: 12 }}>Room Upgrades</h2>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", marginBottom: 28, paddingBottom: 4 }}>
          {ROOM_UPGRADES.map(u => (
            <div key={u.title} onClick={() => navigate("UPS-02")} style={{ minWidth: 200, borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", flexShrink: 0 }}>
              <div style={{ height: 100, background: `url('${u.img}') center/cover` }} />
              <div style={{ padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.8125rem", color: "var(--text)" }}>{u.title}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--amber)", fontWeight: 600 }}>{u.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--text-tertiary)", marginBottom: 12 }}>Experience Packages</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
          {PACKAGES.map(p => (
            <div key={p.title} style={{ display: "flex", gap: 12, padding: 12, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", alignItems: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "var(--radius-sm)", overflow: "hidden", flexShrink: 0, background: `url('${p.img}') center/cover` }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.8125rem", color: "var(--text)" }}>{p.title}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--amber)", fontWeight: 600 }}>{p.price}</div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); toggle(p.title); }} style={{ padding: "6px 12px", borderRadius: "var(--radius-sm)", border: cart.includes(p.title) ? "none" : "1px solid var(--border)", background: cart.includes(p.title) ? "var(--primary)" : "var(--bg)", color: cart.includes(p.title) ? "#fff" : "var(--text-secondary)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>{cart.includes(p.title) ? "Added" : "Add"}</button>
            </div>
          ))}
        </div>

        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--text-tertiary)", marginBottom: 12 }}>Add-ons</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ADDONS.map(a => (
            <div key={a.title} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
              <div>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.8125rem", color: "var(--text)" }}>{a.title}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--amber)", fontWeight: 600, marginLeft: 8 }}>{a.price}</span>
              </div>
              <button onClick={() => toggle(a.title)} style={{ padding: "6px 12px", borderRadius: "var(--radius-sm)", border: cart.includes(a.title) ? "none" : "1px solid var(--border)", background: cart.includes(a.title) ? "var(--primary)" : "var(--bg)", color: cart.includes(a.title) ? "#fff" : "var(--text-secondary)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>{cart.includes(a.title) ? "Added" : "Add"}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
