import { getAllProducts, getAllCategories } from "@/lib/products";
import ProductGrid from "@/app/components/ProductGrid";
import HeroSection from "@/app/components/HeroSection";
import Hero3DWrapper from "@/app/components/Hero3DWrapper";
import { IslamicStar } from "@/app/components/IslamicOrnament";

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

      {/* ── Tam ekran hero ── */}
      <section className="relative h-screen min-h-[600px] overflow-hidden hero-dark islamic-pattern">
        <div className="absolute inset-0 z-0">
          <Hero3DWrapper />
        </div>
        <div
          className="absolute inset-x-0 top-0 h-28 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(12,11,8,0.75), transparent)" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to top, #f9f3ea, transparent)" }}
        />
        <div className="relative z-20 h-full flex items-center justify-center">
          <HeroSection />
        </div>
      </section>

      {/* ── İslami alıntı bandı ── */}
      <section
        className="relative py-14 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a1208 0%, #2d1f0a 50%, #1a1208 100%)" }}
      >
        {/* Arka plan desen */}
        <div className="absolute inset-0 opacity-10 islamic-pattern" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          {/* Üst ornament */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(to right, transparent, #c9a84c)" }} />
            <IslamicStar size={22} color="#c9a84c" opacity={0.9} />
            <IslamicStar size={14} color="#ffd700" opacity={0.7} />
            <IslamicStar size={22} color="#c9a84c" opacity={0.9} />
            <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(to left, transparent, #c9a84c)" }} />
          </div>

          {/* Arapça ibare */}
          <p
            className="text-2xl md:text-3xl mb-4 leading-loose"
            style={{ color: "#f0c060", fontFamily: "Georgia, serif", direction: "rtl" }}
          >
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ
          </p>

          {/* Türkçe karşılık */}
          <p className="text-xs tracking-[0.35em] uppercase mb-6" style={{ color: "rgba(240,192,96,0.6)" }}>
            Rahman ve Rahim olan Allah'ın adıyla
          </p>

          {/* Alt açıklama */}
          <p className="text-sm leading-relaxed" style={{ color: "rgba(245,235,215,0.65)" }}>
            Her ürünümüz, kadim el sanatlarının izinde, titizlikle ve sevgiyle hazırlanmıştır.
          </p>

          {/* Alt ornament */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(to right, transparent, #c9a84c)" }} />
            <IslamicStar size={14} color="#ffd700" opacity={0.7} />
            <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(to left, transparent, #c9a84c)" }} />
          </div>
        </div>
      </section>

      {/* ── Ürün koleksiyonu ── */}
      <div
        className="relative"
        style={{
          background: "linear-gradient(180deg, #f9f3ea 0%, #faf5ec 60%, #f5ede0 100%)",
        }}
      >
        {/* Çok hafif İslami desen overlay */}
        <div className="absolute inset-0 opacity-[0.04] islamic-pattern pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <ProductGrid products={products} categories={categories} />
          <div className="pb-16" />
        </div>
      </div>

      {/* ── Alt kapanış bandı ── */}
      <section
        className="py-10 text-center"
        style={{ background: "#1a1208" }}
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <IslamicStar size={16} color="#c9a84c" opacity={0.7} />
          <p className="text-[10px] tracking-[0.5em] uppercase" style={{ color: "rgba(201,168,76,0.7)" }}>
            OBRNHOMEN — El İşçiliği &amp; Özgün Tasarım
          </p>
          <IslamicStar size={16} color="#c9a84c" opacity={0.7} />
        </div>
        <p className="text-xs" style={{ color: "rgba(245,235,215,0.35)" }}>
          Her ürün bir emek, her hediye bir anlam taşır.
        </p>
      </section>
    </>
  );
}
