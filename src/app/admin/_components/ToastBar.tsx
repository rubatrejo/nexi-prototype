import { T } from "../_lib/tokens";

export default function ToastBar({ msg, tone = "success" }: { msg: string; tone?: "success" | "error" | "info" | "warning" }) {
  const AMBER = "#D4960A";
  const accentColor =
    tone === "error" ? T.error
    : tone === "warning" ? AMBER
    : tone === "info" ? T.accent
    : T.success;
  const title =
    tone === "error" ? "Something went wrong"
    : tone === "warning" ? "Heads up — sensitive data"
    : tone === "info" ? "Done"
    : "Changes saved";
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
      pointerEvents: "none",
      background: "rgba(15, 15, 20, 0.28)",
      backdropFilter: "blur(3px)",
      WebkitBackdropFilter: "blur(3px)",
      animation: "toastBackdropIn 180ms ease",
    }}>
      <div style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 20,
        padding: "32px 44px 30px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
        minWidth: 320, maxWidth: 420,
        boxShadow: "0 24px 80px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.08)",
        animation: "toastCardIn 220ms cubic-bezier(0.22, 1, 0.36, 1)",
        pointerEvents: "auto",
      }}>
        <div style={{
          width: 68, height: 68, borderRadius: "50%",
          background: `${accentColor}14`, border: `1.5px solid ${accentColor}38`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: accentColor,
        }}>
          {tone === "error" ? (
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          ) : tone === "warning" ? (
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          ) : (
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          )}
        </div>
        <div style={{
          fontFamily: T.fontDisplay, fontSize: 20, fontWeight: 800,
          color: T.text, letterSpacing: "-0.01em", textAlign: "center",
        }}>
          {title}
        </div>
        <div style={{
          fontSize: 13, color: T.textDim, textAlign: "center",
          lineHeight: 1.5, maxWidth: 320,
        }}>
          {msg}
        </div>
      </div>
    </div>
  );
}
