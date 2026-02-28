# NEXI Prototype — Screen Component Reference

## Architecture
- Each screen is a React component in `src/components/screens/`
- File naming: `{ScreenId without dash}.tsx` (e.g., CKI02a.tsx, CKO01.tsx)
- All screens use `"use client"` directive

## Required Imports Pattern
```tsx
"use client";
import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";
// Import icons from @/components/ui/Icons as needed
```

## useKiosk() Hook
```tsx
const { navigate, goBack, goHome, currentScreen, guestName, roomNumber, roomType, 
        reservationId, checkInDate, checkOutDate, openModal, closeModal } = useKiosk();
```

## Screen Layout Patterns

### Pattern A: Standard Screen (header + centered content)
Used for: lookup, forms, selections, info screens
```tsx
<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
  <GlobalHeader />
  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 48px" }}>
    {/* Content */}
  </div>
</div>
```

### Pattern B: 50/50 Split (instructions left, visual right)
Used for: CKI-03 (passport scan), CKI-06 (face scan), CKI-04 (facial recognition)
```tsx
<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
  <GlobalHeader />
  {/* Progress bar if needed */}
  <div style={{ flex: 1, display: "flex" }}>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 40px" }}>
      {/* Left: Instructions */}
    </div>
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      {/* Right: Photo/visual reference */}
    </div>
  </div>
</div>
```

### Pattern C: Cinematic (full-bleed photo, overlay, glass card)
Used for: CKI-07 (verified), CKI-16 (welcome complete), CKO-06, DKY-03, success screens
```tsx
<div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
  <div style={{ position: "absolute", inset: 0, background: "url('UNSPLASH_URL') center/cover" }} />
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.7))" }} />
  <div className="grain" />
  {/* Dark glass header */}
  <div style={{ position: "relative", zIndex: 2, height: 48, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)" }}>
    {/* NEXI icon + hotel name (white) | date | weather */}
  </div>
  {/* Centered glass card */}
  <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div className="glass-card" style={{ maxWidth: 480, textAlign: "center" }}>
      {/* Success content */}
    </div>
  </div>
</div>
```

### Pattern D: Payment 50/50 (summary left, terminal right)
Used for: PAY-01, PAY-02, CKI-10, CKO-05
```tsx
<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
  <GlobalHeader />
  <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr" }}>
    <div style={{ padding: 32, overflow: "auto" }}>
      {/* Left: Payment summary */}
    </div>
    <div style={{ position: "relative", overflow: "hidden" }}>
      {/* Right: Hotel photo + glass terminal card overlay */}
    </div>
  </div>
</div>
```

### Pattern E: Dashboard/List (header + scrollable content)
Used for: DSH-01, RSV-01, EVT-01, LST-01
```tsx
<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
  <GlobalHeader />
  <div style={{ flex: 1, overflow: "auto" }}>
    {/* Hero if needed */}
    {/* Content grid */}
  </div>
</div>
```

## Design System Tokens (use var() CSS variables)
- `--bg`, `--bg-card`, `--bg-elevated`
- `--primary` (#1288FF), `--primary-hover`, `--primary-light`, `--primary-glow`
- `--amber` (#D4960A light / #E5A91B dark), `--amber-light`
- `--text`, `--text-secondary`, `--text-tertiary`
- `--border`, `--border-hover`
- `--success`, `--error`, `--warning`
- `--radius-sm` (8px), `--radius-md` (12px), `--radius-lg` (16px), `--radius-xl` (20px), `--radius-full` (9999px)
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`

## Typography
- Display/headings: `fontFamily: "'Mona Sans', sans-serif"`
- Body/UI: `fontFamily: "'Inter', sans-serif"` (default, no need to specify)

## Buttons (use className)
- `btn btn-primary` — Blue filled
- `btn btn-ghost` — Outlined
- `btn btn-amber` — Amber filled
- Add `btn-lg` or `btn-sm` for sizing

## Navigation
- `navigate("SCREEN-ID")` — go to screen
- `goBack()` — go to previous screen
- `goHome()` — go to DSH-01

## Progress Bar Component (use inline)
```tsx
<div style={{ height: 4, background: "var(--border)", position: "relative" }}>
  <div style={{ height: "100%", width: `${(step/total)*100}%`, background: "var(--primary)", borderRadius: 2, transition: "width 500ms ease" }} />
</div>
```

## Step Indicator (use inline)
```tsx
<div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 24px", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
  {steps.map((s, i) => (
    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6875rem", fontWeight: 700, background: i <= currentStep ? "var(--primary)" : "var(--bg-card)", color: i <= currentStep ? "#fff" : "var(--text-tertiary)", border: i <= currentStep ? "none" : "1px solid var(--border)" }}>
        {i + 1}
      </div>
      {i < steps.length - 1 && <div style={{ width: 24, height: 1, background: "var(--border)" }} />}
    </div>
  ))}
</div>
```

## Unsplash Photos (use DIFFERENT for each screen!)
Hotel/lobby: photo-1551882547-ff40c63fe5fa, photo-1566073771259-6a8506099945
Room: photo-1590490360182-c33d57733427, photo-1611892440504-42a792e24d32
Pool: photo-1571896349842-33c89424de2d
Restaurant: photo-1414235077428-338989a2e8c0
Spa: photo-1544161515-4ab6ce6db874
City: photo-1449824913935-59a10b8d2000
Beach: photo-1507525428034-b723cf961d3e
Map/wayfinding: photo-1524758631624-e2822e304c36
Event: photo-1540575467063-178a50c2df87
Food: photo-1504674900247-0877df9cc836, photo-1414235077428-338989a2e8c0
Key card: photo-1582719478250-c89cae4dc85b
Passport: photo-1544005313-94ddf0286df2

## Guest Mock Data
- Name: Sarah Mitchell
- Room: 1247 (Deluxe King)
- Reservation: RES-2026-48291
- Check-in: Feb 22, 2026
- Check-out: Feb 25, 2026
- Total: $1,247.50
- Rate: $415.83/night

## CRITICAL RULES
1. Every component must export default
2. Use inline styles (style={{}}) — NOT className for custom styles except btn classes and glass-card
3. Use var() CSS variables for all colors
4. Use Unsplash URLs with ?w=1920&q=85 for hero shots, ?w=300&q=80 for thumbnails
5. Each screen MUST fill 100% width and height of the kiosk frame
6. NO emojis in the UI — use SVG icons only
7. Back button always calls goBack(), primary CTA calls navigate("NEXT-SCREEN")
