// NEXI Screen Flow Navigation Map
// Defines which screen each button leads to

export type ScreenId =
  | "IDL-01" | "ONB-02" | "CKI-01q"
  | "DSH-01"
  | "CKI-01" | "CKI-02a" | "CKI-02b" | "CKI-03" | "CKI-03b" | "CKI-04"
  | "CKI-05" | "CKI-05e" | "CKI-06" | "CKI-07" | "CKI-08" | "CKI-09"
  | "CKI-10" | "CKI-11" | "CKI-12" | "CKI-13" | "CKI-16"
  | "CKO-00" | "CKO-01" | "CKO-02" | "CKO-03" | "CKO-04" | "CKO-05" | "CKO-06"
  | "BKG-01" | "BKG-02" | "BKG-03" | "BKG-04" | "BKG-05" | "BKG-06" | "BKG-07" | "BKG-08"
  | "RSV-01" | "RSV-02" | "RSV-03" | "RSV-04" | "RSV-05" | "RSV-05p" | "RSV-06" | "RSV-07" | "RSV-08"
  | "PAY-01" | "PAY-02" | "PAY-03" | "PAY-03e"
  | "EVT-01" | "EVT-02" | "EVT-02p" | "EVT-03" | "EVT-03s"
  | "LST-01" | "LST-02" | "LST-03"
  | "WAY-01" | "WAY-02"
  | "WIF-01" | "FAQ-01" | "ADS-01"
  | "UPS-01" | "UPS-02" | "UPS-03"
  | "DKY-01" | "DKY-02" | "DKY-03"
  | "LCO-02"
  | "ECI-01" | "ECI-02" | "ECI-03"
  | "LCO-01"
  | "RCT-01"
  | "STF-01" | "STF-02" | "STF-03"
  | "AVT-01" | "AVT-02"
  | "INA-01"
  | "ERR" // generic error, will use modal
  ;

// Check-in flow (main happy path)
export const CHECKIN_FLOW: ScreenId[] = [
  "IDL-01", "ONB-02", "CKI-01", "CKI-02a", "CKI-02b",
  "CKI-03", "CKI-03b", "CKI-04", "CKI-05", "CKI-06", "CKI-07",
  "CKI-08", "CKI-09", "CKI-10", "CKI-11", "CKI-12", "CKI-13", "CKI-16"
];

// Check-out flow
export const CHECKOUT_FLOW: ScreenId[] = [
  "CKO-01", "CKO-02", "CKO-03", "CKO-04", "CKO-05", "CKO-06"
];

// Dashboard modules (tiles on DSH-01)
export const DASHBOARD_MODULES: { id: ScreenId; label: string; icon: string }[] = [
  { id: "RSV-01", label: "Room Service", icon: "🍽" },
  { id: "EVT-01", label: "Events", icon: "📅" },
  { id: "LST-01", label: "Explore", icon: "🗺" },
  { id: "WAY-01", label: "Wayfinding", icon: "📍" },
  { id: "WIF-01", label: "Wi-Fi", icon: "📶" },
  { id: "FAQ-01", label: "FAQ", icon: "❓" },
  { id: "UPS-01", label: "Upgrades", icon: "⬆" },
  { id: "DKY-01", label: "Duplicate Key", icon: "🔑" },
  { id: "LCO-01", label: "Late Check-out", icon: "🕐" },
  { id: "CKO-01", label: "Check Out", icon: "🚪" },
];

// Screen metadata
export const SCREEN_META: Record<string, { title: string; module: string }> = {
  "IDL-01": { title: "Welcome", module: "Idle" },
  "ONB-02": { title: "What would you like to do?", module: "Onboarding" },
  "CKI-01": { title: "Reservation Lookup", module: "Check-in" },
  "CKI-01q": { title: "QR Scan", module: "Check-in" },
  "CKI-02a": { title: "Camera Permission", module: "Check-in" },
  "CKI-02b": { title: "Guest Details", module: "Check-in" },
  "CKI-03": { title: "Scan Passport", module: "Check-in" },
  "CKI-03b": { title: "ID Verified", module: "Check-in" },
  "CKI-04": { title: "Facial Recognition", module: "Check-in" },
  "CKI-05": { title: "Processing", module: "Check-in" },
  "CKI-05e": { title: "Verification Failed", module: "Check-in" },
  "CKI-06": { title: "Face Scan", module: "Check-in" },
  "CKI-07": { title: "Verification Complete", module: "Check-in" },
  "CKI-08": { title: "Terms & Signature", module: "Check-in" },
  "CKI-09": { title: "Room Upgrades", module: "Check-in" },
  "CKI-10": { title: "Payment", module: "Check-in" },
  "CKI-11": { title: "Floor Preference", module: "Check-in" },
  "CKI-12": { title: "Room Assigned", module: "Check-in" },
  "CKI-13": { title: "Key Cards Ready", module: "Check-in" },
  "CKI-16": { title: "Welcome Complete", module: "Check-in" },
  "DSH-01": { title: "Guest Dashboard", module: "Dashboard" },
  "CKO-00": { title: "Check-out Lookup", module: "Check-out" },
  "CKO-01": { title: "Check-out Start", module: "Check-out" },
  "CKO-02": { title: "Stay Summary", module: "Check-out" },
  "CKO-03": { title: "Minibar Dispute", module: "Check-out" },
  "CKO-04": { title: "Feedback", module: "Check-out" },
  "CKO-05": { title: "Check-out Payment", module: "Check-out" },
  "CKO-06": { title: "Check-out Complete", module: "Check-out" },
};
