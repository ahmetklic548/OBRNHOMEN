"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
  variant?: "gold" | "dark" | "light";
  onClick?: () => void;
  href?: string;
}

export default function ShinyButton({
  children,
  className,
  variant = "dark",
  onClick,
}: Props) {
  const base =
    "relative inline-flex items-center justify-center overflow-hidden rounded-full px-8 py-3.5 text-sm font-medium tracking-wide transition-all duration-300 select-none";

  const variants = {
    dark: {
      background: "#1D1D1F",
      color: "#ffffff",
      shimmer: "rgba(255,255,255,0.15)",
    },
    gold: {
      background: "#c9a84c",
      color: "#ffffff",
      shimmer: "rgba(255,255,255,0.25)",
    },
    light: {
      background: "#F5F5F7",
      color: "#1D1D1F",
      shimmer: "rgba(255,255,255,0.6)",
    },
  };

  const v = variants[variant];

  return (
    <motion.button
      className={cn(base, className)}
      style={{ background: v.background, color: v.color }}
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Shimmer sweep */}
      <motion.span
        className="pointer-events-none absolute inset-0"
        initial={{ x: "-100%", skewX: -18 }}
        whileHover={{ x: "200%" }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${v.shimmer} 50%, transparent 100%)`,
          width: "60%",
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
