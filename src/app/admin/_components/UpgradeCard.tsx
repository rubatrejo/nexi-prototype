"use client";

import { useState } from "react";
import type { UpgradeOption } from "@/lib/hotel-config";
import { T } from "../_lib/tokens";
import { SPEC_HERO } from "../_lib/specs";
import DroppableImage from "./DroppableImage";
import GalleryStrip from "./GalleryStrip";

export default function UpgradeCard({ upgrade, onChange, onRemove }: { upgrade: UpgradeOption; onChange: (p: Partial<UpgradeOption>) => void; onRemove: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: "flex", gap: 14, padding: 14, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, position: "relative" }}>
      <DroppableImage value={upgrade.image} onChange={(v) => onChange({ image: v })} spec={SPEC_HERO} empty="Main photo" />
      <div style={{ flex: 1, display: "grid", gap: 8, minWidth: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
          <input style={{ background: "transparent", border: "none", outline: "none", fontFamily: T.fontDisplay, fontSize: 17, fontWeight: 800, color: T.text, padding: 0, letterSpacing: "-0.01em" }} value={upgrade.title} onChange={(e) => onChange({ title: e.target.value })} />
          <input style={{ width: 110, background: "transparent", border: "none", outline: "none", color: T.accent, fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 20, textAlign: "right", letterSpacing: "-0.01em" }} value={upgrade.price} onChange={(e) => onChange({ price: e.target.value })} />
        </div>
        <input style={{ background: "transparent", border: "none", outline: "none", fontSize: 12, color: T.textDim, padding: 0, width: "100%" }} value={upgrade.description} onChange={(e) => onChange({ description: e.target.value })} placeholder="Short description" />
        <GalleryStrip gallery={upgrade.gallery ?? []} onChange={(next) => onChange({ gallery: next })} />
      </div>
      {hover && (
        <button onClick={onRemove} style={{ position: "absolute", top: 10, right: 10, width: 26, height: 26, borderRadius: 7, background: T.surface, border: `1px solid ${T.border}`, color: T.error, cursor: "pointer", fontSize: 14, lineHeight: 1 }}>×</button>
      )}
    </div>
  );
}
