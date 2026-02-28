"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function MiniCalendar({ month, year, checkIn, checkOut }: { month: number; year: number; checkIn: number; checkOut: number }) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month).toLocaleString("en", { month: "long" });
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.8125rem", color: "var(--text)", marginBottom: 8, textAlign: "center" }}>{monthName} {year}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {DAYS.map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: "0.5625rem", fontWeight: 600, color: "var(--text-secondary)", padding: "2px 0", opacity: 0.6 }}>{d}</div>
        ))}
        {cells.map((d, i) => {
          const isCheckIn = d === checkIn && month === 1;
          const isCheckOut = d === checkOut && month === 1;
          const isBetween = month === 1 && d !== null && d > checkIn && d < checkOut;
          const highlight = isCheckIn || isCheckOut;
          const today = d === 22 && month === 1;
          return (
            <div key={i} style={{
              textAlign: "center", padding: "5px 0",
              borderRadius: highlight ? "var(--radius-full)" : isBetween ? 0 : "var(--radius-full)",
              background: highlight ? "var(--primary)" : isBetween ? "color-mix(in srgb, var(--primary) 12%, transparent)" : "transparent",
              color: d === null ? "transparent" : highlight ? "#fff" : today ? "var(--primary)" : "var(--text)",
              fontSize: "0.6875rem", fontWeight: highlight || today ? 700 : 400,
              cursor: d ? "pointer" : "default",
            }}>
              {d || ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function BookingStart() {
  const { navigate, goBack } = useKiosk();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />

      {/* Progress bar — step 1 of 6 */}
      <div style={{ height: 3, background: "var(--border)" }}>
        <div style={{ height: "100%", width: `${(1/6)*100}%`, background: "var(--primary)", borderRadius: 2 }} />
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Left — Calendar */}
        <div style={{ flex: 3, padding: "24px 28px", display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <button onClick={() => goBack()} style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              </button>
              <div>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 800, color: "var(--text)", letterSpacing: -0.3 }}>Book a Room</h1>
                <p style={{ fontSize: "0.6875rem", color: "var(--text-secondary)", marginTop: 1 }}>Select your dates and guests</p>
              </div>
            </div>
          </div>

          {/* Two-month calendar */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "16px 20px", marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 24 }}>
              <MiniCalendar month={1} year={2026} checkIn={22} checkOut={25} />
              <div style={{ width: 1, background: "var(--border)" }} />
              <MiniCalendar month={2} year={2026} checkIn={-1} checkOut={-1} />
            </div>
          </div>

          {/* Selected dates */}
          <div style={{ display: "flex", gap: 12 }}>
            {[{ label: "Check-in", value: "Feb 22, 2026" }, { label: "Check-out", value: "Feb 25, 2026" }].map((d) => (
              <div key={d.label} style={{ flex: 1, padding: "10px 14px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                <div style={{ fontSize: "0.5625rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: 2 }}>{d.label}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.8125rem", color: "var(--text)" }}>{d.value}</div>
              </div>
            ))}
            <div style={{ flex: 1, padding: "10px 14px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
              <div style={{ fontSize: "0.5625rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: 2 }}>Duration</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.8125rem", color: "var(--text)" }}>3 nights</div>
            </div>
          </div>
        </div>

        {/* Right — Guests + CTA */}
        <div style={{ flex: 2, padding: "24px 28px 24px 0", display: "flex", flexDirection: "column" }}>
          {/* Guest count */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "20px", marginBottom: 16 }}>
            <p style={{ fontSize: "0.625rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Guests</p>
            {[{ label: "Adults", sub: "Ages 13+", value: adults, set: setAdults, min: 1 }, { label: "Children", sub: "Ages 0-12", value: children, set: setChildren, min: 0 }].map((g, i) => (
              <div key={g.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderTop: i > 0 ? "1px solid var(--border)" : "none" }}>
                <div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text)" }}>{g.label}</div>
                  <div style={{ fontSize: "0.625rem", color: "var(--text-secondary)", marginTop: 1 }}>{g.sub}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button onClick={() => g.set(Math.max(g.min, g.value - 1))} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", fontWeight: 500, minWidth: 44, minHeight: 44 }}>-</button>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem", color: "var(--text)", minWidth: 16, textAlign: "center" }}>{g.value}</span>
                  <button onClick={() => g.set(g.value + 1)} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", fontWeight: 500, minWidth: 44, minHeight: 44 }}>+</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "16px 20px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: "0.6875rem", color: "var(--text-secondary)" }}>3 nights</span>
              <span style={{ fontSize: "0.6875rem", color: "var(--text-secondary)" }}>{adults} adult{adults > 1 ? "s" : ""}{children > 0 ? `, ${children} child${children > 1 ? "ren" : ""}` : ""}</span>
            </div>
            <div style={{ fontSize: "0.5625rem", color: "var(--text-secondary)", opacity: 0.7 }}>Prices shown on next screen</div>
          </div>

          {/* CTA */}
          <button className="btn btn-primary" onClick={() => navigate("BKG-02")} style={{ width: "100%", minHeight: 44, fontSize: "0.8125rem" }}>
            Search Available Rooms
          </button>
        </div>
      </div>
    </div>
  );
}
