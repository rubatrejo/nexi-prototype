"use client";

import { ReactNode } from "react";
import GlobalHeader from "./GlobalHeader";

/**
 * ScreenLayout — Standard kiosk screen layout with fixed header + scrollable body + fixed footer.
 * Ensures action buttons are always visible regardless of content length.
 */
export default function ScreenLayout({
  children,
  footer,
  noPadding = false,
  progressStep,
  progressTotal = 8,
}: {
  children: ReactNode;
  footer?: ReactNode;
  noPadding?: boolean;
  progressStep?: number;
  progressTotal?: number;
}) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      {progressStep != null && (
        <div style={{ height: 4, background: "var(--border)", position: "relative" }}>
          <div style={{ height: "100%", width: `${(progressStep / progressTotal) * 100}%`, background: "var(--primary)", borderRadius: 2, transition: "width 500ms ease" }} />
        </div>
      )}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: noPadding ? 0 : "0 48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {children}
      </div>
      {footer && (
        <div
          style={{
            flexShrink: 0,
            padding: "16px 48px 24px",
            display: "flex",
            justifyContent: "center",
            gap: 12,
            borderTop: "1px solid var(--border)",
            background: "var(--bg)",
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
