import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllSlugs, getProductBySlug } from "@/lib/products";
import StackedImages from "@/app/components/StackedImages";
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
    <div className="min-h-screen" style={{ background: "#ffffff" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="max-w-screen-xl mx-auto px-6 pt-28 pb-4">
        <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase" style={{ color: "#86868B" }}>
          <Link href="/" className="hover:text-black transition-colors">Anasayfa</Link>
          <span>/</span>
          <Link href="/koleksiyon" className="hover:text-black transition-colors">Koleksiyon</Link>
          <span>/</span>
          <Link
            href={`/koleksiyon?kategori=${encodeURIComponent(product.category)}`}
            className="hover:text-black transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-black line-clamp-1">{product.name}</span>
        </nav>
      </div>

      {/* Main — stacked images left, sticky info right */}
      <div className="max-w-screen-xl mx-auto px-6 pb-24">
        <div className="lg:grid lg:grid-cols-[3fr_2fr] lg:gap-16 xl:gap-24 items-start">

          {/* LEFT — stacked images */}
          <div className="mb-12 lg:mb-0">
            <StackedImages images={product.images} name={product.name} />
          </div>

          {/* RIGHT — sticky panel */}
          <div className="lg:sticky lg:top-24">
            <ProductInfo product={product} />
          </div>

        </div>
      </div>
    </div>
  );
}
