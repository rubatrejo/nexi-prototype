"use client";

interface OnboardingFooterProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
  hint?: string;
  dark?: boolean;
}

export default function OnboardingFooter({ currentStep, totalSteps, onStepClick, hint, dark = true }: OnboardingFooterProps) {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
      paddingBottom: 36,
    }}>
      {hint && (
        <div style={{
          fontSize: "0.8125rem", fontWeight: 500,
          color: dark ? "rgba(255,255,255,0.5)" : "#6B7280",
          textShadow: dark ? "0 1px 8px rgba(0,0,0,0.5)" : "none",
        }}>
          {hint}
        </div>
      )}
      <div style={{ display: "flex", gap: 10 }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            onClick={() => onStepClick(i)}
            style={{
              width: i === currentStep ? 28 : 8, height: 8, borderRadius: 4,
              background: i === currentStep ? "#1288FF" : (dark ? "rgba(255,255,255,0.3)" : "#9CA3AF"),
              transition: "all 400ms ease",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}
