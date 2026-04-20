import { getAllProducts, getAllCategories } from "@/lib/products";
import ProductGrid from "@/app/components/ProductGrid";
import HeroSection from "@/app/components/HeroSection";
import Hero3DWrapper from "@/app/components/Hero3DWrapper";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "OBRNHOMEN",
  url: "https://obrnhomen.com",
  description: "El işçiliği ve özgün tasarımla hazırlanan özel hediyeler.",
  address: { "@type": "PostalAddress", addressCountry: "TR" },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+905316893849",
    contactType: "customer service",
    availableLanguage: "Turkish",
  },
};

export default function Home() {
  const products = getAllProducts();
  const categories = getAllCategories();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Tam ekran hero: 3D sahne + metin katmanı ── */}
      <section className="relative h-screen min-h-[600px] overflow-hidden hero-dark islamic-pattern hero-section">
        {/* Three.js canvas (arka plan) */}
        <div className="absolute inset-0 z-0">
          <Hero3DWrapper />
        </div>

        {/* Üst gradient siperlik — header'la geçişi yumuşatır */}
        <div
          className="absolute inset-x-0 top-0 h-28 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(12,11,8,0.7), transparent)" }}
        />

        {/* Alt gradient siperlik — ürün bölümüne geçişi yumuşatır */}
        <div
          className="absolute inset-x-0 bottom-0 h-40 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to top, #fafaf9, transparent)" }}
        />

        {/* Metin katmanı */}
        <div className="relative z-20 h-full flex items-center justify-center">
          <HeroSection />
        </div>
      </section>

      {/* ── Ürün koleksiyonu ── */}
      <div className="max-w-6xl mx-auto px-6">
        <ProductGrid products={products} categories={categories} />
        <div className="pb-24" />
      </div>
    </>
  );
}
