"use client";

import { useEffect, useRef, useState } from "react";
import type { HotelConfig } from "@/lib/hotel-config";
import { T } from "../_lib/tokens";
import { type Preset, PRESETS } from "../_lib/presets";

export default function ClientsDropdown({ configs, currentSlug, onSelect, onNew, onSelectPreset, onDuplicate, onExportJson, onImportJson }: {
  configs: HotelConfig[]; currentSlug: string | null; onSelect: (c: HotelConfig) => void; onNew: () => void;
  onSelectPreset?: (p: Preset) => void;
  onDuplicate?: () => void;
  onExportJson?: () => void;
  onImportJson?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  // Reset query + autofocus search whenever the dropdown opens.
  useEffect(() => {
    if (!open) { setQuery(""); return; }
    const t = setTimeout(() => searchRef.current?.focus(), 20);
    return () => clearTimeout(t);
  }, [open]);

  const currentLabel = currentSlug ? configs.find((c) => c.slug === currentSlug)?.brand.name ?? "Unsaved" : "Select client…";

  // Case-insensitive substring match against brand.name and slug for
  // clients, and label/tag for presets. Empty query shows everything.
  const q = query.trim().toLowerCase();
  const filteredConfigs = q
    ? configs.filter((cfg) => cfg.brand.name.toLowerCase().includes(q) || cfg.slug.toLowerCase().includes(q))
    : configs;
  const filteredPresets = q
    ? PRESETS.filter((p) => p.label.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q) || p.key.toLowerCase().includes(q))
    : PRESETS;
  const noResults = q !== "" && filteredConfigs.length === 0 && filteredPresets.length === 0;

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button onClick={() => setOpen((v) => !v)} style={{
        display: "flex", alignItems: "center", gap: 8, height: 38, padding: "0 12px 0 10px", borderRadius: 8,
        background: T.surface, border: `1px solid ${open ? T.accent : T.border}`, color: T.text, cursor: "pointer",
        fontFamily: T.fontBody, fontSize: 12, fontWeight: 600, minWidth: 200, maxWidth: 260,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 7h18M3 12h18M3 17h18" /></svg>
        <span style={{ flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentLabel}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 150ms" }}><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: 44, left: 0, minWidth: 320, background: T.surface,
          border: `1px solid ${T.border}`, borderRadius: 10, boxShadow: "0 16px 50px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.04)",
          padding: 6, zIndex: 50, maxHeight: 460, display: "flex", flexDirection: "column",
        }}>
          {/* Search input — sticky header so it's always visible while scrolling the list */}
          <div style={{ padding: "4px 4px 6px", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: T.surfaceHi, border: `1px solid ${T.border}`, borderRadius: 7 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Escape") { e.stopPropagation(); if (query) setQuery(""); else setOpen(false); } }}
                placeholder="Search clients or templates…"
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 12, fontFamily: T.fontBody, color: T.text, padding: 0, minWidth: 0 }}
              />
              {query && (
                <button onClick={() => { setQuery(""); searchRef.current?.focus(); }} title="Clear search" style={{ background: "transparent", border: "none", padding: 2, cursor: "pointer", color: T.textMuted, display: "flex" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          </div>

          <div style={{ overflow: "auto", flex: 1, minHeight: 0 }}>
            <div style={{ padding: "6px 10px 4px", fontSize: 9, fontWeight: 700, color: T.textMuted, letterSpacing: 1.2, textTransform: "uppercase" }}>
              {configs.length === 0 ? "No saved clients" : q ? `${filteredConfigs.length} of ${configs.length} saved` : `${configs.length} saved`}
            </div>
            {filteredConfigs.map((cfg) => {
              const active = cfg.slug === currentSlug;
              return (
                <button key={cfg.slug} onClick={() => { onSelect(cfg); setOpen(false); }} style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 10px", borderRadius: 7,
                  border: "none", background: active ? `${T.accent}18` : "transparent", color: T.text, cursor: "pointer", textAlign: "left",
                }}>
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: cfg.colors.primary, flexShrink: 0 }} />
                  <div style={{ overflow: "hidden", flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.text, fontFamily: T.fontDisplay, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cfg.brand.name}</div>
                    <div style={{ fontSize: 10, color: T.textMuted, fontFamily: "ui-monospace, monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cfg.slug}</div>
                  </div>
                  {active && <div style={{ fontSize: 10, color: T.accent, fontWeight: 700 }}>●</div>}
                </button>
              );
            })}
            {onSelectPreset && filteredPresets.length > 0 && (
              <>
                <div style={{ height: 1, background: T.border, margin: "6px 4px" }} />
                <div style={{ padding: "6px 10px 4px", fontSize: 9, fontWeight: 700, color: T.textMuted, letterSpacing: 1.2, textTransform: "uppercase" }}>
                  Templates
                </div>
                {filteredPresets.map((p) => (
                  <button key={p.key} onClick={() => { onSelectPreset(p); setOpen(false); }} style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 10px", borderRadius: 7,
                    border: "none", background: "transparent", color: T.text, cursor: "pointer", textAlign: "left",
                  }}>
                    <div style={{ width: 26, height: 26, borderRadius: 6, background: p.primary, flexShrink: 0 }} />
                    <div style={{ overflow: "hidden", flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: T.text, fontFamily: T.fontDisplay, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.label}</div>
                      <div style={{ fontSize: 10, color: T.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.tag}</div>
                    </div>
                  </button>
                ))}
              </>
            )}
            {noResults && (
              <div style={{ padding: "18px 12px", textAlign: "center", fontSize: 11, color: T.textMuted }}>
                No matches for <strong style={{ color: T.text, fontWeight: 700 }}>“{query}”</strong>
              </div>
            )}
          </div>

          <div style={{ height: 1, background: T.border, margin: "6px 4px", flexShrink: 0 }} />
          {onDuplicate && currentSlug && (
            <button onClick={() => { onDuplicate(); setOpen(false); }} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 10px", borderRadius: 7,
              border: "none", background: "transparent", color: T.text, cursor: "pointer", textAlign: "left",
              fontFamily: T.fontBody, fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>
              <div style={{ width: 26, height: 26, borderRadius: 6, background: T.surfaceHi, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.border}` }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
              </div>
              Duplicate current client
            </button>
          )}
          {onExportJson && currentSlug && (
            <button onClick={() => { onExportJson(); setOpen(false); }} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 10px", borderRadius: 7,
              border: "none", background: "transparent", color: T.text, cursor: "pointer", textAlign: "left",
              fontFamily: T.fontBody, fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>
              <div style={{ width: 26, height: 26, borderRadius: 6, background: T.surfaceHi, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.border}` }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
              </div>
              Export as JSON
            </button>
          )}
          {onImportJson && (
            <button onClick={() => { onImportJson(); setOpen(false); }} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 10px", borderRadius: 7,
              border: "none", background: "transparent", color: T.text, cursor: "pointer", textAlign: "left",
              fontFamily: T.fontBody, fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>
              <div style={{ width: 26, height: 26, borderRadius: 6, background: T.surfaceHi, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.border}` }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
              </div>
              Import from JSON
            </button>
          )}
          <button onClick={() => { onNew(); setOpen(false); }} style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 10px", borderRadius: 7,
            border: "none", background: "transparent", color: T.accent, cursor: "pointer", textAlign: "left",
            fontFamily: T.fontBody, fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}>
            <div style={{ width: 26, height: 26, borderRadius: 6, background: `${T.accent}22`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.accent}44` }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            </div>
            Blank — start from scratch
          </button>
        </div>
      )}
    </div>
  );
}
