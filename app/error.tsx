"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "#1D1D1F" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-12 h-px"
          style={{ background: "#c9a84c" }}
        />

        <h1
          className="text-2xl md:text-3xl font-light tracking-[0.25em] uppercase"
          style={{ color: "#ffffff" }}
        >
          Bir Şeyler Ters Gitti
        </h1>

        <p className="text-sm leading-relaxed max-w-sm" style={{ color: "#86868B" }}>
          Beklenmedik bir hata oluştu. Sayfayı yenilemeyi deneyin ya da ana sayfaya dönün.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button
            onClick={reset}
            className="px-8 py-3 text-xs tracking-[0.2em] uppercase transition-all"
            style={{ background: "#c9a84c", color: "#1D1D1F" }}
          >
            Tekrar Dene
          </button>
          <Link
            href="/"
            className="px-8 py-3 text-xs tracking-[0.2em] uppercase border transition-all hover:border-white"
            style={{ borderColor: "rgba(255,255,255,0.2)", color: "#86868B" }}
          >
            Ana Sayfa
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
