"use client";

import { useEffect } from "react";
import { useKiosk } from "@/lib/kiosk-context";

// LST-02 is now handled inside LST-01 as an internal view.
// This redirect ensures any direct navigation to LST-02 goes to LST-01.
export default function LST02() {
  const { navigate } = useKiosk();
  useEffect(() => {
    navigate("LST-01");
  }, [navigate]);
  return null;
}
