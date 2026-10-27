import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductsByCategory, toCard } from "@/lib/products";
import { CATEGORIES, categoryBySlug } from "@/lib/categories";
import ProductGrid from "@/app/components/ProductGrid";
import type { Metadata } from "next";

// Kategori adresleri sade slug: /koleksiyon/kuran-i-kerim (data/categories.json).
// Eski ad-tabanlı adresler next.config.ts'teki yönlendirmelerle buraya gelir.
export const dynamicParams = false;

export async function generateStaticParams() {
  return CATEGORIES.filter((c) => getProductsByCategory(c.name).length > 0).map((c) => ({ kategori: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ kategori: string }> }): Promise<Metadata> {
  const { kategori } = await params;
  const cat = categoryBySlug(kategori);
  if (!cat) return {};
  const products = getProductsByCategory(cat.name);
  const url = `https://obrnhomen.com/koleksiyon/${cat.slug}`;
  return {
    title: cat.title,
    description: cat.description,
    openGraph: {
      title: cat.title,
      description: cat.description,
      url,
      images: products[0]?.images[0] ? [{ url: products[0].images[0] }] : [],
    },
    alternates: { canonical: url },
  };
}

export default async function KategoriPage({ params }: { params: Promise<{ kategori: string }> }) {
  const { kategori } = await params;
  const cat = categoryBySlug(kategori);
  if (!cat) notFound();
  const products = getProductsByCategory(cat.name);
  if (products.length === 0) notFound();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Anasayfa", item: "https://obrnhomen.com" },
      { "@type": "ListItem", position: 2, name: "Koleksiyon", item: "https://obrnhomen.com/koleksiyon" },
      { "@type": "ListItem", position: 3, name: cat.name, item: `https://obrnhomen.com/koleksiyon/${cat.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="mx-auto max-w-6xl px-6 pt-8">
        <nav className="flex flex-wrap items-center gap-2 text-[13px] text-stone-500" aria-label="Konum">
          <Link href="/" className="hover:text-black">Anasayfa</Link>
          <span>›</span>
          <Link href="/koleksiyon" className="hover:text-black">Tüm Ürünler</Link>
          <span>›</span>
          <span className="text-stone-900">{cat.name}</span>
        </nav>
      </div>

      <div className="mt-4 bg-[#f6f4ef] px-6 py-10 text-center">
        <h1 className="text-3xl text-stone-900 md:text-4xl" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          {cat.name}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-stone-600">{cat.description}</p>
        <p className="mt-2 text-[13px] text-stone-500">{products.length} ürün</p>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <ProductGrid products={products.map(toCard)} categories={[]} />
      </div>
    </div>
  );
}
