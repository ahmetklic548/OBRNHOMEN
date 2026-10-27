"use client";

import { useEffect, useMemo, useState } from "react";
import { useWishlist } from "./WishlistContext";
import type { Product } from "@/lib/products";
import { salePrice } from "@/lib/pricing";
import { prepare, searchProducts } from "@/lib/search";
import ProductCard from "./store/ProductCard";

type Sort = "onerilen" | "fiyat-artan" | "fiyat-azalan";
/** "Tümü" görünümünde her kategoriden gösterilecek ürün sayısı */
const PREVIEW = 8;

/**
 * Koleksiyon ve kategori sayfası ürün listesi.
 * products.json kategori → alt grup → benzer ad sırasıyla dizili (scripts/subcategories.mjs);
 * liste bu sırayı korur ve başlıklarla gruplar, böylece benzer ürünler yan yana durur.
 * URL: ?q=arama (üst arama çubuğundan), ?alt=alt grup (arama önerilerinden)
 */
export default function ProductGrid({
  products,
  categories,
}: {
  products: Product[];
  /** Boşsa tek kategori sayfasıdır: kategori sekmeleri gizlenir, alt gruplar gösterilir */
  categories: string[];
}) {
  const singleCategory = categories.length === 0;
  const [active, setActive] = useState<string | null>(null);
  const [sub, setSub] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("onerilen");
  const { toggle, has } = useWishlist();

  // Üst arama çubuğu /koleksiyon?q=… ile, arama önerileri ?alt=… ile gelir
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const alt = params.get("alt");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL yalnızca istemcide okunabilir
    if (q) setSearch(q);
    if (alt) setSub(alt);
  }, []);

  const prepared = useMemo(() => prepare(products), [products]);
  const category = singleCategory ? products[0]?.category ?? null : active;

  const inCategory = useMemo(
    () => (category ? products.filter((p) => p.category === category) : products),
    [products, category]
  );

  const subgroups = useMemo(() => {
    if (!category) return [];
    const counts = new Map<string, number>();
    for (const p of inCategory) counts.set(p.subcategory ?? "Diğer", (counts.get(p.subcategory ?? "Diğer") ?? 0) + 1);
    return [...counts.entries()];
  }, [inCategory, category]);

  const searching = search.trim().length > 0;

  const list = useMemo(() => {
    let base = searching ? searchProducts(prepared, search) : products;
    if (category) base = base.filter((p) => p.category === category);
    if (sub) base = base.filter((p) => (p.subcategory ?? "Diğer") === sub);
    if (sort !== "onerilen") {
      base = [...base].sort((a, b) =>
        sort === "fiyat-artan" ? salePrice(a.price) - salePrice(b.price) : salePrice(b.price) - salePrice(a.price)
      );
    }
    return base;
  }, [prepared, products, search, searching, category, sub, sort]);

  // Gruplama: arama/fiyat sıralamasında düz liste; aksi halde başlıklar
  const groups = useMemo(() => {
    if (searching || sort !== "onerilen") return [{ key: "", title: "", items: list, total: list.length }];
    const by = category ? "subcategory" : "category";
    const map = new Map<string, Product[]>();
    for (const p of list) {
      const k = (by === "category" ? p.category : p.subcategory) ?? "Diğer";
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(p);
    }
    return [...map.entries()].map(([k, items]) => ({
      key: k,
      title: k,
      items: by === "category" ? items.slice(0, PREVIEW) : items,
      total: items.length,
    }));
  }, [list, searching, sort, category]);

  const pickCategory = (cat: string | null) => {
    setActive(cat);
    setSub(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const chip = (on: boolean) =>
    `shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] transition-colors ${
      on ? "border-black bg-black text-white" : "border-stone-200 bg-white text-stone-600 hover:border-stone-400"
    }`;

  return (
    <div className="py-4">
      {/* ── Araç çubuğu ── */}
      <div className="sticky top-[44px] z-20 -mx-6 mb-8 border-b bg-white/95 px-6 py-3 backdrop-blur md:top-[108px]" style={{ borderColor: "#efefef" }}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 basis-full md:basis-auto md:flex-1 md:max-w-sm">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx={11} cy={11} r={8} /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={category ? `${category} içinde ara…` : "Ürün, renk veya ürün kodu ara…"}
              className="w-full rounded-full border bg-white py-2 pl-9 pr-8 text-[13px] text-stone-800 outline-none focus:border-black"
              style={{ borderColor: "#e0e0e0" }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-black" aria-label="Aramayı temizle">×</button>
            )}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-full border bg-white px-3 py-2 text-[12px] text-stone-700 outline-none"
            style={{ borderColor: "#e0e0e0" }}
            aria-label="Sırala"
          >
            <option value="onerilen">Önerilen sıralama</option>
            <option value="fiyat-artan">Fiyat: düşükten yükseğe</option>
            <option value="fiyat-azalan">Fiyat: yüksekten düşüğe</option>
          </select>
          <span className="ml-auto text-[11px] uppercase tracking-widest text-stone-400">{list.length} ürün</span>
        </div>

        {/* Kategori sekmeleri (tüm ürünler sayfası) */}
        {!singleCategory && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            <button onClick={() => pickCategory(null)} className={chip(active === null)}>Tümü</button>
            {categories.map((cat) => (
              <button key={cat} onClick={() => pickCategory(cat)} className={chip(active === cat)}>{cat}</button>
            ))}
          </div>
        )}

        {/* Alt gruplar (bir kategori seçiliyken) */}
        {category && subgroups.length > 1 && (
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            <button onClick={() => setSub(null)} className={chip(sub === null)}>Hepsi</button>
            {subgroups.map(([s, n]) => (
              <button key={s} onClick={() => setSub(sub === s ? null : s)} className={chip(sub === s)}>
                {s} <span className="opacity-60">({n})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {searching && (
        <p className="mb-6 text-sm text-stone-600">
          &ldquo;{search}&rdquo; için <strong>{list.length}</strong> sonuç{category ? ` · ${category}` : ""}
        </p>
      )}

      {list.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-sm text-stone-500">Aradığınız kriterlere uygun ürün bulunamadı.</p>
          <button onClick={() => { setSearch(""); setSub(null); }} className="mt-4 text-xs underline text-stone-600">Filtreleri temizle</button>
        </div>
      ) : (
        <div className="space-y-14">
          {groups.map((g) => (
            <section key={g.key || "all"} aria-label={g.title || undefined}>
              {g.title && (
                <div className="mb-5 flex items-end justify-between gap-4 border-b pb-3" style={{ borderColor: "#efefef" }}>
                  <h2 className="text-xl text-stone-900 md:text-2xl" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                    {g.title} <span className="text-sm text-stone-400">({g.total})</span>
                  </h2>
                  {!category && g.total > g.items.length && (
                    <button onClick={() => pickCategory(g.key)} className="shrink-0 text-[12px] font-medium text-[#9a7a2c] hover:underline">
                      Tümünü gör ({g.total}) →
                    </button>
                  )}
                </div>
              )}
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-4 lg:grid-cols-4">
                {g.items.map((product) => (
                  <div key={product.id} className="group relative">
                    <ProductCard product={product} />
                    <button
                      onClick={() => toggle(product.slug)}
                      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 transition-opacity md:opacity-0 md:group-hover:opacity-100"
                      aria-label="Favorilere ekle"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={has(product.slug) ? "#c9a84c" : "none"} stroke={has(product.slug) ? "#c9a84c" : "#0a0a0a"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
