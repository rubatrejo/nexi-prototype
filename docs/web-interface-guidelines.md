# Web Interface Guidelines (Vercel)
# Fuente: https://github.com/vercel-labs/web-interface-guidelines
# Regla permanente: aplicar en TODOS los entregables de UI/web

## Accessibility
- Icon-only buttons need aria-label
- Form controls need <label> or aria-label
- Interactive elements need keyboard handlers (onKeyDown/onKeyUp)
- <button> for actions, <a>/<Link> for navigation (not <div onClick>)
- Images need alt (or alt="" if decorative)
- Decorative icons need aria-hidden="true"
- Async updates (toasts, validation) need aria-live="polite"
- Semantic HTML before ARIA
- Headings hierarchical h1-h6; include skip link
- scroll-margin-top on heading anchors

## Focus States
- Visible focus: focus-visible:ring-* or equivalent
- Never outline-none without focus replacement
- :focus-visible over :focus
- :focus-within for compound controls

## Forms
- Inputs need autocomplete and meaningful name
- Correct type (email, tel, url, number) and inputmode
- Never block paste
- Labels clickable (htmlFor or wrapping)
- spellCheck={false} on emails, codes, usernames
- Submit button stays enabled until request starts; spinner during request
- Errors inline next to fields; focus first error on submit
- Placeholders end with "..."
- Warn before navigation with unsaved changes

## Animation
- Honor prefers-reduced-motion
- Animate transform/opacity only (compositor-friendly)
- Never transition: all — list properties explicitly
- Set correct transform-origin
- Animations interruptible

## Typography
- Use ... not ...
- Curly quotes
- Non-breaking spaces: 10 MB, Cmd K
- Loading states end with "..."
- tabular-nums for number columns
- text-wrap: balance or text-pretty on headings

## Content Handling
- Text containers handle long content: truncate, line-clamp, break-words
- Flex children need min-w-0 for truncation
- Handle empty states
- Anticipate short, average, and very long inputs

## Images
- <img> needs explicit width and height (prevents CLS)
- Below-fold: loading="lazy"
- Above-fold: priority or fetchpriority="high"

## Performance
- Large lists (>50 items): virtualize
- No layout reads in render
- Prefer uncontrolled inputs
- Preconnect for CDN domains
- Critical fonts: preload with font-display: swap

## Navigation & State
- URL reflects state (filters, tabs, pagination)
- Links use <a>/<Link> (Cmd+click support)
- Deep-link all stateful UI
- Destructive actions need confirmation or undo

## Touch & Interaction
- touch-action: manipulation
- overscroll-behavior: contain in modals/drawers
- Disable text selection during drag
- autoFocus sparingly — desktop only

## Dark Mode & Theming
- color-scheme: dark on <html>
- <meta name="theme-color"> matches background
- Native <select>: explicit bg and color for Windows

## Anti-patterns (FLAG these)
- user-scalable=no or maximum-scale=1
- onPaste with preventDefault
- transition: all
- outline-none without focus-visible replacement
- onClick navigation without <a>
- <div>/<span> with click handlers (should be <button>)
- Images without dimensions
- Large arrays .map() without virtualization
- Form inputs without labels
- Icon buttons without aria-label
- Hardcoded date/number formats (use Intl.*)
- autoFocus without justification
