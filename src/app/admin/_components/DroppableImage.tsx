"use client";

import { useRef, useState } from "react";
import { T } from "../_lib/tokens";
import { type UploadSpec, SPEC_HERO, formatBytes, readFileAsDataURL } from "../_lib/specs";

export default function DroppableImage({ value: rawValue, onChange, spec = SPEC_HERO, width = 160, height = 100, empty = "+ Drop image" }: { value: string | undefined; onChange: (v: string) => void; spec?: UploadSpec; width?: number; height?: number; empty?: string }) {
  const value = rawValue ?? "";
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > spec.maxBytes) return;
    try {
      const dataUrl = await readFileAsDataURL(file);
      onChange(dataUrl);
    } catch {}
  };
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
      onClick={() => fileRef.current?.click()}
      title={`Click to upload or drop · ${spec.formats} · max ${formatBytes(spec.maxBytes)}`}
      style={{
        width, height, borderRadius: 9, flexShrink: 0, cursor: "pointer", position: "relative",
        background: value ? `url('${value}') center/cover, ${T.surfaceHi}` : T.surfaceHi,
        border: `${dragOver ? "1.5px dashed " + T.accent : "1px solid " + T.border}`,
        transition: "all 120ms",
        overflow: "hidden",
      }}
    >
      <input ref={fileRef} type="file" accept={spec.accept} style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.currentTarget.value = ""; }} />
      {!value && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: T.textMuted, fontSize: 10, fontWeight: 600, textAlign: "center", padding: 8 }}>
          {empty}
        </div>
      )}
    </div>
  );
}
