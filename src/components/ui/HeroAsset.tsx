"use client";

import { useEffect, useState } from "react";
import type { HeroAsset as HeroAssetType } from "@/lib/hotel-config";

interface Props {
  asset?: HeroAssetType;
  fallbackUrl: string;
  withKenBurns?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Renders a hero background according to the HeroAsset union:
 * - image    → single photo with optional Ken Burns
 * - slideshow → crossfade between N photos, Ken Burns on the active one
 * - video    → autoplay muted loop mp4 (external URL)
 * - gradient → flat linear gradient
 * Falls back to a plain <div background url> rendered from `fallbackUrl`
 * whenever `asset` is undefined or its kind is unrecognized, so legacy
 * configs that only carry the plain `images.heroExterior` string keep
 * working with zero changes.
 */
export default function HeroAsset({ asset, fallbackUrl, withKenBurns, className, style }: Props) {
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    if (asset?.kind !== "slideshow") return;
    if (asset.images.length < 2) return;
    const interval = asset.intervalMs ?? 4500;
    const id = setInterval(() => {
      setSlideIdx((i) => (i + 1) % asset.images.length);
    }, interval);
    return () => clearInterval(id);
  }, [asset]);

  // Reset slide index when the asset changes (e.g., admin toggles a type).
  useEffect(() => {
    setSlideIdx(0);
  }, [asset]);

  const base: React.CSSProperties = { position: "absolute", inset: 0, ...style };
  const kb = withKenBurns ? "kenBurns 20s ease-in-out infinite alternate" : undefined;

  if (asset?.kind === "video") {
    return (
      <video
        src={asset.url}
        poster={asset.poster || fallbackUrl}
        autoPlay
        muted
        loop
        playsInline
        className={className}
        style={{ ...base, width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }

  if (asset?.kind === "slideshow" && asset.images.length > 0) {
    return (
      <div className={className} style={base}>
        {asset.images.map((src, i) => (
          <div
            key={`${i}-${src.slice(0, 32)}`}
            style={{
              position: "absolute",
              inset: 0,
              background: `url('${src}') center/cover`,
              opacity: i === slideIdx ? 1 : 0,
              transition: "opacity 1200ms ease",
              animation: i === slideIdx ? kb : undefined,
            }}
          />
        ))}
      </div>
    );
  }

  if (asset?.kind === "gradient") {
    const angle = asset.angle ?? 180;
    return (
      <div
        className={className}
        style={{ ...base, background: `linear-gradient(${angle}deg, ${asset.from}, ${asset.to})` }}
      />
    );
  }

  // Default: static image from either asset.url or fallbackUrl.
  const url = asset?.kind === "image" ? asset.url : fallbackUrl;
  return (
    <div
      className={className}
      style={{
        ...base,
        background: `url('${url}') center/cover`,
        animation: kb,
      }}
    />
  );
}
