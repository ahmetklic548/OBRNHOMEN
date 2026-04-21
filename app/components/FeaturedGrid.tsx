"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function FeaturedGrid({ products }: { products: Product[] }) {
  return (
    <section className="py-28 px-6" style={{ background: "#F5F5F7" }}>
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <p
            className="text-[11px] tracking-[0.5em] uppercase font-medium mb-4"
            style={{ color: "#86868B" }}
          >
            Seçilmiş Koleksiyon
          </p>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h2
              className="font-semibold"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                letterSpacing: "-0.022em",
                color: "#1D1D1F",
              }}
            >
              Öne Çıkan<br />Ürünler
            </h2>
            <Link
              href="/koleksiyon"
              className="text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: "#c9a84c" }}
            >
              Tümünü Gör →
            </Link>
          </div>
        </motion.div>

        {/* Product grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {products.slice(0, 4).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease, delay: i * 0.09 }}
            >
              <Link href={`/products/${product.slug}`} className="group block">
                {/* Image card */}
                <div
                  className="relative overflow-hidden rounded-2xl bg-white mb-4 apple-shadow group-hover:apple-shadow-hover transition-all duration-500 group-hover:scale-[1.02]"
                  style={{ aspectRatio: "3/4" }}
                >
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      priority={i < 2}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                      <span className="text-stone-300 text-xs tracking-widest uppercase">Görsel Yok</span>
                    </div>
                  )}

                  {/* Out of stock overlay */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <span className="text-xs tracking-widest uppercase" style={{ color: "#86868B" }}>Tükendi</span>
                    </div>
                  )}

                  {/* Hover CTA */}
                  <div className="absolute inset-x-0 bottom-0 py-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                    style={{ background: "linear-gradient(to top, rgba(255,255,255,0.95), transparent)" }}
                  >
                    <span className="text-[10px] tracking-[0.3em] uppercase font-medium" style={{ color: "#1D1D1F" }}>
                      İncele →
                    </span>
                  </div>
                </div>

                {/* Text */}
                <p className="text-[9px] tracking-[0.3em] uppercase mb-1.5 font-medium" style={{ color: "#c9a84c" }}>
                  {product.category}
                </p>
                <h3
                  className="text-sm leading-snug mb-1.5 line-clamp-2 group-hover:opacity-70 transition-opacity"
                  style={{ color: "#1D1D1F", fontWeight: 500 }}
                >
                  {product.name}
                </h3>
                <p className="text-sm font-semibold" style={{ color: "#1D1D1F" }}>
                  {product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
