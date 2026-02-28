"use client";

import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";

const CATEGORIES = [
  { name: "Breakfast", count: 12, img: "/images/unsplash/photo-1533089860892-a7c6f0a88666.jpg" },
  { name: "Lunch", count: 15, img: "/images/unsplash/photo-1546069901-ba9599a7e63c.jpg" },
  { name: "Dinner", count: 18, img: "/images/unsplash/photo-1414235077428-338989a2e8c0.jpg" },
  { name: "Snacks", count: 8, img: "/images/unsplash/photo-1621939514649-280e2ee25f60.jpg" },
  { name: "Drinks", count: 14, img: "/images/unsplash/photo-1544145945-f90425340c7e.jpg" },
  { name: "Desserts", count: 10, img: "/images/unsplash/photo-1488477181946-6428a0291777.jpg" },
];

export default function RSV01() {
  const { navigate, goBack } = useKiosk();

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ flex: 1, overflow: "auto", padding: "24px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button
            onClick={() => goBack()}
            style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </button>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--text)" }}>Room Service</h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate("RSV-02")}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 200ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "var(--primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              <div style={{ width: "100%", height: 100, background: `url('${cat.img}') center/cover` }} />
              <div style={{ padding: "12px 14px" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9375rem", color: "var(--text)" }}>{cat.name}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: 2 }}>{cat.count} items</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
