"use client";

import { motion } from "framer-motion";

const reviews = [
  {
    name: "E. K.",
    stars: 5,
    product: "Çocuk Namaz Seccadesi",
    text: "Gayet güzel, rengi canlı, taşıması kolay. Bordo renkli istedim, o şekilde gönderdiler. Çok memnun kaldım, teşekkür ederim.",
  },
  {
    name: "M. A.",
    stars: 5,
    product: "Lüks Kadife Tesbih",
    text: "Kalitesi inanılmaz, elime aldığımda farkı hissettim. Kutusuna kadar çok özenli hazırlanmış. Hediye olarak aldım, çok beğenildi.",
  },
  {
    name: "H. Y.",
    stars: 5,
    product: "Umre Hediyelik Set",
    text: "Satıcıya çok teşekkür ederim, ince düşünceli davranışlarından dolayı. Yanına küçük sürpriz hediyeler de eklemişler. Zamanında ve hızlı teslim edildi.",
  },
  {
    name: "F. S.",
    stars: 5,
    product: "10'lu Hac Hediyelik Seti",
    text: "Kalitesi mükemmel, çok beğendim. Satıcı çok ilgiliydi, anında cevap verdi. Güvenilir bir satıcı, gönül rahatlığıyla alabilirsiniz. Teşekkürler.",
  },
  {
    name: "A. T.",
    stars: 5,
    product: "Kadife Seccade",
    text: "Eşimle ikimize aldık, bayıldık. Kumaşı da duruşu da çok kaliteli. Gönül rahatlığıyla tavsiye ederim, emeği geçen herkese teşekkür ediyorum.",
  },
  {
    name: "R. D.",
    stars: 5,
    product: "Fermuarlı Kuran-ı Kerim",
    text: "Çok güzel muhafaza edilmiş, sağlam geldi. Satıcı çok ilgili, Kuranı Kerim olduğunu belirterek gönderim yaptı. Sorularımı cevapladı, çok memnun kaldım. Allah razı olsun.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i < count ? "#c9a84c" : "#e5e7eb"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-24 px-6" style={{ background: "#fafaf8" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[9px] tracking-[0.55em] uppercase mb-4" style={{ color: "#c9a84c" }}>
            Müşteri Yorumları
          </p>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 400,
              fontFamily: "var(--font-playfair, 'Playfair Display'), Georgia, serif",
              color: "#0a0a0a",
              lineHeight: 1.1,
            }}
          >
            Gerçek Müşteriler,<br />Gerçek Deneyimler
          </h2>
          <div className="mt-5 h-px" style={{ background: "#e8e8e8" }} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="flex flex-col p-6 bg-white"
              style={{ border: "1px solid #efefef" }}
            >
              <Stars count={r.stars} />
              <p className="text-sm leading-relaxed my-4 flex-1" style={{ color: "#333" }}>
                &ldquo;{r.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: "#efefef" }}>
                <div
                  className="w-8 h-8 flex items-center justify-center text-xs flex-shrink-0"
                  style={{ background: "#0a0a0a", color: "#c9a84c" }}
                >
                  {r.name[0]}
                </div>
                <div>
                  <p className="text-xs font-medium" style={{ color: "#0a0a0a" }}>{r.name}</p>
                  <p className="text-[10px]" style={{ color: "#999" }}>{r.product}</p>
                </div>
                <div className="ml-auto">
                  <span className="text-[8px] tracking-widest uppercase px-2 py-1 border" style={{ borderColor: "#e0e0e0", color: "#999" }}>
                    Trendyol ✓
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary bar */}
        <motion.div
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center">
            <p
              className="mb-1"
              style={{
                fontSize: "2.5rem",
                fontWeight: 400,
                fontFamily: "var(--font-playfair, 'Playfair Display'), Georgia, serif",
                color: "#0a0a0a",
              }}
            >
              4.9
            </p>
            <Stars count={5} />
            <p className="text-[10px] tracking-wide mt-1" style={{ color: "#999" }}>Ortalama Puan</p>
          </div>
          <div className="w-px h-10 hidden sm:block" style={{ background: "#e0e0e0" }} />
          <div className="text-center">
            <p
              style={{
                fontSize: "2.5rem",
                fontWeight: 400,
                fontFamily: "var(--font-playfair, 'Playfair Display'), Georgia, serif",
                color: "#0a0a0a",
              }}
            >
              14K+
            </p>
            <p className="text-[10px] tracking-wide mt-1" style={{ color: "#999" }}>Mutlu Müşteri</p>
          </div>
          <div className="w-px h-10 hidden sm:block" style={{ background: "#e0e0e0" }} />
          <div className="text-center">
            <p
              style={{
                fontSize: "2.5rem",
                fontWeight: 400,
                fontFamily: "var(--font-playfair, 'Playfair Display'), Georgia, serif",
                color: "#0a0a0a",
              }}
            >
              %98
            </p>
            <p className="text-[10px] tracking-wide mt-1" style={{ color: "#999" }}>Memnuniyet Oranı</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
