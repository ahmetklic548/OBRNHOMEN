"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
  {
    name: "Tesbih",
    label: "Tesbihler",
    desc: "El yapımı doğal taş ve ahşap tesbihler",
    href: "/koleksiyon?kategori=Tesbih",
    bg: "#1c1a16",
    accent: "#c9a84c",
  },
  {
    name: "Seccade",
    label: "Seccadeler",
    desc: "Yüksek kalite iplik ve özgün desenler",
    href: "/koleksiyon?kategori=Seccade",
    bg: "#141210",
    accent: "#c9a84c",
  },
  {
    name: "Konsept Hediyelik",
    label: "Hediyelikler",
    desc: "Özel günler için anlamlı hediyeler",
    href: "/koleksiyon?kategori=Konsept+Hediyelik",
    bg: "#181511",
    accent: "#c9a84c",
  },
];

export default function CategoryCards() {
  return (
    <section className="py-24" style={{ background: "#f0ede8" }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Başlık */}
        <div className="text-center mb-14">
          <motion.p
            className="text-[10px] tracking-[0.6em] uppercase mb-4"
            style={{ color: "#c9a84c" }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Kategoriler
          </motion.p>
          <motion.h2
            className="text-3xl md:text-4xl font-light tracking-[0.2em] uppercase text-stone-800"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08 }}
          >
            Ne Arıyorsunuz?
          </motion.h2>
        </div>

        {/* 3 kolon */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
            >
              <Link href={cat.href} className="block group">
                {/* Card */}
                <div
                  className="relative overflow-hidden flex flex-col justify-end p-8"
                  style={{ background: cat.bg, minHeight: 280 }}
                >
                  {/* Gold orb glow */}
                  <div
                    className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${cat.accent}22 0%, transparent 70%)`,
                      filter: "blur(30px)",
                      transform: "translate(30%, -30%)",
                    }}
                  />

                  {/* Top label */}
                  <div className="absolute top-7 left-8 flex items-center gap-2">
                    <div className="w-4 h-px" style={{ background: cat.accent, opacity: 0.6 }} />
                    <span
                      className="text-[9px] tracking-[0.45em] uppercase"
                      style={{ color: `${cat.accent}99` }}
                    >
                      Koleksiyon
                    </span>
                  </div>

                  {/* Content */}
                  <div>
                    <h3
                      className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase mb-3 transition-all duration-300"
                      style={{ color: "#fff8f0" }}
                    >
                      {cat.label}
                    </h3>
                    <p className="text-xs leading-relaxed mb-5" style={{ color: "rgba(255,248,240,0.45)" }}>
                      {cat.desc}
                    </p>
                    <span
                      className="inline-flex items-center gap-2 text-[10px] tracking-[0.4em] uppercase transition-all duration-300 group-hover:gap-3"
                      style={{ color: cat.accent }}
                    >
                      Keşfet
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </div>

                  {/* Bottom gold line */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(to right, transparent, ${cat.accent}80, transparent)` }}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
