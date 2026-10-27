import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getProductsByCategory, getProductBySlug, type Product } from "@/lib/products";
import HeroSlider, { type HeroSlide } from "@/app/components/store/HeroSlider";
import ProductCarousel from "@/app/components/store/ProductCarousel";
import Testimonials from "@/app/components/Testimonials";
import IntroSplash from "@/app/components/IntroSplash";
import { INTRO_PREPAINT_SCRIPT } from "@/lib/intro";
import { WHOLESALE_MIN_TOTAL } from "@/lib/pricing";
import { categoryHref } from "@/lib/categories";
import TrendyolBadge from "@/app/components/TrendyolBadge";

export const metadata: Metadata = {
  title: "OBRNHOMEN | El İşi Tesbih, Seccade & Hac Umre Hediyeliği",
  description: "Hac, umre, mevlüt ve düğün için el işçiliğiyle üretilmiş tesbih, seccade ve özel hediyelik setler. 198+ ürün, ücretsiz kargo 2000₺ üzeri, 14 gün iade garantisi.",
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

// Kategori kartları — her biri için elle seçilmiş, yazısız ortam fotoğrafı
const CATEGORY_TILES = [
  { cat: "Hediyelik Setler", label: "Hediyelik Setler", slug: "mini-kuran-tesbih-seti-20-li-mevlut-hediyesi-beyaz" },
  { cat: "Kur'an-ı Kerim", label: "Kur'an-ı Kerim", slug: "30-cuz-kuran-arapca-iri-yazili-kurani-kerim-hatim-seti-cami-boy-ayfa" },
  { cat: "Seccade", label: "Seccade", slug: "5-adet-sade-az-desenli-kadife-seccade-namazlik-sik-dokuma-dodya-iplik-goz-yormayan-desen" },
  { cat: "Tesbih", label: "Tesbih", slug: "10-adet-karma-renk-99-luk-ahsap-namaz-tesbihi-hac-umre-mevlut-ceyiz-bohca-hediyelik-dagitm" },
  { cat: "Namaz Elbisesi & Tesettür", label: "Namaz Elbisesi", slug: "mevsimlik-cift-parca-kadin-tesettur-islemeli-namaz-elbisesi-terletmez-namaz-kiyafeti-bordo" },
  { cat: "Çeyiz & Bohça Setleri", label: "Çeyiz & Bohça", slug: "luks-ceyizlik-kadife-sandikli-kur-an-i-kerim-seccade-tesbih-seti-pleksi-ayracli" },
  { cat: "İhram & Hac Malzemeleri", label: "İhram & Hac", slug: "1250gr-100-pamuk-hac-umre-icin-erkek-ihram" },
  { cat: "Hac Umre Kafile Setleri", label: "Kafile Setleri", slug: "20-kisilik-hac-umre-hediyelik-seti-seccade-yazma-tesbih-takke-esans-yuzuk" },
];

const catHref = (cat: string) => categoryHref(cat);

/** Hero/banner için elle seçilmiş, üzerinde yazı olmayan ortam fotoğrafları */
const imagesOf = (...slugs: string[]) => slugs.map((s) => img(getProductBySlug(s))).filter(Boolean);

// Her karede 3 farklı kategoriden fotoğraf; ilk (aydınlık) kare: namaz elbisesi + seccade + tesbih
const HERO_SLIDES: HeroSlide[] = [
  {
    title: "Huzurla kılınan namazlar için",
    subtitle: "Namaz Elbisesi · Seccade · Tesbih",
    href: catHref("Namaz Elbisesi & Tesettür"),
    images: imagesOf(
      "iki-parcali-tesettur-kadin-pratik-namaz-elbisesi-hac-umre-uygun-cift-parca-pratik-giy-cika",
      "10-adet-tafta-pamuk-osmanli-seccade-namazlik-karma-renk-hac-umre-mevlut-hediyelik-dagitmal",
      "10-adet-bordo-cam-inci-hediyelik-99-lu-vavli-tesbih",
    ),
  },
  {
    title: "Sevdiklerinize anlamlı hediyeler",
    subtitle: "Çeyiz · Kur'an-ı Kerim · Hediyelik Setler",
    href: catHref("Hediyelik Setler"),
    images: imagesOf(
      "luks-ceyizlik-kadife-sandikli-kur-an-i-kerim-seccade-tesbih-seti-pleksi-ayracli",
      "30-cuz-kuran-arapca-iri-yazili-kurani-kerim-hatim-seti-cami-boy-ayfa",
      "mini-kuran-tesbih-seti-20-li-mevlut-hediyesi-altin",
    ),
  },
  {
    title: "Mevlüt, hac ve umre için",
    subtitle: "Tesbih · Seccade · Yasin Setleri",
    href: "/toptan",
    images: imagesOf(
      "10-adet-cam-inci-tesbih-99-luk-namaz-tesbihi-tespih-hac-umre-mevlut-hediyelik-dagitmalik-c",
      "5-adet-karma-yumusak-sik-desensiz-duz-seccade-700-gr-hafif-namazlik",
      "10-adet-hediyelik-jelatinde-kadife-yasin-cuzu-ve-tesbih-seti-mevlit-hac-umre",
    ),
  },
].filter((s) => s.images.length === 3);

const BULK_BANNER_IMAGES = imagesOf(
  "10-adet-tasli-zikirmatik-ve-inci-tesbih-seti-kutulu-mevlut-hac-ve-umre-hediyeligi-karisik",
  "20-kisilik-hac-umre-hediyelik-seti-seccade-yazma-tesbih-takke-esans-yuzuk",
  "mini-kuran-tesbih-seti-20-li-mevlut-hediyesi-altin",
);
const SECCADE_BANNER = getProductBySlug("10-adet-tafta-pamuk-osmanli-seccade-namazlik-karma-renk-hac-umre-mevlut-hediyelik-dagitmal");

export default function Home() {
  const hediyelik = available("Hediyelik Setler");
  const seccade = available("Seccade");
  const tesbih = available("Tesbih");
  const kitap = available("Kur'an-ı Kerim");
  const elbise = available("Namaz Elbisesi & Tesettür");
  const picks = picksFor(["Hediyelik Setler", "Seccade", "Tesbih", "Kur'an-ı Kerim", "Namaz Elbisesi & Tesettür", "Çeyiz & Bohça Setleri"], 15);

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
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#e9d48f]">Toptan sipariş</p>
            <p className="mt-1 text-[15px] md:text-lg" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              Hac/umre kafilesi, mevlüt, cami/dernek veya mağaza mısınız?
            </p>
          </div>
          <ol className="flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-white/80">
            <li><span className="text-[#e9d48f]">①</span> Ürünleri tek tek seçin</li>
            <li><span className="text-[#e9d48f]">②</span> Adetleri yazın</li>
            <li><span className="text-[#e9d48f]">③</span> WhatsApp&apos;tan fiyat alın</li>
          </ol>
          <Link
            href="/toptan"
            className="self-start bg-[#e9d48f] px-6 py-2.5 text-[12px] uppercase tracking-[0.15em] text-black transition-colors hover:bg-white md:self-auto"
          >
            Toptan Sipariş Ver
          </Link>
        </div>
      </section>

      <HeroSlider slides={HERO_SLIDES} />

      <TrustBar />

      <div className="mx-auto flex max-w-[1500px] justify-center px-4 pb-8 md:px-6">
        <TrendyolBadge />
      </div>

      <ProductCarousel title="Sizin İçin Seçtiklerimiz" products={picks} href="/koleksiyon" />

      {/* Kategori kartları */}
      <section className="pb-12">
        <div className="mx-auto grid max-w-[1500px] grid-cols-4 gap-3 px-4 md:grid-cols-8 md:gap-4 md:px-6">
          {CATEGORY_TILES.map(({ cat, label, slug }) => {
            const p = getProductBySlug(slug) ?? available(cat)[0];
            if (!p) return null;
            return (
              <Link key={label} href={catHref(cat)} className="group block text-center">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#efece6]">
                  <Image src={img(p)} alt={label} fill sizes="(max-width: 768px) 25vw, 12vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
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
            Farklı ürünleri istediğiniz adette seçin, listenizi gönderin, size özel toptan fiyatı WhatsApp&apos;tan iletelim.
            <span className="mt-1 block text-[12px] text-white/60">Minimum liste tutarı {WHOLESALE_MIN_TOTAL.toLocaleString("tr-TR")} ₺</span>
          </p>
          <Link
            href="/toptan"
            className="mt-7 bg-white px-8 py-3 text-[13px] uppercase tracking-[0.15em] text-black transition-colors hover:bg-[#e9d48f]"
          >
            Toptan Sipariş Ver
          </Link>
        </div>
      </section>

      <ProductCarousel title="Hediyelik Setler" products={hediyelik.slice(0, 15)} href={catHref("Hediyelik Setler")} />

      {/* Seccade banner */}
      {SECCADE_BANNER && (
        <section className="mx-auto max-w-[1500px] px-4 md:px-6">
          <Link href={catHref("Seccade")} className="group relative grid overflow-hidden bg-[#2b3a2c] md:grid-cols-2">
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[440px]">
              <Image src={img(SECCADE_BANNER)} alt="Seccade koleksiyonu" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="flex flex-col items-start justify-center gap-4 p-8 text-white md:p-14">
              <p className="text-[11px] uppercase tracking-[0.4em] text-[#e9d48f]">{seccade.length}+ model</p>
              <p className="text-3xl font-medium leading-tight md:text-5xl" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                Seccade koleksiyonunu keşfedin
              </p>
              <span className="mt-2 border-b border-white pb-1 text-[13px] uppercase tracking-[0.15em]">Alışverişe Başla</span>
            </div>
          </Link>
        </section>
      )}

      <ProductCarousel title="Seccade" products={seccade.slice(0, 15)} href={catHref("Seccade")} />
      <ProductCarousel title="Tesbih" products={tesbih.slice(0, 15)} href={catHref("Tesbih")} />
      <ProductCarousel title="Namaz Elbisesi" products={elbise.slice(0, 15)} href={catHref("Namaz Elbisesi & Tesettür")} />
      <ProductCarousel title="Kur'an-ı Kerim" products={kitap.slice(0, 15)} href={catHref("Kur'an-ı Kerim")} />

      <Testimonials />
    </>
  );
}

function TrustBar() {
  const items = [
    { t: "Ücretsiz Kargo", d: "2000 ₺ üzeri siparişlerde" },
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
