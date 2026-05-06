import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllSlugs, getProductBySlug, getProductsByCategory } from "@/lib/products";
import StackedImages from "@/app/components/StackedImages";
import ProductInfo from "@/app/components/ProductInfo";
import RecentlyViewed from "@/app/components/RecentlyViewed";
import ProductReviews from "@/app/components/ProductReviews";

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

  const title = `${product.name} | ${product.category} – OBRNHOMEN`;
  const description = `${product.metaDescription} ${product.inStock ? "Stokta mevcut." : ""} Hızlı kargo, 14 gün iade garantisi. obrnhomen.com`;

  return {
    title,
    description,
    keywords: [
      product.name,
      product.category,
      product.brand,
      "hediyelik",
      "hac umre",
      "el işçiliği",
      ...(product.color ? [product.color] : []),
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      url: `https://obrnhomen.com/products/${product.slug}`,
      type: "website",
      images: product.images[0] ? [{ url: product.images[0], alt: product.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.images[0] ? [product.images[0]] : [],
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

  const related = getProductsByCategory(product.category)
    .filter(p => p.slug !== product.slug && p.inStock && p.images[0])
    .slice(0, 4);

  const jsonLd = [
    {
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
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Anasayfa", item: "https://obrnhomen.com" },
        { "@type": "ListItem", position: 2, name: "Koleksiyon", item: "https://obrnhomen.com/koleksiyon" },
        { "@type": "ListItem", position: 3, name: product.category, item: `https://obrnhomen.com/koleksiyon/${encodeURIComponent(product.category)}` },
        { "@type": "ListItem", position: 4, name: product.name, item: `https://obrnhomen.com/products/${product.slug}` },
      ],
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#ffffff" }}>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      {/* Breadcrumb */}
      <div className="max-w-screen-xl mx-auto px-6 pt-36 pb-4">
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
      <div className="max-w-screen-xl mx-auto px-6 pb-16">
        <div className="lg:grid lg:grid-cols-[3fr_2fr] lg:gap-16 xl:gap-24 items-start">
          <div className="mb-12 lg:mb-0">
            <StackedImages images={product.images} name={product.name} />
          </div>
          <div className="lg:sticky lg:top-24">
            <ProductInfo product={product} />
          </div>
        </div>
      </div>

      {/* Ürün yorumları */}
      <ProductReviews slug={product.slug} />

      {/* Recently viewed */}
      <RecentlyViewed currentSlug={product.slug} />

      {/* Related products */}
      {related.length > 0 && (
        <div className="border-t px-6 py-16" style={{ borderColor: "rgba(0,0,0,0.06)", background: "#F5F5F7" }}>
          <div className="max-w-screen-xl mx-auto">
            <p className="text-[11px] tracking-[0.4em] uppercase font-medium mb-8" style={{ color: "#86868B" }}>
              Bunları da beğenebilirsiniz
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => (
                <Link key={p.slug} href={`/products/${p.slug}`} className="group">
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-3" style={{ background: "#ffffff" }}>
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <p className="text-xs font-medium line-clamp-2 mb-1" style={{ color: "#1D1D1F" }}>{p.name}</p>
                  <div className="flex items-baseline gap-1.5">
                    <p className="text-xs font-medium" style={{ color: "#1D1D1F" }}>
                      {(p.price * 0.8).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                    </p>
                    <p className="text-[10px] line-through" style={{ color: "#86868B" }}>
                      {p.price.toLocaleString("tr-TR")} ₺
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
