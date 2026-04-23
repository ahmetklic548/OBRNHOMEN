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
      {/* Başlık satırı */}
      <motion.div
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease, delay: index * 0.05 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-px" style={{ background: "#c9a84c", opacity: 0.6 }} />
          <h3 className="text-xs tracking-[0.45em] uppercase text-stone-600">{category}</h3>
        </div>
        <Link
          href={`/koleksiyon?kategori=${encodeURIComponent(category)}`}
          className="text-[9px] tracking-[0.35em] uppercase transition-colors duration-200 hover:text-stone-800"
          style={{ color: "#c9a84c" }}
        >
          Tümünü Gör →
        </Link>
      </motion.div>

      {/* 3-kolon grid */}
      <div className="grid grid-cols-3 gap-5 md:gap-8">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease, delay: index * 0.05 + i * 0.08 }}
            whileHover={{ y: -6, transition: { duration: 0.2, ease } }}
            className="group"
          >
            <Link href={`/products/${product.slug}`} className="block">
              <div className="relative aspect-[3/4] overflow-hidden mb-3 rounded-xl border border-stone-100 group-hover:border-[#c9a84c]/30 transition-colors duration-300">
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                    sizes="(max-width: 640px) 33vw, (max-width: 1024px) 22vw, 18vw"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-50 flex items-center justify-center">
                    <span className="text-stone-300 text-[10px] tracking-widest uppercase">Görsel Yok</span>
                  </div>
                )}
              </div>
              <h4 className="text-xs text-stone-600 leading-snug group-hover:text-stone-900 transition-colors line-clamp-2 mb-1">
                {product.name}
              </h4>
              <div className="flex items-baseline gap-1.5">
                <p className="text-xs font-medium text-stone-800">
                  {(product.price * 0.8).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                </p>
                <p className="text-[10px] line-through" style={{ color: "#86868B" }}>
                  {product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Separator */}
      <div className="mt-10 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.15), transparent)" }} />
    </div>
  );
}
