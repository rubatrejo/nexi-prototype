# TrueOmni Design System — Foundations v1.0
## Created: 2026-02-15 by Luca for Ruben

---

## 1. COLOR SYSTEM

### Brand Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `brand-primary` | #004F8B | Primary blue — CTAs, headers, active states, links |
| `brand-dark` | #282828 | Dark base — text, backgrounds, nav |

### Primary Blue Scale (derived from #004F8B)
| Token | Hex | Usage |
|-------|-----|-------|
| `blue-900` | #003459 | Darkest blue — hover states, pressed |
| `blue-800` | #004F8B | **Brand primary** |
| `blue-700` | #0E6AAD | Active elements |
| `blue-600` | #1796D6 | Links, interactive |
| `blue-500` | #3AAEE0 | Secondary actions |
| `blue-400` | #6DC4EA | Highlights |
| `blue-300` | #A0D8F2 | Backgrounds, tags |
| `blue-200` | #CCE9F8 | Light backgrounds |
| `blue-100` | #E8F4FC | Subtle backgrounds |
| `blue-50`  | #F4FAFD | Near-white tint |

### Neutral Scale (derived from #282828)
| Token | Hex | Usage |
|-------|-----|-------|
| `neutral-900` | #282828 | **Brand dark** — primary text |
| `neutral-800` | #3C3C3C | Secondary text |
| `neutral-700` | #4A4A4A | Tertiary text |
| `neutral-600` | #5E5E5E | Placeholder text |
| `neutral-500` | #707070 | Disabled text |
| `neutral-400` | #8E8E8E | Borders strong |
| `neutral-300` | #B0B0B0 | Borders |
| `neutral-200` | #D4D4D4 | Dividers |
| `neutral-100` | #EBEBEB | Backgrounds subtle |
| `neutral-50`  | #F5F5F5 | Surface background |
| `neutral-0`   | #FFFFFF | White |

### Accent: Amber Gold
| Token | Hex | Usage |
|-------|-----|-------|
| `accent-700` | #B8860B | Darkest — pressed state |
| `accent-600` | #D4972E | Hover state |
| `accent-500` | #E8A830 | **Primary accent** — highlights, badges, featured items |
| `accent-400` | #F0BE5A | Active tags, notifications |
| `accent-300` | #F5D48A | Light accent backgrounds |
| `accent-200` | #FAE7B8 | Subtle backgrounds |
| `accent-100` | #FDF3DB | Near-white accent |

### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `success-500` | #2D8A4E | Confirmations, completed |
| `success-100` | #E6F4EB | Success background |
| `warning-500` | #E8A830 | Warnings (shares accent) |
| `warning-100` | #FDF3DB | Warning background |
| `error-500`   | #D93025 | Errors, destructive |
| `error-100`   | #FDECEA | Error background |
| `info-500`    | #1796D6 | Informational (shares blue-600) |
| `info-100`    | #E8F4FC | Info background |

### Gradients
| Token | Value | Usage |
|-------|-------|-------|
| `gradient-brand` | linear-gradient(135deg, #004F8B 0%, #282828 100%) | Hero sections, billboards |
| `gradient-brand-light` | linear-gradient(135deg, #004F8B 0%, #3C3C3C 100%) | Headers, cards premium |
| `gradient-blue` | linear-gradient(180deg, #004F8B 0%, #1796D6 100%) | Buttons premium, CTAs |
| `gradient-dark` | linear-gradient(180deg, #282828 0%, #004F8B 100%) | Dark sections, footers |
| `gradient-overlay` | linear-gradient(180deg, transparent 0%, rgba(40,40,40,0.85) 100%) | Image overlays |

---

## 2. TYPOGRAPHY

### Font Stack
| Role | Family | Fallback |
|------|--------|----------|
| **Primary** | Montserrat | system-ui, -apple-system, sans-serif |
| **Secondary** | Open Sans | system-ui, -apple-system, sans-serif |
| **Icons** | Font Awesome 7 Pro | — |

**Montserrat** → Headlines, titles, buttons, navigation, display
**Open Sans** → Body text, descriptions, captions, form inputs, metadata

### Type Scale (base 16px, ratio ~1.333 Perfect Fourth)

| Token | Size | Weight | Line Height | Family | Usage |
|-------|------|--------|-------------|--------|-------|
| `display-xl` | 80px | Bold 700 | 88px (1.1) | Montserrat | Billboard/screensaver headlines |
| `display-lg` | 60px | Bold 700 | 68px (1.13) | Montserrat | Module hero titles |
| `display-md` | 48px | Bold 700 | 56px (1.17) | Montserrat | Section headers |
| `heading-lg` | 36px | Bold 700 | 44px (1.22) | Montserrat | Page titles |
| `heading-md` | 28px | Bold 700 | 36px (1.29) | Montserrat | Card titles, module names |
| `heading-sm` | 22px | SemiBold 600 | 30px (1.36) | Montserrat | Sub-sections |
| `body-lg` | 20px | Regular 400 | 30px (1.5) | Open Sans | Lead paragraphs |
| `body-md` | 16px | Regular 400 | 24px (1.5) | Open Sans | **Base body** |
| `body-sm` | 14px | Regular 400 | 20px (1.43) | Open Sans | Secondary info, metadata |
| `caption` | 12px | Regular 400 | 16px (1.33) | Open Sans | Captions, labels |
| `overline` | 11px | Bold 700 | 16px (1.45) | Montserrat | Category tags, overlines (uppercase) |
| `button-lg` | 20px | Bold 700 | 24px (1.2) | Montserrat | Large CTAs |
| `button-md` | 16px | Bold 700 | 20px (1.25) | Montserrat | Standard buttons |
| `button-sm` | 14px | Bold 700 | 18px (1.29) | Montserrat | Small buttons |

### Special Use Cases
| Token | Size | Weight | Family | Usage |
|-------|------|--------|--------|-------|
| `countdown` | 140px | Bold 700 | Montserrat | Photo Booth countdown |
| `kiosk-touch` | 50px | Bold 700 | Montserrat | "TOUCH TO START" screensaver |
| `tab-active` | 22px | Bold 700 | Montserrat | Active tab labels |
| `tab-inactive` | 22px | Medium 500 | Montserrat | Inactive tab labels |
| `filter-chip` | 14px | SemiBold 600 | Montserrat | Filter chips |
| `input-text` | 18px | Regular 400 | Open Sans | Form input values |
| `input-label` | 14px | SemiBold 600 | Open Sans | Form labels |
| `input-placeholder` | 18px | Regular 400 | Open Sans | Placeholder text (neutral-500) |

---

## 3. SPACING

### Base: 4px unit, primary scale 8px

| Token | Value | Usage |
|-------|-------|-------|
| `space-0` | 0px | — |
| `space-1` | 4px | Tight gaps (icon-to-text) |
| `space-2` | 8px | Inline elements, chip padding |
| `space-3` | 12px | Small padding |
| `space-4` | 16px | **Standard padding** |
| `space-5` | 20px | Medium gaps |
| `space-6` | 24px | Section internal spacing |
| `space-8` | 32px | Component gaps |
| `space-10` | 40px | Large gaps |
| `space-12` | 48px | Section spacing |
| `space-16` | 64px | Major section breaks |
| `space-20` | 80px | Hero spacing |
| `space-24` | 96px | Maximum spacing |

---

## 4. BORDER RADIUS

| Token | Value | Usage |
|-------|-------|-------|
| `radius-none` | 0px | Sharp edges (images, kiosk-specific) |
| `radius-sm` | 4px | Chips, small buttons |
| `radius-md` | 8px | Cards, inputs, buttons |
| `radius-lg` | 16px | Modals, large cards |
| `radius-xl` | 24px | Bottom sheets, panels |
| `radius-full` | 9999px | Circular elements, avatars, Photo Booth stickers |

---

## 5. ELEVATION / SHADOWS

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-none` | none | Flat elements |
| `shadow-sm` | 0 1px 3px rgba(0,0,0,0.12) | Cards, subtle lift |
| `shadow-md` | 0 4px 12px rgba(0,0,0,0.15) | Dropdowns, popovers |
| `shadow-lg` | 0 8px 24px rgba(0,0,0,0.20) | Modals, floating panels |
| `shadow-xl` | 0 16px 48px rgba(0,0,0,0.25) | Full-screen overlays |

---

## 6. BREAKPOINTS (Kiosk-specific)

| Token | Value | Usage |
|-------|-------|-------|
| `kiosk-portrait` | 1080 × 1920 | Primary kiosk layout |
| `kiosk-landscape` | 1920 × 1080 | Landscape variant |
| `email` | 661px max-width | Email templates |

---

## Migration Notes
### Fonts to ELIMINATE
- ❌ Tahoma → replace with Open Sans
- ❌ Nunito → replace with Open Sans
- ❌ Roboto → replace with Open Sans
- ❌ Proxima Nova → replace with Montserrat
- ❌ MyriadPro → replace with Open Sans
- ❌ Archivo → replace with Montserrat
- ❌ TrueOmniHeader → replace with Montserrat Bold
- ❌ TrueOmniSubheader → replace with Open Sans Regular
- ❌ Font Awesome 6 Pro → upgrade to Font Awesome 7 Pro
- ❌ Font Awesome 7 Sharp → consolidate to Font Awesome 7 Pro
