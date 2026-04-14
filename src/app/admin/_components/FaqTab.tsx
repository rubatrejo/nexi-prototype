"use client";

import { useState } from "react";
import type { FaqConfig, FaqItem } from "@/lib/hotel-config";
import { T } from "../_lib/tokens";
import { baseInput, addCardBtn } from "../_lib/styles";

export default function FaqTab({ faq, onPatch, onUpdateItem, onAdd, onRemove }: {
  faq: FaqConfig;
  onPatch: (p: Partial<FaqConfig>) => void;
  onUpdateItem: (i: number, p: Partial<FaqItem>) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
}) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 12 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Categories</div>
        <input
          style={baseInput}
          value={faq.categories.join(", ")}
          onChange={(e) => onPatch({ categories: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
          placeholder="General, Check-in, Amenities, Billing"
        />
        <div style={{ fontSize: 10, color: T.textMuted, marginTop: 4 }}>Comma-separated. Each Q&A picks one of these.</div>
      </div>
      <div>
        <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
          {faq.items.length} questions
        </div>
        {faq.items.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", background: T.surface, border: `1.5px dashed ${T.borderHi}`, borderRadius: 10, color: T.textDim, fontSize: 12 }}>
            No questions yet.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {faq.items.map((item, i) => (
              <FaqItemCard key={item.id} item={item} index={i} categories={faq.categories} onChange={(p) => onUpdateItem(i, p)} onRemove={() => onRemove(i)} />
            ))}
          </div>
        )}
        <button onClick={onAdd} style={addCardBtn}>+ Add question</button>
      </div>
    </div>
  );
}

function FaqItemCard({ item, index, categories, onChange, onRemove }: { item: FaqItem; index: number; categories: string[]; onChange: (p: Partial<FaqItem>) => void; onRemove: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ padding: 12, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, position: "relative", display: "grid", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 22, height: 22, borderRadius: 5, background: `${T.accent}14`, color: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, fontFamily: "ui-monospace, monospace", flexShrink: 0 }}>{index + 1}</div>
        <input
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: T.fontDisplay, fontSize: 14, fontWeight: 700, color: T.text, padding: 0, minWidth: 0 }}
          value={item.question}
          onChange={(e) => onChange({ question: e.target.value })}
          placeholder="Question"
        />
        <select
          value={item.category ?? (categories[0] ?? "General")}
          onChange={(e) => onChange({ category: e.target.value })}
          style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "5px 8px", fontSize: 11, color: T.text, outline: "none", flexShrink: 0 }}
        >
          {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      <textarea
        style={{ ...baseInput, minHeight: 60, fontFamily: T.fontBody, resize: "vertical", lineHeight: 1.4 }}
        value={item.answer}
        onChange={(e) => onChange({ answer: e.target.value })}
        placeholder="Answer"
      />
      {hover && (
        <button onClick={onRemove} style={{ position: "absolute", top: 8, right: 8, width: 22, height: 22, borderRadius: 6, background: T.surface, border: `1px solid ${T.border}`, color: T.error, cursor: "pointer", fontSize: 12, lineHeight: 1 }}>×</button>
      )}
    </div>
  );
}
