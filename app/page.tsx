import Link from "next/link";
import Image from "next/image";
import { getAllProducts, getAllCategories } from "@/lib/products";

export default function Home() {
  const products = getAllProducts();
  const categories = getAllCategories();

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Hero */}
      <section className="text-center mb-20">
        <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-4">El İşçiliği & Özgün Tasarım</p>
        <h1 className="text-4xl md:text-5xl font-light tracking-wide text-stone-800 mb-6">
          Koleksiyon
        </h1>
        <p className="text-stone-500 max-w-md mx-auto leading-relaxed">
          Her ürün, özel anlarınız için titizlikle hazırlanmıştır.
        </p>
      </section>

      {/* Kategori filtresi */}
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        {categories.map((cat) => (
          <span
            key={cat}
            className="px-4 py-1.5 text-xs tracking-widest uppercase border border-stone-300 text-stone-500 rounded-full"
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Ürün grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group block"
          >
            <div className="aspect-square bg-stone-100 overflow-hidden mb-3 relative">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs tracking-widest uppercase">
                  Görsel Yok
                </div>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <span className="text-xs tracking-widest uppercase text-stone-400">Tükendi</span>
                </div>
              )}
            </div>
            <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">{product.category}</p>
            <h2 className="text-sm text-stone-700 leading-snug mb-2 group-hover:text-stone-900 transition-colors line-clamp-2">
              {product.name}
            </h2>
            <p className="text-sm font-medium text-stone-800">
              {product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
