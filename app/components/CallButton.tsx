"use client";

import { usePathname } from "next/navigation";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/storeNav";

/** Mobilde sol altta yüzen "Ara" düğmesi — tek dokunuşla mağazayı arar */
export default function CallButton() {
  const pathname = usePathname() ?? "";
  // Kendi alt çubuğu olan sayfalarda çakışmasın
  if (/^\/(toptan|checkout|admin)/.test(pathname)) return null;
  return (
    <a
      href={PHONE_HREF}
      aria-label={`Telefonla sipariş: ${PHONE_DISPLAY}`}
      className="fixed bottom-6 left-4 z-50 flex items-center gap-2 rounded-full bg-[#1f9d55] py-3 pl-4 pr-5 text-[15px] font-semibold text-white shadow-lg md:hidden"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
      </svg>
      Ara
    </a>
  );
}
