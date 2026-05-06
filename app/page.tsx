import Link from "next/link";
import type { Metadata } from "next";
import { getFeaturedProducts, getCategoryPreview, getAllProducts } from "@/lib/products";
import HomeHero from "@/app/components/HomeHero";
import FeaturedGrid from "@/app/components/FeaturedGrid";
import BentoFeatures from "@/app/components/BentoFeatures";
import CategoryCards from "@/app/components/CategoryCards";
import CategoryStrip from "@/app/components/CategoryStrip";
import StatsBar from "@/app/components/StatsBar";
import MarqueeStrip from "@/app/components/MarqueeStrip";
import BestSellers from "@/app/components/BestSellers";
import Testimonials from "@/app/components/Testimonials";

export const metadata: Metadata = {
  title: "OBRNHOMEN | El İşi Tesbih, Seccade & Hac Umre Hediyeliği",
  description: "Hac, umre, mevlüt ve düğün için el işçiliğiyle üretilmiş tesbih, seccade ve özel hediyelik setler. 198+ ürün, ücretsiz kargo 1000₺ üzeri, 14 gün iade garantisi.",
  keywords: ["tesbih", "seccade", "hac hediyeliği", "umre hediyeliği", "mevlüt hediyeliği", "hediyelik set", "el işi hediye", "namaz örtüsü", "obrnhomen"],
  openGraph: {
    title: "OBRNHOMEN | El İşi Tesbih, Seccade & Hac Umre Hediyeliği",
    description: "Hac, umre, mevlüt ve düğün için el işçiliğiyle üretilmiş tesbih, seccade ve özel hediyelik setler.",
    url: "https://obrnhomen.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OBRNHOMEN | El İşi Tesbih, Seccade & Hac Umre Hediyeliği",
    description: "Hac, umre, mevlüt ve düğün için el işçiliğiyle üretilmiş tesbih, seccade ve özel hediyelik setler.",
  },
  alternates: { canonical: "https://obrnhomen.com" },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "OBRNHOMEN",
    url: "https://obrnhomen.com",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: "https://obrnhomen.com/koleksiyon?q={search_term_string}" },
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "OBRNHOMEN",
    url: "https://obrnhomen.com",
    logo: "https://obrnhomen.com/icons/icon.svg",
    description: "Hac, umre, mevlüt ve düğün için el işçiliğiyle üretilmiş tesbih, seccade ve özel hediyelik setler.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mustafa Kemal Paşa Mah. Harbiye Sok. No:7",
      addressLocality: "Arnavutköy",
      addressRegion: "İstanbul",
      addressCountry: "TR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+905316893849",
      contactType: "customer service",
      availableLanguage: "Turkish",
      contactOption: "TollFree",
    },
    sameAs: ["https://www.trendyol.com/magaza/obrnhomen"],
  },
];

export default function Home() {
  const featured   = getFeaturedProducts();
  const tesbihler  = getCategoryPreview("Tesbih", 3);
  const seccadeler = getCategoryPreview("Seccade", 3);
  const hediyeler  = getCategoryPreview("Konsept Hediyelik", 3);
  const marqueeProducts = getAllProducts().filter(p => p.images[0]).slice(0, 14);

  const heroProduct = getAllProducts().find(p => p.slug === "4-lu-basortu-seti-tasli-zikirmatik-inci-tesbih-ceyizlik-seti") ?? featured[0];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* 1 — Hero */}
      <HomeHero
        heroImage={heroProduct?.images[0]}
        heroProductName={heroProduct?.name}
      />

      {/* 2 — Stats */}
      <StatsBar />

      {/* 3 — Featured products */}
      <FeaturedGrid products={featured} />

      {/* 4 — Marquee product strip */}
      <MarqueeStrip products={marqueeProducts} />

      {/* 5 — Bento features */}
      <BentoFeatures />

      {/* 6 — Best sellers from Trendyol data */}
      <BestSellers />

      {/* 7 — Category showcase */}
      <CategoryCards />

      {/* 8 — Category strips */}
      <section className="py-24 px-6" style={{ background: "#f5f0eb" }}>
        <div className="max-w-7xl mx-auto">
          <CategoryStrip category="Tesbih" products={tesbihler} index={0} />
          <CategoryStrip category="Seccade" products={seccadeler} index={1} />
          <CategoryStrip category="Konsept Hediyelik" products={hediyeler} index={2} />
        </div>
      </section>

      {/* 9 — Testimonials */}
      <Testimonials />

      {/* 10 — Bottom CTA */}
      <section className="py-32 px-6 text-center" style={{ background: "#0a0a0a" }}>
        <div className="max-w-2xl mx-auto">
          <p
            className="text-[9px] tracking-[0.55em] uppercase mb-6"
            style={{ color: "#c9a84c" }}
          >
            OBRNHOMEN
          </p>
          <h2
            className="mb-6"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 400,
              fontFamily: "var(--font-playfair, 'Playfair Display'), Georgia, serif",
              color: "#ffffff",
              lineHeight: 1.05,
            }}
          >
            Alışverişe<br />Başlayın
          </h2>
          <div className="mx-auto mb-8" style={{ width: 40, height: 1, background: "#c9a84c" }} />
          <p className="mb-10 text-sm tracking-wide" style={{ color: "#555" }}>
            198+ ürün, güvenli ödeme, hızlı teslimat.
          </p>
          <Link
            href="/koleksiyon"
            className="inline-block px-10 py-3.5 text-[10px] tracking-[0.3em] uppercase font-medium border transition-all duration-200 hover:bg-white hover:text-black"
            style={{ borderColor: "#ffffff", color: "#ffffff" }}
          >
            Tüm Koleksiyonu Gör
          </Link>
        </div>
      </section>
    </>
  );
}
