"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import ShinyButton from "./ShinyButton";

interface Props {
  heroImage?: string;
  heroProductName?: string;
}

const BRAND = "OBRNHOMEN";
const ease = [0.25, 0.46, 0.45, 0.94] as const;

function IntroOverlay({ onDone, onSkip }: { onDone: () => void; onSkip: () => void }) {
  const [letterCount, setLetterCount] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  const triggerExit = () => {
    setExiting(true);
    setTimeout(onDone, 700);
  };

  useEffect(() => {
    if (letterCount < BRAND.length) {
      const t = setTimeout(() => setLetterCount(n => n + 1), 90);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setCursorVisible(false);
        setTimeout(triggerExit, 400);
      }, 700);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letterCount]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: "#0a0a0a" }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease }}
        >
          {/* Gold dot above */}
          <motion.div
            className="w-1 h-1 rounded-full mb-10"
            style={{ background: "#c9a84c" }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          />

          {/* Letters */}
          <div className="flex items-center" style={{ gap: "0.08em" }}>
            {BRAND.split("").map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={i < letterCount ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                transition={{ duration: 0.25, ease }}
                style={{
                  fontSize: "clamp(2.2rem, 7vw, 5.5rem)",
                  fontWeight: 300,
                  letterSpacing: "0.35em",
                  color: "#ffffff",
                  display: "inline-block",
                }}
              >
                {letter}
              </motion.span>
            ))}

            {/* Blinking cursor */}
            <AnimatePresence>
              {cursorVisible && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [1, 0, 1] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, repeat: Infinity }}
                  style={{
                    display: "inline-block",
                    width: 3,
                    height: "clamp(2.2rem, 7vw, 5.5rem)",
                    background: "#c9a84c",
                    borderRadius: 2,
                    marginLeft: "0.15em",
                    verticalAlign: "middle",
                  }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={letterCount === BRAND.length ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              marginTop: "1.5rem",
              fontSize: "0.7rem",
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              color: "#86868B",
            }}
          >
            El İşçiliği &amp; Özgün Tasarım
          </motion.p>

          {/* Skip button */}
          <motion.button
            onClick={onSkip}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="absolute bottom-10 right-10 text-[11px] tracking-[0.2em] uppercase transition-opacity hover:opacity-100"
            style={{ color: "#86868B", opacity: 0.5 }}
          >
            Geç →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function HomeHero({ heroImage, heroProductName }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("obrn_intro_seen") === "1") {
      setIntroComplete(true);
    }
  }, []);

  const skipIntro = () => {
    sessionStorage.setItem("obrn_intro_seen", "1");
    setIntroComplete(true);
  };

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY  = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const op    = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <>
      {!introComplete && <IntroOverlay onDone={skipIntro} onSkip={skipIntro} />}

      <section
        ref={ref}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28"
        style={{ background: "#ffffff" }}
      >
        {/* Subtle radial bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 40%, #F5F5F7 0%, #ffffff 70%)",
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
            animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, ease, delay: 0.05 }}
          >
            El İşçiliği &amp; Özgün Tasarım
          </motion.p>

          {/* H1 — letters staggered */}
          <div className="mb-6 overflow-hidden">
            <motion.h1
              className="font-semibold text-center"
              style={{
                fontSize: "clamp(2.8rem, 8vw, 7rem)",
                letterSpacing: "-0.025em",
                lineHeight: 1.04,
                color: "#1D1D1F",
              }}
              initial={{ opacity: 0, y: 40 }}
              animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, ease, delay: 0.15 }}
            >
              Hayatınıza{" "}
              <br className="hidden sm:block" />
              <span style={{ color: "#c9a84c" }}>Değer</span> Katın
            </motion.h1>
          </div>

          {/* Sub */}
          <motion.p
            className="max-w-md mx-auto mb-10 leading-relaxed"
            style={{ color: "#86868B", fontSize: "1.1rem" }}
            initial={{ opacity: 0, y: 20 }}
            animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, ease, delay: 0.28 }}
          >
            Titizlikle hazırlanmış koleksiyonlar,
            özel anlarınız için tasarlandı.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 16 }}
            animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.7, ease, delay: 0.4 }}
          >
            <Link href="/koleksiyon">
              <ShinyButton variant="dark">Koleksiyonu Keşfet</ShinyButton>
            </Link>
            <Link href="/koleksiyon">
              <ShinyButton variant="light">Çok Satanlar</ShinyButton>
            </Link>
          </motion.div>
        </motion.div>

        {/* Product image */}
        {heroImage && (
          <motion.div
            style={{ y: imgY, opacity: op }}
            className="relative z-10 w-full max-w-xl mx-auto px-6"
            initial={{ opacity: 0, scale: 0.93 }}
            animate={introComplete ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.93 }}
            transition={{ duration: 1, ease, delay: 0.45 }}
          >
            <div
              className="relative aspect-square rounded-3xl overflow-hidden"
              style={{
                boxShadow: "0 24px 80px rgba(0,0,0,0.12), 0 8px 30px rgba(0,0,0,0.08)",
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

            {/* Floating badges */}
            <motion.div
              className="absolute -top-4 -right-2 md:-right-8 bg-white rounded-2xl px-5 py-3 apple-shadow"
              initial={{ opacity: 0, x: 20, rotate: 6 }}
              animate={introComplete ? { opacity: 1, x: 0, rotate: 3 } : { opacity: 0, x: 20, rotate: 6 }}
              transition={{ duration: 0.8, delay: 0.9, ease }}
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
              animate={introComplete ? { opacity: 1, x: 0, rotate: -3 } : { opacity: 0, x: -20, rotate: -6 }}
              transition={{ duration: 0.8, delay: 1.05, ease }}
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

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={introComplete ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
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
    </>
  );
}
