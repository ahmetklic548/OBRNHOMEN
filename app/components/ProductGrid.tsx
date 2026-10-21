"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "./WishlistContext";
import type { Product } from "@/lib/products";
import ProductCard from "./store/ProductCard";

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
    <div className="py-8">
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
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 md:gap-x-4 gap-y-8"
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
              <div className="relative">
                <ProductCard product={product} />
                {/* Wishlist */}
                <button
                  onClick={() => toggle(product.slug)}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 transition-opacity md:opacity-0 md:group-hover:opacity-100"
                  aria-label="Favorilere ekle"
                >
                  <svg
                    width="14"
                    height="14"
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
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
