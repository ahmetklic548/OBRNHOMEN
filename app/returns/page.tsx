import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İade Şartları",
  description: "OBRNHOMEN iade ve değişim politikası.",
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
          "İade kargo ücreti alıcıya aittir.",
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
        İade talebinizi WhatsApp veya e-posta yoluyla bildirmeniz yeterlidir.
        Onaylanan iadeler, ürün tarafımıza ulaştıktan sonra{" "}
        <strong style={{ color: "#0a0a0a" }}>3–5 iş günü</strong> içinde
        ödeme yönteminize iade edilir.
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
      <div className="pt-40 pb-10 px-6 border-b" style={{ borderColor: "#efefef" }}>
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
