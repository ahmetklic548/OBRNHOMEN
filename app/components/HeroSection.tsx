"use client";

import { motion } from "framer-motion";
import { IslamicDivider } from "./IslamicOrnament";

const ease = "easeOut" as const;

export default function HeroSection() {
  return (
    <div className="text-center px-6 max-w-2xl mx-auto select-none">
      {/* Üst etiket */}
      <motion.p
        className="text-[11px] tracking-[0.5em] uppercase mb-6"
        style={{ color: "#f0c060", textShadow: "0 0 20px rgba(240,192,96,0.6)" }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.1 }}
      >
        El İşçiliği &amp; Özgün Tasarım
      </motion.p>

      {/* Ana başlık — OBRNHOMEN */}
      <motion.h1
        className="text-4xl sm:text-5xl md:text-7xl font-light tracking-[0.25em] uppercase mb-6"
        style={{ color: "#fff8ed", textShadow: "0 2px 40px rgba(0,0,0,0.8), 0 0 60px rgba(201,168,76,0.4)" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
        }}
        initial="hidden"
        animate="visible"
      >
        {"OBRNHOMEN".split("").map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.h1>

      {/* İslami bölücü */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.4 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.9, ease, delay: 0.85 }}
      >
        <IslamicDivider color="var(--gold)" className="mb-6" />
      </motion.div>

      {/* Alt yazı */}
      <motion.p
        className="text-sm md:text-base leading-relaxed max-w-xs mx-auto"
        style={{ color: "rgba(255,248,237,0.85)", textShadow: "0 1px 12px rgba(0,0,0,0.9)" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 1.1 }}
      >
        Her ürün, özel anlarınız için titizlikle hazırlanmıştır.
      </motion.p>

      {/* Aşağı kaydır göstergesi */}
      <motion.div
        className="mt-14 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
      >
        <span className="text-[9px] tracking-[0.4em] uppercase" style={{ color: "var(--gold)", opacity: 0.6 }}>
          Keşfet
        </span>
        <motion.div
          className="w-px h-10"
          style={{ background: "linear-gradient(to bottom, var(--gold), transparent)" }}
          animate={{ scaleY: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}
