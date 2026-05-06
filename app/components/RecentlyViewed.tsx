"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface RecentItem {
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const KEY = "obrnhomen-recent";
const MAX = 4;

export function trackView(item: RecentItem) {
  try {
    const raw = localStorage.getItem(KEY);
    const list: RecentItem[] = raw ? JSON.parse(raw) : [];
    const filtered = list.filter((i) => i.slug !== item.slug);
    localStorage.setItem(KEY, JSON.stringify([item, ...filtered].slice(0, MAX)));
  } catch {}
}

export default function RecentlyViewed({ currentSlug }: { currentSlug: string }) {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const list: RecentItem[] = JSON.parse(raw);
        setItems(list.filter((i) => i.slug !== currentSlug));
      }
    } catch {}
  }, [currentSlug]);

  if (items.length === 0) return null;

  return (
    <div className="border-t px-6 py-14" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
      <div className="max-w-screen-xl mx-auto">
        <p className="text-[11px] tracking-[0.4em] uppercase font-medium mb-8" style={{ color: "#86868B" }}>
          Son Baktıklarınız
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((p) => (
            <Link key={p.slug} href={`/products/${p.slug}`} className="group">
              <div className="relative aspect-square overflow-hidden mb-3 bg-stone-50 border border-stone-100 group-hover:border-[#c9a84c]/40 transition-colors">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
              <p className="text-[9px] tracking-[0.25em] uppercase mb-1" style={{ color: "#c9a84c" }}>{p.category}</p>
              <p className="text-xs text-stone-700 line-clamp-2 leading-snug">{p.name}</p>
              <p className="text-xs font-medium mt-1" style={{ color: "#1D1D1F" }}>
                {(p.price * 0.8).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
