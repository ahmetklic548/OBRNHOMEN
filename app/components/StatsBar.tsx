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
      className="flex flex-col items-center justify-center py-8 px-4 text-center cursor-default"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease }}
    >
      <p
        style={{
          fontSize: "1.6rem",
          fontWeight: 400,
          fontFamily: "var(--font-playfair, 'Playfair Display'), Georgia, serif",
          color: "#0a0a0a",
          lineHeight: 1,
          marginBottom: "0.4rem",
        }}
      >
        {value}
      </p>
      <p className="text-[9px] tracking-[0.35em] uppercase" style={{ color: "#999" }}>
        {label}
      </p>
    </motion.div>
  );
}

export default function StatsBar() {
  return (
    <section className="border-y" style={{ background: "#ffffff", borderColor: "#efefef" }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x" style={{ borderColor: "#efefef" }}>
          {stats.map((s, i) => (
            <StatCell key={s.label} value={s.value} label={s.label} delay={i * 0.07} />
          ))}
        </div>
      </div>
    </section>
  );
}
