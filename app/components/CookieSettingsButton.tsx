"use client";

import { useEffect, useState } from "react";
import { readConsent, saveConsent } from "@/app/components/CookieConsent";
import { CONSENT_EVENT, type ConsentValue } from "@/lib/legal";

/** Gizlilik sayfasında: mevcut tercihi göster, bandı yeniden açmak için sıfırla. */
export default function CookieSettingsButton() {
  const [v, setV] = useState<ConsentValue | null>(null);
  useEffect(() => {
    const sync = () => setV(readConsent());
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  const label = v === "hepsi" ? "Tüm çerezlere izin verdiniz" : v === "zorunlu" ? "Yalnızca zorunlu çerezler açık" : "Henüz tercih yapmadınız";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-[14px] text-stone-600">Şu anki tercih: <strong>{label}</strong></span>
      <button
        type="button"
        onClick={() => saveConsent(null)}
        className="rounded-md border border-stone-300 bg-white px-4 py-2 text-[14px] font-medium hover:bg-stone-50"
      >
        Çerez tercihini değiştir
      </button>
    </div>
  );
}
