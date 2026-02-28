"use client";

import { useKiosk } from "@/lib/kiosk-context";
import { CheckCircle } from "@/components/ui/Icons";

export default function RSV06() {
  const { navigate } = useKiosk();

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1517248135467-4c7edcad34c4.jpg') center/cover", animation: "kenBurns 20s ease-in-out infinite alternate" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.7))" }} />
      <div className="grain" />

      {/* Centered glass card */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
          padding: "32px 36px",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "var(--radius-lg)",
        }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CheckCircle size={48} color="#22c55e" />
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#fff", marginTop: 16 }}>
            Order Placed!
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.8125rem", marginTop: 6 }}>
            Your order is being prepared
          </p>

          {/* Order details */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, padding: "12px 0", borderTop: "1px solid rgba(255,255,255,0.12)", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.5rem", fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Order</div>
              <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#fff", marginTop: 2 }}>ORD-4821</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.5rem", fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Delivery</div>
              <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#fff", marginTop: 2 }}>15-25 min</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.5rem", fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Room</div>
              <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#fff", marginTop: 2 }}>1247</div>
            </div>
          </div>

          {/* Total */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, padding: "10px 0" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>Charged to Room 1247</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem", color: "#fff" }}>$105.04</span>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button
              onClick={() => navigate("RSV-07")}
              style={{ flex: 1, padding: "10px 16px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "var(--radius-full)", color: "#fff", cursor: "pointer", fontSize: "0.6875rem", fontWeight: 500, minHeight: 40 }}
            >
              Track Order
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate("DSH-01")}
              style={{ flex: 1, minHeight: 40, fontSize: "0.6875rem" }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
