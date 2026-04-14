import { T } from "../_lib/tokens";

export default function ColorGroup({ title, children, active }: { title: string; children: React.ReactNode; active?: boolean }) {
  return (
    <div style={{
      background: T.surface,
      border: `1.5px solid ${active ? T.accent : T.border}`,
      borderRadius: 10,
      padding: 10,
      boxShadow: active ? `0 0 0 3px ${T.accent}14` : "none",
      transition: "all 150ms",
      position: "relative",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: active ? T.accent : T.textDim, textTransform: "uppercase", letterSpacing: 0.8 }}>{title}</div>
        {active && (
          <div style={{ fontSize: 8, fontWeight: 700, color: T.accent, background: `${T.accent}14`, padding: "2px 6px", borderRadius: 4, letterSpacing: 0.5, textTransform: "uppercase" }}>
            Live in preview
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
