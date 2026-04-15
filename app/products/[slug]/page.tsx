import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllSlugs, getProductBySlug } from "@/lib/products";
import ImageGallery from "@/app/components/ImageGallery";

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

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-[10px] tracking-[0.25em] uppercase text-stone-400 mb-10 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-stone-700 transition-colors">
          Koleksiyon
        </Link>
        <span className="text-stone-300">/</span>
        <span className="text-stone-500">{product.category}</span>
        <span className="text-stone-300">/</span>
        <span className="text-stone-600 line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Sol — Galeri */}
        <div className="md:sticky md:top-24 self-start">
          <ImageGallery images={product.images} name={product.name} />
        </div>

        {/* Sağ — Ürün Bilgisi */}
        <div className="flex flex-col">
          {/* Marka & Kategori */}
          <p className="text-[10px] tracking-[0.35em] uppercase text-stone-400 mb-4">
            {product.brand} · {product.category}
          </p>

          {/* Başlık */}
          <h1 className="text-2xl md:text-3xl font-light text-stone-800 leading-snug mb-8">
            {product.name}
          </h1>

          {/* Fiyat */}
          <div className="mb-8">
            <p className="text-3xl font-light text-stone-900 mb-1">
              {product.price.toLocaleString("tr-TR", {
                minimumFractionDigits: 2,
              })}{" "}
              ₺
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
                  <span className="text-[10px] tracking-[0.2em] uppercase text-stone-400 block mb-1">
                    Renk
                  </span>
                  <span className="text-stone-700">{product.color}</span>
                </div>
              )}
              {product.size && (
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-stone-400 block mb-1">
                    Ebat
                  </span>
                  <span className="text-stone-700">{product.size}</span>
                </div>
              )}
            </div>
          )}

          {/* CTA */}
          <a
            href={`https://wa.me/905316893849?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-stone-900 text-white text-xs tracking-[0.2em] uppercase text-center hover:bg-stone-700 transition-colors duration-200 mb-3"
          >
            Sipariş Ver — WhatsApp
          </a>
          <p className="text-xs text-stone-400 text-center tracking-wide mb-10">
            Güvenli ödeme · Hızlı kargo · Kolay iade
          </p>

          {/* Özellikler */}
          {product.features.length > 0 && (
            <div className="border-t border-stone-200 pt-8">
              <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 mb-5">
                Ürün Detayları
              </p>
              <ul className="space-y-3">
                {product.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm text-stone-600 leading-relaxed"
                  >
                    <span className="text-stone-300 mt-0.5 shrink-0">—</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
