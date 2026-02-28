"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import GlobalHeader from "@/components/layout/GlobalHeader";
import { CheckCircle } from "@/components/ui/Icons";

const TOTAL = 1543.74;



function getTagGroup(rating: number | null): string {
  if (!rating) return "positive";
  if (rating <= 2) return "negative";
  if (rating === 3) return "neutral";
  return "positive";
}

export default function FeedbackRating() {
  const { navigate } = useKiosk();
  const { t } = useI18n();
  const [selected, setSelected] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const LINE_ITEMS = [
    { label: t("cko.summary.roomCharges"), amount: 1247.50 },
    { label: t("cko.summary.roomService"), amount: 86.40 },
    { label: t("cko.summary.miniBar"), amount: 24.50 },
    { label: t("cko.summary.parking"), amount: 45.00 },
    { label: t("cko.summary.taxFees"), amount: 140.34 },
  ];

  const EMOJIS = [
    { emoji: "😞", label: t("cko.feedback.poor"), value: 1 },
    { emoji: "😐", label: t("cko.feedback.okay"), value: 2 },
    { emoji: "🙂", label: t("cko.feedback.good"), value: 3 },
    { emoji: "😊", label: t("cko.feedback.great"), value: 4 },
    { emoji: "🤩", label: t("cko.feedback.amazing"), value: 5 },
  ];

  const TAGS_BY_RATING: Record<string, { question: string; tags: string[] }> = {
    negative: {
      question: t("cko.feedback.improveQuestion"),
      tags: [
        t("cko.feedback.tag.roomCleanliness"),
        t("cko.feedback.tag.noiseLevel"),
        t("cko.feedback.tag.slowService"),
        t("cko.feedback.tag.checkInWait"),
        t("cko.feedback.tag.uncomfortableBed"),
        t("cko.feedback.tag.poorWifi"),
        t("cko.feedback.tag.staffAttitude"),
        t("cko.feedback.tag.maintenanceIssues")
      ],
    },
    neutral: {
      question: t("cko.feedback.stoodOutQuestion"),
      tags: [
        t("cko.feedback.tag.roomFine"),
        t("cko.feedback.tag.decentLocation"),
        t("cko.feedback.tag.okayService"),
        t("cko.feedback.tag.averageFood"),
        t("cko.feedback.tag.fairPrice"),
        t("cko.feedback.tag.basicAmenities"),
        t("cko.feedback.tag.nothingSpecial"),
        t("cko.feedback.tag.metExpectations")
      ],
    },
    positive: {
      question: t("cko.feedback.enjoyedQuestion"),
      tags: [
        t("cko.feedback.tag.friendlyStaff"),
        t("cko.feedback.tag.cleanRoom"),
        t("cko.feedback.tag.greatView"),
        t("cko.feedback.tag.comfortableBed"),
        t("cko.feedback.tag.fastCheckIn"),
        t("cko.feedback.tag.excellentFood"),
        t("cko.feedback.tag.quietRoom"),
        t("cko.feedback.tag.goodLocation")
      ],
    },
  };

  const toggleTag = (tag: string) => {
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const handleSelect = (value: number) => {
    setSelected(value);
    setTags([]); // reset tags when rating changes
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => navigate("CKO-05"), 3000);
  };

  const tagGroup = TAGS_BY_RATING[getTagGroup(selected)];

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>

      {/* === Background: CKO-02 Stay Summary (frozen) === */}
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)", filter: "blur(2px)", pointerEvents: "none" }}>
        <GlobalHeader />
        <div style={{ height: 4, background: "var(--border)", position: "relative" }}>
          <div style={{ height: "100%", width: "40%", background: "var(--primary)", borderRadius: 2 }} />
        </div>
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div style={{ flex: 1, padding: "20px 28px" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", fontWeight: 800, color: "var(--text)", marginBottom: 2 }}>{t("cko.summary.title")}</h1>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: 14 }}>Feb 22 - Feb 25, 2026 · 3 nights · Room 1247</p>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
              {LINE_ITEMS.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderBottom: i < LINE_ITEMS.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text)" }}>{item.label}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.75rem", color: "var(--text)" }}>${item.amount.toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 14px", background: "var(--bg-elevated)", borderTop: "2px solid var(--border)" }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem" }}>{t("cko.summary.total")}</span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.125rem", color: "var(--primary)" }}>${TOTAL.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1520250497591-112f2f40a3f4.jpg') center/cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.5))" }} />
          </div>
        </div>
      </div>

      {/* === Overlay === */}
      <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />

        {/* === Thank You Modal === */}
        {submitted ? (
          <div style={{
            position: "relative", zIndex: 2,
            width: 340, padding: "32px 28px",
            background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.2), 0 4px 20px rgba(0,0,0,0.1)",
            display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
          }}>
            <CheckCircle size={48} />
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 800, color: "var(--text)", marginTop: 16, marginBottom: 4 }}>{t("cko.feedback.thankYou")}</h2>
            <p style={{ fontSize: "0.6875rem", color: "var(--text-secondary)", lineHeight: 1.5, maxWidth: 260 }}>
              {t("cko.feedback.helpsBetter")}
            </p>
            <p style={{ fontSize: "0.5625rem", color: "var(--text-secondary)", marginTop: 12, opacity: 0.6 }}>{t("cko.feedback.redirecting")}</p>
          </div>
        ) : (

        /* === Feedback Modal === */
        <div style={{
          position: "relative", zIndex: 2,
          width: 400,
          background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.2), 0 4px 20px rgba(0,0,0,0.1)",
          padding: "24px 28px 20px",
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          <p style={{ fontSize: "0.5625rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>Before You Go</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.0625rem", fontWeight: 800, color: "var(--text)", marginBottom: 2, letterSpacing: -0.2 }}>How Was Your Stay?</h2>
          <p style={{ fontSize: "0.625rem", color: "var(--text-secondary)", marginBottom: 14 }}>Tap to rate your experience</p>

          {/* Emoji row */}
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {EMOJIS.map((item) => {
              const isSelected = selected === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => handleSelect(item.value)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                    padding: "6px 8px", borderRadius: "var(--radius-sm)",
                    background: isSelected ? "var(--primary)" : "transparent",
                    border: `1.5px solid ${isSelected ? "var(--primary)" : "var(--border)"}`,
                    cursor: "pointer", transition: "all 150ms ease",
                    transform: isSelected ? "scale(1.08)" : "scale(1)",
                    minWidth: 46, minHeight: 44,
                  }}
                >
                  <span style={{ fontSize: "1.125rem", lineHeight: 1 }}>{item.emoji}</span>
                  <span style={{ fontSize: "0.5rem", fontWeight: 600, color: isSelected ? "#fff" : "var(--text-secondary)" }}>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ width: "100%", height: 1, background: "var(--border)", marginBottom: 12 }} />

          {/* Dynamic tags */}
          <p style={{ fontSize: "0.5625rem", fontWeight: 600, color: "var(--text)", marginBottom: 6, alignSelf: "flex-start" }}>{tagGroup.question}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 16, width: "100%" }}>
            {tagGroup.tags.map((tag) => {
              const isActive = tags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  style={{
                    padding: "3px 10px", borderRadius: 9999,
                    fontSize: "0.5625rem", fontWeight: 500, fontFamily: "'Inter', sans-serif",
                    background: isActive ? "color-mix(in srgb, var(--primary) 10%, transparent)" : "transparent",
                    border: `1px solid ${isActive ? "var(--primary)" : "var(--border)"}`,
                    color: isActive ? "var(--primary)" : "var(--text-secondary)",
                    cursor: "pointer", transition: "all 150ms ease",
                    minHeight: 30, display: "flex", alignItems: "center",
                  }}
                >
                  {isActive && <span style={{ marginRight: 3, fontSize: "0.5rem" }}>✓</span>}{tag}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, width: "100%" }}>
            <button className="btn btn-ghost" onClick={() => navigate("CKO-05")} style={{ flex: 1, minHeight: 40, fontSize: "0.75rem" }}>Skip</button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              style={{
                flex: 1, minHeight: 40, fontSize: "0.75rem",
                opacity: selected ? 1 : 0.5,
                pointerEvents: selected ? "auto" : "none",
              }}
            >
              Submit Feedback
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
