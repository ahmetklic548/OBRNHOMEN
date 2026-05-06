"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect, startTransition } from "react";

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
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          {/* Thin gold line above */}
          <motion.div
            className="mb-10"
            style={{ width: 32, height: 1, background: "#c9a84c" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />

          {/* Letters */}
          <div className="flex items-center" style={{ gap: "0.12em" }}>
            {BRAND.split("").map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={i < letterCount ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.3, ease }}
                style={{
                  fontSize: "clamp(2rem, 6vw, 4.5rem)",
                  fontWeight: 400,
                  letterSpacing: "0.45em",
                  color: "#ffffff",
                  fontFamily: "var(--font-playfair, 'Playfair Display'), Georgia, serif",
                  display: "inline-block",
                }}
              >
                {letter}
              </motion.span>
            ))}

            <AnimatePresence>
              {cursorVisible && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [1, 0, 1] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, repeat: Infinity }}
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: "clamp(2rem, 6vw, 4.5rem)",
                    background: "#c9a84c",
                    marginLeft: "0.2em",
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
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              marginTop: "1.5rem",
              fontSize: "0.6rem",
              letterSpacing: "0.5em",
              textTransform: "uppercase",
              color: "#444",
            }}
          >
            El İşçiliği &amp; Özgün Tasarım
          </motion.p>

          {/* Skip */}
          <motion.button
            onClick={onSkip}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            whileHover={{ opacity: 0.8 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="absolute bottom-10 right-10 text-[9px] tracking-[0.25em] uppercase"
            style={{ color: "#888" }}
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
      startTransition(() => setIntroComplete(true));
    }
  }, []);

  const skipIntro = () => {
    sessionStorage.setItem("obrn_intro_seen", "1");
    setIntroComplete(true);
  };

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY  = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const op    = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <>
      {!introComplete && <IntroOverlay onDone={skipIntro} onSkip={skipIntro} />}

      <section
        ref={ref}
        className="relative min-h-screen flex items-end overflow-hidden"
        style={{ background: "#fafaf8" }}
      >
        {/* Full-bleed image (right side on desktop, bg on mobile) */}
        {heroImage && (
          <motion.div
            style={{ y: imgY }}
            className="absolute inset-0 md:left-[45%]"
          >
            <Image
              src={heroImage}
              alt={heroProductName ?? "OBRNHOMEN"}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
            />
            {/* Gradient overlay on mobile */}
            <div
              className="absolute inset-0 md:hidden"
              style={{ background: "linear-gradient(to top, rgba(250,250,248,0.95) 0%, rgba(250,250,248,0.4) 60%, transparent 100%)" }}
            />
            {/* Gradient on left edge for desktop */}
            <div
              className="absolute inset-y-0 left-0 w-1/2 hidden md:block"
              style={{ background: "linear-gradient(to right, #fafaf8 0%, transparent 100%)" }}
            />
          </motion.div>
        )}

        {/* Editorial text block — left-aligned, bottom-anchored */}
        <motion.div
          style={{ opacity: op }}
          className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-12 pb-20 md:pb-28 pt-48 md:pt-0 md:w-[52%]"
        >
          {/* Eyebrow */}
          <motion.p
            className="text-[9px] tracking-[0.55em] uppercase mb-8"
            style={{ color: "#c9a84c" }}
            initial={{ opacity: 0, x: -20 }}
            animate={introComplete ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.7, ease, delay: 0.05 }}
          >
            Yeni Koleksiyon — 2025
          </motion.p>

          {/* Headline */}
          <motion.h1
            className="mb-8 font-serif-display"
            style={{
              fontSize: "clamp(3rem, 7vw, 6.5rem)",
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              color: "#0a0a0a",
              fontFamily: "var(--font-playfair, 'Playfair Display'), Georgia, serif",
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.9, ease, delay: 0.15 }}
          >
            Hayatınıza<br />
            <em style={{ fontStyle: "italic", color: "#0a0a0a" }}>Değer</em> Katın
          </motion.h1>

          {/* Rule */}
          <motion.div
            className="mb-8"
            style={{ width: 48, height: 1, background: "#c9a84c" }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={introComplete ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.4 }}
          />

          {/* Sub */}
          <motion.p
            className="mb-10 max-w-sm leading-relaxed text-sm"
            style={{ color: "#666" }}
            initial={{ opacity: 0, y: 16 }}
            animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.7, ease, delay: 0.45 }}
          >
            Titizlikle hazırlanmış koleksiyonlar, özel anlarınız için tasarlandı.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-start gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.7, ease, delay: 0.55 }}
          >
            <Link
              href="/koleksiyon"
              className="inline-block px-8 py-3 text-[10px] tracking-[0.3em] uppercase font-medium transition-all duration-200 hover:opacity-80"
              style={{ background: "#0a0a0a", color: "#ffffff" }}
            >
              Koleksiyonu Keşfet
            </Link>
            <Link
              href="/koleksiyon"
              className="inline-block px-8 py-3 text-[10px] tracking-[0.3em] uppercase font-medium border transition-all duration-200 hover:bg-black hover:text-white"
              style={{ borderColor: "#0a0a0a", color: "#0a0a0a" }}
            >
              Çok Satanlar
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          initial={{ opacity: 0 }}
          animate={introComplete ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          style={{ opacity: op as never }}
        >
          <motion.div
            className="w-px h-10"
            style={{ background: "linear-gradient(to bottom, #c9a84c, transparent)" }}
            animate={{ scaleY: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>
    </>
  );
}
