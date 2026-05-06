"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface WishlistCtx {
  slugs: string[];
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
}

const WishlistContext = createContext<WishlistCtx | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("obrnhomen-wishlist");
      if (saved) setSlugs(JSON.parse(saved));
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("obrnhomen-wishlist", JSON.stringify(slugs));
  }, [slugs, mounted]);

  const toggle = (slug: string) =>
    setSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );

  const has = (slug: string) => mounted && slugs.includes(slug);

  return (
    <WishlistContext.Provider value={{ slugs, toggle, has }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be inside WishlistProvider");
  return ctx;
}
