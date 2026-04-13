"use client";

import React from "react";

/**
 * Centered page title with optional subtitle.
 * Used consistently across all screens for visual hierarchy.
 * Automatically adjusts text color for dark/cinematic backgrounds.
 * 
 * @example
 * ```tsx
 * <PageTitle
 *   title="Check-in"
 *   subtitle="Please provide your reservation details"
 * />
 * ```
 * 
 * @example
 * ```tsx
 * <PageTitle
 *   title="Welcome"
 *   subtitle="Your room is ready"
 *   variant="light"
 * />
 * ```
 * 
 * @example
 * ```tsx
 * <PageTitle
 *   title="Payment Details"
 *   align="left"
 * />
 * ```
 */
interface PageTitleProps {
  /** Main title text */
  title: string;
  /** Optional subtitle text */
  subtitle?: string;
  /** Text alignment. Default: "center" */
  align?: "left" | "center";
  /** Color variant. "default" uses dark colors for light backgrounds. "light" uses white text for dark backgrounds. Default: "default" */
  variant?: "default" | "light";
}

/**
 * PageTitle component
 */
export function PageTitle({
  title,
  subtitle,
  align = "center",
  variant = "default",
}: PageTitleProps) {
  const isLight = variant === "light";
  const textAlign = align as React.CSSProperties["textAlign"];

  return (
    <div
      style={{
        textAlign,
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.75rem",
          fontWeight: 700,
          color: isLight ? "#fff" : "var(--text)",
          margin: 0,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            color: isLight ? "rgba(255,255,255,0.75)" : "var(--text-secondary)",
            fontSize: "0.9375rem",
            marginTop: 8,
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default PageTitle;
