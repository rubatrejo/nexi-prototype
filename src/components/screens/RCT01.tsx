"use client";

import { useState } from "react";
import GlobalHeader from "@/components/layout/GlobalHeader";
import { useKiosk } from "@/lib/kiosk-context";

const RECEIPTS = [
  { id: "TXN-84921", label: "Room Charge", date: "Feb 22", amount: "$1,493.54", type: "payment" },
  { id: "TXN-84935", label: "Room Service — Dinner", date: "Feb 22", amount: "$87.50", type: "room-service" },
  { id: "TXN-84948", label: "Spa Day Package", date: "Feb 23", amount: "$120.00", type: "package" },
  { id: "TXN-84962", label: "Late Check-out", date: "Feb 24", amount: "$50.00", type: "addon" },
  { id: "TXN-84970", label: "Room Service — Breakfast", date: "Feb 24", amount: "$42.00", type: "room-service" },
];

const SHARE_OPTIONS = [
  { label: "Email", icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></> },
  { label: "SMS", icon: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/> },
  { label: "QR Code", icon: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="4" height="4"/></> },
  { label: "Print", icon: <><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></> },
];

export default function RCT01() {
  const { goBack } = useKiosk();
  const [selected, setSelected] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleShare = (label: string) => {
    setToast(`Receipt sent via ${label}!`);
    setTimeout(() => { setToast(null); setSelected(null); }, 2000);
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ flex: 1, overflow: "auto", padding: "20px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <button onClick={goBack} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", cursor: "pointer", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700, color: "var(--text)" }}>My Receipts</h1>
            <p style={{ fontSize: "0.6875rem", color: "var(--text-tertiary)", marginTop: 2 }}>Select a receipt to share or download</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {RECEIPTS.map((r, i) => (
            <div key={r.id}>
              <button
                onClick={() => setSelected(selected === i ? null : i)}
                style={{
                  width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 14px", background: selected === i ? "var(--primary-light, rgba(18,136,255,0.08))" : "var(--bg-card)",
                  border: selected === i ? "1px solid var(--primary)" : "1px solid var(--border)",
                  borderRadius: selected === i ? "var(--radius-md) var(--radius-md) 0 0" : "var(--radius-md)",
                  cursor: "pointer", textAlign: "left", transition: "all 150ms",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)", background: "var(--bg-elevated)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.75rem", color: "var(--text)" }}>{r.label}</div>
                    <div style={{ fontSize: "0.625rem", color: "var(--text-tertiary)", marginTop: 1 }}>{r.date} · {r.id}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.8125rem", color: "var(--text)" }}>{r.amount}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" style={{ transform: selected === i ? "rotate(180deg)" : "none", transition: "transform 200ms" }}><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </button>

              {/* Share options */}
              {selected === i && (
                <div style={{
                  padding: "12px 14px", background: "var(--bg-card)",
                  border: "1px solid var(--primary)", borderTop: "none",
                  borderRadius: "0 0 var(--radius-md) var(--radius-md)",
                  display: "flex", gap: 8, justifyContent: "center",
                }}>
                  {SHARE_OPTIONS.map(opt => (
                    <button
                      key={opt.label}
                      onClick={() => handleShare(opt.label)}
                      style={{
                        flex: 1, padding: "10px 8px", borderRadius: "var(--radius-sm)",
                        background: "var(--bg-elevated)", border: "1px solid var(--border)",
                        cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                        transition: "all 150ms",
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round">{opt.icon}</svg>
                      <span style={{ fontSize: "0.5625rem", color: "var(--text-secondary)", fontWeight: 600 }}>{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 10, padding: "10px 20px", borderRadius: "var(--radius-full)", background: "var(--success)", color: "#fff", fontSize: "0.75rem", fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>{toast}</div>
      )}
    </div>
  );
}
