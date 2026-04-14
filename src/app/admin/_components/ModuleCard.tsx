import type { HotelModule } from "@/lib/hotel-config";
import { T } from "../_lib/tokens";
import ModuleGlyph from "./ModuleGlyph";
import Toggle from "./Toggle";

export default function ModuleCard({ module, onToggle, onToggleDash }: { module: HotelModule; onToggle: () => void; onToggleDash: () => void }) {
  const active = module.enabled;
  return (
    <div
      onClick={onToggle}
      style={{
        position: "relative", padding: "16px 14px 14px", borderRadius: 12,
        background: active ? `${T.accent}08` : T.surface,
        border: `1px solid ${active ? T.accent : T.border}`,
        cursor: "pointer", transition: "all 150ms",
        opacity: active ? 1 : 0.55,
        display: "flex", flexDirection: "column", gap: 10,
        minHeight: 130,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: active ? `${T.accent}18` : T.surfaceHi, color: active ? T.accent : T.textDim, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${active ? `${T.accent}30` : T.border}` }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><ModuleGlyph icon={module.icon} /></svg>
        </div>
        <Toggle on={active} onClick={(e) => { e.stopPropagation(); onToggle(); }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: T.fontDisplay, fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 2, lineHeight: 1.2 }}>{module.label}</div>
        <div style={{ fontSize: 10, color: T.textMuted, fontFamily: "ui-monospace, monospace" }}>{module.entryScreen}</div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onToggleDash(); }}
        disabled={!active}
        style={{
          padding: "5px 8px", borderRadius: 6, fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
          background: module.dashboardOrder != null ? `${T.accent}18` : "transparent",
          border: `1px solid ${module.dashboardOrder != null ? T.accent : T.border}`,
          color: module.dashboardOrder != null ? T.accent : T.textMuted,
          cursor: active ? "pointer" : "not-allowed",
          fontFamily: T.fontBody, textTransform: "uppercase", alignSelf: "flex-start",
        }}
      >
        {module.dashboardOrder != null ? `● Dash #${module.dashboardOrder}` : "Off Dash"}
      </button>
    </div>
  );
}
