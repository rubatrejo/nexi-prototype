"use client";

import { useState } from "react";
import type { RoomType } from "@/lib/hotel-config";
import { T } from "../_lib/tokens";
import { SPEC_HERO } from "../_lib/specs";
import DroppableImage from "./DroppableImage";
import GalleryStrip from "./GalleryStrip";

export default function RoomCard({ room, onChange, onRemove }: { room: RoomType; onChange: (p: Partial<RoomType>) => void; onRemove: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: "flex", gap: 14, padding: 14, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, position: "relative" }}>
      <DroppableImage value={room.image} onChange={(v) => onChange({ image: v })} spec={SPEC_HERO} empty="Main photo" />
      <div style={{ flex: 1, display: "grid", gap: 8, minWidth: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
          <input style={{ background: "transparent", border: "none", outline: "none", fontFamily: T.fontDisplay, fontSize: 17, fontWeight: 800, color: T.text, padding: 0, letterSpacing: "-0.01em" }} value={room.name} onChange={(e) => onChange({ name: e.target.value })} />
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, color: T.accent, fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 20, letterSpacing: "-0.01em" }}>
            <span style={{ fontSize: 13, color: T.textMuted }}>$</span>
            <input type="number" value={room.baseRate} onChange={(e) => onChange({ baseRate: Number(e.target.value) })} style={{ width: 62, background: "transparent", border: "none", outline: "none", color: T.accent, fontFamily: "inherit", fontWeight: 800, fontSize: 20, textAlign: "right" }} />
            <span style={{ fontSize: 10, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>/ night</span>
          </div>
        </div>
        <input style={{ background: "transparent", border: "none", outline: "none", fontSize: 12, color: T.textDim, padding: 0, width: "100%" }} value={room.description} onChange={(e) => onChange({ description: e.target.value })} placeholder="Short description" />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "5px 9px", fontSize: 11, color: T.textDim, outline: "none", width: 100 }} value={room.bedType} onChange={(e) => onChange({ bedType: e.target.value })} placeholder="Bed" />
          <input type="number" style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "5px 9px", fontSize: 11, color: T.textDim, outline: "none", width: 80 }} value={room.sizeSqFt} onChange={(e) => onChange({ sizeSqFt: Number(e.target.value) })} placeholder="sq ft" />
          <input type="number" style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "5px 9px", fontSize: 11, color: T.textDim, outline: "none", width: 60 }} value={room.maxGuests} onChange={(e) => onChange({ maxGuests: Number(e.target.value) })} placeholder="max" />
          <input style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "5px 9px", fontSize: 11, color: T.textDim, outline: "none", flex: 1 }} value={room.tag ?? ""} onChange={(e) => onChange({ tag: e.target.value })} placeholder="Tag (e.g. Best Value)" />
        </div>
        <GalleryStrip gallery={room.gallery ?? []} onChange={(next) => onChange({ gallery: next })} />
      </div>
      {hover && (
        <button onClick={onRemove} style={{ position: "absolute", top: 10, right: 10, width: 26, height: 26, borderRadius: 7, background: T.surface, border: `1px solid ${T.border}`, color: T.error, cursor: "pointer", fontSize: 14, lineHeight: 1 }}>×</button>
      )}
    </div>
  );
}
