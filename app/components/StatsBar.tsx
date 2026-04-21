"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "198+", label: "Özgün Ürün" },
  { value: "%100", label: "El İşçiliği" },
  { value: "14 Gün", label: "İade Garantisi" },
  { value: "256-bit", label: "SSL Güvenlik" },
];

export default function StatsBar() {
  return (
    <section className="border-y" style={{ background: "#ffffff", borderColor: "rgba(0,0,0,0.06)" }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-black/5">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="flex flex-col items-center justify-center py-10 px-4 text-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <p
                className="font-semibold mb-1"
                style={{ fontSize: "1.8rem", letterSpacing: "-0.022em", color: "#1D1D1F" }}
              >
                {s.value}
              </p>
              <p className="text-xs tracking-widest uppercase" style={{ color: "#86868B" }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
