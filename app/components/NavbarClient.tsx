"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AuthButton from "./AuthButton";
import CartButton from "./CartButton";
import MobileNav from "./MobileNav";

export default function NavbarClient() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`transition-all duration-500 ${
        scrolled ? "glass shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl md:text-2xl tracking-[0.3em] uppercase font-light transition-colors duration-300"
          style={{ color: "#1D1D1F", letterSpacing: "0.3em" }}
        >
          OBRNHOMEN
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8">
          {[
            { href: "/koleksiyon", label: "Koleksiyon" },
            { href: "/about",      label: "Hakkımızda" },
            { href: "/returns",    label: "İade" },
            { href: "/payment",    label: "Güvenli Ödeme" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[11px] tracking-[0.15em] uppercase transition-colors duration-200 hover:text-black"
              style={{ color: "#86868B" }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <AuthButton />
          <CartButton />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
