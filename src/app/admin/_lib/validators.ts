// Shared validation helpers for /admin form fields. Mirrored in
// theme-provider.tsx so the kiosk has a defensive sanitize at runtime.
// If you change the rules here, update sanitizeColor / sanitizeGradient
// in src/lib/theme-provider.tsx to match.

export function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64);
}

// Accepts any single CSS colour value: hex (3/4/6/8 chars), rgb()/rgba()/
// hsl()/hsla()/color() functions, or single-token alphabetic named
// colours (red, blue, transparent, currentcolor, …). Rejects gradients
// and arbitrary strings — those would break SVG strokes / borders / text
// when injected into --primary etc.
export function isValidColor(value: string): boolean {
  if (!value || typeof value !== "string") return false;
  const v = value.trim();
  if (!v) return false;
  if (/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v)) return true;
  if (/^(rgb|rgba|hsl|hsla|color)\s*\(/i.test(v)) return true;
  if (/^[a-zA-Z]+$/.test(v)) return true;
  return false;
}

// Used only for the optional primaryGradient field where the user
// explicitly wants a gradient. Empty strings are valid (the field is
// optional). Anything else must start with one of the gradient functions.
export function isValidGradient(value: string | undefined): boolean {
  if (!value) return true;
  const v = value.trim();
  if (!v) return true;
  return /^(linear|radial|conic|repeating-linear|repeating-radial|repeating-conic)-gradient\s*\(/i.test(v);
}
