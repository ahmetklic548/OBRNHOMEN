"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const categories = [
  {
    name: "Tesbih",
    href: "/koleksiyon?kategori=Tesbih",
    bg: "#1D1D1F",
    description: "El yapımı doğal taş ve ahşap",
    number: "01",
  },
  {
    name: "Seccade",
    href: "/koleksiyon?kategori=Seccade",
    bg: "#2d2d2d",
    description: "Özgün desen ve yüksek kalite iplik",
    number: "02",
  },
  {
    name: "Hediyelik",
    href: "/koleksiyon?kategori=Konsept+Hediyelik",
    bg: "#c9a84c",
    description: "Özel günler için anlamlı seçimler",
    number: "03",
  },
];

export default function CategoryCards() {
  return (
    <section className="py-28 px-6" style={{ background: "#ffffff" }}>
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
            Kategoriler
          </p>
          <h2
            className="font-semibold"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              letterSpacing: "-0.022em",
              color: "#1D1D1F",
            }}
          >
            Ne Arıyorsunuz?
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease, delay: i * 0.1 }}
            >
              <Link href={cat.href} className="group block">
                <div
                  className="relative rounded-3xl overflow-hidden flex flex-col justify-between p-8 transition-transform duration-500 group-hover:scale-[1.02]"
                  style={{ background: cat.bg, minHeight: 300 }}
                >
                  {/* Number */}
                  <p
                    className="text-[10px] tracking-[0.4em] uppercase font-medium mb-auto"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    {cat.number}
                  </p>

                  {/* Bottom content */}
                  <div className="mt-auto pt-16">
                    <p
                      className="text-xs mb-2"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      {cat.description}
                    </p>
                    <h3
                      className="text-2xl font-semibold mb-4"
                      style={{
                        color: "#ffffff",
                        letterSpacing: "-0.015em",
                      }}
                    >
                      {cat.name}
                    </h3>
                    <span
                      className="inline-flex items-center gap-2 text-xs font-medium transition-gap duration-300"
                      style={{ color: "rgba(255,255,255,0.65)" }}
                    >
                      Keşfet
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </div>

                  {/* Bottom shine line */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)" }}
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
