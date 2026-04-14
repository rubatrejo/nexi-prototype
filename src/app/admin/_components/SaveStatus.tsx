import { T } from "../_lib/tokens";

export default function SaveStatus({ state }: { state: "idle" | "saving" | "saved" | "error" }) {
  if (state === "idle") return null;
  const cfg = {
    saving: { color: T.textDim, label: "Saving" },
    saved: { color: T.success, label: "✓ Saved" },
    error: { color: T.error, label: "✗ Error" },
  }[state];
  return <div style={{ fontSize: 11, color: cfg.color, fontWeight: 600, letterSpacing: 0.5, marginRight: 4 }}>{cfg.label}</div>;
}
