import { hotelConfig as defaultConfig, type HotelConfig } from "@/lib/hotel-config";

// "Quick start" templates the user can pick from the empty state or
// the clients dropdown. Only the signature fields (brand, primary
// colour, hero images) are stored — everything else inherits from the
// canonical defaultConfig so when defaults gain new fields, presets
// pick them up automatically.
export type Preset = {
  key: string;
  label: string;
  tag: string;
  hero: string;
  primary: string;
  template?: {
    brand?: Partial<HotelConfig["brand"]>;
    colors?: { primary?: string; primaryHover?: string };
    images?: Partial<HotelConfig["images"]>;
  };
};

export const PRESETS: Preset[] = [
  {
    key: "hilton", label: "Hilton Miami", tag: "Urban luxury",
    hero: "/images/unsplash/photo-1551882547-ff40c63fe5fa.jpg",
    primary: "#1B4F9E",
    template: {
      brand: { name: "Hilton Miami Downtown", tagline: "Oceanfront Luxury" },
      colors: { primary: "#1B4F9E", primaryHover: "#143C78" },
      images: { heroExterior: "/images/unsplash/photo-1551882547-ff40c63fe5fa.jpg", heroLobby: "/images/unsplash/photo-1564501049412-61c2a3083791.jpg" },
    },
  },
  {
    key: "marriott", label: "Marriott Grand", tag: "Classic hospitality",
    hero: "/images/unsplash/photo-1611892440504-42a792e24d32.jpg",
    primary: "#A81E26",
    template: {
      brand: { name: "Marriott Grand Plaza", tagline: "Where business meets comfort" },
      colors: { primary: "#A81E26", primaryHover: "#7D161C" },
      images: { heroExterior: "/images/unsplash/photo-1582719478250-c89cae4dc85b.jpg", heroLobby: "/images/unsplash/photo-1611892440504-42a792e24d32.jpg" },
    },
  },
  {
    key: "boutique", label: "Boutique Coast", tag: "Small & intentional",
    hero: "/images/unsplash/photo-1566073771259-6a8506099945.jpg",
    primary: "#B8885E",
    template: {
      brand: { name: "Coastal Haven Boutique", tagline: "Intimate. Considered. Yours." },
      colors: { primary: "#B8885E", primaryHover: "#8F6642" },
      images: { heroExterior: "/images/unsplash/photo-1566073771259-6a8506099945.jpg", heroLobby: "/images/unsplash/photo-1542314831-068cd1dbfeeb.jpg" },
    },
  },
];

export function applyPreset(preset: Preset): HotelConfig {
  const base = structuredClone(defaultConfig);
  const t = preset.template ?? {};
  if (t.brand) base.brand = { ...base.brand, ...t.brand };
  if (t.colors?.primary) base.colors.primary = t.colors.primary;
  if (t.colors?.primaryHover) base.colors.primaryHover = t.colors.primaryHover;
  if (t.images) base.images = { ...base.images, ...t.images };
  base.slug = `${preset.key}-${Date.now().toString(36).slice(-4)}`;
  return base;
}
