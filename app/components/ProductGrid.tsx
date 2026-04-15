"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";

export default function ProductGrid({
  products,
  categories,
}: {
  products: Product[];
  categories: string[];
}) {
  const [active, setActive] = useState<string | null>(null);

  const filtered = active ? products.filter((p) => p.category === active) : products;

  return (
    <>
      {/* Kategori filtresi */}
      <div className="flex flex-wrap gap-2 justify-center mb-14">
        <button
          onClick={() => setActive(null)}
          className={`px-5 py-2 text-xs tracking-widest uppercase transition-all ${
            active === null
              ? "bg-stone-900 text-white"
              : "border border-stone-300 text-stone-500 hover:border-stone-600 hover:text-stone-700"
          }`}
        >
          Tümü
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat === active ? null : cat)}
            className={`px-5 py-2 text-xs tracking-widest uppercase transition-all ${
              active === cat
                ? "bg-stone-900 text-white"
                : "border border-stone-300 text-stone-500 hover:border-stone-600 hover:text-stone-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Ürün sayısı */}
      <p className="text-xs text-stone-400 tracking-widest uppercase text-center mb-10">
        {filtered.length} ürün
      </p>

      {/* Ürün grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        {filtered.map((product) => (
          <Link key={product.id} href={`/products/${product.slug}`} className="group block">
            {/* Görsel */}
            <div className="aspect-square bg-stone-100 overflow-hidden mb-4 relative">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs tracking-widest uppercase">
                  Görsel Yok
                </div>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
                  <span className="text-xs tracking-widest uppercase text-stone-400">Tükendi</span>
                </div>
              )}
            </div>

            {/* Bilgi */}
            <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-1.5">
              {product.category}
            </p>
            <h2 className="text-sm text-stone-700 leading-snug mb-3 group-hover:text-stone-900 transition-colors line-clamp-2 min-h-[2.6rem]">
              {product.name}
            </h2>
            <p className="text-sm font-medium text-stone-900">
              {product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
