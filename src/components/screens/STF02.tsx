"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";

const CHECKINS_OTHER = ["James Park — 1102", "Maria Santos — 1508"];
const ISSUES = ["Room 1305: AC not working", "Room 1410: Extra towels", "Lobby: Spill near entrance"];
const ACTIONS = [
  { label: "Override", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { label: "Reboot", icon: "M23 4v6h-6M1 20v-6h6" },
  { label: "Logs", icon: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" },
  { label: "Settings", icon: "M12 15a3 3 0 100-6 3 3 0 000 6z" },
];

export default function STF02() {
  const { navigate, guestName } = useKiosk();
  const CHECKINS = [`${guestName} — 1247`, ...CHECKINS_OTHER];
  const [toast, setToast] = useState<string | null>(null);

  const handleAction = (label: string) => {
    if (label === "Override") { navigate("STF-03"); return; }
    if (label === "Reboot") { setToast("Rebooting kiosk..."); setTimeout(() => { setToast(null); navigate("IDL-01"); }, 2000); return; }
    setToast(`${label} opened`);
    setTimeout(() => setToast(null), 2000);
  };

  const cardStyle = {
    padding: "14px 16px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "var(--radius-md)",
    border: "1px solid rgba(255,255,255,0.1)",
    overflow: "hidden",
  };

  const headingStyle = {
    fontFamily: "var(--font-display)",
    fontSize: "0.625rem",
    fontWeight: 700 as const,
    textTransform: "uppercase" as const,
    letterSpacing: "1.5px",
    color: "rgba(255,255,255,0.5)",
    marginBottom: 10,
  };

  const rowStyle = {
    padding: "6px 0",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    fontSize: "0.75rem",
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#0C0C0E", color: "#fff" }}>
      {/* Header */}
      <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", borderBottom: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.8125rem" }}>NEXI Staff</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ padding: "3px 10px", borderRadius: "var(--radius-full)", background: "#DC2626", fontSize: "0.625rem", fontWeight: 700 }}>Staff Mode</span>
          <button onClick={() => navigate("IDL-01")} style={{ background: "none", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "var(--radius-sm)", padding: "3px 10px", color: "#fff", fontSize: "0.6875rem", cursor: "pointer" }}>Exit</button>
        </div>
      </div>

      {/* Grid */}
      <div style={{ flex: 1, padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 12, minHeight: 0 }}>
        {/* Recent Check-ins */}
        <div style={cardStyle}>
          <h3 style={headingStyle}>Recent Check-ins</h3>
          {CHECKINS.map(c => (
            <div key={c} style={{ ...rowStyle, color: "rgba(255,255,255,0.8)" }}>{c}</div>
          ))}
        </div>

        {/* Pending Issues */}
        <div style={cardStyle}>
          <h3 style={headingStyle}>Pending Issues</h3>
          {ISSUES.map(iss => (
            <div key={iss} style={{ ...rowStyle, color: "#FBBF24" }}>{iss}</div>
          ))}
        </div>

        {/* Kiosk Status */}
        <div style={cardStyle}>
          <h3 style={headingStyle}>Kiosk Status</h3>
          {["Payment Terminal", "Key Dispenser", "ID Scanner", "Network"].map(s => (
            <div key={s} style={{ display: "flex", justifyContent: "space-between", ...rowStyle }}>
              <span style={{ color: "rgba(255,255,255,0.8)" }}>{s}</span>
              <span style={{ color: "var(--success)", fontWeight: 600 }}>Online</span>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={cardStyle}>
          <h3 style={headingStyle}>Quick Actions</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, height: "calc(100% - 28px)" }}>
            {ACTIONS.map(a => (
              <button key={a.label} onClick={() => handleAction(a.label)} style={{ padding: 8, borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><path d={a.icon}/></svg>
                <span style={{ fontSize: "0.625rem", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {toast && (
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 10, padding: "10px 20px", borderRadius: "var(--radius-full)", background: "var(--primary)", color: "#fff", fontSize: "0.75rem", fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>{toast}</div>
      )}
    </div>
  );
}
