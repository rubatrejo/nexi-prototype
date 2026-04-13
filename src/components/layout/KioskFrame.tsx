"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useKiosk } from "@/lib/kiosk-context";
import { getTransitionType, getMotionProps } from "@/lib/transitions";
import ErrorModal from "@/components/ui/ErrorModal";
import AIConcierge from "@/components/ui/AIConcierge";
import InactivityModal from "@/components/ui/InactivityModal";
import AdOverlays from "@/components/ui/AdOverlays";
import { PoweredByTrueOmni } from "@/components/ui/Icons";
import BrandLogo from "@/components/ui/BrandLogo";

export default function KioskFrame({ children, onBackToSelection, onGoToROI, embed = false }: { children: React.ReactNode; onBackToSelection?: () => void; onGoToROI?: () => void; embed?: boolean }) {
  const { currentScreen, previousScreen, theme, navOpen, toggleTheme, guestMode, toggleGuestMode } = useKiosk();

  const motionProps = useMemo(
    () => getMotionProps(getTransitionType(previousScreen, currentScreen)),
    [previousScreen, currentScreen]
  );

  return (
    <div
      style={{
        minHeight: embed ? undefined : "100vh",
        height: embed ? "100vh" : undefined,
        width: embed ? "100vw" : undefined,
        display: "flex",
        flexDirection: "column",
        alignItems: embed ? "stretch" : "center",
        justifyContent: embed ? "flex-start" : "center",
        background: "#E8E8E3",
        paddingRight: !embed && navOpen ? 340 : 0,
        transition: "padding-right 0.3s ease",
        position: "relative",
        gap: embed ? 0 : 32,
        padding: embed ? 0 : "24px 0 100px",
        overflow: embed ? "hidden" : undefined,
      }}
    >
      {/* Logo + Toggles — hidden in embed mode */}
      {!embed && (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, flexShrink: 0 }}>
        <BrandLogo color="#1A1A1A" height={38} />
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          <button
            onClick={toggleTheme}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 16px", borderRadius: "9999px",
              border: "1px solid #D4D4CF",
              background: theme === "light" ? "#fff" : "#1A1A1A",
              cursor: "pointer", transition: "all 200ms",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme === "light" ? "#1A1A1A" : "#fff"} strokeWidth="2">
              {theme === "light" ? (
                <><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></>
              ) : (
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              )}
            </svg>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: theme === "light" ? "#1A1A1A" : "#fff", fontFamily: "var(--font-body), sans-serif" }}>
              {theme === "light" ? "Light" : "Dark"}
            </span>
          </button>

          <div style={{ display: "flex", borderRadius: "9999px", border: "1px solid #D4D4CF", overflow: "hidden" }}>
            <button
              onClick={() => { if (!guestMode) toggleGuestMode(); }}
              style={{
                padding: "6px 16px", background: guestMode ? "#1288FF" : "#fff",
                border: "none", cursor: "pointer",
                fontSize: "0.75rem", fontWeight: 600,
                color: guestMode ? "#fff" : "#6B7280",
                fontFamily: "var(--font-body), sans-serif", transition: "all 200ms",
              }}
            >Guest</button>
            <button
              onClick={() => { if (guestMode) toggleGuestMode(); }}
              style={{
                padding: "6px 16px", background: !guestMode ? "#1288FF" : "#fff",
                border: "none", borderLeft: "1px solid #D4D4CF", cursor: "pointer",
                fontSize: "0.75rem", fontWeight: 600,
                color: !guestMode ? "#fff" : "#6B7280",
                fontFamily: "var(--font-body), sans-serif", transition: "all 200ms",
              }}
            >Reservation</button>
          </div>
        </div>
      </div>
      )}

      {/* Kiosk frame */}
      <div
        data-theme={theme}
        style={{
          width: embed ? "100vw" : "52vw",
          maxWidth: embed ? "none" : "980px",
          height: embed ? "100vh" : undefined,
          aspectRatio: embed ? ("auto" as const) : "16/9",
          borderRadius: embed ? 0 : "12px",
          overflow: "hidden",
          position: "relative",
          boxShadow: embed ? "none" : "0 24px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)",
          background: "var(--bg)",
          flexShrink: 0,
        }}
      >
        {/* Inner content scale: screens render at 125% of frame size and are
            then downscaled with transform:scale(0.8) so content has ~25% more
            breathing room inside the frame without touching any screen file. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "125%",
            height: "125%",
            transformOrigin: "top left",
            transform: "scale(0.8)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={motionProps.initial}
              animate={{ ...motionProps.animate, transition: motionProps.transition }}
              exit={{ ...motionProps.exit, transition: motionProps.exitTransition || { duration: 0.15 } }}
              style={{ width: "100%", height: "100%", position: "relative" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>

          <ErrorModal />
          <AIConcierge />
          <InactivityModal />
          <AdOverlays />
        </div>
      </div>

      {/* Footer — fixed bottom, shifts with nav panel. Hidden in embed mode. */}
      {!embed && (
      <div style={{ position: "fixed", bottom: 0, left: 0, right: navOpen ? 340 : 0, zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, paddingBottom: 28, pointerEvents: "none", transition: "right 0.3s ease" }}>
        {onBackToSelection && (
          <div style={{ display: "flex", gap: 8, alignItems: "center", pointerEvents: "auto" }}>
            <button
              onClick={onBackToSelection}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 16px",
                background: "transparent",
                border: "1px solid #D4D4CF",
                borderRadius: "9999px",
                cursor: "pointer",
                color: "#6B7280",
                fontSize: "0.6875rem",
                fontWeight: 500,
                fontFamily: "var(--font-body), sans-serif",
                transition: "all 200ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1A1A1A"; e.currentTarget.style.color = "#1A1A1A"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#D4D4CF"; e.currentTarget.style.color = "#6B7280"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Our Solutions
            </button>
            {onGoToROI && (
              <button
                onClick={onGoToROI}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 16px",
                  background: "#1288FF",
                  border: "1px solid #1288FF",
                  borderRadius: "9999px",
                  cursor: "pointer",
                  color: "#fff",
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  fontFamily: "var(--font-body), sans-serif",
                  transition: "all 200ms",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#0A6FDB"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#1288FF"; }}
              >
                Calculate Your ROI
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div style={{ pointerEvents: "auto" }}>
          <PoweredByTrueOmni variant="dark" />
        </div>
      </div>
      )}
    </div>
  );
}
