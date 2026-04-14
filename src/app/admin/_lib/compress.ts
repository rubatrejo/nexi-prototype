import type { HotelConfig } from "@/lib/hotel-config";

type HotelImages = HotelConfig["images"];

/**
 * Recompress a data URL image to a smaller JPEG. Used by the
 * "auto-compress on save" path so configs don't blow past Upstash's
 * 1 MB per-value cap when the user uploads high-res photos. Falls
 * back to the original string if anything fails (non-data URL,
 * canvas tainted, etc.) so compression never loses data.
 */
export async function compressDataUrl(dataUrl: string, maxWidth = 1280, quality = 0.8): Promise<string> {
  if (!dataUrl.startsWith("data:image/")) return dataUrl;
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = dataUrl;
    });
    const scale = Math.min(1, maxWidth / img.naturalWidth);
    const w = Math.round(img.naturalWidth * scale);
    const h = Math.round(img.naturalHeight * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, w, h);
    const next = canvas.toDataURL("image/jpeg", quality);
    // Only adopt if the recompressed version is actually smaller.
    return next.length < dataUrl.length ? next : dataUrl;
  } catch {
    return dataUrl;
  }
}

/**
 * Walk a HotelConfig and recompress every large data-URL image in
 * known slots: hero images, rooms (main + gallery), upgrades (main +
 * gallery), ads, and the hero exterior slideshow. Custom-font sources
 * are left alone. Logo / icon fields are preserved at higher quality
 * since they're typically already small SVGs. Returns a new config.
 */
export async function compressConfigImages(cfg: HotelConfig): Promise<HotelConfig> {
  const next = structuredClone(cfg);
  const keys: (keyof HotelImages)[] = [
    "heroExterior", "heroLobby", "heroPool", "heroSpa", "heroRestaurant",
    "heroWelcome", "heroSuccess", "heroKey", "heroNight", "heroBooking", "heroLoading", "heroEvents",
  ];
  for (const k of keys) {
    const v = (next.images as Record<string, unknown>)[k];
    if (typeof v === "string") (next.images as Record<string, unknown>)[k] = await compressDataUrl(v);
  }
  // Rooms: main image + gallery
  if (next.rooms) {
    for (const room of next.rooms) {
      if (room.image) room.image = await compressDataUrl(room.image);
      if (room.gallery) {
        for (let i = 0; i < room.gallery.length; i++) {
          room.gallery[i] = await compressDataUrl(room.gallery[i]);
        }
      }
    }
  }
  // Upgrades: main + gallery
  if (next.upgrades) {
    for (const up of next.upgrades) {
      if (up.image) up.image = await compressDataUrl(up.image);
      if (up.gallery) {
        for (let i = 0; i < up.gallery.length; i++) {
          up.gallery[i] = await compressDataUrl(up.gallery[i]);
        }
      }
    }
  }
  // Ads: main image
  if (next.ads?.items) {
    for (const ad of next.ads.items) {
      if (ad.image) ad.image = await compressDataUrl(ad.image);
    }
  }
  // Hero exterior slideshow / video poster
  if (next.images.heroExteriorAsset?.kind === "slideshow") {
    const imgs = next.images.heroExteriorAsset.images;
    for (let i = 0; i < imgs.length; i++) imgs[i] = await compressDataUrl(imgs[i]);
  }
  return next;
}
