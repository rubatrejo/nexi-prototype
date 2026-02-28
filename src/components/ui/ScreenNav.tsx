"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import type { ScreenId } from "@/lib/navigation";

/* ─── Module icons (SVG inlined) ─── */
const icons: Record<string, React.ReactNode> = {
  "Idle & Onboarding": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  "Check-in": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>,
  "Dashboard": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  "Check-out": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  "Booking": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  "Room Service": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20h18M12 4v4M4 16c0-4.4 3.6-8 8-8s8 3.6 8 8"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  "Payment (Generic)": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  "Events": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
  "Explore & Wayfinding": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
  "Quick Services": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  "Upgrades": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  "Duplicate Key": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  "Early Check-in": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 8 14"/></svg>,
  "Late Check-out": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  "AI Concierge": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 014 4v2H8V6a4 4 0 014-4z"/><rect x="4" y="8" width="16" height="12" rx="2"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/></svg>,
  "Staff": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
};

/* ─── Module accent colors ─── */
const accentColors: Record<string, string> = {
  "Idle & Onboarding": "#6366F1",
  "Check-in": "#1288FF",
  "Dashboard": "#F59E0B",
  "Check-out": "#EF4444",
  "Booking": "#10B981",
  "Room Service": "#F97316",
  "Payment (Generic)": "#8B5CF6",
  "Events": "#EC4899",
  "Explore & Wayfinding": "#14B8A6",
  "Quick Services": "#6366F1",
  "Upgrades": "#F59E0B",
  "Duplicate Key": "#64748B",
  "Early Check-in": "#0EA5E9",
  "Late Check-out": "#F43F5E",
  "AI Concierge": "#8B5CF6",
  "Staff": "#64748B",
};

const SCREEN_GROUPS: { label: string; screens: { id: ScreenId; name: string }[] }[] = [
  {
    label: "Idle & Onboarding",
    screens: [
      { id: "IDL-01", name: "Idle Screen" },
      { id: "ONB-02", name: "Action Select" },
    ],
  },
  {
    label: "Check-in",
    screens: [
      { id: "CKI-01", name: "Reservation Lookup" },
      { id: "CKI-01q", name: "QR Scan" },
      { id: "CKI-02a", name: "Camera Permission" },
      { id: "CKI-02b", name: "Guest Details" },
      { id: "CKI-03", name: "Scan ID" },
      { id: "CKI-03b", name: "ID Verified" },
      { id: "CKI-04", name: "Facial Prompt" },
      { id: "CKI-05", name: "Processing" },
      { id: "CKI-05e", name: "Verify Failed" },
      { id: "CKI-06", name: "Face Scan" },
      { id: "CKI-07", name: "Verified" },
      { id: "CKI-08", name: "Terms & Sign" },
      { id: "CKI-09", name: "Upgrades" },
      { id: "CKI-10", name: "Payment" },
      { id: "CKI-13", name: "Keys Encoding" },
      { id: "CKI-12", name: "Room Assigned" },
      { id: "CKI-16", name: "Welcome!" },
    ],
  },
  {
    label: "Dashboard",
    screens: [{ id: "DSH-01", name: "Guest Dashboard" }],
  },
  {
    label: "Check-out",
    screens: [
      { id: "CKO-00", name: "Lookup (Unauth)" },
      { id: "CKO-01", name: "Start" },
      { id: "CKO-02", name: "Stay Summary" },
      { id: "CKO-04", name: "Feedback" },
      { id: "CKO-05", name: "Payment" },
      { id: "CKO-06", name: "Complete" },
    ],
  },
  {
    label: "Booking",
    screens: [
      { id: "BKG-01", name: "Dates" },
      { id: "BKG-02", name: "Rooms" },
      { id: "BKG-03", name: "Room Detail" },
      { id: "BKG-04", name: "Guest Info" },
      { id: "BKG-05", name: "Summary & Pay" },
      { id: "BKG-07", name: "Processing" },
      { id: "BKG-08", name: "Confirmed" },
    ],
  },
  {
    label: "Room Service",
    screens: [
      { id: "RSV-01", name: "Categories" },
      { id: "RSV-02", name: "Menu" },
      { id: "RSV-03", name: "Cart Review" },
      { id: "RSV-05", name: "Delivery Details" },
      { id: "RSV-05p", name: "Payment Method" },
      { id: "RSV-06", name: "Confirmed" },
      { id: "RSV-07", name: "Tracking" },
    ],
  },
  {
    label: "Payment (Generic)",
    screens: [
      { id: "PAY-02", name: "Processing" },
      { id: "PAY-03", name: "Success" },
      { id: "PAY-03e", name: "Receipt" },
    ],
  },
  {
    label: "Events",
    screens: [
      { id: "EVT-01", name: "Hotel Events" },
      { id: "EVT-02", name: "Event Detail" },
      { id: "EVT-03", name: "Reserved" },
    ],
  },
  {
    label: "Explore & Wayfinding",
    screens: [
      { id: "LST-01", name: "Explore" },
      { id: "WAY-01", name: "Wayfinding" },
    ],
  },
  {
    label: "Quick Services",
    screens: [
      { id: "WIF-01", name: "Wi-Fi" },
      { id: "FAQ-01", name: "FAQ" },
      { id: "ADS-01", name: "Promo" },
      { id: "RCT-01", name: "Receipts" },
    ],
  },
  {
    label: "Upgrades",
    screens: [
      { id: "UPS-01", name: "Available" },
      { id: "UPS-02", name: "Detail" },
      { id: "UPS-03", name: "Confirmed" },
    ],
  },
  {
    label: "Duplicate Key",
    screens: [
      { id: "DKY-01", name: "How Many?" },
      { id: "DKY-02", name: "Encoding" },
      { id: "DKY-03", name: "Key Ready" },
    ],
  },
  {
    label: "Early Check-in",
    screens: [
      { id: "ECI-01", name: "Options" },
      { id: "ECI-02", name: "Luggage Storage" },
      { id: "ECI-03", name: "Pay Early CkIn" },
    ],
  },
  {
    label: "Late Check-out",
    screens: [
      { id: "LCO-01", name: "Select Time" },
      { id: "LCO-02", name: "Confirmed" },
    ],
  },
  {
    label: "AI Concierge",
    screens: [{ id: "AVT-02", name: "AI Concierge" }],
  },
  {
    label: "Staff",
    screens: [
      { id: "STF-01", name: "Staff Login" },
      { id: "STF-02", name: "Staff Dashboard" },
      { id: "STF-03", name: "Override" },
    ],
  },
];

/* ─── Find which group a screen belongs to ─── */
function findGroup(screenId: ScreenId): string | null {
  for (const g of SCREEN_GROUPS) {
    if (g.screens.some((s) => s.id === screenId)) return g.label;
  }
  return null;
}

/* ─── Step indicator dots ─── */
function StepDots({ screens, currentScreen, accent }: { screens: { id: ScreenId; name: string }[]; currentScreen: ScreenId; accent: string }) {
  const currentIdx = screens.findIndex((s) => s.id === currentScreen);
  if (screens.length <= 1) return null;
  return (
    <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
      {screens.map((s, i) => (
        <div
          key={s.id}
          style={{
            width: i === currentIdx ? 16 : 5,
            height: 5,
            borderRadius: 3,
            background: i === currentIdx ? accent : "rgba(0,0,0,0.1)",
            transition: "all 300ms cubic-bezier(.4,0,.2,1)",
          }}
        />
      ))}
    </div>
  );
}

export default function ScreenNav() {
  const { navigate, currentScreen, openModal, navOpen, setNavOpen } = useKiosk();
  const [search, setSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const group = findGroup(currentScreen);
    return new Set(group ? [group] : []);
  });
  const [errorsOpen, setErrorsOpen] = useState(false);
  const activeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-expand and scroll to active group on screen change
  useEffect(() => {
    const group = findGroup(currentScreen);
    if (group && !expandedGroups.has(group)) {
      setExpandedGroups((prev) => new Set([...prev, group]));
    }
    // Scroll active item into view
    setTimeout(() => activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }), 100);
  }, [currentScreen]);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  // Filter screens by search
  const filteredGroups = useMemo(() => {
    if (!search.trim()) return SCREEN_GROUPS;
    const q = search.toLowerCase();
    return SCREEN_GROUPS.map((g) => ({
      ...g,
      screens: g.screens.filter(
        (s) => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
      ),
    })).filter((g) => g.screens.length > 0);
  }, [search]);

  // Total screen count
  const totalScreens = SCREEN_GROUPS.reduce((n, g) => n + g.screens.length, 0);
  const currentIndex = SCREEN_GROUPS.flatMap((g) => g.screens).findIndex((s) => s.id === currentScreen) + 1;

  if (!navOpen) {
    return (
      <button
        onClick={() => setNavOpen(true)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 16px 8px 10px",
          borderRadius: "var(--radius-full)",
          background: "linear-gradient(135deg, #1288FF, #0a5cbf)",
          border: "none",
          cursor: "pointer",
          zIndex: 9999,
          boxShadow: "0 4px 20px rgba(18,136,255,0.4)",
          transition: "transform 200ms, box-shadow 200ms",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(18,136,255,0.5)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(18,136,255,0.4)"; }}
        title="Screen Navigator"
      >
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="16" height="16" viewBox="0 0 137.993 121.233" fill="#fff">
            <path d="M71.349,87.094A21.555,21.555,0,0,1,60.563,84.2L43.631,101.134a45.086,45.086,0,0,0,55.823-.289l-16.9-16.9a21.556,21.556,0,0,1-11.207,3.145" transform="translate(-2.48 -4.771)" />
            <path d="M71.352,16.305a45.007,45.007,0,0,0-27.674,9.5L60.614,42.742a21.555,21.555,0,0,1,21.9.255l16.9-16.9a45.032,45.032,0,0,0-28.06-9.79" transform="translate(-2.482 -0.926)" />
            <path d="M115.72,78.45a44.824,44.824,0,0,0-.011-35.648L143.276,0,109.944,33.015c-.024-.031-.044-.064-.068-.094L92.944,49.852a21.576,21.576,0,0,1,.03,21.524v0l-.031,0,3.584,3.55,13.381,13.381c.019-.024.035-.051.054-.075l33.313,33Z" transform="translate(-5.282)" />
            <path d="M27.556,78.45A44.823,44.823,0,0,1,27.567,42.8L0,0,33.332,33.015c.024-.031.044-.064.068-.094L50.332,49.852a21.576,21.576,0,0,0-.03,21.524v0l.031,0-3.584,3.55L33.367,88.312c-.019-.024-.035-.051-.054-.075L0,121.233Z" />
          </svg>
        </div>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.75rem", color: "#fff" }}>Navigator</span>
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        bottom: 0,
        width: 360,
        background: "#FAFAF8",
        borderLeft: "1px solid #E8E8E3",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        boxShadow: "-8px 0 32px rgba(0,0,0,0.06)",
        fontFamily: "var(--font-display)",
      }}
    >
      {/* ─── Header ─── */}
      <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid #E8E8E3", background: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: "linear-gradient(135deg, #1288FF, #0a5cbf)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="14" height="14" viewBox="0 0 137.993 121.233" fill="#fff">
                <path d="M71.349,87.094A21.555,21.555,0,0,1,60.563,84.2L43.631,101.134a45.086,45.086,0,0,0,55.823-.289l-16.9-16.9a21.556,21.556,0,0,1-11.207,3.145" transform="translate(-2.48 -4.771)" />
                <path d="M71.352,16.305a45.007,45.007,0,0,0-27.674,9.5L60.614,42.742a21.555,21.555,0,0,1,21.9.255l16.9-16.9a45.032,45.032,0,0,0-28.06-9.79" transform="translate(-2.482 -0.926)" />
                <path d="M115.72,78.45a44.824,44.824,0,0,0-.011-35.648L143.276,0,109.944,33.015c-.024-.031-.044-.064-.068-.094L92.944,49.852a21.576,21.576,0,0,1,.03,21.524v0l-.031,0,3.584,3.55,13.381,13.381c.019-.024.035-.051.054-.075l33.313,33Z" transform="translate(-5.282)" />
                <path d="M27.556,78.45A44.823,44.823,0,0,1,27.567,42.8L0,0,33.332,33.015c.024-.031.044-.064.068-.094L50.332,49.852a21.576,21.576,0,0,0-.03,21.524v0l.031,0-3.584,3.55L33.367,88.312c-.019-.024-.035-.051-.054-.075L0,121.233Z" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#1A1A1A", lineHeight: 1.2 }}>NEXI Navigator</div>
              <div style={{ fontSize: "0.6875rem", color: "#9CA3AF", marginTop: 1 }}>
                Screen {currentIndex} of {totalScreens}
              </div>
            </div>
          </div>
          <button
            onClick={() => setNavOpen(false)}
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: "#F3F3F0", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#9CA3AF", transition: "all 150ms",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#E8E8E3"; e.currentTarget.style.color = "#1A1A1A"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#F3F3F0"; e.currentTarget.style.color = "#9CA3AF"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* ─── Search ─── */}
        <div style={{ position: "relative" }}>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"
            style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}
          >
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search screens..."
            style={{
              width: "100%",
              padding: "8px 10px 8px 32px",
              borderRadius: 10,
              border: "1px solid #E8E8E3",
              background: "#F8F8F5",
              fontSize: "0.8125rem",
              color: "#1A1A1A",
              outline: "none",
              fontFamily: "inherit",
              transition: "border 150ms",
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = "#1288FF"}
            onBlur={(e) => e.currentTarget.style.borderColor = "#E8E8E3"}
          />
        </div>
      </div>

      {/* ─── Scrollable content ─── */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 12px 20px",
        }}
        className="nav-scroll"
      >
        {/* ─── Error test toggle ─── */}
        <button
          onClick={() => setErrorsOpen(!errorsOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: "100%",
            padding: "8px 10px",
            marginBottom: 4,
            borderRadius: 10,
            border: "none",
            background: errorsOpen ? "rgba(239,68,68,0.06)" : "transparent",
            cursor: "pointer",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#EF4444",
            fontFamily: "inherit",
            transition: "background 150ms",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          Test Error States
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            style={{ marginLeft: "auto", transform: errorsOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms" }}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        {errorsOpen && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "4px 10px 12px" }}>
            {["ERR-01", "ERR-03", "ERR-06", "ERR-12"].map((err) => (
              <button
                key={err}
                onClick={() => openModal(err)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 8,
                  border: "1px solid rgba(239,68,68,0.15)",
                  background: "rgba(239,68,68,0.05)",
                  color: "#EF4444",
                  cursor: "pointer",
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  fontFamily: "inherit",
                  transition: "all 150ms",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.12)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.05)"; }}
              >
                {err.replace("ERR-", "Error ")}
              </button>
            ))}
          </div>
        )}

        {/* ─── Module groups ─── */}
        {filteredGroups.map((group) => {
          const isExpanded = expandedGroups.has(group.label) || search.trim().length > 0;
          const accent = accentColors[group.label] || "#1288FF";
          const icon = icons[group.label];
          const hasActive = group.screens.some((s) => s.id === currentScreen);
          const screenCount = group.screens.length;

          return (
            <div key={group.label} style={{ marginBottom: 4 }}>
              {/* Group header */}
              <button
                onClick={() => toggleGroup(group.label)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "10px 10px",
                  borderRadius: 12,
                  border: "none",
                  background: hasActive ? `${accent}08` : "transparent",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 150ms",
                }}
                onMouseEnter={(e) => { if (!hasActive) e.currentTarget.style.background = "#F3F3F0"; }}
                onMouseLeave={(e) => { if (!hasActive) e.currentTarget.style.background = "transparent"; }}
              >
                {/* Icon circle */}
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: hasActive ? `${accent}14` : "#F3F3F0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: hasActive ? accent : "#9CA3AF",
                  flexShrink: 0,
                  transition: "all 200ms",
                }}>
                  {icon}
                </div>

                {/* Label + count */}
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: hasActive ? "#1A1A1A" : "#6B7280",
                    lineHeight: 1.2,
                  }}>
                    {group.label}
                  </div>
                  <div style={{ fontSize: "0.625rem", color: "#9CA3AF", marginTop: 1 }}>
                    {screenCount} screen{screenCount !== 1 ? "s" : ""}
                  </div>
                </div>

                {/* Active dot */}
                {hasActive && (
                  <div style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: accent,
                    boxShadow: `0 0 8px ${accent}60`,
                    flexShrink: 0,
                  }} />
                )}

                {/* Chevron */}
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C0C0B8" strokeWidth="2"
                  style={{
                    flexShrink: 0,
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 200ms cubic-bezier(.4,0,.2,1)",
                  }}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {/* Screens list */}
              {isExpanded && (
                <div style={{ padding: "2px 0 4px 18px" }}>
                  {/* Step dots */}
                  {group.screens.length > 1 && hasActive && (
                    <div style={{ paddingLeft: 26, marginBottom: 4 }}>
                      <StepDots screens={group.screens} currentScreen={currentScreen} accent={accent} />
                    </div>
                  )}

                  {group.screens.map((s, i) => {
                    const isActive = currentScreen === s.id;
                    return (
                      <button
                        key={s.id}
                        ref={isActive ? activeRef : undefined}
                        onClick={() => navigate(s.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          width: "100%",
                          padding: "7px 10px",
                          marginBottom: 1,
                          borderRadius: 10,
                          border: isActive ? `1.5px solid ${accent}30` : "1.5px solid transparent",
                          background: isActive ? `${accent}0A` : "transparent",
                          cursor: "pointer",
                          textAlign: "left",
                          fontFamily: "inherit",
                          transition: "all 150ms",
                          position: "relative",
                        }}
                        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#F3F3F0"; }}
                        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = isActive ? `${accent}0A` : "transparent"; }}
                      >
                        {/* Step number */}
                        <div style={{
                          width: 24, height: 24, borderRadius: 7,
                          background: isActive ? accent : "#EEEEE8",
                          color: isActive ? "#fff" : "#9CA3AF",
                          fontSize: "0.625rem",
                          fontWeight: 700,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                          transition: "all 200ms",
                        }}>
                          {i + 1}
                        </div>

                        {/* Name */}
                        <span style={{
                          fontSize: "0.8125rem",
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? accent : "#4B5563",
                          flex: 1,
                        }}>
                          {s.name}
                        </span>

                        {/* Active indicator */}
                        {isActive && (
                          <div style={{
                            width: 5, height: 5, borderRadius: "50%",
                            background: accent,
                            boxShadow: `0 0 6px ${accent}60`,
                            flexShrink: 0,
                          }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>



      {/* Hide scrollbar */}
      <style>{`
        .nav-scroll::-webkit-scrollbar { width: 4px; }
        .nav-scroll::-webkit-scrollbar-track { background: transparent; }
        .nav-scroll::-webkit-scrollbar-thumb { background: #E0E0DA; border-radius: 4px; }
        .nav-scroll::-webkit-scrollbar-thumb:hover { background: #C0C0B8; }
      `}</style>
    </div>
  );
}
