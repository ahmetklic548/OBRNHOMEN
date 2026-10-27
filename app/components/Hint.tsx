"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * Küçük "?" yardım ipucu — dokununca/tıklayınca sade bir açıklama açar (dışarı tıklayınca kapanır).
 * Teknolojiyle arası iyi olmayan müşteriler için alan ve düğmelerin yanına konur.
 */
export default function Hint({ children, label = "Bu ne demek?" }: { children: React.ReactNode; label?: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("touchstart", close); };
  }, [open]);

  return (
    <span ref={ref} className="relative inline-flex align-middle">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen((o) => !o); }}
        className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-stone-300 bg-white text-[12px] font-semibold leading-none text-stone-500 hover:border-[#9a7a2c] hover:text-[#9a7a2c]"
      >
        ?
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-lg bg-stone-900 px-3.5 py-3 text-left text-[13px] font-normal normal-case leading-relaxed tracking-normal text-white shadow-xl"
        >
          {children}
          <span className="absolute left-1/2 top-full -translate-x-1/2 border-[6px] border-transparent border-t-stone-900" />
        </span>
      )}
    </span>
  );
}
