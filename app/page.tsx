import { getAllProducts, getAllCategories } from "@/lib/products";
import ProductGrid from "@/app/components/ProductGrid";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "OBRNHOMEN",
  url: "https://obrnhomen.com",
  description: "El işçiliği ve özgün tasarımla hazırlanan özel hediyeler.",
  address: { "@type": "PostalAddress", addressCountry: "TR" },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+905316893849",
    contactType: "customer service",
    availableLanguage: "Turkish",
  },
};

export default function Home() {
  const products = getAllProducts();
  const categories = getAllCategories();

  return (
    <div className="max-w-6xl mx-auto px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <section className="pt-24 pb-20 text-center">
        <p className="text-[10px] tracking-[0.4em] uppercase text-stone-400 mb-5">
          El İşçiliği &amp; Özgün Tasarım
        </p>
        <h1 className="text-5xl md:text-6xl font-light tracking-[0.15em] uppercase text-stone-800 mb-8">
          Koleksiyon
        </h1>
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-stone-300" />
          <span className="text-stone-300 text-lg">✦</span>
          <div className="h-px w-16 bg-stone-300" />
        </div>
        <p className="text-stone-500 max-w-sm mx-auto leading-relaxed text-sm">
          Her ürün, özel anlarınız için titizlikle hazırlanmıştır.
        </p>
      </section>

      {/* Filtre + Grid */}
      <ProductGrid products={products} categories={categories} />

      {/* Alt boşluk */}
      <div className="pb-24" />
    </div>
  );
}
