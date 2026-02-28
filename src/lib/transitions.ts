import type { ScreenId } from "./navigation";

/**
 * NEXI Hybrid Transition System
 * - Between modules: Cinematic Focus Shift (blur + scale)
 * - Within a module: Directional Slide (translateX + scale)
 */

// Map screen IDs to their module
const SCREEN_MODULE: Record<string, string> = {};

// Auto-map by prefix
const MODULE_PREFIXES: Record<string, string> = {
  "IDL": "idle",
  "ONB": "onboarding",
  "CKI": "checkin",
  "DSH": "dashboard",
  "CKO": "checkout",
  "BKG": "booking",
  "RSV": "roomservice",
  "PAY": "payment",
  "EVT": "events",
  "LST": "explore",
  "WAY": "wayfinding",
  "WIF": "wifi",
  "FAQ": "faq",
  "ADS": "ads",
  "UPS": "upsells",
  "DKY": "duplicatekey",
  "LCO": "latecheckout",
  "ECI": "earlycheckin",
  "RCT": "receipt",
  "STF": "staff",
  "AVT": "avatar",
  "INA": "inactivity",
};

function getModule(screenId: string): string {
  const prefix = screenId.split("-")[0];
  return MODULE_PREFIXES[prefix] || "unknown";
}

// Ordered screens within each flow for direction detection
const FLOW_ORDER: Record<string, string[]> = {
  checkin: [
    "CKI-01", "CKI-01q", "CKI-02a", "CKI-02b", "CKI-03", "CKI-03b",
    "CKI-04", "CKI-05", "CKI-05e", "CKI-06", "CKI-07", "CKI-08",
    "CKI-09", "CKI-10", "CKI-11", "CKI-12", "CKI-13", "CKI-16",
  ],
  checkout: ["CKO-00", "CKO-01", "CKO-02", "CKO-03", "CKO-04", "CKO-05", "CKO-06"],
  booking: ["BKG-01", "BKG-02", "BKG-03", "BKG-04", "BKG-05", "BKG-06", "BKG-07", "BKG-08"],
  roomservice: ["RSV-01", "RSV-02", "RSV-03", "RSV-04", "RSV-05", "RSV-05p", "RSV-06", "RSV-07", "RSV-08"],
  payment: ["PAY-01", "PAY-02", "PAY-03", "PAY-03e"],
  events: ["EVT-01", "EVT-02", "EVT-02p", "EVT-03", "EVT-03s"],
  explore: ["LST-01", "LST-02", "LST-03"],
  upsells: ["UPS-01", "UPS-02", "UPS-03"],
  duplicatekey: ["DKY-01", "DKY-02", "DKY-03"],
  earlycheckin: ["ECI-01", "ECI-02", "ECI-03"],
  latecheckout: ["LCO-01", "LCO-02"],
  staff: ["STF-01", "STF-02", "STF-03"],
  avatar: ["AVT-01", "AVT-02"],
};

export type TransitionType = "module" | "step-forward" | "step-back";

export function getTransitionType(from: string, to: string): TransitionType {
  const fromModule = getModule(from);
  const toModule = getModule(to);

  // Different modules → cinematic
  if (fromModule !== toModule) return "module";

  // Same module → check direction
  const flow = FLOW_ORDER[fromModule];
  if (flow) {
    const fromIdx = flow.indexOf(from);
    const toIdx = flow.indexOf(to);
    if (fromIdx >= 0 && toIdx >= 0) {
      return toIdx > fromIdx ? "step-forward" : "step-back";
    }
  }

  // Fallback: treat as forward step
  return "step-forward";
}

// Framer Motion variants
const EASE_CINEMATIC = [0.22, 1, 0.36, 1] as const;

// Clean crossfade for module changes
export const moduleTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.25, ease: EASE_CINEMATIC },
  exitTransition: { duration: 0.2, ease: EASE_CINEMATIC },
};

// Subtle directional slide within a flow
export const stepForwardTransition = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.25, ease: EASE_CINEMATIC },
  exitTransition: { duration: 0.2, ease: EASE_CINEMATIC },
};

export const stepBackTransition = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 40 },
  transition: { duration: 0.25, ease: EASE_CINEMATIC },
  exitTransition: { duration: 0.2, ease: EASE_CINEMATIC },
};

export function getMotionProps(type: TransitionType) {
  switch (type) {
    case "module": return moduleTransition;
    case "step-forward": return stepForwardTransition;
    case "step-back": return stepBackTransition;
  }
}
