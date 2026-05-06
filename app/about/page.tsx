import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda | OBRNHOMEN",
  description: "OBRNHOMEN, geleneksel el sanatlarından ilham alan ve modern minimalist estetikle buluşturan özel hediyelik koleksiyonları üretmektedir. Hac, umre ve mevlüt hediyelerinde yerli üretim kalitesi.",
  keywords: ["obrnhomen hakkında", "el işi hediyelik", "hac umre hediyesi marka", "türk el sanatları"],
  openGraph: {
    title: "Hakkımızda | OBRNHOMEN",
    description: "El sanatlarından ilham, modern minimalist estetikle buluşan özel hediyelik koleksiyonları.",
    url: "https://obrnhomen.com/about",
    type: "website",
  },
  alternates: { canonical: "https://obrnhomen.com/about" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Hakkımızda — OBRNHOMEN",
  url: "https://obrnhomen.com/about",
  description: "OBRNHOMEN, hac, umre, mevlüt ve düğün için el işçiliğiyle üretilmiş tesbih, seccade ve özel hediyelik setler sunan Türk markasıdır.",
  publisher: {
    "@type": "Organization",
    name: "OBRNHOMEN",
    url: "https://obrnhomen.com",
    logo: "https://obrnhomen.com/icons/icon.svg",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+905316893849",
      contactType: "customer service",
      availableLanguage: "Turkish",
    },
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: "#fafaf8" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Header */}
      <div className="pt-40 pb-10 px-6 border-b" style={{ borderColor: "#efefef" }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-[9px] tracking-[0.55em] uppercase mb-4" style={{ color: "#c9a84c" }}>
            Marka Hikayesi
          </p>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 400,
              fontFamily: "var(--font-playfair, 'Playfair Display'), Georgia, serif",
              color: "#0a0a0a",
              lineHeight: 1.1,
            }}
          >
            Hakkımızda
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="space-y-8 text-sm leading-relaxed" style={{ color: "#555" }}>
          <p>
            OBRNHOMEN, geleneksel el sanatlarından ilham alan ve modern minimalist estetikle
            buluşturan özel hediye koleksiyonları üretmektedir. Her ürün, özel günlerin anlam
            taşıması gerektiği inancıyla, titizlikle seçilmiş malzemeler kullanılarak tasarlanmaktadır.
          </p>
          <p>
            Hac, umre, mevlüt ve düğün gibi manevi öneme sahip organizasyonlar için hazırlanan
            koleksiyonlarımız; tesbih, seccade, başörtüsü setleri ve el yapımı hediye kitleriyle
            geniş bir yelpazeyi kapsamaktadır.
          </p>
          <p>
            Markamız, kaliteyi asla konfor için feda etmez. Üretim sürecinde her detay
            incelenmekte, yalnızca kalite standartlarını karşılayan ürünler koleksiyonumuza dahil edilmektedir.
          </p>

          <div className="pt-10 border-t" style={{ borderColor: "#efefef" }}>
            <div className="grid grid-cols-3 gap-8 text-center">
              {[
                { value: "198+", label: "Ürün" },
                { value: "%100", label: "Yerli Üretim" },
                { value: "5+", label: "Kategori" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p
                    style={{
                      fontSize: "2rem",
                      fontWeight: 400,
                      fontFamily: "var(--font-playfair, 'Playfair Display'), Georgia, serif",
                      color: "#0a0a0a",
                      lineHeight: 1,
                      marginBottom: "0.4rem",
                    }}
                  >
                    {value}
                  </p>
                  <p className="text-[9px] tracking-[0.35em] uppercase" style={{ color: "#999" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
