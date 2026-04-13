# CLAUDE.md — NEXI Hotel Self Check-in Kiosk

## Idioma

**Toda la comunicación con Ruben debe ser en español.** Mensajes, planes, explicaciones, preguntas, resúmenes — todo en español. El único inglés permitido es el código fuente, nombres de variables, comentarios en código, y contenido del UI del kiosko (que es en inglés para los huéspedes del hotel).

---

## Quick Reference

```
PROJECT:   nexi-prototype — Next.js 16 + React 19 + Tailwind v4 + TypeScript
PORT:      3100 (npm run dev)
DEPLOY:    git push origin main  (auto-deploys via Vercel Git integration)
           vercel --prod --yes --force  (manual fallback, needs .vercel/project.json)
DEMO:      https://nexi-prototype.vercel.app
REPO:      https://github.com/rubatrejo/nexi-prototype

KEY PATHS:
  src/components/screens/       → 82 screen files (all kiosk screens)
  src/components/ScreenRouter.tsx → Screen ID → lazy-loaded component map
  src/components/ui/            → Reusable components (ScreenShell, ActionButtons, ProgressBar, etc.)
  src/lib/kiosk-context.tsx     → Global state (useKiosk hook)
  src/lib/navigation.ts         → ScreenId type union, flows, SCREEN_META
  src/lib/transitions.ts        → Transition logic (crossfade between modules, slide within)
  src/lib/flow-types.ts         → Typed flowData interfaces (PaymentFlowData, BookingFlowData)
  src/lib/hotel-config.ts       → Hotel data single source of truth (brand, rooms, images)
  src/styles/globals.css         → Design tokens, button classes, animations
  src/app/page.tsx               → Entry point (onboarding steps 0-6)

COMMANDS:
  npm run dev         → Dev server on port 3100
  npm run build       → Production build
  npm run lint        → ESLint check
  npm run lint:fix    → ESLint auto-fix
  npm run format      → Prettier format
  /start              → Begin session (run every time)
  /end                → End session (run before closing)
```

---

## What is NEXI?

NEXI is a self-service kiosk product for hotels by TrueOmni. Guests use a touchscreen in hotel lobbies for check-in, check-out, room service, wayfinding, events, bookings, and more. This repository is a **Next.js prototype for demos and sales** — production will use Blazor + CMS.

Hardware target: landscape 1920×1080. Portrait is Phase 2.

---

## ABSOLUTE RULES — Never Violate These

These are non-negotiable. Breaking any of these is grounds for rejecting the work.

1. **`var(--token)` for ALL colors.** Never hardcode hex values in screen files. The only exceptions are `#fff` for text on dark cinematic backgrounds and `rgba()` values for glass effects.
2. **Both themes must work.** Every change must be verified in light AND dark mode. If you add a color, check `[data-theme="dark"]` in globals.css.
3. **Mona Sans + Inter ONLY.** Display/headings use `'Mona Sans', sans-serif`. Body/UI uses `'Inter', sans-serif`. No Montserrat, Roboto, or other fonts. `docs/00-foundations.md` documents the TrueOmni CMS system (Montserrat/Open Sans) — that does NOT apply here.
4. **Photography first.** Real photos in every element. Never use gradient placeholders. All images are local in `public/images/unsplash/`. Never use external Unsplash URLs.
5. **Touch-first.** Large tap targets (min 44×44px). No hover-dependent UI. No tooltips as primary information. This is a kiosk operated by fingers.
6. **Register new screens everywhere.** A new screen must be added to: `ScreenRouter.tsx` + `navigation.ts` (ScreenId type + SCREEN_META) + `transitions.ts` (FLOW_ORDER + MODULE_PREFIXES) + i18n files.
7. **Never break existing screens.** 82 screen files are interconnected. Before changing shared code (kiosk-context, navigation, transitions, globals.css), identify ALL screens that depend on it.
8. **Plan first, code second.** Enter Plan Mode. Iterate the plan with Ruben until he says "approved" or "proceed". Only then execute. For large features, Claude can 1-shot the entire block once approved.
9. **No new npm packages without approval.** Ask before adding any dependency.
10. **Inline styles with CSS variables.** Screens use inline styles with `var(--token)`, not Tailwind classes. Tailwind is available but inline styles give precise kiosk control.

---

## Anti-Patterns — NEVER Do These

These are mistakes that have happened before. Read them carefully.

- **DON'T use heavy transitions.** No blur/scale effects on screen changes. Ruben explicitly rejected these. Transitions are subtle: opacity crossfade between modules, 40px slide within flows.
- **DON'T touch the inner content scale on KioskFrame** without testing extensively in both themes across multiple screens. The outer frame is `52vw / max 980px / 16:9`, and an inner wrapper has `width/height: 125%` + `transform: scale(0.8)` to give screen content ~25% more breathing room without modifying the 82 screen files. If you adjust it, keep the two numbers linked: `width/height: (100/N)%` with `transform: scale(N)`. Verify IDL-01, DSH-01, ONB-02, CKI-01 in light AND dark mode. Previous iterations tried `zoom: 1.4` (too dense) and a 1920×1080 virtual viewport with `scale: 0.47` (too sparse) before landing here.
- **DON'T reverse the provider order.** `I18nProvider` MUST wrap `KioskProvider`. Reversing this breaks translations silently.
- **DON'T confuse file names with Screen IDs.** Files omit the dash (`CKI01.tsx`), IDs include it (`"CKI-01"`). Getting this wrong causes screens to not load.
- **DON'T use `as any` for Screen IDs.** Use the `ScreenId` type from `navigation.ts`. If a screen doesn't exist in the type, add it.
- **DON'T modify flowData field names** without grepping ALL screens that use them. The payment pipeline crosses 6+ screens.
- **DON'T add external image URLs.** All images must be local. Download and save to `public/images/unsplash/` if you need a new one.
- **DON'T use generic sans-serif for display text.** Mona Sans is the display font. Period.
- **DON'T add `console.log` to production code.** Use it for debugging, remove before committing.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| UI | React | 19.2.4 |
| Styling | Tailwind CSS v4 + CSS custom properties | 4.2.1 |
| Animation | Framer Motion | 12.34.3 |
| Maps | Leaflet + react-leaflet | 1.9.4 / 5.0.0 |
| AI Avatar | @heygen/streaming-avatar | 2.1.0 |
| Email | Resend | 6.9.4 |
| Language | TypeScript (strict mode) | 5.9.3 |
| Linter | ESLint (flat config) | 10+ |
| Formatter | Prettier | 3.8+ |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Entry — onboarding (steps 0-4) → kiosk demo (step 5) → ROI (step 6)
│   ├── layout.tsx                  # Root layout, Google Fonts (Mona Sans + Inter)
│   ├── theme-wrapper.tsx           # ThemeProviderWrapper (client component)
│   └── api/                        # API routes: send-welcome, heygen-token, tavus, did-stream
├── components/
│   ├── ScreenRouter.tsx            # Maps screen IDs → lazy-loaded components (with ErrorBoundary)
│   ├── layout/
│   │   ├── KioskFrame.tsx          # Main kiosk wrapper (52vw/980, inner scale 0.8, theme toggle, footer)
│   │   ├── GlobalHeader.tsx        # Hotel name, date/time, weather (48px bar)
│   │   └── ScreenLayout.tsx        # Shared layout wrapper
│   ├── screens/                    # 82 screen files (CKI01.tsx → WIF01.tsx)
│   ├── onboarding/                 # OnboardingWelcome, OnboardingSlides, OrientationSelect, ROICalculator
│   └── ui/                         # Reusable components:
│       ├── ScreenShell.tsx         # Standard screen wrapper (default + cinematic variants)
│       ├── ProgressBar.tsx         # Step progress bar (step/total)
│       ├── ActionButtons.tsx       # Back + Continue button row
│       ├── PageTitle.tsx           # Screen title + subtitle
│       ├── GlassCard.tsx           # Frosted glass card for cinematic screens
│       ├── ErrorBoundary.tsx       # React error boundary (wraps each screen)
│       ├── Icons.tsx               # SVG icon library
│       ├── AIConcierge.tsx         # AI assistant widget
│       └── InactivityModal.tsx     # "Are you still there?" modal
├── lib/
│   ├── kiosk-context.tsx           # Global state: currentScreen, theme, guestMode, navigation, inactivity
│   ├── navigation.ts              # ScreenId type union, flow arrays, SCREEN_META
│   ├── flow-types.ts              # Typed flowData interfaces (PaymentFlowData, BookingFlowData, FlowData)
│   ├── hotel-config.ts            # Hotel configuration (brand, colors, modules, rooms, images, timers)
│   ├── transitions.ts             # Screen transition logic (crossfade vs directional slide)
│   ├── theme-provider.tsx         # Theme context
│   ├── use-toast.tsx              # Toast notifications
│   └── i18n/                      # Translation system: I18nProvider, useI18n(), t("key")
│       ├── index.tsx              # Provider + hook + t() function
│       ├── types.ts               # Translation key types
│       └── en.ts, es.ts, fr.ts, ja.ts  # ~110 keys each
├── styles/
│   └── globals.css                # Design tokens, dark/light themes, button classes, grain, animations
public/
├── images/unsplash/               # 106 local images — NO external URLs
├── logos/                         # NEXI + TrueOmni SVG logos
└── *.mp4                          # face-scan, passport-scan animations
docs/
├── screen-map.html                # Visual map of all screens and flows (open in browser)
├── design-system-doc.html         # Full design token reference
└── web-interface-guidelines.md    # QA checklist
```

---

## Provider Hierarchy (Critical)

```
ThemeProvider (layout.tsx) → I18nProvider → KioskProvider → KioskFrame → ScreenRouter → ErrorBoundary → [Screen]
```

**I18nProvider MUST wrap KioskProvider** — never reverse this.

---

## 16 Kiosk Modules

| Module | Code | Entry | Screens |
|--------|------|-------|---------|
| Self Check-in | CKI | CKI-01 | 18 screens (CKI-01 → CKI-16) |
| Self Check-out | CKO | CKO-01 | 7 screens (CKO-00 → CKO-06) |
| Room Booking | BKG | BKG-01 | 8 screens |
| Room Service | RSV | RSV-01 | 9 screens |
| Wayfinding | WAY | WAY-01 | 2 screens |
| Events & Activities | EVT | EVT-01 | 5 screens |
| Local Listings | LST | LST-01 | 3 screens |
| Wi-Fi | WIF | WIF-01 | 1 screen |
| FAQ | FAQ | FAQ-01 | 1 screen |
| Upsells | UPS | UPS-01 | 3 screens |
| Ads | ADS | ADS-01 | 1 screen |
| TruePay | PAY | PAY-01 | 4 screens |
| Late Check-out | LCO | LCO-01 | 2 screens |
| Early Check-in | ECI | ECI-01 | 3 screens |
| Duplicate Key | DKY | DKY-01 | 3 screens |
| AI Avatar | AVT | AVT-01 | 2 screens |

Utility screens: IDL-01 (Idle), DSH-01 (Dashboard), ONB-02 (Action Select), STF-01→03 (Staff), INA-01 (Inactivity), RCT-01 (Receipt)

---

## Screen Conventions

**Naming:** `[MODULE]-[NUMBER][variant]` → `CKI-01`, `CKI-01q` (QR), `RSV-05p` (portrait), `CKI-05e` (error)

**Files omit the dash:** `CKI01.tsx` → Screen ID `"CKI-01"`

**Every screen file follows this structure:**

```tsx
"use client";

import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import GlobalHeader from "@/components/layout/GlobalHeader";

export default function ScreenName() {
  const { navigate, goBack } = useKiosk();
  const { t } = useI18n();

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ flex: 1, padding: "0 48px" }}>
        {/* Content — always use var(--token) for colors */}
      </div>
    </div>
  );
}
```

**Or use the reusable components:**

```tsx
"use client";

import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import ScreenShell from "@/components/ui/ScreenShell";
import ProgressBar from "@/components/ui/ProgressBar";
import PageTitle from "@/components/ui/PageTitle";
import ActionButtons from "@/components/ui/ActionButtons";

export default function ScreenName() {
  const { navigate } = useKiosk();
  const { t } = useI18n();

  return (
    <ScreenShell>
      <ProgressBar step={3} total={8} />
      <PageTitle title={t("module.title")} subtitle={t("module.subtitle")} />
      {/* Content */}
      <ActionButtons nextScreen="NEXT-01" />
    </ScreenShell>
  );
}
```

---

## Adding a New Screen — Checklist

1. Create file in `src/components/screens/MOD01.tsx`
2. Add to `ScreenRouter.tsx`: `"MOD-01": dynamic(() => import("./screens/MOD01"))`
3. Add to `navigation.ts`: ScreenId union type + SCREEN_META entry
4. Add to `transitions.ts`: FLOW_ORDER array + MODULE_PREFIXES entry
5. Add i18n keys to `en.ts`, `es.ts`, `fr.ts`, `ja.ts`
6. **Verify:** both themes, navigation forward/back, transitions work

---

## Navigation System

| Method | Purpose |
|--------|---------|
| `navigate(screenId)` | Go to specific screen (pushes to history) |
| `goBack()` | Pop history stack |
| `goHome()` | Jump to DSH-01, clear history |
| `toggleTheme()` | Switch light/dark |
| `toggleGuestMode()` | Switch guest/reservation data view |
| `setGuestData({...})` | Update guest session data |
| `setFlowData({...})` | Persist typed data across screens (see FlowData) |
| `openModal(id, data)` | Show modal overlay |
| `closeModal()` | Dismiss modal |

**Debug:** Add `?screen=CKI-05` to URL to jump directly to any screen.

---

## flowData — Typed Cross-Screen Data

flowData passes data between screens within a flow. Types are defined in `src/lib/flow-types.ts`.

### Payment Pipeline (most critical)

```
PRODUCERS (set flowData)              CONSUMERS (read flowData)
──────────────────────────────        ────────────────────────
ECI-03 (Early Check-in Fee)      →   PAY-02 reads: payAmount
EVT-02 (Event Reservation)      →   PAY-03 reads: payAmount, payTitle, payNextScreen
LCO-01 (Late Check-out)         →   LCO-02 reads: payAmount

Flow: Module sets flowData → PAY-02 (processing) → PAY-03 (confirmation) → payNextScreen
```

### Rules

- flowData resets on `resetSession()` or navigation to IDL-01
- Always provide defaults when reading: `flowData.payAmount || "$0.00"`
- If adding a new field, add it to `flow-types.ts` AND document it here
- If renaming a field, grep ALL screens that use it

---

## Design System: Nordic Cinematic (LOCKED)

### Color Tokens

Always use `var(--token)`. Reference `src/styles/globals.css` for the full list.

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--bg` | #F5F5F0 | #0C0C0E | Page background |
| `--bg-card` | #FFFFFF | #1A1A1F | Card surfaces |
| `--bg-elevated` | #FFFFFF | #222228 | Elevated surfaces |
| `--primary` | #1288FF | #1288FF | Primary actions |
| `--text` | #1A1A1A | #F0F0F0 | Primary text |
| `--text-secondary` | #6B7280 | #8E93A4 | Secondary text |
| `--border` | #E8E8E3 | #2A2A30 | Borders |
| `--success` | #16A34A | #22C55E | Confirmations |
| `--error` | #DC2626 | #EF4444 | Errors |
| `--amber` | #D4960A | #E5A91B | Warnings, highlights |
| `--purple` | #8B5CF6 | #A78BFA | Booking, events |

### Typography

- **Display/Headings:** `fontFamily: "'Mona Sans', sans-serif"` — weight 400-800
- **Body/UI:** `fontFamily: "'Inter', sans-serif"` — weight 400
- CSS `h1-h6` are auto-set to Mona Sans in globals.css

### Spacing & Radius

- Base unit: 4px. Common: 8, 12, 16, 20, 24, 32, 40, 48, 64
- `--radius-sm: 8px`, `--radius-md: 12px`, `--radius-lg: 16px`, `--radius-xl: 20px`, `--radius-full: 9999px`

### CSS Classes (globals.css)

| Class | Purpose |
|-------|---------|
| `.btn .btn-primary` | Blue CTA button |
| `.btn .btn-ghost` | Transparent with border |
| `.btn .btn-amber` | Amber CTA |
| `.btn-lg` / `.btn-sm` | Size variants |
| `.glass-card` | Frosted glass card (blur 24px) |
| `.grain` | Film grain SVG overlay (position absolute, inset 0) |
| `.kiosk-viewport` | Kiosk frame (60vw, 16:9) |

### Design Principles

1. **Photography is everything** — real photos, never gradient placeholders
2. **Film grain + texture** — subtle `.grain` overlay for editorial depth
3. **The content IS the interface** — minimize UI chrome
4. **Bottom sheets > side panels** for detail views (touch natural)
5. **Glass cards** with `backdrop-filter: blur()` over photography
6. **Generous whitespace** — Nordic clean aesthetic
7. **Subtle motion** — Framer Motion, staggered fadeUp, cinematic easing `[0.22, 1, 0.36, 1]`

---

## Transitions

- **Between modules** (CKI → RSV): Crossfade (opacity, 250ms)
- **Forward within module** (CKI-01 → CKI-02a): Slide right (x: 40→0, 250ms)
- **Backward within module** (CKI-03 → CKI-01): Slide left (x: -40→0, 250ms)

Direction is auto-detected from `FLOW_ORDER` in `transitions.ts`.

---

## KioskFrame Details

- **Outer frame:** `52vw / max-width: 980px`, `aspect-ratio: 16/9` (landscape), rounded 12px, with the Nordic drop shadow
- **Inner content scale:** wrapper div with `width: 125%, height: 125%, transform: scale(0.8), transform-origin: top left`. Net effect: each screen renders in a 125% layout box and gets visually downscaled to exactly fill the frame, giving content 25% more breathing room without touching any screen file. The two numbers (125% and 0.8) are linked: `N%` must equal `100/scale`.
- **Theme:** `data-theme` attribute on the kiosk frame div — CSS variables respond automatically
- **Background outside the frame:** `#E8E8E3` (warm gray)
- **History:** The frame originally had `zoom: 1.4` on the outer div — felt too dense. We tried removing the zoom (just `zoom: 1`) — still felt dense because screens were rendered at native px in a smaller container. Then tried a 1920×1080 virtual viewport with `transform: scale(frame_width/1920)` — that ran scale ~0.47 which felt too sparse. Landed on the current approach (outer frame stays at the original 52vw/980, inner content scaled to 0.8) because Ruben's concern was specifically about content density inside the frame, not the frame size itself.
- **CRITICAL:** The overlays (ErrorModal, AIConcierge, InactivityModal) live INSIDE the scaled wrapper so they share the content density. The transform creates a new stacking context — `position: fixed` inside overlays becomes relative to the wrapper, which is the intended behaviour (they should cover the kiosk frame, not the browser viewport). Moving them outside the wrapper would make them render at 100% density while screens render at 80%, creating a mismatch.

---

## Hotel Configuration

`src/lib/hotel-config.ts` — single source of truth for: brand identity, colors, fonts, 16 modules, 3 room types, 3 upgrades, images, guest defaults, hotel info, inactivity timers.

Defaults: guest "Guest", room "1247", reservation "RES-2026-48291", inactivity warning 90s, reset 30s.

In production, the CMS generates this per hotel.

---

## i18n

- 4 languages: EN, ES, FR, JA (~110 keys each)
- Use `const { t } = useI18n()` then `t("cki.lookup.title")`
- Phase 1 done (9 core screens). Phase 2 pending (secondary modules)
- Fallback: hardcoded English where Phase 2 keys are pending

---

## Onboarding Flow (page.tsx)

| Step | Component | Purpose |
|------|-----------|---------|
| 0 | OnboardingWelcome | Lead capture form (name, email, hotel, rooms) |
| 1-3 | OnboardingSlides | Product pitch (hero, modules, stats) |
| 4 | OrientationSelect | Landscape (active) / Portrait (Coming Soon) |
| 5 | KioskFrame + ScreenRouter | Full kiosk demo |
| 6 | ROICalculator | Post-demo ROI estimator |

Guest name from step 0 flows to all kiosk screens via `guestNameOverride` prop.

---

## Environment Variables

Required in `.env.local` (never committed):

```
RESEND_API_KEY=           # Welcome email API
HEYGEN_API_KEY=           # AI avatar streaming
TAVUS_API_KEY=            # Tavus avatar API
DID_API_KEY=              # D-ID avatar streaming
```

---

## Reusable Components (src/components/ui/)

Use these when building new screens. Existing screens can adopt them gradually.

| Component | Purpose | When to use |
|-----------|---------|-------------|
| `ScreenShell` | Standard screen wrapper | Every screen — replaces the outer div + GlobalHeader boilerplate |
| `ProgressBar` | Step indicator (1/8) | Multi-step flows (check-in, booking, etc.) |
| `ActionButtons` | Back + Continue row | Bottom of any screen with navigation |
| `PageTitle` | Title + subtitle | Centered page headings |
| `GlassCard` | Frosted glass card | Cinematic/overlay screens (payment, confirmations) |
| `ErrorBoundary` | Error catching | Already wraps every screen in ScreenRouter |

---

## Quality Gates — Definition of Done

### Before marking ANY work as complete, verify ALL of these:

**Visual:**
- [ ] Works in light mode
- [ ] Works in dark mode
- [ ] No hardcoded hex colors (only `var(--token)`)
- [ ] Fonts are Mona Sans (headings) + Inter (body) only
- [ ] Images are local (`/images/unsplash/`)
- [ ] Touch targets are ≥44×44px

**Functional:**
- [ ] Navigation forward works
- [ ] Navigation back works (goBack returns to correct screen)
- [ ] Transitions are correct (crossfade between modules, slide within)
- [ ] No console errors in browser dev tools
- [ ] No TypeScript errors (`npm run build` passes)

**Integration:**
- [ ] New screens registered in ScreenRouter, navigation.ts, transitions.ts
- [ ] i18n keys added for any new user-facing text
- [ ] flowData fields typed in flow-types.ts if cross-screen data is added
- [ ] No existing screens broken (spot-check 3-5 related screens)

**Code:**
- [ ] No `as any` casts for ScreenIds — update the type union
- [ ] No unused imports
- [ ] No `console.log` left in code
- [ ] Consistent with existing code patterns

---

## Workflow — How to Approach Any Task

```
1. UNDERSTAND  → What exactly is being asked? Ask clarifying questions.
2. SCOPE       → Which screens, modules, and files are affected?
3. PLAN        → List every file to modify. Wait for approval.
4. IMPLEMENT   → Make changes across all affected files.
5. VERIFY      → Run through Quality Gates checklist above.
6. SIMPLIFY    → Remove dead code, consolidate duplicate patterns.
```

**Before touching any screen:** check `docs/screen-map.html` to understand navigation flows.

**Before large changes:** create a plan listing all files and potential side effects. Wait for Ruben's approval.

---

## Common Gotchas

- **`ignoreBuildErrors: true`** in `next.config.ts` — TS errors don't block builds. Fix them properly anyway.
- **Dynamic imports in ScreenRouter** — unregistered screens silently show Placeholder.
- **`data-theme` is on the kiosk frame div**, not on `<html>` — theme CSS variables only work inside KioskFrame.
- **Fonts from Google Fonts** — not self-hosted, so offline demos won't have correct typography.
- **ScreenId type** — 81+ member union. Adding a new screen without updating this causes TypeScript errors on `navigate()`.
