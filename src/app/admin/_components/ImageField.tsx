"use client";

import { useRef, useState } from "react";
import { T } from "../_lib/tokens";
import { type UploadSpec, SPEC_DEFAULT, KB, formatBytes, readFileAsDataURL } from "../_lib/specs";
import ImageZoomModal from "./ImageZoomModal";

export default function ImageField({ label, value: rawValue, onChange, compact, spec = SPEC_DEFAULT, hideSpec, thumbSize }: { label: string; value: string | undefined; onChange: (v: string) => void; compact?: boolean; spec?: UploadSpec; hideSpec?: boolean; thumbSize?: number }) {
  const value = rawValue ?? "";
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "warn" | "error"; msg: string } | null>(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setStatus({ kind: "error", msg: "Not an image" });
      return;
    }
    if (file.size > spec.maxBytes) {
      setStatus({ kind: "error", msg: `Too large (${formatBytes(file.size)} · max ${formatBytes(spec.maxBytes)})` });
      return;
    }
    try {
      const dataUrl = await readFileAsDataURL(file);
      onChange(dataUrl);
      if (file.size > spec.warnBytes) {
        setStatus({ kind: "warn", msg: `${formatBytes(file.size)} — over recommended ${formatBytes(spec.warnBytes)}, consider compressing` });
      } else {
        setStatus({ kind: "idle", msg: `${file.name} · ${formatBytes(file.size)}` });
        setTimeout(() => setStatus(null), 2400);
      }
    } catch {
      setStatus({ kind: "error", msg: "Read failed" });
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const isDataUrl = value.startsWith("data:");
  const displayValue = isDataUrl ? `📎 uploaded (${Math.round(value.length / KB)} KB)` : value;
  const specLine = `${spec.formats} · max ${formatBytes(spec.maxBytes)}${spec.ratio ? ` · ${spec.ratio}` : ""}`;
  const size = thumbSize ?? (compact ? 32 : 56);

  // Click opens zoom modal if there's a value; otherwise opens file picker.
  const handleThumbClick = () => {
    if (value) setZoomOpen(true);
    else fileInputRef.current?.click();
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginBottom: 4, minWidth: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: 0.8, flexShrink: 0 }}>{label}</div>
        {!hideSpec && (
          <div style={{ fontSize: 9, color: T.textMuted, fontFamily: T.fontBody, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "right" }} title={specLine}>
            {specLine}
          </div>
        )}
      </div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        style={{
          display: "flex", gap: 8, minWidth: 0, padding: 4, borderRadius: 8,
          background: dragOver ? `${T.accent}10` : "transparent",
          border: `1.5px dashed ${dragOver ? T.accent : "transparent"}`,
          transition: "all 120ms",
        }}
      >
        <button
          type="button"
          onClick={handleThumbClick}
          title={value ? "Click to zoom · drop to replace" : `Click to upload or drop an image here — ${specLine}`}
          style={{
            width: size, height: size, borderRadius: 8,
            background: value ? `url('${value}') center/cover, ${T.surfaceHi}` : T.surfaceHi,
            border: `1px solid ${T.border}`, flexShrink: 0, cursor: "pointer", padding: 0,
            position: "relative", overflow: "hidden",
          }}
        >
          {!value && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: T.textMuted }}>
              <svg width={Math.min(size * 0.35, 22)} height={Math.min(size * 0.35, 22)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
            </div>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept={spec.accept}
          style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.currentTarget.value = ""; }}
        />
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          <input
            type="text"
            value={displayValue}
            onChange={(e) => { if (!isDataUrl) onChange(e.target.value); }}
            readOnly={isDataUrl}
            placeholder="Drop file or paste URL"
            style={{ flex: 1, minWidth: 0, padding: "7px 10px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 7, color: T.text, fontSize: 11, fontFamily: "ui-monospace, monospace", outline: "none", cursor: isDataUrl ? "default" : "text" }}
          />
          {status && (
            <div style={{ fontSize: 9, color: status.kind === "error" ? T.error : status.kind === "warn" ? "#D4960A" : T.textMuted, paddingLeft: 4 }}>
              {status.msg}
            </div>
          )}
        </div>
      </div>
      {zoomOpen && value && (
        <ImageZoomModal
          src={value}
          label={label}
          spec={specLine}
          onClose={() => setZoomOpen(false)}
          onReplace={() => { setZoomOpen(false); fileInputRef.current?.click(); }}
          onRemove={() => { onChange(""); setZoomOpen(false); }}
        />
      )}
    </div>
  );
}
