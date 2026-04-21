import { getFeaturedProducts, getCategoryPreview } from "@/lib/products";
import HomeHero from "@/app/components/HomeHero";
import FeaturedGrid from "@/app/components/FeaturedGrid";
import BentoFeatures from "@/app/components/BentoFeatures";
import CategoryCards from "@/app/components/CategoryCards";
import CategoryStrip from "@/app/components/CategoryStrip";
import StatsBar from "@/app/components/StatsBar";

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
  const featured   = getFeaturedProducts();
  const tesbihler  = getCategoryPreview("Tesbih", 3);
  const seccadeler = getCategoryPreview("Seccade", 3);
  const hediyeler  = getCategoryPreview("Konsept Hediyelik", 3);

  const heroProduct = featured[0];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1 — Hero */}
      <HomeHero
        heroImage={heroProduct?.images[0]}
        heroProductName={heroProduct?.name}
      />

      {/* 2 — Stats */}
      <StatsBar />

      {/* 3 — Featured products */}
      <FeaturedGrid products={featured} />

      {/* 4 — Bento features */}
      <BentoFeatures />

      {/* 5 — Category showcase */}
      <CategoryCards />

      {/* 6 — Category strips */}
      <section className="py-24 px-6" style={{ background: "#F5F5F7" }}>
        <div className="max-w-6xl mx-auto">
          <CategoryStrip category="Tesbih" products={tesbihler} index={0} />
          <CategoryStrip category="Seccade" products={seccadeler} index={1} />
          <CategoryStrip category="Konsept Hediyelik" products={hediyeler} index={2} />
        </div>
      </section>

      {/* 7 — Bottom CTA */}
      <section className="py-32 px-6 text-center" style={{ background: "#1D1D1F" }}>
        <div className="max-w-2xl mx-auto">
          <p
            className="text-[11px] tracking-[0.5em] uppercase font-medium mb-6"
            style={{ color: "#86868B" }}
          >
            OBRNHOMEN
          </p>
          <h2
            className="font-semibold mb-6"
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              letterSpacing: "-0.022em",
              color: "#ffffff",
            }}
          >
            Alışverişe<br />Başlayın
          </h2>
          <p className="mb-10 text-base" style={{ color: "#86868B" }}>
            198+ ürün, güvenli ödeme, hızlı teslimat.
          </p>
          <a
            href="/koleksiyon"
            className="inline-block px-10 py-4 rounded-full text-sm font-medium tracking-wide transition-all duration-300 hover:scale-105 active:scale-100"
            style={{ background: "#c9a84c", color: "#ffffff" }}
          >
            Tüm Koleksiyonu Gör
          </a>
        </div>
      </section>
    </>
  );
}
