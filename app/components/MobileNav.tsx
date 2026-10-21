"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORY_LINKS, UTILITY_LINKS, WHATSAPP_URL } from "@/lib/storeNav";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="flex flex-col gap-[5px] p-1 md:hidden" aria-label="Menü">
        <span className="block h-px w-5 bg-black" />
        <span className="block h-px w-5 bg-black" />
        <span className="block h-px w-5 bg-black" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-[82%] max-w-sm flex-col overflow-y-auto bg-white md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
                <span className="text-sm uppercase tracking-[0.3em] text-[#7a5c17]">Menü</span>
                <button onClick={close} aria-label="Kapat" className="text-2xl leading-none text-stone-500">
                  ×
                </button>
              </div>
              {CATEGORY_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className="flex items-center justify-between border-b border-stone-100 px-5 py-4 text-sm uppercase text-stone-800"
                >
                  {link.label}
                  <span className="text-stone-400">›</span>
                </Link>
              ))}
              <div className="mt-2 bg-[#f6f4ef] px-5 py-3">
                {UTILITY_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} onClick={close} className="block py-2 text-[13px] text-stone-600">
                    {link.label}
                  </Link>
                ))}
              </div>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="m-5 rounded-full bg-[#25d366] py-3 text-center text-sm font-medium text-white"
              >
                WhatsApp&apos;tan Yazın
              </a>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
