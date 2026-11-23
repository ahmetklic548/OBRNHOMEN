"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import MetaPixel from "@/app/components/MetaPixel";
import { CONSENT_EVENT, CONSENT_KEY, type ConsentValue } from "@/lib/legal";

const GA_ID = "G-EZ3ZCTGL48";

export function readConsent(): ConsentValue | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "hepsi" || v === "zorunlu" ? v : null;
  } catch {
    return null;
  }
}

export function saveConsent(v: ConsentValue | null) {
  try {
    if (v) localStorage.setItem(CONSENT_KEY, v);
    else localStorage.removeItem(CONSENT_KEY);
  } catch {}
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/**
 * KVKK çerez onayı: GA4 ve Meta Pixel YALNIZCA "Kabul et" sonrası yüklenir.
 * Reddedilirse sonradan izin geri alınınca sayfa yenilenir (yüklenmiş script kaldırılamaz).
 */
export default function CookieConsent() {
  const [consent, setConsent] = useState<ConsentValue | null | undefined>(undefined);

  useEffect(() => {
    const sync = () => {
      const next = readConsent();
      setConsent((prev) => {
        if (prev === "hepsi" && next !== "hepsi") window.location.reload();
        return next;
      });
    };
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CONSENT_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <>
      {consent === "hepsi" && (
        <>
          <GoogleAnalytics gaId={GA_ID} />
          <MetaPixel />
        </>
      )}

      {consent === null && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Çerez tercihi"
          className="print-hidden fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-2xl rounded-xl border border-stone-200 bg-white p-4 shadow-xl sm:p-5"
        >
          <p className="text-[14px] leading-relaxed text-stone-700">
            Sitemizi geliştirmek ve reklamlarımızı ölçmek için çerez kullanıyoruz. Sepet ve giriş gibi zorunlu çerezler her zaman açıktır.{" "}
            <Link href="/gizlilik" className="underline underline-offset-2">Ayrıntılar</Link>
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => saveConsent("zorunlu")}
              className="rounded-md border border-stone-300 px-4 py-2.5 text-[14px] font-medium text-stone-800 hover:bg-stone-50"
            >
              Sadece zorunlu
            </button>
            <button
              type="button"
              onClick={() => saveConsent("hepsi")}
              className="rounded-md bg-black px-4 py-2.5 text-[14px] font-semibold text-white hover:opacity-85"
            >
              Kabul et
            </button>
          </div>
        </div>
      )}
    </>
  );
}
