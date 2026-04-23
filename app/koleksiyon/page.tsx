import { getAllProducts, getAllCategories } from "@/lib/products";
import ProductGrid from "@/app/components/ProductGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Koleksiyon | Tesbih, Seccade, Hediyelik Ürünler",
  description:
    "Tesbih, seccade, hac umre hediyeliği, eşarp ve daha fazlası. El işçiliğiyle üretilmiş 100+ özgün ürün. Hızlı kargo, 14 gün iade garantisi.",
  keywords: [
    "tesbih", "seccade", "hac hediyeliği", "umre hediyeliği",
    "namaz kıyafeti", "ihram", "misvak", "hediyelik set", "mevlüt hediyeliği"
  ],
  openGraph: {
    title: "Koleksiyon | OBRNHOMEN",
    description: "El işçiliğiyle üretilmiş tesbih, seccade ve hediyelik ürünler.",
    url: "https://obrnhomen.com/koleksiyon",
  },
};

export default function KoleksiyonPage() {
  const products = getAllProducts();
  const categories = getAllCategories();

  return (
    <div className="min-h-screen" style={{ background: "#ffffff" }}>
      {/* Header */}
      <div className="pt-36 pb-8 px-6 text-center" style={{ background: "#F5F5F7" }}>
        <p className="text-[10px] tracking-[0.5em] uppercase font-medium mb-3" style={{ color: "#86868B" }}>
          OBRNHOMEN
        </p>
        <h1
          className="font-semibold mb-3"
          style={{
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            letterSpacing: "-0.022em",
            color: "#1D1D1F",
          }}
        >
          Tüm Koleksiyon
        </h1>
        <p className="text-sm" style={{ color: "#86868B" }}>
          {products.length} ürün · Tesbih, Seccade, Hediyelik ve daha fazlası
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <ProductGrid products={products} categories={categories} />
      </div>
    </div>
  );
}
