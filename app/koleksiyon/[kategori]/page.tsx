import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllCategories, getProductsByCategory } from "@/lib/products";
import ProductGrid from "@/app/components/ProductGrid";
import type { Metadata } from "next";

const categoryMeta: Record<string, { title: string; description: string; keywords: string[] }> = {
  "Kuran & Dini Kitaplar": {
    title: "Kur'an-ı Kerim, Yasin ve Dini Kitaplar | Cep, Orta, Cami Boy",
    description: "Bilgisayar hatlı, mealli, tecvidli Kur'an-ı Kerim; Yasin-i Şerif, Cevşen, Elifba ve dini kitaplar. Mevlüt ve hac umre hediyeliği için toptan fiyat.",
    keywords: ["kuran-ı kerim", "yasin kitabı", "cevşen", "elifba", "mealli kuran", "dini kitap", "toptan yasin"],
  },
  Seccade: {
    title: "Seccade Modelleri | Kadife, Şönil, Simli Goblen Namazlık",
    description: "Kadife, şönil, simli goblen ve cep seccadesi modelleri. Hac umre ve mevlüt hediyeliği için toptan seccade seçenekleri. 14 gün iade.",
    keywords: ["seccade", "namazlık", "kadife seccade", "goblen seccade", "cep seccadesi", "toptan seccade"],
  },
  "Tesbih & Zikirmatik": {
    title: "Tesbih ve Zikirmatik Çeşitleri | İnci, Kristal, Kuka",
    description: "99'luk ve 33'lük inci, kristal, kuka tesbihler; taşlı ve dijital zikirmatikler. Hac, umre, mevlüt hediyeliği için toptan tesbih.",
    keywords: ["tesbih", "zikirmatik", "inci tesbih", "taşlı zikirmatik", "dağıtmalık tesbih", "toptan tesbih"],
  },
  "Hediyelik Setler": {
    title: "Hediyelik Setler | Mevlüt, Hac Umre ve Çeyiz Hediyeleri",
    description: "Yasin ve tesbih setleri, kutulu hediyelikler, hac umre setleri, zemzem takımları. Mevlüt, düğün ve kafile hediyeleri için toptan fiyat.",
    keywords: ["hediyelik set", "mevlüt hediyeliği", "hac umre hediyesi", "çeyiz hediyeliği", "dağıtmalık hediye"],
  },
  "Namaz Elbisesi & Tesettür": {
    title: "Namaz Elbisesi ve Tesettür Giyim | Pratik, Çift Parça",
    description: "Pratik tek parça ve çift parça kadın namaz elbiseleri, hazır bone, kolluk. Hac umre için uygun, terletmeyen kumaşlar.",
    keywords: ["namaz elbisesi", "namaz kıyafeti", "pratik namaz elbisesi", "tesettür", "hazır bone"],
  },
  "Eşarp & Örtü": {
    title: "Eşarp, Tülbent ve Namaz Örtüsü Modelleri",
    description: "Düz flamlı eşarp, tülbent, oyalı namaz ve mevlüt örtüsü, dağıtmalık yazma. Toptan alımda özel fiyat.",
    keywords: ["eşarp", "tülbent", "namaz örtüsü", "mevlüt örtüsü", "yazma", "başörtüsü"],
  },
  "İhram & Hac Umre": {
    title: "İhram ve Hac Umre Malzemeleri | Pamuk & Bambu İhram",
    description: "Pamuk ve bambu ihram, çocuk ihramı, ihram kemeri, kokusuz sabun ve pudra, takke, tavaf patiği. Hac ve umre için eksiksiz malzeme.",
    keywords: ["ihram", "bambu ihram", "çocuk ihramı", "ihram kemeri", "kokusuz sabun", "hac malzemeleri"],
  },
  "Misvak, Esans & Sürme": {
    title: "Misvak, Esans ve Sürme | Hac Umre Dağıtmalık",
    description: "Vakumlu taze misvak, alkolsüz esans paketleri ve göz sürmesi. Hac umre ve mevlüt için dağıtmalık hediyelikler.",
    keywords: ["misvak", "vakumlu misvak", "esans", "alkolsüz esans", "sürme", "dağıtmalık"],
  },
};

function slugToCategory(slug: string): string {
  // Next parametreyi bazen kodlu ("Hediyelik%20Setler"), bazen çözülmüş verir
  try { return decodeURIComponent(slug); } catch { return slug; }
}

// Sadece görünür ürünü olan kategoriler üretilir; boş/bilinmeyen kategori (ör. Eşarp)
// anlık render'da Vercel'de 500 veriyordu — artık doğrudan 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  // Ham ad verilir; URL kodlamasını Next yapar (önceden elle kodlanınca boşluk/&
  // içeren kategoriler dynamicParams=false ile 404 veriyordu)
  return getAllCategories().map((cat) => ({ kategori: cat }));
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
    alternates: { canonical: `https://obrnhomen.com/koleksiyon/${kategori}` },
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
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-2">
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
