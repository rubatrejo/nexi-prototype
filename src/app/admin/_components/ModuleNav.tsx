"use client";

import type { HotelModule } from "@/lib/hotel-config";
import { T } from "../_lib/tokens";
import ModuleGlyph from "./ModuleGlyph";

export default function ModuleNav({ iframeRef, modules }: { iframeRef: React.RefObject<HTMLIFrameElement | null>; modules: HotelModule[] }) {
  const send = (screen: string) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    try { win.postMessage({ type: "nexi-cms:navigate", screen }, "*"); } catch {}
  };
  return (
    <div style={{
      width: 168, flexShrink: 0, borderRight: `1px solid ${T.border}`, background: T.surface,
      padding: "14px 10px", overflow: "auto", display: "flex", flexDirection: "column", gap: 2,
    }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, padding: "4px 10px 8px" }}>
        Quick Nav
      </div>
      <button
        onClick={() => send("IDL-01")}
        style={{
          display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 7,
          background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
          color: T.text, fontFamily: T.fontBody, fontSize: 11, fontWeight: 600,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = `${T.accent}12`; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
      >
        <div style={{ width: 18, height: 18, color: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a10 10 0 0 0 0 20" /></svg>
        </div>
        Idle Screen
      </button>
      <button
        onClick={() => send("DSH-01")}
        style={{
          display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 7,
          background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
          color: T.text, fontFamily: T.fontBody, fontSize: 11, fontWeight: 600,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = `${T.accent}12`; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
      >
        <div style={{ width: 18, height: 18, color: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
        </div>
        Dashboard
      </button>
      {modules.filter((m) => m.enabled).map((m) => (
        <button
          key={m.id}
          onClick={() => send(m.entryScreen)}
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 7,
            background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
            color: T.text, fontFamily: T.fontBody, fontSize: 11, fontWeight: 500,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = `${T.accent}12`; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <div style={{ width: 18, height: 18, color: T.textDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><ModuleGlyph icon={m.icon} /></svg>
          </div>
          <span style={{ flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.label}</span>
          <span style={{ fontSize: 8, color: T.textMuted, fontFamily: "ui-monospace, monospace", flexShrink: 0 }}>{m.entryScreen}</span>
        </button>
      ))}
    </div>
  );
}
