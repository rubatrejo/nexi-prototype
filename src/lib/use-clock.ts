"use client";

import { useEffect, useState } from "react";

/**
 * Ticks every `intervalMs` and returns the current Date. Used by
 * kiosk header / idle screens that display a live clock.
 *
 * Default cadence is 1 second. The Date object is cheap to create
 * and React will skip re-renders when consumers only read
 * minute-level fields (hour/min update once per minute anyway).
 */
export function useClock(intervalMs: number = 1000): Date {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

/** "Saturday, February 22" in the given locale. */
export function formatLongDate(d: Date, locale: string = "en-US"): string {
  return d.toLocaleDateString(locale, { weekday: "long", month: "long", day: "numeric" });
}

/** "10:45" (24h) — no AM/PM suffix, used by the large idle clock. */
export function formatClockHHMM(d: Date): string {
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

/** "10:45 AM" — 12h with meridiem, used by the global header. */
export function formatClock12h(d: Date, locale: string = "en-US"): string {
  return d.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
}
