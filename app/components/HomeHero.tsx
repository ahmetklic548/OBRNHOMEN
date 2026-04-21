"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

export default function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY  = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentOp = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-screen min-h-[640px] overflow-hidden flex items-center justify-center"
      style={{ background: "#080705" }}
    >
      {/* ── Animated gold orbs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 65%)",
            filter: "blur(70px)",
          }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.18, 0.28, 0.18] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 65%)",
            filter: "blur(90px)",
          }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        />
      </div>

      {/* ── Subtle grid lines ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,168,76,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.05) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* ── Content ── */}
      <motion.div
        style={{ y: contentY, opacity: contentOp }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        {/* Eyebrow */}
        <motion.p
          className="text-[10px] tracking-[0.7em] uppercase mb-8"
          style={{ color: "rgba(201,168,76,0.65)" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          El İşçiliği &amp; Özgün Tasarım
        </motion.p>

        {/* Main title — letter by letter */}
        <h1
          className="font-light uppercase mb-8 select-none"
          style={{
            fontSize: "clamp(2.8rem, 9vw, 8rem)",
            letterSpacing: "0.25em",
            lineHeight: 1,
            color: "#fff8f0",
          }}
        >
          {"OBRNHOMEN".split("").map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.4 + i * 0.07, ease: "easeOut" }}
            >
              {char}
            </motion.span>
          ))}
        </h1>

        {/* Divider */}
        <motion.div
          className="flex items-center justify-center gap-5 mb-8"
          initial={{ opacity: 0, scaleX: 0.3 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.1, delay: 1.15, ease: "easeOut" }}
        >
          <div className="h-px flex-1 max-w-[100px]" style={{ background: "linear-gradient(to right, transparent, #c9a84c)" }} />
          <div className="flex gap-1.5">
            <span className="w-1 h-1 rounded-full" style={{ background: "#c9a84c", opacity: 0.5 }} />
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#c9a84c" }} />
            <span className="w-1 h-1 rounded-full" style={{ background: "#c9a84c", opacity: 0.5 }} />
          </div>
          <div className="h-px flex-1 max-w-[100px]" style={{ background: "linear-gradient(to left, transparent, #c9a84c)" }} />
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-sm md:text-base leading-relaxed max-w-sm mx-auto mb-12"
          style={{ color: "rgba(255,248,240,0.55)" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          Özel anlarınız için titizlikle hazırlanmış koleksiyonlar
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.7 }}
        >
          <Link
            href="/koleksiyon"
            className="px-10 py-4 text-xs tracking-[0.45em] uppercase text-white transition-all duration-300 hover:opacity-85"
            style={{ background: "#c9a84c" }}
          >
            Koleksiyonu Keşfet
          </Link>
          <a
            href="https://wa.me/905316893849"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 text-xs tracking-[0.45em] uppercase transition-all duration-300 hover:bg-white/5"
            style={{ border: "1px solid rgba(201,168,76,0.35)", color: "rgba(201,168,76,0.75)" }}
          >
            WhatsApp ile İletişim
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-20 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.3 }}
        >
          <span className="text-[8px] tracking-[0.55em] uppercase" style={{ color: "rgba(201,168,76,0.35)" }}>
            Keşfet
          </span>
          <motion.div
            className="w-px h-12"
            style={{ background: "linear-gradient(to bottom, #c9a84c, transparent)" }}
            animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.35, 0.9, 0.35] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 h-36 pointer-events-none"
        style={{ background: "linear-gradient(to top, #f9f9f7, transparent)" }}
      />
    </section>
  );
}
