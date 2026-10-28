"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButton from "./AuthButton";
import CartButton from "./CartButton";
import MobileNav from "./MobileNav";
import SearchBar from "./SearchBar";
import FontSizeToggle from "./FontSizeToggle";
import KaabaMark from "./KaabaMark";
import { INSTAGRAM_URL, WHATSAPP_URL, PHONE_DISPLAY, PHONE_HREF } from "@/lib/storeNav";
import { NAV_GROUPS, categoryHref } from "@/lib/categories";

const navItem = "block py-3 text-[14px] tracking-[0.02em] transition-colors hover:text-[#b8902e]";

export default function NavbarClient() {
  const [scrolled, setScrolled] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Başlık küçülünce (~80px) sayfa kayıyor; tek eşik (40px) bu yüzden sürekli aç-kapa yapıp
    // titretiyordu. İki eşik: 140px'te küçül, 20px'in altında büyü.
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled((s) => (s ? y > 20 : y > 140));
    };
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
          <a href={PHONE_HREF} className="hidden items-center gap-2 rounded-full border border-stone-300 px-3 py-1.5 text-[14px] text-stone-800 hover:border-[#9a7a2c] lg:flex" aria-label={`Telefonla sipariş: ${PHONE_DISPLAY}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
            <span><span className="block text-[11px] leading-none text-stone-500">Telefonla sipariş</span><span className="font-semibold">{PHONE_DISPLAY}</span></span>
          </a>
        </div>

        {/* Orta: logo */}
        <Link href="/" className="flex flex-col items-center text-center transition-opacity hover:opacity-80">
          <KaabaMark
            className={`text-[#b8902e] transition-all duration-300 ${scrolled ? "h-0 w-0 md:h-0" : "h-10 w-10 md:h-14 md:w-14"}`}
          />
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
          <FontSizeToggle />
          <AuthButton />
          <CartButton />
        </div>
      </div>

      {/* Kategori menüsü — gruplar; çok kategorili grup üzerine gelince/tıklayınca açılır */}
      <nav className="relative hidden border-y border-stone-200 bg-[#f1efea] md:block" onMouseLeave={() => setOpenGroup(null)}>
        <ul className="mx-auto flex max-w-[1500px] items-center justify-center gap-x-6 px-6 lg:gap-x-8">
          <li>
            <Link href="/koleksiyon" className={`${navItem} ${pathname === "/koleksiyon" ? "text-[#b8902e]" : "text-stone-800"}`}>
              Tüm Ürünler
            </Link>
          </li>
          {NAV_GROUPS.map((g) => {
            const single = g.categories.length === 1 ? g.categories[0] : null;
            const active = g.categories.some((c) => pathname === `/koleksiyon/${c.slug}`);
            const isOpen = openGroup === g.label;
            if (single) {
              return (
                <li key={g.label}>
                  <Link href={`/koleksiyon/${single.slug}`} onMouseEnter={() => setOpenGroup(null)} className={`${navItem} ${active ? "text-[#b8902e]" : "text-stone-800"}`}>
                    {g.label}
                  </Link>
                </li>
              );
            }
            return (
              <li key={g.label} onMouseEnter={() => setOpenGroup(g.label)}>
                <button
                  type="button"
                  onClick={() => setOpenGroup(isOpen ? null : g.label)}
                  aria-expanded={isOpen}
                  className={`${navItem} flex items-center gap-1 ${active || isOpen ? "text-[#b8902e]" : "text-stone-800"}`}
                >
                  {g.label}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {isOpen && (
                  // Panel menü çubuğuna göre ortalanır (öğeye göre ortalayınca kenardan taşıyordu)
                  <div className="absolute inset-x-0 top-full z-40 flex justify-center px-4 pt-1">
                    <div className="flex max-w-full flex-wrap justify-center gap-8 rounded-lg border border-stone-200 bg-white px-7 py-6 shadow-xl">
                      {g.categories.map((c) => (
                        <div key={c.slug} className="min-w-[190px]">
                          <Link href={`/koleksiyon/${c.slug}`} onClick={() => setOpenGroup(null)} className="mb-2.5 block text-[15px] font-semibold text-stone-900 hover:text-[#b8902e]">
                            {c.name} →
                          </Link>
                          <ul className="space-y-1.5">
                            {c.subs.map((s) => (
                              <li key={s}>
                                <Link href={categoryHref(c.name, s)} onClick={() => setOpenGroup(null)} className="block text-[14px] text-stone-600 hover:text-[#b8902e]">
                                  {s}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
          <li>
            {/* Seçili sekme gibi görünmesin: çerçeveli düğme; yalnız /toptan'dayken dolu */}
            <Link
              href="/toptan"
              onMouseEnter={() => setOpenGroup(null)}
              className={`my-1.5 block rounded-full border px-4 py-1.5 text-[14px] tracking-[0.02em] transition-colors ${
                pathname.startsWith("/toptan")
                  ? "border-[#b8902e] bg-[#b8902e] text-white"
                  : "border-[#b8902e] text-[#8a6a1c] hover:bg-[#b8902e] hover:text-white"
              }`}
            >
              Toptan Sipariş
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
