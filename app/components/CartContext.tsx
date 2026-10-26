"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { unitPriceFor } from "@/lib/pricing";

export interface CartItem {
  slug: string;
  name: string;
  /** Site birim fiyatı (salePrice) — toptan kademe unitPriceFor ile ayrıca uygulanır */
  price: number;
  image: string;
  qty: number;
}

interface CartCtx {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  total: number;
  count: number;
  /** localStorage'daki sepet okundu mu — okunmadan items boş görünür */
  ready: boolean;
}

const CartContext = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("obrnhomen-cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("obrnhomen-cart", JSON.stringify(items));
  }, [items, mounted]);

  const add = (item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.slug === item.slug);
      if (exists) return prev.map((i) => i.slug === item.slug ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...item, qty }];
    });
  };

  const setQty = (slug: string, qty: number) => {
    const n = Math.min(1000, Math.max(1, Math.floor(qty) || 1));
    setItems((prev) => prev.map((i) => i.slug === slug ? { ...i, qty: n } : i));
  };

  const remove = (slug: string) => setItems((prev) => prev.filter((i) => i.slug !== slug));
  const clear = () => setItems([]);
  // Toptan kademe satır bazında uygulanır
  const total = mounted
    ? Math.round(items.reduce((s, i) => s + unitPriceFor(i.price, i.qty) * i.qty, 0) * 100) / 100
    : 0;
  const count = mounted ? items.reduce((s, i) => s + i.qty, 0) : 0;

  return (
    <CartContext.Provider value={{ items: mounted ? items : [], add, setQty, remove, clear, total, count, ready: mounted }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
