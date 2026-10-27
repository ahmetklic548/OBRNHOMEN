"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";
import { salePrice } from "@/lib/pricing";
import { useCart, cartMeta } from "@/app/components/CartContext";
import { trackAddToCart } from "@/lib/analytics";
import AdminProductTools from "@/app/components/AdminProductTools";

export function formatTL(n: number) {
  return n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₺";
}

/** Ürün kartı — net fiyat (indirim rozeti yok), büyük ve açık "Sepete Ekle" düğmesi */
export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const price = salePrice(product.price);

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    add({ slug: product.slug, name: product.name, price, image: product.images[0] ?? "", ...cartMeta(product) });
    trackAddToCart({ slug: product.slug, name: product.name, price, category: product.category });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group relative flex h-full flex-col">
      <AdminProductTools slug={product.slug} name={product.name} compact />
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-md bg-[#efece6]">
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          )}
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <span className="text-sm text-stone-600">Tükendi</span>
            </div>
          )}
        </div>

        <h3 className="mt-3 line-clamp-2 text-[14px] font-normal leading-snug text-stone-900" style={{ fontFamily: "inherit" }}>
          {product.name}
        </h3>
        <p className="mt-1.5 text-[17px] font-semibold text-stone-900">{formatTL(price)}</p>
        {product.sku && <p className="mt-0.5 text-[11px] text-stone-400">Kod: {product.sku}</p>}
      </Link>

      {product.inStock && (
        <button
          onClick={quickAdd}
          aria-label={`${product.name} sepete ekle`}
          className="mt-3 w-full rounded-md border py-2.5 text-[13px] font-medium transition-colors"
          style={added
            ? { background: "#f0fdf4", borderColor: "#16a34a", color: "#16a34a" }
            : { background: "#0a0a0a", borderColor: "#0a0a0a", color: "#fff" }}
        >
          {added ? "✓ Sepete eklendi" : "Sepete Ekle"}
        </button>
      )}
    </div>
  );
}
