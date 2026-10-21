"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButton from "./AuthButton";
import CartButton from "./CartButton";
import MobileNav from "./MobileNav";
import SearchBar from "./SearchBar";
import { CATEGORY_LINKS, INSTAGRAM_URL, WHATSAPP_URL } from "@/lib/storeNav";

export default function NavbarClient() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`bg-white transition-shadow ${scrolled ? "shadow-[0_2px_12px_rgba(0,0,0,0.06)]" : ""}`}>
      <div
        className={`mx-auto grid max-w-[1500px] grid-cols-[1fr_auto_1fr] items-center px-4 transition-all duration-300 md:px-6 ${
          scrolled ? "py-2" : "py-3 md:py-5"
        }`}
      >
        {/* Sol: mobil menü / sosyal */}
        <div className="flex items-center gap-3">
          <MobileNav />
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hidden md:block">
            <svg width="26" height="26" viewBox="0 0 24 24">
              <defs>
                <linearGradient id="ig" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stopColor="#f9b24b" />
                  <stop offset=".5" stopColor="#e1306c" />
                  <stop offset="1" stopColor="#833ab4" />
                </linearGradient>
              </defs>
              <circle cx="12" cy="12" r="12" fill="url(#ig)" />
              <rect x="6.5" y="6.5" width="11" height="11" rx="3.2" fill="none" stroke="#fff" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="2.6" fill="none" stroke="#fff" strokeWidth="1.5" />
              <circle cx="15.3" cy="8.7" r=".8" fill="#fff" />
            </svg>
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hidden md:block">
            <svg width="26" height="26" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#25d366" />
              <path
                fill="#fff"
                d="M12 5.6a6.3 6.3 0 00-5.4 9.6l-.8 2.9 3-.8A6.3 6.3 0 1012 5.6zm3.1 8.8c-.1.4-.8.7-1.1.8-.3 0-.6.1-2-.5a7 7 0 01-2.7-2.4c-.2-.3-.7-1-.7-1.8s.4-1.2.6-1.4c.1-.2.3-.2.4-.2h.3c.1 0 .2 0 .4.3l.5 1.3c0 .1.1.2 0 .3l-.2.3-.3.3c-.1.1-.2.2 0 .4.1.2.5.9 1.1 1.4.8.7 1.4.9 1.6 1 .2.1.3 0 .4 0l.5-.6c.1-.2.2-.2.4-.1l1.2.6c.2.1.3.1.4.2 0 .1 0 .5-.2.9z"
              />
            </svg>
          </a>
        </div>

        {/* Orta: logo */}
        <Link href="/" className="flex flex-col items-center text-center transition-opacity hover:opacity-80">
          <svg
            viewBox="0 0 64 64"
            className={`text-[#b8902e] transition-all duration-300 ${scrolled ? "h-0 w-0 md:h-0" : "h-8 w-8 md:h-12 md:w-12"}`}
            aria-hidden
          >
            <g fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="14" y="14" width="36" height="36" />
              <rect x="14" y="14" width="36" height="36" transform="rotate(45 32 32)" />
              <circle cx="32" cy="32" r="9" />
            </g>
            <circle cx="32" cy="32" r="3" fill="currentColor" />
          </svg>
          <span
            className="mt-1 text-[15px] uppercase tracking-[0.2em] text-[#7a5c17] md:mr-[-0.32em] md:text-[26px] md:tracking-[0.32em]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Obrnhomen
          </span>
        </Link>

        {/* Sağ: arama, hesap, sepet */}
        <div className="flex items-center justify-end gap-3 md:gap-5">
          <SearchBar />
          <AuthButton />
          <CartButton />
        </div>
      </div>

      {/* Kategori menüsü */}
      <nav className="hidden border-y border-stone-200 bg-[#f1efea] md:block">
        <ul className="mx-auto flex max-w-[1500px] items-center justify-center gap-x-7 px-6 lg:gap-x-9">
          {CATEGORY_LINKS.map(({ href, label }) => {
            const active = decodeURIComponent(pathname) === decodeURIComponent(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`block py-3 text-[13px] uppercase tracking-[0.04em] transition-colors hover:text-[#b8902e] lg:text-sm ${
                    active ? "text-[#b8902e]" : "text-stone-800"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
