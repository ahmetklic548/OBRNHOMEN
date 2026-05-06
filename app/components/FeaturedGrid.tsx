"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function FeaturedGrid({ products }: { products: Product[] }) {
  return (
    <section className="py-28 px-6" style={{ background: "#fafaf8" }}>
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <p className="text-[9px] tracking-[0.55em] uppercase mb-4" style={{ color: "#c9a84c" }}>
            Seçilmiş Koleksiyon
          </p>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h2
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 400,
                fontFamily: "var(--font-playfair, 'Playfair Display'), Georgia, serif",
                color: "#0a0a0a",
                lineHeight: 1.1,
              }}
            >
              Öne Çıkan<br />Ürünler
            </h2>
            <Link
              href="/koleksiyon"
              className="text-[10px] tracking-[0.2em] uppercase pb-px border-b transition-colors duration-200 hover:text-black"
              style={{ color: "#999", borderColor: "#ddd" }}
            >
              Tümünü Gör →
            </Link>
          </div>
          <div className="mt-5 h-px" style={{ background: "#e8e8e8" }} />
        </motion.div>

        {/* Product grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {products.slice(0, 4).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease, delay: i * 0.09 }}
            >
              <Link href={`/products/${product.slug}`} className="group block">
                {/* Image */}
                <div
                  className="relative overflow-hidden bg-stone-50 mb-4"
                  style={{ aspectRatio: "3/4" }}
                >
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      priority={i < 2}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                      <span className="text-stone-300 text-xs tracking-widest uppercase">Görsel Yok</span>
                    </div>
                  )}

                  {!product.inStock && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: "#999" }}>Tükendi</span>
                    </div>
                  )}

                  {/* Hover CTA */}
                  <div
                    className="absolute inset-x-0 bottom-0 py-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                    style={{ background: "linear-gradient(to top, rgba(255,255,255,0.95), transparent)" }}
                  >
                    <span className="text-[9px] tracking-[0.35em] uppercase" style={{ color: "#0a0a0a" }}>
                      İncele →
                    </span>
                  </div>
                </div>

                {/* Text */}
                <p className="text-[8px] tracking-[0.35em] uppercase mb-1.5" style={{ color: "#999" }}>
                  {product.category}
                </p>
                <h3 className="text-sm leading-snug mb-1.5 line-clamp-2 transition-opacity group-hover:opacity-60" style={{ color: "#0a0a0a" }}>
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-sm font-medium" style={{ color: "#0a0a0a" }}>
                    {(product.price * 0.8).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                  </p>
                  <p className="text-xs line-through" style={{ color: "#bbb" }}>
                    {product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
