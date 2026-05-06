"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
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
        {/* 404 */}
        <p
          className="text-[120px] md:text-[180px] font-extralight leading-none tracking-[0.1em] select-none"
          style={{ color: "#c9a84c", opacity: 0.15 }}
        >
          404
        </p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-12 h-px"
          style={{ background: "#c9a84c" }}
        />

        <h1
          className="text-2xl md:text-3xl font-light tracking-[0.25em] uppercase"
          style={{ color: "#ffffff" }}
        >
          Sayfa Bulunamadı
        </h1>

        <p className="text-sm leading-relaxed max-w-sm" style={{ color: "#86868B" }}>
          Aradığınız sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link
            href="/"
            className="px-8 py-3 text-xs tracking-[0.2em] uppercase transition-all"
            style={{
              background: "#c9a84c",
              color: "#1D1D1F",
            }}
          >
            Ana Sayfa
          </Link>
          <Link
            href="/koleksiyon"
            className="px-8 py-3 text-xs tracking-[0.2em] uppercase border transition-all hover:border-white"
            style={{
              borderColor: "rgba(255,255,255,0.2)",
              color: "#86868B",
            }}
          >
            Koleksiyonu Gör
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
