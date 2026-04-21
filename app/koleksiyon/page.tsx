import { getAllProducts, getAllCategories } from "@/lib/products";
import ProductGrid from "@/app/components/ProductGrid";
import { IslamicStar } from "@/app/components/IslamicOrnament";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Koleksiyon",
  description: "101 el işçiliği ürün — Tesbih, Seccade, Eşarp ve daha fazlası.",
};

export default function KoleksiyonPage() {
  const products = getAllProducts();
  const categories = getAllCategories();

  return (
    <div
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #f9f3ea 0%, #faf5ec 60%, #f5ede0 100%)" }}
    >
      {/* Desen */}
      <div className="absolute inset-0 opacity-[0.06] islamic-pattern pointer-events-none" />

      {/* Sol bordür */}
      <div
        className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none hidden lg:block"
        style={{ background: "linear-gradient(to right, rgba(201,168,76,0.1), transparent)", borderRight: "1px solid rgba(201,168,76,0.15)" }}
      >
        <div className="absolute inset-0 islamic-pattern opacity-25" />
      </div>

      {/* Sağ bordür */}
      <div
        className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none hidden lg:block"
        style={{ background: "linear-gradient(to left, rgba(201,168,76,0.1), transparent)", borderLeft: "1px solid rgba(201,168,76,0.15)" }}
      >
        <div className="absolute inset-0 islamic-pattern opacity-25" />
      </div>

      {/* Sayfa başlığı */}
      <div className="relative z-10 pt-16 pb-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, #c9a84c)" }} />
          <IslamicStar size={18} color="#c9a84c" opacity={0.8} />
          <div className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, #c9a84c)" }} />
        </div>
        <h1 className="text-2xl md:text-3xl font-light tracking-[0.4em] uppercase text-stone-800 mb-2">
          Tüm Koleksiyon
        </h1>
        <p className="text-[10px] tracking-[0.4em] uppercase text-stone-400">
          {products.length} ürün
        </p>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <ProductGrid products={products} categories={categories} />
        <div className="pb-16" />
      </div>
    </div>
  );
}
