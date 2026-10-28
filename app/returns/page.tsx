import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İade & Değişim Şartları | OBRNHOMEN",
  description: "OBRNHOMEN'de teslimden itibaren 14 gün içinde ücretsiz iade ve değişim. Anlaşmalı kargo iade koduyla kargo ücreti ödemeden iade edin.",
  openGraph: {
    title: "İade & Değişim Şartları | OBRNHOMEN",
    description: "Teslimden itibaren 14 gün içinde ücretsiz iade ve değişim.",
    url: "https://www.obrnhomen.com/returns",
    type: "website",
  },
  alternates: { canonical: "https://www.obrnhomen.com/returns" },
};

const sections = [
  {
    title: "İade Süresi",
    content: (
      <p>
        Teslim tarihinden itibaren <strong style={{ color: "#0a0a0a" }}>14 gün</strong> içinde,
        ürünün kullanılmamış ve orijinal ambalajında olması koşuluyla iade talebinde bulunabilirsiniz.
      </p>
    ),
  },
  {
    title: "İade Koşulları",
    content: (
      <ul className="space-y-3">
        {[
          "Ürün orijinal ambalajında ve kullanılmamış olmalıdır.",
          "Hijyen nedeniyle açılmış ürünlerde iade kabul edilmez.",
          "Hediye setlerinde tüm parçaların eksiksiz iade edilmesi gerekmektedir.",
          "İade kargo ücreti bize aittir: size verdiğimiz iade koduyla anlaşmalı kargomuza ücretsiz teslim edersiniz.",
          "Kusurlu veya hasarlı gelen ürünlerde de iade/değişim ücretsizdir.",
        ].map((item, i) => (
          <li key={i} className="flex gap-4 text-sm">
            <span className="flex-shrink-0 mt-0.5" style={{ color: "#c9a84c" }}>—</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    title: "İade Süreci",
    content: (
      <p>
        İade talebinizi WhatsApp üzerinden sipariş numaranızla bildirin. Size{" "}
        <strong style={{ color: "#0a0a0a" }}>iade kodu</strong> gönderiyoruz; ürünü bu kodla anlaşmalı
        kargo şubesine <strong style={{ color: "#0a0a0a" }}>ücret ödemeden</strong> teslim edersiniz.
        İsterseniz iade yerine başka bir ürünle değişim de yapabilirsiniz.
        Ürün tarafımıza ulaşıp kontrol edildikten sonra en geç{" "}
        <strong style={{ color: "#0a0a0a" }}>7 gün</strong> içinde ödeme yönteminize iade edilir.
      </p>
    ),
  },
  {
    title: "İletişim",
    content: (
      <p>İade talepleriniz için WhatsApp üzerinden bizimle iletişime geçebilirsiniz.</p>
    ),
  },
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen" style={{ background: "#fafaf8" }}>
      {/* Header */}
      <div className="pt-10 pb-10 px-6 border-b" style={{ borderColor: "#efefef" }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-[9px] tracking-[0.55em] uppercase mb-4" style={{ color: "#c9a84c" }}>
            Politika
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
            İade Şartları
          </h1>
          <p className="mt-4 text-[15px]" style={{ color: "#555" }}>
            14 gün içinde <strong style={{ color: "#0a0a0a" }}>ücretsiz iade</strong> ve değişim.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="space-y-0">
          {sections.map((s, i) => (
            <div
              key={i}
              className="py-10 border-b"
              style={{ borderColor: "#efefef" }}
            >
              <h2 className="text-[9px] tracking-[0.4em] uppercase mb-5" style={{ color: "#0a0a0a" }}>
                {s.title}
              </h2>
              <div className="text-sm leading-relaxed" style={{ color: "#555" }}>
                {s.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
