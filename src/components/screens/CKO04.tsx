"use client";

import { useMemo, useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import { useHotel } from "@/lib/theme-provider";
import GlobalHeader from "@/components/layout/GlobalHeader";
import { CheckCircle } from "@/components/ui/Icons";

const TOTAL = 1543.74;



function getTagGroup(rating: number | null): string {
  if (!rating) return "positive";
  if (rating <= 2) return "negative";
  if (rating === 3) return "neutral";
  return "positive";
}

// Answers are a sparse map keyed by question id. Values:
//   rating → number (1..maxRating)
//   text   → string
//   choice → string (selected option)
//   yesno  → "yes" | "no"
type SurveyAnswer = number | string;
type SurveyAnswers = Record<string, SurveyAnswer>;

export default function FeedbackRating() {
  const { navigate } = useKiosk();
  const { t } = useI18n();
  const { survey } = useHotel();
  const [selected, setSelected] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<SurveyAnswers>({});

  // Use the config-driven survey only when the admin has actually
  // configured questions and hasn't disabled the post-checkout prompt.
  // Otherwise the existing hardcoded rating + tags modal acts as
  // fallback so unconfigured clients still get a feedback screen.
  const useDynamicSurvey = !!survey?.questions?.length && survey.showAfterCheckOut !== false;

  const requiredUnanswered = useMemo(() => {
    if (!useDynamicSurvey || !survey) return 0;
    return survey.questions.filter((q) => {
      if (!q.required) return false;
      const a = answers[q.id];
      if (a === undefined || a === null || a === "") return true;
      return false;
    }).length;
  }, [useDynamicSurvey, survey, answers]);

  const setAnswer = (id: string, value: SurveyAnswer) => setAnswers((prev) => ({ ...prev, [id]: value }));

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
          <div style={{ height: "100%", width: "40%", background: "var(--primary-bg, var(--primary))", borderRadius: 2 }} />
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
              {survey?.thankYouMessage?.trim() || t("cko.feedback.helpsBetter")}
            </p>
            <p style={{ fontSize: "0.5625rem", color: "var(--text-secondary)", marginTop: 12, opacity: 0.6 }}>{t("cko.feedback.redirecting")}</p>
          </div>
        ) : useDynamicSurvey && survey ? (

        /* === Dynamic Survey Modal (driven by /admin Survey tab) === */
        <div style={{
          position: "relative", zIndex: 2,
          width: 440, maxHeight: "82%",
          background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.2), 0 4px 20px rgba(0,0,0,0.1)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{ padding: "22px 28px 16px", borderBottom: "1px solid var(--border)", textAlign: "center" }}>
            <p style={{ fontSize: "0.5625rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>Before You Go</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.0625rem", fontWeight: 800, color: "var(--text)", marginBottom: 2, letterSpacing: -0.2 }}>
              {survey.title || "How was your stay?"}
            </h2>
            {survey.subtitle && (
              <p style={{ fontSize: "0.625rem", color: "var(--text-secondary)" }}>{survey.subtitle}</p>
            )}
          </div>

          {/* Scrollable questions */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
            {survey.questions.map((q, qi) => {
              const answer = answers[q.id];
              return (
                <div key={q.id}>
                  <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text)", marginBottom: 8, lineHeight: 1.35 }}>
                    <span style={{ color: "var(--text-secondary)", marginRight: 4 }}>{qi + 1}.</span>
                    {q.text}
                    {q.required && <span style={{ color: "var(--error)", marginLeft: 4 }}>*</span>}
                  </div>

                  {q.type === "rating" && (() => {
                    const max = Math.max(2, Math.min(10, q.maxRating ?? 5));
                    return (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {Array.from({ length: max }, (_, i) => i + 1).map((n) => {
                          const active = answer === n;
                          return (
                            <button
                              key={n}
                              onClick={() => setAnswer(q.id, n)}
                              style={{
                                width: 34, height: 34, borderRadius: "50%",
                                border: `1.5px solid ${active ? "var(--primary)" : "var(--border)"}`,
                                background: active ? "var(--primary)" : "transparent",
                                color: active ? "#fff" : "var(--text)",
                                fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: 700,
                                cursor: "pointer", transition: "all 150ms ease",
                                transform: active ? "scale(1.06)" : "scale(1)",
                              }}
                            >
                              {n}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {q.type === "text" && (
                    <textarea
                      data-kiosk-keyboard
                      inputMode="none"
                      value={typeof answer === "string" ? answer : ""}
                      onChange={(e) => setAnswer(q.id, e.target.value)}
                      placeholder="Type your answer…"
                      rows={3}
                      style={{
                        width: "100%", padding: "8px 10px",
                        background: "var(--bg)", border: "1px solid var(--border)",
                        borderRadius: "var(--radius-sm)",
                        fontFamily: "var(--font-body), sans-serif",
                        fontSize: "0.6875rem", color: "var(--text)",
                        resize: "vertical", outline: "none", lineHeight: 1.45,
                      }}
                    />
                  )}

                  {q.type === "choice" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      {(q.options ?? []).map((opt) => {
                        const active = answer === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => setAnswer(q.id, opt)}
                            style={{
                              padding: "8px 12px", borderRadius: "var(--radius-sm)",
                              background: active ? "color-mix(in srgb, var(--primary) 12%, transparent)" : "transparent",
                              border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`,
                              color: active ? "var(--primary)" : "var(--text)",
                              fontFamily: "var(--font-body), sans-serif", fontSize: "0.6875rem", fontWeight: 600,
                              cursor: "pointer", transition: "all 150ms ease", textAlign: "left",
                              display: "flex", alignItems: "center", gap: 8,
                            }}
                          >
                            <span style={{
                              width: 14, height: 14, borderRadius: "50%",
                              border: `1.5px solid ${active ? "var(--primary)" : "var(--border)"}`,
                              background: active ? "var(--primary)" : "transparent",
                              flexShrink: 0,
                            }} />
                            {opt}
                          </button>
                        );
                      })}
                      {(q.options?.length ?? 0) === 0 && (
                        <div style={{ fontSize: "0.625rem", color: "var(--text-secondary)", fontStyle: "italic" }}>No options configured</div>
                      )}
                    </div>
                  )}

                  {q.type === "yesno" && (
                    <div style={{ display: "flex", gap: 6 }}>
                      {(["yes", "no"] as const).map((val) => {
                        const active = answer === val;
                        return (
                          <button
                            key={val}
                            onClick={() => setAnswer(q.id, val)}
                            style={{
                              flex: 1, padding: "9px 12px", borderRadius: "var(--radius-sm)",
                              background: active ? "var(--primary)" : "transparent",
                              border: `1.5px solid ${active ? "var(--primary)" : "var(--border)"}`,
                              color: active ? "#fff" : "var(--text)",
                              fontFamily: "var(--font-body), sans-serif", fontSize: "0.75rem", fontWeight: 700,
                              cursor: "pointer", transition: "all 150ms ease",
                              textTransform: "capitalize",
                            }}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ padding: "14px 28px 18px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => navigate("CKO-05")} style={{ flex: 1, minHeight: 40, fontSize: "0.75rem" }}>Skip</button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={requiredUnanswered > 0}
              title={requiredUnanswered > 0 ? `${requiredUnanswered} required question${requiredUnanswered === 1 ? "" : "s"} left` : ""}
              style={{
                flex: 1, minHeight: 40, fontSize: "0.75rem",
                opacity: requiredUnanswered > 0 ? 0.5 : 1,
                pointerEvents: requiredUnanswered > 0 ? "none" : "auto",
              }}
            >
              {requiredUnanswered > 0 ? `${requiredUnanswered} left` : "Submit Feedback"}
            </button>
          </div>
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
                    fontSize: "0.5625rem", fontWeight: 500, fontFamily: "var(--font-body), sans-serif",
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
