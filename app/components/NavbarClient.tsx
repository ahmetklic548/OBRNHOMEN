"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AuthButton from "./AuthButton";
import CartButton from "./CartButton";
import MobileNav from "./MobileNav";

export default function NavbarClient() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`transition-all duration-300 ${
        scrolled ? "glass" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg tracking-[0.45em] uppercase transition-opacity duration-200 hover:opacity-70"
          style={{
            color: "#0a0a0a",
            fontFamily: "var(--font-playfair, 'Playfair Display'), Georgia, serif",
            fontWeight: 400,
            letterSpacing: "0.45em",
          }}
        >
          OBRNHOMEN
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-10">
          {[
            { href: "/koleksiyon", label: "Koleksiyon" },
            { href: "/about",      label: "Hakkımızda" },
            { href: "/returns",    label: "İade" },
            { href: "/payment",    label: "Güvenli Ödeme" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[10px] tracking-[0.2em] uppercase transition-colors duration-200 hover:text-black"
              style={{ color: "#666" }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-5">
          <AuthButton />
          <CartButton />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
