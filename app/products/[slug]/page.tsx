import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllSlugs, getProductBySlug } from "@/lib/products";

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

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Breadcrumb */}
      <nav className="text-xs tracking-widest uppercase text-stone-400 mb-10 flex gap-2">
        <Link href="/" className="hover:text-stone-600 transition-colors">Koleksiyon</Link>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span className="text-stone-600">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Görseller */}
        <div className="space-y-3">
          {product.images.length > 0 ? (
            <>
              <div className="aspect-square bg-stone-100 relative overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1).map((img, i) => (
                    <div key={i} className="aspect-square bg-stone-100 relative overflow-hidden">
                      <Image
                        src={img}
                        alt={`${product.name} ${i + 2}`}
                        fill
                        className="object-cover"
                        sizes="15vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-square bg-stone-100 flex items-center justify-center text-stone-300 text-xs tracking-widest uppercase">
              Görsel Yok
            </div>
          )}
        </div>

        {/* Ürün bilgisi */}
        <div className="flex flex-col">
          <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-3">
            {product.brand} · {product.category}
          </p>
          <h1 className="text-2xl md:text-3xl font-light text-stone-800 leading-snug mb-6">
            {product.name}
          </h1>

          <p className="text-3xl font-light text-stone-900 mb-2">
            {product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
          </p>
          <p className="text-xs text-stone-400 mb-8">KDV dahil</p>

          {/* Stok */}
          <div className="mb-8">
            {product.inStock ? (
              <span className="text-xs tracking-widest uppercase text-emerald-600">Stokta Mevcut</span>
            ) : (
              <span className="text-xs tracking-widest uppercase text-stone-400">Tükendi</span>
            )}
          </div>

          {/* Renk / Ebat */}
          {(product.color || product.size) && (
            <div className="flex gap-6 mb-8 text-sm text-stone-500">
              {product.color && <span>Renk: <strong className="text-stone-700">{product.color}</strong></span>}
              {product.size && <span>Ebat: <strong className="text-stone-700">{product.size}</strong></span>}
            </div>
          )}

          {/* CTA */}
          <a
            href={`https://wa.me/905000000000?text=${encodeURIComponent(`Merhaba, "${product.name}" ürünü hakkında bilgi almak istiyorum.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-stone-900 text-white text-sm tracking-widest uppercase text-center hover:bg-stone-700 transition-colors mb-4"
          >
            Sipariş Ver — WhatsApp
          </a>
          <p className="text-xs text-stone-400 text-center tracking-wide">
            Güvenli ödeme · Hızlı kargo · Kolay iade
          </p>

          {/* Özellikler */}
          {product.features.length > 0 && (
            <div className="mt-10 pt-10 border-t border-stone-200">
              <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-4">Ürün Detayları</p>
              <ul className="space-y-2">
                {product.features.map((f, i) => (
                  <li key={i} className="flex gap-3 text-sm text-stone-600 leading-relaxed">
                    <span className="text-stone-300 mt-1">—</span>
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
