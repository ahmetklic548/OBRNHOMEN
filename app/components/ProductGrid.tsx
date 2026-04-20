"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IslamicStar, IslamicDivider } from "./IslamicOrnament";
import type { Product } from "@/lib/products";

const ease = "easeOut" as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export default function ProductGrid({
  products,
  categories,
}: {
  products: Product[];
  categories: string[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const filtered = active ? products.filter((p) => p.category === active) : products;

  return (
    <div className="py-16">
      {/* ── Bölüm başlığı ── */}
      <div className="text-center mb-14">
        <motion.div
          className="flex items-center justify-center gap-3 mb-5"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          <IslamicStar size={20} color="#c9a84c" opacity={0.7} />
          <span className="text-[10px] tracking-[0.5em] uppercase text-stone-400">Koleksiyon</span>
          <IslamicStar size={20} color="#c9a84c" opacity={0.7} />
        </motion.div>

        <motion.h2
          className="text-3xl md:text-4xl font-light tracking-[0.15em] uppercase text-stone-800 mb-5"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
        >
          El İşçiliği Ürünler
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <IslamicDivider color="#c9a84c" className="mb-6" />
        </motion.div>

        <motion.p
          className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Her ürün titizlikle seçilmiş, özel anlarınız için hazırlanmıştır.
        </motion.p>
      </div>

      {/* ── Kategori filtresi ── */}
      <motion.div
        className="flex flex-wrap gap-2 justify-center mb-10"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease, delay: 0.15 }}
      >
        <button
          onClick={() => setActive(null)}
          className={`px-5 py-2 text-[10px] tracking-widest uppercase transition-all duration-300 ${
            active === null
              ? "bg-stone-900 text-white shadow-md"
              : "border border-stone-300 text-stone-500 hover:border-[#c9a84c] hover:text-[#c9a84c]"
          }`}
        >
          Tümü
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat === active ? null : cat)}
            className={`px-5 py-2 text-[10px] tracking-widest uppercase transition-all duration-300 ${
              active === cat
                ? "bg-stone-900 text-white shadow-md"
                : "border border-stone-300 text-stone-500 hover:border-[#c9a84c] hover:text-[#c9a84c]"
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Ürün sayısı */}
      <p className="text-[10px] text-stone-400 tracking-widest uppercase text-center mb-10">
        {filtered.length} ürün
      </p>

      {/* ── Ürün grid ── */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0, margin: "0px 0px -50px 0px" }}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((product) => (
            <motion.div
              key={product.id}
              variants={cardVariants}
              layout
              whileHover={{ y: -6, transition: { duration: 0.22, ease } }}
              className="group"
            >
              <Link href={`/products/${product.slug}`} className="block">
                {/* Görsel */}
                <div className="relative aspect-square bg-stone-50 overflow-hidden mb-3 border border-stone-100 group-hover:border-[#c9a84c]/40 transition-colors duration-300">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs tracking-widest uppercase">
                      Görsel Yok
                    </div>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
                      <span className="text-xs tracking-widest uppercase text-stone-400">Tükendi</span>
                    </div>
                  )}
                  {/* Altın köşe hover efekti */}
                  <div className="absolute inset-0 border-2 border-[#c9a84c]/0 group-hover:border-[#c9a84c]/20 transition-all duration-300 pointer-events-none" />
                </div>

                {/* Bilgi */}
                <p className="text-[9px] tracking-[0.25em] uppercase text-[#c9a84c]/70 mb-1">
                  {product.category}
                </p>
                <h2 className="text-sm text-stone-700 leading-snug mb-2 group-hover:text-stone-900 transition-colors line-clamp-2 min-h-[2.6rem]">
                  {product.name}
                </h2>
                <p className="text-sm font-medium text-stone-900">
                  {product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                </p>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Alt dekoratif divider */}
      <motion.div
        className="mt-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <IslamicDivider color="#c9a84c" />
      </motion.div>
    </div>
  );
}
