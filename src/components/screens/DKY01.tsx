"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";

export default function DKY01() {
  const { navigate, goBack, roomNumber } = useKiosk();
  const [count, setCount] = useState(1);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1582719478250-c89cae4dc85b.jpg') center/cover", animation: "kenBurns 20s ease-in-out infinite alternate" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.7))" }} />
      <div className="grain" />

      <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          maxWidth: 380, width: "100%", textAlign: "center",
          padding: "28px 32px",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "var(--radius-lg)",
        }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#fff", marginBottom: 4 }}>Need Another Key?</h1>
          <p style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.55)", marginBottom: 16 }}>Room {roomNumber}</p>

          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: "0.5625rem", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>How many keys?</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
              {[1, 2, 3].map(n => (
                <button key={n} onClick={() => setCount(n)} style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", border: count === n ? "2px solid var(--primary)" : "1px solid rgba(255,255,255,0.2)", background: count === n ? "var(--primary)" : "rgba(255,255,255,0.1)", color: "#fff", fontSize: "1rem", fontWeight: 700, cursor: "pointer" }}>{n}</button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost" onClick={goBack} style={{ flex: 1, fontSize: "0.6875rem", color: "#fff", borderColor: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.06)" }}>Back</button>
            <button className="btn btn-primary" onClick={() => navigate("DKY-02" as any)} style={{ flex: 1, fontSize: "0.6875rem" }}>Request Key</button>
          </div>
        </div>
      </div>
    </div>
  );
}
