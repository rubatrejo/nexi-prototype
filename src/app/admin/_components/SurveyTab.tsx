"use client";

import { useState } from "react";
import type { SurveyConfig, SurveyQuestion, SurveyQuestionType } from "@/lib/hotel-config";
import { T } from "../_lib/tokens";
import { baseInput, addCardBtn } from "../_lib/styles";
import Field from "./Field";
import Toggle from "./Toggle";

const SURVEY_TYPES: { value: SurveyQuestionType; label: string }[] = [
  { value: "rating", label: "Rating" },
  { value: "yesno", label: "Yes / No" },
  { value: "choice", label: "Multiple choice" },
  { value: "text", label: "Open text" },
];

export default function SurveyTab({ survey, onPatch, onUpdateQ, onAddQ, onRemoveQ }: {
  survey: SurveyConfig;
  onPatch: (p: Partial<SurveyConfig>) => void;
  onUpdateQ: (i: number, p: Partial<SurveyQuestion>) => void;
  onAddQ: () => void;
  onRemoveQ: (i: number) => void;
}) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 12 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Settings</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <Field label="Title"><input style={baseInput} value={survey.title} onChange={(e) => onPatch({ title: e.target.value })} /></Field>
          <Field label="Subtitle"><input style={baseInput} value={survey.subtitle ?? ""} onChange={(e) => onPatch({ subtitle: e.target.value })} placeholder="Optional" /></Field>
        </div>
        <Field label="Thank you message">
          <input style={baseInput} value={survey.thankYouMessage ?? ""} onChange={(e) => onPatch({ thankYouMessage: e.target.value })} placeholder="Shown after submission" />
        </Field>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
          <Toggle on={survey.showAfterCheckOut} onClick={(e) => { e.stopPropagation(); onPatch({ showAfterCheckOut: !survey.showAfterCheckOut }); }} />
          <div style={{ fontSize: 11, color: T.textDim }}>Show on the checkout feedback screen (CKO-04)</div>
        </div>
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>
            {survey.questions.length} questions
          </div>
        </div>
        {survey.questions.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", background: T.surface, border: `1.5px dashed ${T.borderHi}`, borderRadius: 10, color: T.textDim, fontSize: 12 }}>
            No questions yet.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {survey.questions.map((q, i) => (
              <SurveyQuestionCard key={q.id} q={q} index={i} onChange={(p) => onUpdateQ(i, p)} onRemove={() => onRemoveQ(i)} />
            ))}
          </div>
        )}
        <button onClick={onAddQ} style={addCardBtn}>+ Add question</button>
      </div>
    </div>
  );
}

function SurveyQuestionCard({ q, index, onChange, onRemove }: { q: SurveyQuestion; index: number; onChange: (p: Partial<SurveyQuestion>) => void; onRemove: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ padding: 12, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, position: "relative", display: "grid", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 22, height: 22, borderRadius: 5, background: `${T.accent}14`, color: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, fontFamily: "ui-monospace, monospace", flexShrink: 0 }}>{index + 1}</div>
        <input
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: T.fontDisplay, fontSize: 14, fontWeight: 700, color: T.text, padding: 0, minWidth: 0 }}
          value={q.text}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Question text"
        />
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <Toggle on={q.required} onClick={(e) => { e.stopPropagation(); onChange({ required: !q.required }); }} />
          <span style={{ fontSize: 9, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>req</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.8 }}>Type</div>
        {SURVEY_TYPES.map((t) => {
          const active = q.type === t.value;
          return (
            <button
              key={t.value}
              onClick={() => onChange({ type: t.value })}
              style={{ padding: "4px 10px", borderRadius: 5, fontSize: 10, fontWeight: 700, fontFamily: T.fontBody, cursor: "pointer", background: active ? T.accent : "transparent", color: active ? "#fff" : T.textDim, border: `1px solid ${active ? T.accent : T.border}` }}
            >{t.label}</button>
          );
        })}
        {q.type === "rating" && (
          <>
            <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginLeft: 8 }}>Scale</div>
            <input type="number" min={2} max={10} value={q.maxRating ?? 5} onChange={(e) => onChange({ maxRating: Number(e.target.value) })}
              style={{ width: 50, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "4px 8px", fontSize: 11, color: T.text, outline: "none" }} />
          </>
        )}
      </div>
      {q.type === "choice" && (
        <input
          style={{ ...baseInput, fontSize: 11 }}
          value={(q.options ?? []).join(", ")}
          onChange={(e) => onChange({ options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
          placeholder="Option 1, Option 2, Option 3"
        />
      )}
      {hover && (
        <button onClick={onRemove} style={{ position: "absolute", top: 8, right: 8, width: 22, height: 22, borderRadius: 6, background: T.surface, border: `1px solid ${T.border}`, color: T.error, cursor: "pointer", fontSize: 12, lineHeight: 1 }}>×</button>
      )}
    </div>
  );
}
