"use client";

/**
 * NEXI CMS — single-page white-label configuration studio.
 * Horizontal tabs layout: topbar + tab bar + (tab content | live preview).
 * Preview is always visible, never scrolls out.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Reorder } from "framer-motion";
import { hotelConfig as defaultConfig } from "@/lib/hotel-config";
import type { HotelConfig, HotelModule, RoomType, UpgradeOption } from "@/lib/hotel-config";

// ─── design tokens (light Nordic, matches kiosk theme) ────────────────
const T = {
  bg: "#F5F5F0",
  surface: "#FFFFFF",
  surfaceHi: "#FAFAF7",
  border: "#E8E8E3",
  borderHi: "#D4D4CF",
  text: "#1A1A1A",
  textDim: "#6B7280",
  textMuted: "#9CA3AF",
  accent: "#1288FF",
  accentHover: "#0B6FD4",
  success: "#16A34A",
  error: "#DC2626",
  fontDisplay: "'Mona Sans', sans-serif",
  fontBody: "'Inter', sans-serif",
};

// ─── inline section icons (stroke 1.6, 24x24 viewBox) ────────────────
const sp = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const ICONS: Record<string, React.ReactNode> = {
  client: <svg {...sp}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  colors: <svg {...sp}><circle cx="13.5" cy="6.5" r="1.5" /><circle cx="17.5" cy="10.5" r="1.5" /><circle cx="8.5" cy="7.5" r="1.5" /><circle cx="6.5" cy="12.5" r="1.5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.6 1.5-1.5 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.6-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-4.9-4.5-8.8-10-8.8z" /></svg>,
  fonts: <svg {...sp}><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /></svg>,
  images: <svg {...sp}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>,
  modules: <svg {...sp}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
  rooms: <svg {...sp}><path d="M2 4v16" /><path d="M22 4v16" /><path d="M2 11h20" /><path d="M2 8h14a4 4 0 014 4v-1" /><path d="M6 11V8" /></svg>,
  upgrades: <svg {...sp}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  info: <svg {...sp}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>,
  timers: <svg {...sp}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  apis: <svg {...sp}><rect x="2" y="9" width="20" height="6" rx="2" /><path d="M6 12h.01M10 12h.01M14 12h.01" /><path d="M18 12h2" /></svg>,
};

const GOOGLE_FONTS = ["Mona Sans", "Inter", "Playfair Display", "Space Grotesk", "DM Sans", "Manrope", "Instrument Serif", "Cormorant Garamond", "Fraunces", "Geist"];

const SECTIONS = [
  { key: "client", num: "01", label: "Client", title: "Client Profile", desc: "Who the client is — identity, logos, internal notes and the slug used to route the kiosk." },
  { key: "colors", num: "02", label: "Colors", title: "Colors", desc: "Primary accent and the light/dark surface palettes." },
  { key: "fonts", num: "03", label: "Typography", title: "Typography", desc: "Google Fonts for display and body across the kiosk." },
  { key: "images", num: "04", label: "Images", title: "Hero Imagery", desc: "Hotel photography used on idle, dashboard and action screens." },
  { key: "modules", num: "05", label: "Modules", title: "Kiosk Modules", desc: "What the guest can access. Pin modules to the dashboard grid." },
  { key: "rooms", num: "06", label: "Rooms", title: "Rooms", desc: "Available room types shown during the booking flow." },
  { key: "upgrades", num: "07", label: "Upgrades", title: "Upgrades & Offers", desc: "Paid extras shown in the dashboard sidebar after check-in." },
  { key: "info", num: "08", label: "Info", title: "Hotel Information", desc: "Operational details the kiosk shows to guests." },
  { key: "timers", num: "09", label: "Timers", title: "Inactivity Timers", desc: "Tune the auto-reset thresholds for your lobby traffic." },
  { key: "apis", num: "10", label: "API Credentials", title: "API Credentials", desc: "Third-party service keys used by this client. Stored privately, never rendered on the kiosk." },
];

// ─── presets: signature fields only, rest inherits from defaultConfig ──
type Preset = {
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
const PRESETS: Preset[] = [
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

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64);
}

function makeBlankConfig(baseSlug: string): HotelConfig {
  return {
    ...structuredClone(defaultConfig),
    slug: baseSlug,
    brand: { ...defaultConfig.brand, name: "New Client Hotel", tagline: "Your Stay, Your Way" },
  };
}

function applyPreset(preset: Preset): HotelConfig {
  const base = structuredClone(defaultConfig);
  const t = preset.template ?? {};
  if (t.brand) base.brand = { ...base.brand, ...t.brand };
  if (t.colors?.primary) base.colors.primary = t.colors.primary;
  if (t.colors?.primaryHover) base.colors.primaryHover = t.colors.primaryHover;
  if (t.images) base.images = { ...base.images, ...t.images };
  base.slug = `${preset.key}-${Date.now().toString(36).slice(-4)}`;
  return base;
}

export default function AdminCMS() {
  const [configs, setConfigs] = useState<HotelConfig[]>([]);
  const [current, setCurrent] = useState<HotelConfig | null>(null);
  const [activeTab, setActiveTab] = useState<string>("client");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [previewKey, setPreviewKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<NodeJS.Timeout | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const flashToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  useEffect(() => {
    fetch("/api/admin/configs").then((r) => r.json()).then((d) => setConfigs(d.configs ?? [])).catch(() => {});
  }, []);

  // ─── live preview: post current config to iframe on every edit ─────
  // Debounced so we don't flood postMessage during rapid typing.
  useEffect(() => {
    if (!current) return;
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    const t = setTimeout(() => {
      try { win.postMessage({ type: "nexi-cms:config-update", config: current }, "*"); } catch {}
    }, 120);
    return () => clearTimeout(t);
  }, [current]);

  // Re-post the config when the iframe finishes loading (handles Save reloads).
  const handleIframeLoad = useCallback(() => {
    if (!current) return;
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    try { win.postMessage({ type: "nexi-cms:config-update", config: current }, "*"); } catch {}
  }, [current]);

  // Listen for the iframe's "ready" announcement and immediately push
  // the current config in response. This handshake eliminates the race
  // where onLoad fires before the iframe's React tree mounts its own
  // message listener.
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      const data = e.data as { type?: string } | null;
      if (!data || data.type !== "nexi-cms:ready") return;
      if (!current) return;
      const win = iframeRef.current?.contentWindow;
      if (!win) return;
      try { win.postMessage({ type: "nexi-cms:config-update", config: current }, "*"); } catch {}
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [current]);

  // ─── patchers ────────────────────────────────────────────────────
  const patch = useCallback(<K extends keyof HotelConfig>(key: K, value: HotelConfig[K]) => {
    setCurrent((c) => (c ? { ...c, [key]: value } : c));
  }, []);
  const patchBrand = useCallback((k: keyof HotelConfig["brand"], v: string) => {
    setCurrent((c) => (c ? { ...c, brand: { ...c.brand, [k]: v } } : c));
  }, []);
  const patchColors = useCallback((path: string, v: string) => {
    setCurrent((c) => {
      if (!c) return c;
      const next = structuredClone(c);
      const parts = path.split(".");
      let obj: Record<string, unknown> = next.colors as unknown as Record<string, unknown>;
      for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]] as Record<string, unknown>;
      obj[parts[parts.length - 1]] = v;
      return next;
    });
  }, []);
  const patchFonts = useCallback((k: keyof HotelConfig["fonts"], v: string) => {
    setCurrent((c) => (c ? { ...c, fonts: { ...c.fonts, [k]: v } } : c));
  }, []);
  const patchImages = useCallback((k: keyof HotelConfig["images"], v: string) => {
    setCurrent((c) => (c ? { ...c, images: { ...c.images, [k]: v as string & string[] } } : c));
  }, []);
  const patchInfo = useCallback((k: keyof HotelConfig["info"], v: string) => {
    setCurrent((c) => (c ? { ...c, info: { ...c.info, [k]: v } } : c));
  }, []);
  const patchIntegrations = useCallback((k: keyof NonNullable<HotelConfig["integrations"]>, v: string) => {
    setCurrent((c) => {
      if (!c) return c;
      const base = c.integrations ?? { heygenApiKey: "", tavusApiKey: "", didApiKey: "", resendApiKey: "" };
      return { ...c, integrations: { ...base, [k]: v } };
    });
  }, []);

  const toggleModule = useCallback((id: string) => {
    setCurrent((c) => c ? { ...c, modules: c.modules.map((m) => m.id === id ? { ...m, enabled: !m.enabled } : m) } : c);
  }, []);
  const toggleModuleDash = useCallback((id: string) => {
    setCurrent((c) => {
      if (!c) return c;
      const onGrid = c.modules.filter((m) => m.dashboardOrder != null).length;
      return { ...c, modules: c.modules.map((m) => m.id === id ? { ...m, dashboardOrder: m.dashboardOrder == null ? onGrid + 1 : undefined } : m) };
    });
  }, []);

  const updateRoom = (i: number, p: Partial<RoomType>) => setCurrent((c) => c ? { ...c, rooms: c.rooms.map((r, idx) => idx === i ? { ...r, ...p } : r) } : c);
  const addRoom = () => setCurrent((c) => c ? { ...c, rooms: [...c.rooms, { id: `room-${Date.now()}`, name: "New Room", description: "", maxGuests: 2, bedType: "King", sizeSqFt: 400, baseRate: 200, currency: "USD", image: defaultConfig.images.roomDeluxe }] } : c);
  const removeRoom = (i: number) => setCurrent((c) => c ? { ...c, rooms: c.rooms.filter((_, idx) => idx !== i) } : c);
  const reorderRooms = (arr: RoomType[]) => setCurrent((c) => c ? { ...c, rooms: arr } : c);

  const updateUpgrade = (i: number, p: Partial<UpgradeOption>) => setCurrent((c) => c ? { ...c, upgrades: c.upgrades.map((u, idx) => idx === i ? { ...u, ...p } : u) } : c);
  const addUpgrade = () => setCurrent((c) => c ? { ...c, upgrades: [...c.upgrades, { id: `upgrade-${Date.now()}`, title: "New Upgrade", description: "", price: "$0", image: defaultConfig.images.heroSpa }] } : c);
  const removeUpgrade = (i: number) => setCurrent((c) => c ? { ...c, upgrades: c.upgrades.filter((_, idx) => idx !== i) } : c);
  const reorderUpgrades = (arr: UpgradeOption[]) => setCurrent((c) => c ? { ...c, upgrades: arr } : c);

  const handleSave = async () => {
    if (!current) return;
    setSaveState("saving");
    try {
      const res = await fetch("/api/admin/configs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(current) });
      if (!res.ok) throw new Error(await res.text());
      setSaveState("saved");
      setPreviewKey((k) => k + 1);
      flashToast(`Saved "${current.slug}"`);
      const list = await fetch("/api/admin/configs").then((r) => r.json());
      setConfigs(list.configs ?? []);
      setTimeout(() => setSaveState("idle"), 2000);
    } catch {
      setSaveState("error");
      flashToast("Save failed");
      setTimeout(() => setSaveState("idle"), 3000);
    }
  };

  const handleDelete = async () => {
    if (!current) return;
    if (!confirm(`Delete "${current.slug}"? This cannot be undone.`)) return;
    try {
      await fetch(`/api/admin/configs/${encodeURIComponent(current.slug)}`, { method: "DELETE" });
      const list = await fetch("/api/admin/configs").then((r) => r.json());
      setConfigs(list.configs ?? []);
      setCurrent(null);
      flashToast(`Deleted "${current.slug}"`);
    } catch {
      flashToast("Delete failed");
    }
  };

  const handleNew = () => { setCurrent(makeBlankConfig(`client-${Date.now().toString(36).slice(-4)}`)); setActiveTab("client"); };
  const handlePreset = (p: Preset) => { setCurrent(applyPreset(p)); setActiveTab("client"); };

  const handleOpenKiosk = () => { if (current?.slug) window.open(`/?client=${encodeURIComponent(current.slug)}`, "_blank"); };
  const handleCopyLink = async () => {
    if (!current?.slug) return;
    const url = `${window.location.origin}/?client=${encodeURIComponent(current.slug)}`;
    await navigator.clipboard.writeText(url);
    flashToast("Link copied");
  };

  const previewUrl = useMemo(
    () => current ? `/?client=${encodeURIComponent(current.slug)}&embed=1&_v=${previewKey}` : "about:blank",
    [current?.slug, previewKey]
  );

  // ─── shared styles ──────────────────────────────────────────────
  const input: React.CSSProperties = {
    width: "100%", padding: "7px 10px", background: T.surface, border: `1px solid ${T.border}`,
    borderRadius: 7, color: T.text, fontSize: 12, fontFamily: T.fontBody, outline: "none",
  };

  // ═══════ EMPTY STATE — preset gallery ═══════
  if (!current) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.fontBody, display: "flex", flexDirection: "column" }}>
        <TopBar saveState="idle" configs={configs} currentSlug={null} onSelectClient={(c) => { setCurrent(structuredClone(c)); setActiveTab("client"); }} onNew={handleNew} onSave={() => {}} onDelete={() => {}} onOpen={() => {}} onCopy={() => {}} disabled />
        <div style={{ flex: 1, overflow: "auto", padding: "48px 40px" }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 18, background: `${T.accent}14`, border: `1px solid ${T.accent}28`, marginBottom: 24, color: T.accent }}>
                <svg {...sp} width={28} height={28}><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M3 9h18M9 21V9" /></svg>
              </div>
              <h1 style={{ fontFamily: T.fontDisplay, fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12, lineHeight: 1.1 }}>
                Configure a client, ship the kiosk.
              </h1>
              <p style={{ fontSize: 15, color: T.textDim, lineHeight: 1.6, maxWidth: 560, margin: "0 auto" }}>
                Start from a template below, or build from scratch. Every kiosk rebrands in real time — no rebuild, no redeploy.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, maxWidth: 1000, margin: "0 auto" }}>
              {PRESETS.map((p) => (
                <button key={p.key} onClick={() => handlePreset(p)} style={{
                  display: "flex", flexDirection: "column", textAlign: "left",
                  background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14,
                  overflow: "hidden", cursor: "pointer", padding: 0,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "all 180ms",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(0,0,0,0.10)"; e.currentTarget.style.borderColor = T.borderHi; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = T.border; }}
                >
                  <div style={{ height: 150, background: `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.35)), url('${p.hero}') center/cover`, position: "relative" }}>
                    <div style={{ position: "absolute", bottom: 12, left: 14, display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 14, height: 14, borderRadius: 4, background: p.primary, boxShadow: "0 0 0 2px rgba(255,255,255,0.9)" }} />
                      <div style={{ color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>Template</div>
                    </div>
                  </div>
                  <div style={{ padding: "16px 18px 18px" }}>
                    <div style={{ fontFamily: T.fontDisplay, fontSize: 17, fontWeight: 800, color: T.text, letterSpacing: "-0.01em", marginBottom: 4 }}>{p.label}</div>
                    <div style={{ fontSize: 12, color: T.textDim }}>{p.tag}</div>
                  </div>
                </button>
              ))}
              <button onClick={handleNew} style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center",
                background: "transparent", border: `1.5px dashed ${T.borderHi}`, borderRadius: 14,
                cursor: "pointer", padding: "24px 16px", minHeight: 240, color: T.textDim,
                transition: "all 180ms",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.borderHi; e.currentTarget.style.color = T.textDim; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 14, border: `1.5px dashed currentColor`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <svg {...sp} width={22} height={22}><path d="M12 5v14M5 12h14" /></svg>
                </div>
                <div style={{ fontFamily: T.fontDisplay, fontSize: 16, fontWeight: 800, color: T.text, marginBottom: 4 }}>Blank</div>
                <div style={{ fontSize: 12, color: T.textDim }}>Start from scratch</div>
              </button>
            </div>
          </div>
        </div>
        {toast && <ToastBar msg={toast} />}
      </div>
    );
  }

  const c = current;
  const activeSection = SECTIONS.find((s) => s.key === activeTab)!;

  return (
    <div style={{ height: "100vh", background: T.bg, color: T.text, fontFamily: T.fontBody, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <TopBar
        brandName={c.brand.name}
        saveState={saveState}
        configs={configs}
        currentSlug={c.slug}
        onSelectClient={(cfg) => { setCurrent(structuredClone(cfg)); setActiveTab("client"); }}
        onSave={handleSave}
        onDelete={handleDelete}
        onOpen={handleOpenKiosk}
        onCopy={handleCopyLink}
        onNew={handleNew}
        onBrandNameChange={(v) => patchBrand("name", v)}
      />

      {/* Tab bar */}
      <div style={{ height: 52, borderBottom: `1px solid ${T.border}`, background: T.surface, display: "flex", alignItems: "center", padding: "0 24px", gap: 2, flexShrink: 0, overflowX: "auto", scrollbarWidth: "none" }}>
        <style>{`.tabs-strip::-webkit-scrollbar{display:none}`}</style>
        <div className="tabs-strip" style={{ display: "flex", gap: 2, height: "100%" }}>
          {SECTIONS.map((s) => {
            const active = s.key === activeTab;
            return (
              <button key={s.key} onClick={() => setActiveTab(s.key)} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "0 16px",
                height: "100%", background: "transparent", border: "none", cursor: "pointer",
                color: active ? T.accent : T.textDim,
                fontSize: 12, fontWeight: active ? 700 : 500, fontFamily: T.fontBody,
                borderBottom: `2px solid ${active ? T.accent : "transparent"}`,
                marginBottom: -1, whiteSpace: "nowrap", transition: "color 120ms",
              }}>
                <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 10, fontWeight: 700, opacity: 0.6 }}>{s.num}</span>
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
        {/* Form panel — top 50% */}
        <div style={{ flex: "0 0 50%", overflow: "auto", padding: "16px 40px 20px", background: T.bg, minHeight: 0 }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <SectionHeader section={activeSection} />

            {activeTab === "client" && (
              <div style={{ display: "grid", gap: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                  <Field label="Hotel / Client Name"><input style={input} value={c.brand.name} onChange={(e) => patchBrand("name", e.target.value)} /></Field>
                  <Field label="Tagline"><input style={input} value={c.brand.tagline} onChange={(e) => patchBrand("tagline", e.target.value)} /></Field>
                  <Field label="Website"><input style={input} type="url" placeholder="https://www.hotel.com" value={c.brand.website ?? ""} onChange={(e) => patchBrand("website", e.target.value)} /></Field>
                  <Field label="Kiosk Slug"><input style={{ ...input, fontFamily: "ui-monospace, monospace" }} placeholder="hotel-slug" value={c.slug} onChange={(e) => patch("slug", slugify(e.target.value))} /></Field>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                  <ImageField label="Logo (light)" value={c.brand.logo} onChange={(v) => patchBrand("logo", v)} compact />
                  <ImageField label="Logo (dark)" value={c.brand.logoWhite} onChange={(v) => patchBrand("logoWhite", v)} compact />
                  <ImageField label="Icon (square)" value={c.brand.icon} onChange={(v) => patchBrand("icon", v)} compact />
                  <ImageField label="Icon (white)" value={c.brand.iconWhite} onChange={(v) => patchBrand("iconWhite", v)} compact />
                </div>
                <Field label="Important Notes (internal)">
                  <textarea
                    style={{ ...input, minHeight: 56, fontFamily: T.fontBody, resize: "none", lineHeight: 1.4, padding: "8px 12px" }}
                    placeholder="Sales context, decision-makers, integration requirements…"
                    value={c.brand.notes ?? ""}
                    onChange={(e) => patchBrand("notes", e.target.value)}
                  />
                </Field>
              </div>
            )}

            {activeTab === "colors" && (
              <div style={{ display: "grid", gap: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                  <ColorField label="Primary" value={c.colors.primary} onChange={(v) => patchColors("primary", v)} />
                  <ColorField label="Primary Hover" value={c.colors.primaryHover} onChange={(v) => patchColors("primaryHover", v)} />
                  <ColorField label="Amber Accent" value={c.colors.amber} onChange={(v) => patchColors("amber", v)} />
                  <ColorField label="Purple Accent" value={c.colors.purple} onChange={(v) => patchColors("purple", v)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <ColorGroup title="Light Mode">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <ColorField label="Background" value={c.colors.light.bg} onChange={(v) => patchColors("light.bg", v)} />
                      <ColorField label="Card" value={c.colors.light.bgCard} onChange={(v) => patchColors("light.bgCard", v)} />
                      <ColorField label="Text" value={c.colors.light.text} onChange={(v) => patchColors("light.text", v)} />
                      <ColorField label="Border" value={c.colors.light.border} onChange={(v) => patchColors("light.border", v)} />
                    </div>
                  </ColorGroup>
                  <ColorGroup title="Dark Mode">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <ColorField label="Background" value={c.colors.dark.bg} onChange={(v) => patchColors("dark.bg", v)} />
                      <ColorField label="Card" value={c.colors.dark.bgCard} onChange={(v) => patchColors("dark.bgCard", v)} />
                      <ColorField label="Text" value={c.colors.dark.text} onChange={(v) => patchColors("dark.text", v)} />
                      <ColorField label="Border" value={c.colors.dark.border} onChange={(v) => patchColors("dark.border", v)} />
                    </div>
                  </ColorGroup>
                </div>
              </div>
            )}

            {activeTab === "fonts" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="Display Font">
                  <select style={input} value={c.fonts.display} onChange={(e) => patchFonts("display", e.target.value)}>
                    {GOOGLE_FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </Field>
                <Field label="Body Font">
                  <select style={input} value={c.fonts.body} onChange={(e) => patchFonts("body", e.target.value)}>
                    {GOOGLE_FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </Field>
              </div>
            )}

            {activeTab === "images" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
                <ImageField label="Hero Exterior (idle)" value={c.images.heroExterior} onChange={(v) => patchImages("heroExterior", v)} compact />
                <ImageField label="Hero Lobby (dashboard)" value={c.images.heroLobby} onChange={(v) => patchImages("heroLobby", v)} compact />
                <ImageField label="Hero Pool" value={c.images.heroPool} onChange={(v) => patchImages("heroPool", v)} compact />
                <ImageField label="Hero Spa" value={c.images.heroSpa} onChange={(v) => patchImages("heroSpa", v)} compact />
                <ImageField label="Hero Restaurant" value={c.images.heroRestaurant} onChange={(v) => patchImages("heroRestaurant", v)} compact />
              </div>
            )}

            {activeTab === "modules" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
                {c.modules.map((m) => (
                  <ModuleCard key={m.id} module={m} onToggle={() => toggleModule(m.id)} onToggleDash={() => toggleModuleDash(m.id)} />
                ))}
              </div>
            )}

            {activeTab === "rooms" && (
              <div>
                <Reorder.Group axis="y" values={c.rooms} onReorder={reorderRooms} style={{ display: "grid", gap: 12, listStyle: "none", padding: 0, margin: 0 }}>
                  {c.rooms.map((r, i) => (
                    <Reorder.Item key={r.id} value={r} style={{ listStyle: "none" }}>
                      <RoomCard room={r} onChange={(p) => updateRoom(i, p)} onRemove={() => removeRoom(i)} />
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
                <button onClick={addRoom} style={addCardBtn}>+ Add room</button>
              </div>
            )}

            {activeTab === "upgrades" && (
              <div>
                <Reorder.Group axis="y" values={c.upgrades} onReorder={reorderUpgrades} style={{ display: "grid", gap: 12, listStyle: "none", padding: 0, margin: 0 }}>
                  {c.upgrades.map((u, i) => (
                    <Reorder.Item key={u.id} value={u} style={{ listStyle: "none" }}>
                      <UpgradeCard upgrade={u} onChange={(p) => updateUpgrade(i, p)} onRemove={() => removeUpgrade(i)} />
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
                <button onClick={addUpgrade} style={addCardBtn}>+ Add upgrade</button>
              </div>
            )}

            {activeTab === "info" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="Address"><input style={input} value={c.info.address} onChange={(e) => patchInfo("address", e.target.value)} /></Field>
                <Field label="Phone"><input style={input} value={c.info.phone} onChange={(e) => patchInfo("phone", e.target.value)} /></Field>
                <Field label="Email"><input style={input} value={c.info.email} onChange={(e) => patchInfo("email", e.target.value)} /></Field>
                <Field label="Check-in / out"><input style={input} value={`${c.info.checkInTime} / ${c.info.checkOutTime}`} readOnly /></Field>
                <Field label="Wi-Fi Network"><input style={input} value={c.info.wifi.networkName} onChange={(e) => setCurrent((x) => x ? { ...x, info: { ...x.info, wifi: { ...x.info.wifi, networkName: e.target.value } } } : x)} /></Field>
                <Field label="Wi-Fi Password"><input style={input} value={c.info.wifi.password} onChange={(e) => setCurrent((x) => x ? { ...x, info: { ...x.info, wifi: { ...x.info.wifi, password: e.target.value } } } : x)} /></Field>
              </div>
            )}

            {activeTab === "timers" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <Field label={`Warning after ${Math.round(c.inactivity.warningAfterMs / 1000)}s`}>
                  <input type="range" min={30} max={300} value={c.inactivity.warningAfterMs / 1000}
                    onChange={(e) => setCurrent((x) => x ? { ...x, inactivity: { ...x.inactivity, warningAfterMs: Number(e.target.value) * 1000 } } : x)}
                    style={{ width: "100%", accentColor: T.accent }} />
                </Field>
                <Field label={`Reset after ${Math.round(c.inactivity.resetAfterMs / 1000)}s`}>
                  <input type="range" min={10} max={120} value={c.inactivity.resetAfterMs / 1000}
                    onChange={(e) => setCurrent((x) => x ? { ...x, inactivity: { ...x.inactivity, resetAfterMs: Number(e.target.value) * 1000 } } : x)}
                    style={{ width: "100%", accentColor: T.accent }} />
                </Field>
              </div>
            )}

            {activeTab === "apis" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <SecretField label="HeyGen API Key" help="Avatar streaming" value={c.integrations?.heygenApiKey ?? ""} onChange={(v) => patchIntegrations("heygenApiKey", v)} />
                <SecretField label="Tavus API Key" help="Conversational video" value={c.integrations?.tavusApiKey ?? ""} onChange={(v) => patchIntegrations("tavusApiKey", v)} />
                <SecretField label="D-ID API Key" help="Avatar fallback" value={c.integrations?.didApiKey ?? ""} onChange={(v) => patchIntegrations("didApiKey", v)} />
                <SecretField label="Resend API Key" help="Email delivery" value={c.integrations?.resendApiKey ?? ""} onChange={(v) => patchIntegrations("resendApiKey", v)} />
              </div>
            )}
          </div>
        </div>

        {/* Preview panel — bottom 50%, left nav + iframe 16:9 with breathing room */}
        <div style={{ flex: "0 0 50%", borderTop: `1px solid ${T.border}`, background: T.bg, minHeight: 0, overflow: "hidden", display: "flex", gap: 0 }}>
          <ModuleNav iframeRef={iframeRef} modules={c.modules} />
          <div style={{ flex: 1, padding: "34px 58px 38px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0, minWidth: 0 }}>
            <div style={{ height: "100%", aspectRatio: "16/9", maxWidth: "100%", background: T.bg, display: "flex" }}>
              <iframe ref={iframeRef} key={previewKey} src={previewUrl} onLoad={handleIframeLoad} style={{ width: "100%", height: "100%", border: "none", display: "block", background: T.bg }} title="Kiosk preview" />
            </div>
          </div>
        </div>
      </div>

      {toast && <ToastBar msg={toast} />}

      <style>{`
        input:focus, select:focus { border-color: ${T.accent} !important; }
        button:hover { filter: brightness(1.02); }
        @keyframes toastIn { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
      `}</style>
    </div>
  );
}

// ═══════════════════ SUBCOMPONENTS ═══════════════════

const addCardBtn: React.CSSProperties = {
  width: "100%", marginTop: 12, padding: "14px 16px", borderRadius: 12,
  background: "transparent", border: `1.5px dashed ${T.borderHi}`,
  color: T.textDim, fontSize: 12, fontWeight: 600, fontFamily: T.fontBody,
  cursor: "pointer", transition: "all 150ms",
};

function SectionHeader({ section }: { section: typeof SECTIONS[number] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, paddingBottom: 10, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: `${T.accent}14`, color: T.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${T.accent}28` }}>
        <span style={{ display: "inline-flex", transform: "scale(0.65)" }}>{ICONS[section.key]}</span>
      </div>
      <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, letterSpacing: 1.2, textTransform: "uppercase", fontFamily: "ui-monospace, monospace" }}>
        {section.num}
      </div>
      <h1 style={{ fontFamily: T.fontDisplay, fontSize: 18, fontWeight: 800, color: T.text, letterSpacing: "-0.01em", lineHeight: 1, margin: 0 }}>
        {section.title}
      </h1>
      <p style={{ fontSize: 11, color: T.textDim, lineHeight: 1.4, margin: 0, marginLeft: 4, flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {section.desc}
      </p>
    </div>
  );
}

function ModuleCard({ module, onToggle, onToggleDash }: { module: HotelModule; onToggle: () => void; onToggleDash: () => void }) {
  const active = module.enabled;
  return (
    <div
      onClick={onToggle}
      style={{
        position: "relative", padding: "16px 14px 14px", borderRadius: 12,
        background: active ? `${T.accent}08` : T.surface,
        border: `1px solid ${active ? T.accent : T.border}`,
        cursor: "pointer", transition: "all 150ms",
        opacity: active ? 1 : 0.55,
        display: "flex", flexDirection: "column", gap: 10,
        minHeight: 130,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: active ? `${T.accent}18` : T.surfaceHi, color: active ? T.accent : T.textDim, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${active ? `${T.accent}30` : T.border}` }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><ModuleGlyph icon={module.icon} /></svg>
        </div>
        <Toggle on={active} onClick={(e) => { e.stopPropagation(); onToggle(); }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: T.fontDisplay, fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 2, lineHeight: 1.2 }}>{module.label}</div>
        <div style={{ fontSize: 10, color: T.textMuted, fontFamily: "ui-monospace, monospace" }}>{module.entryScreen}</div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onToggleDash(); }}
        disabled={!active}
        style={{
          padding: "5px 8px", borderRadius: 6, fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
          background: module.dashboardOrder != null ? `${T.accent}18` : "transparent",
          border: `1px solid ${module.dashboardOrder != null ? T.accent : T.border}`,
          color: module.dashboardOrder != null ? T.accent : T.textMuted,
          cursor: active ? "pointer" : "not-allowed",
          fontFamily: T.fontBody, textTransform: "uppercase", alignSelf: "flex-start",
        }}
      >
        {module.dashboardOrder != null ? `● Dash #${module.dashboardOrder}` : "Off Dash"}
      </button>
    </div>
  );
}

function ModuleGlyph({ icon }: { icon: string }) {
  const G: Record<string, React.ReactNode> = {
    "log-in": <><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></>,
    "log-out": <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
    "calendar-plus": <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18M12 14v6M9 17h6" /></>,
    "concierge-bell": <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></>,
    "calendar": <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
    "compass": <><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88" /></>,
    "map-pin": <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></>,
    "wifi": <><path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0" /><circle cx="12" cy="20" r="1" /></>,
    "help-circle": <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
    "gift": <><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" /></>,
    "megaphone": <><path d="M3 11l18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 11-5.8-1.6" /></>,
    "credit-card": <><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></>,
    "clock": <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    "sunrise": <><path d="M17 18a5 5 0 00-10 0M12 2v7M4.22 10.22l1.42 1.42M1 18h2M21 18h2M18.36 11.64l1.42-1.42M23 22H1M8 6l4-4 4 4" /></>,
    "key": <><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></>,
    "bot": <><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" /></>,
    "globe": <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></>,
  };
  return <>{G[icon] ?? <circle cx="12" cy="12" r="10" />}</>;
}

function RoomCard({ room, onChange, onRemove }: { room: RoomType; onChange: (p: Partial<RoomType>) => void; onRemove: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: "flex", gap: 14, padding: 14, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, position: "relative" }}>
      <div style={{ width: 160, height: 100, borderRadius: 9, background: `url('${room.image}') center/cover, ${T.surfaceHi}`, flexShrink: 0, border: `1px solid ${T.border}` }} />
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
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
          <input style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "5px 9px", fontSize: 11, color: T.textDim, outline: "none", width: 100 }} value={room.bedType} onChange={(e) => onChange({ bedType: e.target.value })} placeholder="Bed" />
          <input style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "5px 9px", fontSize: 11, color: T.textDim, outline: "none", flex: 1 }} value={room.image} onChange={(e) => onChange({ image: e.target.value })} placeholder="Image URL" />
        </div>
      </div>
      {hover && (
        <button onClick={onRemove} style={{ position: "absolute", top: 10, right: 10, width: 26, height: 26, borderRadius: 7, background: T.surface, border: `1px solid ${T.border}`, color: T.error, cursor: "pointer", fontSize: 14, lineHeight: 1 }}>×</button>
      )}
    </div>
  );
}

function UpgradeCard({ upgrade, onChange, onRemove }: { upgrade: UpgradeOption; onChange: (p: Partial<UpgradeOption>) => void; onRemove: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: "flex", gap: 14, padding: 14, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, position: "relative" }}>
      <div style={{ width: 160, height: 100, borderRadius: 9, background: `url('${upgrade.image}') center/cover, ${T.surfaceHi}`, flexShrink: 0, border: `1px solid ${T.border}` }} />
      <div style={{ flex: 1, display: "grid", gap: 8, minWidth: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
          <input style={{ background: "transparent", border: "none", outline: "none", fontFamily: T.fontDisplay, fontSize: 17, fontWeight: 800, color: T.text, padding: 0, letterSpacing: "-0.01em" }} value={upgrade.title} onChange={(e) => onChange({ title: e.target.value })} />
          <input style={{ width: 110, background: "transparent", border: "none", outline: "none", color: T.accent, fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 20, textAlign: "right", letterSpacing: "-0.01em" }} value={upgrade.price} onChange={(e) => onChange({ price: e.target.value })} />
        </div>
        <input style={{ background: "transparent", border: "none", outline: "none", fontSize: 12, color: T.textDim, padding: 0, width: "100%" }} value={upgrade.description} onChange={(e) => onChange({ description: e.target.value })} placeholder="Short description" />
        <input style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "5px 9px", fontSize: 11, color: T.textDim, outline: "none", marginTop: 4 }} value={upgrade.image} onChange={(e) => onChange({ image: e.target.value })} placeholder="Image URL" />
      </div>
      {hover && (
        <button onClick={onRemove} style={{ position: "absolute", top: 10, right: 10, width: 26, height: 26, borderRadius: 7, background: T.surface, border: `1px solid ${T.border}`, color: T.error, cursor: "pointer", fontSize: 14, lineHeight: 1 }}>×</button>
      )}
    </div>
  );
}

function TopBar({ brandName, saveState, configs, currentSlug, onSelectClient, onSave, onDelete, onOpen, onCopy, onNew, onBrandNameChange, disabled }: {
  brandName?: string; saveState: "idle" | "saving" | "saved" | "error";
  configs: HotelConfig[]; currentSlug: string | null; onSelectClient: (c: HotelConfig) => void;
  onSave: () => void; onDelete: () => void; onOpen: () => void; onCopy: () => void; onNew: () => void;
  onBrandNameChange?: (v: string) => void; disabled?: boolean;
}) {
  return (
    <div style={{ height: 64, borderBottom: `1px solid ${T.border}`, background: T.surface, display: "flex", alignItems: "center", padding: "0 24px", gap: 16, flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z" /></svg>
        </div>
        <div>
          <div style={{ fontFamily: T.fontDisplay, fontSize: 13, fontWeight: 800, color: T.text, letterSpacing: "-0.01em" }}>NEXI CMS</div>
          <div style={{ fontSize: 9, color: T.textMuted, fontFamily: T.fontBody, letterSpacing: 1, textTransform: "uppercase" }}>by TrueOmni</div>
        </div>
      </div>

      <ClientsDropdown configs={configs} currentSlug={currentSlug} onSelect={onSelectClient} onNew={onNew} />

      {!disabled && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <input value={brandName ?? ""} onChange={(e) => onBrandNameChange?.(e.target.value)} placeholder="Hotel name"
            style={{ background: "transparent", border: "none", outline: "none", fontFamily: T.fontDisplay, fontSize: 17, fontWeight: 700, color: T.text, letterSpacing: "-0.01em", minWidth: 0, flex: 1, padding: 0 }} />
        </div>
      )}
      {disabled && <div style={{ flex: 1 }} />}

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {!disabled && (
          <>
            <SaveStatus state={saveState} />
            <button onClick={onCopy} style={tbBtn}>Copy link</button>
            <button onClick={onOpen} style={{ ...tbBtn, display: "flex", alignItems: "center", gap: 6 }}>
              Open kiosk
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M7 7h10v10" /></svg>
            </button>
            <button onClick={onDelete} style={{ ...tbBtn, color: T.error }}>Delete</button>
            <button onClick={onSave} style={{ padding: "9px 20px", borderRadius: 8, fontSize: 12, fontWeight: 700, fontFamily: T.fontBody, cursor: "pointer", background: T.accent, border: `1px solid ${T.accent}`, color: "#fff", boxShadow: `0 4px 14px ${T.accent}33` }}>
              {saveState === "saving" ? "Saving…" : "Save"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const tbBtn: React.CSSProperties = {
  padding: "9px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: T.fontBody, cursor: "pointer",
  background: T.surface, border: `1px solid ${T.border}`, color: T.text,
};

function SaveStatus({ state }: { state: "idle" | "saving" | "saved" | "error" }) {
  if (state === "idle") return null;
  const cfg = {
    saving: { color: T.textDim, label: "Saving" },
    saved: { color: T.success, label: "✓ Saved" },
    error: { color: T.error, label: "✗ Error" },
  }[state];
  return <div style={{ fontSize: 11, color: cfg.color, fontWeight: 600, letterSpacing: 0.5, marginRight: 4 }}>{cfg.label}</div>;
}

function ClientsDropdown({ configs, currentSlug, onSelect, onNew }: {
  configs: HotelConfig[]; currentSlug: string | null; onSelect: (c: HotelConfig) => void; onNew: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const currentLabel = currentSlug ? configs.find((c) => c.slug === currentSlug)?.brand.name ?? "Unsaved" : "Select client…";

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button onClick={() => setOpen((v) => !v)} style={{
        display: "flex", alignItems: "center", gap: 8, height: 38, padding: "0 12px 0 10px", borderRadius: 8,
        background: T.surface, border: `1px solid ${open ? T.accent : T.border}`, color: T.text, cursor: "pointer",
        fontFamily: T.fontBody, fontSize: 12, fontWeight: 600, minWidth: 200, maxWidth: 260,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 7h18M3 12h18M3 17h18" /></svg>
        <span style={{ flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentLabel}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 150ms" }}><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: 44, left: 0, minWidth: 280, background: T.surface,
          border: `1px solid ${T.border}`, borderRadius: 10, boxShadow: "0 16px 50px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.04)",
          padding: 6, zIndex: 50, maxHeight: 420, overflow: "auto",
        }}>
          <div style={{ padding: "6px 10px 4px", fontSize: 9, fontWeight: 700, color: T.textMuted, letterSpacing: 1.2, textTransform: "uppercase" }}>
            {configs.length === 0 ? "No saved clients" : `${configs.length} saved`}
          </div>
          {configs.map((cfg) => {
            const active = cfg.slug === currentSlug;
            return (
              <button key={cfg.slug} onClick={() => { onSelect(cfg); setOpen(false); }} style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 10px", borderRadius: 7,
                border: "none", background: active ? `${T.accent}18` : "transparent", color: T.text, cursor: "pointer", textAlign: "left",
              }}>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: cfg.colors.primary, flexShrink: 0 }} />
                <div style={{ overflow: "hidden", flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.text, fontFamily: T.fontDisplay, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cfg.brand.name}</div>
                  <div style={{ fontSize: 10, color: T.textMuted, fontFamily: "ui-monospace, monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cfg.slug}</div>
                </div>
                {active && <div style={{ fontSize: 10, color: T.accent, fontWeight: 700 }}>●</div>}
              </button>
            );
          })}
          <div style={{ height: 1, background: T.border, margin: "6px 4px" }} />
          <button onClick={() => { onNew(); setOpen(false); }} style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 10px", borderRadius: 7,
            border: "none", background: "transparent", color: T.accent, cursor: "pointer", textAlign: "left",
            fontFamily: T.fontBody, fontSize: 12, fontWeight: 700,
          }}>
            <div style={{ width: 26, height: 26, borderRadius: 6, background: `${T.accent}22`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.accent}44` }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            </div>
            New client
          </button>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 9, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>{label}</div>
      {children}
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const hex = /^#[0-9a-f]{6}$/i.test(value) ? value : "#000000";
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 9, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, padding: 2, minWidth: 0 }}>
        <input type="color" value={hex} onChange={(e) => onChange(e.target.value)} style={{ width: 22, height: 22, border: "none", background: "transparent", cursor: "pointer", padding: 0, flexShrink: 0 }} />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", color: T.text, fontFamily: "ui-monospace, monospace", fontSize: 10, padding: "3px 0" }} />
      </div>
    </div>
  );
}

function ColorGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 10 }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

function ImageField({ label, value, onChange, compact }: { label: string; value: string; onChange: (v: string) => void; compact?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 9, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>{label}</div>
      <div style={{ display: "flex", gap: 8, minWidth: 0 }}>
        <div style={{ width: compact ? 32 : 56, height: compact ? 32 : 56, borderRadius: 6, background: `url('${value}') center/cover, ${T.surfaceHi}`, border: `1px solid ${T.border}`, flexShrink: 0 }} />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="/logos/..."
          style={{ flex: 1, minWidth: 0, padding: "7px 10px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 7, color: T.text, fontSize: 11, fontFamily: "ui-monospace, monospace", outline: "none" }} />
      </div>
    </div>
  );
}

function SecretField({ label, help, value, onChange }: { label: string; help?: string; value: string; onChange: (v: string) => void }) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 3 }}>
        <div style={{ fontSize: 9, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
        {help && <div style={{ fontSize: 9, color: T.textMuted }}>{help}</div>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 7, padding: "0 8px 0 10px" }}>
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••••••"
          autoComplete="off"
          spellCheck={false}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: T.text, fontSize: 11, fontFamily: "ui-monospace, monospace", padding: "7px 0", letterSpacing: visible ? 0 : 2 }}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          style={{ background: "transparent", border: "none", color: T.textDim, cursor: "pointer", fontSize: 9, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", padding: "4px 2px" }}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: (e: React.MouseEvent) => void }) {
  return (
    <button onClick={onClick} style={{
      width: 34, height: 20, borderRadius: 10, border: "none",
      background: on ? T.accent : T.borderHi, position: "relative",
      cursor: "pointer", padding: 0, flexShrink: 0,
    }}>
      <div style={{ position: "absolute", top: 2, left: on ? 16 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 150ms" }} />
    </button>
  );
}

function ModuleNav({ iframeRef, modules }: { iframeRef: React.RefObject<HTMLIFrameElement | null>; modules: HotelModule[] }) {
  const send = (screen: string) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    try { win.postMessage({ type: "nexi-cms:navigate", screen }, "*"); } catch {}
  };
  return (
    <div style={{
      width: 168, flexShrink: 0, borderRight: `1px solid ${T.border}`, background: T.surface,
      padding: "14px 10px", overflow: "auto", display: "flex", flexDirection: "column", gap: 2,
    }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, padding: "4px 10px 8px" }}>
        Quick Nav
      </div>
      <button
        onClick={() => send("IDL-01")}
        style={{
          display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 7,
          background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
          color: T.text, fontFamily: T.fontBody, fontSize: 11, fontWeight: 600,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = `${T.accent}12`; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
      >
        <div style={{ width: 18, height: 18, color: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a10 10 0 0 0 0 20" /></svg>
        </div>
        Idle Screen
      </button>
      <button
        onClick={() => send("DSH-01")}
        style={{
          display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 7,
          background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
          color: T.text, fontFamily: T.fontBody, fontSize: 11, fontWeight: 600,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = `${T.accent}12`; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
      >
        <div style={{ width: 18, height: 18, color: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
        </div>
        Dashboard
      </button>
      {modules.filter((m) => m.enabled).map((m) => (
        <button
          key={m.id}
          onClick={() => send(m.entryScreen)}
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 7,
            background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
            color: T.text, fontFamily: T.fontBody, fontSize: 11, fontWeight: 500,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = `${T.accent}12`; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <div style={{ width: 18, height: 18, color: T.textDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><ModuleGlyph icon={m.icon} /></svg>
          </div>
          <span style={{ flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.label}</span>
          <span style={{ fontSize: 8, color: T.textMuted, fontFamily: "ui-monospace, monospace", flexShrink: 0 }}>{m.entryScreen}</span>
        </button>
      ))}
    </div>
  );
}

function ToastBar({ msg }: { msg: string }) {
  return (
    <div style={{
      position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
      background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10,
      padding: "12px 20px", fontSize: 13, fontWeight: 600, color: T.text,
      boxShadow: "0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)", zIndex: 100,
      animation: "toastIn 200ms ease",
    }}>{msg}</div>
  );
}
