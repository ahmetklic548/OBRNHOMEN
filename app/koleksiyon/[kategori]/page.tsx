import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllCategories, getProductsByCategory } from "@/lib/products";
import ProductGrid from "@/app/components/ProductGrid";
import type { Metadata } from "next";

const categoryMeta: Record<string, { title: string; description: string; keywords: string[] }> = {
  Tesbih: {
    title: "Tesbih Çeşitleri | El İşi & Hediyelik Tesbih",
    description: "İnci, akik, kuka ve ahşap tesbih modelleri. Hac, umre, mevlüt hediyeliği için özel kutulu tesbihler. Ücretsiz kargo 1000₺ üzeri.",
    keywords: ["tesbih", "hediyelik tesbih", "inci tesbih", "akik tesbih", "kutulu tesbih", "mevlüt tesbih"],
  },
  Seccade: {
    title: "Seccade Modelleri | Kadife & Şipinger Namazlık",
    description: "Kadife, şipinger ve özel desen seccade modelleri. Hac umre hediyeliği için toplu seccade seçenekleri. 14 gün iade garantisi.",
    keywords: ["seccade", "namazlık", "kadife seccade", "şipinger seccade", "hac seccade", "toplu seccade"],
  },
  "Konsept Hediyelik": {
    title: "Konsept Hediyelik Setler | Mevlüt & Hac Umre Hediyeleri",
    description: "Mevlüt, hac, umre, düğün ve kına için özel hediyelik setler. Başörtü, tesbih, zikirmatik kombinasyonları. Toplu sipariş indirimi.",
    keywords: ["hediyelik set", "mevlüt hediyeliği", "hac umre hediyesi", "düğün hediyeliği", "kına hediyeliği"],
  },
  Eşarp: {
    title: "Tesettür Eşarp & Başörtü Modelleri",
    description: "Şifon, pamuk ve kadife eşarp modelleri. Namaz, mevlüt ve günlük kullanım için tesettür başörtüsü çeşitleri.",
    keywords: ["eşarp", "başörtü", "tesettür eşarp", "şifon eşarp", "namaz örtüsü"],
  },
  "Din Kitabı": {
    title: "Dini Kitaplar | Delailü'l Hayrat & Kur'an-ı Kerim",
    description: "Türkçe okunuşlu ve mealli dini kitaplar. Delailü'l Hayrat, Kur'an-ı Kerim ve namaz kitapları. Din eğitimi için ideal.",
    keywords: ["dini kitap", "Delailü'l Hayrat", "Kuran", "namaz kitabı", "din eğitimi"],
  },
  İhram: {
    title: "Erkek İhram Çeşitleri | Hac & Umre İhramı",
    description: "%100 pamuk hac ve umre ihramı. 1250gr kaliteli pamuk kumaş, nefes alabilir yapı. Hac sezonu için stok.",
    keywords: ["ihram", "hac ihramı", "umre ihramı", "erkek ihram", "pamuk ihram"],
  },
  Misvak: {
    title: "Doğal Misvak | Vakumlu & Taze Misvak",
    description: "Doğal ağaç misvakı, vakumlu ambalajda taze. Sünnet olan ağız bakımı için %100 doğal misvak çeşitleri.",
    keywords: ["misvak", "vakumlu misvak", "doğal misvak", "ağız bakımı", "sünnet misvak"],
  },
};

function slugToCategory(slug: string): string {
  return decodeURIComponent(slug);
}

export async function generateStaticParams() {
  return getAllCategories().map((cat) => ({
    kategori: encodeURIComponent(cat),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kategori: string }>;
}): Promise<Metadata> {
  const { kategori } = await params;
  const category = slugToCategory(kategori);
  const meta = categoryMeta[category];
  const products = getProductsByCategory(category);

  if (products.length === 0) return {};

  return {
    title: meta?.title ?? `${category} | OBRNHOMEN`,
    description:
      meta?.description ??
      `${category} kategorisinde ${products.length} ürün. El işçiliğiyle üretilmiş kaliteli ürünler.`,
    keywords: meta?.keywords,
    openGraph: {
      title: meta?.title ?? `${category} | OBRNHOMEN`,
      description: meta?.description,
      url: `https://obrnhomen.com/koleksiyon/${kategori}`,
      images: products[0]?.images[0] ? [{ url: products[0].images[0] }] : [],
    },
  };
}

export default async function KategoriPage({
  params,
}: {
  params: Promise<{ kategori: string }>;
}) {
  const { kategori } = await params;
  const category = slugToCategory(kategori);
  const products = getProductsByCategory(category);

  if (products.length === 0) notFound();

  const meta = categoryMeta[category];

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Anasayfa", item: "https://obrnhomen.com" },
      { "@type": "ListItem", position: 2, name: "Koleksiyon", item: "https://obrnhomen.com/koleksiyon" },
      { "@type": "ListItem", position: 3, name: category, item: `https://obrnhomen.com/koleksiyon/${kategori}` },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: "#ffffff" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 pt-36 pb-2">
        <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase" style={{ color: "#86868B" }}>
          <Link href="/" className="hover:text-black transition-colors">Anasayfa</Link>
          <span>/</span>
          <Link href="/koleksiyon" className="hover:text-black transition-colors">Koleksiyon</Link>
          <span>/</span>
          <span style={{ color: "#1D1D1F" }}>{category}</span>
        </nav>
      </div>

      {/* Header */}
      <div className="pb-8 px-6 pt-4 text-center" style={{ background: "#F5F5F7", marginTop: "1rem" }}>
        <p className="text-[10px] tracking-[0.5em] uppercase font-medium mb-3" style={{ color: "#86868B" }}>
          OBRNHOMEN
        </p>
        <h1
          className="font-semibold mb-3"
          style={{
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            letterSpacing: "-0.022em",
            color: "#1D1D1F",
          }}
        >
          {category}
        </h1>
        <p className="text-sm max-w-lg mx-auto" style={{ color: "#86868B" }}>
          {meta?.description?.split(".")[0] ?? `${products.length} ürün`}
        </p>
        <p className="text-xs mt-2" style={{ color: "#86868B" }}>
          {products.length} ürün
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <ProductGrid products={products} categories={[]} />
      </div>
    </div>
  );
}
