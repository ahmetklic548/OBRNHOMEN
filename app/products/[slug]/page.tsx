import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllSlugs, getProductBySlug } from "@/lib/products";
import ImageGallery from "@/app/components/ImageGallery";
import AddToCartButton from "@/app/components/AddToCartButton";
import { IslamicStar, IslamicDivider } from "@/app/components/IslamicOrnament";

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

  const waText = encodeURIComponent(
    `Merhaba, "${product.name}" ürünü hakkında bilgi almak istiyorum.`
  );

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
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #f9f3ea 0%, #faf5ec 100%)" }}
    >
      {/* Çok hafif İslami desen */}
      <div className="fixed inset-0 opacity-[0.035] islamic-pattern pointer-events-none" style={{ zIndex: 0 }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Breadcrumb */}
        <nav className="text-[10px] tracking-[0.25em] uppercase text-stone-400 mb-10 flex items-center gap-2 flex-wrap">
          <Link href="/koleksiyon" className="hover:text-[#c9a84c] transition-colors">
            Koleksiyon
          </Link>
          <span className="text-stone-300">/</span>
          <Link
            href={`/koleksiyon?kategori=${encodeURIComponent(product.category)}`}
            className="hover:text-[#c9a84c] transition-colors"
          >
            {product.category}
          </Link>
          <span className="text-stone-300">/</span>
          <span className="text-stone-500 line-clamp-1">{product.name}</span>
        </nav>

        {/* Ana içerik — sticky fix: items-start on grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Sol — Galeri (sticky) */}
          <div className="md:sticky md:top-28">
            <ImageGallery images={product.images} name={product.name} />
          </div>

          {/* Sağ — Ürün Bilgisi */}
          <div className="flex flex-col">
            {/* Üst ornament */}
            <div className="flex items-center gap-3 mb-6">
              <IslamicStar size={12} color="#c9a84c" opacity={0.6} />
              <p className="text-[10px] tracking-[0.35em] uppercase text-stone-400">
                {product.brand} · {product.category}
              </p>
            </div>

            {/* Başlık */}
            <h1 className="text-2xl md:text-3xl font-light text-stone-800 leading-snug mb-6">
              {product.name}
            </h1>

            <IslamicDivider color="#c9a84c" className="mb-6 opacity-40" />

            {/* Fiyat */}
            <div className="mb-6">
              <p className="text-3xl font-light mb-1" style={{ color: "#1c1917" }}>
                {product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
              </p>
              <p className="text-xs text-stone-400 tracking-wide">KDV dahil</p>
            </div>

            {/* Stok durumu */}
            <div className="flex items-center gap-2 mb-8">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  product.inStock ? "bg-emerald-500" : "bg-stone-300"
                }`}
              />
              <span
                className={`text-xs tracking-widest uppercase ${
                  product.inStock ? "text-emerald-600" : "text-stone-400"
                }`}
              >
                {product.inStock ? "Stokta Mevcut" : "Tükendi"}
              </span>
            </div>

            {/* Renk / Ebat */}
            {(product.color || product.size) && (
              <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-stone-200 text-sm">
                {product.color && (
                  <div>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-stone-400 block mb-1">Renk</span>
                    <span className="text-stone-700">{product.color}</span>
                  </div>
                )}
                {product.size && (
                  <div>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-stone-400 block mb-1">Ebat</span>
                    <span className="text-stone-700">{product.size}</span>
                  </div>
                )}
              </div>
            )}

            {/* CTA */}
            <AddToCartButton
              slug={product.slug}
              name={product.name}
              price={product.price}
              image={product.images[0] ?? ""}
              inStock={product.inStock}
              waText={waText}
            />
            <p className="text-xs text-stone-400 text-center tracking-wide mb-10">
              Güvenli ödeme · Hızlı kargo · Kolay iade
            </p>

            {/* Özellikler */}
            {product.features.length > 0 && (
              <div className="border-t border-stone-200 pt-8">
                <div className="flex items-center gap-3 mb-5">
                  <IslamicStar size={10} color="#c9a84c" opacity={0.6} />
                  <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400">
                    Ürün Detayları
                  </p>
                </div>
                <ul className="space-y-3">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex gap-3 text-sm text-stone-600 leading-relaxed">
                      <span style={{ color: "#c9a84c", opacity: 0.6 }} className="mt-0.5 shrink-0">—</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
