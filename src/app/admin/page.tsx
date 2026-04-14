"use client";

/**
 * NEXI CMS — single-page white-label configuration studio.
 * Horizontal tabs layout: topbar + tab bar + (tab content | live preview).
 * Preview is always visible, never scrolls out.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Reorder } from "framer-motion";
import { hotelConfig as defaultConfig } from "@/lib/hotel-config";
import type { HotelConfig, HotelModule, RoomType, UpgradeOption, CustomFont, HeroAsset, AdItem, AdsConfig, AdType, SurveyConfig, SurveyQuestion, SurveyQuestionType, FaqConfig, FaqItem } from "@/lib/hotel-config";
import { T } from "./_lib/tokens";
import { sp, ICONS } from "./_lib/icons";
import { ADMIN_LOCALES, GOOGLE_FONTS, SECTIONS } from "./_lib/sections";
import { type UploadSpec, SPEC_LOGO, SPEC_ICON, SPEC_HERO, SPEC_DEFAULT, formatBytes, readFileAsDataURL } from "./_lib/specs";
import { slugify, isValidColor, isValidGradient } from "./_lib/validators";
import { type Preset, PRESETS, applyPreset } from "./_lib/presets";
import { normalizeConfig, makeBlankConfig } from "./_lib/normalize";
import { compressDataUrl, compressConfigImages } from "./_lib/compress";
import Field from "./_components/Field";
import ColorField from "./_components/ColorField";
import GradientField from "./_components/GradientField";
import ColorGroup from "./_components/ColorGroup";
import Toggle from "./_components/Toggle";
import SecretField from "./_components/SecretField";
import SaveStatus from "./_components/SaveStatus";
import ToastBar from "./_components/ToastBar";
import ModuleGlyph from "./_components/ModuleGlyph";
import SectionHeader from "./_components/SectionHeader";
import ModuleCard from "./_components/ModuleCard";
import DroppableImage from "./_components/DroppableImage";
import GalleryStrip from "./_components/GalleryStrip";
import RoomCard from "./_components/RoomCard";
import UpgradeCard from "./_components/UpgradeCard";
import SurveyTab from "./_components/SurveyTab";
import FaqTab from "./_components/FaqTab";
import { baseInput, addCardBtn } from "./_lib/styles";

export default function AdminCMS() {
  const [configs, setConfigs] = useState<HotelConfig[]>([]);
  const [current, setCurrent] = useState<HotelConfig | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState<HotelConfig | null>(null);
  const [activeTab, setActiveTab] = useState<string>("client");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [previewKey, setPreviewKey] = useState(0);
  const [toast, setToast] = useState<{ msg: string; tone: "success" | "error" | "info" | "warning" } | null>(null);
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light");
  const [previewFullscreen, setPreviewFullscreen] = useState(false);
  const toastTimer = useRef<NodeJS.Timeout | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // ─── Phase 2: undo / redo ────────────────────────────────────────
  // Two stacks of HotelConfig snapshots. `historyPast` holds states the
  // user can return to via Cmd+Z; `historyFuture` holds states they can
  // return to via Cmd+Shift+Z after an undo. A fresh edit clears future.
  //
  // Snapshots are recorded by a debounced effect on `current` — rapid
  // typing compacts into a single snapshot per 500 ms. `lastSnapshotRef`
  // tracks the state at the moment of the most recent snapshot so the
  // diff is between stable states, not every keystroke. `skipSnapshotRef`
  // is raised during undo/redo to prevent the same effect from re-recording
  // the replayed state and corrupting the stacks.
  const HISTORY_LIMIT = 50;
  const [historyPast, setHistoryPast] = useState<HotelConfig[]>([]);
  const [historyFuture, setHistoryFuture] = useState<HotelConfig[]>([]);
  const lastSnapshotRef = useRef<HotelConfig | null>(null);
  const snapshotTimerRef = useRef<NodeJS.Timeout | null>(null);
  const skipSnapshotRef = useRef(false);

  const resetHistory = useCallback((baseline: HotelConfig | null) => {
    setHistoryPast([]);
    setHistoryFuture([]);
    if (snapshotTimerRef.current) { clearTimeout(snapshotTimerRef.current); snapshotTimerRef.current = null; }
    lastSnapshotRef.current = baseline ? structuredClone(baseline) : null;
    skipSnapshotRef.current = false;
  }, []);

  const flashToast = useCallback((msg: string, tone: "success" | "error" | "info" | "warning" = "success") => {
    setToast({ msg, tone });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    // Warnings sit longer so the user actually reads them.
    toastTimer.current = setTimeout(() => setToast(null), tone === "warning" ? 4500 : 2200);
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

  const toggleLocale = useCallback((code: string) => {
    setCurrent((c) => {
      if (!c) return c;
      const current = c.enabledLocales ?? ADMIN_LOCALES.map((l) => l.code);
      const next = current.includes(code) ? current.filter((l) => l !== code) : [...current, code];
      return { ...c, enabledLocales: next };
    });
  }, []);

  const addCustomFont = useCallback((font: CustomFont) => {
    setCurrent((c) => {
      if (!c) return c;
      const existing = c.customFonts ?? [];
      if (existing.some((f) => f.family === font.family)) {
        flashToast(`"${font.family}" is already imported`, "info");
        return c;
      }
      return { ...c, customFonts: [...existing, font] };
    });
  }, [flashToast]);

  const removeCustomFont = useCallback((family: string) => {
    setCurrent((c) => {
      if (!c) return c;
      return { ...c, customFonts: (c.customFonts ?? []).filter((f) => f.family !== family) };
    });
  }, []);

  const patchPolicies = useCallback((p: Partial<NonNullable<HotelConfig["policies"]>>) => {
    setCurrent((c) => (c ? { ...c, policies: { ...(c.policies ?? {}), ...p } } : c));
  }, []);

  const DEFAULT_ADS: AdsConfig = {
    items: [],
    showOnDashboard: true,
    dashboardDelayMs: 3000,
    autoDismissMs: 0,
    rotation: "first",
  };

  const patchAds = useCallback((p: Partial<AdsConfig>) => {
    setCurrent((c) => {
      if (!c) return c;
      const base = c.ads ?? DEFAULT_ADS;
      return { ...c, ads: { ...base, ...p } };
    });
  }, []);

  const updateAdItem = useCallback((i: number, p: Partial<AdItem>) => {
    setCurrent((c) => {
      if (!c) return c;
      const base = c.ads ?? DEFAULT_ADS;
      const items = base.items.map((it, idx) => idx === i ? { ...it, ...p } : it);
      return { ...c, ads: { ...base, items } };
    });
  }, []);

  const addAdItem = useCallback(() => {
    setCurrent((c) => {
      if (!c) return c;
      const base = c.ads ?? DEFAULT_ADS;
      const newItem: AdItem = {
        id: `ad-${Date.now()}`,
        type: "popup",
        title: "New Offer",
        subtitle: "",
        image: c.images.heroSpa || c.images.heroExterior || "",
        ctaLabel: "Book Now",
        ctaTarget: "UPS-01",
        dismissLabel: "Maybe Later",
        enabled: true,
        screenPattern: "DSH-01",
        side: "right",
      };
      return { ...c, ads: { ...base, items: [...base.items, newItem] } };
    });
  }, []);

  const removeAdItem = useCallback((i: number) => {
    setCurrent((c) => {
      if (!c) return c;
      const base = c.ads ?? DEFAULT_ADS;
      return { ...c, ads: { ...base, items: base.items.filter((_, idx) => idx !== i) } };
    });
  }, []);

  const reorderAds = useCallback((arr: AdItem[]) => {
    setCurrent((c) => {
      if (!c) return c;
      const base = c.ads ?? DEFAULT_ADS;
      return { ...c, ads: { ...base, items: arr } };
    });
  }, []);

  const DEFAULT_SURVEY: SurveyConfig = { title: "How was your stay?", questions: [], showAfterCheckOut: true };
  const DEFAULT_FAQ: FaqConfig = { categories: ["General"], items: [] };

  const patchSurvey = useCallback((p: Partial<SurveyConfig>) => {
    setCurrent((c) => c ? { ...c, survey: { ...(c.survey ?? DEFAULT_SURVEY), ...p } } : c);
  }, []);
  const updateSurveyQ = useCallback((i: number, p: Partial<SurveyQuestion>) => {
    setCurrent((c) => {
      if (!c) return c;
      const base = c.survey ?? DEFAULT_SURVEY;
      const questions = base.questions.map((q, idx) => idx === i ? { ...q, ...p } : q);
      return { ...c, survey: { ...base, questions } };
    });
  }, []);
  const addSurveyQ = useCallback(() => {
    setCurrent((c) => {
      if (!c) return c;
      const base = c.survey ?? DEFAULT_SURVEY;
      const q: SurveyQuestion = { id: `q-${Date.now()}`, type: "rating", text: "New question", required: false, maxRating: 5 };
      return { ...c, survey: { ...base, questions: [...base.questions, q] } };
    });
  }, []);
  const removeSurveyQ = useCallback((i: number) => {
    setCurrent((c) => {
      if (!c) return c;
      const base = c.survey ?? DEFAULT_SURVEY;
      return { ...c, survey: { ...base, questions: base.questions.filter((_, idx) => idx !== i) } };
    });
  }, []);

  const patchFaq = useCallback((p: Partial<FaqConfig>) => {
    setCurrent((c) => c ? { ...c, faq: { ...(c.faq ?? DEFAULT_FAQ), ...p } } : c);
  }, []);
  const updateFaqItem = useCallback((i: number, p: Partial<FaqItem>) => {
    setCurrent((c) => {
      if (!c) return c;
      const base = c.faq ?? DEFAULT_FAQ;
      const items = base.items.map((it, idx) => idx === i ? { ...it, ...p } : it);
      return { ...c, faq: { ...base, items } };
    });
  }, []);
  const addFaqItem = useCallback(() => {
    setCurrent((c) => {
      if (!c) return c;
      const base = c.faq ?? DEFAULT_FAQ;
      const item: FaqItem = { id: `f-${Date.now()}`, question: "New question", answer: "", category: base.categories[0] ?? "General" };
      return { ...c, faq: { ...base, items: [...base.items, item] } };
    });
  }, []);
  const removeFaqItem = useCallback((i: number) => {
    setCurrent((c) => {
      if (!c) return c;
      const base = c.faq ?? DEFAULT_FAQ;
      return { ...c, faq: { ...base, items: base.items.filter((_, idx) => idx !== i) } };
    });
  }, []);

  const setKioskTheme = useCallback((theme: "light" | "dark") => {
    setPreviewTheme(theme);
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    try { win.postMessage({ type: "nexi-cms:set-theme", theme }, "*"); } catch {}
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

  // ─── Phase 1: dirty state + KV size + slug validation ──────────
  const isDirty = useMemo(() => {
    if (!current || !savedSnapshot) return false;
    try { return JSON.stringify(current) !== JSON.stringify(savedSnapshot); } catch { return false; }
  }, [current, savedSnapshot]);

  const configBytes = useMemo(() => {
    if (!current) return 0;
    try { return new Blob([JSON.stringify(current)]).size; } catch { return 0; }
  }, [current]);

  const KV_SOFT = 700 * 1024;
  const KV_HARD = 950 * 1024;
  const overKvHard = configBytes > KV_HARD;

  const slugError = useMemo(() => {
    if (!current) return null;
    if (!current.slug) return "Slug is required";
    if (!/^[a-z0-9-]+$/.test(current.slug)) return "Only lowercase letters, digits, hyphens";
    const savedSlug = savedSnapshot?.slug;
    const collision = configs.find((c) => c.slug === current.slug && c.slug !== savedSlug);
    if (collision) return `Already used by "${collision.brand.name}"`;
    return null;
  }, [current, savedSnapshot, configs]);

  // Walks current.colors and counts every string field that doesn't
  // pass validation. Used to gate Save the same way slugError does so
  // configs can't be persisted with broken color values that would
  // poison the kiosk preview. The `primaryGradient` field gets the
  // gradient validator instead of the solid-color one — it's allowed
  // (and intended) to be a CSS gradient.
  const colorErrorCount = useMemo(() => {
    if (!current?.colors) return 0;
    let bad = 0;
    const walk = (obj: unknown, key?: string) => {
      if (obj == null) return;
      if (typeof obj === "string") {
        if (key === "primaryGradient") {
          if (!isValidGradient(obj)) bad++;
        } else if (!isValidColor(obj)) {
          bad++;
        }
        return;
      }
      if (typeof obj === "object") {
        for (const [k, v] of Object.entries(obj as Record<string, unknown>)) walk(v, k);
      }
    };
    walk(current.colors);
    return bad;
  }, [current?.colors]);

  const confirmSwitch = useCallback((next: () => void) => {
    if (!isDirty) { next(); return; }
    const ok = typeof window !== "undefined"
      ? window.confirm(`"${current?.brand.name ?? "This client"}" has unsaved changes. Discard them?`)
      : true;
    if (ok) next();
  }, [isDirty, current]);

  const handleSave = useCallback(async () => {
    if (!current) return;
    if (slugError) { flashToast(`Slug error: ${slugError}. Fix it in tab 01 Client before saving.`, "error"); return; }
    if (colorErrorCount > 0) { flashToast(`${colorErrorCount} invalid color value${colorErrorCount === 1 ? "" : "s"}. Fix in tab 02 Colors before saving.`, "error"); return; }
    setSaveState("saving");
    try {
      // Auto-compress images when the config is heavier than the
      // safe soft limit. Walks every hero / room / upgrade / ad image
      // and re-encodes any data URL to 1280 px wide JPEG @ 0.8. This
      // brings typical 1.5 MB configs back under the 1 MB KV cap
      // without asking the user to manually re-upload anything.
      let configToSave = current;
      const initialBytes = new Blob([JSON.stringify(current)]).size;
      if (initialBytes > KV_SOFT) {
        configToSave = await compressConfigImages(current);
        const compressedBytes = new Blob([JSON.stringify(configToSave)]).size;
        if (compressedBytes < initialBytes) {
          // Surface the optimization so the user understands what just
          // happened, and update in-memory state to keep things in sync.
          setCurrent(configToSave);
          flashToast(`Auto-compressed images: ${Math.round(initialBytes / 1024)} KB → ${Math.round(compressedBytes / 1024)} KB`, "info");
        }
      }
      const res = await fetch("/api/admin/configs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(configToSave) });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Save failed");
      }
      setSaveState("saved");
      setPreviewKey((k) => k + 1);
      setSavedSnapshot(structuredClone(configToSave));
      flashToast(`Client "${configToSave.brand.name}" is now live at /?client=${configToSave.slug}`, "success");
      const list = await fetch("/api/admin/configs").then((r) => r.json());
      setConfigs(list.configs ?? []);
      setTimeout(() => setSaveState("idle"), 2000);
    } catch (err) {
      setSaveState("error");
      const reason = err instanceof Error && err.message ? err.message.slice(0, 160) : "Check your connection and try again.";
      flashToast(`We couldn't save your changes. ${reason}`, "error");
      setTimeout(() => setSaveState("idle"), 4000);
    }
  }, [current, slugError, colorErrorCount, KV_SOFT, flashToast]);

  // Debounced snapshot recorder — runs on every `current` change but
  // waits 500 ms of quiet before pushing the *previous* state to the
  // past stack. This compacts rapid typing into one history entry.
  useEffect(() => {
    if (!current) return;
    if (skipSnapshotRef.current) {
      // Undo/redo just ran — update the baseline to the replayed state
      // without pushing anything, then clear the flag.
      lastSnapshotRef.current = structuredClone(current);
      skipSnapshotRef.current = false;
      return;
    }
    if (snapshotTimerRef.current) clearTimeout(snapshotTimerRef.current);
    snapshotTimerRef.current = setTimeout(() => {
      const prev = lastSnapshotRef.current;
      if (!prev) {
        lastSnapshotRef.current = structuredClone(current);
        return;
      }
      let prevJson = "";
      let currJson = "";
      try { prevJson = JSON.stringify(prev); currJson = JSON.stringify(current); } catch { return; }
      if (prevJson === currJson) return;
      setHistoryPast((past) => {
        const next = [...past, prev];
        return next.length > HISTORY_LIMIT ? next.slice(next.length - HISTORY_LIMIT) : next;
      });
      setHistoryFuture([]); // a new edit invalidates redo
      lastSnapshotRef.current = structuredClone(current);
    }, 500);
    return () => { if (snapshotTimerRef.current) clearTimeout(snapshotTimerRef.current); };
  }, [current, HISTORY_LIMIT]);

  const handleUndo = useCallback(() => {
    if (historyPast.length === 0 || !current) { flashToast("Nothing to undo", "info"); return; }
    // Flush any pending debounced snapshot so the state the user sees
    // becomes a real history entry before we replay past it. Without
    // this, rapid typing followed by an immediate Cmd+Z would lose the
    // in-flight edits because they were never pushed to past.
    if (snapshotTimerRef.current) {
      clearTimeout(snapshotTimerRef.current);
      snapshotTimerRef.current = null;
      const prev = lastSnapshotRef.current;
      let shouldPush = false;
      if (prev) {
        try { shouldPush = JSON.stringify(prev) !== JSON.stringify(current); } catch { shouldPush = false; }
      }
      if (shouldPush && prev) {
        setHistoryPast((past) => {
          const merged = [...past, prev];
          return merged.length > HISTORY_LIMIT ? merged.slice(merged.length - HISTORY_LIMIT) : merged;
        });
        // The pending edit becomes the "future" entry — Cmd+Shift+Z
        // should return here after undo.
        lastSnapshotRef.current = structuredClone(current);
      }
    }
    setHistoryPast((past) => {
      if (past.length === 0) return past;
      const prev = past[past.length - 1];
      setHistoryFuture((future) => {
        const merged = [...future, structuredClone(current)];
        return merged.length > HISTORY_LIMIT ? merged.slice(merged.length - HISTORY_LIMIT) : merged;
      });
      skipSnapshotRef.current = true;
      setCurrent(structuredClone(prev));
      return past.slice(0, -1);
    });
  }, [historyPast.length, current, flashToast, HISTORY_LIMIT]);

  const handleRedo = useCallback(() => {
    if (historyFuture.length === 0 || !current) { flashToast("Nothing to redo", "info"); return; }
    setHistoryFuture((future) => {
      if (future.length === 0) return future;
      const next = future[future.length - 1];
      setHistoryPast((past) => {
        const merged = [...past, structuredClone(current)];
        return merged.length > HISTORY_LIMIT ? merged.slice(merged.length - HISTORY_LIMIT) : merged;
      });
      skipSnapshotRef.current = true;
      setCurrent(structuredClone(next));
      return future.slice(0, -1);
    });
  }, [historyFuture.length, current, flashToast, HISTORY_LIMIT]);

  // beforeunload guard + Cmd+S / Cmd+Z / Cmd+Shift+Z
  useEffect(() => {
    const onUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (current && isDirty && saveState !== "saving") handleSave();
        return;
      }
      // Cmd+Z / Ctrl+Z → undo; Cmd+Shift+Z / Ctrl+Shift+Z → redo.
      // Always intercepted because inputs/textareas are React-controlled
      // off the config state, so native input undo wouldn't actually
      // reach the underlying model anyway.
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
        return;
      }
      // Esc exits preview fullscreen without affecting anything else.
      if (e.key === "Escape" && previewFullscreen) {
        e.preventDefault();
        setPreviewFullscreen(false);
      }
    };
    window.addEventListener("beforeunload", onUnload);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("beforeunload", onUnload);
      window.removeEventListener("keydown", onKey);
    };
  }, [isDirty, current, saveState, handleSave, previewFullscreen, handleUndo, handleRedo]);

  const handleDelete = async () => {
    if (!current) return;
    if (!confirm(`Delete "${current.slug}"? This cannot be undone.`)) return;
    try {
      await fetch(`/api/admin/configs/${encodeURIComponent(current.slug)}`, { method: "DELETE" });
      const list = await fetch("/api/admin/configs").then((r) => r.json());
      setConfigs(list.configs ?? []);
      setCurrent(null);
      flashToast(`Deleted "${current.slug}"`, "info");
    } catch {
      flashToast("Couldn't delete this client. Try again.", "error");
    }
  };

  const handleNew = () => confirmSwitch(() => {
    const next = makeBlankConfig(`client-${Date.now().toString(36).slice(-4)}`);
    setCurrent(next);
    setSavedSnapshot(null); // blank is dirty until first save
    setActiveTab("client");
    resetHistory(next);
  });

  // Duplicate the current in-memory client (including unsaved edits)
  // as a new draft. Generates a non-colliding "{slug}-copy" variant
  // and suffixes the brand name. Starts dirty so the user has to Save
  // before it lands in KV. No confirmSwitch because nothing is lost —
  // the copy carries the current state forward verbatim.
  const handleDuplicate = useCallback(() => {
    if (!current) return;
    const base = `${current.slug}-copy`.replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 58) || "client-copy";
    const taken = new Set(configs.map((c) => c.slug));
    let nextSlug = base;
    let n = 2;
    while (taken.has(nextSlug)) {
      nextSlug = `${base}-${n}`;
      n++;
    }
    const copy = structuredClone(current);
    copy.slug = nextSlug;
    copy.brand = { ...copy.brand, name: `${current.brand.name} (Copy)` };
    setCurrent(copy);
    setSavedSnapshot(null); // copy is dirty until first save
    setActiveTab("client");
    resetHistory(copy);
    flashToast(`Duplicated as "${copy.brand.name}". Save to persist.`, "info");
  }, [current, configs, flashToast, resetHistory]);

  // Export the in-memory client as a pretty-printed JSON file download.
  // Users can re-import these files later to restore a config, or ship
  // them to another TrueOmni environment (staging → prod).
  const handleExportJson = useCallback(() => {
    if (!current) return;
    try {
      const json = JSON.stringify(current, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const stamp = new Date().toISOString().slice(0, 10);
      a.download = `nexi-config-${current.slug}-${stamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      // Warn the user that the file is a full backup — it includes
      // API credentials (HeyGen, Tavus, D-ID, Resend) and the Wi-Fi
      // password in plain text. If they're sharing it with a client
      // or teammate, they should know what's inside.
      flashToast(`"${current.brand.name}" exported as JSON. This file contains API keys and the Wi-Fi password in plain text — share carefully.`, "warning");
    } catch {
      flashToast("Couldn't export this client to JSON", "error");
    }
  }, [current, flashToast]);

  // File input hidden in the dropdown — we trigger it imperatively
  // from the Import menu item.
  const importFileRef = useRef<HTMLInputElement>(null);
  const triggerImportJson = useCallback(() => {
    importFileRef.current?.click();
  }, []);
  const handleImportJsonFile = useCallback(async (file: File) => {
    // Basic sanity: must be JSON, under 5 MB (the KV hard limit is 1 MB
    // but we give headroom for human-edited files that could include
    // comments or extra whitespace).
    if (file.size > 5 * 1024 * 1024) {
      flashToast("Import file is larger than 5 MB", "error");
      return;
    }
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Partial<HotelConfig>;
      // Minimum viable shape: must have brand.name and some slug-ish field.
      if (!parsed || typeof parsed !== "object" || !parsed.brand || typeof parsed.brand !== "object" || typeof parsed.brand.name !== "string") {
        flashToast("That JSON doesn't look like a HotelConfig — missing brand.name", "error");
        return;
      }
      // Run normalizeConfig to backfill any missing sections (new modules,
      // new default fields) so old exported files still work.
      const normalized = normalizeConfig(parsed as HotelConfig);
      // Slug collision handling — if the import re-uses an existing slug
      // that isn't the currently-loaded one, auto-append a suffix.
      const taken = new Set(configs.map((c) => c.slug));
      const savedSlug = savedSnapshot?.slug;
      if (normalized.slug && taken.has(normalized.slug) && normalized.slug !== savedSlug) {
        const base = `${normalized.slug}-imported`.slice(0, 58);
        let nextSlug = base;
        let n = 2;
        while (taken.has(nextSlug)) { nextSlug = `${base}-${n}`; n++; }
        normalized.slug = nextSlug;
      } else if (!normalized.slug) {
        normalized.slug = `imported-${Date.now().toString(36).slice(-4)}`;
      }
      confirmSwitch(() => {
        setCurrent(normalized);
        setSavedSnapshot(null); // imported clients start dirty
        setActiveTab("client");
        resetHistory(normalized);
        flashToast(`Imported "${normalized.brand.name}". Save to persist.`, "info");
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Check the file is valid JSON";
      flashToast(`Import failed: ${msg.slice(0, 120)}`, "error");
    }
  }, [configs, savedSnapshot, confirmSwitch, flashToast, resetHistory]);
  const handlePreset = (p: Preset) => confirmSwitch(() => {
    const next = applyPreset(p);
    setCurrent(next);
    setSavedSnapshot(null); // preset is dirty until first save
    setActiveTab("client");
    resetHistory(next);
  });
  const loadConfig = useCallback((cfg: HotelConfig) => {
    const normalized = normalizeConfig(structuredClone(cfg));
    setCurrent(normalized);
    setSavedSnapshot(structuredClone(normalized));
    setActiveTab("client");
    resetHistory(normalized);
  }, [resetHistory]);

  const handleOpenKiosk = () => { if (current?.slug) window.open(`/?client=${encodeURIComponent(current.slug)}`, "_blank"); };
  const handleCopyLink = async () => {
    if (!current?.slug) return;
    const url = `${window.location.origin}/?client=${encodeURIComponent(current.slug)}`;
    await navigator.clipboard.writeText(url);
    flashToast("Kiosk link copied to clipboard", "info");
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

  // ═══════ EMPTY STATE — saved clients + preset gallery ═══════
  if (!current) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.fontBody, display: "flex", flexDirection: "column" }}>
        <TopBar saveState="idle" configs={configs} currentSlug={null} onSelectClient={(c) => confirmSwitch(() => loadConfig(c))} onSelectPreset={handlePreset} onNew={handleNew} onImportJson={triggerImportJson} onSave={() => {}} onDelete={() => {}} onOpen={() => {}} onCopy={() => {}} disabled dirty={false} configBytes={0} kvSoft={KV_SOFT} kvHard={KV_HARD} />
        <div style={{ flex: 1, overflow: "auto", padding: "40px 40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ maxWidth: 1000, width: "100%", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 40, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <img src="/logos/nexi-logo-dark.svg" alt="NEXI" style={{ height: 56, width: "auto", marginBottom: 10, display: "block" }} />
              <img src="/logos/powered-by-trueomni-dark.svg" alt="Powered by TrueOmni" style={{ height: 14, width: "auto", marginBottom: 28, display: "block", opacity: 0.8 }} />
              <h1 style={{ fontFamily: T.fontDisplay, fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12, lineHeight: 1.1 }}>
                Configure a client, ship the kiosk.
              </h1>
              <p style={{ fontSize: 15, color: T.textDim, lineHeight: 1.6, maxWidth: 560, margin: "0 auto" }}>
                Pick a saved client below, start from a template, or build from scratch. Every kiosk rebrands in real time — no rebuild, no redeploy.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 20, margin: "0 auto" }}>
              {configs.map((cfg) => {
                const enabledModules = cfg.modules?.filter((m) => m.enabled).length ?? 0;
                const roomCount = cfg.rooms?.length ?? 0;
                const upgradeCount = cfg.upgrades?.length ?? 0;
                return (
                <button key={cfg.slug} onClick={() => { confirmSwitch(() => loadConfig(cfg)); }} style={{
                  display: "flex", flexDirection: "column", textAlign: "left",
                  background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16,
                  overflow: "hidden", cursor: "pointer", padding: 0,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)", transition: "all 180ms",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 18px 50px rgba(0,0,0,0.12)"; e.currentTarget.style.borderColor = T.borderHi; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; e.currentTarget.style.borderColor = T.border; }}
                >
                  <div style={{ aspectRatio: "16/9", background: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.55) 100%), url('${cfg.images.heroExterior}') center/cover, ${T.surfaceHi}`, position: "relative" }}>
                    <div style={{ position: "absolute", top: 14, left: 16, display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)", borderRadius: 999, border: "1px solid rgba(255,255,255,0.12)" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.colors.primary, boxShadow: `0 0 8px ${cfg.colors.primary}` }} />
                      <div style={{ color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>Client</div>
                    </div>
                    {cfg.brand.logo && (
                      <div style={{ position: "absolute", top: 14, right: 16, padding: "8px 14px", background: "rgba(255,255,255,0.95)", borderRadius: 8, boxShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
                        <img src={cfg.brand.logo} alt={cfg.brand.name} style={{ height: 22, display: "block", maxWidth: 120, objectFit: "contain" }} />
                      </div>
                    )}
                    <div style={{ position: "absolute", bottom: 16, left: 20, right: 20, color: "#fff" }}>
                      <div style={{ fontFamily: T.fontDisplay, fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", textShadow: "0 2px 8px rgba(0,0,0,0.5)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cfg.brand.name}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", textShadow: "0 1px 4px rgba(0,0,0,0.5)", marginTop: 2 }}>{cfg.brand.tagline || "—"}</div>
                    </div>
                  </div>
                  <div style={{ padding: "14px 20px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: T.surface }}>
                    <div style={{ display: "flex", gap: 14, fontSize: 10, color: T.textMuted, fontFamily: T.fontBody, minWidth: 0 }}>
                      <div><strong style={{ color: T.text, fontSize: 13, fontFamily: T.fontDisplay, fontWeight: 800 }}>{enabledModules}</strong> modules</div>
                      <div><strong style={{ color: T.text, fontSize: 13, fontFamily: T.fontDisplay, fontWeight: 800 }}>{roomCount}</strong> rooms</div>
                      <div><strong style={{ color: T.text, fontSize: 13, fontFamily: T.fontDisplay, fontWeight: 800 }}>{upgradeCount}</strong> upgrades</div>
                    </div>
                    <div style={{ fontSize: 10, color: T.textMuted, fontFamily: "ui-monospace, monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }} title={cfg.slug}>{cfg.slug}</div>
                  </div>
                </button>
              );
              })}
              {PRESETS.map((p) => (
                <button key={p.key} onClick={() => handlePreset(p)} style={{
                  display: "flex", flexDirection: "column", textAlign: "left",
                  background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16,
                  overflow: "hidden", cursor: "pointer", padding: 0,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)", transition: "all 180ms",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 18px 50px rgba(0,0,0,0.12)"; e.currentTarget.style.borderColor = T.borderHi; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; e.currentTarget.style.borderColor = T.border; }}
                >
                  <div style={{ aspectRatio: "16/9", background: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.55) 100%), url('${p.hero}') center/cover`, position: "relative" }}>
                    <div style={{ position: "absolute", top: 14, left: 16, display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)", borderRadius: 999, border: "1px solid rgba(255,255,255,0.12)" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.primary, boxShadow: `0 0 8px ${p.primary}` }} />
                      <div style={{ color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>Template</div>
                    </div>
                    <div style={{ position: "absolute", bottom: 16, left: 20, right: 20, color: "#fff" }}>
                      <div style={{ fontFamily: T.fontDisplay, fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>{p.label}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", textShadow: "0 1px 4px rgba(0,0,0,0.5)", marginTop: 2 }}>{p.tag}</div>
                    </div>
                  </div>
                  <div style={{ padding: "14px 20px 16px", fontSize: 11, color: T.textMuted, background: T.surface }}>
                    Start from this preset → edit everything
                  </div>
                </button>
              ))}
              <button onClick={handleNew} style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center",
                background: "transparent", border: `1.5px dashed ${T.borderHi}`, borderRadius: 16,
                cursor: "pointer", padding: "24px 16px", color: T.textDim,
                transition: "all 180ms", minHeight: 325,
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.borderHi; e.currentTarget.style.color = T.textDim; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 14, border: `1.5px dashed currentColor`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <svg {...sp} width={22} height={22}><path d="M12 5v14M5 12h14" /></svg>
                </div>
                <div style={{ fontFamily: T.fontDisplay, fontSize: 18, fontWeight: 800, color: T.text, marginBottom: 4 }}>Blank</div>
                <div style={{ fontSize: 12, color: T.textDim }}>Start from scratch</div>
              </button>
            </div>
          </div>
        </div>
        {toast && <ToastBar msg={toast.msg} tone={toast.tone} />}
        <input
          ref={importFileRef}
          type="file"
          accept="application/json,.json"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImportJsonFile(file);
            e.target.value = "";
          }}
        />
      </div>
    );
  }

  const c = current;
  const languagesModuleOn = c.modules.find((m) => m.id === "languages")?.enabled !== false;
  const adsModuleOn = c.modules.find((m) => m.id === "ads")?.enabled !== false;
  const surveyModuleOn = c.modules.find((m) => m.id === "survey")?.enabled !== false;
  const faqModuleOn = c.modules.find((m) => m.id === "faq")?.enabled !== false;
  const visibleSections = SECTIONS.filter((s) => {
    if (s.key === "languages" && !languagesModuleOn) return false;
    if (s.key === "ads" && !adsModuleOn) return false;
    if (s.key === "survey" && !surveyModuleOn) return false;
    if (s.key === "faq" && !faqModuleOn) return false;
    return true;
  });
  if (activeTab === "languages" && !languagesModuleOn) setTimeout(() => setActiveTab("client"), 0);
  if (activeTab === "ads" && !adsModuleOn) setTimeout(() => setActiveTab("client"), 0);
  if (activeTab === "survey" && !surveyModuleOn) setTimeout(() => setActiveTab("client"), 0);
  if (activeTab === "faq" && !faqModuleOn) setTimeout(() => setActiveTab("client"), 0);
  const activeSection = visibleSections.find((s) => s.key === activeTab) ?? SECTIONS[0];

  return (
    <div style={{ height: "100vh", background: T.bg, color: T.text, fontFamily: T.fontBody, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <TopBar
        brandName={c.brand.name}
        saveState={saveState}
        configs={configs}
        currentSlug={c.slug}
        onSelectClient={(cfg) => { confirmSwitch(() => loadConfig(cfg)); }}
        onSelectPreset={handlePreset}
        onSave={handleSave}
        onDelete={handleDelete}
        onOpen={handleOpenKiosk}
        onCopy={handleCopyLink}
        onNew={handleNew}
        onDuplicate={handleDuplicate}
        onExportJson={handleExportJson}
        onImportJson={triggerImportJson}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyPast.length > 0}
        canRedo={historyFuture.length > 0}
        onBrandNameChange={(v) => patchBrand("name", v)}
        dirty={isDirty}
        configBytes={configBytes}
        kvSoft={KV_SOFT}
        kvHard={KV_HARD}
        saveDisabled={overKvHard || !!slugError || colorErrorCount > 0}
      />

      {/* Tab bar */}
      <div style={{ height: 52, borderBottom: `1px solid ${T.border}`, background: T.surface, display: "flex", alignItems: "center", padding: "0 24px", gap: 2, flexShrink: 0, overflowX: "auto", scrollbarWidth: "none" }}>
        <style>{`.tabs-strip::-webkit-scrollbar{display:none}`}</style>
        <div className="tabs-strip" style={{ display: "flex", gap: 2, height: "100%" }}>
          {visibleSections.map((s) => {
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
                {active && isDirty && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#D4960A", flexShrink: 0 }} />}
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
                  <Field label="Kiosk Slug">
                    <input
                      style={{ ...input, fontFamily: "ui-monospace, monospace", borderColor: slugError ? T.error : T.border }}
                      placeholder="hotel-slug"
                      value={c.slug}
                      onChange={(e) => patch("slug", slugify(e.target.value))}
                    />
                    {slugError && <div style={{ fontSize: 9, color: T.error, marginTop: 3, fontWeight: 600 }}>{slugError}</div>}
                  </Field>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                  <ImageField label="Logo (light)" value={c.brand.logo} onChange={(v) => patchBrand("logo", v)} compact spec={SPEC_LOGO} />
                  <ImageField label="Logo (dark)" value={c.brand.logoWhite} onChange={(v) => patchBrand("logoWhite", v)} compact spec={SPEC_LOGO} />
                  <ImageField label="Icon (square)" value={c.brand.icon} onChange={(v) => patchBrand("icon", v)} compact spec={SPEC_ICON} />
                  <ImageField label="Icon (white)" value={c.brand.iconWhite} onChange={(v) => patchBrand("iconWhite", v)} compact spec={SPEC_ICON} />
                  <ImageField label="Loading Spinner" value={c.brand.spinner ?? ""} onChange={(v) => patchBrand("spinner", v)} compact spec={SPEC_ICON} />
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
                <GradientField
                  label="Primary Gradient (optional)"
                  value={c.colors.primaryGradient ?? ""}
                  onChange={(v) => patchColors("primaryGradient", v)}
                />
                <div style={{ fontSize: 9, color: T.textMuted, padding: "0 2px", lineHeight: 1.4 }}>
                  Applies to primary buttons and other large primary surfaces. Icons, text and borders still use the solid <strong>Primary</strong> above. Leave empty to disable.
                </div>

                {/* Light / Dark toggle — drives the preview iframe theme */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "2px 0" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>
                    Preview mode
                  </div>
                  <div style={{ display: "flex", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 3, gap: 2 }}>
                    <button
                      onClick={() => setKioskTheme("light")}
                      style={{
                        display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 6,
                        border: "none", cursor: "pointer", fontFamily: T.fontBody, fontSize: 11, fontWeight: 700,
                        background: previewTheme === "light" ? T.accent : "transparent",
                        color: previewTheme === "light" ? "#fff" : T.textDim,
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
                      Light
                    </button>
                    <button
                      onClick={() => setKioskTheme("dark")}
                      style={{
                        display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 6,
                        border: "none", cursor: "pointer", fontFamily: T.fontBody, fontSize: 11, fontWeight: 700,
                        background: previewTheme === "dark" ? T.accent : "transparent",
                        color: previewTheme === "dark" ? "#fff" : T.textDim,
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
                      Dark
                    </button>
                  </div>
                  <div style={{ fontSize: 10, color: T.textMuted, marginLeft: 4 }}>
                    Edits below update the kiosk in real time
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <ColorGroup title="Light Mode" active={previewTheme === "light"}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <ColorField label="Page background" value={c.colors.light.bg} onChange={(v) => patchColors("light.bg", v)} />
                      <ColorField label="Card / surface" value={c.colors.light.bgCard} onChange={(v) => patchColors("light.bgCard", v)} />
                      <ColorField label="Text color" value={c.colors.light.text} onChange={(v) => patchColors("light.text", v)} />
                      <ColorField label="Border" value={c.colors.light.border} onChange={(v) => patchColors("light.border", v)} />
                    </div>
                  </ColorGroup>
                  <ColorGroup title="Dark Mode" active={previewTheme === "dark"}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <ColorField label="Page background" value={c.colors.dark.bg} onChange={(v) => patchColors("dark.bg", v)} />
                      <ColorField label="Card / surface" value={c.colors.dark.bgCard} onChange={(v) => patchColors("dark.bgCard", v)} />
                      <ColorField label="Text color" value={c.colors.dark.text} onChange={(v) => patchColors("dark.text", v)} />
                      <ColorField label="Border" value={c.colors.dark.border} onChange={(v) => patchColors("dark.border", v)} />
                    </div>
                  </ColorGroup>
                </div>
              </div>
            )}

            {activeTab === "fonts" && (
              <FontsTab
                config={c}
                allFamilies={[...GOOGLE_FONTS, ...(c.customFonts ?? []).map((f) => f.family)]}
                onPatchFont={patchFonts}
                onAddFont={addCustomFont}
                onRemoveFont={removeCustomFont}
                onToastError={(msg) => flashToast(msg, "error")}
              />
            )}

            {activeTab === "images" && (() => {
              const heroSpecLine = `${SPEC_HERO.formats} · max ${formatBytes(SPEC_HERO.maxBytes)}${SPEC_HERO.ratio ? ` · ${SPEC_HERO.ratio}` : ""}`;
              return (
                <div style={{ display: "grid", gap: 14 }}>
                  <div style={{ fontSize: 10, color: T.textMuted, padding: "0 2px", display: "flex", alignItems: "center", gap: 8 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                    All hero images share the same spec: <strong style={{ color: T.textDim, fontWeight: 700 }}>{heroSpecLine}</strong>. Click any thumbnail to zoom.
                  </div>
                  <HeroExteriorEditor
                    imageUrl={c.images.heroExterior}
                    asset={c.images.heroExteriorAsset}
                    onImageChange={(v) => patchImages("heroExterior", v)}
                    onAssetChange={(a) => setCurrent((x) => x ? { ...x, images: { ...x.images, heroExteriorAsset: a } } : x)}
                    onToastError={(msg) => flashToast(msg, "error")}
                  />
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Hotel venue (static)</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
                      <ImageField label="Hero Lobby (dashboard)" value={c.images.heroLobby} onChange={(v) => patchImages("heroLobby", v)} spec={SPEC_HERO} hideSpec thumbSize={88} />
                      <ImageField label="Hero Pool" value={c.images.heroPool} onChange={(v) => patchImages("heroPool", v)} spec={SPEC_HERO} hideSpec thumbSize={88} />
                      <ImageField label="Hero Spa" value={c.images.heroSpa} onChange={(v) => patchImages("heroSpa", v)} spec={SPEC_HERO} hideSpec thumbSize={88} />
                      <ImageField label="Hero Restaurant" value={c.images.heroRestaurant} onChange={(v) => patchImages("heroRestaurant", v)} spec={SPEC_HERO} hideSpec thumbSize={88} />
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Flow backdrops</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
                      <ImageField label="Welcome (check-in intro)" value={c.images.heroWelcome} onChange={(v) => patchImages("heroWelcome", v)} spec={SPEC_HERO} hideSpec thumbSize={88} />
                      <ImageField label="Success / Confirmation" value={c.images.heroSuccess} onChange={(v) => patchImages("heroSuccess", v)} spec={SPEC_HERO} hideSpec thumbSize={88} />
                      <ImageField label="Duplicate Key" value={c.images.heroKey} onChange={(v) => patchImages("heroKey", v)} spec={SPEC_HERO} hideSpec thumbSize={88} />
                      <ImageField label="Night / Late stay" value={c.images.heroNight} onChange={(v) => patchImages("heroNight", v)} spec={SPEC_HERO} hideSpec thumbSize={88} />
                      <ImageField label="Booking flow" value={c.images.heroBooking} onChange={(v) => patchImages("heroBooking", v)} spec={SPEC_HERO} hideSpec thumbSize={88} />
                      <ImageField label="Loading / Processing" value={c.images.heroLoading} onChange={(v) => patchImages("heroLoading", v)} spec={SPEC_HERO} hideSpec thumbSize={88} />
                      <ImageField label="Events" value={c.images.heroEvents} onChange={(v) => patchImages("heroEvents", v)} spec={SPEC_HERO} hideSpec thumbSize={88} />
                    </div>
                  </div>
                </div>
              );
            })()}

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
              <div style={{ display: "grid", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Property Management (PMS)</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    <SecretField label="Cloudbeds" help="PMS + reservations" value={c.integrations?.cloudbedsApiKey ?? ""} onChange={(v) => patchIntegrations("cloudbedsApiKey", v)} />
                    <SecretField label="MEWS" help="PMS" value={c.integrations?.mewsApiKey ?? ""} onChange={(v) => patchIntegrations("mewsApiKey", v)} />
                    <SecretField label="Oracle OPERA" help="Hospitality PMS" value={c.integrations?.oracleApiKey ?? ""} onChange={(v) => patchIntegrations("oracleApiKey", v)} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Payments</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    <SecretField label="Stripe" help="Payment processing" value={c.integrations?.stripeApiKey ?? ""} onChange={(v) => patchIntegrations("stripeApiKey", v)} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Destination & experiences</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    <SecretField label="SimpleView" help="DMO CMS" value={c.integrations?.simpleViewApiKey ?? ""} onChange={(v) => patchIntegrations("simpleViewApiKey", v)} />
                    <SecretField label="Trybe" help="Spa + experiences" value={c.integrations?.trybeApiKey ?? ""} onChange={(v) => patchIntegrations("trybeApiKey", v)} />
                    <SecretField label="Book4Time" help="Spa booking" value={c.integrations?.book4timeApiKey ?? ""} onChange={(v) => patchIntegrations("book4timeApiKey", v)} />
                    <SecretField label="SkyNav" help="Wayfinding" value={c.integrations?.skyNavApiKey ?? ""} onChange={(v) => patchIntegrations("skyNavApiKey", v)} />
                    <SecretField label="Threshold 360" help="Virtual tours" value={c.integrations?.threshold360ApiKey ?? ""} onChange={(v) => patchIntegrations("threshold360ApiKey", v)} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Avatar, video & email</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                    <SecretField label="HeyGen" help="Avatar streaming" value={c.integrations?.heygenApiKey ?? ""} onChange={(v) => patchIntegrations("heygenApiKey", v)} />
                    <SecretField label="Tavus" help="Conversational video" value={c.integrations?.tavusApiKey ?? ""} onChange={(v) => patchIntegrations("tavusApiKey", v)} />
                    <SecretField label="D-ID" help="Avatar fallback" value={c.integrations?.didApiKey ?? ""} onChange={(v) => patchIntegrations("didApiKey", v)} />
                    <SecretField label="Resend" help="Email" value={c.integrations?.resendApiKey ?? ""} onChange={(v) => patchIntegrations("resendApiKey", v)} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "languages" && languagesModuleOn && (() => {
              const enabled = c.enabledLocales ?? ADMIN_LOCALES.map((l) => l.code);
              return (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                    {ADMIN_LOCALES.map((l) => {
                      const on = enabled.includes(l.code);
                      return (
                        <button
                          key={l.code}
                          onClick={() => toggleLocale(l.code)}
                          style={{
                            display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6,
                            padding: "12px 14px", borderRadius: 10, textAlign: "left",
                            background: on ? `${T.accent}0A` : T.surface,
                            border: `1.5px solid ${on ? T.accent : T.border}`,
                            cursor: "pointer", transition: "all 150ms",
                            opacity: on ? 1 : 0.6,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                            <div style={{ fontSize: 22, lineHeight: 1 }}>{l.flag}</div>
                            <Toggle on={on} onClick={(e) => { e.stopPropagation(); toggleLocale(l.code); }} />
                          </div>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 6, minWidth: 0 }}>
                            <div style={{ fontFamily: T.fontDisplay, fontSize: 14, fontWeight: 800, color: T.text, letterSpacing: "-0.01em" }}>{l.name}</div>
                            <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, fontFamily: "ui-monospace, monospace", textTransform: "uppercase", letterSpacing: 0.5 }}>{l.code}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: 10, fontSize: 10, color: T.textMuted }}>
                    {enabled.length === 0
                      ? "⚠ No locales selected — the language picker will be hidden even if the Languages module is on."
                      : `${enabled.length} of ${ADMIN_LOCALES.length} locales will appear in the kiosk picker.`}
                  </div>
                </div>
              );
            })()}

            {activeTab === "policies" && (
              <PoliciesTab policies={c.policies} onPatch={patchPolicies} onToastError={(msg) => flashToast(msg, "error")} />
            )}

            {activeTab === "ads" && adsModuleOn && (
              <AdsTab
                ads={c.ads ?? DEFAULT_ADS}
                onPatch={patchAds}
                onUpdateItem={updateAdItem}
                onAdd={addAdItem}
                onRemove={removeAdItem}
                onReorder={reorderAds}
              />
            )}

            {activeTab === "survey" && surveyModuleOn && (
              <SurveyTab
                survey={c.survey ?? DEFAULT_SURVEY}
                onPatch={patchSurvey}
                onUpdateQ={updateSurveyQ}
                onAddQ={addSurveyQ}
                onRemoveQ={removeSurveyQ}
              />
            )}

            {activeTab === "faq" && faqModuleOn && (
              <FaqTab
                faq={c.faq ?? DEFAULT_FAQ}
                onPatch={patchFaq}
                onUpdateItem={updateFaqItem}
                onAdd={addFaqItem}
                onRemove={removeFaqItem}
              />
            )}
          </div>
        </div>

        {/* Preview panel — bottom 50%, left nav + iframe 16:9 with breathing room.
            Goes fullscreen when previewFullscreen is true: position fixed over the
            entire viewport so the iframe has maximum real estate. ModuleNav stays
            visible as the left rail, and a close button lands in the top-right. */}
        <div style={{
          borderTop: `1px solid ${T.border}`, background: T.surface, display: "flex", gap: 0,
          ...(previewFullscreen
            ? { position: "fixed", inset: 0, zIndex: 200, height: "100vh", width: "100vw", minHeight: 0, overflow: "hidden" }
            : { flex: "0 0 50%", minHeight: 0, overflow: "hidden" }
          ),
        }}>
          <ModuleNav iframeRef={iframeRef} modules={c.modules} />
          {/* containerType size lets us compute the largest 16:9 box that
              fits inside this panel using cqw / cqh units. This is the
              only reliable way to keep the iframe exactly 16:9 in both
              normal and fullscreen modes — KioskFrame in embed mode
              has aspectRatio: auto so it inherits whatever dimensions
              the iframe gives it, which means any admin-side ratio
              drift distorts the kiosk inside. */}
          <div style={{ flex: 1, position: "relative", padding: previewFullscreen ? "28px 56px 36px" : "34px 58px 38px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0, minWidth: 0, background: T.surface, containerType: "size" }}>
            <button
              onClick={() => setPreviewFullscreen((v) => !v)}
              title={previewFullscreen ? "Exit fullscreen (Esc)" : "Expand preview to fullscreen"}
              style={{
                position: "absolute", top: 14, right: 14, zIndex: 2,
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 11px", borderRadius: 7,
                background: T.surface, border: `1px solid ${T.border}`,
                color: T.textDim, cursor: "pointer",
                fontFamily: T.fontBody, fontSize: 10, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                transition: "all 120ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = T.accent; e.currentTarget.style.borderColor = T.accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = T.textDim; e.currentTarget.style.borderColor = T.border; }}
            >
              {previewFullscreen ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v4a1 1 0 01-1 1H3M21 8h-4a1 1 0 01-1-1V3M3 16h4a1 1 0 011 1v4M16 21v-4a1 1 0 011-1h4" /></svg>
                  Exit
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                  Fullscreen
                </>
              )}
            </button>
            <div style={{
              // width = min(container width, container height × 16/9).
              // That gives the largest 16:9 rect that fits regardless of
              // container proportions. aspectRatio seals the ratio so
              // height follows width exactly.
              width: "min(100cqw, calc(100cqh * 16 / 9))",
              aspectRatio: "16 / 9",
              background: T.surface,
              display: "flex",
            }}>
              <iframe ref={iframeRef} key={previewKey} src={previewUrl} onLoad={handleIframeLoad} style={{ width: "100%", height: "100%", border: "none", display: "block", background: T.surface }} title="Kiosk preview" />
            </div>
          </div>
        </div>
      </div>

      {toast && <ToastBar msg={toast.msg} tone={toast.tone} />}
      <input
        ref={importFileRef}
        type="file"
        accept="application/json,.json"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImportJsonFile(file);
          e.target.value = "";
        }}
      />

      <style>{`
        input:focus, select:focus { border-color: ${T.accent} !important; }
        button:hover { filter: brightness(1.02); }
        @keyframes toastBackdropIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes toastCardIn { from { opacity: 0; transform: scale(0.94) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>
    </div>
  );
}

// ═══════════════════ SUBCOMPONENTS ═══════════════════

function TopBar({ brandName, saveState, configs, currentSlug, onSelectClient, onSave, onDelete, onOpen, onCopy, onNew, onSelectPreset, onDuplicate, onExportJson, onImportJson, onUndo, onRedo, canUndo, canRedo, onBrandNameChange, disabled, dirty, configBytes, kvSoft, kvHard, saveDisabled }: {
  brandName?: string; saveState: "idle" | "saving" | "saved" | "error";
  configs: HotelConfig[]; currentSlug: string | null; onSelectClient: (c: HotelConfig) => void;
  onSave: () => void; onDelete: () => void; onOpen: () => void; onCopy: () => void; onNew: () => void;
  onSelectPreset?: (p: Preset) => void;
  onDuplicate?: () => void;
  onExportJson?: () => void;
  onImportJson?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onBrandNameChange?: (v: string) => void; disabled?: boolean;
  dirty?: boolean; configBytes?: number; kvSoft?: number; kvHard?: number; saveDisabled?: boolean;
}) {
  const kb = Math.round((configBytes ?? 0) / 1024);
  const soft = (kvSoft ?? 700 * 1024);
  const hard = (kvHard ?? 950 * 1024);
  const bytes = configBytes ?? 0;
  const chipColor = bytes > hard ? T.error : bytes > soft ? "#D4960A" : T.success;
  const chipBg = bytes > hard ? `${T.error}12` : bytes > soft ? "#D4960A12" : `${T.success}12`;
  return (
    <div style={{ height: 64, borderBottom: `1px solid ${T.border}`, background: T.surface, display: "flex", alignItems: "center", padding: "0 24px", gap: 16, flexShrink: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3, flexShrink: 0 }}>
        <img src="/logos/nexi-logo-dark.svg" alt="NEXI" style={{ height: 22, width: "auto", display: "block" }} />
        <img src="/logos/powered-by-trueomni-dark.svg" alt="Powered by TrueOmni" style={{ height: 8, width: "auto", display: "block", opacity: 0.8 }} />
      </div>

      <ClientsDropdown configs={configs} currentSlug={currentSlug} onSelect={onSelectClient} onNew={onNew} onSelectPreset={onSelectPreset} onDuplicate={onDuplicate} onExportJson={onExportJson} onImportJson={onImportJson} />

      {!disabled && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <input value={brandName ?? ""} onChange={(e) => onBrandNameChange?.(e.target.value)} placeholder="Hotel name"
            style={{ background: "transparent", border: "none", outline: "none", fontFamily: T.fontDisplay, fontSize: 17, fontWeight: 700, color: T.text, letterSpacing: "-0.01em", minWidth: 0, flex: 1, padding: 0 }} />
          {dirty && (
            <div style={{ fontSize: 10, color: "#D4960A", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4960A" }} />
              Unsaved changes
            </div>
          )}
        </div>
      )}
      {disabled && <div style={{ flex: 1 }} />}

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {!disabled && (
          <>
            {onUndo && onRedo && (
              <div style={{ display: "flex", gap: 2, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 7, padding: 2, flexShrink: 0 }}>
                <button
                  onClick={onUndo}
                  disabled={!canUndo}
                  title="Undo (⌘Z)"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 28, height: 28, borderRadius: 5, border: "none",
                    background: "transparent",
                    color: canUndo ? T.textDim : T.textMuted,
                    cursor: canUndo ? "pointer" : "not-allowed",
                    opacity: canUndo ? 1 : 0.4,
                    transition: "all 120ms",
                  }}
                  onMouseEnter={(e) => { if (canUndo) { e.currentTarget.style.background = `${T.accent}14`; e.currentTarget.style.color = T.accent; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = canUndo ? T.textDim : T.textMuted; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 00-15-6.7L3 13" /></svg>
                </button>
                <button
                  onClick={onRedo}
                  disabled={!canRedo}
                  title="Redo (⌘⇧Z)"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 28, height: 28, borderRadius: 5, border: "none",
                    background: "transparent",
                    color: canRedo ? T.textDim : T.textMuted,
                    cursor: canRedo ? "pointer" : "not-allowed",
                    opacity: canRedo ? 1 : 0.4,
                    transition: "all 120ms",
                  }}
                  onMouseEnter={(e) => { if (canRedo) { e.currentTarget.style.background = `${T.accent}14`; e.currentTarget.style.color = T.accent; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = canRedo ? T.textDim : T.textMuted; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0115-6.7L21 13" /></svg>
                </button>
              </div>
            )}
            <div
              title={`${kb} KB used of 1 MB KV limit`}
              style={{ padding: "5px 10px", borderRadius: 6, background: chipBg, border: `1px solid ${chipColor}33`, color: chipColor, fontSize: 10, fontWeight: 700, fontFamily: "ui-monospace, monospace", letterSpacing: 0.3, flexShrink: 0 }}
            >
              {kb} KB
            </div>
            <SaveStatus state={saveState} />
            <button onClick={onCopy} style={tbBtn}>Copy link</button>
            <button onClick={onOpen} style={{ ...tbBtn, display: "flex", alignItems: "center", gap: 6 }}>
              Open kiosk
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M7 7h10v10" /></svg>
            </button>
            <button onClick={onDelete} style={{ ...tbBtn, color: T.error }}>Delete</button>
            <button
              onClick={onSave}
              title={saveDisabled ? "Click to see what needs fixing" : dirty ? "Cmd+S" : "No changes"}
              style={{
                padding: "9px 20px", borderRadius: 8, fontSize: 12, fontWeight: 700, fontFamily: T.fontBody,
                cursor: "pointer",
                background: saveDisabled ? "#D4960A" : T.accent,
                border: `1px solid ${saveDisabled ? "#D4960A" : T.accent}`,
                color: "#fff",
                boxShadow: dirty ? `0 0 0 3px ${saveDisabled ? "#D4960A22" : T.accent + "22"}, 0 4px 14px rgba(0,0,0,0.1)` : `0 4px 14px rgba(0,0,0,0.1)`,
                opacity: !dirty && !saveDisabled ? 0.85 : 1,
                transition: "all 150ms",
              }}
            >
              {saveState === "saving" ? "Saving…" : saveDisabled ? "⚠ Save" : dirty ? "Save changes" : "Save"}
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

function ClientsDropdown({ configs, currentSlug, onSelect, onNew, onSelectPreset, onDuplicate, onExportJson, onImportJson }: {
  configs: HotelConfig[]; currentSlug: string | null; onSelect: (c: HotelConfig) => void; onNew: () => void;
  onSelectPreset?: (p: Preset) => void;
  onDuplicate?: () => void;
  onExportJson?: () => void;
  onImportJson?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  // Reset query + autofocus search whenever the dropdown opens.
  useEffect(() => {
    if (!open) { setQuery(""); return; }
    const t = setTimeout(() => searchRef.current?.focus(), 20);
    return () => clearTimeout(t);
  }, [open]);

  const currentLabel = currentSlug ? configs.find((c) => c.slug === currentSlug)?.brand.name ?? "Unsaved" : "Select client…";

  // Case-insensitive substring match against brand.name and slug for
  // clients, and label/tag for presets. Empty query shows everything.
  const q = query.trim().toLowerCase();
  const filteredConfigs = q
    ? configs.filter((cfg) => cfg.brand.name.toLowerCase().includes(q) || cfg.slug.toLowerCase().includes(q))
    : configs;
  const filteredPresets = q
    ? PRESETS.filter((p) => p.label.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q) || p.key.toLowerCase().includes(q))
    : PRESETS;
  const noResults = q !== "" && filteredConfigs.length === 0 && filteredPresets.length === 0;

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
          position: "absolute", top: 44, left: 0, minWidth: 320, background: T.surface,
          border: `1px solid ${T.border}`, borderRadius: 10, boxShadow: "0 16px 50px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.04)",
          padding: 6, zIndex: 50, maxHeight: 460, display: "flex", flexDirection: "column",
        }}>
          {/* Search input — sticky header so it's always visible while scrolling the list */}
          <div style={{ padding: "4px 4px 6px", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: T.surfaceHi, border: `1px solid ${T.border}`, borderRadius: 7 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Escape") { e.stopPropagation(); if (query) setQuery(""); else setOpen(false); } }}
                placeholder="Search clients or templates…"
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 12, fontFamily: T.fontBody, color: T.text, padding: 0, minWidth: 0 }}
              />
              {query && (
                <button onClick={() => { setQuery(""); searchRef.current?.focus(); }} title="Clear search" style={{ background: "transparent", border: "none", padding: 2, cursor: "pointer", color: T.textMuted, display: "flex" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          </div>

          <div style={{ overflow: "auto", flex: 1, minHeight: 0 }}>
            <div style={{ padding: "6px 10px 4px", fontSize: 9, fontWeight: 700, color: T.textMuted, letterSpacing: 1.2, textTransform: "uppercase" }}>
              {configs.length === 0 ? "No saved clients" : q ? `${filteredConfigs.length} of ${configs.length} saved` : `${configs.length} saved`}
            </div>
            {filteredConfigs.map((cfg) => {
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
            {onSelectPreset && filteredPresets.length > 0 && (
              <>
                <div style={{ height: 1, background: T.border, margin: "6px 4px" }} />
                <div style={{ padding: "6px 10px 4px", fontSize: 9, fontWeight: 700, color: T.textMuted, letterSpacing: 1.2, textTransform: "uppercase" }}>
                  Templates
                </div>
                {filteredPresets.map((p) => (
                  <button key={p.key} onClick={() => { onSelectPreset(p); setOpen(false); }} style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 10px", borderRadius: 7,
                    border: "none", background: "transparent", color: T.text, cursor: "pointer", textAlign: "left",
                  }}>
                    <div style={{ width: 26, height: 26, borderRadius: 6, background: p.primary, flexShrink: 0 }} />
                    <div style={{ overflow: "hidden", flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: T.text, fontFamily: T.fontDisplay, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.label}</div>
                      <div style={{ fontSize: 10, color: T.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.tag}</div>
                    </div>
                  </button>
                ))}
              </>
            )}
            {noResults && (
              <div style={{ padding: "18px 12px", textAlign: "center", fontSize: 11, color: T.textMuted }}>
                No matches for <strong style={{ color: T.text, fontWeight: 700 }}>“{query}”</strong>
              </div>
            )}
          </div>

          <div style={{ height: 1, background: T.border, margin: "6px 4px", flexShrink: 0 }} />
          {onDuplicate && currentSlug && (
            <button onClick={() => { onDuplicate(); setOpen(false); }} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 10px", borderRadius: 7,
              border: "none", background: "transparent", color: T.text, cursor: "pointer", textAlign: "left",
              fontFamily: T.fontBody, fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>
              <div style={{ width: 26, height: 26, borderRadius: 6, background: T.surfaceHi, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.border}` }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
              </div>
              Duplicate current client
            </button>
          )}
          {onExportJson && currentSlug && (
            <button onClick={() => { onExportJson(); setOpen(false); }} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 10px", borderRadius: 7,
              border: "none", background: "transparent", color: T.text, cursor: "pointer", textAlign: "left",
              fontFamily: T.fontBody, fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>
              <div style={{ width: 26, height: 26, borderRadius: 6, background: T.surfaceHi, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.border}` }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
              </div>
              Export as JSON
            </button>
          )}
          {onImportJson && (
            <button onClick={() => { onImportJson(); setOpen(false); }} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 10px", borderRadius: 7,
              border: "none", background: "transparent", color: T.text, cursor: "pointer", textAlign: "left",
              fontFamily: T.fontBody, fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>
              <div style={{ width: 26, height: 26, borderRadius: 6, background: T.surfaceHi, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.border}` }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
              </div>
              Import from JSON
            </button>
          )}
          <button onClick={() => { onNew(); setOpen(false); }} style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 10px", borderRadius: 7,
            border: "none", background: "transparent", color: T.accent, cursor: "pointer", textAlign: "left",
            fontFamily: T.fontBody, fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}>
            <div style={{ width: 26, height: 26, borderRadius: 6, background: `${T.accent}22`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.accent}44` }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            </div>
            Blank — start from scratch
          </button>
        </div>
      )}
    </div>
  );
}

function ImageField({ label, value: rawValue, onChange, compact, spec = SPEC_DEFAULT, hideSpec, thumbSize }: { label: string; value: string | undefined; onChange: (v: string) => void; compact?: boolean; spec?: UploadSpec; hideSpec?: boolean; thumbSize?: number }) {
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

function ImageZoomModal({ src, label, spec, onClose, onReplace, onRemove }: {
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

function HeroExteriorEditor({ imageUrl, asset, onImageChange, onAssetChange, onToastError }: {
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

  const pill = (kind: HeroAsset["kind"], label: string): React.CSSProperties => ({
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

function AdsTab({ ads, onPatch, onUpdateItem, onAdd, onRemove, onReorder }: {
  ads: AdsConfig;
  onPatch: (p: Partial<AdsConfig>) => void;
  onUpdateItem: (i: number, p: Partial<AdItem>) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
  onReorder: (arr: AdItem[]) => void;
}) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {/* Global settings */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 12 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Global settings</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, alignItems: "start" }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Show on Dashboard</div>
            <Toggle on={ads.showOnDashboard} onClick={(e) => { e.stopPropagation(); onPatch({ showOnDashboard: !ads.showOnDashboard }); }} />
          </div>
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>
              First ad delay: {(ads.dashboardDelayMs / 1000).toFixed(1)}s
            </div>
            <input
              type="range"
              min={0}
              max={15000}
              step={500}
              value={ads.dashboardDelayMs}
              onChange={(e) => onPatch({ dashboardDelayMs: Number(e.target.value) })}
              style={{ width: "100%", accentColor: T.accent }}
            />
          </div>
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>
              Auto-dismiss: {ads.autoDismissMs === 0 ? "off" : `${(ads.autoDismissMs / 1000).toFixed(1)}s`}
            </div>
            <input
              type="range"
              min={0}
              max={30000}
              step={1000}
              value={ads.autoDismissMs}
              onChange={(e) => onPatch({ autoDismissMs: Number(e.target.value) })}
              style={{ width: "100%", accentColor: T.accent }}
            />
          </div>
          <div style={{ gridColumn: "span 3" }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Rotation</div>
            <div style={{ display: "flex", gap: 6 }}>
              {(["first", "random"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => onPatch({ rotation: opt })}
                  style={{
                    padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 700, fontFamily: T.fontBody, cursor: "pointer",
                    background: ads.rotation === opt ? T.accent : "transparent",
                    color: ads.rotation === opt ? "#fff" : T.textDim,
                    border: `1px solid ${ads.rotation === opt ? T.accent : T.border}`,
                    textTransform: "capitalize",
                  }}
                >
                  {opt === "first" ? "Always first" : "Random"}
                </button>
              ))}
              <div style={{ fontSize: 10, color: T.textMuted, alignSelf: "center", marginLeft: 6 }}>
                {ads.rotation === "first" ? "Only shows the first enabled ad." : "Picks one at random on each dashboard mount."}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items list */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>
            {ads.items.length} ads
          </div>
          <div style={{ fontSize: 10, color: T.textMuted }}>Drag to reorder</div>
        </div>
        {ads.items.length > 0 ? (
          <Reorder.Group axis="y" values={ads.items} onReorder={onReorder} style={{ display: "grid", gap: 10, listStyle: "none", padding: 0, margin: 0 }}>
            {ads.items.map((ad, i) => (
              <Reorder.Item key={ad.id} value={ad} style={{ listStyle: "none" }}>
                <AdCard ad={ad} onChange={(p) => onUpdateItem(i, p)} onRemove={() => onRemove(i)} />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        ) : (
          <div style={{ padding: 24, textAlign: "center", background: T.surface, border: `1.5px dashed ${T.borderHi}`, borderRadius: 10, color: T.textDim, fontSize: 12 }}>
            No ads yet. Add one below.
          </div>
        )}
        <button onClick={onAdd} style={addCardBtn}>+ Add ad</button>
      </div>
    </div>
  );
}

const AD_TYPE_LABELS: Record<AdType, string> = {
  popup: "Popup",
  hero: "Hero card",
  bottomBar: "Bottom bar",
  sideBanner: "Side banner",
};

/**
 * Canonical list of kiosk screen IDs grouped by module, used by
 * the ScreenPicker component. The `prefix` is used for the
 * "select all in module" shortcut which serializes to e.g. "CKI-*".
 */
const SCREEN_GROUPS: { module: string; prefix: string; screens: { id: string; title: string }[] }[] = [
  { module: "Idle & Welcome", prefix: "IDL", screens: [
    { id: "IDL-01", title: "Idle / attract" },
    { id: "ONB-02", title: "Action select" },
  ]},
  { module: "Dashboard", prefix: "DSH", screens: [
    { id: "DSH-01", title: "Dashboard" },
  ]},
  { module: "Check-in", prefix: "CKI", screens: [
    { id: "CKI-01", title: "Reservation lookup" },
    { id: "CKI-01q", title: "QR scan" },
    { id: "CKI-02a", title: "Camera permission" },
    { id: "CKI-02b", title: "Guest details" },
    { id: "CKI-03", title: "Scan passport" },
    { id: "CKI-03b", title: "ID verified" },
    { id: "CKI-04", title: "Facial recognition" },
    { id: "CKI-05", title: "Processing" },
    { id: "CKI-05e", title: "Verification failed" },
    { id: "CKI-06", title: "Face scan" },
    { id: "CKI-07", title: "Verification complete" },
    { id: "CKI-08", title: "Terms & signature" },
    { id: "CKI-09", title: "Room upgrades" },
    { id: "CKI-10", title: "Payment" },
    { id: "CKI-11", title: "Floor preference" },
    { id: "CKI-12", title: "Room assigned" },
    { id: "CKI-13", title: "Key cards ready" },
    { id: "CKI-16", title: "Welcome complete" },
  ]},
  { module: "Check-out", prefix: "CKO", screens: [
    { id: "CKO-00", title: "Check-out lookup" },
    { id: "CKO-01", title: "Check-out start" },
    { id: "CKO-02", title: "Stay summary" },
    { id: "CKO-03", title: "Minibar dispute" },
    { id: "CKO-04", title: "Feedback" },
    { id: "CKO-05", title: "Check-out payment" },
    { id: "CKO-06", title: "Check-out complete" },
  ]},
  { module: "Booking", prefix: "BKG", screens: [
    { id: "BKG-01", title: "Dates" },
    { id: "BKG-02", title: "Room type" },
    { id: "BKG-03", title: "Room details" },
    { id: "BKG-04", title: "Guest info" },
    { id: "BKG-05", title: "Preferences" },
    { id: "BKG-06", title: "Review" },
    { id: "BKG-07", title: "Payment" },
    { id: "BKG-08", title: "Confirmation" },
  ]},
  { module: "Room Service", prefix: "RSV", screens: [
    { id: "RSV-01", title: "Menu categories" },
    { id: "RSV-02", title: "Items" },
    { id: "RSV-03", title: "Item detail" },
    { id: "RSV-04", title: "Cart" },
    { id: "RSV-05", title: "Delivery" },
    { id: "RSV-05p", title: "Delivery (portrait)" },
    { id: "RSV-06", title: "Review order" },
    { id: "RSV-07", title: "Payment" },
    { id: "RSV-08", title: "Confirmation" },
  ]},
  { module: "Events", prefix: "EVT", screens: [
    { id: "EVT-01", title: "Events list" },
    { id: "EVT-02", title: "Event detail" },
    { id: "EVT-02p", title: "Event detail (portrait)" },
    { id: "EVT-03", title: "Reserve" },
    { id: "EVT-03s", title: "Reservation success" },
  ]},
  { module: "Explore", prefix: "LST", screens: [
    { id: "LST-01", title: "Categories" },
    { id: "LST-02", title: "Places list" },
    { id: "LST-03", title: "Place detail" },
  ]},
  { module: "Wayfinding", prefix: "WAY", screens: [
    { id: "WAY-01", title: "Map" },
    { id: "WAY-02", title: "Directions" },
  ]},
  { module: "Wi-Fi", prefix: "WIF", screens: [
    { id: "WIF-01", title: "Wi-Fi credentials" },
  ]},
  { module: "FAQ", prefix: "FAQ", screens: [
    { id: "FAQ-01", title: "FAQ" },
  ]},
  { module: "Upsells", prefix: "UPS", screens: [
    { id: "UPS-01", title: "Upsells list" },
    { id: "UPS-02", title: "Upsell detail" },
    { id: "UPS-03", title: "Confirmation" },
  ]},
  { module: "Duplicate Key", prefix: "DKY", screens: [
    { id: "DKY-01", title: "Request" },
    { id: "DKY-02", title: "Verify" },
    { id: "DKY-03", title: "Printing" },
  ]},
  { module: "Late Check-out", prefix: "LCO", screens: [
    { id: "LCO-01", title: "Request" },
    { id: "LCO-02", title: "Payment" },
  ]},
  { module: "Early Check-in", prefix: "ECI", screens: [
    { id: "ECI-01", title: "Request" },
    { id: "ECI-02", title: "Confirm" },
    { id: "ECI-03", title: "Payment" },
  ]},
  { module: "Payment", prefix: "PAY", screens: [
    { id: "PAY-01", title: "Select method" },
    { id: "PAY-02", title: "Processing" },
    { id: "PAY-03", title: "Success" },
    { id: "PAY-03e", title: "Failed" },
  ]},
  { module: "AI Avatar", prefix: "AVT", screens: [
    { id: "AVT-01", title: "Conversation" },
    { id: "AVT-02", title: "Alt conversation" },
  ]},
];

const ALL_SCREEN_IDS = SCREEN_GROUPS.flatMap((g) => g.screens.map((s) => s.id));

/**
 * Expand a screenPattern string into a Set of exact screen IDs.
 * "*" → everything; "CKI-*" → all CKI- prefixes; comma-lists and
 * exact IDs are added directly.
 */
function expandPattern(pattern: string | undefined): Set<string> {
  const set = new Set<string>();
  const p = (pattern ?? "").trim();
  if (!p || p === "*") {
    ALL_SCREEN_IDS.forEach((id) => set.add(id));
    return set;
  }
  p.split(",").map((s) => s.trim()).forEach((part) => {
    if (!part) return;
    if (part === "*") {
      ALL_SCREEN_IDS.forEach((id) => set.add(id));
    } else if (part.endsWith("*")) {
      const prefix = part.slice(0, -1);
      ALL_SCREEN_IDS.forEach((id) => { if (id.startsWith(prefix)) set.add(id); });
    } else {
      set.add(part);
    }
  });
  return set;
}

/**
 * Serialize a set of selected screen IDs back into a compact pattern.
 * Uses "*" when everything is picked and "PREFIX-*" shortcuts when
 * every screen of a given module is selected.
 */
function serializePattern(selected: Set<string>): string {
  if (selected.size === 0) return "";
  if (selected.size >= ALL_SCREEN_IDS.length) return "*";
  const parts: string[] = [];
  const taken = new Set<string>();
  for (const group of SCREEN_GROUPS) {
    const groupIds = group.screens.map((s) => s.id);
    const allInGroupSelected = groupIds.every((id) => selected.has(id));
    if (allInGroupSelected && groupIds.length > 1) {
      parts.push(`${group.prefix}-*`);
      groupIds.forEach((id) => taken.add(id));
    }
  }
  for (const id of selected) {
    if (!taken.has(id)) parts.push(id);
  }
  return parts.join(",");
}

function ScreenPicker({ value, onChange, emptyLabel }: { value: string; onChange: (v: string) => void; emptyLabel?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const selected = useMemo(() => expandPattern(value), [value]);
  const isAll = selected.size >= ALL_SCREEN_IDS.length;
  const isEmpty = selected.size === 0;

  const toggleScreen = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    onChange(serializePattern(next));
  };

  const toggleGroup = (group: typeof SCREEN_GROUPS[number]) => {
    const ids = group.screens.map((s) => s.id);
    const allSelected = ids.every((id) => selected.has(id));
    const next = new Set(selected);
    if (allSelected) ids.forEach((id) => next.delete(id));
    else ids.forEach((id) => next.add(id));
    onChange(serializePattern(next));
  };

  const toggleAll = () => {
    if (isAll) onChange("");
    else onChange("*");
  };

  // Compact summary for the button label
  const summary = useMemo(() => {
    if (isAll) return "All screens";
    if (isEmpty) return emptyLabel ?? "Select screens…";
    if (selected.size <= 3) {
      return Array.from(selected).sort().join(", ");
    }
    return `${selected.size} screens selected`;
  }, [selected, isAll, isEmpty, emptyLabel]);

  return (
    <div ref={ref} style={{ position: "relative", flex: 1, minWidth: 0 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 6,
          padding: "7px 10px", borderRadius: 6, background: T.bg, border: `1px solid ${open ? T.accent : T.border}`,
          color: T.text, fontSize: 11, fontFamily: T.fontBody, cursor: "pointer", textAlign: "left",
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ color: T.textDim, flexShrink: 0 }}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
        <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{summary}</span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" style={{ color: T.textDim, flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 150ms" }}><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, minWidth: 280, maxWidth: 360,
          background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10,
          boxShadow: "0 18px 50px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.05)",
          padding: 6, zIndex: 60, maxHeight: 380, overflow: "auto",
        }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 6, cursor: "pointer", background: isAll ? `${T.accent}10` : "transparent" }}>
            <input
              type="checkbox"
              checked={isAll}
              onChange={toggleAll}
              style={{ accentColor: T.accent, cursor: "pointer" }}
            />
            <span style={{ fontSize: 12, fontWeight: 700, color: T.text, fontFamily: T.fontDisplay }}>All screens</span>
            <span style={{ fontSize: 9, color: T.textMuted, marginLeft: "auto", fontFamily: "ui-monospace, monospace" }}>*</span>
          </label>
          <div style={{ height: 1, background: T.border, margin: "4px 2px" }} />
          {SCREEN_GROUPS.map((group) => {
            const groupIds = group.screens.map((s) => s.id);
            const groupSelected = groupIds.filter((id) => selected.has(id)).length;
            const allInGroup = groupSelected === groupIds.length;
            const noneInGroup = groupSelected === 0;
            return (
              <div key={group.prefix} style={{ marginBottom: 2 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 6, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={allInGroup}
                    ref={(el) => { if (el) el.indeterminate = !allInGroup && !noneInGroup; }}
                    onChange={() => toggleGroup(group)}
                    style={{ accentColor: T.accent, cursor: "pointer" }}
                  />
                  <span style={{ fontSize: 10, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: 0.8 }}>{group.module}</span>
                  <span style={{ fontSize: 9, color: T.textMuted, marginLeft: "auto", fontFamily: "ui-monospace, monospace" }}>{group.prefix}-*</span>
                </label>
                {group.screens.map((s) => {
                  const checked = selected.has(s.id);
                  return (
                    <label key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 10px 4px 28px", borderRadius: 6, cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleScreen(s.id)}
                        style={{ accentColor: T.accent, cursor: "pointer" }}
                      />
                      <span style={{ fontSize: 11, color: T.text, fontFamily: T.fontBody }}>{s.title}</span>
                      <span style={{ fontSize: 9, color: T.textMuted, marginLeft: "auto", fontFamily: "ui-monospace, monospace" }}>{s.id}</span>
                    </label>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AdCard({ ad, onChange, onRemove }: { ad: AdItem; onChange: (p: Partial<AdItem>) => void; onRemove: () => void }) {
  const [hover, setHover] = useState(false);
  const currentType: AdType = ad.type ?? "popup";

  const typePill = (t: AdType): React.CSSProperties => ({
    padding: "4px 10px", borderRadius: 5, fontSize: 10, fontWeight: 700, fontFamily: T.fontBody, cursor: "pointer",
    background: currentType === t ? T.accent : "transparent",
    color: currentType === t ? "#fff" : T.textDim,
    border: `1px solid ${currentType === t ? T.accent : T.border}`,
    letterSpacing: 0.3, whiteSpace: "nowrap",
  });

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", gap: 14, padding: 14, background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 12, position: "relative",
        opacity: ad.enabled ? 1 : 0.55,
      }}
    >
      <DroppableImage value={ad.image} onChange={(v) => onChange({ image: v })} spec={SPEC_HERO} empty="Ad photo" />
      <div style={{ flex: 1, display: "grid", gap: 8, minWidth: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "start" }}>
          <input
            style={{ background: "transparent", border: "none", outline: "none", fontFamily: T.fontDisplay, fontSize: 17, fontWeight: 800, color: T.text, padding: 0, letterSpacing: "-0.01em" }}
            value={ad.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Ad title"
          />
          <Toggle on={ad.enabled} onClick={(e) => { e.stopPropagation(); onChange({ enabled: !ad.enabled }); }} />
        </div>
        <input
          style={{ background: "transparent", border: "none", outline: "none", fontSize: 12, color: T.textDim, padding: 0, width: "100%" }}
          value={ad.subtitle ?? ""}
          onChange={(e) => onChange({ subtitle: e.target.value })}
          placeholder="Subtitle (e.g. 20% off today)"
        />

        {/* Type pills */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: 2 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginRight: 2 }}>Type</div>
          {(["popup", "hero", "bottomBar", "sideBanner"] as AdType[]).map((t) => (
            <button key={t} onClick={() => onChange({ type: t })} style={typePill(t)}>{AD_TYPE_LABELS[t]}</button>
          ))}
        </div>

        {/* CTA + dismiss row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
          <input
            style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "5px 9px", fontSize: 11, color: T.text, outline: "none" }}
            value={ad.ctaLabel ?? ""}
            onChange={(e) => onChange({ ctaLabel: e.target.value })}
            placeholder="CTA label"
          />
          <input
            style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "5px 9px", fontSize: 11, color: T.text, outline: "none", fontFamily: "ui-monospace, monospace" }}
            value={ad.ctaTarget ?? ""}
            onChange={(e) => onChange({ ctaTarget: e.target.value })}
            placeholder="Target screen (e.g. UPS-01)"
          />
          <input
            style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "5px 9px", fontSize: 11, color: T.text, outline: "none" }}
            value={ad.dismissLabel ?? ""}
            onChange={(e) => onChange({ dismissLabel: e.target.value })}
            placeholder="Dismiss label"
          />
        </div>

        {/* Screen picker + (sideBanner only) side selector */}
        <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>Show on screen(s)</div>
            <ScreenPicker
              value={ad.screenPattern ?? (currentType === "popup" ? "DSH-01" : "*")}
              onChange={(v) => onChange({ screenPattern: v })}
            />
            <div style={{ fontSize: 9, color: T.textMuted, paddingLeft: 2, marginTop: 2 }}>
              {currentType === "popup"
                ? "Popup triggers when the guest lands on a matching screen (today only DSH-01 fires it)."
                : "Overlay shows on any screen matching the selection."}
            </div>
          </div>
          {currentType === "sideBanner" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 2, flexShrink: 0 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>Side</div>
              <div style={{ display: "flex", gap: 4 }}>
                {(["left", "right"] as const).map((s) => {
                  const isActive = (ad.side ?? "right") === s;
                  return (
                    <button
                      key={s}
                      onClick={() => onChange({ side: s })}
                      style={{
                        padding: "7px 12px", borderRadius: 6, fontSize: 10, fontWeight: 700, fontFamily: T.fontBody, cursor: "pointer",
                        background: isActive ? T.accent : "transparent",
                        color: isActive ? "#fff" : T.textDim,
                        border: `1px solid ${isActive ? T.accent : T.border}`,
                        textTransform: "capitalize",
                      }}
                    >{s}</button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      {hover && (
        <button onClick={onRemove} style={{ position: "absolute", top: 10, right: 46, width: 26, height: 26, borderRadius: 7, background: T.surface, border: `1px solid ${T.border}`, color: T.error, cursor: "pointer", fontSize: 14, lineHeight: 1 }}>×</button>
      )}
    </div>
  );
}

function PoliciesTab({ policies, onPatch, onToastError }: {
  policies: HotelConfig["policies"];
  onPatch: (p: Partial<NonNullable<HotelConfig["policies"]>>) => void;
  onToastError: (msg: string) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const MAX = 3 * 1024 * 1024; // 3 MB
  const handleFile = async (file: File) => {
    const ok = /\.(pdf|docx?)$/i.test(file.name) || /pdf|word|document/.test(file.type);
    if (!ok) { onToastError("Use .pdf or .docx"); return; }
    if (file.size > MAX) { onToastError(`Too large (${formatBytes(file.size)} · max ${formatBytes(MAX)})`); return; }
    try {
      const dataUrl = await readFileAsDataURL(file);
      onPatch({ filename: file.name, mimeType: file.type, dataUrl });
    } catch {
      onToastError("Couldn't read the file");
    }
  };
  const clearFile = () => onPatch({ filename: undefined, mimeType: undefined, dataUrl: undefined });
  const hasFile = !!policies?.dataUrl;

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div>
        <div style={{ fontSize: 9, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Document upload</div>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
          style={{
            display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 10,
            background: dragOver ? `${T.accent}10` : T.surface,
            border: `1.5px dashed ${dragOver ? T.accent : T.borderHi}`,
            transition: "all 120ms",
          }}
        >
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.currentTarget.value = ""; }} />
          <div style={{ width: 44, height: 44, borderRadius: 8, background: `${T.accent}14`, border: `1px solid ${T.accent}28`, color: T.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {hasFile ? (
              <>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, fontFamily: T.fontDisplay, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{policies?.filename ?? "policies"}</div>
                <div style={{ fontSize: 10, color: T.textMuted }}>{Math.round((policies?.dataUrl?.length ?? 0) / 1024)} KB · will be shown on CKI-08 sign-and-accept</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, fontFamily: T.fontDisplay }}>Drop a PDF or Word file</div>
                <div style={{ fontSize: 10, color: T.textMuted }}>or click to choose · .pdf · .doc · .docx · max 3 MB</div>
              </>
            )}
          </div>
          <button type="button" onClick={() => fileRef.current?.click()} style={{ padding: "7px 14px", borderRadius: 7, background: T.accent, color: "#fff", border: `1px solid ${T.accent}`, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
            {hasFile ? "Replace" : "Choose file"}
          </button>
          {hasFile && (
            <button type="button" onClick={clearFile} style={{ padding: "7px 10px", borderRadius: 7, background: "transparent", border: `1px solid ${T.border}`, color: T.error, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Remove</button>
          )}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 9, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Inline text (optional)</div>
        <textarea
          value={policies?.text ?? ""}
          onChange={(e) => onPatch({ text: e.target.value })}
          placeholder="Paste or type the policies text. This is what actually renders inside the kiosk's signature screen. Leave empty to use the default template."
          style={{ ...baseInput, minHeight: 100, fontFamily: T.fontBody, resize: "vertical", lineHeight: 1.5 }}
        />
      </div>
    </div>
  );
}

function FontsTab({ config, allFamilies, onPatchFont, onAddFont, onRemoveFont, onToastError }: {
  config: HotelConfig;
  allFamilies: string[];
  onPatchFont: (k: keyof HotelConfig["fonts"], v: string) => void;
  onAddFont: (f: CustomFont) => void;
  onRemoveFont: (family: string) => void;
  onToastError: (msg: string) => void;
}) {
  const [source, setSource] = useState<"google" | "adobe" | "upload">("google");
  const [urlInput, setUrlInput] = useState("");
  const [familyInput, setFamilyInput] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const customFonts = config.customFonts ?? [];

  // Parse the family name out of a Google Fonts CSS URL so users don't
  // have to retype it. Example: family=Playfair+Display:wght@400;700 → "Playfair Display"
  const parseGoogleFamily = (url: string): string | null => {
    const m = url.match(/family=([^&:]+)/);
    if (!m) return null;
    return decodeURIComponent(m[1]).replace(/\+/g, " ");
  };

  const handleUrlChange = (v: string) => {
    setUrlInput(v);
    if (source === "google" && !familyInput) {
      const fam = parseGoogleFamily(v);
      if (fam) setFamilyInput(fam);
    }
  };

  const handleImport = () => {
    if (!familyInput.trim()) { onToastError("Family name required"); return; }
    if (source !== "upload" && !urlInput.trim()) { onToastError("URL required"); return; }
    let url = urlInput.trim();
    if (source === "adobe") {
      // Allow pasting just the kit ID ("xyz1234") in addition to the full URL.
      if (!/^https?:/.test(url) && !/\.css$/.test(url)) {
        url = `https://use.typekit.net/${url}.css`;
      }
    }
    if (source === "google" && !/^https?:\/\/fonts\.googleapis\.com/.test(url)) {
      onToastError("Must be a fonts.googleapis.com URL"); return;
    }
    onAddFont({ family: familyInput.trim(), source, url });
    setUrlInput("");
    setFamilyInput("");
  };

  const handleFile = async (file: File) => {
    const ok = /\.(woff2?|ttf|otf)$/i.test(file.name) || /font/.test(file.type);
    if (!ok) { onToastError("Use .woff2 / .woff / .ttf / .otf"); return; }
    if (file.size > 500 * 1024) { onToastError(`Too large (${Math.round(file.size / 1024)} KB · max 500 KB)`); return; }
    try {
      const dataUrl = await readFileAsDataURL(file);
      const fallbackFamily = familyInput.trim() || file.name.replace(/\.(woff2?|ttf|otf)$/i, "").replace(/[-_]+/g, " ");
      onAddFont({ family: fallbackFamily, source: "upload", url: dataUrl });
      setFamilyInput("");
    } catch {
      onToastError("Couldn't read the font file");
    }
  };

  const sourceBtn = (key: "google" | "adobe" | "upload", label: string): React.CSSProperties => ({
    padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, fontFamily: T.fontBody, cursor: "pointer",
    background: source === key ? T.accent : "transparent",
    color: source === key ? "#fff" : T.textDim,
    border: `1px solid ${source === key ? T.accent : T.border}`,
    letterSpacing: 0.3,
  });

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {/* Display / body selectors */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Display Font">
          <select style={{ ...baseInput }} value={config.fonts.display} onChange={(e) => onPatchFont("display", e.target.value)}>
            {allFamilies.map((f) => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
          </select>
        </Field>
        <Field label="Body Font">
          <select style={{ ...baseInput }} value={config.fonts.body} onChange={(e) => onPatchFont("body", e.target.value)}>
            {allFamilies.map((f) => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
          </select>
        </Field>
      </div>

      {/* Import section */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: 1 }}>Import custom font</div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setSource("google")} style={sourceBtn("google", "Google")}>Google</button>
            <button onClick={() => setSource("adobe")} style={sourceBtn("adobe", "Adobe")}>Adobe</button>
            <button onClick={() => setSource("upload")} style={sourceBtn("upload", "Upload")}>Upload</button>
          </div>
        </div>

        {source !== "upload" ? (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: 8 }}>
            <input
              style={{ ...baseInput, fontFamily: "ui-monospace, monospace", fontSize: 11 }}
              placeholder={source === "google"
                ? "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap"
                : "https://use.typekit.net/xxxxxxx.css  or  xxxxxxx"}
              value={urlInput}
              onChange={(e) => handleUrlChange(e.target.value)}
            />
            <input
              style={baseInput}
              placeholder="Family name"
              value={familyInput}
              onChange={(e) => setFamilyInput(e.target.value)}
            />
            <button onClick={handleImport} style={{ padding: "0 16px", background: T.accent, color: "#fff", border: `1px solid ${T.accent}`, borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Import</button>
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault(); setDragOver(false);
              const file = e.dataTransfer.files?.[0]; if (file) handleFile(file);
            }}
            style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8,
              background: dragOver ? `${T.accent}10` : T.bg,
              border: `1.5px dashed ${dragOver ? T.accent : T.borderHi}`,
              transition: "all 120ms",
            }}
          >
            <input ref={fileRef} type="file" accept=".woff2,.woff,.ttf,.otf,font/woff2,font/woff,font/ttf,font/otf" style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.currentTarget.value = ""; }} />
            <button type="button" onClick={() => fileRef.current?.click()} style={{ padding: "7px 14px", borderRadius: 7, background: T.accent, color: "#fff", border: `1px solid ${T.accent}`, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Choose file</button>
            <input
              style={{ ...baseInput, flex: 1 }}
              placeholder="Family name (auto-filled from filename)"
              value={familyInput}
              onChange={(e) => setFamilyInput(e.target.value)}
            />
            <div style={{ fontSize: 9, color: T.textMuted, whiteSpace: "nowrap" }}>
              .woff2 · .woff · .ttf · .otf · max 500 KB
            </div>
          </div>
        )}
      </div>

      {/* Imported fonts list */}
      {customFonts.length > 0 && (
        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, paddingLeft: 2 }}>
            {customFonts.length} imported
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
            {customFonts.map((f) => (
              <div key={f.family} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: `${T.accent}14`, color: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: f.family, fontSize: 14, fontWeight: 700, flexShrink: 0 }}>Aa</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.text, fontFamily: f.family, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.family}</div>
                  <div style={{ fontSize: 9, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>{f.source}</div>
                </div>
                <button onClick={() => onRemoveFont(f.family)} title="Remove" style={{ width: 22, height: 22, borderRadius: 6, background: "transparent", border: `1px solid ${T.border}`, color: T.error, cursor: "pointer", fontSize: 14, lineHeight: 1, flexShrink: 0 }}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
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

