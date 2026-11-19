import type { Metadata } from "next";
import Link from "next/link";
import { getProductsByCategory } from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";
import { HIDDEN_SLUGS } from "@/lib/productCuration";
import { WHATSAPP_URL, CONTACT_EMAIL, STORE_ADDRESS } from "@/lib/storeNav";

// Yurt dışı müşteriler için İngilizce vitrin. Kargo firması/ücreti henüz sabit değil:
// fiyat ve gönderim ücreti WhatsApp'tan sipariş bazında veriliyor (yanlış vaat yok).
const URL = "https://www.obrnhomen.com/en";

export const metadata: Metadata = {
  title: { absolute: "Islamic Gifts from Istanbul | Prayer Rugs, Tasbih & Hajj Umrah Gift Sets – OBRNHOMEN" },
  description:
    "Buy Islamic gifts directly from Istanbul: prayer rugs, tasbih prayer beads, Quran, ihram, miswak and Hajj & Umrah gift sets. Retail and wholesale, international shipping — get a quote on WhatsApp.",
  keywords: [
    "islamic gifts from turkey", "prayer rug wholesale turkey", "turkish prayer rug", "tasbih wholesale",
    "prayer beads turkey", "hajj umrah gift sets", "umrah gifts wholesale", "ihram towel", "miswak wholesale",
    "quran turkey", "islamic gifts wholesale istanbul",
  ],
  alternates: { canonical: URL, languages: { "tr-TR": "https://www.obrnhomen.com", en: URL } },
  openGraph: {
    title: "Islamic Gifts from Istanbul – OBRNHOMEN",
    description: "Prayer rugs, tasbih, Quran and Hajj & Umrah gift sets. Retail & wholesale, shipped worldwide.",
    url: URL,
    locale: "en_US",
    type: "website",
  },
};

const EN: Record<string, { name: string; text: string }> = {
  "seccade": { name: "Prayer Rugs", text: "Velvet, plush, chenille and embroidered Turkish prayer rugs (sajadah), including plain and large 80×120 cm sizes." },
  "tesbih": { name: "Tasbih / Prayer Beads", text: "Glass pearl, crystal, amber-style and kuka tasbih — 99 and 33 beads, plus 7-bead tawaf counters." },
  "hac-umre-kafile-setleri": { name: "Hajj & Umrah Group Gift Sets", text: "Ready gift sets for 20 to 100 pilgrims: prayer rug, tasbih, Yasin, miswak and more, packed per person." },
  "hediyelik-setler": { name: "Gift Sets", text: "Yasin & tasbih sets, mini Quran sets and scarf sets in organza bags or boxes — for mawlid, weddings and Eid." },
  "kuran-i-kerim": { name: "Holy Quran", text: "Arabic Quran in pocket, medium and large sizes; velvet-covered, boxed and personalised editions." },
  "ihram-hac-malzemeleri": { name: "Ihram & Hajj Essentials", text: "Cotton and bamboo ihram towels (incl. 110×260 cm), children's ihram, ihram belts and unscented soap." },
  "misvak-esans-surme": { name: "Miswak, Attar & Kohl", text: "Vacuum-packed fresh miswak (siwak), alcohol-free attar and kohl — popular giveaways after Umrah." },
  "zikirmatik": { name: "Digital Tasbih Counters", text: "Electronic finger counters and ring-type zikirmatik, single or in packs." },
  "namaz-elbisesi-tesettur": { name: "Women's Prayer Dresses", text: "Two-piece embroidered prayer dresses with attached hijab — easy to wear at home or while travelling." },
  "takke-yuzuk": { name: "Prayer Caps & Rings", text: "Knitted prayer caps (kufi) and stone rings — classic Hajj and Umrah souvenirs." },
};

const waText = encodeURIComponent(
  "Hello OBRNHOMEN, I'm writing from abroad. I'd like a quote (products, quantities and shipping to my country):\n\nCountry:\nProducts:\nQuantity:"
);

export default function EnglishPage() {
  const cats = CATEGORIES.filter((c) => EN[c.slug])
    .map((c) => {
      const products = getProductsByCategory(c.name).filter((p) => !HIDDEN_SLUGS.has(p.slug) && p.images[0]);
      return { c, en: EN[c.slug], count: products.length, img: products[0]?.images[0] };
    })
    .filter((x) => x.count > 0);

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "OBRNHOMEN",
    url: URL,
    description: "Islamic gifts, prayer rugs, tasbih and Hajj & Umrah gift sets from Istanbul. Retail, wholesale and international shipping.",
    email: CONTACT_EMAIL,
    telephone: "+905316893849",
    address: { "@type": "PostalAddress", streetAddress: STORE_ADDRESS.line1, addressLocality: "Fatih, Istanbul", addressCountry: "TR" },
    areaServed: "Worldwide",
  };

  const faqs = [
    { q: "Do you ship outside Turkey?", a: "Yes. Send us your country and the products you want on WhatsApp; we reply with the total price including shipping before you pay." },
    { q: "Can I order wholesale?", a: "Yes. We supply shops, mosques, associations and Hajj & Umrah travel agencies. Wholesale prices are quoted per order on WhatsApp." },
    { q: "How do I pay?", a: "We confirm payment options with your quote. Turkish customers can also pay by card on our Turkish website." },
    { q: "Where are you based?", a: "Our store is in the Grand Bazaar area of Istanbul (Mahmutpaşa, Fatih)." },
  ];
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <div lang="en" className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="bg-[#f6f4ef] px-6 py-14 text-center">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#9a7b2f]">From Istanbul to your door</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-3xl text-stone-900 md:text-5xl" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          Islamic Gifts, Prayer Rugs & Hajj‑Umrah Gift Sets
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-relaxed text-stone-600">
          600+ products from our Istanbul store: Turkish prayer rugs, tasbih, Quran, ihram, miswak and ready gift sets.
          Retail and wholesale orders, shipped worldwide. Tell us what you need and get a full quote — shipping included — on WhatsApp.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href={`${WHATSAPP_URL}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#1f7a4d] px-7 py-3 text-[15px] font-semibold text-white hover:bg-[#186440]"
          >
            Get a quote on WhatsApp
          </a>
          <a href="#categories" className="rounded-full border border-stone-300 bg-white px-7 py-3 text-[15px] font-semibold text-stone-800 hover:border-stone-900">
            Browse products
          </a>
        </div>
        <p className="mt-3 text-[13px] text-stone-500">WhatsApp: +90 531 689 38 49 · {CONTACT_EMAIL}</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-4 text-center sm:grid-cols-3">
          {[
            ["1", "Choose", "Browse the categories below and note the products and quantities you like."],
            ["2", "Get a quote", "Message us on WhatsApp with your country. We send the total incl. shipping."],
            ["3", "Receive", "We pack your order in Istanbul and ship it to your address."],
          ].map(([n, t, d]) => (
            <div key={n} className="rounded-2xl border border-stone-200 p-6">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 text-sm font-semibold text-white">{n}</div>
              <h2 className="mt-3 text-lg font-semibold text-stone-900">{t}</h2>
              <p className="mt-1 text-[14px] text-stone-600">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-6xl px-6 pb-12">
        <h2 className="text-2xl text-stone-900" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>What we offer</h2>
        <p className="mt-1 text-[14px] text-stone-500">Product pages are in Turkish — just send us the link or a screenshot on WhatsApp.</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map(({ c, en, count, img }) => (
            <Link key={c.slug} href={`/koleksiyon/${c.slug}`} className="group overflow-hidden rounded-2xl border border-stone-200 bg-white hover:border-stone-900">
              {img && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt={en.name} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              )}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-stone-900">{en.name}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-stone-600">{en.text}</p>
                <p className="mt-2 text-[13px] font-medium text-[#9a7b2f]">{count} products →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-stone-200 bg-[#f6f4ef]">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <h2 className="text-2xl text-stone-900" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>Frequently asked questions</h2>
          <div className="mt-4 divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
            {faqs.map((f) => (
              <details key={f.q} className="px-4 py-3">
                <summary className="cursor-pointer list-none font-medium text-stone-900">{f.q}</summary>
                <p className="mt-2 text-[15px] text-stone-600">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a
              href={`${WHATSAPP_URL}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-[#1f7a4d] px-7 py-3 text-[15px] font-semibold text-white hover:bg-[#186440]"
            >
              Message us on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
