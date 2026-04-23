"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "14K+", label: "Mutlu Müşteri" },
  { value: "%100", label: "El İşçiliği" },
  { value: "14 Gün", label: "İade Garantisi" },
  { value: "256-bit", label: "Güvenli Ödeme" },
];

const ease = [0.25, 0.46, 0.45, 0.94] as const;

function StatCell({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div
      className="relative flex flex-col items-center justify-center py-10 px-4 text-center overflow-hidden group cursor-default"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay, ease }}
    >
      {/* Default state */}
      <motion.div
        className="flex flex-col items-center gap-1"
        initial={false}
        animate={{ y: 0, opacity: 1 }}
        whileHover={{ y: -28, opacity: 0 }}
        transition={{ duration: 0.3, ease }}
      >
        <p className="font-semibold" style={{ fontSize: "1.8rem", letterSpacing: "-0.022em", color: "#1D1D1F" }}>
          {value}
        </p>
        <p className="text-xs tracking-widest uppercase" style={{ color: "#86868B" }}>
          {label}
        </p>
      </motion.div>

      {/* Hover state */}
      <motion.div
        className="absolute flex flex-col items-center gap-1"
        initial={{ y: 28, opacity: 0 }}
        whileHover={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease }}
      >
        <p className="font-semibold" style={{ fontSize: "1.8rem", letterSpacing: "-0.022em", color: "#c9a84c" }}>
          {value}
        </p>
        <p className="text-xs tracking-widest uppercase font-medium" style={{ color: "#1D1D1F" }}>
          {label}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function StatsBar() {
  return (
    <section className="border-y" style={{ background: "#ffffff", borderColor: "rgba(0,0,0,0.06)" }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-black/5">
          {stats.map((s, i) => (
            <StatCell key={s.label} value={s.value} label={s.label} delay={i * 0.07} />
          ))}
        </div>
      </div>
    </section>
  );
}
