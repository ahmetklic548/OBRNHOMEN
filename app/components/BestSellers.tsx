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
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="text-[11px] tracking-[0.5em] uppercase font-medium mb-4" style={{ color: "#86868B" }}>
            Trendyol Verileri
          </p>
          <h2
            className="font-semibold"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              letterSpacing: "-0.022em",
              color: "#1D1D1F",
            }}
          >
            En Çok Satan Ürünler
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p, i) => (
            <motion.div
              key={p.rank}
              className="relative rounded-2xl p-6 group overflow-hidden"
              style={{ background: "#F5F5F7" }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, ease, delay: i * 0.07 }}
              whileHover={{ y: -4 }}
            >
              {/* Rank badge */}
              <span
                className="absolute top-4 right-4 text-[11px] font-semibold tabular-nums px-2 py-0.5 rounded-full"
                style={{ background: "#1D1D1F", color: "#ffffff" }}
              >
                #{p.rank}
              </span>

              {/* Category */}
              <p className="text-[10px] tracking-[0.2em] uppercase mb-3 font-medium" style={{ color: "#86868B" }}>
                {p.category}
              </p>

              {/* Name */}
              <p
                className="font-semibold mb-4 leading-snug line-clamp-2"
                style={{ fontSize: "0.95rem", color: "#1D1D1F" }}
              >
                {p.name}
              </p>

              {/* USP */}
              <p className="text-xs leading-relaxed mb-5 line-clamp-2" style={{ color: "#86868B" }}>
                {p.usp}
              </p>

              {/* Stats row */}
              <div className="pt-4 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                <p className="text-[10px] tracking-wide uppercase mb-1" style={{ color: "#86868B" }}>Satış</p>
                <p className="text-sm font-semibold tabular-nums" style={{ color: "#1D1D1F" }}>
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
