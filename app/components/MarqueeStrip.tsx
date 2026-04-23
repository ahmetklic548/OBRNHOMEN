"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";

interface Props {
  products: Product[];
}

const ITEM_W = 240;
const GAP = 14;
const DURATION = 35;

export default function MarqueeStrip({ products }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = [...products, ...products];
  const trackW = products.length * (ITEM_W + GAP);

  if (products.length === 0) return null;

  return (
    <section className="py-16 overflow-hidden" style={{ background: "#1D1D1F" }}>
      <p
        className="text-center text-[10px] tracking-[0.5em] uppercase mb-10 font-medium"
        style={{ color: "#86868B" }}
      >
        Koleksiyondan
      </p>

      <div ref={containerRef} className="relative overflow-hidden">
        <motion.div
          className="flex"
          style={{ gap: GAP, width: trackW * 2 }}
          animate={{ x: [0, -trackW] }}
          transition={{
            duration: DURATION,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          }}
        >
          {items.map((p, i) => (
            <Link
              key={`${p.id}-${i}`}
              href={`/products/${p.slug}`}
              className="flex-none group"
              style={{ width: ITEM_W }}
            >
              <div
                className="relative overflow-hidden"
                style={{
                  width: ITEM_W,
                  height: ITEM_W,
                  borderRadius: 14,
                  background: "#2a2a2a",
                }}
              >
                {p.images[0] ? (
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    sizes="240px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs" style={{ color: "#86868B" }}>Görsel Yok</span>
                  </div>
                )}
              </div>
              <p
                className="mt-2.5 text-[11px] tracking-wide truncate transition-colors group-hover:text-white"
                style={{ color: "#86868B", maxWidth: ITEM_W }}
              >
                {p.name}
              </p>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
