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
      <div className="pt-40 pb-10 px-6" style={{ background: "#fafaf8", borderBottom: "1px solid #efefef" }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-[9px] tracking-[0.55em] uppercase mb-4" style={{ color: "#c9a84c" }}>
            OBRNHOMEN
          </p>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 400,
              fontFamily: "var(--font-playfair, 'Playfair Display'), Georgia, serif",
              color: "#0a0a0a",
              lineHeight: 1.05,
              marginBottom: "0.75rem",
            }}
          >
            Tüm Koleksiyon
          </h1>
          <p className="text-xs tracking-wide" style={{ color: "#999" }}>
            {products.length} ürün · Tesbih, Seccade, Hediyelik ve daha fazlası
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <ProductGrid products={products} categories={categories} />
      </div>
    </div>
  );
}
