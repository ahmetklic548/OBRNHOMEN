import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Güvenli Ödeme",
  description: "OBRNHOMEN güvenli ödeme yöntemleri ve politikası.",
};

export default function PaymentPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-4">Bilgi</p>
      <h1 className="text-3xl font-light text-stone-800 mb-12">Güvenli Ödeme</h1>

      <div className="space-y-10 text-stone-600 leading-relaxed">
        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-stone-800 mb-3">Ödeme Yöntemleri</h2>
          <ul className="space-y-2">
            {[
              "Kredi kartı ve banka kartı (tüm bankalar)",
              "Havale / EFT",
              "Kapıda ödeme (seçili bölgeler)",
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="text-stone-300 mt-1">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-stone-800 mb-3">Güvenlik</h2>
          <p>
            Tüm ödeme işlemleri SSL şifreleme ile güvence altındadır. Kart bilgileriniz
            hiçbir koşulda sistemlerimizde saklanmamaktadır.
          </p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-stone-800 mb-3">Taksit Seçenekleri</h2>
          <p>
            Anlaşmalı bankalar aracılığıyla <strong className="text-stone-800">3'e kadar taksit</strong> imkânı
            sunulmaktadır. Taksit seçenekleri sipariş aşamasında görüntülenir.
          </p>
        </section>

        <section className="pt-8 border-t border-stone-200 bg-stone-50 p-6">
          <div className="flex items-start gap-4">
            <div className="text-stone-300 text-2xl mt-0.5">✦</div>
            <div>
              <p className="text-xs tracking-widest uppercase text-stone-800 mb-2">Gizlilik Taahhüdü</p>
              <p className="text-sm">
                Kişisel ve finansal bilgileriniz yalnızca sipariş işlemleri için kullanılır,
                üçüncü taraflarla paylaşılmaz.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
