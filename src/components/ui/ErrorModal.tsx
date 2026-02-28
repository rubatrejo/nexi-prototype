"use client";

import { useKiosk } from "@/lib/kiosk-context";
import { AlertTriangle } from "@/components/ui/Icons";
import { motion, AnimatePresence } from "framer-motion";

interface ErrorConfig {
  title: string;
  message: string;
  icon?: "warning" | "error" | "network" | "card";
  retryLabel?: string;
  retryTarget?: string;
  helpLabel?: string;
  tips?: string[];
  attempts?: string;
}

const ERROR_CONFIGS: Record<string, ErrorConfig> = {
  "ERR-01": {
    title: "ID Scan Failed",
    message: "We couldn't read your ID. Please try again.",
    icon: "error",
    retryLabel: "Retry Scan",
    retryTarget: "CKI-03",
    tips: ["Place ID face-down on the scanner", "Ensure the document is not expired", "Remove any protective covers"],
    attempts: "Attempt 1 of 3",
  },
  "ERR-02": {
    title: "Facial Match Failed",
    message: "We couldn't verify your identity. Please try again.",
    icon: "error",
    retryLabel: "Retry Scan",
    retryTarget: "CKI-04",
    tips: ["Remove sunglasses or hats", "Ensure good lighting", "Look directly at the camera"],
    attempts: "Attempt 1 of 3",
  },
  "ERR-03": {
    title: "Payment Declined",
    message: "Your payment could not be processed.",
    icon: "card",
    retryLabel: "Try Another Card",
    retryTarget: "PAY-01",
    tips: ["Check your card balance", "Try a different payment method", "Contact your bank if the issue persists"],
  },
  "ERR-04": {
    title: "Reservation Not Found",
    message: "We couldn't find a reservation with those details.",
    icon: "warning",
    retryLabel: "Search Again",
    retryTarget: "CKI-01",
    tips: ["Double-check your confirmation number", "Try searching by last name", "Contact the front desk for assistance"],
  },
  "ERR-05": {
    title: "Key Dispenser Error",
    message: "The key card dispenser is temporarily unavailable.",
    icon: "error",
    helpLabel: "Call Front Desk",
    tips: ["A staff member has been notified", "Please wait for assistance"],
  },
  "ERR-06": {
    title: "Network Error",
    message: "Connection lost. Retrying automatically...",
    icon: "network",
    retryLabel: "Retry Now",
    tips: ["The system will auto-retry in a few seconds", "If the issue persists, please contact staff"],
  },
  "ERR-07": {
    title: "No Availability",
    message: "No rooms are available for your selected dates.",
    icon: "warning",
    retryLabel: "Change Dates",
    retryTarget: "BKG-01",
    tips: ["Try different dates", "Check nearby partner hotels", "Contact the front desk for alternatives"],
  },
  "ERR-08": {
    title: "QR Code Invalid",
    message: "The QR code could not be read.",
    icon: "error",
    retryLabel: "Scan Again",
    retryTarget: "CKI-01",
    tips: ["Hold the QR code steady", "Ensure proper lighting", "Try entering details manually"],
  },
  "ERR-09": {
    title: "Payment Terminal Offline",
    message: "The payment terminal is temporarily unavailable.",
    icon: "card",
    retryLabel: "Try Alternative Payment",
    retryTarget: "PAY-01",
    tips: ["Try room charge instead", "Contact front desk for manual processing"],
  },
  "ERR-10": {
    title: "Camera Error",
    message: "The camera is not responding.",
    icon: "error",
    helpLabel: "Skip Verification",
    tips: ["A staff member can assist with manual verification", "The system will retry automatically"],
  },
  "ERR-11": {
    title: "Room Service Unavailable",
    message: "Room service is currently not available.",
    icon: "warning",
    retryLabel: "View Alternatives",
    retryTarget: "LST-01",
    tips: ["Check restaurant hours", "Try the hotel restaurant instead", "Service resumes at 6:00 AM"],
  },
  "ERR-12": {
    title: "Something Went Wrong",
    message: "An unexpected error occurred.",
    icon: "error",
    retryLabel: "Try Again",
    helpLabel: "Request Help",
    tips: ["Please try your action again", "If the problem persists, contact staff"],
  },
};

function ErrorIcon({ type, size = 48 }: { type: string; size?: number }) {
  const color = "var(--error)";
  switch (type) {
    case "network":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
          <path d="M1.42 9a16 16 0 0121.16 0" opacity={0.3} />
          <path d="M5 12.55a11 11 0 0114.08 0" opacity={0.3} />
          <path d="M8.53 16.11a6 6 0 016.95 0" opacity={0.3} />
          <line x1="2" y1="2" x2="22" y2="22" strokeWidth="2.5" />
        </svg>
      );
    case "card":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
          <rect x="1" y="4" width="22" height="16" rx="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
          <line x1="2" y1="2" x2="22" y2="22" strokeWidth="2.5" />
        </svg>
      );
    default:
      return <AlertTriangle size={size} color={color} />;
  }
}

export default function ErrorModal() {
  const { activeModal, closeModal, navigate, goBack } = useKiosk();

  const isError = activeModal?.startsWith("ERR-");
  if (!isError || !activeModal) return null;

  const config = ERROR_CONFIGS[activeModal] || ERROR_CONFIGS["ERR-12"];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 100,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={closeModal}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "var(--bg-card)",
            borderRadius: "var(--radius-xl)",
            padding: 32,
            maxWidth: 440,
            width: "90%",
            boxShadow: "var(--shadow-lg)",
            textAlign: "center",
          }}
        >
          {/* Error Icon */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(239,68,68,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <ErrorIcon type={config.icon || "error"} size={36} />
          </div>

          {/* Title */}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 8,
            }}
          >
            {config.title}
          </h2>

          {/* Message */}
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: 8 }}>
            {config.message}
          </p>

          {/* Attempts badge */}
          {config.attempts && (
            <div
              style={{
                display: "inline-block",
                padding: "4px 12px",
                background: "rgba(239,68,68,0.1)",
                borderRadius: "var(--radius-full)",
                fontSize: "0.6875rem",
                fontWeight: 600,
                color: "var(--error)",
                marginBottom: 16,
              }}
            >
              {config.attempts}
            </div>
          )}

          {/* Tips */}
          {config.tips && (
            <div style={{ margin: "16px 0", textAlign: "left" }}>
              {config.tips.map((tip, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 12px",
                    background: "var(--bg-elevated)",
                    borderRadius: "var(--radius-sm)",
                    marginBottom: 6,
                    fontSize: "0.8125rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                  {tip}
                </div>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
            {config.helpLabel && (
              <button
                className="btn btn-ghost"
                onClick={() => {
                  closeModal();
                  goBack();
                }}
              >
                {config.helpLabel}
              </button>
            )}
            {config.retryLabel && (
              <button
                className="btn btn-primary"
                onClick={() => {
                  closeModal();
                  if (config.retryTarget) navigate(config.retryTarget as any);
                  else goBack();
                }}
              >
                {config.retryLabel}
              </button>
            )}
            {!config.retryLabel && !config.helpLabel && (
              <button className="btn btn-primary" onClick={closeModal}>
                Dismiss
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
