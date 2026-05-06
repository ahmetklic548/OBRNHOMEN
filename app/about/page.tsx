import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "OBRNHOMEN — el işçiliği ve özgün tasarımla hazırlanan özel hediyeler.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: "#fafaf8" }}>
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
