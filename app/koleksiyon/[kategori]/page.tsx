import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductsByCategory, toCard, type Product } from "@/lib/products";
import { CATEGORIES, categoryBySlug } from "@/lib/categories";
import { LANDINGS, landingBySlug, landingProducts, categorySeo, type SeoBlock } from "@/lib/seoContent";
import ProductGrid from "@/app/components/ProductGrid";
import SeoText from "@/app/components/SeoText";
import type { Metadata } from "next";

// Kategori adresleri sade slug: /koleksiyon/kuran-i-kerim (data/categories.json).
// Aynı adres yapısında arama-odaklı açılış sayfaları da var: /koleksiyon/desensiz-seccade (data/seo-content.json).
// Eski ad-tabanlı adresler next.config.ts'teki yönlendirmelerle buraya gelir.
export const dynamicParams = false;

export async function generateStaticParams() {
  const cats = CATEGORIES.filter((c) => getProductsByCategory(c.name).length > 0).map((c) => ({ kategori: c.slug }));
  const lands = LANDINGS.filter((l) => !categoryBySlug(l.slug) && landingProducts(l).length > 0).map((l) => ({ kategori: l.slug }));
  return [...cats, ...lands];
}

interface PageData {
  slug: string;
  name: string;
  h1: string;
  title: string;
  description: string;
  products: Product[];
  seo?: SeoBlock;
}

function resolve(slug: string): PageData | null {
  const cat = categoryBySlug(slug);
  if (cat) {
    return {
      slug: cat.slug,
      name: cat.name,
      h1: cat.name,
      title: cat.title,
      description: cat.description,
      products: getProductsByCategory(cat.name),
      seo: categorySeo(cat.slug),
    };
  }
  const l = landingBySlug(slug);
  if (l) {
    return { slug: l.slug, name: l.h1, h1: l.h1, title: l.title, description: l.description, products: landingProducts(l), seo: l };
  }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ kategori: string }> }): Promise<Metadata> {
  const { kategori } = await params;
  const page = resolve(kategori);
  if (!page) return {};
  const url = `https://www.obrnhomen.com/koleksiyon/${page.slug}`;
  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      images: page.products[0]?.images[0] ? [{ url: page.products[0].images[0] }] : [],
    },
    alternates: { canonical: url },
  };
}

export default async function KategoriPage({ params }: { params: Promise<{ kategori: string }> }) {
  const { kategori } = await params;
  const page = resolve(kategori);
  if (!page) notFound();
  if (page.products.length === 0) notFound();

  const url = `https://www.obrnhomen.com/koleksiyon/${page.slug}`;
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Anasayfa", item: "https://www.obrnhomen.com" },
      { "@type": "ListItem", position: 2, name: "Koleksiyon", item: "https://www.obrnhomen.com/koleksiyon" },
      { "@type": "ListItem", position: 3, name: page.name, item: url },
    ],
  };
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: page.h1,
    numberOfItems: page.products.length,
    itemListElement: page.products.slice(0, 30).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://www.obrnhomen.com/products/${p.slug}`,
      name: p.name,
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <div className="mx-auto max-w-6xl px-6 pt-8">
        <nav className="flex flex-wrap items-center gap-2 text-[13px] text-stone-500" aria-label="Konum">
          <Link href="/" className="hover:text-black">Anasayfa</Link>
          <span>›</span>
          <Link href="/koleksiyon" className="hover:text-black">Tüm Ürünler</Link>
          <span>›</span>
          <span className="text-stone-900">{page.name}</span>
        </nav>
      </div>

      <div className="mt-4 bg-[#f6f4ef] px-6 py-10 text-center">
        <h1 className="text-3xl text-stone-900 md:text-4xl" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          {page.h1}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-stone-600">{page.description}</p>
        <p className="mt-2 text-[13px] text-stone-500">{page.products.length} ürün</p>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <ProductGrid products={page.products.map(toCard)} categories={[]} />
      </div>

      {page.seo && <SeoText block={page.seo} heading={`${page.h1} Hakkında`} />}
    </div>
  );
}
