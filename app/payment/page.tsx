import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Güvenli Ödeme Yöntemleri | OBRNHOMEN",
  description: "Kredi kartı, banka kartı ve havale ile güvenli alışveriş. 256-bit SSL koruması, kart bilgisi saklanmaz. Seçili bankalarda 3 taksit imkânı.",
  openGraph: {
    title: "Güvenli Ödeme Yöntemleri | OBRNHOMEN",
    description: "256-bit SSL korumalı ödeme. Kredi kartı, EFT ve kapıda ödeme seçenekleri.",
    url: "https://obrnhomen.com/payment",
    type: "website",
  },
  alternates: { canonical: "https://obrnhomen.com/payment" },
};

const sections = [
  {
    title: "Ödeme Yöntemleri",
    content: (
      <ul className="space-y-3">
        {[
          "Kredi kartı ve banka kartı (tüm bankalar)",
          "Havale / EFT",
          "Kapıda ödeme (seçili bölgeler)",
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
    title: "Güvenlik",
    content: (
      <p>
        Tüm ödeme işlemleri <strong style={{ color: "#0a0a0a" }}>256-bit SSL</strong> şifreleme ile
        güvence altındadır. Kart bilgileriniz hiçbir koşulda sistemlerimizde saklanmamaktadır.
      </p>
    ),
  },
  {
    title: "Taksit Seçenekleri",
    content: (
      <p>
        Anlaşmalı bankalar aracılığıyla{" "}
        <strong style={{ color: "#0a0a0a" }}>3&apos;e kadar taksit</strong> imkânı
        sunulmaktadır. Taksit seçenekleri sipariş aşamasında görüntülenir.
      </p>
    ),
  },
];

export default function PaymentPage() {
  return (
    <div className="min-h-screen" style={{ background: "#fafaf8" }}>
      {/* Header */}
      <div className="pt-40 pb-10 px-6 border-b" style={{ borderColor: "#efefef" }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-[9px] tracking-[0.55em] uppercase mb-4" style={{ color: "#c9a84c" }}>
            Bilgi
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
            Güvenli Ödeme
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="space-y-0">
          {sections.map((s, i) => (
            <div key={i} className="py-10 border-b" style={{ borderColor: "#efefef" }}>
              <h2 className="text-[9px] tracking-[0.4em] uppercase mb-5" style={{ color: "#0a0a0a" }}>
                {s.title}
              </h2>
              <div className="text-sm leading-relaxed" style={{ color: "#555" }}>
                {s.content}
              </div>
            </div>
          ))}
        </div>

        {/* Taahhüt kutusu */}
        <div className="mt-10 p-6 border-l-2" style={{ background: "#ffffff", borderColor: "#c9a84c", border: "1px solid #efefef", borderLeft: "2px solid #c9a84c" }}>
          <p className="text-[9px] tracking-[0.4em] uppercase mb-3" style={{ color: "#c9a84c" }}>
            Gizlilik Taahhüdü
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#555" }}>
            Kişisel ve finansal bilgileriniz yalnızca sipariş işlemleri için kullanılır,
            üçüncü taraflarla paylaşılmaz.
          </p>
        </div>
      </div>
    </div>
  );
}
