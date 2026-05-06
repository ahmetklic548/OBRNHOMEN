"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "./WishlistContext";
import type { Product } from "@/lib/products";

const ease = "easeOut" as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

export default function ProductGrid({
  products,
  categories,
}: {
  products: Product[];
  categories: string[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { toggle, has } = useWishlist();

  const filtered = products.filter((p) => {
    const matchesCategory = active ? p.category === active : true;
    const matchesSearch = search.trim()
      ? p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-20">
      {/* ── Section header ── */}
      <div className="mb-16">
        <motion.p
          className="text-[9px] tracking-[0.55em] uppercase mb-4"
          style={{ color: "#c9a84c" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Koleksiyon
        </motion.p>

        <motion.div
          className="flex items-end justify-between gap-6 flex-wrap"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2
            className="font-serif-display"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              color: "#0a0a0a",
              fontFamily: "var(--font-playfair, 'Playfair Display'), Georgia, serif",
              lineHeight: 1.1,
            }}
          >
            El İşçiliği Ürünler
          </h2>

          {/* Search */}
          <div className="relative flex-shrink-0">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
              style={{ color: "#999" }}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx={11} cy={11} r={8} />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ürün ara..."
              className="pl-8 pr-8 py-2.5 text-[10px] tracking-wide border-b bg-transparent focus:outline-none focus:border-black transition-colors w-48"
              style={{ borderColor: "#ddd", color: "#0a0a0a" }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-black"
                aria-label="Aramayı temizle"
              >
                ×
              </button>
            )}
          </div>
        </motion.div>

        {/* Thin rule */}
        <motion.div
          className="mt-5 mb-8"
          style={{ height: 1, background: "#e8e8e8" }}
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        {/* Category filter — underline style */}
        <motion.div
          className="flex flex-wrap gap-6 items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <button
            onClick={() => setActive(null)}
            className={`text-[10px] tracking-[0.2em] uppercase pb-1 transition-all duration-200 ${
              active === null
                ? "border-b border-black text-black"
                : "text-stone-400 hover:text-black border-b border-transparent"
            }`}
          >
            Tümü
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat === active ? null : cat)}
              className={`text-[10px] tracking-[0.2em] uppercase pb-1 transition-all duration-200 ${
                active === cat
                  ? "border-b border-black text-black"
                  : "text-stone-400 hover:text-black border-b border-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-[9px] tracking-widest uppercase text-stone-400">
            {filtered.length} ürün
          </span>
        </motion.div>
      </div>

      {/* ── Product grid ── */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12"
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
              className="group"
            >
              <Link href={`/products/${product.slug}`} className="block">
                {/* Image */}
                <div className="relative aspect-[3/4] bg-stone-50 overflow-hidden mb-4">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs tracking-widest uppercase">
                      Görsel Yok
                    </div>
                  )}

                  {!product.inStock && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <span className="text-[9px] tracking-[0.3em] uppercase text-stone-400">Tükendi</span>
                    </div>
                  )}

                  {product.inStock && product.stock <= 10 && (
                    <div className="absolute top-2 left-2">
                      <span
                        className="text-[8px] tracking-widest uppercase px-2 py-1"
                        style={{ background: "#0a0a0a", color: "#ffffff" }}
                      >
                        Son {product.stock} adet
                      </span>
                    </div>
                  )}

                  {/* Wishlist */}
                  <button
                    onClick={(e) => { e.preventDefault(); toggle(product.slug); }}
                    className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-white transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Favorilere ekle"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill={has(product.slug) ? "#c9a84c" : "none"}
                      stroke={has(product.slug) ? "#c9a84c" : "#0a0a0a"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>

                {/* Info */}
                <p className="text-[8px] tracking-[0.3em] uppercase mb-1" style={{ color: "#999" }}>
                  {product.category}
                </p>
                <h2
                  className="text-sm leading-snug mb-2 transition-colors line-clamp-2"
                  style={{ color: "#0a0a0a", minHeight: "2.6rem" }}
                >
                  {product.name}
                </h2>
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
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
