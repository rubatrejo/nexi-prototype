"use client";

import React from "react";

/**
 * Frosted glass card component with blur backdrop effect.
 * Used on cinematic/overlay screens (like payment success, premium offers).
 * Creates a semi-transparent card with modern glass morphism styling.
 * 
 * @example
 * ```tsx
 * <GlassCard>
 *   <h2>Payment Successful</h2>
 *   <p>$1,493.54</p>
 * </GlassCard>
 * ```
 * 
 * @example
 * ```tsx
 * <GlassCard maxWidth={400} centered>
 *   <img src="/icon.png" alt="" />
 *   <h3>Premium Upgrade</h3>
 * </GlassCard>
 * ```
 * 
 * @example
 * ```tsx
 * <GlassCard centered={false} style={{ minHeight: 200 }}>
 *   <div style={{ padding: "20px" }}>Custom layout</div>
 * </GlassCard>
 * ```
 */
interface GlassCardProps {
  children: React.ReactNode;
  /** Maximum width of the card in pixels. Default: 380 */
  maxWidth?: number;
  /** Additional styles for the card container */
  style?: React.CSSProperties;
  /** Whether to center content. Default: true */
  centered?: boolean;
}

/**
 * GlassCard component
 */
export function GlassCard({
  children,
  maxWidth = 380,
  style,
  centered = true,
}: GlassCardProps) {
  return (
    <div
      style={{
        maxWidth,
        width: "100%",
        textAlign: centered ? "center" : "left",
        padding: "28px 32px",
        background: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "var(--radius-lg)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default GlassCard;
