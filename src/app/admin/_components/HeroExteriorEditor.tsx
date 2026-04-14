import type * as React from "react";
import type { HeroAsset } from "@/lib/hotel-config";
import { T } from "../_lib/tokens";
import { SPEC_HERO } from "../_lib/specs";
import Field from "./Field";
import ColorField from "./ColorField";
import ImageField from "./ImageField";
import GalleryStrip from "./GalleryStrip";

export default function HeroExteriorEditor({ imageUrl, asset, onImageChange, onAssetChange, onToastError: _onToastError }: {
  imageUrl: string;
  asset?: HeroAsset;
  onImageChange: (v: string) => void;
  onAssetChange: (a: HeroAsset | undefined) => void;
  onToastError: (msg: string) => void;
}) {
  // Derive the active kind. When `asset` is undefined, we're in the legacy
  // "just a plain string" path and treat that as the Image tab.
  const activeKind: HeroAsset["kind"] = asset?.kind ?? "image";

  // When the user switches type, seed sensible defaults for the new kind.
  const switchTo = (kind: HeroAsset["kind"]) => {
    if (kind === "image") {
      // Image mode = no asset object, we just use the plain imageUrl string.
      onAssetChange(undefined);
      return;
    }
    if (kind === "slideshow") {
      if (asset?.kind === "slideshow") return;
      // Seed with the current image URL as the first slide so the user
      // sees something familiar before adding more.
      onAssetChange({ kind: "slideshow", images: imageUrl ? [imageUrl] : [], intervalMs: 4500 });
      return;
    }
    if (kind === "video") {
      if (asset?.kind === "video") return;
      onAssetChange({ kind: "video", url: "", poster: imageUrl });
      return;
    }
    if (kind === "gradient") {
      if (asset?.kind === "gradient") return;
      onAssetChange({ kind: "gradient", from: "#0F172A", to: "#1288FF", angle: 180 });
      return;
    }
  };

  const pill = (kind: HeroAsset["kind"], _label: string): React.CSSProperties => ({
    padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, fontFamily: T.fontBody, cursor: "pointer",
    background: activeKind === kind ? T.accent : "transparent",
    color: activeKind === kind ? "#fff" : T.textDim,
    border: `1px solid ${activeKind === kind ? T.accent : T.border}`,
    letterSpacing: 0.3,
  });

  // Size warning for slideshow
  const slideshowBytes = asset?.kind === "slideshow"
    ? asset.images.reduce((sum, s) => sum + (s?.length ?? 0), 0)
    : 0;
  const slideshowWarn = slideshowBytes > 600 * 1024;

  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, gap: 8 }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>
            Hero Exterior (idle / attract)
          </div>
          <div style={{ fontSize: 10, color: T.textMuted, marginTop: 2 }}>
            Used by IDL-01, ONB-02 and CKI-08. Pick a type below to switch the renderer.
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => switchTo("image")}     style={pill("image", "Image")}>Image</button>
          <button onClick={() => switchTo("slideshow")} style={pill("slideshow", "Slideshow")}>Slideshow</button>
          <button onClick={() => switchTo("video")}     style={pill("video", "Video")}>Video</button>
          <button onClick={() => switchTo("gradient")}  style={pill("gradient", "Gradient")}>Gradient</button>
        </div>
      </div>

      {activeKind === "image" && (
        <ImageField
          label="Image URL or upload"
          value={imageUrl}
          onChange={onImageChange}
          spec={SPEC_HERO}
          thumbSize={88}
        />
      )}

      {activeKind === "slideshow" && asset?.kind === "slideshow" && (
        <div style={{ display: "grid", gap: 8 }}>
          <GalleryStrip
            gallery={asset.images}
            onChange={(next) => onAssetChange({ ...asset, images: next })}
            spec={SPEC_HERO}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 10, color: T.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, flexShrink: 0 }}>
              Interval: {Math.round((asset.intervalMs ?? 4500) / 100) / 10}s
            </div>
            <input
              type="range"
              min={2000}
              max={10000}
              step={500}
              value={asset.intervalMs ?? 4500}
              onChange={(e) => onAssetChange({ ...asset, intervalMs: Number(e.target.value) })}
              style={{ flex: 1, accentColor: T.accent }}
            />
          </div>
          <div style={{ fontSize: 10, color: slideshowWarn ? "#D4960A" : T.textMuted }}>
            {slideshowWarn
              ? `⚠ Slideshow is ${Math.round(slideshowBytes / 1024)} KB — close to the 1 MB KV limit. Consider fewer or smaller photos.`
              : `Total size: ${Math.round(slideshowBytes / 1024)} KB`}
          </div>
        </div>
      )}

      {activeKind === "video" && asset?.kind === "video" && (
        <div style={{ display: "grid", gap: 10 }}>
          <Field label="Video URL (mp4 / webm, hosted externally)">
            <input
              type="url"
              value={asset.url}
              onChange={(e) => onAssetChange({ ...asset, url: e.target.value })}
              placeholder="https://storage.googleapis.com/.../attract.mp4"
              style={{ width: "100%", padding: "7px 10px", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 7, color: T.text, fontSize: 12, fontFamily: "ui-monospace, monospace", outline: "none" }}
            />
          </Field>
          <ImageField
            label="Poster (shown while video loads)"
            value={asset.poster ?? ""}
            onChange={(v) => onAssetChange({ ...asset, poster: v })}
            spec={SPEC_HERO}
            thumbSize={64}
          />
          <div style={{ fontSize: 10, color: T.textMuted, lineHeight: 1.5 }}>
            Direct video URL only — Vimeo / Mux / Cloudinary / any public mp4.
            Autoplay muted loop on the kiosk. YouTube links will not work.
          </div>
        </div>
      )}

      {activeKind === "gradient" && asset?.kind === "gradient" && (
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <ColorField label="From" value={asset.from} onChange={(v) => onAssetChange({ ...asset, from: v })} />
            <ColorField label="To" value={asset.to} onChange={(v) => onAssetChange({ ...asset, to: v })} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 10, color: T.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, flexShrink: 0 }}>
              Angle: {asset.angle ?? 180}°
            </div>
            <input
              type="range"
              min={0}
              max={360}
              step={5}
              value={asset.angle ?? 180}
              onChange={(e) => onAssetChange({ ...asset, angle: Number(e.target.value) })}
              style={{ flex: 1, accentColor: T.accent }}
            />
          </div>
          <div
            style={{
              height: 88,
              borderRadius: 8,
              border: `1px solid ${T.border}`,
              background: `linear-gradient(${asset.angle ?? 180}deg, ${asset.from}, ${asset.to})`,
            }}
          />
        </div>
      )}
    </div>
  );
}
