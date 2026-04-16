"use client";
import { useState } from "react";
import { useCart } from "./CartContext";

interface Props {
  slug: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
  waText: string;
}

export default function AddToCartButton({ slug, name, price, image, inStock, waText }: Props) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add({ slug, name, price, image });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!inStock) {
    return (
      <div className="w-full py-4 bg-stone-100 text-stone-400 text-xs tracking-[0.2em] uppercase text-center mb-3">
        Stokta Yok
      </div>
    );
  }

  return (
    <div className="space-y-3 mb-3">
      {/* Sepete Ekle */}
      <button
        onClick={handleAdd}
        className="w-full py-4 border border-stone-900 text-stone-900 text-xs tracking-[0.2em] uppercase text-center hover:bg-stone-900 hover:text-white transition-colors duration-200"
      >
        {added ? "✓ Sepete Eklendi" : "Sepete Ekle"}
      </button>

      {/* Direkt WhatsApp */}
      <a
        href={`https://wa.me/905316893849?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full py-4 bg-stone-900 text-white text-xs tracking-[0.2em] uppercase text-center hover:bg-stone-700 transition-colors duration-200"
      >
        Hemen Sipariş Ver — WhatsApp
      </a>
    </div>
  );
}
