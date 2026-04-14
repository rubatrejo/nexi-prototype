"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * FloatingKeyboard — touch-friendly on-screen keyboard for kiosk inputs.
 *
 * Mount once globally inside KioskFrame. It auto-detects when the user
 * focuses any element opted in via `data-kiosk-keyboard` (set on the
 * <input> or <textarea>), positions itself near the bottom of the
 * viewport, and lets the user drag it anywhere by the header handle.
 *
 * Inputs that opt in should also set `inputMode="none"` so mobile/touch
 * devices don't open their native OS keyboard on top of this one.
 *
 * Why a custom keyboard at all? Hotel kiosks are landscape touchscreens
 * with no physical keyboard. The browser's default virtual keyboard
 * (when present) covers half the screen, has no awareness of the kiosk
 * layout, and can't be moved out of the way of the active field.
 */

const ROW1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const ROW2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const ROW3 = ["z", "x", "c", "v", "b", "n", "m"];

const NUM_ROW1 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const NUM_ROW2 = ["-", "/", ":", ";", "(", ")", "$", "&", "@", '"'];
const NUM_ROW3 = [".", ",", "?", "!", "'", "+", "*", "#"];

type FocusableInput = HTMLInputElement | HTMLTextAreaElement;

function isFocusableInput(el: Element | null): el is FocusableInput {
  if (!el) return false;
  return el.tagName === "INPUT" || el.tagName === "TEXTAREA";
}

/**
 * React owns controlled input values via state, so plain `el.value = "x"`
 * doesn't trigger onChange. Use the prototype's native value setter and
 * dispatch a synthetic input event so React's synthetic event layer picks
 * it up and runs the component's onChange handler.
 */
function writeValue(el: FocusableInput, next: string) {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
  if (!setter) {
    el.value = next;
  } else {
    setter.call(el, next);
  }
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

export default function FloatingKeyboard() {
  const [activeInput, setActiveInput] = useState<FocusableInput | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isShift, setIsShift] = useState(false);
  const [layer, setLayer] = useState<"alpha" | "num">("alpha");
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{ active: boolean; px: number; py: number; ox: number; oy: number }>({ active: false, px: 0, py: 0, ox: 0, oy: 0 });

  // Auto-open on focusin for inputs that opted in via data attribute.
  // Auto-close on focusout unless the new focus target is inside the
  // keyboard itself (which can't actually happen since we preventDefault
  // mousedown on every key, but we belt-and-brace it anyway).
  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as Element | null;
      if (!isFocusableInput(target)) return;
      if (!target.closest("[data-kiosk-keyboard]")) return;
      setActiveInput(target);
      setIsShift(false);
      setLayer("alpha");
    };
    const onFocusOut = (e: FocusEvent) => {
      const next = e.relatedTarget as Element | null;
      if (next && containerRef.current?.contains(next)) return;
      // Defer slightly so a focus shift between two opted-in inputs
      // doesn't blink the keyboard closed and reopen.
      setTimeout(() => {
        const a = document.activeElement;
        if (!a || !isFocusableInput(a) || !a.closest("[data-kiosk-keyboard]")) {
          setActiveInput(null);
        }
      }, 30);
    };
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  // First-open: drop the keyboard near the bottom-center of the viewport.
  // Subsequent opens reuse the last drag position so the user's choice
  // survives across fields in the same session.
  useEffect(() => {
    if (!activeInput || position) return;
    const w = 720;
    const h = 290;
    setPosition({
      x: Math.max(20, Math.round((window.innerWidth - w) / 2)),
      y: Math.max(20, window.innerHeight - h - 80),
    });
  }, [activeInput, position]);

  // Insert / delete / space / enter at the current selection. setSelectionRange
  // restores the cursor so subsequent taps land in the right place.
  const tap = useCallback((value: string, kind: "char" | "backspace" | "space" | "enter" = "char") => {
    const el = activeInput;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    let next: string;
    let cursor: number;
    if (kind === "backspace") {
      if (start === end) {
        if (start === 0) return;
        next = el.value.slice(0, start - 1) + el.value.slice(end);
        cursor = start - 1;
      } else {
        next = el.value.slice(0, start) + el.value.slice(end);
        cursor = start;
      }
    } else if (kind === "space") {
      next = el.value.slice(0, start) + " " + el.value.slice(end);
      cursor = start + 1;
    } else if (kind === "enter") {
      if (!(el instanceof HTMLTextAreaElement)) return;
      next = el.value.slice(0, start) + "\n" + el.value.slice(end);
      cursor = start + 1;
    } else {
      next = el.value.slice(0, start) + value + el.value.slice(end);
      cursor = start + value.length;
    }
    writeValue(el, next);
    // Re-focus + restore cursor — focus may have stayed put thanks to
    // preventDefault on mousedown, but we restore selection explicitly
    // because writeValue's dispatched event may have moved it.
    el.focus();
    try { el.setSelectionRange(cursor, cursor); } catch {}
    if (isShift && kind === "char") setIsShift(false);
  }, [activeInput, isShift]);

  // Drag — pointer events handle touch + mouse uniformly. Position is
  // clamped to the viewport so the keyboard can't be lost off-screen.
  const onDragPointerDown = useCallback((e: React.PointerEvent) => {
    if (!position) return;
    e.preventDefault();
    dragStateRef.current = { active: true, px: e.clientX, py: e.clientY, ox: position.x, oy: position.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [position]);

  const onDragPointerMove = useCallback((e: React.PointerEvent) => {
    const s = dragStateRef.current;
    if (!s.active) return;
    const w = containerRef.current?.offsetWidth ?? 720;
    const h = containerRef.current?.offsetHeight ?? 290;
    const nextX = Math.max(8, Math.min(window.innerWidth - w - 8, s.ox + (e.clientX - s.px)));
    const nextY = Math.max(8, Math.min(window.innerHeight - h - 8, s.oy + (e.clientY - s.py)));
    setPosition({ x: nextX, y: nextY });
  }, []);

  const onDragPointerUp = useCallback((e: React.PointerEvent) => {
    dragStateRef.current.active = false;
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
  }, []);

  const close = useCallback(() => {
    activeInput?.blur();
    setActiveInput(null);
    setIsShift(false);
    setLayer("alpha");
  }, [activeInput]);

  if (!activeInput || !position) return null;

  // mousedown.preventDefault prevents the active input from losing focus
  // when the user presses a key — without it, the input blurs the moment
  // the keyboard button is touched, which closes the keyboard mid-tap.
  const stopFocusLoss = (handler: () => void) => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    handler();
  };

  const charKey = (label: string, value?: string, flex = 1) => (
    <button
      key={label}
      onMouseDown={stopFocusLoss(() => tap(value ?? label, "char"))}
      onTouchStart={stopFocusLoss(() => tap(value ?? label, "char"))}
      style={{
        ...keyBaseStyle,
        flex,
      }}
    >
      {label}
    </button>
  );

  const utilKey = (label: string, onPress: () => void, flex = 1.4, accent = false) => (
    <button
      onMouseDown={stopFocusLoss(onPress)}
      onTouchStart={stopFocusLoss(onPress)}
      style={{
        ...keyBaseStyle,
        flex,
        background: accent ? "var(--primary, #1288FF)" : "rgba(255,255,255,0.18)",
        color: accent ? "#fff" : "rgba(255,255,255,0.95)",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.4,
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        width: 720,
        background: "rgba(20, 20, 28, 0.94)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.16)",
        borderRadius: 14,
        boxShadow: "0 32px 100px rgba(0,0,0,0.45), 0 4px 20px rgba(0,0,0,0.25)",
        zIndex: 9999,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 7,
        userSelect: "none",
        touchAction: "none",
      }}
    >
      {/* Drag handle row */}
      <div
        onPointerDown={onDragPointerDown}
        onPointerMove={onDragPointerMove}
        onPointerUp={onDragPointerUp}
        onPointerCancel={onDragPointerUp}
        style={{
          position: "relative",
          height: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: dragStateRef.current.active ? "grabbing" : "grab",
        }}
      >
        <div style={{ width: 44, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.28)" }} />
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={stopFocusLoss(close)}
          onTouchStart={stopFocusLoss(close)}
          style={{
            position: "absolute",
            right: 4,
            top: 0,
            width: 24,
            height: 24,
            border: "none",
            background: "rgba(255,255,255,0.12)",
            borderRadius: 6,
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
          }}
          aria-label="Close keyboard"
        >
          ✕
        </button>
      </div>

      {layer === "alpha" ? (
        <>
          <div style={{ display: "flex", gap: 5 }}>
            {ROW1.map((k) => charKey(isShift ? k.toUpperCase() : k))}
          </div>
          <div style={{ display: "flex", gap: 5, padding: "0 28px" }}>
            {ROW2.map((k) => charKey(isShift ? k.toUpperCase() : k))}
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {utilKey(isShift ? "⇧" : "⇧", () => setIsShift((s) => !s), 1.6)}
            {ROW3.map((k) => charKey(isShift ? k.toUpperCase() : k))}
            {utilKey("⌫", () => tap("", "backspace"), 1.6)}
          </div>
        </>
      ) : (
        <>
          <div style={{ display: "flex", gap: 5 }}>
            {NUM_ROW1.map((k) => charKey(k))}
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {NUM_ROW2.map((k) => charKey(k))}
          </div>
          <div style={{ display: "flex", gap: 5, padding: "0 28px" }}>
            {NUM_ROW3.map((k) => charKey(k))}
            {utilKey("⌫", () => tap("", "backspace"), 1.4)}
          </div>
        </>
      )}

      {/* Bottom row — layer switch, space, done */}
      <div style={{ display: "flex", gap: 5 }}>
        {utilKey(layer === "alpha" ? "123" : "ABC", () => setLayer((l) => (l === "alpha" ? "num" : "alpha")), 1.6)}
        <button
          onMouseDown={stopFocusLoss(() => tap("", "space"))}
          onTouchStart={stopFocusLoss(() => tap("", "space"))}
          style={{
            ...keyBaseStyle,
            flex: 6,
            fontSize: 11,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          space
        </button>
        {utilKey("done", close, 1.6, true)}
      </div>
    </div>
  );
}

const keyBaseStyle: React.CSSProperties = {
  height: 44,
  background: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(255,255,255,0.6)",
  borderRadius: 8,
  fontSize: 16,
  fontWeight: 600,
  fontFamily: "'Inter', sans-serif",
  color: "#1A1A1A",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  transition: "transform 60ms ease, background 100ms ease",
};
