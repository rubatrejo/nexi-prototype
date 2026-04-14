import type * as React from "react";
import { T } from "./tokens";

// Shared inline-style constants used across multiple tabs and cards.
// Inline styles instead of CSS classes are the project convention for
// admin (see admin's CLAUDE.md note about kiosk control).

export const baseInput: React.CSSProperties = {
  width: "100%", padding: "7px 10px", background: T.surface, border: `1px solid ${T.border}`,
  borderRadius: 7, color: T.text, fontSize: 12, fontFamily: T.fontBody, outline: "none",
};

export const addCardBtn: React.CSSProperties = {
  width: "100%", marginTop: 12, padding: "14px 16px", borderRadius: 12,
  background: "transparent", border: `1.5px dashed ${T.borderHi}`,
  color: T.textDim, fontSize: 12, fontWeight: 600, fontFamily: T.fontBody,
  cursor: "pointer", transition: "all 150ms",
};
