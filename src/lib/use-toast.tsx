"use client";

import { useState, useCallback } from "react";

/**
 * Lightweight toast for kiosk prototype.
 * Returns [toast, showToast, ToastElement].
 * Render <ToastElement /> at the bottom of your component.
 */
export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);

  const show = useCallback((message: string) => {
    setMsg(message);
    setTimeout(() => setMsg(null), 2500);
  }, []);

  const Toast = msg ? (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(12px)",
        color: "#fff",
        padding: "10px 24px",
        borderRadius: 9999,
        fontSize: "0.75rem",
        fontWeight: 500,
        zIndex: 9999,
        animation: "fadeUp 300ms ease",
        pointerEvents: "none",
      }}
    >
      {msg}
    </div>
  ) : null;

  return { show, Toast } as const;
}
