"use client";

import { useKiosk } from "@/lib/kiosk-context";
import dynamic from "next/dynamic";
import PlaceholderScreen from "./screens/Placeholder";
import ErrorBoundary from "./ui/ErrorBoundary";

// Lazy-load all screens
const screens: Record<string, React.ComponentType> = {
  // Idle & Onboarding
  "IDL-01": dynamic(() => import("./screens/IDL01")),
  "ONB-02": dynamic(() => import("./screens/ONB02")),
  // Check-in
  "CKI-01": dynamic(() => import("./screens/CKI01")),
  "CKI-01q": dynamic(() => import("./screens/CKI01q")),
  "CKI-02a": dynamic(() => import("./screens/CKI02a")),
  "CKI-02b": dynamic(() => import("./screens/CKI02b")),
  "CKI-03": dynamic(() => import("./screens/CKI03")),
  "CKI-03b": dynamic(() => import("./screens/CKI03b")),
  "CKI-04": dynamic(() => import("./screens/CKI04")),
  "CKI-05": dynamic(() => import("./screens/CKI05")),
  "CKI-05e": dynamic(() => import("./screens/CKI05e")),
  "CKI-06": dynamic(() => import("./screens/CKI06")),
  "CKI-07": dynamic(() => import("./screens/CKI07")),
  "CKI-08": dynamic(() => import("./screens/CKI08")),
  "CKI-09": dynamic(() => import("./screens/CKI09")),
  "CKI-10": dynamic(() => import("./screens/CKI10")),
  "CKI-11": dynamic(() => import("./screens/CKI11")),
  "CKI-12": dynamic(() => import("./screens/CKI12")),
  "CKI-13": dynamic(() => import("./screens/CKI13")),
  "CKI-16": dynamic(() => import("./screens/CKI16")),
  // Dashboard
  "DSH-01": dynamic(() => import("./screens/DSH01")),
  // Check-out
  "CKO-00": dynamic(() => import("./screens/CKO00")),
  "CKO-01": dynamic(() => import("./screens/CKO01")),
  "CKO-02": dynamic(() => import("./screens/CKO02")),
  "CKO-03": dynamic(() => import("./screens/CKO03")),
  "CKO-04": dynamic(() => import("./screens/CKO04")),
  "CKO-05": dynamic(() => import("./screens/CKO05")),
  "CKO-06": dynamic(() => import("./screens/CKO06")),
  // Booking
  "BKG-01": dynamic(() => import("./screens/BKG01")),
  "BKG-02": dynamic(() => import("./screens/BKG02")),
  "BKG-03": dynamic(() => import("./screens/BKG03")),
  "BKG-04": dynamic(() => import("./screens/BKG04")),
  "BKG-05": dynamic(() => import("./screens/BKG05")),
  "BKG-06": dynamic(() => import("./screens/BKG06")),
  "BKG-07": dynamic(() => import("./screens/BKG07")),
  "BKG-08": dynamic(() => import("./screens/BKG08")),
  // Room Service
  "RSV-01": dynamic(() => import("./screens/RSV01")),
  "RSV-02": dynamic(() => import("./screens/RSV02")),
  "RSV-03": dynamic(() => import("./screens/RSV03")),
  "RSV-04": dynamic(() => import("./screens/RSV04")),
  "RSV-05": dynamic(() => import("./screens/RSV05")),
  "RSV-05p": dynamic(() => import("./screens/RSV05p")),
  "RSV-06": dynamic(() => import("./screens/RSV06")),
  "RSV-07": dynamic(() => import("./screens/RSV07")),
  "RSV-08": dynamic(() => import("./screens/RSV08")),
  // Payment
  "PAY-01": dynamic(() => import("./screens/PAY01")),
  "PAY-02": dynamic(() => import("./screens/PAY02")),
  "PAY-03": dynamic(() => import("./screens/PAY03")),
  "PAY-03e": dynamic(() => import("./screens/PAY03e")),
  // Events
  "EVT-01": dynamic(() => import("./screens/EVT01")),
  "EVT-02": dynamic(() => import("./screens/EVT02")),
  "EVT-02p": dynamic(() => import("./screens/EVT02p")),
  "EVT-03": dynamic(() => import("./screens/EVT03")),
  "EVT-03s": dynamic(() => import("./screens/EVT03s")),
  // Listings/Explore
  "LST-01": dynamic(() => import("./screens/LST01")),
  "LST-02": dynamic(() => import("./screens/LST02")),
  "LST-03": dynamic(() => import("./screens/LST03")),
  // Wayfinding
  "WAY-01": dynamic(() => import("./screens/WAY01")),
  "WAY-02": dynamic(() => import("./screens/WAY02")),
  // Utilities
  "WIF-01": dynamic(() => import("./screens/WIF01")),
  "FAQ-01": dynamic(() => import("./screens/FAQ01")),
  "ADS-01": dynamic(() => import("./screens/ADS01")),
  // Upgrades
  "UPS-01": dynamic(() => import("./screens/UPS01")),
  "UPS-02": dynamic(() => import("./screens/UPS02")),
  "UPS-03": dynamic(() => import("./screens/UPS03")),
  // Duplicate Key
  "DKY-01": dynamic(() => import("./screens/DKY01")),
  "DKY-02": dynamic(() => import("./screens/DKY02")),
  "DKY-03": dynamic(() => import("./screens/DKY03")),
  // Early Check-in
  "ECI-01": dynamic(() => import("./screens/ECI01")),
  "ECI-02": dynamic(() => import("./screens/ECI02")),
  "ECI-03": dynamic(() => import("./screens/ECI03")),
  // Late Check-out
  "LCO-01": dynamic(() => import("./screens/LCO01")),
  "LCO-02": dynamic(() => import("./screens/LCO02")),
  // Receipt
  "RCT-01": dynamic(() => import("./screens/RCT01")),
  // Staff
  "STF-01": dynamic(() => import("./screens/STF01")),
  "STF-02": dynamic(() => import("./screens/STF02")),
  "STF-03": dynamic(() => import("./screens/STF03")),
  // AI Avatar
  "AVT-01": dynamic(() => import("./screens/AVT01")),
  "AVT-02": dynamic(() => import("./screens/AVT02")),
  // Inactivity
  "INA-01": dynamic(() => import("./screens/INA01")),
};

export default function ScreenRouter() {
  const { currentScreen } = useKiosk();
  const Screen = screens[currentScreen] || PlaceholderScreen;
  return (
    <ErrorBoundary key={currentScreen}>
      <Screen />
    </ErrorBoundary>
  );
}
