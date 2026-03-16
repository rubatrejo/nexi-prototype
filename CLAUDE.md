# CLAUDE.md — NEXI Hotel Self Check-in Kiosk

## What is NEXI?

NEXI is a self-service kiosk product for hotels, built by TrueOmni. It handles check-in, check-out, room service, wayfinding, events, bookings, and more — all through a touchscreen interface in hotel lobbies.

- **Brand:** NEXI, "made by TrueOmni"
- **Hardware:** Landscape 1920x1080 / Portrait 1080x1920 (portrait is Phase 2)
- **Production stack:** Blazor + CMS (this prototype is Next.js for demo/sales purposes)
- **Live demo:** https://nexi-prototype.vercel.app

## Tech Stack (Prototype)

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 + CSS custom properties (design tokens in `src/styles/globals.css`)
- **Animation:** Framer Motion
- **State:** React Context (`src/lib/kiosk-context.tsx`)
- **i18n:** Custom provider (`src/lib/i18n/`) — EN, ES, FR, JA
- **Transitions:** `src/lib/transitions.ts` — crossfade between modules, directional slide within flows
- **TypeScript:** `ignoreBuildErrors: true` in next.config.ts (preexisting strict-mode issues)

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main entry — onboarding flow → kiosk demo → ROI calculator
│   ├── layout.tsx            # Root layout, font loading
│   └── api/                  # API routes (send-welcome, heygen, tavus, did-stream)
├── components/
│   ├── layout/
│   │   ├── KioskFrame.tsx    # THE wrapper — kiosk chrome, theme toggle, guest/reservation toggle, footer
│   │   └── GlobalHeader.tsx  # Header component
│   ├── screens/              # 82 screen files (see Screen Map below)
│   ├── onboarding/           # OnboardingWelcome, OnboardingSlides, OrientationSelect, ROICalculator
│   └── ui/                   # Shared UI (ErrorModal, AIConcierge, InactivityModal, ScreenNav, Icons)
├── lib/
│   ├── kiosk-context.tsx     # Global state: currentScreen, theme, guestMode, navigation, inactivity
│   ├── hotel-config.ts       # Hotel configuration (name, branding, modules, inactivity timers)
│   ├── i18n/                 # Translation system (en.ts, es.ts, fr.ts, ja.ts, index.tsx, types.ts)
│   ├── transitions.ts        # Screen transition logic
│   ├── theme-provider.tsx    # Theme context
│   └── use-toast.tsx         # Toast notifications
├── styles/
│   └── globals.css           # Design tokens (CSS variables), dark/light themes, grain texture, animations
public/
├── images/unsplash/          # 106 local images (no external dependencies)
└── fonts/                    # Mona Sans, Inter
docs/
├── screen-map.html           # Visual map of all 78 screens with navigation flows
├── 00-foundations.md          # Design system foundations (colors, typography, spacing)
├── NEXI-Visual-Styles.html   # 5 style explorations (Nordic Cinematic won)
├── style-options.html        # TrueOmni 3 style options moodboard
├── design-system-doc.html    # Full design system documentation
└── web-interface-guidelines.md # Vercel Web Interface Guidelines (QA checklist)
```

## 16 Kiosk Modules

1. **Self Check-in** (CKI) — ID scan, reservation lookup, room assignment, key card
2. **Self Check-out** (CKO) — bill review, payment, receipt
3. **Room Booking** (BKG) — date selection, room browsing, reservation
4. **Room Service** (RSV) — menu, cart, order, payment
5. **Wayfinding** (WAY) — interactive floor map
6. **Events & Activities** (EVT) — calendar, booking, details
7. **Local Listings** (LST) — restaurants, attractions, map
8. **Wi-Fi Connect** (WIF) — one-tap connection
9. **FAQ** (FAQ) — searchable help
10. **Upsells** (UPS) — spa, dining, upgrades
11. **Ads** (ADS) — banner/header/popup
12. **TruePay** (PAY) — payment terminal
13. **Late Check-out** (LCO) — availability, payment
14. **Early Check-in** (ECI) — fee, payment
15. **Duplicate Key** (DKY) — key card replacement
16. **AI Avatar** (AVT) — HeyGen/D-ID integration

Plus: Idle (IDL), Dashboard (DSH), Action Select (ONB), Staff Admin (STF), Inactivity (INA), Room Check-in Terminal (RCT)

## Screen Naming Convention

`[MODULE][NUMBER][variant]` — e.g., `CKI01` (Check-in step 1), `CKI01q` (quick variant), `RSV05p` (portrait variant)

## Visual Style: Nordic Cinematic (LOCKED)

The approved design direction. Do not deviate.

### Typography
- **Display/Headings:** Mona Sans (variable weight 400-800)
- **Body/UI:** Inter
- Never use generic sans-serif for display (no Montserrat, no Roboto)

### Color Palette

#### Light Mode (default)
| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | #F5F5F0 | Page background |
| `--bg-card` | #FFFFFF | Card surfaces |
| `--primary` | #1288FF | Primary actions, accent |
| `--primary-hover` | #0B6FD4 | Hover state |
| `--text` | #1A1A1A | Primary text |
| `--text-secondary` | #6B7280 | Secondary text |
| `--border` | #E8E8E3 | Borders, dividers |
| `--success` | #16A34A | Confirmations |
| `--error` | #DC2626 | Errors |

#### Dark Mode
| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | #0C0C0E | Page background |
| `--bg-card` | #1A1A1F | Card surfaces |
| `--primary` | #1288FF | Same accent (consistent) |
| `--text` | #F0F0F0 | Primary text |
| `--text-secondary` | #8E93A4 | Secondary text |
| `--border` | #2A2A30 | Borders |

### Design Principles
- **Photography is everything** — real photos in every element, never gradient placeholders
- **Film grain + texture** — subtle SVG noise overlay for editorial depth (`.grain` class)
- **Ken Burns** on hero images (CSS `kenBurns` animation)
- **The content IS the interface** — minimize UI chrome, let photos and typography do the work
- **Bottom sheets > side panels** for detail views (natural for touch)
- **Glass cards** with `backdrop-filter: blur()` over photography backgrounds
- **Generous whitespace** — Nordic clean aesthetic
- **Motion with purpose** — cubic-bezier transitions, staggered fadeUp reveals
- **Crossfade** between modules, **directional slide** within flows

### Spacing System
- Base unit: 4px
- Common: 8, 12, 16, 20, 24, 32, 40, 48, 64
- Border radius tokens: `--radius-sm: 8px`, `--radius-md: 12px`, `--radius-lg: 16px`, `--radius-xl: 20px`, `--radius-full: 9999px`

## KioskFrame — How It Works

The `KioskFrame` component wraps all kiosk content. Key details:

- **Viewport:** `52vw / max-width 980px` with `zoom: 1.4` — this makes content render at proper kiosk proportions inside the browser demo
- **Aspect ratio:** 16:9 (landscape)
- **Theme toggle:** Light/Dark mode via `data-theme` attribute
- **Guest/Reservation toggle:** Switches between guest and reservation flows
- **Footer:** "Back to Our Solutions" + "Calculate Your ROI" buttons + "Powered by TrueOmni" logo
- **Background:** `#E8E8E3` (warm light gray)

**CRITICAL:** Do not change the `zoom: 1.4` value without testing. It compensates for rem-based content sizing in a viewport-relative container.

## Onboarding Flow (5 steps + ROI)

1. **Welcome** (step 0) — 65/35 split, name/email/hotel form, corporate email validation
2. **Slide 1** (step 1) — Cinematic takeover hero
3. **Slide 2** (step 2) — Dark module cards (6 modules)
4. **Slide 3** (step 3) — Stats bento (4 glass cards) + CTA
5. **Orientation** (step 4) — Landscape (active) / Portrait (Coming Soon)
6. **Demo** (step 5) — Full kiosk experience
7. **ROI Calculator** (step 6) — Input rooms/staff/costs, calculates savings

The guest name from the welcome form flows to ALL kiosk screens (personalized experience).

## i18n System

- **Provider:** `src/lib/i18n/index.tsx` (I18nProvider, useI18n hook, `t("key")` function)
- **Languages:** EN, ES, FR, JA (~110 keys each)
- **Language selector:** In ONB02 (Action Select screen) — DO NOT CHANGE this UI
- **CRITICAL:** I18nProvider MUST wrap KioskProvider in page.tsx (step >= 5)
- Phase 1 done (9 core screens). Phase 2 pending (secondary modules)

## Navigation System

Screens navigate via `navigate("SCREEN-CODE")` from `useKiosk()` context. The `ScreenRouter` maps screen codes to lazy-loaded components. All navigation is defined within individual screen files.

## Development

```bash
npm install
npm run dev        # starts on localhost:3000
```

## Deployment

```bash
vercel --prod --yes --force
```

The project is linked to `rubatrejo-gmailcoms-projects/nexi-prototype` on Vercel.

## Working with GSD-2 (Optional)

For autonomous milestone-based development, install [GSD-2](https://github.com/gsd-build/gsd-2):

```bash
npm install -g gsd-pi
gsd                # interactive mode
/gsd auto          # autonomous mode — walks away, comes back to built features
```

Use when adding new modules or large features. Not needed for fixes or small changes.

## Rules

1. **Never break existing screens** — there are 82 screen files, all interconnected
2. **Follow the Nordic Cinematic style** — no generic UI, no gradient placeholders, always use photography
3. **Test both themes** — every change must work in light AND dark mode
4. **Use design tokens** — never hardcode colors, use CSS variables from globals.css
5. **Keep transitions subtle** — Ruben rejected heavy blur/scale effects
6. **Images are local** — all in `public/images/unsplash/`, no external Unsplash URLs
7. **Screen files are self-contained** — each screen handles its own layout, state, and navigation
8. **Touch-first** — this is a kiosk, design for fingers not cursors
9. **Accessibility is Phase 2** — ADA compliance planned, not blocking current work
10. **English first** — i18n exists but English is the primary language

## Reference Docs

- `docs/screen-map.html` — Open in browser to see all 78 screens visually
- `docs/00-foundations.md` — Design tokens, color scales, typography
- `docs/web-interface-guidelines.md` — QA checklist for web interfaces
- `docs/NEXI-Visual-Styles.html` — Visual style exploration (Nordic Cinematic won)
