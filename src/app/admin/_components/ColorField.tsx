import { T } from "../_lib/tokens";
import { isValidColor } from "../_lib/validators";

export default function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const hex = /^#[0-9a-f]{6}$/i.test(value) ? value : "#000000";
  const valid = isValidColor(value);
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 9, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, background: T.surface, border: `1px solid ${valid ? T.border : T.error}`, borderRadius: 6, padding: 2, minWidth: 0 }}>
        <input type="color" value={hex} onChange={(e) => onChange(e.target.value)} style={{ width: 22, height: 22, border: "none", background: "transparent", cursor: "pointer", padding: 0, flexShrink: 0 }} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          title={valid ? "" : "Use #RRGGBB, rgb(), rgba(), hsl(), hsla(), or a named color. Gradients are not supported here."}
          style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", color: valid ? T.text : T.error, fontFamily: "ui-monospace, monospace", fontSize: 10, padding: "3px 0" }}
        />
      </div>
      {!valid && (
        <div style={{ fontSize: 9, color: T.error, marginTop: 3, fontWeight: 600, lineHeight: 1.3 }}>
          Invalid color — use #RRGGBB, rgb(), hsl(), or a named color (no gradients)
        </div>
      )}
    </div>
  );
}
