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
        className="md:hidden flex flex-col gap-1.5 p-1"
        aria-label="Menü"
      >
        <span className={`block w-6 h-px bg-stone-600 transition-all duration-200 ${open ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`block w-6 h-px bg-stone-600 transition-all duration-200 ${open ? "opacity-0" : ""}`} />
        <span className={`block w-6 h-px bg-stone-600 transition-all duration-200 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-stone-50 border-b border-stone-200 z-40 overflow-hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.18, delay: i * 0.05, ease: "easeOut" as const }}
              >
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-6 py-4 text-xs tracking-widest uppercase text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors border-b border-stone-100"
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
