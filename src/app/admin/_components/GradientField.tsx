import { T } from "../_lib/tokens";
import { isValidGradient } from "../_lib/validators";

/**
 * Free-form input for a CSS gradient string. Validates against
 * isValidGradient (empty allowed; otherwise must start with one of
 * the gradient functions). Renders a live swatch on the left so the
 * user sees the gradient as soon as they paste it in.
 */
export default function GradientField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const valid = isValidGradient(value);
  const trimmed = value.trim();
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 9, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "stretch", gap: 8, background: T.surface, border: `1px solid ${valid ? T.border : T.error}`, borderRadius: 6, padding: 4, minWidth: 0 }}>
        <div
          style={{
            width: 44,
            minHeight: 26,
            borderRadius: 5,
            border: `1px solid ${T.border}`,
            flexShrink: 0,
            background: valid && trimmed ? trimmed : "repeating-linear-gradient(45deg, #f0f0eb 0 6px, #fafaf7 6px 12px)",
          }}
          title={trimmed || "No gradient set"}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder='linear-gradient(90deg, #1288FF 0%, #8B5CF6 100%)'
          title={valid ? "" : "Must start with linear-gradient, radial-gradient, or conic-gradient"}
          style={{
            flex: 1,
            minWidth: 0,
            background: "transparent",
            border: "none",
            outline: "none",
            color: valid ? T.text : T.error,
            fontFamily: "ui-monospace, monospace",
            fontSize: 10,
            padding: "4px 4px",
          }}
        />
      </div>
      {!valid && (
        <div style={{ fontSize: 9, color: T.error, marginTop: 3, fontWeight: 600, lineHeight: 1.3 }}>
          Must start with linear-gradient(…), radial-gradient(…), or conic-gradient(…)
        </div>
      )}
    </div>
  );
}
