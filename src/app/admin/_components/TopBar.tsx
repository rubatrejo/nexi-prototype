import type * as React from "react";
import type { HotelConfig } from "@/lib/hotel-config";
import { T } from "../_lib/tokens";
import { type Preset } from "../_lib/presets";
import SaveStatus from "./SaveStatus";
import ClientsDropdown from "./ClientsDropdown";

const tbBtn: React.CSSProperties = {
  padding: "9px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: T.fontBody, cursor: "pointer",
  background: T.surface, border: `1px solid ${T.border}`, color: T.text,
};

export default function TopBar({ brandName, saveState, configs, currentSlug, onSelectClient, onSave, onDelete, onOpen, onCopy, onNew, onSelectPreset, onDuplicate, onExportJson, onImportJson, onUndo, onRedo, canUndo, canRedo, onBrandNameChange, disabled, dirty, configBytes, kvSoft, kvHard, saveDisabled }: {
  brandName?: string; saveState: "idle" | "saving" | "saved" | "error";
  configs: HotelConfig[]; currentSlug: string | null; onSelectClient: (c: HotelConfig) => void;
  onSave: () => void; onDelete: () => void; onOpen: () => void; onCopy: () => void; onNew: () => void;
  onSelectPreset?: (p: Preset) => void;
  onDuplicate?: () => void;
  onExportJson?: () => void;
  onImportJson?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onBrandNameChange?: (v: string) => void; disabled?: boolean;
  dirty?: boolean; configBytes?: number; kvSoft?: number; kvHard?: number; saveDisabled?: boolean;
}) {
  const kb = Math.round((configBytes ?? 0) / 1024);
  const soft = (kvSoft ?? 700 * 1024);
  const hard = (kvHard ?? 950 * 1024);
  const bytes = configBytes ?? 0;
  const chipColor = bytes > hard ? T.error : bytes > soft ? "#D4960A" : T.success;
  const chipBg = bytes > hard ? `${T.error}12` : bytes > soft ? "#D4960A12" : `${T.success}12`;
  return (
    <div style={{ height: 64, borderBottom: `1px solid ${T.border}`, background: T.surface, display: "flex", alignItems: "center", padding: "0 24px", gap: 16, flexShrink: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3, flexShrink: 0 }}>
        <img src="/logos/nexi-logo-dark.svg" alt="NEXI" style={{ height: 22, width: "auto", display: "block" }} />
        <img src="/logos/powered-by-trueomni-dark.svg" alt="Powered by TrueOmni" style={{ height: 8, width: "auto", display: "block", opacity: 0.8 }} />
      </div>

      <ClientsDropdown configs={configs} currentSlug={currentSlug} onSelect={onSelectClient} onNew={onNew} onSelectPreset={onSelectPreset} onDuplicate={onDuplicate} onExportJson={onExportJson} onImportJson={onImportJson} />

      {!disabled && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <input value={brandName ?? ""} onChange={(e) => onBrandNameChange?.(e.target.value)} placeholder="Hotel name"
            style={{ background: "transparent", border: "none", outline: "none", fontFamily: T.fontDisplay, fontSize: 17, fontWeight: 700, color: T.text, letterSpacing: "-0.01em", minWidth: 0, flex: 1, padding: 0 }} />
          {dirty && (
            <div style={{ fontSize: 10, color: "#D4960A", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4960A" }} />
              Unsaved changes
            </div>
          )}
        </div>
      )}
      {disabled && <div style={{ flex: 1 }} />}

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {!disabled && (
          <>
            {onUndo && onRedo && (
              <div style={{ display: "flex", gap: 2, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 7, padding: 2, flexShrink: 0 }}>
                <button
                  onClick={onUndo}
                  disabled={!canUndo}
                  title="Undo (⌘Z)"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 28, height: 28, borderRadius: 5, border: "none",
                    background: "transparent",
                    color: canUndo ? T.textDim : T.textMuted,
                    cursor: canUndo ? "pointer" : "not-allowed",
                    opacity: canUndo ? 1 : 0.4,
                    transition: "all 120ms",
                  }}
                  onMouseEnter={(e) => { if (canUndo) { e.currentTarget.style.background = `${T.accent}14`; e.currentTarget.style.color = T.accent; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = canUndo ? T.textDim : T.textMuted; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 00-15-6.7L3 13" /></svg>
                </button>
                <button
                  onClick={onRedo}
                  disabled={!canRedo}
                  title="Redo (⌘⇧Z)"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 28, height: 28, borderRadius: 5, border: "none",
                    background: "transparent",
                    color: canRedo ? T.textDim : T.textMuted,
                    cursor: canRedo ? "pointer" : "not-allowed",
                    opacity: canRedo ? 1 : 0.4,
                    transition: "all 120ms",
                  }}
                  onMouseEnter={(e) => { if (canRedo) { e.currentTarget.style.background = `${T.accent}14`; e.currentTarget.style.color = T.accent; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = canRedo ? T.textDim : T.textMuted; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0115-6.7L21 13" /></svg>
                </button>
              </div>
            )}
            <div
              title={`${kb} KB used of 1 MB KV limit`}
              style={{ padding: "5px 10px", borderRadius: 6, background: chipBg, border: `1px solid ${chipColor}33`, color: chipColor, fontSize: 10, fontWeight: 700, fontFamily: "ui-monospace, monospace", letterSpacing: 0.3, flexShrink: 0 }}
            >
              {kb} KB
            </div>
            <SaveStatus state={saveState} />
            <button onClick={onCopy} style={tbBtn}>Copy link</button>
            <button onClick={onOpen} style={{ ...tbBtn, display: "flex", alignItems: "center", gap: 6 }}>
              Open kiosk
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M7 7h10v10" /></svg>
            </button>
            <button onClick={onDelete} style={{ ...tbBtn, color: T.error }}>Delete</button>
            <button
              onClick={onSave}
              title={saveDisabled ? "Click to see what needs fixing" : dirty ? "Cmd+S" : "No changes"}
              style={{
                padding: "9px 20px", borderRadius: 8, fontSize: 12, fontWeight: 700, fontFamily: T.fontBody,
                cursor: "pointer",
                background: saveDisabled ? "#D4960A" : T.accent,
                border: `1px solid ${saveDisabled ? "#D4960A" : T.accent}`,
                color: "#fff",
                boxShadow: dirty ? `0 0 0 3px ${saveDisabled ? "#D4960A22" : T.accent + "22"}, 0 4px 14px rgba(0,0,0,0.1)` : `0 4px 14px rgba(0,0,0,0.1)`,
                opacity: !dirty && !saveDisabled ? 0.85 : 1,
                transition: "all 150ms",
              }}
            >
              {saveState === "saving" ? "Saving…" : saveDisabled ? "⚠ Save" : dirty ? "Save changes" : "Save"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
