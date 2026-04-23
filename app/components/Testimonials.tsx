"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const reviews = [
  {
    name: "E. K.",
    stars: 5,
    product: "Çocuk Namaz Seccadesi",
    text: "Gayet güzel, rengi canlı, taşıması kolay. Ben 2'sini de bordo rica ettim, o şekilde de gönderim sağlandı. Teşekkür ederim.",
    image: "https://cdn.dsmcdn.com/ty1652/product/media/images/prod/QC/20241016/14/ab3c6eca-00b5-3d26-8ea7-26d72e6b0c18/1_org_zoom.jpg",
  },
  {
    name: "M. A.",
    stars: 5,
    product: "Lüks Gölgeli Kuran-ı Kerim",
    text: "Aşık oldum rengine, kokusuna, boyutuna. Benim iyikim.",
    image: "https://cdn.dsmcdn.com/ty1652/product/media/images/prod/QC/20241016/14/ab3c6eca-00b5-3d26-8ea7-26d72e6b0c18/1_org_zoom.jpg",
  },
  {
    name: "H. Y.",
    stars: 5,
    product: "Fermuarlı Çanta Boy Mealli Kuran",
    text: "Satıcıya çok teşekkür ederim ince düşünceli davranışınızdan ve yanındaki güzel hediyelerden. Zamanında ve hızlı teslim edildi.",
    image: "https://cdn.dsmcdn.com/ty1652/product/media/images/prod/QC/20241016/14/ab3c6eca-00b5-3d26-8ea7-26d72e6b0c18/1_org_zoom.jpg",
  },
  {
    name: "F. S.",
    stars: 5,
    product: "10'lu Umre Hac Hediyelik Seti",
    text: "Kalitesi mükemmel harika çok beğendim, satıcı çok ilgiliydi anında cevap verdi ve en küçük hatayı hemen telafi ettiler. Güvenilir, gönül rahatlığıyla alabilirsiniz teşekkürler.",
    image: "https://cdn.dsmcdn.com/ty1652/product/media/images/prod/QC/20241016/14/ab3c6eca-00b5-3d26-8ea7-26d72e6b0c18/1_org_zoom.jpg",
  },
  {
    name: "A. T.",
    stars: 5,
    product: "Kadife Seccade",
    text: "Eşimle ikimize aldık, bayıldık. Kumaşı da duruşu da çok kaliteli. Gönül rahatlığıyla tavsiye ederim, emeği geçen herkese teşekkür ediyorum.",
    image: "https://cdn.dsmcdn.com/ty1652/product/media/images/prod/QC/20241016/14/ab3c6eca-00b5-3d26-8ea7-26d72e6b0c18/1_org_zoom.jpg",
  },
  {
    name: "R. D.",
    stars: 5,
    product: "Türkçe Okunuşlu 5 Özellikli Kuran",
    text: "Çok güzel muhafaza edilmiş, sağlam geldi çok beğendim. Satıcı mükemmel ilgili, Kuranı Kerim olduğunu belirterek gönderim yaptı. Sorularımı cevapladı, çok memnun kaldım. Allah razı olsun.",
    image: "https://cdn.dsmcdn.com/ty1652/product/media/images/prod/QC/20241016/14/ab3c6eca-00b5-3d26-8ea7-26d72e6b0c18/1_org_zoom.jpg",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < count ? "#c9a84c" : "#e5e7eb"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-24 px-6" style={{ background: "#ffffff" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[10px] tracking-[0.5em] uppercase font-medium mb-3" style={{ color: "#c9a84c" }}>
            Müşteri Yorumları
          </p>
          <h2 className="font-semibold" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.022em", color: "#1D1D1F" }}>
            Gerçek Müşteriler,<br />Gerçek Deneyimler
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="flex flex-col p-6 rounded-2xl"
              style={{ background: "#F5F5F7" }}
            >
              <Stars count={r.stars} />
              <p className="text-sm leading-relaxed my-4 flex-1" style={{ color: "#1D1D1F" }}>
                "{r.text}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                  style={{ background: "#1D1D1F", color: "#c9a84c" }}
                >
                  {r.name[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: "#1D1D1F" }}>{r.name}</p>
                  <p className="text-[10px]" style={{ color: "#86868B" }}>{r.product}</p>
                </div>
                <div className="ml-auto">
                  <span className="text-[9px] tracking-widest uppercase px-2 py-1 rounded-full" style={{ background: "#fff", color: "#86868B" }}>
                    Trendyol ✓
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary bar */}
        <motion.div
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center">
            <p className="text-3xl font-semibold" style={{ color: "#1D1D1F" }}>4.9</p>
            <Stars count={5} />
            <p className="text-xs mt-1" style={{ color: "#86868B" }}>Ortalama Puan</p>
          </div>
          <div className="w-px h-12 hidden sm:block" style={{ background: "rgba(0,0,0,0.08)" }} />
          <div className="text-center">
            <p className="text-3xl font-semibold" style={{ color: "#1D1D1F" }}>14K+</p>
            <p className="text-xs mt-1" style={{ color: "#86868B" }}>Mutlu Müşteri</p>
          </div>
          <div className="w-px h-12 hidden sm:block" style={{ background: "rgba(0,0,0,0.08)" }} />
          <div className="text-center">
            <p className="text-3xl font-semibold" style={{ color: "#1D1D1F" }}>%98</p>
            <p className="text-xs mt-1" style={{ color: "#86868B" }}>Memnuniyet Oranı</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
