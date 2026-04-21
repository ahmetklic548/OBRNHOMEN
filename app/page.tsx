import { getFeaturedProducts, getCategoryPreview } from "@/lib/products";
import HomeHero from "@/app/components/HomeHero";
import ValueProps from "@/app/components/ValueProps";
import FeaturedGrid from "@/app/components/FeaturedGrid";
import CategoryStrip from "@/app/components/CategoryStrip";
import CategoryCards from "@/app/components/CategoryCards";

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Full-screen hero ── */}
      <HomeHero />

      {/* ── Value propositions ── */}
      <ValueProps />

      {/* ── Featured products ── */}
      <FeaturedGrid products={featured} />

      {/* ── Category showcase ── */}
      <CategoryCards />

      {/* ── Category strips ── */}
      <div style={{ background: "#f9f9f7" }}>
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-4">
          <CategoryStrip category="Tesbih" products={tesbihler} index={0} />
          <CategoryStrip category="Seccade" products={seccadeler} index={1} />
          <CategoryStrip category="Konsept Hediyelik" products={hediyeler} index={2} />
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <section
        className="py-24 text-center"
        style={{ background: "#0a0906" }}
      >
        <div className="max-w-2xl mx-auto px-6">
          <p className="text-[10px] tracking-[0.6em] uppercase mb-4" style={{ color: "rgba(201,168,76,0.6)" }}>
            OBRNHOMEN
          </p>
          <h2
            className="text-3xl md:text-5xl font-light tracking-[0.25em] uppercase mb-6"
            style={{ color: "#fff8f0" }}
          >
            Hayatınıza Değer Katın
          </h2>
          <div className="flex items-center justify-center gap-5 mb-8">
            <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.5))" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#c9a84c", opacity: 0.7 }} />
            <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(to left, transparent, rgba(201,168,76,0.5))" }} />
          </div>
          <p className="text-sm leading-relaxed mb-10" style={{ color: "rgba(255,248,240,0.45)" }}>
            El işçiliği ile hazırlanmış, özenle seçilmiş ürünlerimizi keşfedin.
          </p>
          <a
            href="/koleksiyon"
            className="inline-block px-12 py-4 text-xs tracking-[0.45em] uppercase transition-all duration-300 hover:opacity-85"
            style={{ background: "#c9a84c", color: "#0a0906" }}
          >
            Alışverişe Başla
          </a>
        </div>
      </section>
    </>
  );
}
