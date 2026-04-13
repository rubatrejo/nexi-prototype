"use client";

import React from "react";
import GlobalHeader from "@/components/layout/GlobalHeader";

/**
 * Standard screen wrapper component for consistent layout across the kiosk.
 * Provides two variants: default (white background with header) and cinematic (full-bleed background).
 * 
 * @example
 * ```tsx
 * <ScreenShell>
 *   <PageTitle title="Check-in" subtitle="Please provide your details" />
 *   <div>Your content here</div>
 * </ScreenShell>
 * ```
 * 
 * @example
 * ```tsx
 * <ScreenShell variant="cinematic" backgroundImage="url('/images/hero.jpg')">
 *   <GlassCard>
 *     <h2>Premium Experience</h2>
 *   </GlassCard>
 * </ScreenShell>
 * ```
 */
interface ScreenShellProps {
  children: React.ReactNode;
  /** Visual variant. "default" shows white bg with GlobalHeader. "cinematic" shows full-bleed background with overlay. Default: "default" */
  variant?: "default" | "cinematic";
  /** Background image URL for cinematic variant. Includes ken burns animation. */
  backgroundImage?: string;
  /** Whether to show the GlobalHeader. Default: true */
  showHeader?: boolean;
  /** Additional styles for the outer container */
  style?: React.CSSProperties;
}

/**
 * ScreenShell component
 */
export function ScreenShell({
  children,
  variant = "default",
  backgroundImage,
  showHeader = true,
  style,
}: ScreenShellProps) {
  const isCinematic = variant === "cinematic";

  if (isCinematic) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          ...style,
        }}
      >
        {/* Background image with ken burns animation */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: backgroundImage ? `${backgroundImage} center/cover` : "var(--bg)",
            animation: "kenBurns 20s ease-in-out infinite alternate",
          }}
        />
        {/* Dark gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.7))",
          }}
        />
        {/* Grain texture overlay */}
        <div
          className="grain"
          style={{
            position: "absolute",
            inset: 0,
          }}
        />
        {/* Header */}
        {showHeader && (
          <div style={{ position: "relative", zIndex: 10 }}>
            <GlobalHeader variant="cinematic" />
          </div>
        )}
        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            paddingTop: showHeader ? 0 : 0,
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
        ...style,
      }}
    >
      {showHeader && <GlobalHeader />}
      {children}
    </div>
  );
}

export default ScreenShell;
