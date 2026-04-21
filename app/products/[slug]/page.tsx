import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllSlugs, getProductBySlug } from "@/lib/products";
import ImageGallery from "@/app/components/ImageGallery";
import ProductInfo from "@/app/components/ProductInfo";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.metaDescription,
    openGraph: {
      title: product.name,
      description: product.metaDescription,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.metaDescription,
    image: product.images,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      url: `https://obrnhomen.com/products/${product.slug}`,
      priceCurrency: "TRY",
      price: product.price.toFixed(2),
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "OBRNHOMEN" },
    },
  };

  return (
    <div className="min-h-screen" style={{ background: "#fff" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-8 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-stone-700 transition-colors">Anasayfa</Link>
          <span className="text-stone-300">/</span>
          <Link href="/koleksiyon" className="hover:text-stone-700 transition-colors">Koleksiyon</Link>
          <span className="text-stone-300">/</span>
          <Link
            href={`/koleksiyon?kategori=${encodeURIComponent(product.category)}`}
            className="hover:text-stone-700 transition-colors"
          >
            {product.category}
          </Link>
          <span className="text-stone-300">/</span>
          <span className="text-stone-500 line-clamp-1">{product.name}</span>
        </nav>

        {/* 2-kolon layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Sol — Galeri */}
          <div className="md:sticky md:top-28">
            <ImageGallery images={product.images} name={product.name} />
          </div>

          {/* Sağ — Bilgi + CTA */}
          <ProductInfo product={product} />
        </div>
      </div>
    </div>
  );
}
