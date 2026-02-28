"use client";

import { useKiosk } from "@/lib/kiosk-context";
import { CheckCircle } from "@/components/ui/Icons";

export default function PAY03() {
  const { navigate, flowData } = useKiosk();
  const nextScreen = (flowData?.payNextScreen as string) || "DSH-01";
  const amount = flowData?.payAmount ? `$${flowData.payAmount}` : "$1,493.54";
  const title = (flowData?.payTitle as string) || "Payment Successful";

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1566073771259-6a8506099945.jpg') center/cover", animation: "kenBurns 20s ease-in-out infinite alternate" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.7))" }} />
      <div className="grain" />

      {/* Centered glass card — same as BKG-07 */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <div style={{
          maxWidth: 380, width: "100%", textAlign: "center",
          padding: "28px 32px",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "var(--radius-lg)",
        }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CheckCircle size={48} color="#22c55e" />
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#fff", marginTop: 14 }}>{title}</h1>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 800, color: "#fff", marginTop: 4 }}>{amount}</p>

          {/* Transaction details */}
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "var(--radius-md)", padding: "14px 16px", marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
              <span style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.4)" }}>Transaction ID</span>
              <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>TXN-2026-84921</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
              <span style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.4)" }}>Card</span>
              <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>****4521</span>
            </div>
          </div>

          {/* Buttons — same as BKG-07 */}
          <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
            <button className="btn btn-ghost" onClick={() => navigate("PAY-03e")} style={{ flex: 1, fontSize: "0.6875rem", color: "#fff", borderColor: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
              Share Ticket
            </button>
            <button className="btn btn-primary" onClick={() => navigate(nextScreen as any)} style={{ flex: 1, fontSize: "0.6875rem" }}>Continue</button>
          </div>
        </div>
      </div>
    </div>
  );
}
