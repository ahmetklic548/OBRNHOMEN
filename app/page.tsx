import { getFeaturedProducts, getCategoryPreview } from "@/lib/products";
import HeroSection from "@/app/components/HeroSection";
import Hero3DWrapper from "@/app/components/Hero3DWrapper";
import FeaturedGrid from "@/app/components/FeaturedGrid";
import CategoryStrip from "@/app/components/CategoryStrip";
import { IslamicStar, IslamicInterlude, IslamicGeoBg } from "@/app/components/IslamicOrnament";

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
        <div className="absolute inset-0 opacity-10 islamic-pattern" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(to right, transparent, #c9a84c)" }} />
            <IslamicStar size={22} color="#c9a84c" opacity={0.9} />
            <IslamicStar size={14} color="#ffd700" opacity={0.7} />
            <IslamicStar size={22} color="#c9a84c" opacity={0.9} />
            <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(to left, transparent, #c9a84c)" }} />
          </div>
          <p
            className="text-2xl md:text-3xl mb-4 leading-loose"
            style={{ color: "#f0c060", fontFamily: "Georgia, serif", direction: "rtl" }}
          >
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ
          </p>
          <p className="text-xs tracking-[0.35em] uppercase mb-6" style={{ color: "rgba(240,192,96,0.6)" }}>
            Rahman ve Rahim olan Allah&apos;ın adıyla
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(245,235,215,0.65)" }}>
            Her ürünümüz, kadim el sanatlarının izinde, titizlikle ve sevgiyle hazırlanmıştır.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(to right, transparent, #c9a84c)" }} />
            <IslamicStar size={14} color="#ffd700" opacity={0.7} />
            <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(to left, transparent, #c9a84c)" }} />
          </div>
        </div>
      </section>

      {/* ── Seçilmiş ürünler (Apple-style featured) ── */}
      <FeaturedGrid products={featured} />

      {/* ── Kategori şeritleri ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #faf5ec 0%, #f5ede0 100%)" }}
      >
        <div className="absolute inset-0 opacity-[0.05] islamic-pattern pointer-events-none" />

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

        {/* Büyük arka plan geometrik şekiller */}
        <div className="absolute top-20 left-[-60px] pointer-events-none hidden lg:block" aria-hidden>
          <IslamicGeoBg size={320} color="#c9a84c" opacity={0.055} />
        </div>
        <div className="absolute bottom-40 right-[-60px] pointer-events-none hidden lg:block" aria-hidden>
          <IslamicGeoBg size={260} color="#c9a84c" opacity={0.045} />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" aria-hidden>
          <IslamicGeoBg size={500} color="#c9a84c" opacity={0.022} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-4">
          {/* Ara başlık */}
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.5em] uppercase mb-2" style={{ color: "#c9a84c" }}>
              Kategoriler
            </p>
            <h2 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase text-stone-700">
              Koleksiyondan Seçmeler
            </h2>
          </div>

          <CategoryStrip category="Tesbih" products={tesbihler} index={0} />

          <IslamicInterlude
            quote="سُبْحَانَ اللهِ وَبِحَمْدِهِ"
            translation="Allah'ı hamd ile tesbih ederim"
          />

          <CategoryStrip category="Seccade" products={seccadeler} index={1} />

          <IslamicInterlude
            quote="اللّٰهُمَّ بَارِكْ لَنَا"
            translation="Allah'ım bize bereket ver"
          />

          <CategoryStrip category="Konsept Hediyelik" products={hediyeler} index={2} />
        </div>
      </div>

      {/* ── Alt kapanış bandı ── */}
      <section
        className="relative py-16 text-center overflow-hidden"
        style={{ background: "linear-gradient(180deg, #1a1208 0%, #0c0b08 100%)" }}
      >
        <div className="absolute inset-0 opacity-[0.08] islamic-pattern pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.6), transparent)" }} />

        <div className="relative z-10 max-w-sm mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, #c9a84c)" }} />
            <IslamicStar size={10} color="#c9a84c" opacity={0.6} />
            <IslamicStar size={18} color="#c9a84c" opacity={0.9} />
            <IslamicStar size={10} color="#c9a84c" opacity={0.6} />
            <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, #c9a84c)" }} />
          </div>

          <p className="text-lg tracking-[0.5em] uppercase mb-2" style={{ color: "#c9a84c", fontFamily: "Georgia, serif" }}>
            OBRNHOMEN
          </p>
          <p className="text-[9px] tracking-[0.35em] uppercase mb-6" style={{ color: "rgba(201,168,76,0.5)" }}>
            El İşçiliği &amp; Özgün Tasarım
          </p>

          <div className="h-px mb-4" style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)" }} />

          <p className="text-xs leading-loose mb-4" style={{ color: "rgba(240,192,96,0.5)", fontFamily: "Georgia, serif", direction: "rtl" }}>
            وَمَا تَفْعَلُوا مِنْ خَيْرٍ فَإِنَّ اللَّهَ بِهِ عَلِيمٌ
          </p>
          <p className="text-[9px] tracking-widest" style={{ color: "rgba(245,235,215,0.25)" }}>
            Her iyilik Allah katında bilinir.
          </p>

          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.3))" }} />
            <IslamicStar size={12} color="#c9a84c" opacity={0.4} />
            <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, rgba(201,168,76,0.3))" }} />
          </div>
        </div>
      </section>
    </>
  );
}
