"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";

interface Props {
  heroImage?: string;
  heroProductName?: string;
}

export default function HomeHero({ heroImage, heroProductName }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY  = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const op    = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const ease = [0.25, 0.46, 0.45, 0.94] as const;

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20"
      style={{ background: "#ffffff" }}
    >
      {/* Subtle radial bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #F5F5F7 0%, #ffffff 70%)",
        }}
      />

      <motion.div
        style={{ y: textY, opacity: op }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto w-full"
      >
        {/* Eyebrow */}
        <motion.p
          className="text-[11px] tracking-[0.5em] uppercase mb-6 font-medium"
          style={{ color: "#86868B" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
        >
          El İşçiliği &amp; Özgün Tasarım
        </motion.p>

        {/* H1 */}
        <motion.h1
          className="font-semibold mb-6 text-center"
          style={{
            fontSize: "clamp(2.8rem, 8vw, 7rem)",
            letterSpacing: "-0.025em",
            lineHeight: 1.04,
            color: "#1D1D1F",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease, delay: 0.2 }}
        >
          Hayatınıza <br className="hidden sm:block" />
          <span style={{ color: "#c9a84c" }}>Değer</span> Katın
        </motion.h1>

        {/* Sub */}
        <motion.p
          className="max-w-md mx-auto mb-10 leading-relaxed"
          style={{ color: "#86868B", fontSize: "1.1rem" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.35 }}
        >
          Titizlikle hazırlanmış koleksiyonlar,
          özel anlarınız için tasarlandı.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.5 }}
        >
          <Link
            href="/koleksiyon"
            className="px-8 py-3.5 rounded-full text-sm font-medium tracking-wide text-white transition-all duration-300 hover:scale-105 active:scale-100"
            style={{ background: "#1D1D1F" }}
          >
            Koleksiyonu Keşfet
          </Link>
          <Link
            href="/koleksiyon"
            className="px-8 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 hover:scale-105 active:scale-100"
            style={{
              background: "#F5F5F7",
              color: "#1D1D1F",
            }}
          >
            Çok Satanlar
          </Link>
        </motion.div>
      </motion.div>

      {/* Product image */}
      {heroImage && (
        <motion.div
          style={{ y: imgY, opacity: op }}
          className="relative z-10 w-full max-w-xl mx-auto px-6"
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease, delay: 0.55 }}
        >
          <div
            className="relative aspect-square rounded-3xl overflow-hidden"
            style={{
              boxShadow:
                "0 24px 80px rgba(0,0,0,0.12), 0 8px 30px rgba(0,0,0,0.08)",
            }}
          >
            <Image
              src={heroImage}
              alt={heroProductName ?? "OBRNHOMEN Ürün"}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>

          {/* Floating badge */}
          <motion.div
            className="absolute -top-4 -right-2 md:-right-8 bg-white rounded-2xl px-5 py-3 apple-shadow"
            initial={{ opacity: 0, x: 20, rotate: 6 }}
            animate={{ opacity: 1, x: 0, rotate: 3 }}
            transition={{ duration: 0.8, delay: 1, ease }}
          >
            <p className="text-[10px] tracking-widest uppercase font-medium" style={{ color: "#86868B" }}>
              El İşçiliği
            </p>
            <p className="text-sm font-semibold" style={{ color: "#1D1D1F" }}>
              %100 Özgün
            </p>
          </motion.div>

          <motion.div
            className="absolute -bottom-4 -left-2 md:-left-8 bg-white rounded-2xl px-5 py-3 apple-shadow"
            initial={{ opacity: 0, x: -20, rotate: -6 }}
            animate={{ opacity: 1, x: 0, rotate: -3 }}
            transition={{ duration: 0.8, delay: 1.15, ease }}
          >
            <p className="text-[10px] tracking-widest uppercase font-medium" style={{ color: "#86868B" }}>
              Kargo
            </p>
            <p className="text-sm font-semibold" style={{ color: "#1D1D1F" }}>
              1000 ₺+ Ücretsiz
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Scroll line */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        style={{ opacity: op as never }}
      >
        <motion.div
          className="w-px h-10 rounded-full"
          style={{ background: "linear-gradient(to bottom, #c9a84c, transparent)" }}
          animate={{ scaleY: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
