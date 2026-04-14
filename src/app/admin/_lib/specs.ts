// Upload constraints for the various ImageField slots in /admin.
// Centralised here so tweaking one limit doesn't require hunting
// through the JSX. accept = MIME filter for the native picker;
// formats = human-readable list shown to the user; warnBytes =
// soft cap that triggers an amber warning; maxBytes = hard cap that
// rejects the upload outright; ratio = optional dimension hint.

export type UploadSpec = {
  accept: string;
  formats: string;
  warnBytes: number;
  maxBytes: number;
  ratio?: string;
};

const KB = 1024;

export const SPEC_LOGO: UploadSpec = { accept: "image/svg+xml,image/png", formats: "SVG · PNG (transparent)", warnBytes: 40 * KB, maxBytes: 200 * KB };
export const SPEC_ICON: UploadSpec = { accept: "image/svg+xml,image/png", formats: "SVG · PNG", warnBytes: 20 * KB, maxBytes: 100 * KB, ratio: "1:1 square" };
export const SPEC_HERO: UploadSpec = { accept: "image/jpeg,image/webp,image/png", formats: "JPG · WebP · PNG", warnBytes: 400 * KB, maxBytes: 1500 * KB, ratio: "16:9 · ≥1600×900" };
export const SPEC_DEFAULT: UploadSpec = { accept: "image/*", formats: "PNG · JPG · SVG · WebP", warnBytes: 500 * KB, maxBytes: 2000 * KB };

export function formatBytes(n: number): string {
  if (n < 1000 * KB) return `${Math.round(n / KB)} KB`;
  return `${(n / 1024 / KB).toFixed(1)} MB`;
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
