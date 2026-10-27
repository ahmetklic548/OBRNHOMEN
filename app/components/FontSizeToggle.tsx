"use client";

import { useSyncExternalStore } from "react";

import { BIG_TEXT_KEY } from "@/lib/bigText";

/** Görme zorluğu olanlar için tüm siteyi büyüten "A+" düğmesi (tercih tarayıcıda hatırlanır) */

const subscribe = (cb: () => void) => {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => obs.disconnect();
};

export default function FontSizeToggle() {
  const big = useSyncExternalStore(subscribe, () => document.documentElement.classList.contains("text-buyuk"), () => false);

  const toggle = () => {
    const next = !big;
    document.documentElement.classList.toggle("text-buyuk", next);
    try { localStorage.setItem(BIG_TEXT_KEY, next ? "1" : "0"); } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={big}
      aria-label={big ? "Yazıyı normal boyuta getir" : "Yazıyı büyüt"}
      title={big ? "Yazıyı normal boyuta getir" : "Yazıyı büyüt"}
      className="flex h-8 min-w-8 items-center justify-center rounded-md border px-1.5 text-[14px] font-bold transition-colors"
      style={big ? { background: "#0a0a0a", color: "#fff", borderColor: "#0a0a0a" } : { borderColor: "#d6d3d1", color: "#1c1917" }}
    >
      {big ? "A−" : "A+"}
    </button>
  );
}
