"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export interface HeroSlide {
  title: string;
  subtitle: string;
  href: string;
  images: string[]; // 3 görsel: yan yana kolaj
}

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length, active]);

  const go = (dir: 1 | -1) => setActive((a) => (a + dir + slides.length) % slides.length);

  return (
    <section className="relative h-[62vw] max-h-[680px] min-h-[380px] w-full overflow-hidden bg-[#1a1208]">
      {slides.map((s, i) => (
        <Link
          key={s.title}
          href={s.href}
          aria-hidden={i !== active}
          tabIndex={i === active ? 0 : -1}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === active ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <div className="grid h-full grid-cols-2 md:grid-cols-[1fr_1.15fr_1fr]">
            {s.images.map((src, j) => (
              <div key={src + j} className={`relative h-full ${j === 2 ? "hidden md:block" : ""}`}>
                <Image
                  src={src}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="(max-width: 768px) 50vw, 34vw"
                  className={`object-cover transition-transform duration-[7000ms] ${i === active ? "scale-105" : "scale-100"}`}
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-14 px-6 text-center text-white md:bottom-16">
            <p className="mb-3 text-[13px] uppercase tracking-[0.2em] text-white/90 md:text-sm">{s.subtitle}</p>
            <p
              className="text-3xl font-medium leading-tight drop-shadow md:text-6xl"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {s.title}
            </p>
          </div>
        </Link>
      ))}

      <button
        onClick={() => go(-1)}
        aria-label="Önceki"
        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 p-3 text-3xl text-white/90 hover:text-white md:left-6"
      >
        ←
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Sonraki"
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 p-3 text-3xl text-white/90 hover:text-white md:right-6"
      >
        →
      </button>

      <div className="absolute inset-x-0 bottom-5 z-10 flex justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.title}
            onClick={() => setActive(i)}
            aria-label={`${i + 1}. slayt`}
            className={`h-1.5 rounded-full transition-all ${i === active ? "w-8 bg-white" : "w-3 bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}
