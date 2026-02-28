"use client";

import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";
import { SCREEN_META } from "@/lib/navigation";

export default function PlaceholderScreen() {
  const { currentScreen, goBack, goHome } = useKiosk();
  const meta = SCREEN_META[currentScreen];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            padding: "6px 14px",
            background: "var(--primary-light)",
            borderRadius: "var(--radius-full)",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--primary)",
            fontFamily: "var(--font-display)",
          }}
        >
          {currentScreen}
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "var(--text)",
          }}
        >
          {meta?.title || currentScreen}
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.8125rem" }}>
          {meta?.module || "Module"} &middot; Screen coming soon
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <button onClick={goBack} className="btn btn-ghost btn-sm">Back</button>
          <button onClick={goHome} className="btn btn-primary btn-sm">Dashboard</button>
        </div>
      </div>
    </div>
  );
}
