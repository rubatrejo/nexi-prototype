"use client";

import { useEffect } from "react";
import { T } from "../_lib/tokens";

export default function ImageZoomModal({ src, label, spec, onClose, onReplace, onRemove }: {
  src: string;
  label: string;
  spec: string;
  onClose: () => void;
  onReplace: () => void;
  onRemove: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1100,
        background: "rgba(15, 15, 20, 0.55)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "48px 64px",
        animation: "toastBackdropIn 180ms ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex", flexDirection: "column", gap: 16,
          maxWidth: "90vw", maxHeight: "90vh",
          animation: "toastCardIn 240ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: T.fontDisplay, fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>{label}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{spec}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={onReplace}
              style={{ padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, fontFamily: T.fontBody, cursor: "pointer", background: "#fff", border: "1px solid rgba(255,255,255,0.2)", color: T.text }}
            >Replace</button>
            <button
              onClick={onRemove}
              style={{ padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, fontFamily: T.fontBody, cursor: "pointer", background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "#fff" }}
            >Remove</button>
            <button
              onClick={onClose}
              title="Close (Esc)"
              style={{ width: 36, height: 36, borderRadius: 8, background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 0 }}
            >×</button>
          </div>
        </div>
        {/* Image */}
        <div style={{
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14, padding: 8,
          boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
          overflow: "hidden",
        }}>
          <img src={src} alt={label} style={{ display: "block", maxWidth: "100%", maxHeight: "72vh", borderRadius: 8, objectFit: "contain" }} />
        </div>
      </div>
    </div>
  );
}
