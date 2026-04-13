"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";

const CATEGORIES = ["General", "Room", "Dining", "Activities", "Policies"];

const FAQS: Record<string, { q: string; a: string }[]> = {
  General: [
    { q: "What are the check-in and check-out times?", a: "Check-in begins at 3:00 PM and check-out is at 11:00 AM. Early check-in and late check-out may be available upon request, subject to availability. Please contact the front desk for arrangements." },
    { q: "Is breakfast included?", a: "A complimentary continental breakfast is served daily from 6:30 AM to 10:00 AM in the Grand Dining Room. Full breakfast menu available for an additional charge." },
    { q: "How do I connect to Wi-Fi?", a: "Network: NEXI-Guest-Premium. Password: WELCOME2026. You can also connect via the Wi-Fi section on the kiosk." },
    { q: "Where is the gym located?", a: "The fitness center is located on the 2nd floor, east wing. Open 24 hours for hotel guests. Access with your room key card." },
    { q: "Is there a shuttle to the airport?", a: "Complimentary airport shuttle runs every 30 minutes from 5:00 AM to 11:00 PM. Pick-up is at the main entrance." },
    { q: "What is the cancellation policy?", a: "Free cancellation up to 48 hours before check-in. Cancellations within 48 hours are subject to a one-night charge. No-shows will be charged the full stay." },
  ],
  Room: [
    { q: "How do I request extra towels?", a: "You can request extra towels through Room Service on the kiosk, by calling the front desk, or speaking with our AI Concierge." },
    { q: "Is there a safe in the room?", a: "Yes, every room has a digital safe located in the wardrobe. Instructions are on the safe door. Contact the front desk if you need assistance." },
    { q: "How do I adjust the thermostat?", a: "The thermostat panel is located on the wall near the entrance. Tap the display to wake it, then use +/- to set your preferred temperature." },
  ],
  Dining: [
    { q: "What are the restaurant hours?", a: "The Grand Dining Room serves breakfast (6:30-10:00 AM), lunch (11:30 AM-2:00 PM), and dinner (5:30-10:00 PM). The Lobby Bar is open 11:00 AM to midnight." },
    { q: "Is room service available 24/7?", a: "Room service is available 24/7. The full menu is available from 6:00 AM to 11:00 PM, with a limited menu overnight." },
    { q: "Can you accommodate dietary restrictions?", a: "Absolutely. Our kitchen accommodates vegetarian, vegan, gluten-free, and allergy-specific diets. Please inform your server or note it when ordering via the kiosk." },
  ],
  Activities: [
    { q: "What are the pool hours?", a: "The pool is open daily from 6:00 AM to 10:00 PM. Towels are provided poolside. The hot tub closes at 9:00 PM." },
    { q: "Is there a spa on-site?", a: "Yes, the Serenity Spa is located on the 3rd floor. Open daily 9:00 AM to 8:00 PM. Book treatments at the front desk or through the kiosk." },
    { q: "Are there activities for children?", a: "The Kids Club operates daily from 9:00 AM to 5:00 PM for ages 4-12. Activities include arts & crafts, games, and supervised pool time." },
  ],
  Policies: [
    { q: "Is smoking allowed?", a: "The hotel is entirely non-smoking indoors. Designated smoking areas are located at the north terrace and pool deck garden." },
    { q: "What is the pet policy?", a: "We welcome pets under 30 lbs with a $50/night pet fee. Pet-friendly rooms are available on floors 2-4. Service animals are always welcome at no charge." },
    { q: "Is parking available?", a: "Self-parking is $25/night and valet parking is $40/night. The parking garage is accessible from the north entrance. Electric vehicle charging stations available." },
  ],
};

export default function FAQ01() {
  const { goBack, navigate } = useKiosk();
  const [category, setCategory] = useState("General");
  const [open, setOpen] = useState<number | null>(0);

  const items = FAQS[category] || [];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left — FAQ */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 32px", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <button onClick={goBack} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", cursor: "pointer", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "var(--text)", margin: 0 }}>Frequently Asked Questions</h1>
          </div>

          {/* Category pills */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexShrink: 0 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setOpen(null); }}
                style={{
                  padding: "7px 16px",
                  borderRadius: "9999px",
                  border: `2px solid ${category === cat ? "var(--primary)" : "#BBBBB5"}`,
                  background: category === cat ? "var(--primary)" : "#FFFFFF",
                  color: category === cat ? "#fff" : "#333",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "var(--font-body), sans-serif",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion */}
          <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 2, scrollbarWidth: "none", msOverflowStyle: "none" }} className="lst-scroll">
            {items.map((faq, i) => (
              <div key={`${category}-${i}`} style={{ borderBottom: "1px solid var(--border)" }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{
                    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "14px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 12,
                  }}
                >
                  <span style={{ fontFamily: "var(--font-body), sans-serif", fontWeight: 600, fontSize: "0.8125rem", color: "var(--text)" }}>{faq.q}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2.5" strokeLinecap="round" style={{ transform: open === i ? "rotate(180deg)" : "none", transition: "transform 200ms", flexShrink: 0 }}><path d="M6 9l6 6 6-6"/></svg>
                </button>
                {open === i && (
                  <div style={{ padding: "0 0 14px", fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.7, fontFamily: "var(--font-body), sans-serif" }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right — AI Concierge */}
        <div style={{ width: "42%", display: "flex", flexDirection: "column", padding: "24px 32px 24px 0", gap: 16, flexShrink: 0 }}>
          {/* Video preview — animated greeting */}
          <div style={{
            flex: 1, borderRadius: "var(--radius-lg)", overflow: "hidden", position: "relative",
            background: "#1a1a1a",
          }}>
            <video
              src="https://cdn.replica.tavus.io/40242/2fe8396c.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* LIVE badge */}
            <div style={{
              position: "absolute", top: 12, left: 12,
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
              padding: "4px 10px", borderRadius: "9999px",
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }} />
              <span style={{ color: "#fff", fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.05em" }}>LIVE</span>
            </div>
            {/* Play button overlay */}
            <div style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", border: "1px solid rgba(255,255,255,0.3)",
              }}
                onClick={() => navigate("AVT-02")}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          </div>

          {/* CTA card */}
          <div style={{
            background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
            padding: "20px 24px", textAlign: "center",
            border: "1px solid var(--border)",
          }}>
            {/* Sparkle icon */}
            <div style={{ marginBottom: 8 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5">
                <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
              </svg>
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem", color: "var(--text)", margin: "0 0 4px" }}>
              Can't find your answer?
            </p>
            <p style={{ fontSize: "0.6875rem", color: "var(--text-secondary)", margin: "0 0 14px", lineHeight: 1.5 }}>
              Our AI concierge can help you with any question about your stay.
            </p>
            <button
              onClick={() => navigate("AVT-02")}
              className="btn-primary"
              style={{ width: "100%", minHeight: 40, fontSize: "0.75rem", fontWeight: 600, borderRadius: "var(--radius-full)" }}
            >
              Talk to our AI Concierge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
