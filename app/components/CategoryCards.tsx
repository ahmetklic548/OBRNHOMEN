"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const categories = [
  {
    name: "Tesbih",
    href: "/koleksiyon?kategori=Tesbih",
    bg: "#0a0a0a",
    description: "El yapımı doğal taş ve ahşap",
    number: "01",
  },
  {
    name: "Seccade",
    href: "/koleksiyon?kategori=Seccade",
    bg: "#1a1a1a",
    description: "Özgün desen ve yüksek kalite iplik",
    number: "02",
  },
  {
    name: "Hediyelik",
    href: "/koleksiyon?kategori=Konsept+Hediyelik",
    bg: "#f5f0eb",
    description: "Özel günler için anlamlı seçimler",
    number: "03",
    dark: false,
  },
];

export default function CategoryCards() {
  return (
    <section className="py-28 px-6" style={{ background: "#ffffff" }}>
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
            Kategoriler
          </p>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 400,
              fontFamily: "var(--font-playfair, 'Playfair Display'), Georgia, serif",
              color: "#0a0a0a",
              lineHeight: 1.1,
            }}
          >
            Ne Arıyorsunuz?
          </h2>
          <div className="mt-5 h-px" style={{ background: "#e8e8e8" }} />
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {categories.map((cat, i) => {
            const isDark = cat.dark !== false && cat.bg !== "#f5f0eb";
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, ease, delay: i * 0.1 }}
              >
                <Link href={cat.href} className="group block">
                  <div
                    className="relative overflow-hidden flex flex-col justify-between p-8 transition-opacity duration-300 group-hover:opacity-90"
                    style={{ background: cat.bg, minHeight: 300 }}
                  >
                    {/* Number */}
                    <p
                      className="text-[10px] tracking-[0.4em] uppercase"
                      style={{ color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}
                    >
                      {cat.number}
                    </p>

                    {/* Bottom content */}
                    <div className="mt-auto pt-16">
                      <p
                        className="text-xs mb-2"
                        style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}
                      >
                        {cat.description}
                      </p>
                      <h3
                        style={{
                          fontSize: "1.6rem",
                          fontWeight: 400,
                          fontFamily: "var(--font-playfair, 'Playfair Display'), Georgia, serif",
                          color: isDark ? "#ffffff" : "#0a0a0a",
                          lineHeight: 1.1,
                          marginBottom: "1rem",
                        }}
                      >
                        {cat.name}
                      </h3>
                      <span
                        className="inline-flex items-center gap-2 text-[9px] tracking-[0.3em] uppercase transition-gap duration-300"
                        style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}
                      >
                        Keşfet
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </span>
                    </div>

                    {/* Bottom gold line on hover */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: "#c9a84c" }}
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
