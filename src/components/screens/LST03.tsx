"use client";

import { useEffect } from "react";
import { useKiosk } from "@/lib/kiosk-context";

// LST-03 detail view is now handled inside LST-01 as an internal view.
export default function LST03() {
  const { navigate } = useKiosk();
  useEffect(() => {
    navigate("LST-01");
  }, [navigate]);
  return null;
}
