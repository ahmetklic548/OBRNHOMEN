"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { IslamicStar, IslamicDivider } from "./IslamicOrnament";
import type { Product } from "@/lib/products";

const ease = "easeOut" as const;

export default function FeaturedGrid({ products }: { products: Product[] }) {
  const [p1, p2, p3, p4] = products;

  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #f9f3ea 0%, #faf5ec 100%)" }}
    >
      {/* OBRNHOMEN watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden
      >
        <span
          className="font-light tracking-[0.6em] uppercase"
          style={{
            fontSize: "clamp(48px, 12vw, 140px)",
            color: "#8b6914",
            opacity: 0.04,
            fontFamily: "Georgia, serif",
            whiteSpace: "nowrap",
          }}
        >
          OBRNHOMEN
        </span>
      </div>

      {/* İslami desen */}
      <div className="absolute inset-0 opacity-[0.05] islamic-pattern pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Başlık */}
        <div className="text-center mb-16">
          <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(to right, transparent, #c9a84c)" }} />
            <IslamicStar size={10} color="#c9a84c" opacity={0.5} />
            <IslamicStar size={18} color="#c9a84c" opacity={0.85} />
            <IslamicStar size={10} color="#c9a84c" opacity={0.5} />
            <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(to left, transparent, #c9a84c)" }} />
          </motion.div>

          <motion.p
            className="text-[10px] tracking-[0.5em] uppercase mb-3"
            style={{ color: "#c9a84c" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Seçilmiş Ürünler
          </motion.p>

          <motion.h2
            className="text-3xl md:text-5xl font-light tracking-[0.3em] uppercase text-stone-800 mb-4"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease, delay: 0.15 }}
          >
            OBRNHOMEN
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25 }}
          >
            <IslamicDivider color="#c9a84c" className="mb-4" />
          </motion.div>

          <motion.p
            className="text-xs text-stone-400 tracking-widest"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            El işçiliği ile hazırlanmış, özenle seçilmiş koleksiyon
          </motion.p>
        </div>

        {/* 2×2 Ürün Grid — büyük kartlar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[p1, p2, p3, p4].filter(Boolean).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease, delay: i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.25, ease } }}
              className="group"
            >
              <Link href={`/products/${product.slug}`} className="block">
                {/* Görsel — daha uzun aspect ratio */}
                <div
                  className="relative overflow-hidden mb-4 border border-stone-100 group-hover:border-[#c9a84c]/40 transition-colors duration-400"
                  style={{ aspectRatio: "3/4" }}
                >
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      priority={i < 2}
                      className="object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                      <span className="text-stone-300 text-xs tracking-widest uppercase">Görsel Yok</span>
                    </div>
                  )}
                  {/* Köşe süsler */}
                  <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#c9a84c]/0 group-hover:border-[#c9a84c]/60 transition-all duration-400 pointer-events-none" />
                  <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#c9a84c]/0 group-hover:border-[#c9a84c]/60 transition-all duration-400 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#c9a84c]/0 group-hover:border-[#c9a84c]/60 transition-all duration-400 pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#c9a84c]/0 group-hover:border-[#c9a84c]/60 transition-all duration-400 pointer-events-none" />
                  {/* Altın overlay gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                    style={{ background: "linear-gradient(to top, rgba(201,168,76,0.12), transparent)" }}
                  />
                </div>

                {/* Bilgi */}
                <p className="text-[9px] tracking-[0.3em] uppercase mb-1" style={{ color: "#c9a84c", opacity: 0.8 }}>
                  {product.category}
                </p>
                <h3 className="text-sm md:text-base text-stone-700 leading-snug mb-2 group-hover:text-stone-900 transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm font-medium text-stone-900">
                  {product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Koleksiyona Git */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease, delay: 0.2 }}
        >
          <Link
            href="/koleksiyon"
            className="inline-flex items-center gap-3 px-10 py-4 text-[11px] tracking-[0.4em] uppercase transition-all duration-300 group"
            style={{ border: "1px solid #c9a84c", color: "#8b6914" }}
          >
            <IslamicStar size={10} color="#c9a84c" opacity={0.7} />
            <span className="group-hover:tracking-[0.5em] transition-all duration-300">Tüm Koleksiyonu Keşfet</span>
            <IslamicStar size={10} color="#c9a84c" opacity={0.7} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
