"use client";

import * as React from "react";
import { useRef, useState } from "react";
import type { HotelConfig, CustomFont } from "@/lib/hotel-config";
import { T } from "../_lib/tokens";
import { readFileAsDataURL } from "../_lib/specs";
import { baseInput } from "../_lib/styles";
import Field from "./Field";

export default function FontsTab({ config, allFamilies, onPatchFont, onAddFont, onRemoveFont, onToastError }: {
  config: HotelConfig;
  allFamilies: string[];
  onPatchFont: (k: keyof HotelConfig["fonts"], v: string) => void;
  onAddFont: (f: CustomFont) => void;
  onRemoveFont: (family: string) => void;
  onToastError: (msg: string) => void;
}) {
  const [source, setSource] = useState<"google" | "adobe" | "upload">("google");
  const [urlInput, setUrlInput] = useState("");
  const [familyInput, setFamilyInput] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const customFonts = config.customFonts ?? [];

  // Parse the family name out of a Google Fonts CSS URL so users don't
  // have to retype it. Example: family=Playfair+Display:wght@400;700 → "Playfair Display"
  const parseGoogleFamily = (url: string): string | null => {
    const m = url.match(/family=([^&:]+)/);
    if (!m) return null;
    return decodeURIComponent(m[1]).replace(/\+/g, " ");
  };

  const handleUrlChange = (v: string) => {
    setUrlInput(v);
    if (source === "google" && !familyInput) {
      const fam = parseGoogleFamily(v);
      if (fam) setFamilyInput(fam);
    }
  };

  const handleImport = () => {
    if (!familyInput.trim()) { onToastError("Family name required"); return; }
    if (source !== "upload" && !urlInput.trim()) { onToastError("URL required"); return; }
    let url = urlInput.trim();
    if (source === "adobe") {
      // Allow pasting just the kit ID ("xyz1234") in addition to the full URL.
      if (!/^https?:/.test(url) && !/\.css$/.test(url)) {
        url = `https://use.typekit.net/${url}.css`;
      }
    }
    if (source === "google" && !/^https?:\/\/fonts\.googleapis\.com/.test(url)) {
      onToastError("Must be a fonts.googleapis.com URL"); return;
    }
    onAddFont({ family: familyInput.trim(), source, url });
    setUrlInput("");
    setFamilyInput("");
  };

  const handleFile = async (file: File) => {
    const ok = /\.(woff2?|ttf|otf)$/i.test(file.name) || /font/.test(file.type);
    if (!ok) { onToastError("Use .woff2 / .woff / .ttf / .otf"); return; }
    if (file.size > 500 * 1024) { onToastError(`Too large (${Math.round(file.size / 1024)} KB · max 500 KB)`); return; }
    try {
      const dataUrl = await readFileAsDataURL(file);
      const fallbackFamily = familyInput.trim() || file.name.replace(/\.(woff2?|ttf|otf)$/i, "").replace(/[-_]+/g, " ");
      onAddFont({ family: fallbackFamily, source: "upload", url: dataUrl });
      setFamilyInput("");
    } catch {
      onToastError("Couldn't read the font file");
    }
  };

  const sourceBtn = (key: "google" | "adobe" | "upload"): React.CSSProperties => ({
    padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, fontFamily: T.fontBody, cursor: "pointer",
    background: source === key ? T.accent : "transparent",
    color: source === key ? "#fff" : T.textDim,
    border: `1px solid ${source === key ? T.accent : T.border}`,
    letterSpacing: 0.3,
  });

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {/* Display / body selectors */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Display Font">
          <select style={{ ...baseInput }} value={config.fonts.display} onChange={(e) => onPatchFont("display", e.target.value)}>
            {allFamilies.map((f) => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
          </select>
        </Field>
        <Field label="Body Font">
          <select style={{ ...baseInput }} value={config.fonts.body} onChange={(e) => onPatchFont("body", e.target.value)}>
            {allFamilies.map((f) => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
          </select>
        </Field>
      </div>

      {/* Import section */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: 1 }}>Import custom font</div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setSource("google")} style={sourceBtn("google")}>Google</button>
            <button onClick={() => setSource("adobe")} style={sourceBtn("adobe")}>Adobe</button>
            <button onClick={() => setSource("upload")} style={sourceBtn("upload")}>Upload</button>
          </div>
        </div>

        {source !== "upload" ? (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: 8 }}>
            <input
              style={{ ...baseInput, fontFamily: "ui-monospace, monospace", fontSize: 11 }}
              placeholder={source === "google"
                ? "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap"
                : "https://use.typekit.net/xxxxxxx.css  or  xxxxxxx"}
              value={urlInput}
              onChange={(e) => handleUrlChange(e.target.value)}
            />
            <input
              style={baseInput}
              placeholder="Family name"
              value={familyInput}
              onChange={(e) => setFamilyInput(e.target.value)}
            />
            <button onClick={handleImport} style={{ padding: "0 16px", background: T.accent, color: "#fff", border: `1px solid ${T.accent}`, borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Import</button>
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault(); setDragOver(false);
              const file = e.dataTransfer.files?.[0]; if (file) handleFile(file);
            }}
            style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8,
              background: dragOver ? `${T.accent}10` : T.bg,
              border: `1.5px dashed ${dragOver ? T.accent : T.borderHi}`,
              transition: "all 120ms",
            }}
          >
            <input ref={fileRef} type="file" accept=".woff2,.woff,.ttf,.otf,font/woff2,font/woff,font/ttf,font/otf" style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.currentTarget.value = ""; }} />
            <button type="button" onClick={() => fileRef.current?.click()} style={{ padding: "7px 14px", borderRadius: 7, background: T.accent, color: "#fff", border: `1px solid ${T.accent}`, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Choose file</button>
            <input
              style={{ ...baseInput, flex: 1 }}
              placeholder="Family name (auto-filled from filename)"
              value={familyInput}
              onChange={(e) => setFamilyInput(e.target.value)}
            />
            <div style={{ fontSize: 9, color: T.textMuted, whiteSpace: "nowrap" }}>
              .woff2 · .woff · .ttf · .otf · max 500 KB
            </div>
          </div>
        )}
      </div>

      {/* Imported fonts list */}
      {customFonts.length > 0 && (
        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, paddingLeft: 2 }}>
            {customFonts.length} imported
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
            {customFonts.map((f) => (
              <div key={f.family} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: `${T.accent}14`, color: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: f.family, fontSize: 14, fontWeight: 700, flexShrink: 0 }}>Aa</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.text, fontFamily: f.family, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.family}</div>
                  <div style={{ fontSize: 9, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>{f.source}</div>
                </div>
                <button onClick={() => onRemoveFont(f.family)} title="Remove" style={{ width: 22, height: 22, borderRadius: 6, background: "transparent", border: `1px solid ${T.border}`, color: T.error, cursor: "pointer", fontSize: 14, lineHeight: 1, flexShrink: 0 }}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
