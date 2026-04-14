"use client";

import { useRef, useState } from "react";
import type { HotelConfig } from "@/lib/hotel-config";
import { T } from "../_lib/tokens";
import { formatBytes, readFileAsDataURL } from "../_lib/specs";
import { baseInput } from "../_lib/styles";

export default function PoliciesTab({ policies, onPatch, onToastError }: {
  policies: HotelConfig["policies"];
  onPatch: (p: Partial<NonNullable<HotelConfig["policies"]>>) => void;
  onToastError: (msg: string) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const MAX = 3 * 1024 * 1024; // 3 MB
  const handleFile = async (file: File) => {
    const ok = /\.(pdf|docx?)$/i.test(file.name) || /pdf|word|document/.test(file.type);
    if (!ok) { onToastError("Use .pdf or .docx"); return; }
    if (file.size > MAX) { onToastError(`Too large (${formatBytes(file.size)} · max ${formatBytes(MAX)})`); return; }
    try {
      const dataUrl = await readFileAsDataURL(file);
      onPatch({ filename: file.name, mimeType: file.type, dataUrl });
    } catch {
      onToastError("Couldn't read the file");
    }
  };
  const clearFile = () => onPatch({ filename: undefined, mimeType: undefined, dataUrl: undefined });
  const hasFile = !!policies?.dataUrl;

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div>
        <div style={{ fontSize: 9, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Document upload</div>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
          style={{
            display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 10,
            background: dragOver ? `${T.accent}10` : T.surface,
            border: `1.5px dashed ${dragOver ? T.accent : T.borderHi}`,
            transition: "all 120ms",
          }}
        >
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.currentTarget.value = ""; }} />
          <div style={{ width: 44, height: 44, borderRadius: 8, background: `${T.accent}14`, border: `1px solid ${T.accent}28`, color: T.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {hasFile ? (
              <>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, fontFamily: T.fontDisplay, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{policies?.filename ?? "policies"}</div>
                <div style={{ fontSize: 10, color: T.textMuted }}>{Math.round((policies?.dataUrl?.length ?? 0) / 1024)} KB · will be shown on CKI-08 sign-and-accept</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, fontFamily: T.fontDisplay }}>Drop a PDF or Word file</div>
                <div style={{ fontSize: 10, color: T.textMuted }}>or click to choose · .pdf · .doc · .docx · max 3 MB</div>
              </>
            )}
          </div>
          <button type="button" onClick={() => fileRef.current?.click()} style={{ padding: "7px 14px", borderRadius: 7, background: T.accent, color: "#fff", border: `1px solid ${T.accent}`, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
            {hasFile ? "Replace" : "Choose file"}
          </button>
          {hasFile && (
            <button type="button" onClick={clearFile} style={{ padding: "7px 10px", borderRadius: 7, background: "transparent", border: `1px solid ${T.border}`, color: T.error, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Remove</button>
          )}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 9, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Inline text (optional)</div>
        <textarea
          value={policies?.text ?? ""}
          onChange={(e) => onPatch({ text: e.target.value })}
          placeholder="Paste or type the policies text. This is what actually renders inside the kiosk's signature screen. Leave empty to use the default template."
          style={{ ...baseInput, minHeight: 100, fontFamily: T.fontBody, resize: "vertical", lineHeight: 1.5 }}
        />
      </div>
    </div>
  );
}
