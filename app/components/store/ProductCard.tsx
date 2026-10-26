"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";
import { salePrice, DISCOUNT_PERCENT } from "@/lib/pricing";
import { useCart, cartMeta } from "@/app/components/CartContext";
import { trackAddToCart } from "@/lib/analytics";

export function formatTL(n: number) {
  return n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " TL";
}

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { add } = useCart();
  const price = salePrice(product.price);

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    add({ slug: product.slug, name: product.name, price, image: product.images[0] ?? "", ...cartMeta(product) });
    trackAddToCart({ slug: product.slug, name: product.name, price, category: product.category });
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-[#efece6]">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          />
        )}

        <span className="absolute left-3 top-3 bg-[#d23c3c] px-2 py-0.5 text-[11px] font-semibold text-white">
          -%{DISCOUNT_PERCENT}
        </span>

        {product.inStock ? (
          <button
            onClick={quickAdd}
            aria-label={`${product.name} sepete ekle`}
            className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-transform hover:scale-110"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 8h12l-1 12H7L6 8z" />
              <path d="M9 8V6a3 3 0 016 0v2" />
            </svg>
          </button>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="text-xs uppercase tracking-[0.2em] text-stone-500">Tükendi</span>
          </div>
        )}
      </div>

      <h3 className="mt-3 line-clamp-2 text-[13px] leading-snug text-stone-900" style={{ fontFamily: "inherit" }}>
        {product.name}
      </h3>
      <p className="mt-1 text-[13px]">
        <span className="mr-2 text-stone-400 line-through">{formatTL(product.price)}</span>
        <span className="font-medium text-[#d23c3c]">{formatTL(price)}</span>
      </p>
      <p className="mt-1 text-[11px] text-[#9a7a2c]">10+ adette %5&apos;ten başlayan toptan indirim</p>
    </Link>
  );
}
