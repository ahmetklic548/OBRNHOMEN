"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

/** Toptan Sipariş listesi — normal sepetten ayrı; ödeme yok, WhatsApp'tan fiyat istenir. */
export interface WholesaleItem {
  slug: string;
  name: string;
  /** Site birim fiyatı (salePrice) — sadece liste tutarını göstermek için */
  price: number;
  image: string;
  qty: number;
  code?: string;
  variant?: string;
}

interface WholesaleListCtx {
  items: WholesaleItem[];
  /** Ürünü listede verilen adete ayarlar (yoksa ekler); qty 0 → çıkarır */
  setQty: (item: Omit<WholesaleItem, "qty">, qty: number) => void;
  add: (item: Omit<WholesaleItem, "qty">, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  qtyOf: (slug: string) => number;
  total: number;
  count: number;
  ready: boolean;
}

const STORAGE_KEY = "obrnhomen-toptan";
const MAX_QTY = 10000;

const Ctx = createContext<WholesaleListCtx | null>(null);

export function WholesaleListProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WholesaleItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage yalnızca istemcide okunabilir
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items, ready]);

  const clamp = (n: number) => Math.min(MAX_QTY, Math.max(0, Math.floor(n) || 0));

  const setQty = (item: Omit<WholesaleItem, "qty">, qty: number) => {
    const n = clamp(qty);
    setItems(prev => {
      if (n === 0) return prev.filter(i => i.slug !== item.slug);
      const exists = prev.some(i => i.slug === item.slug);
      return exists
        ? prev.map(i => i.slug === item.slug ? { ...i, ...item, qty: n } : i)
        : [...prev, { ...item, qty: n }];
    });
  };

  const add = (item: Omit<WholesaleItem, "qty">, qty: number) => {
    setItems(prev => {
      const cur = prev.find(i => i.slug === item.slug)?.qty ?? 0;
      const n = clamp(cur + qty);
      return cur
        ? prev.map(i => i.slug === item.slug ? { ...i, ...item, qty: n } : i)
        : [...prev, { ...item, qty: n }];
    });
  };

  const remove = (slug: string) => setItems(prev => prev.filter(i => i.slug !== slug));
  const clear = () => setItems([]);
  const qtyOf = (slug: string) => items.find(i => i.slug === slug)?.qty ?? 0;
  const total = Math.round(items.reduce((s, i) => s + i.price * i.qty, 0) * 100) / 100;
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <Ctx.Provider value={{ items, setQty, add, remove, clear, qtyOf, total, count, ready }}>
      {children}
    </Ctx.Provider>
  );
}

export function useWholesaleList() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWholesaleList must be inside WholesaleListProvider");
  return ctx;
}
