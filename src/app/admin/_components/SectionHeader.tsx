import { T } from "../_lib/tokens";
import { ICONS } from "../_lib/icons";
import { SECTIONS } from "../_lib/sections";

export default function SectionHeader({ section }: { section: typeof SECTIONS[number] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, paddingBottom: 10, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: `${T.accent}14`, color: T.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${T.accent}28` }}>
        <span style={{ display: "inline-flex", transform: "scale(0.65)" }}>{ICONS[section.key]}</span>
      </div>
      <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, letterSpacing: 1.2, textTransform: "uppercase", fontFamily: "ui-monospace, monospace" }}>
        {section.num}
      </div>
      <h1 style={{ fontFamily: T.fontDisplay, fontSize: 18, fontWeight: 800, color: T.text, letterSpacing: "-0.01em", lineHeight: 1, margin: 0 }}>
        {section.title}
      </h1>
      <p style={{ fontSize: 11, color: T.textDim, lineHeight: 1.4, margin: 0, marginLeft: 4, flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {section.desc}
      </p>
    </div>
  );
}
