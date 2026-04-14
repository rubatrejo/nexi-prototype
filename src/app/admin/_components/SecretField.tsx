"use client";

import { useState } from "react";
import { T } from "../_lib/tokens";

export default function SecretField({ label, help, value, onChange }: { label: string; help?: string; value: string; onChange: (v: string) => void }) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 3 }}>
        <div style={{ fontSize: 9, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
        {help && <div style={{ fontSize: 9, color: T.textMuted }}>{help}</div>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 7, padding: "0 8px 0 10px" }}>
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••••••"
          autoComplete="off"
          spellCheck={false}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: T.text, fontSize: 11, fontFamily: "ui-monospace, monospace", padding: "7px 0", letterSpacing: visible ? 0 : 2 }}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          style={{ background: "transparent", border: "none", color: T.textDim, cursor: "pointer", fontSize: 9, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", padding: "4px 2px" }}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}
