import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getProductsByCategory, getProductBySlug, type Product } from "@/lib/products";
import HeroSlider, { type HeroSlide } from "@/app/components/store/HeroSlider";
import ProductCarousel from "@/app/components/store/ProductCarousel";
import Testimonials from "@/app/components/Testimonials";
import IntroSplash from "@/app/components/IntroSplash";
import { INTRO_PREPAINT_SCRIPT } from "@/lib/intro";
import { WHOLESALE_TIERS } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "OBRNHOMEN | El İşi Tesbih, Seccade & Hac Umre Hediyeliği",
  description: "Hac, umre, mevlüt ve düğün için el işçiliğiyle üretilmiş tesbih, seccade ve özel hediyelik setler. 198+ ürün, ücretsiz kargo 1000₺ üzeri, 14 gün iade garantisi.",
  keywords: ["tesbih", "seccade", "hac hediyeliği", "umre hediyeliği", "mevlüt hediyeliği", "hediyelik set", "el işi hediye", "namaz örtüsü", "çeyizlik tesbih", "toplu hediyelik", "ramazan hediyesi", "düğün hediyesi dini", "misvak", "ihram", "obrnhomen"],
  openGraph: {
    title: "OBRNHOMEN | El İşi Tesbih, Seccade & Hac Umre Hediyeliği",
    description: "Hac, umre, mevlüt ve düğün için el işçiliğiyle üretilmiş tesbih, seccade ve özel hediyelik setler.",
    url: "https://obrnhomen.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OBRNHOMEN | El İşi Tesbih, Seccade & Hac Umre Hediyeliği",
    description: "Hac, umre, mevlüt ve düğün için el işçiliğiyle üretilmiş tesbih, seccade ve özel hediyelik setler.",
  },
  alternates: { canonical: "https://obrnhomen.com" },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "OBRNHOMEN",
    url: "https://obrnhomen.com",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: "https://obrnhomen.com/koleksiyon?q={search_term_string}" },
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "OBRNHOMEN",
    url: "https://obrnhomen.com",
    logo: "https://obrnhomen.com/icons/icon.svg",
    image: "https://obrnhomen.com/icons/icon.svg",
    description: "Hac, umre, mevlüt ve düğün için el işçiliğiyle üretilmiş tesbih, seccade ve özel hediyelik setler.",
    telephone: "+905316893849",
    priceRange: "₺₺",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Beyazıt Mah., Mahmutpaşa Yokuşu, Büyük Çorapçı Han D:219/10-1",
      addressLocality: "Fatih",
      addressRegion: "İstanbul",
      postalCode: "34116",
      addressCountry: "TR",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "21:00",
    },
    sameAs: ["https://www.trendyol.com/magaza/obrnhomen"],
  },
  {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "OBRNHOMEN",
    url: "https://obrnhomen.com",
    logo: "https://obrnhomen.com/icons/icon.svg",
    description: "Hac, umre, mevlüt ve düğün için el işçiliğiyle üretilmiş tesbih, seccade ve özel hediyelik setler.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+905316893849",
      contactType: "customer service",
      availableLanguage: "Turkish",
      contactOption: "TollFree",
    },
    sameAs: ["https://www.trendyol.com/magaza/obrnhomen"],
  },
];

const available = (cat: string) => getProductsByCategory(cat).filter((p) => p.inStock && p.images[0]);
const img = (p?: Product) => p?.images[0] ?? "";

/** Kategorilerden sırayla birer ürün alarak karışık "seçtiklerimiz" listesi */
function picksFor(cats: string[], n: number): Product[] {
  const pools = cats.map(available);
  const out: Product[] = [];
  for (let i = 0; out.length < n && pools.some((p) => p[i]); i++) {
    for (const pool of pools) if (pool[i] && out.length < n) out.push(pool[i]);
  }
  return out;
}

const CATEGORY_TILES = [
  { cat: "Konsept Hediyelik", label: "Hediyelik Setler" },
  { cat: "Seccade", label: "Seccade" },
  { cat: "Tesbih", label: "Tesbih" },
  { cat: "İhram", label: "İhram" },
  { cat: "Misvak", label: "Misvak" },
  { cat: "Din Kitabı", label: "Din Kitabı" },
];

const catHref = (cat: string) => `/koleksiyon/${encodeURIComponent(cat)}`;

/** Hero/banner için elle seçilmiş, üzerinde yazı olmayan ortam fotoğrafları */
const imagesOf = (...slugs: string[]) => slugs.map((s) => img(getProductBySlug(s))).filter(Boolean);

const HERO_SLIDES: HeroSlide[] = [
  {
    title: "Sevdiklerinize anlamlı hediyeler",
    subtitle: "Hediyelik Setler",
    href: catHref("Konsept Hediyelik"),
    images: imagesOf(
      "kadife-kapli-yasin-i-serif-ve-tesbih-set-mevlit-kitabi",
      "mini-kuran-tasli-zikirmatik-inci-tesbih-seti-mikro",
      "isimlikli-canta-boy-kadife-kapli-yasini-serif-kitabi-dogum-cenaze",
    ),
  },
  {
    title: "Huzurla kılınan namazlar için",
    subtitle: "Seccade Koleksiyonu",
    href: catHref("Seccade"),
    images: imagesOf(
      "sade-az-desenli-kadife-seccade-namazlik-sik-dokuma-dodya-iplik-goz-yormayan-desen",
      "karma-renk-hic-desensiz-kadife-seccade-namazlik-dodya-imalat-sik-dokuma-sik-550-600-gram",
      "sade-az-desenli-kadife-seccade-namazlik-sik-dokuma-dodya-iplik-goz-yormayan-desen-seccade",
    ),
  },
  {
    title: "Her tanesinde bir zikir",
    subtitle: "Tesbih Çeşitleri",
    href: catHref("Tesbih"),
    images: imagesOf(
      "krem-mini-kuran-inci-tesbih-tasli-zikirmatik-seti",
      "kesede-inci-tesbih-seti",
      "kesede-beyaz-inci-tesbih-allah-lafizli-gold-detayli",
    ),
  },
].filter((s) => s.images.length === 3);

const BULK_BANNER_IMAGES = imagesOf(
  "cam-inci-tesbih-99-luk-namaz-tesbihi-tespih-dagitmalik-ceyiz",
  "karma-simli-goblen-seccade-namazlik-renk-secenekli_2",
  "renkli-namaz-takkesi-41-li-set",
);
const SECCADE_BANNER = getProductBySlug("sade-desensiz-kadife-seccade-namazlik-sik-dokuma-dodya-iplik-goz-yormayan-desen");

export default function Home() {
  const hediyelik = available("Konsept Hediyelik");
  const seccade = available("Seccade");
  const tesbih = available("Tesbih");
  const picks = picksFor(["Konsept Hediyelik", "Seccade", "Tesbih", "İhram", "Misvak", "Eşarp"], 15);

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Açılış animasyonu: bu oturumda görüldüyse ilk boyamadan önce gizle */}
      <script dangerouslySetInnerHTML={{ __html: INTRO_PREPAINT_SCRIPT }} />
      <IntroSplash />

      <h1 className="sr-only">OBRNHOMEN — El İşi Tesbih, Seccade ve Hac Umre Hediyelikleri</h1>

      {/* Toptan alıcılar — ilk ekranda görünsün diye slider'ın üstünde */}
      <section className="bg-[#1a1208] text-white">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:gap-6 md:px-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#e9d48f]">Toptan alıcılar için</p>
            <p className="mt-1 text-[15px] md:text-lg" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              {WHOLESALE_TIERS.map((t) => `${t.min}+ adette %${t.pct}`).join(" · ")} ek indirim
            </p>
          </div>
          <ol className="flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-white/80">
            <li><span className="text-[#e9d48f]">①</span> Ürünlerinizi seçin</li>
            <li><span className="text-[#e9d48f]">②</span> Adetleri girin</li>
            <li><span className="text-[#e9d48f]">③</span> Sepetten toptan fiyat alın</li>
          </ol>
          <Link
            href="/koleksiyon"
            className="self-start bg-[#e9d48f] px-6 py-2.5 text-[12px] uppercase tracking-[0.15em] text-black transition-colors hover:bg-white md:self-auto"
          >
            Toptan Alışverişe Başla
          </Link>
        </div>
      </section>

      <HeroSlider slides={HERO_SLIDES} />

      <TrustBar />

      <ProductCarousel title="Sizin İçin Seçtiklerimiz" products={picks} href="/koleksiyon" />

      {/* Kategori kartları */}
      <section className="pb-12">
        <div className="mx-auto grid max-w-[1500px] grid-cols-3 gap-3 px-4 md:grid-cols-6 md:gap-4 md:px-6">
          {CATEGORY_TILES.map(({ cat, label }) => {
            // "Seçtiklerimiz" ilk ürünü kullanıyor; kartta farklı görsel olsun
            const pool = available(cat);
            const p = pool[2] ?? pool[1] ?? pool[0];
            if (!p) return null;
            return (
              <Link key={cat} href={catHref(cat)} className="group block text-center">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#efece6]">
                  <Image src={img(p)} alt={label} fill sizes="(max-width: 768px) 33vw, 16vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <p className="mt-3 text-[12px] text-stone-800 md:text-[13px]">{label} ›</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Toplu sipariş banner */}
      <section className="relative h-[52vw] max-h-[560px] min-h-[320px] overflow-hidden bg-[#1a1208]">
        <div className="absolute inset-0 grid grid-cols-3 opacity-80">
          {BULK_BANNER_IMAGES.map((src, i) => (
            <div key={i} className="relative">
              <Image src={src} alt="" fill sizes="34vw" className="object-cover" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <p className="mb-3 text-[11px] uppercase tracking-[0.4em] text-[#e9d48f]">Mevlüt · Hac · Umre · Düğün</p>
          <h2 className="text-4xl uppercase leading-none md:text-7xl" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Toplu Hediyelikte
            <br />
            <span className="text-[#e9d48f]">Obrnhomen</span>
          </h2>
          <p className="mt-5 max-w-md text-sm text-white/80">
            Ürünlerinizi seçin, adetleri girin, sepetinizden tek tıkla toptan fiyat alın.
          </p>
          <Link
            href="/koleksiyon"
            className="mt-7 bg-white px-8 py-3 text-[13px] uppercase tracking-[0.15em] text-black transition-colors hover:bg-[#e9d48f]"
          >
            Ürünleri Seç, Fiyat Al
          </Link>
        </div>
      </section>

      <ProductCarousel title="Hediyelik Setler" products={hediyelik.slice(0, 15)} href={catHref("Konsept Hediyelik")} />

      {/* Seccade banner */}
      {SECCADE_BANNER && (
        <section className="mx-auto max-w-[1500px] px-4 md:px-6">
          <Link href={catHref("Seccade")} className="group relative grid overflow-hidden bg-[#2b3a2c] md:grid-cols-2">
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[440px]">
              <Image src={img(SECCADE_BANNER)} alt="Seccade koleksiyonu" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="flex flex-col items-start justify-center gap-4 p-8 text-white md:p-14">
              <p className="text-[11px] uppercase tracking-[0.4em] text-[#e9d48f]">{seccade.length}+ model</p>
              <p className="text-4xl italic leading-tight md:text-6xl" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>
                Seccade koleksiyonunu keşfedin
              </p>
              <span className="mt-2 border-b border-white pb-1 text-[13px] uppercase tracking-[0.15em]">Alışverişe Başla</span>
            </div>
          </Link>
        </section>
      )}

      <ProductCarousel title="Seccade" products={seccade.slice(0, 15)} href={catHref("Seccade")} />
      <ProductCarousel title="Tesbih" products={tesbih.slice(0, 15)} href={catHref("Tesbih")} />

      <Testimonials />
    </>
  );
}

function TrustBar() {
  const items = [
    { t: "Ücretsiz Kargo", d: "1000 ₺ üzeri siparişlerde" },
    { t: "14 Gün İade", d: "İade garantisi" },
    { t: "Güvenli Ödeme", d: "PayTR altyapısı ile" },
    { t: "WhatsApp Destek", d: "Pzt–Cmt 09:00–21:00" },
  ];
  return (
    <section className="border-b border-stone-200 bg-white">
      <div className="mx-auto grid max-w-[1500px] grid-cols-2 gap-y-4 px-4 py-5 md:grid-cols-4 md:px-6">
        {items.map(({ t, d }) => (
          <div key={t} className="text-center">
            <p className="text-[13px] font-semibold uppercase tracking-wide text-stone-900">{t}</p>
            <p className="text-[12px] text-stone-500">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
