import type { Metadata } from "next";
import Link from "next/link";
import WholesaleLeadForm from "@/app/components/WholesaleLeadForm";
import { WHATSAPP_URL } from "@/lib/storeNav";

const URL = "https://www.obrnhomen.com/en/wholesale";

export const metadata: Metadata = {
  title: { absolute: "Islamic Gifts Wholesale from Turkey | Prayer Mats, Tasbih, Ramadan & Hajj Gift Sets – OBRNHOMEN" },
  description:
    "Wholesale supplier in Istanbul for prayer mats, tasbih, Qurans, attar, ihram and Ramadan, Eid, Hajj & Umrah gift sets. No minimum total, mixed orders, private label. Get our catalogues by e-mail.",
  keywords: [
    "islamic gifts wholesale", "prayer mat wholesale turkey", "prayer rug wholesale istanbul", "tasbih wholesale supplier",
    "ramadan gift box wholesale", "eid gift sets wholesale", "hajj umrah gifts wholesale", "islamic products supplier turkey",
    "muslim gift wholesale europe", "private label prayer mat",
  ],
  alternates: { canonical: URL, languages: { en: URL, fr: "https://www.obrnhomen.com/fr", "tr-TR": "https://www.obrnhomen.com/toptan" } },
  openGraph: { title: "Islamic Gifts Wholesale from Istanbul – OBRNHOMEN", description: "Prayer mats, tasbih, Qurans and Ramadan, Hajj & Umrah gift sets for shops worldwide.", url: URL, locale: "en_US", type: "website" },
};

const ADIMLAR = [
  ["Get the catalogues", "Fill in the form — our Gift Sets and Single Items catalogues arrive in your inbox."],
  ["Send codes & quantities", "e.g. A-01 x 5, C-02 x 20 on WhatsApp or e-mail. Mixed orders welcome."],
  ["Receive your proforma", "Prices in USD or EUR within 24 hours, with a shipping estimate to your country."],
  ["50% deposit", "We start preparing your order as soon as the deposit arrives."],
  ["Photos, balance, shipping", "You see photos/videos of your goods, pay the balance, and we ship with tracking."],
];

const SSS: [string, string][] = [
  ["Is there a minimum order?", "No minimum total. The minimum is one pack per item (single items can be ordered one by one), so a small trial order is welcome."],
  ["Do you send samples?", "We don't send free samples — instead, start with a small trial order. It works exactly like a normal order."],
  ["Which currencies and payment methods?", "We quote in USD or EUR. Payment is by international bank transfer: 50% deposit, balance before shipment."],
  ["How do you ship?", "Door-to-door express courier, priced by the weight of your order — or we hand the goods to your own forwarder in Istanbul (EXW). Import duties and VAT in your country are paid by the buyer."],
  ["Can you print our logo or names?", "Yes. Name or logo printing and private-label packaging are available for gift sets, boxes and bags."],
  ["Can I choose colours?", "Colours are usually mixed. If you need specific colours, tell us and we will check availability."],
  ["How long does preparation take?", "Ready stock ships within a few days; larger or personalised orders take longer. We confirm the date on your proforma."],
];

export default function WholesalePage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SSS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
  return (
    <div style={{ background: "#fafaf8" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="border-b border-stone-200 px-6 py-14 text-center">
        <p className="text-[12px] uppercase tracking-[0.35em] text-[#9a7a2c]">Wholesale · Istanbul, Türkiye</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-3xl text-stone-900 md:text-5xl" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          Islamic gifts &amp; worship items for your shop
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-relaxed text-stone-600">
          Prayer mats, tasbih, Qurans, attar, ihram and ready Ramadan, Eid, Hajj &amp; Umrah gift sets — supplied directly from Istanbul to shops,
          online stores, travel agencies and mosques worldwide.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a href="#catalogue" className="rounded-md bg-black px-6 py-3.5 text-[15px] font-semibold text-white">Get the catalogues</a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="rounded-md border border-stone-300 bg-white px-6 py-3.5 text-[15px] font-semibold text-stone-900">WhatsApp us</a>
        </div>
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 text-[14px] text-stone-700 sm:grid-cols-4">
          {[["600+", "products"], ["No", "minimum total"], ["USD / EUR", "proforma in 24 h"], ["Private", "label & logo"]].map(([a, b]) => (
            <div key={b} className="rounded-lg border border-stone-200 bg-white p-3"><div className="text-[18px] font-semibold text-stone-900">{a}</div>{b}</div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="mb-6 text-center text-2xl text-stone-900" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>How ordering works</h2>
        <ol className="grid gap-4 md:grid-cols-5">
          {ADIMLAR.map(([b, a], i) => (
            <li key={b} className="rounded-lg border border-stone-200 bg-white p-4 text-[14px] text-stone-600">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-[13px] font-semibold text-white">{i + 1}</div>
              <div className="mb-1 font-semibold text-stone-900">{b}</div>{a}
            </li>
          ))}
        </ol>
      </section>

      <section id="catalogue" className="border-y border-stone-200 bg-white px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl text-stone-900" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>Get our wholesale catalogues</h2>
          <p className="mb-6 mt-2 text-[15px] text-stone-600">Two PDF catalogues — <b>Gift Sets</b> and <b>Single Items</b> — sent to your e-mail in a minute. <Link href="/fr#catalogue" className="underline">Version française</Link></p>
          <WholesaleLeadForm dil="en" />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <h2 className="mb-4 text-2xl text-stone-900" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>Questions</h2>
        {SSS.map(([q, a]) => (
          <details key={q} className="border-b border-stone-200 py-4">
            <summary className="cursor-pointer text-[16px] font-medium text-stone-900">{q}</summary>
            <p className="mt-2 text-[15px] leading-relaxed text-stone-600">{a}</p>
          </details>
        ))}
        <p className="mt-8 text-[15px] text-stone-600">Shopping for yourself? See our <Link href="/en" className="underline">retail shop in English</Link>.</p>
      </section>
    </div>
  );
}
