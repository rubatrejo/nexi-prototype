"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";

const TIPS = ["No Tip", "15%", "18%", "20%", "Custom"];

interface TimeOption {
  label: string;
  surcharge: number;
  eta: string;
}

const TIMES: TimeOption[] = [
  { label: "ASAP", surcharge: 8, eta: "15-25 min" },
  { label: "30 min", surcharge: 3, eta: "25-35 min" },
  { label: "1 hour", surcharge: 0, eta: "55-65 min" },
];

const HOURS = Array.from({ length: 13 }, (_, i) => i + 6); // 6 AM to 6 PM
const MINUTES = ["00", "15", "30", "45"];

export default function RSV05() {
  const { navigate, goBack } = useKiosk();
  const [selectedTip, setSelectedTip] = useState(2);
  const [selectedTime, setSelectedTime] = useState(0);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleDay, setScheduleDay] = useState(0); // 0=tomorrow, 1=day after
  const [scheduleHour, setScheduleHour] = useState(8);
  const [scheduleMinute, setScheduleMinute] = useState("00");
  const [isScheduled, setIsScheduled] = useState(false);

  const subtotal = 78;
  const deliveryBase = 5;
  const surcharge = isScheduled ? 0 : TIMES[selectedTime].surcharge;
  const deliveryTotal = deliveryBase + surcharge;
  const tipPercent = [0, 15, 18, 20, 0][selectedTip];
  const tipAmount = Math.round(subtotal * tipPercent / 100 * 100) / 100;
  const total = subtotal + deliveryTotal + tipAmount;

  const dayLabels = ["Tomorrow", "Day After"];

  const handleScheduleConfirm = () => {
    setIsScheduled(true);
    setShowSchedule(false);
  };

  const handleCancelSchedule = () => {
    setIsScheduled(false);
    setShowSchedule(false);
  };

  const formatScheduled = () => {
    const h = scheduleHour;
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${dayLabels[scheduleDay]}, ${h12}:${scheduleMinute} ${ampm}`;
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left — Delivery Details */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 32px 0", overflow: "hidden" }}>
          <div style={{ flex: 1, overflowY: "auto", paddingBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <button onClick={() => goBack()} style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 800, color: "var(--text)", letterSpacing: -0.3 }}>Delivery Details</h1>
              <p style={{ fontSize: "0.5625rem", color: "var(--text-secondary)", marginTop: 1 }}>Confirm delivery preferences</p>
            </div>
          </div>

          {/* Delivery Time — full width */}
          <div style={{ padding: "14px 16px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", marginBottom: 14 }}>
            <div style={{ fontSize: "0.5625rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: 8 }}>Delivery Time</div>
            <div style={{ display: "flex", gap: 8 }}>
              {TIMES.map((t, i) => (
                <button key={t.label} onClick={() => { setSelectedTime(i); setIsScheduled(false); }} style={{ flex: 1, padding: "6px 0", borderRadius: "var(--radius-full)", border: `1.5px solid ${!isScheduled && selectedTime === i ? "var(--primary)" : "var(--border)"}`, background: !isScheduled && selectedTime === i ? "color-mix(in srgb, var(--primary) 8%, transparent)" : "transparent", color: !isScheduled && selectedTime === i ? "var(--primary)" : "var(--text-secondary)", fontWeight: !isScheduled && selectedTime === i ? 600 : 400, fontSize: "0.625rem", cursor: "pointer", minHeight: 32 }}>
                  {t.label}
                  {t.surcharge > 0 && (
                    <span style={{ display: "block", fontSize: "0.5rem", color: !isScheduled && selectedTime === i ? "var(--primary)" : "var(--text-secondary)", opacity: 0.7 }}>+${t.surcharge}</span>
                  )}
                </button>
              ))}
              <button onClick={() => setShowSchedule(true)} style={{ flex: 1, padding: "6px 0", borderRadius: "var(--radius-full)", border: `1.5px solid ${isScheduled ? "var(--primary)" : "var(--border)"}`, background: isScheduled ? "color-mix(in srgb, var(--primary) 8%, transparent)" : "transparent", color: isScheduled ? "var(--primary)" : "var(--text-secondary)", fontWeight: isScheduled ? 600 : 400, fontSize: "0.625rem", cursor: "pointer", minHeight: 32, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                <span style={{ fontSize: "0.5rem" }}>Schedule</span>
              </button>
            </div>
            {isScheduled && (
              <div style={{ marginTop: 6, fontSize: "0.5625rem", color: "var(--primary)", fontWeight: 600 }}>
                Scheduled: {formatScheduled()}
              </div>
            )}
          </div>

          {/* Tip */}
          <div style={{ padding: "14px 16px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", marginBottom: 14 }}>
            <div style={{ fontSize: "0.5625rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: 8 }}>Add a Tip</div>
            <div style={{ display: "flex", gap: 8 }}>
              {TIPS.map((tip, i) => (
                <button key={tip} onClick={() => setSelectedTip(i)} style={{ flex: 1, padding: "7px 0", borderRadius: "var(--radius-full)", border: `1.5px solid ${selectedTip === i ? "var(--primary)" : "var(--border)"}`, background: selectedTip === i ? "color-mix(in srgb, var(--primary) 8%, transparent)" : "transparent", color: selectedTip === i ? "var(--primary)" : "var(--text-secondary)", fontWeight: selectedTip === i ? 600 : 400, fontSize: "0.625rem", cursor: "pointer", minHeight: 32 }}>{tip}</button>
              ))}
            </div>
          </div>

          {/* Order breakdown */}
          <div style={{ padding: "14px 16px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontSize: "0.5625rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Order Total</div>
            {[
              { label: "Subtotal (5 items)", value: `$${subtotal}` },
              { label: `Delivery fee${surcharge > 0 ? ` (incl. $${surcharge} express)` : ""}`, value: `$${deliveryTotal}` },
              ...(tipAmount > 0 ? [{ label: `Tip (${tipPercent}%)`, value: `$${tipAmount.toFixed(2)}` }] : []),
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                <span style={{ fontSize: "0.625rem", color: "var(--text-secondary)" }}>{item.label}</span>
                <span style={{ fontSize: "0.625rem", fontWeight: 600, color: "var(--text)" }}>{item.value}</span>
              </div>
            ))}
            <div style={{ height: 1, background: "var(--border)", margin: "6px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text)" }}>Total</span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem", color: "var(--primary)" }}>${total.toFixed(2)}</span>
            </div>
          </div>

          </div>

          {/* CTA — fixed at bottom */}
          <div style={{ padding: "12px 0 20px", flexShrink: 0 }}>
            <button className="btn btn-primary" onClick={() => navigate("RSV-05p")} style={{ width: "100%", minHeight: 44, fontSize: "0.75rem", fontWeight: 700 }}>
              Place Order · ${total.toFixed(2)}
            </button>
          </div>
        </div>

        {/* Right — Photo */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1414235077428-338989a2e8c0.jpg') center/cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.5))" }} />
          <div className="grain" />

          {/* Estimated time glass card */}
          <div style={{ position: "absolute", bottom: 20, left: 16, right: 16, zIndex: 2, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "var(--radius-lg)", padding: "16px 18px", textAlign: "center" }}>
            <div style={{ fontSize: "0.5rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Estimated Delivery</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: 2 }}>
              {isScheduled ? formatScheduled() : TIMES[selectedTime].eta}
            </div>
            <div style={{ fontSize: "0.625rem", color: "rgba(255,255,255,0.5)" }}>Room 1247 · Deluxe King</div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showSchedule && (
        <div style={{ position: "absolute", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={() => setShowSchedule(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "relative", zIndex: 1, width: 360, background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", padding: 24, boxShadow: "0 24px 48px rgba(0,0,0,0.2)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "0.875rem", fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>Schedule Delivery</h2>
            <p style={{ fontSize: "0.5625rem", color: "var(--text-secondary)", marginBottom: 16 }}>Choose when you&apos;d like your order delivered</p>

            {/* Day selection */}
            <div style={{ fontSize: "0.5rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: 6 }}>Day</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
              {dayLabels.map((d, i) => (
                <button key={d} onClick={() => setScheduleDay(i)} style={{ flex: 1, padding: "8px 0", borderRadius: "var(--radius-sm)", border: `1.5px solid ${scheduleDay === i ? "var(--primary)" : "var(--border)"}`, background: scheduleDay === i ? "color-mix(in srgb, var(--primary) 8%, transparent)" : "transparent", color: scheduleDay === i ? "var(--primary)" : "var(--text-secondary)", fontWeight: scheduleDay === i ? 600 : 400, fontSize: "0.625rem", cursor: "pointer", minHeight: 36 }}>
                  {d}
                  <span style={{ display: "block", fontSize: "0.5rem", opacity: 0.6, marginTop: 1 }}>{i === 0 ? "Feb 23" : "Feb 24"}</span>
                </button>
              ))}
            </div>

            {/* Time selection */}
            <div style={{ fontSize: "0.5rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: 6 }}>Time</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.4375rem", color: "var(--text-secondary)", marginBottom: 3 }}>Hour</div>
                <div style={{ maxHeight: 120, overflowY: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--bg)" }}>
                  {HOURS.map(h => {
                    const ampm = h >= 12 ? "PM" : "AM";
                    const h12 = h > 12 ? h - 12 : h;
                    return (
                      <button key={h} onClick={() => setScheduleHour(h)} style={{ width: "100%", padding: "6px 10px", background: scheduleHour === h ? "color-mix(in srgb, var(--primary) 10%, transparent)" : "transparent", border: "none", borderBottom: "1px solid var(--border)", color: scheduleHour === h ? "var(--primary)" : "var(--text)", fontWeight: scheduleHour === h ? 600 : 400, fontSize: "0.625rem", cursor: "pointer", textAlign: "left" }}>
                        {h12}:00 {ampm}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.4375rem", color: "var(--text-secondary)", marginBottom: 3 }}>Minutes</div>
                <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--bg)" }}>
                  {MINUTES.map(m => (
                    <button key={m} onClick={() => setScheduleMinute(m)} style={{ width: "100%", padding: "6px 10px", background: scheduleMinute === m ? "color-mix(in srgb, var(--primary) 10%, transparent)" : "transparent", border: "none", borderBottom: "1px solid var(--border)", color: scheduleMinute === m ? "var(--primary)" : "var(--text)", fontWeight: scheduleMinute === m ? 600 : 400, fontSize: "0.625rem", cursor: "pointer", textAlign: "left" }}>
                      :{m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost" onClick={handleCancelSchedule} style={{ flex: 1, minHeight: 36, fontSize: "0.625rem" }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleScheduleConfirm} style={{ flex: 1, minHeight: 36, fontSize: "0.625rem" }}>Confirm Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
