"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";

const ease = "easeOut" as const;

export default function CategoryStrip({
  category,
  products,
  index = 0,
}: {
  category: string;
  products: Product[];
  index?: number;
}) {
  return (
    <div className="mb-20">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease, delay: index * 0.05 }}
      >
        <h3
          className="text-xs tracking-[0.4em] uppercase"
          style={{ color: "#0a0a0a" }}
        >
          {category}
        </h3>
        <Link
          href={`/koleksiyon?kategori=${encodeURIComponent(category)}`}
          className="text-[9px] tracking-[0.3em] uppercase pb-px border-b transition-colors duration-200 hover:text-black"
          style={{ color: "#999", borderColor: "#ddd" }}
        >
          Tümünü Gör →
        </Link>
      </motion.div>

      {/* 3-col grid */}
      <div className="grid grid-cols-3 gap-5 md:gap-8">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease, delay: index * 0.05 + i * 0.07 }}
            className="group"
          >
            <Link href={`/products/${product.slug}`} className="block">
              <div className="relative aspect-[3/4] overflow-hidden mb-3 bg-stone-50">
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    sizes="(max-width: 640px) 33vw, (max-width: 1024px) 22vw, 18vw"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-50 flex items-center justify-center">
                    <span className="text-stone-300 text-[10px] tracking-widest uppercase">Görsel Yok</span>
                  </div>
                )}
              </div>
              <h4 className="text-xs leading-snug mb-1 transition-opacity group-hover:opacity-50 line-clamp-2" style={{ color: "#0a0a0a" }}>
                {product.name}
              </h4>
              <div className="flex items-baseline gap-1.5">
                <p className="text-xs font-medium" style={{ color: "#0a0a0a" }}>
                  {(product.price * 0.8).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                </p>
                <p className="text-[10px] line-through" style={{ color: "#bbb" }}>
                  {product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Separator */}
      <div className="mt-10 h-px" style={{ background: "#e8e8e8" }} />
    </div>
  );
}
