import type { Metadata } from "next";
import Image from "next/image";
import { getAllProducts } from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";
import { PHONE_DISPLAY, STORE_ADDRESS } from "@/lib/storeNav";
import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "Toptan Ürün Kataloğu | OBRNHOMEN",
  description: "Hac/umre kafileleri, mevlüt, cami/dernek ve mağazalar için ürün kodlu toptan kataloğu. Fiyat için WhatsApp'tan teklif alın.",
  alternates: { canonical: "https://obrnhomen.com/toptan/katalog" },
};

/**
 * Yazdırılabilir toptan kataloğu (fiyatsız) — kafile firmalarına, camilere WhatsApp'tan PDF olarak
 * gönderilir. Tarayıcıda "PDF olarak kaydet" ile indirilir.
 */
export default function KatalogPage() {
  const products = getAllProducts();
  const date = new Date().toLocaleDateString("tr-TR", { month: "long", year: "numeric" });

  return (
    <div className="katalog bg-white text-stone-900">
      <style>{`
        @media print {
          header, nav, footer, .no-print, [aria-label="Telefonla sipariş: ${PHONE_DISPLAY}"] { display: none !important; }
          body > div:first-child { display: none !important; }
          .katalog section { break-inside: auto; }
          .katalog .urun { break-inside: avoid; }
          .katalog h2 { break-after: avoid; }
          @page { margin: 12mm; }
        }
      `}</style>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b-2 border-stone-900 pb-5">
          <div>
            <p className="text-[13px] uppercase tracking-[0.2em] text-[#9a7a2c]">Toptan Ürün Kataloğu · {date}</p>
            <h1 className="mt-1 text-3xl font-semibold">OBRNHOMEN</h1>
            <p className="mt-1 text-[14px] text-stone-600">Hac & umre kafileleri, mevlüt, cami/dernek ve mağazalar için</p>
          </div>
          <div className="text-right text-[14px]">
            <p><strong>Toptan fiyat için:</strong> WhatsApp / Telefon {PHONE_DISPLAY}</p>
            <p className="text-stone-600">obrnhomen.com/toptan</p>
            <p className="text-stone-600">{STORE_ADDRESS.line1}, {STORE_ADDRESS.line2}</p>
          </div>
        </div>

        <div className="no-print mb-8 flex flex-wrap items-center gap-3 rounded-lg bg-[#fffbf0] p-4 text-[14px] text-[#5c4710]">
          <PrintButton />
          <span>Açılan pencerede <strong>&ldquo;Hedef: PDF olarak kaydet&rdquo;</strong> seçin. Sipariş verirken ürün kodunu yazmanız yeterli.</span>
        </div>

        {CATEGORIES.map((c) => {
          const list = products.filter((p) => p.category === c.name);
          if (!list.length) return null;
          return (
            <section key={c.slug} className="mb-10">
              <h2 className="mb-4 border-b border-stone-300 pb-2 text-xl font-semibold">
                {c.name} <span className="text-[14px] font-normal text-stone-500">({list.length} ürün)</span>
              </h2>
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
                {list.map((p) => (
                  <div key={p.slug} className="urun">
                    <div className="relative aspect-square overflow-hidden rounded bg-stone-100">
                      {p.images[0] && <Image src={p.images[0]} alt={p.name} fill sizes="160px" className="object-cover" />}
                    </div>
                    <p className="mt-1.5 text-[12px] font-semibold text-stone-900">{p.sku}</p>
                    <p className="line-clamp-3 text-[11px] leading-snug text-stone-700">{p.name}</p>
                    {(p.quantity ?? 1) > 1 && <p className="text-[11px] text-[#9a7a2c]">{p.quantity}&apos;lu paket</p>}
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        <p className="mt-10 border-t pt-4 text-center text-[13px] text-stone-500">
          Fiyatlar adet ve ürün çeşidine göre size özel belirlenir. Teklif için ürün kodlarını ve adetleri WhatsApp&apos;tan gönderin: {PHONE_DISPLAY}
        </p>
      </div>
    </div>
  );
}
