"use client";

import React from "react";
import { useKiosk } from "@/lib/kiosk-context";
import type { ScreenId } from "@/lib/navigation";

/**
 * Action button row with consistent styling for back/next navigation.
 * Handles navigation state via kiosk context or custom handlers.
 * Commonly positioned at the bottom of screens.
 * 
 * @example
 * ```tsx
 * <ActionButtons nextScreen="CKI-02a" />
 * ```
 * 
 * @example
 * ```tsx
 * <ActionButtons
 *   nextLabel="Confirm"
 *   onNext={() => handleConfirm()}
 *   showBack={false}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * <ActionButtons nextScreen="PAY-01" align="center">
 *   <button className="btn btn-secondary">Save Draft</button>
 * </ActionButtons>
 * ```
 */
interface ActionButtonsProps {
  /** Screen ID to navigate to on primary action. Ignored if onNext is provided. */
  nextScreen?: ScreenId;
  /** Custom handler for primary action. Overrides nextScreen navigation. */
  onNext?: () => void;
  /** Label for the primary (next/continue) button. Default: "Continue" */
  nextLabel?: string;
  /** Whether to show back button. Default: true */
  showBack?: boolean;
  /** Custom handler for back action. Default: uses goBack() from kiosk context. */
  onBack?: () => void;
  /** Label for the back button. Default: "Back" */
  backLabel?: string;
  /** Additional buttons to render between back and next. */
  children?: React.ReactNode;
  /** Flex alignment of the button row. Default: "center" */
  align?: "left" | "center" | "right";
}

/**
 * ActionButtons component
 */
export function ActionButtons({
  nextScreen,
  onNext,
  nextLabel = "Continue",
  showBack = true,
  onBack,
  backLabel = "Back",
  children,
  align = "center",
}: ActionButtonsProps) {
  const { navigate, goBack } = useKiosk();

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (nextScreen) {
      navigate(nextScreen);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      goBack();
    }
  };

  let justifyContent: React.CSSProperties["justifyContent"] = "center";
  if (align === "left") justifyContent = "flex-start";
  if (align === "right") justifyContent = "flex-end";

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        justifyContent,
        marginTop: 8,
      }}
    >
      {showBack && (
        <button
          onClick={handleBack}
          className="btn btn-ghost"
        >
          {backLabel}
        </button>
      )}
      {children}
      <button
        onClick={handleNext}
        className="btn btn-primary"
      >
        {nextLabel}
      </button>
    </div>
  );
}

export default ActionButtons;
