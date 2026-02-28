"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";

export default function EVT02() {
  const { navigate, goBack, guestName, roomNumber, setFlowData } = useKiosk();
  const [showReserve, setShowReserve] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(0);

  const event = {
    title: "Wine Tasting",
    date: "Saturday, Feb 22",
    time: "7:00 PM",
    location: "Rooftop Lounge",
    duration: "2 hours",
    price: "$45/person",
    priceNum: 45,
    spots: "8 spots left",
    desc: "Join our master sommelier for an evening of curated wines from the region's finest vineyards. Each tasting is paired with artisan cheeses and charcuterie. Perfect for both novices and connoisseurs alike.",
    img: "/images/unsplash/photo-1510812431401-41d2bd2722f3.jpg",
  };

  const methods = [
    { id: "room", label: "Charge to Room", desc: "Add to Room 1247 bill" },
    { id: "terminal", label: "Pay with Terminal", desc: "Credit, debit or mobile pay" },
  ];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)", position: "relative" }}>
      <GlobalHeader />
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left — Event details */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 32px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <button onClick={goBack} style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", marginBottom: 6, letterSpacing: -0.3 }}>{event.title}</h1>

          <div style={{ display: "flex", gap: 12, marginBottom: 14, fontSize: "0.6875rem", color: "var(--text-secondary)" }}>
            <span>{event.date}</span>
            <span>{event.time}</span>
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span style={{ fontSize: "0.625rem", color: "var(--text-secondary)" }}>{event.location}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              <span style={{ fontSize: "0.625rem", color: "var(--text-secondary)" }}>{event.duration}</span>
            </div>
          </div>

          <p style={{ fontSize: "0.6875rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>{event.desc}</p>

          <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: "0.5rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: 3 }}>Price</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "var(--text)" }}>{event.price}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.5rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: 3 }}>Availability</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "var(--primary)" }}>{event.spots}</div>
            </div>
          </div>

          <div style={{ flex: 1 }} />

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" onClick={() => setShowReserve(true)} style={{ flex: 1, minHeight: 44, fontSize: "0.75rem", fontWeight: 700 }}>Reserve Spot · ${event.priceNum}</button>
            <button className="btn btn-ghost" onClick={goBack} style={{ minHeight: 44, fontSize: "0.75rem", padding: "0 20px" }}>Back</button>
          </div>
        </div>

        {/* Right — Photo */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: `url('${event.img}') center/cover` }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.3))" }} />
          <div className="grain" />
        </div>
      </div>

      {/* Reserve Modal */}
      {showReserve && (
        <div style={{ position: "absolute", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={() => setShowReserve(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "relative", zIndex: 1, width: 380, background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", padding: 24, boxShadow: "0 24px 48px rgba(0,0,0,0.2)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "0.875rem", fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>Confirm Reservation</h2>
            <p style={{ fontSize: "0.5625rem", color: "var(--text-secondary)", marginBottom: 16 }}>Reserve your spot for this event</p>

            {/* Event summary */}
            <div style={{ padding: "12px 14px", background: "var(--bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text)" }}>{event.title}</span>
                <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text)" }}>${event.priceNum}</span>
              </div>
              <div style={{ fontSize: "0.5625rem", color: "var(--text-secondary)" }}>{event.date} · {event.time}</div>
              <div style={{ fontSize: "0.5625rem", color: "var(--text-secondary)", marginTop: 2 }}>{event.location} · {event.duration}</div>
              <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.5625rem", color: "var(--text-secondary)" }}>Guest</span>
                <span style={{ fontSize: "0.5625rem", fontWeight: 600, color: "var(--text)" }}>{guestName} · Room {roomNumber}</span>
              </div>
            </div>

            {/* Payment methods */}
            <div style={{ fontSize: "0.5rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: 8 }}>Payment Method</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
              {methods.map((m, i) => (
                <button key={m.id} onClick={() => setSelectedMethod(i)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--bg)", border: selectedMethod === i ? "2px solid var(--primary)" : "1px solid var(--border)", borderRadius: "var(--radius-sm)", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", border: selectedMethod === i ? "4px solid var(--primary)" : "2px solid var(--border)", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--text)" }}>{m.label}</div>
                    <div style={{ fontSize: "0.5rem", color: "var(--text-secondary)", marginTop: 1 }}>{m.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Modal buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-sm btn-ghost" onClick={() => setShowReserve(false)} style={{ flex: 1, padding: "13px 16px" }}>Cancel</button>
              <button className="btn btn-sm btn-primary" onClick={() => {
                if (selectedMethod === 0) {
                  navigate("EVT-03");
                } else {
                  setFlowData({ payAmount: event.priceNum, payTitle: "Event Reservation", payNextScreen: "EVT-03" });
                  navigate("PAY-02");
                }
              }} style={{ flex: 1, padding: "13px 16px" }}>
                {selectedMethod === 0 ? "Charge to Room" : "Pay Now"} · ${event.priceNum}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
