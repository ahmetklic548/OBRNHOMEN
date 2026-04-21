"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";

const ease = "easeOut" as const;

export default function FeaturedGrid({ products }: { products: Product[] }) {
  const [p1, p2, p3, p4] = products;

  return (
    <section className="relative py-24 overflow-hidden" style={{ background: "#f9f9f7" }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Başlık */}
        <div className="text-center mb-16">
          <motion.p
            className="text-[10px] tracking-[0.6em] uppercase mb-4"
            style={{ color: "#c9a84c" }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            Öne Çıkanlar
          </motion.p>

          <motion.h2
            className="text-3xl md:text-5xl font-light tracking-[0.25em] uppercase text-stone-800 mb-5"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease, delay: 0.08 }}
          >
            Seçilmiş Koleksiyon
          </motion.h2>

          <motion.div
            className="flex items-center justify-center gap-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.18 }}
          >
            <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(to right, transparent, #c9a84c40)" }} />
            <div className="w-1 h-1 rounded-full" style={{ background: "#c9a84c", opacity: 0.6 }} />
            <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(to left, transparent, #c9a84c40)" }} />
          </motion.div>
        </div>

        {/* 4-up grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[p1, p2, p3, p4].filter(Boolean).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease, delay: i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.25, ease } }}
              className="group"
            >
              <Link href={`/products/${product.slug}`} className="block">
                <div
                  className="relative overflow-hidden mb-4 border border-stone-100 group-hover:border-[#c9a84c]/35 transition-colors duration-300"
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
                  {/* Hover overlay */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-1/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: "linear-gradient(to top, rgba(201,168,76,0.1), transparent)" }}
                  />
                  {/* Corner marks */}
                  <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#c9a84c]/0 group-hover:border-[#c9a84c]/50 transition-all duration-300 pointer-events-none" />
                  <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#c9a84c]/0 group-hover:border-[#c9a84c]/50 transition-all duration-300 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#c9a84c]/0 group-hover:border-[#c9a84c]/50 transition-all duration-300 pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#c9a84c]/0 group-hover:border-[#c9a84c]/50 transition-all duration-300 pointer-events-none" />
                </div>
                <p className="text-[9px] tracking-[0.3em] uppercase mb-1.5" style={{ color: "#c9a84c", opacity: 0.85 }}>
                  {product.category}
                </p>
                <h3 className="text-sm text-stone-700 leading-snug mb-2 group-hover:text-stone-900 transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm font-medium text-stone-900">
                  {product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease, delay: 0.2 }}
        >
          <Link
            href="/koleksiyon"
            className="inline-block px-12 py-4 text-[11px] tracking-[0.45em] uppercase transition-all duration-300 hover:bg-stone-900 hover:text-white"
            style={{ border: "1px solid #c9a84c", color: "#8b6914" }}
          >
            Tüm Koleksiyonu Gör
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
