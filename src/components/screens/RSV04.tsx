"use client";

import { useEffect } from "react";
import { useKiosk } from "@/lib/kiosk-context";

export default function RSV04Redirect() {
  const { navigate } = useKiosk();
  useEffect(() => { navigate("RSV-05"); }, [navigate]);
  return null;
}
