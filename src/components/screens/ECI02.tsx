"use client";

import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";
import { CheckCircle } from "@/components/ui/Icons";

export default function ECI02() {
  const { navigate } = useKiosk();

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 48px", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CheckCircle size={48} color="#22c55e" />
        </div>

        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 800, color: "var(--text)", marginTop: 14, marginBottom: 0 }}>Luggage Stored</h1>

        <div style={{ padding: "10px 24px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", marginTop: 14, border: "1px solid var(--border)", textAlign: "center" }}>
          <span style={{ fontSize: "0.5625rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: 1 }}>Tag Number</span>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 800, color: "var(--primary)", letterSpacing: 1 }}>LUG-4821</div>
        </div>

        {/* Staff instruction */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 16px", background: "rgba(18,136,255,0.06)", border: "1px solid rgba(18,136,255,0.15)", borderRadius: "var(--radius-md)", marginTop: 16, width: "100%", maxWidth: 360 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
          <p style={{ fontSize: "0.6875rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
            Please hand your luggage and this tag number to our staff at the front desk. They will store it securely for you.
          </p>
        </div>

        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textAlign: "center", marginTop: 16, marginBottom: 2 }}>You&apos;ll receive a notification when your room is ready.</p>
        <p style={{ fontSize: "0.6875rem", color: "var(--text-tertiary)" }}>Estimated time: 2:00 PM</p>

        <button className="btn btn-primary" onClick={() => navigate("DSH-01")} style={{ marginTop: 16, width: "100%", maxWidth: 360, fontSize: "0.6875rem" }}>Back to Dashboard</button>
      </div>
    </div>
  );
}
