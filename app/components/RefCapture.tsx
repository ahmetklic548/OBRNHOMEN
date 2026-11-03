"use client";

import { useEffect } from "react";
import { normalizeKod } from "@/lib/partners";
import { saveRef } from "@/lib/refCode";

/** obrnhomen.com/?ref=KAFILEKODU → kodu sakla (ödeme ekranında otomatik uygulanır) */
export default function RefCapture() {
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const kod = normalizeKod(p.get("ref") ?? p.get("kod"));
    if (kod.length >= 3) saveRef(kod);
  }, []);
  return null;
}
