"use client";

import { motion } from "framer-motion";
import { getTopHero, getTopFeatured } from "@/lib/trendyol";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const products = [...getTopHero(), ...getTopFeatured()].slice(0, 6);

export default function BestSellers() {
  return (
    <section className="py-24 px-6" style={{ background: "#ffffff" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="text-[9px] tracking-[0.55em] uppercase mb-4" style={{ color: "#c9a84c" }}>
            Trendyol Verileri
          </p>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 400,
              fontFamily: "var(--font-playfair, 'Playfair Display'), Georgia, serif",
              color: "#0a0a0a",
              lineHeight: 1.1,
            }}
          >
            En Çok Satan Ürünler
          </h2>
          <div className="mt-5 h-px" style={{ background: "#e8e8e8" }} />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {products.map((p, i) => (
            <motion.div
              key={p.rank}
              className="relative p-6 group"
              style={{ background: "#fafaf8", border: "1px solid #efefef" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, ease, delay: i * 0.07 }}
            >
              {/* Rank badge */}
              <span
                className="absolute top-4 right-4 text-[10px] tracking-widest tabular-nums px-2 py-0.5"
                style={{ background: "#0a0a0a", color: "#ffffff" }}
              >
                #{p.rank}
              </span>

              {/* Category */}
              <p className="text-[9px] tracking-[0.25em] uppercase mb-3" style={{ color: "#999" }}>
                {p.category}
              </p>

              {/* Name */}
              <p
                className="mb-4 leading-snug line-clamp-2"
                style={{ fontSize: "0.9rem", color: "#0a0a0a" }}
              >
                {p.name}
              </p>

              {/* USP */}
              <p className="text-xs leading-relaxed mb-5 line-clamp-2" style={{ color: "#888" }}>
                {p.usp}
              </p>

              {/* Stats */}
              <div className="pt-4 border-t" style={{ borderColor: "#efefef" }}>
                <p className="text-[9px] tracking-wide uppercase mb-1" style={{ color: "#999" }}>Satış</p>
                <p className="text-sm font-medium tabular-nums" style={{ color: "#0a0a0a" }}>
                  {Math.floor(p.net_sales / 100) * 100}+
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
