"use client";

import React from "react";

/**
 * Progress bar component showing step progress through a multi-step flow.
 * Commonly used in check-in and check-out screens to indicate current step.
 * 
 * @example
 * ```tsx
 * <ProgressBar step={3} total={8} />
 * ```
 * 
 * @example
 * ```tsx
 * <ProgressBar step={2} total={6} color="var(--success)" />
 * ```
 */
interface ProgressBarProps {
  /** Current step number (1-indexed) */
  step: number;
  /** Total number of steps */
  total: number;
  /** CSS color for the progress fill. Default: "var(--primary)" */
  color?: string;
}

/**
 * ProgressBar component
 */
export function ProgressBar({
  step,
  total,
  color = "var(--primary)",
}: ProgressBarProps) {
  const percentage = (step / total) * 100;

  return (
    <div
      style={{
        height: 4,
        background: "var(--border)",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${percentage}%`,
          background: color,
          borderRadius: 2,
          transition: "width 500ms ease",
        }}
      />
    </div>
  );
}

export default ProgressBar;
