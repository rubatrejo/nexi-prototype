"use client";

import { useEffect } from "react";
import { useKiosk } from "@/lib/kiosk-context";

export default function BKG06Redirect() {
  const { navigate } = useKiosk();
  useEffect(() => { navigate("BKG-07"); }, [navigate]);
  return null;
}
