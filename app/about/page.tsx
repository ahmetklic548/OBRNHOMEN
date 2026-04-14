import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "OBRNHOMEN — el işçiliği ve özgün tasarımla hazırlanan özel hediyeler.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-4">Marka Hikayesi</p>
      <h1 className="text-3xl font-light text-stone-800 mb-12">Hakkımızda</h1>

      <div className="space-y-8 text-stone-600 leading-relaxed">
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

        <div className="pt-8 border-t border-stone-200 grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-2xl font-light text-stone-800 mb-1">198+</p>
            <p className="text-xs tracking-widest uppercase text-stone-400">Ürün</p>
          </div>
          <div>
            <p className="text-2xl font-light text-stone-800 mb-1">%100</p>
            <p className="text-xs tracking-widest uppercase text-stone-400">Yerli Üretim</p>
          </div>
          <div>
            <p className="text-2xl font-light text-stone-800 mb-1">5+</p>
            <p className="text-xs tracking-widest uppercase text-stone-400">Kategori</p>
          </div>
        </div>
      </div>
    </div>
  );
}
