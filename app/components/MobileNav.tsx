"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/koleksiyon", label: "Koleksiyon" },
  { href: "/about", label: "Hakkımızda" },
  { href: "/returns", label: "İade" },
  { href: "/payment", label: "Ödeme" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden flex flex-col gap-[5px] p-1"
        aria-label="Menü"
      >
        <span
          className={`block w-5 h-px bg-black transition-all duration-200 ${open ? "rotate-45 translate-y-[6px]" : ""}`}
        />
        <span
          className={`block w-5 h-px bg-black transition-all duration-200 ${open ? "opacity-0" : ""}`}
        />
        <span
          className={`block w-5 h-px bg-black transition-all duration-200 ${open ? "-rotate-45 -translate-y-[6px]" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-black/10 z-40"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12, delay: i * 0.04 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-6 py-4 text-[10px] tracking-[0.25em] uppercase text-black/60 hover:text-black hover:bg-stone-50 transition-colors border-b border-black/5"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
