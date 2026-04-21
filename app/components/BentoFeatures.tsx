"use client";

import { motion } from "framer-motion";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const cards = [
  {
    id: "craft",
    cols: "md:col-span-2",
    bg: "#1D1D1F",
    textColor: "#F5F5F7",
    accentColor: "#c9a84c",
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
      </svg>
    ),
    label: "El İşçiliği",
    title: "Her ürün usta\nellerde doğar",
    desc: "Yüzyıllık geleneksel yöntemlerle, modern estetikle harmanlanmış eşsiz koleksiyonlar.",
  },
  {
    id: "security",
    cols: "md:col-span-1",
    bg: "#F5F5F7",
    textColor: "#1D1D1F",
    accentColor: "#c9a84c",
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    label: "Güvenli Ödeme",
    title: "256-bit SSL\nşifreleme",
    desc: "PayTR altyapısıyla güvenli ödeme.",
  },
  {
    id: "delivery",
    cols: "md:col-span-1",
    bg: "#F5F5F7",
    textColor: "#1D1D1F",
    accentColor: "#c9a84c",
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    label: "Hızlı Kargo",
    title: "1–3 iş günü\nteslimat",
    desc: "1000 ₺ üzeri ücretsiz kargo.",
  },
  {
    id: "return",
    cols: "md:col-span-2",
    bg: "#c9a84c",
    textColor: "#ffffff",
    accentColor: "rgba(255,255,255,0.6)",
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
    label: "Kolay İade",
    title: "14 gün koşulsuz\niade garantisi",
    desc: "Beğenmediyseniz, sorunsuz iade edin. Müşteri memnuniyeti önceliğimizdir.",
  },
];

export default function BentoFeatures() {
  return (
    <section className="py-32 px-6" style={{ background: "#ffffff" }}>
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <p
            className="text-[11px] tracking-[0.5em] uppercase font-medium mb-4"
            style={{ color: "#86868B" }}
          >
            Neden OBRNHOMEN
          </p>
          <h2
            className="font-semibold"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              letterSpacing: "-0.022em",
              color: "#1D1D1F",
            }}
          >
            Farkımız
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              className={`rounded-3xl p-8 flex flex-col justify-between min-h-[220px] ${card.cols}`}
              style={{ background: card.bg }}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease, delay: i * 0.08 }}
              whileHover={{ scale: 1.015, transition: { duration: 0.3 } }}
            >
              {/* Top */}
              <div>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(255,255,255,0.1)", color: card.accentColor }}
                >
                  {card.icon}
                </div>
                <p
                  className="text-[10px] tracking-[0.4em] uppercase font-medium mb-2"
                  style={{ color: card.accentColor, opacity: 0.8 }}
                >
                  {card.label}
                </p>
                <h3
                  className="font-semibold mb-3 whitespace-pre-line"
                  style={{
                    fontSize: "1.35rem",
                    letterSpacing: "-0.018em",
                    lineHeight: 1.2,
                    color: card.textColor,
                  }}
                >
                  {card.title}
                </h3>
              </div>

              {/* Bottom */}
              <p
                className="text-sm leading-relaxed"
                style={{ color: card.textColor, opacity: 0.6 }}
              >
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
