import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İade Şartları",
  description: "OBRNHOMEN iade ve değişim politikası.",
};

export default function ReturnsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-4">Politika</p>
      <h1 className="text-3xl font-light text-stone-800 mb-12">İade Şartları</h1>

      <div className="space-y-10 text-stone-600 leading-relaxed">
        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-stone-800 mb-3">İade Süresi</h2>
          <p>
            Teslim tarihinden itibaren <strong className="text-stone-800">14 gün</strong> içinde,
            ürünün kullanılmamış ve orijinal ambalajında olması koşuluyla iade talebinde bulunabilirsiniz.
          </p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-stone-800 mb-3">İade Koşulları</h2>
          <ul className="space-y-2">
            {[
              "Ürün orijinal ambalajında ve kullanılmamış olmalıdır.",
              "Hijyen nedeniyle açılmış ürünlerde iade kabul edilmez.",
              "Hediye setlerinde tüm parçaların eksiksiz iade edilmesi gerekmektedir.",
              "İade kargo ücreti alıcıya aittir.",
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="text-stone-300 mt-1">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-stone-800 mb-3">İade Süreci</h2>
          <p>
            İade talebinizi WhatsApp veya e-posta yoluyla bildirmeniz yeterlidir.
            Onaylanan iadeler, ürün tarafımıza ulaştıktan sonra <strong className="text-stone-800">3–5 iş günü</strong> içinde
            ödeme yönteminize iade edilir.
          </p>
        </section>

        <section className="pt-8 border-t border-stone-200">
          <h2 className="text-xs tracking-[0.2em] uppercase text-stone-800 mb-3">İletişim</h2>
          <p className="text-sm">
            İade talepleriniz için WhatsApp üzerinden bizimle iletişime geçebilirsiniz.
          </p>
        </section>
      </div>
    </div>
  );
}
