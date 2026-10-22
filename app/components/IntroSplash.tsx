"use client";

import { useEffect, useState } from "react";
import KaabaMark from "./KaabaMark";
import { INTRO_SEEN_KEY } from "@/lib/intro";

const DURATION_MS = 3000;

function markSeen() {
  document.documentElement.classList.add("intro-seen");
}

/**
 * Ana sayfa açılış animasyonu — oturum başına bir kez, tıklayınca geçilir.
 * Kapanış CSS animasyonuyla olur (JS yüklenmese de kapanır); JS süre bitince DOM'dan kaldırır.
 */
export default function IntroSplash() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {}
    const finish = () => {
      markSeen();
      setGone(true);
    };
    if (seen) {
      finish();
      return;
    }
    const t = setTimeout(finish, DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div
      className="intro-splash"
      role="presentation"
      onClick={() => {
        markSeen();
        setGone(true);
      }}
    >
      <div className="flex flex-col items-center">
        <KaabaMark animated className="h-36 w-36 text-[#b8902e] md:h-52 md:w-52" />
        <p
          className="mt-6 flex text-3xl uppercase text-[#7a5c17] md:text-6xl"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          aria-label="Obrnhomen"
        >
          {"OBRNHOMEN".split("").map((ch, i) => (
            <span key={i} className="intro-letter" style={{ animationDelay: `${0.9 + i * 0.06}s` }} aria-hidden>
              {ch}
            </span>
          ))}
        </p>
        <p className="intro-fade intro-d4 mt-4 text-xs uppercase tracking-[0.45em] text-stone-500 md:text-sm">
          Hac · Umre · Hediyelik
        </p>
      </div>
    </div>
  );
}
