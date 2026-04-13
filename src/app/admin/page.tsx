"use client";

/**
 * NEXI CMS — single-page white-label configuration studio.
 *
 * Split layout: client list (left) · form editor (center) · live preview (right).
 * Dark theme by design: this is a TrueOmni internal tool, sessions are long,
 * and the look sets it apart from the light kiosk it configures.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { hotelConfig as defaultConfig } from "@/lib/hotel-config";
import type { HotelConfig, HotelModule, RoomType, UpgradeOption } from "@/lib/hotel-config";

// ─── design tokens (light surface palette, matches kiosk Nordic theme) ────
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

const GOOGLE_FONTS = [
  "Mona Sans", "Inter", "Playfair Display", "Space Grotesk", "DM Sans",
  "Manrope", "Instrument Serif", "Cormorant Garamond", "Fraunces", "Geist",
];

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64);
}

function makeBlankConfig(baseSlug = "new-client"): HotelConfig {
  return {
    ...structuredClone(defaultConfig),
    slug: baseSlug,
    brand: { ...defaultConfig.brand, name: "New Client Hotel", tagline: "Your Stay, Your Way" },
  };
}

export default function AdminCMS() {
  const [configs, setConfigs] = useState<HotelConfig[]>([]);
  const [current, setCurrent] = useState<HotelConfig | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [previewKey, setPreviewKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<NodeJS.Timeout | null>(null);

  const flashToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  // ─── initial load ────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/admin/configs")
      .then((r) => r.json())
      .then((data) => setConfigs(data.configs ?? []))
      .catch(() => {});
  }, []);

  // ─── patch helper: shallow+nested updates ───────────────────────────
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

  // ─── module actions ─────────────────────────────────────────────────
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

  // ─── rooms / upgrades CRUD ──────────────────────────────────────────
  const updateRoom = (i: number, patch: Partial<RoomType>) => setCurrent((c) => c ? { ...c, rooms: c.rooms.map((r, idx) => idx === i ? { ...r, ...patch } : r) } : c);
  const addRoom = () => setCurrent((c) => c ? { ...c, rooms: [...c.rooms, { id: `room-${Date.now()}`, name: "New Room", description: "", maxGuests: 2, bedType: "King", sizeSqFt: 400, baseRate: 200, currency: "USD", image: defaultConfig.images.roomDeluxe }] } : c);
  const removeRoom = (i: number) => setCurrent((c) => c ? { ...c, rooms: c.rooms.filter((_, idx) => idx !== i) } : c);

  const updateUpgrade = (i: number, patch: Partial<UpgradeOption>) => setCurrent((c) => c ? { ...c, upgrades: c.upgrades.map((u, idx) => idx === i ? { ...u, ...patch } : u) } : c);
  const addUpgrade = () => setCurrent((c) => c ? { ...c, upgrades: [...c.upgrades, { id: `upgrade-${Date.now()}`, title: "New Upgrade", description: "", price: "$0", image: defaultConfig.images.heroSpa }] } : c);
  const removeUpgrade = (i: number) => setCurrent((c) => c ? { ...c, upgrades: c.upgrades.filter((_, idx) => idx !== i) } : c);

  // ─── save / delete / new ────────────────────────────────────────────
  const handleSave = async () => {
    if (!current) return;
    setSaveState("saving");
    try {
      const res = await fetch("/api/admin/configs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(current),
      });
      if (!res.ok) throw new Error(await res.text());
      setSaveState("saved");
      setPreviewKey((k) => k + 1);
      flashToast(`Saved "${current.slug}"`);
      // refresh list
      const list = await fetch("/api/admin/configs").then((r) => r.json());
      setConfigs(list.configs ?? []);
      setTimeout(() => setSaveState("idle"), 2000);
    } catch (e) {
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

  const handleNew = () => setCurrent(makeBlankConfig(`client-${Date.now().toString(36).slice(-4)}`));

  const handleOpenKiosk = () => {
    if (!current?.slug) return;
    window.open(`/?client=${encodeURIComponent(current.slug)}`, "_blank");
  };

  const handleCopyLink = async () => {
    if (!current?.slug) return;
    const url = `${window.location.origin}/?client=${encodeURIComponent(current.slug)}`;
    await navigator.clipboard.writeText(url);
    flashToast("Link copied");
  };

  const previewUrl = useMemo(
    () => current ? `/?client=${encodeURIComponent(current.slug)}&_v=${previewKey}` : "about:blank",
    [current?.slug, previewKey]
  );

  // ─── styles ─────────────────────────────────────────────────────────
  const input: React.CSSProperties = {
    width: "100%", padding: "10px 12px", background: T.surface, border: `1px solid ${T.border}`,
    borderRadius: 8, color: T.text, fontSize: 13, fontFamily: T.fontBody, outline: "none",
    transition: "border-color 150ms",
  };
  const label: React.CSSProperties = {
    fontSize: 10, fontWeight: 600, color: T.textDim, textTransform: "uppercase",
    letterSpacing: 1, marginBottom: 6, fontFamily: T.fontBody, display: "block",
  };
  const sectionCard: React.CSSProperties = {
    background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14,
    padding: 24, marginBottom: 16,
  };
  const sectionTitle: React.CSSProperties = {
    fontFamily: T.fontDisplay, fontSize: 18, fontWeight: 700, color: T.text,
    marginBottom: 4, letterSpacing: "-0.01em",
  };
  const sectionHint: React.CSSProperties = {
    fontSize: 12, color: T.textDim, marginBottom: 20, fontFamily: T.fontBody,
  };
  const btn = (variant: "primary" | "ghost" | "danger" = "ghost"): React.CSSProperties => ({
    padding: "9px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600,
    fontFamily: T.fontBody, cursor: "pointer", transition: "all 150ms",
    display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid",
    ...(variant === "primary"
      ? { background: T.accent, borderColor: T.accent, color: "#fff" }
      : variant === "danger"
      ? { background: "transparent", borderColor: T.border, color: T.error }
      : { background: T.surface, borderColor: T.border, color: T.text }),
  });

  // ─── empty state ────────────────────────────────────────────────────
  if (!current) {
    return (
      <div style={{
        minHeight: "100vh", background: T.bg, color: T.text,
        fontFamily: T.fontBody, display: "flex", flexDirection: "column",
      }}>
        <TopBar
          slug=""
          saveState="idle"
          configs={configs}
          currentSlug={null}
          onSelectClient={(c) => setCurrent(structuredClone(c))}
          onNew={handleNew}
          onSave={() => {}}
          onDelete={() => {}}
          onOpen={() => {}}
          onCopy={() => {}}
          disabled
        />
        <div style={{ flex: 1, display: "flex" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
            <div style={{ maxWidth: 520, textAlign: "center" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 72, height: 72, borderRadius: 20, background: `${T.accent}14`,
                border: `1px solid ${T.accent}28`, marginBottom: 24,
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="4" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
              </div>
              <h1 style={{ fontFamily: T.fontDisplay, fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12, lineHeight: 1.1 }}>
                Configure a client, ship the kiosk.
              </h1>
              <p style={{ fontSize: 15, color: T.textDim, lineHeight: 1.6, marginBottom: 32, maxWidth: 440, margin: "0 auto 32px" }}>
                Load a hotel&rsquo;s brand, colors, rooms and modules. Click save. Send a link. The kiosk is branded in real time — no rebuild, no redeploy.
              </p>
              <button onClick={handleNew} style={{ ...btn("primary"), padding: "14px 28px", fontSize: 13 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                New Client Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const c = current;
  const cssPrimary = c.colors.primary;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.fontBody, display: "flex", flexDirection: "column" }}>
      <TopBar
        slug={c.slug}
        brandName={c.brand.name}
        saveState={saveState}
        configs={configs}
        currentSlug={c.slug}
        onSelectClient={(cfg) => setCurrent(structuredClone(cfg))}
        onSave={handleSave}
        onDelete={handleDelete}
        onOpen={handleOpenKiosk}
        onCopy={handleCopyLink}
        onNew={handleNew}
        onSlugChange={(v) => patch("slug", slugify(v))}
        onBrandNameChange={(v) => patchBrand("name", v)}
      />

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* ── Form ── */}
        <div style={{ flex: 1, overflow: "auto", padding: "32px 40px", background: T.bg }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>

            {/* Brand Identity */}
            <div style={sectionCard}>
              <div style={sectionTitle}>Brand Identity</div>
              <div style={sectionHint}>The hotel&rsquo;s name, tagline and logo assets.</div>
              <div style={{ display: "grid", gap: 14 }}>
                <Field label="Brand Name">
                  <input style={input} value={c.brand.name} onChange={(e) => patchBrand("name", e.target.value)} />
                </Field>
                <Field label="Tagline">
                  <input style={input} value={c.brand.tagline} onChange={(e) => patchBrand("tagline", e.target.value)} />
                </Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <LogoField label="Logo (light bg)" value={c.brand.logo} onChange={(v) => patchBrand("logo", v)} />
                  <LogoField label="Logo (dark bg)" value={c.brand.logoWhite} onChange={(v) => patchBrand("logoWhite", v)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <LogoField label="Icon (square)" value={c.brand.icon} onChange={(v) => patchBrand("icon", v)} />
                  <LogoField label="Icon white" value={c.brand.iconWhite} onChange={(v) => patchBrand("iconWhite", v)} />
                </div>
              </div>
            </div>

            {/* Colors */}
            <div style={sectionCard}>
              <div style={sectionTitle}>Colors</div>
              <div style={sectionHint}>Primary accent is the dominant brand color. Light/dark surfaces flip with the kiosk theme toggle.</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <ColorField label="Primary" value={c.colors.primary} onChange={(v) => patchColors("primary", v)} />
                <ColorField label="Primary Hover" value={c.colors.primaryHover} onChange={(v) => patchColors("primaryHover", v)} />
                <ColorField label="Amber Accent" value={c.colors.amber} onChange={(v) => patchColors("amber", v)} />
                <ColorField label="Purple Accent" value={c.colors.purple} onChange={(v) => patchColors("purple", v)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <ColorGroup title="Light Mode">
                  <ColorField label="Background" value={c.colors.light.bg} onChange={(v) => patchColors("light.bg", v)} />
                  <ColorField label="Card" value={c.colors.light.bgCard} onChange={(v) => patchColors("light.bgCard", v)} />
                  <ColorField label="Text" value={c.colors.light.text} onChange={(v) => patchColors("light.text", v)} />
                  <ColorField label="Border" value={c.colors.light.border} onChange={(v) => patchColors("light.border", v)} />
                </ColorGroup>
                <ColorGroup title="Dark Mode">
                  <ColorField label="Background" value={c.colors.dark.bg} onChange={(v) => patchColors("dark.bg", v)} />
                  <ColorField label="Card" value={c.colors.dark.bgCard} onChange={(v) => patchColors("dark.bgCard", v)} />
                  <ColorField label="Text" value={c.colors.dark.text} onChange={(v) => patchColors("dark.text", v)} />
                  <ColorField label="Border" value={c.colors.dark.border} onChange={(v) => patchColors("dark.border", v)} />
                </ColorGroup>
              </div>
            </div>

            {/* Fonts */}
            <div style={sectionCard}>
              <div style={sectionTitle}>Typography</div>
              <div style={sectionHint}>Loaded from Google Fonts. Display for headlines, body for everything else.</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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
            </div>

            {/* Hero Images */}
            <div style={sectionCard}>
              <div style={sectionTitle}>Hero Imagery</div>
              <div style={sectionHint}>URLs to hotel photography. Used on the idle screen, action select and dashboard welcome card.</div>
              <div style={{ display: "grid", gap: 14 }}>
                <ImageField label="Hero Exterior (idle splash)" value={c.images.heroExterior} onChange={(v) => patchImages("heroExterior", v)} />
                <ImageField label="Hero Lobby (dashboard welcome)" value={c.images.heroLobby} onChange={(v) => patchImages("heroLobby", v)} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <ImageField label="Hero Pool" value={c.images.heroPool} onChange={(v) => patchImages("heroPool", v)} />
                  <ImageField label="Hero Spa" value={c.images.heroSpa} onChange={(v) => patchImages("heroSpa", v)} />
                </div>
                <ImageField label="Hero Restaurant" value={c.images.heroRestaurant} onChange={(v) => patchImages("heroRestaurant", v)} />
              </div>
            </div>

            {/* Modules */}
            <div style={sectionCard}>
              <div style={sectionTitle}>Kiosk Modules</div>
              <div style={sectionHint}>Toggle what the guest can access. &ldquo;On dashboard&rdquo; controls visibility in the DSH-01 grid.</div>
              <div style={{ display: "grid", gap: 6 }}>
                {c.modules.map((m) => (
                  <ModuleRow key={m.id} module={m} onToggle={() => toggleModule(m.id)} onToggleDash={() => toggleModuleDash(m.id)} />
                ))}
              </div>
            </div>

            {/* Rooms */}
            <div style={sectionCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 20 }}>
                <div>
                  <div style={sectionTitle}>Rooms</div>
                  <div style={{ ...sectionHint, marginBottom: 0 }}>Available room types shown in the booking flow.</div>
                </div>
                <button onClick={addRoom} style={btn("ghost")}>+ Add</button>
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {c.rooms.map((r, i) => (
                  <ItemCard key={r.id} onRemove={() => removeRoom(i)}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
                      <Field label="Name"><input style={input} value={r.name} onChange={(e) => updateRoom(i, { name: e.target.value })} /></Field>
                      <Field label="Bed"><input style={input} value={r.bedType} onChange={(e) => updateRoom(i, { bedType: e.target.value })} /></Field>
                      <Field label="Rate / Night"><input type="number" style={input} value={r.baseRate} onChange={(e) => updateRoom(i, { baseRate: Number(e.target.value) })} /></Field>
                    </div>
                    <Field label="Description"><input style={input} value={r.description} onChange={(e) => updateRoom(i, { description: e.target.value })} /></Field>
                    <div style={{ marginTop: 10 }}>
                      <ImageField label="Image" value={r.image} onChange={(v) => updateRoom(i, { image: v })} compact />
                    </div>
                  </ItemCard>
                ))}
              </div>
            </div>

            {/* Upgrades */}
            <div style={sectionCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 20 }}>
                <div>
                  <div style={sectionTitle}>Upgrades & Offers</div>
                  <div style={{ ...sectionHint, marginBottom: 0 }}>Paid extras shown in the dashboard sidebar after check-in.</div>
                </div>
                <button onClick={addUpgrade} style={btn("ghost")}>+ Add</button>
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {c.upgrades.map((u, i) => (
                  <ItemCard key={u.id} onRemove={() => removeUpgrade(i)}>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10, marginBottom: 10 }}>
                      <Field label="Title"><input style={input} value={u.title} onChange={(e) => updateUpgrade(i, { title: e.target.value })} /></Field>
                      <Field label="Price"><input style={input} value={u.price} onChange={(e) => updateUpgrade(i, { price: e.target.value })} /></Field>
                    </div>
                    <Field label="Description"><input style={input} value={u.description} onChange={(e) => updateUpgrade(i, { description: e.target.value })} /></Field>
                    <div style={{ marginTop: 10 }}>
                      <ImageField label="Image" value={u.image} onChange={(v) => updateUpgrade(i, { image: v })} compact />
                    </div>
                  </ItemCard>
                ))}
              </div>
            </div>

            {/* Info */}
            <div style={sectionCard}>
              <div style={sectionTitle}>Hotel Information</div>
              <div style={sectionHint}>Operational details shown across the kiosk.</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field label="Address"><input style={input} value={c.info.address} onChange={(e) => patchInfo("address", e.target.value)} /></Field>
                <Field label="Phone"><input style={input} value={c.info.phone} onChange={(e) => patchInfo("phone", e.target.value)} /></Field>
                <Field label="Email"><input style={input} value={c.info.email} onChange={(e) => patchInfo("email", e.target.value)} /></Field>
                <Field label="Check-in / out"><input style={input} value={`${c.info.checkInTime} / ${c.info.checkOutTime}`} readOnly /></Field>
                <Field label="Wi-Fi Network"><input style={input} value={c.info.wifi.networkName} onChange={(e) => setCurrent((x) => x ? { ...x, info: { ...x.info, wifi: { ...x.info.wifi, networkName: e.target.value } } } : x)} /></Field>
                <Field label="Wi-Fi Password"><input style={input} value={c.info.wifi.password} onChange={(e) => setCurrent((x) => x ? { ...x, info: { ...x.info, wifi: { ...x.info.wifi, password: e.target.value } } } : x)} /></Field>
              </div>
            </div>

            {/* Inactivity */}
            <div style={sectionCard}>
              <div style={sectionTitle}>Inactivity Timers</div>
              <div style={sectionHint}>How long before the kiosk returns to idle. Tune for lobby traffic.</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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
            </div>

            <div style={{ height: 40 }} />
          </div>
        </div>

        {/* ── Preview ── */}
        <div style={{ width: 440, borderLeft: `1px solid ${T.border}`, background: T.bg, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Live Preview</div>
              <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>Updates on Save</div>
            </div>
            <button onClick={() => setPreviewKey((k) => k + 1)} style={btn("ghost")}>⟳ Refresh</button>
          </div>
          <div style={{ flex: 1, padding: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{
              width: "100%", aspectRatio: "16/9", borderRadius: 12, overflow: "hidden",
              border: `1px solid ${T.border}`, boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
              background: T.bg,
            }}>
              <iframe
                key={previewKey}
                src={previewUrl}
                style={{ width: "100%", height: "100%", border: "none" }}
                title="Kiosk preview"
              />
            </div>
          </div>
          <div style={{ padding: "12px 20px", borderTop: `1px solid ${T.border}`, fontSize: 11, color: T.textMuted, fontFamily: "monospace", textAlign: "center" }}>
            /?client={c.slug}
          </div>
        </div>
      </div>

      {toast && (
        <div style={{
          position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
          background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10,
          padding: "12px 20px", fontSize: 13, fontWeight: 600, color: T.text,
          boxShadow: "0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)", zIndex: 100,
          animation: "toastIn 200ms ease",
        }}>
          {toast}
        </div>
      )}

      <style>{`
        input::placeholder, select::placeholder { color: ${T.textMuted}; }
        input:focus, select:focus { border-color: ${T.accent} !important; }
        button:hover { filter: brightness(1.1); }
        @keyframes toastIn { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
      `}</style>
    </div>
  );
}

// ─── subcomponents ────────────────────────────────────────────────────

function TopBar({ slug, brandName, saveState, configs, currentSlug, onSelectClient, onSave, onDelete, onOpen, onCopy, onNew, onSlugChange, onBrandNameChange, disabled }: {
  slug: string; brandName?: string; saveState: "idle" | "saving" | "saved" | "error";
  configs: HotelConfig[]; currentSlug: string | null; onSelectClient: (c: HotelConfig) => void;
  onSave: () => void; onDelete: () => void; onOpen: () => void; onCopy: () => void; onNew: () => void;
  onSlugChange?: (v: string) => void; onBrandNameChange?: (v: string) => void; disabled?: boolean;
}) {
  return (
    <div style={{
      height: 64, borderBottom: `1px solid ${T.border}`, background: T.bg,
      display: "flex", alignItems: "center", padding: "0 24px", gap: 16, flexShrink: 0,
    }}>
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
          <input
            value={brandName ?? ""}
            onChange={(e) => onBrandNameChange?.(e.target.value)}
            placeholder="Hotel name"
            style={{
              background: "transparent", border: "none", outline: "none",
              fontFamily: T.fontDisplay, fontSize: 17, fontWeight: 700, color: T.text,
              letterSpacing: "-0.01em", minWidth: 0, flex: 1, padding: 0,
            }}
          />
          <div style={{ color: T.borderHi, fontSize: 12 }}>/</div>
          <input
            value={slug}
            onChange={(e) => onSlugChange?.(e.target.value)}
            placeholder="slug"
            style={{
              background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6,
              padding: "6px 10px", fontFamily: "ui-monospace, monospace", fontSize: 11,
              color: T.textDim, outline: "none", width: 160, flexShrink: 0,
            }}
          />
        </div>
      )}
      {disabled && <div style={{ flex: 1 }} />}

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
        {!disabled && (
          <>
            <SaveStatus state={saveState} />
            <button onClick={onCopy} style={{ padding: "9px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: T.fontBody, cursor: "pointer", background: T.surface, border: `1px solid ${T.border}`, color: T.text }}>Copy link</button>
            <button onClick={onOpen} style={{ padding: "9px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: T.fontBody, cursor: "pointer", background: T.surface, border: `1px solid ${T.border}`, color: T.text, display: "flex", alignItems: "center", gap: 6 }}>
              Open kiosk
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M7 7h10v10" /></svg>
            </button>
            <button onClick={onDelete} style={{ padding: "9px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: T.fontBody, cursor: "pointer", background: "transparent", border: `1px solid ${T.border}`, color: T.error }}>Delete</button>
            <button onClick={onSave} style={{ padding: "9px 20px", borderRadius: 8, fontSize: 12, fontWeight: 700, fontFamily: T.fontBody, cursor: "pointer", background: T.accent, border: `1px solid ${T.accent}`, color: "#fff", boxShadow: `0 4px 14px ${T.accent}33` }}>
              {saveState === "saving" ? "Saving…" : "Save"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function SaveStatus({ state }: { state: "idle" | "saving" | "saved" | "error" }) {
  if (state === "idle") return null;
  const cfg = {
    saving: { color: T.textDim, label: "Saving" },
    saved: { color: T.success, label: "✓ Saved" },
    error: { color: T.error, label: "✗ Error" },
  }[state];
  return <div style={{ fontSize: 11, color: cfg.color, fontWeight: 600, letterSpacing: 0.5, marginRight: 8 }}>{cfg.label}</div>;
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

  const currentLabel = currentSlug
    ? configs.find((c) => c.slug === currentSlug)?.brand.name ?? "Unsaved"
    : "Select client…";

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          height: 38, padding: "0 12px 0 10px", borderRadius: 8,
          background: T.surface, border: `1px solid ${open ? T.accent : T.border}`,
          color: T.text, cursor: "pointer", fontFamily: T.fontBody,
          fontSize: 12, fontWeight: 600, minWidth: 200, maxWidth: 260,
          transition: "border-color 150ms",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M3 7h18M3 12h18M3 17h18" />
        </svg>
        <span style={{ flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {currentLabel}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 150ms" }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: 44, left: 0, minWidth: 280,
          background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10,
          boxShadow: "0 16px 50px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.04)",
          padding: 6, zIndex: 50, maxHeight: 420, overflow: "auto",
        }}>
          <div style={{ padding: "6px 10px 4px", fontSize: 9, fontWeight: 700, color: T.textMuted, letterSpacing: 1.2, textTransform: "uppercase" }}>
            {configs.length === 0 ? "No saved clients" : `${configs.length} saved`}
          </div>
          {configs.map((cfg) => {
            const active = cfg.slug === currentSlug;
            return (
              <button
                key={cfg.slug}
                onClick={() => { onSelect(cfg); setOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "9px 10px", borderRadius: 7, border: "none",
                  background: active ? `${T.accent}18` : "transparent", color: T.text,
                  cursor: "pointer", textAlign: "left",
                  transition: "background 120ms",
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = T.surface; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ width: 26, height: 26, borderRadius: 6, background: cfg.colors.primary, flexShrink: 0, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }} />
                <div style={{ overflow: "hidden", flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.text, fontFamily: T.fontDisplay, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cfg.brand.name}</div>
                  <div style={{ fontSize: 10, color: T.textMuted, fontFamily: "ui-monospace, monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cfg.slug}</div>
                </div>
                {active && <div style={{ fontSize: 10, color: T.accent, fontWeight: 700 }}>●</div>}
              </button>
            );
          })}
          <div style={{ height: 1, background: T.border, margin: "6px 4px" }} />
          <button
            onClick={() => { onNew(); setOpen(false); }}
            style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "10px 10px", borderRadius: 7, border: "none",
              background: "transparent", color: T.accent, cursor: "pointer", textAlign: "left",
              fontFamily: T.fontBody, fontSize: 12, fontWeight: 700, letterSpacing: 0.3,
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = `${T.accent}14`}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
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
      <div style={{ fontSize: 10, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  // Normalize for <input type="color">: only accepts #RRGGBB
  const hex = /^#[0-9a-f]{6}$/i.test(value) ? value : "#000000";
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 4 }}>
        <input type="color" value={hex} onChange={(e) => onChange(e.target.value)} style={{ width: 32, height: 32, border: "none", background: "transparent", cursor: "pointer", padding: 0 }} />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: T.text, fontFamily: "ui-monospace, monospace", fontSize: 12, padding: "4px 0" }} />
      </div>
    </div>
  );
}

function ColorGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>{title}</div>
      <div style={{ display: "grid", gap: 10 }}>{children}</div>
    </div>
  );
}

function ImageField({ label, value, onChange, compact }: { label: string; value: string; onChange: (v: string) => void; compact?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
        <div style={{
          width: compact ? 56 : 72, height: compact ? 56 : 72, borderRadius: 8,
          background: `url('${value}') center/cover, ${T.surface}`,
          border: `1px solid ${T.border}`, flexShrink: 0,
        }} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          style={{ flex: 1, padding: "10px 12px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 12, fontFamily: "ui-monospace, monospace", outline: "none" }}
        />
      </div>
    </div>
  );
}

function LogoField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <ImageField label={label} value={value} onChange={onChange} compact />;
}

function ModuleRow({ module, onToggle, onToggleDash }: { module: HotelModule; onToggle: () => void; onToggleDash: () => void }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "10px 12px", borderRadius: 8,
      background: module.enabled ? T.bg : "transparent",
      border: `1px solid ${module.enabled ? T.border : "transparent"}`,
      opacity: module.enabled ? 1 : 0.5, transition: "all 120ms",
    }}>
      <Toggle on={module.enabled} onClick={onToggle} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: T.fontBody }}>{module.label}</div>
        <div style={{ fontSize: 10, color: T.textMuted, fontFamily: "ui-monospace, monospace" }}>{module.id} · {module.entryScreen}</div>
      </div>
      <button onClick={onToggleDash} disabled={!module.enabled} style={{
        padding: "5px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, letterSpacing: 0.5,
        background: module.dashboardOrder != null ? `${T.accent}22` : "transparent",
        border: `1px solid ${module.dashboardOrder != null ? T.accent : T.border}`,
        color: module.dashboardOrder != null ? T.accent : T.textDim,
        cursor: module.enabled ? "pointer" : "not-allowed",
        fontFamily: T.fontBody, textTransform: "uppercase",
      }}>
        {module.dashboardOrder != null ? `On Dash #${module.dashboardOrder}` : "Off Dash"}
      </button>
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      width: 34, height: 20, borderRadius: 10, border: "none",
      background: on ? T.accent : T.borderHi, position: "relative",
      cursor: "pointer", transition: "background 150ms", padding: 0,
      flexShrink: 0,
    }}>
      <div style={{
        position: "absolute", top: 2, left: on ? 16 : 2,
        width: 16, height: 16, borderRadius: "50%", background: "#fff",
        transition: "left 150ms",
      }} />
    </button>
  );
}

function ItemCard({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14, position: "relative" }}>
      <button onClick={onRemove} style={{
        position: "absolute", top: 10, right: 10, width: 24, height: 24, borderRadius: 6,
        background: "transparent", border: `1px solid ${T.border}`, color: T.textDim,
        cursor: "pointer", fontSize: 13, lineHeight: 1,
      }}>×</button>
      {children}
    </div>
  );
}
