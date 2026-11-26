import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İade & Değişim Şartları | OBRNHOMEN",
  description: "OBRNHOMEN'de teslimden itibaren 14 gün içinde iade ve değişim. İade kargo ücreti alıcıya aittir; kusurlu ürünlerde bizden.",
  openGraph: {
    title: "İade & Değişim Şartları | OBRNHOMEN",
    description: "Teslimden itibaren 14 gün içinde iade ve değişim.",
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
          "İade kargo ücretini alıcı öder (cayma hakkı kullanımında). Ürünü, size WhatsApp'tan ileteceğimiz adrese istediğiniz kargo firmasıyla gönderebilirsiniz.",
          "Kusurlu, hasarlı veya yanlış gönderilen üründe iade/değişim kargosu bize aittir; bu durumda fotoğrafla bize yazmanız yeterli.",
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
        <strong style={{ color: "#0a0a0a" }}>iade adresini</strong> iletiyoruz; ürünü istediğiniz kargo firmasıyla gönderirsiniz.
        <strong style={{ color: "#0a0a0a" }}> İade kargo ücretini alıcı öder</strong> (kusurlu veya yanlış üründe bu ücret bize aittir).
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
            14 gün içinde iade ve değişim. <strong style={{ color: "#0a0a0a" }}>İade kargo ücreti alıcıya aittir</strong> (kusurlu üründe bizden).
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
