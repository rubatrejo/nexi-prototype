"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Reorder } from "framer-motion";
import type { AdsConfig, AdItem, AdType } from "@/lib/hotel-config";
import { T } from "../_lib/tokens";
import { SPEC_HERO } from "../_lib/specs";
import { addCardBtn } from "../_lib/styles";
import Toggle from "./Toggle";
import DroppableImage from "./DroppableImage";

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

export default function AdsTab({ ads, onPatch, onUpdateItem, onAdd, onRemove, onReorder }: {
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
