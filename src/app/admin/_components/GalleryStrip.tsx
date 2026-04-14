"use client";

import { useRef, useState } from "react";
import { T } from "../_lib/tokens";
import { type UploadSpec, SPEC_HERO, formatBytes, readFileAsDataURL } from "../_lib/specs";

export default function GalleryStrip({ gallery, onChange, spec = SPEC_HERO }: { gallery: string[]; onChange: (next: string[]) => void; spec?: UploadSpec }) {
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const handleFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files);
    const next: string[] = [...gallery];
    for (const f of arr) {
      if (!f.type.startsWith("image/")) continue;
      if (f.size > spec.maxBytes) continue;
      try { next.push(await readFileAsDataURL(f)); } catch {}
    }
    onChange(next);
  };
  const removeAt = (i: number) => onChange(gallery.filter((_, idx) => idx !== i));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <div style={{ fontSize: 9, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: 0.8 }}>Gallery ({gallery.length})</div>
        <div style={{ fontSize: 9, color: T.textMuted }}>Drop multiple · {spec.formats} · max {formatBytes(spec.maxBytes)}</div>
      </div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files); }}
        style={{
          display: "flex", flexWrap: "wrap", gap: 6, padding: 6, borderRadius: 8,
          background: dragOver ? `${T.accent}10` : T.bg,
          border: `1.5px dashed ${dragOver ? T.accent : T.border}`,
          minHeight: 58,
          transition: "all 120ms",
        }}
      >
        <input ref={fileRef} type="file" accept={spec.accept} multiple style={{ display: "none" }} onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.currentTarget.value = ""; }} />
        {gallery.map((src, i) => (
          <div key={i} style={{ position: "relative", width: 46, height: 46, borderRadius: 6, background: `url('${src}') center/cover, ${T.surfaceHi}`, border: `1px solid ${T.border}` }}>
            <button
              onClick={(e) => { e.stopPropagation(); removeAt(i); }}
              title="Remove"
              style={{ position: "absolute", top: -5, right: -5, width: 16, height: 16, borderRadius: "50%", background: T.surface, border: `1px solid ${T.border}`, color: T.error, cursor: "pointer", fontSize: 10, lineHeight: 1, padding: 0 }}
            >×</button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          style={{ width: 46, height: 46, borderRadius: 6, background: "transparent", border: `1px dashed ${T.borderHi}`, color: T.textMuted, cursor: "pointer", fontSize: 18, fontWeight: 400, padding: 0 }}
        >+</button>
      </div>
    </div>
  );
}
