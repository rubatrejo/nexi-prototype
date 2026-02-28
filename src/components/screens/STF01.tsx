"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";

export default function STF01() {
  const { navigate } = useKiosk();
  const [pin, setPin] = useState("");

  const handleKey = (key: string) => {
    if (key === "clear") return setPin("");
    if (key === "enter") {
      if (pin.length === 4) navigate("STF-02");
      return;
    }
    if (pin.length < 4) setPin(p => p + key);
  };

  const keys = ["1","2","3","4","5","6","7","8","9","clear","0","enter"];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0C0C0E" }}>
      <svg width="48" height="12" viewBox="0 0 48 12" style={{ marginBottom: 32 }}>
        <text x="0" y="11" fill="#fff" fontFamily="var(--font-display)" fontWeight="800" fontSize="12" letterSpacing="2">NEXI</text>
      </svg>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#fff", marginBottom: 32 }}>Staff Access</h1>
      <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", background: i < pin.length ? "#fff" : "transparent", transition: "background 150ms" }} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, width: 240 }}>
        {keys.map(k => (
          <button key={k} onClick={() => handleKey(k)} style={{ height: 56, borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)", background: k === "enter" ? "var(--primary)" : "rgba(255,255,255,0.08)", color: "#fff", fontSize: k === "clear" || k === "enter" ? "0.75rem" : "1.25rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-display)" }}>
            {k === "clear" ? "CLR" : k === "enter" ? "OK" : k}
          </button>
        ))}
      </div>
    </div>
  );
}
