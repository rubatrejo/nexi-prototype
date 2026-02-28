"use client";

import { useState, useEffect, useCallback } from "react";
import { useKiosk } from "@/lib/kiosk-context";

const TIMEOUT_MS = 60000; // 1 min inactivity
const WARNING_MS = 15000; // 15 sec countdown

export default function InactivityModal() {
  const { currentScreen, navigate, setInactivityVisible } = useKiosk();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(15);

  // Don't run on idle/onboarding/staff screens
  const skipScreens = ["IDL-01", "ONB-01", "ONB-02", "STF-01", "STF-02", "STF-03"];
  const isActive = !skipScreens.includes(currentScreen);

  const resetTimer = useCallback(() => {
    setShowWarning(false);
    setCountdown(15);
    setInactivityVisible(false);
  }, [setInactivityVisible]);

  // Inactivity detection
  useEffect(() => {
    if (!isActive) return;

    let inactivityTimer: NodeJS.Timeout;

    const startTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => { setShowWarning(true); setInactivityVisible(true); }, TIMEOUT_MS);
    };

    const handleActivity = () => {
      if (!showWarning) startTimer();
    };

    startTimer();
    window.addEventListener("pointerdown", handleActivity);
    window.addEventListener("pointermove", handleActivity);

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("pointerdown", handleActivity);
      window.removeEventListener("pointermove", handleActivity);
    };
  }, [isActive, showWarning]);

  // Countdown when warning is visible
  useEffect(() => {
    if (!showWarning) return;
    setCountdown(15);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowWarning(false);
          navigate("IDL-01");
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showWarning, navigate]);

  if (!showWarning) return null;

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.5)",
      backdropFilter: "blur(4px)",
      WebkitBackdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        maxWidth: 380, width: "100%", textAlign: "center",
        padding: "28px 32px",
        background: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "var(--radius-lg)",
      }}>
        {/* Timer circle */}
        <div style={{ width: 64, height: 64, margin: "0 auto 16px", position: "relative" }}>
          <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4"/>
            <circle cx="32" cy="32" r="28" fill="none" stroke="var(--primary)" strokeWidth="4"
              strokeDasharray={`${(countdown / 15) * 175.9} 175.9`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 1s linear" }}
            />
          </svg>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 800, color: "#fff",
          }}>
            {countdown}
          </div>
        </div>

        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#fff", marginBottom: 4 }}>
          Are you still there?
        </h2>
        <p style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.55)", marginBottom: 20 }}>
          This session will end in {countdown} seconds
        </p>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn btn-ghost"
            onClick={() => { resetTimer(); navigate("IDL-01"); }}
            style={{ flex: 1, fontSize: "0.6875rem", color: "#fff", borderColor: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.06)" }}
          >
            End Session
          </button>
          <button
            className="btn btn-primary"
            onClick={resetTimer}
            style={{ flex: 1, fontSize: "0.6875rem" }}
          >
            I&apos;m Still Here
          </button>
        </div>
      </div>
    </div>
  );
}
