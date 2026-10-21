"use client";

import { useRef } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";
import ProductCard from "./ProductCard";

export default function ProductCarousel({
  title,
  products,
  href,
}: {
  title: string;
  products: Product[];
  href?: string;
}) {
  const track = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="py-10 md:py-12">
      <div className="mx-auto max-w-[1500px] px-4 md:px-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-2xl uppercase tracking-tight text-stone-900 md:text-[32px]" style={{ fontFamily: "inherit" }}>
            {title}
          </h2>
          {href && (
            <Link href={href} className="shrink-0 border-b border-stone-900 pb-0.5 text-[13px] text-stone-900 hover:opacity-60">
              Tümünü Gör
            </Link>
          )}
        </div>

        <div className="relative">
          <div
            ref={track}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 md:gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {products.map((p, i) => (
              <div key={p.id} className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[19%]">
                <ProductCard product={p} priority={i < 2} />
              </div>
            ))}
          </div>

          {products.length > 5 && (
            <>
              <button
                onClick={() => scroll(-1)}
                aria-label="Önceki"
                className="absolute left-2 top-[38%] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-stone-700 shadow hover:bg-white md:flex"
              >
                ‹
              </button>
              <button
                onClick={() => scroll(1)}
                aria-label="Sonraki"
                className="absolute right-2 top-[38%] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-stone-700 shadow hover:bg-white md:flex"
              >
                ›
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
