"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";

const OVERRIDES = [
  { label: "Manual Key Issue", desc: "Issue a key card manually", color: "var(--yellow)", hex: "#FBBF24", action: "DKY-02" },
  { label: "Skip ID Verification", desc: "Bypass identity check", color: "var(--orange)", hex: "#F97316", action: "CKI-07" },
  { label: "Force Check-out", desc: "Force end a guest session", color: "var(--error)", hex: "#DC2626", action: "CKO-05" },
  { label: "Clear Error", desc: "Dismiss current error state", color: "var(--yellow)", hex: "#FBBF24", action: "DSH-01" },
  { label: "Reset Kiosk", desc: "Full system restart", color: "var(--error)", hex: "#DC2626", action: "IDL-01" },
];

export default function STF03() {
  const { goBack, navigate } = useKiosk();
  const [confirm, setConfirm] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleAction = (o: typeof OVERRIDES[0]) => {
    setConfirm(null);
    setToast(`${o.label} executed`);
    setTimeout(() => {
      setToast(null);
      navigate(o.action as any);
    }, 1500);
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#0C0C0E", color: "#fff" }}>
      <div style={{ height: 44, display: "flex", alignItems: "center", padding: "0 20px", borderBottom: "1px solid rgba(255,255,255,0.1)", gap: 10, flexShrink: 0 }}>
        <button onClick={goBack} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.8125rem" }}>Override Mode</span>
      </div>
      <div style={{ flex: 1, padding: 20, overflow: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 500 }}>
          {OVERRIDES.map((o, i) => (
            <div key={o.label}>
              <button
                onClick={() => setConfirm(confirm === i ? null : i)}
                style={{
                  width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 16px", borderRadius: confirm === i ? "var(--radius-md) var(--radius-md) 0 0" : "var(--radius-md)",
                  border: `1px solid ${o.hex}40`, background: `${o.hex}10`, cursor: "pointer", textAlign: "left",
                }}
              >
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.8125rem", color: o.hex }}>{o.label}</div>
                  <div style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{o.desc}</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={o.hex} strokeWidth="2" style={{ transform: confirm === i ? "rotate(90deg)" : "none", transition: "transform 200ms" }}><path d="M9 18l6-6-6-6"/></svg>
              </button>
              {confirm === i && (
                <div style={{
                  padding: "12px 16px", background: `${o.hex}15`,
                  border: `1px solid ${o.hex}40`, borderTop: "none",
                  borderRadius: "0 0 var(--radius-md) var(--radius-md)",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <span style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.6)" }}>Are you sure?</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setConfirm(null)} style={{ padding: "6px 14px", borderRadius: "var(--radius-sm)", border: "1px solid rgba(255,255,255,0.2)", background: "none", color: "rgba(255,255,255,0.7)", fontSize: "0.625rem", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                    <button onClick={() => handleAction(o)} style={{ padding: "6px 14px", borderRadius: "var(--radius-sm)", border: "none", background: o.hex, color: "#fff", fontSize: "0.625rem", fontWeight: 700, cursor: "pointer" }}>Confirm</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 10, padding: "10px 20px", borderRadius: "var(--radius-full)", background: "var(--success)", color: "#fff", fontSize: "0.75rem", fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>{toast}</div>
      )}
    </div>
  );
}
