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
import ImageZoomModal from "./_components/ImageZoomModal";
import ImageField from "./_components/ImageField";
import HeroExteriorEditor from "./_components/HeroExteriorEditor";
import PoliciesTab from "./_components/PoliciesTab";
import FontsTab from "./_components/FontsTab";
import AdsTab from "./_components/AdsTab";
import TopBar from "./_components/TopBar";
import ModuleNav from "./_components/ModuleNav";
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

