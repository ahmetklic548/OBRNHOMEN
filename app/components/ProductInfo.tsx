"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, cartMeta } from "./CartContext";
import { trackView } from "./RecentlyViewed";
import { trackViewItem, trackAddToCart, trackBeginCheckout } from "@/lib/analytics";
import type { Product } from "@/lib/products";
import { salePrice, unitPriceFor, tierPct } from "@/lib/pricing";
import WholesaleBox from "./WholesaleBox";
import TrendyolBadge from "./TrendyolBadge";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/storeNav";
import AdminProductTools, { useIsAdmin } from "./AdminProductTools";
import { useHiddenSlugs } from "@/lib/hidden";
import { isPack, qtyText } from "@/lib/pack";

/* ── Icon set (outline SVG, Lucide-style) ─────────────────── */
const TruckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const ReturnIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
  </svg>
);
const BadgeCheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);

const TRUST_ITEMS = [
  { Icon: TruckIcon,      label: "2000 ₺ üzeri ücretsiz kargo" },
  { Icon: ShieldIcon,     label: "256-bit SSL güvenli ödeme"   },
  { Icon: ReturnIcon,     label: "14 gün ücretsiz iade"          },
  { Icon: BadgeCheckIcon, label: "Orijinal ve garantili ürün"  },
];

/* ── Chevron ──────────────────────────────────────────────── */
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ── Accordion ────────────────────────────────────────────── */
function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t" style={{ borderColor: "#efefef" }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left transition-opacity hover:opacity-50"
      >
        <span className="text-[12px] tracking-[0.04em] uppercase" style={{ color: "#0a0a0a" }}>
          {title}
        </span>
        <ChevronIcon open={open} />
      </button>
      {open && (
        <div className="pb-5 text-sm leading-relaxed" style={{ color: "#666" }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Main component ───────────────────────────────────────── */
export default function ProductInfo({ product }: { product: Product }) {
  const { add } = useCart();
  const router   = useRouter();
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qty, setQty] = useState(1);
  const isAdmin = useIsAdmin();
  const hiddenSlugs = useHiddenSlugs();
  const isHiddenForCustomer = hiddenSlugs.has(product.slug) && !isAdmin;

  useEffect(() => {
    trackView({
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
      category: product.category,
    });
    trackViewItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      category: product.category,
    });
  }, [product.slug, product.name, product.price, product.images, product.category]);

  const handleShare = async () => {
    const url = `https://obrnhomen.com/products/${product.slug}`;
    if (navigator.share) {
      await navigator.share({ title: product.name, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const unit = salePrice(product.price);
  // Paketli ilan (10'lu…): sayaç paket sayar, toplam adet yanında yazılır
  const pack = isPack(product.quantity) ? product.quantity! : undefined;

  const handleAdd = () => {
    add({ slug: product.slug, name: product.name, price: unit, image: product.images[0] ?? "", ...cartMeta(product) }, qty);
    trackAddToCart({ slug: product.slug, name: product.name, price: unit, category: product.category });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuy = () => {
    add({ slug: product.slug, name: product.name, price: unit, image: product.images[0] ?? "", ...cartMeta(product) }, qty);
    trackBeginCheckout(unitPriceFor(unit, qty) * qty, [{ slug: product.slug, name: product.name, price: unitPriceFor(unit, qty), qty }]);
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col">
      <AdminProductTools slug={product.slug} name={product.name} />
      {isHiddenForCustomer && (
        <div className="mb-5 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-[15px] text-stone-700">
          Bu ürün şu an satışta değil. Benzer ürünler için <Link href="/koleksiyon" className="underline">tüm ürünlere</Link> göz atabilirsiniz.
        </div>
      )}

      {/* Kategori */}
      <p className="mb-3 text-[13px] text-[#9a7a2c]">
        {product.category}{product.subcategory ? ` · ${product.subcategory}` : ""}
      </p>

      {/* Başlık */}
      <h1 className="mb-3 text-[26px] font-medium leading-snug text-stone-900 md:text-[32px]">
        {product.name}
      </h1>

      {/* Ürün kodu + paket */}
      <div className="mb-5 flex flex-wrap items-center gap-3 text-[13px] text-stone-500">
        {product.sku && (
          <span title="Siparişte veya WhatsApp'ta bu kodu söylemeniz yeterli">Ürün kodu: <strong className="font-medium text-stone-700">{product.sku}</strong></span>
        )}
        {product.quantity && product.quantity > 1 && (
          <span className="rounded border border-stone-300 px-2 py-0.5 text-stone-700">Pakette {product.quantity} adet</span>
        )}
      </div>

      {/* Fiyat — net, indirim rozeti yok */}
      <div className="mb-6 border-b pb-6" style={{ borderColor: "#efefef" }}>
        <p className="text-[32px] font-semibold leading-none text-stone-900">
          {salePrice(product.price).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
        </p>
        <p className="mt-2 text-[13px] text-stone-500">
          KDV dahil{product.quantity && product.quantity > 1 ? ` · paket fiyatı (${product.quantity} adet)` : ""} · 2.000 ₺ üzeri kargo bedava
        </p>
      </div>

      {/* Özellikler */}
      {(product.color || product.size) && (
        <dl className="mb-5 flex flex-wrap gap-x-8 gap-y-2 text-[15px]">
          {product.color && (
            <div><dt className="text-[13px] text-stone-500">Renk</dt><dd className="text-stone-900">{product.color}</dd></div>
          )}
          {product.size && (
            <div><dt className="text-[13px] text-stone-500">Ebat</dt><dd className="text-stone-900">{product.size}</dd></div>
          )}
        </dl>
      )}

      {/* Stok */}
      <p className={`mb-4 flex items-center gap-2 text-[14px] ${product.inStock ? "text-emerald-700" : "text-stone-500"}`}>
        <span className={`h-2 w-2 rounded-full ${product.inStock ? "bg-emerald-500" : "bg-stone-300"}`} />
        {product.inStock ? (product.stock <= 20 ? `Stokta — son ${product.stock} adet` : "Stokta var, hemen kargoya verilir") : "Şu an stokta yok"}
      </p>

      {/* Açıklama */}
      {product.metaDescription && (
        <p className="mb-6 text-[15px] leading-relaxed text-stone-600">{product.metaDescription}</p>
      )}

      {/* CTA */}
      {product.inStock && !isHiddenForCustomer ? (
        <div className="flex flex-col gap-3 mb-8">
          {/* Adet — toptan kademe buna göre uygulanır */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center border" style={{ borderColor: "#e0e0e0" }}>
              <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-11 text-lg text-stone-500 hover:text-black" aria-label="Azalt">−</button>
              <input
                type="number"
                min={1}
                max={1000}
                value={qty}
                onChange={e => setQty(Math.min(1000, Math.max(1, Math.floor(Number(e.target.value)) || 1)))}
                className="w-16 h-11 text-center text-sm outline-none border-x"
                style={{ borderColor: "#e0e0e0", color: "#0a0a0a" }}
                aria-label={pack ? "Paket sayısı" : "Adet"}
              />
              <button type="button" onClick={() => setQty(q => Math.min(1000, q + 1))} className="w-10 h-11 text-lg text-stone-500 hover:text-black" aria-label="Artır">+</button>
              {pack && <span className="px-2 text-[13px] text-stone-600">paket</span>}
            </div>
            <p className="text-right text-xs leading-snug" style={{ color: "#555" }}>
              {qtyText(qty, pack)}: <strong style={{ color: "#0a0a0a" }}>{(unitPriceFor(unit, qty) * qty).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺</strong>
              {tierPct(qty) > 0 && <span className="block" style={{ color: "#1f9d55" }}>Toptan -%{tierPct(qty)} uygulandı</span>}
            </p>
          </div>

          <button
            onClick={handleBuy}
            className="w-full py-4 text-[13px] tracking-[0.04em] uppercase font-medium text-white transition-opacity duration-200 hover:opacity-75"
            style={{ background: "#0a0a0a" }}
          >
            Satın Al
          </button>
          <button
            onClick={handleAdd}
            className="w-full py-4 text-[13px] tracking-[0.04em] uppercase font-medium transition-all duration-200 border"
            style={
              added
                ? { background: "#f0fdf4", color: "#16a34a", borderColor: "#16a34a" }
                : { background: "transparent", color: "#0a0a0a", borderColor: "#0a0a0a" }
            }
          >
            {added ? "Sepete Eklendi ✓" : "Sepete Ekle"}
          </button>

          {/* Toptan satış — adet kademeleri + WhatsApp teklif */}
          <WholesaleBox
            item={{ slug: product.slug, name: product.name, price: unit, image: product.images[0] ?? "", ...cartMeta(product) }}
            qty={qty}
            onPickQty={setQty}
          />
        </div>
      ) : (
        <div
          className="w-full py-4 text-[13px] tracking-[0.04em] uppercase text-center mb-8 border"
          style={{ borderColor: "#e0e0e0", color: "#bbb" }}
        >
          Stokta Yok
        </div>
      )}

      {/* Telefonla sipariş */}
      <a
        href={PHONE_HREF}
        className="mb-6 flex items-center justify-center gap-2 rounded-md border-2 border-stone-300 py-3 text-[15px] font-medium text-stone-800 hover:border-stone-900"
      >
        <span aria-hidden="true">📞</span> Telefonla sipariş ver: <strong>{PHONE_DISPLAY}</strong>
      </a>

      {/* Paylaş */}
      <button
        onClick={handleShare}
        className="flex items-center gap-2 text-[12px] tracking-[0.04em] uppercase mb-6 transition-opacity hover:opacity-50"
        style={{ color: "#999" }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        {copied ? "Link kopyalandı!" : "Paylaş"}
      </button>

      <div className="mb-4"><TrendyolBadge compact /></div>

      {/* Trust badges */}
      <div className="grid grid-cols-2 gap-2 mb-8">
        {TRUST_ITEMS.map(({ Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2.5 px-3 py-3 border"
            style={{ borderColor: "#efefef", background: "#fafaf8" }}
          >
            <span style={{ color: "#999", flexShrink: 0 }}><Icon /></span>
            <span className="text-[13px] leading-snug" style={{ color: "#666" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Accordions */}
      <div>
        {product.features.length > 0 && (
          <Accordion title="Ürün Detayları">
            <ul className="space-y-2">
              {product.features.map((f, i) => (
                <li key={i} className="flex gap-2">
                  <span style={{ color: "#999" }} className="shrink-0">–</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </Accordion>
        )}

        <Accordion title="Kargo & Teslimat">
          <div className="space-y-2">
            <p>2000 ₺ ve üzeri siparişlerde kargo ücretsizdir.</p>
            <p>2000 ₺ altı siparişlerde 200 ₺ kargo ücreti uygulanır.</p>
            <p>Siparişler 1–3 iş günü içinde kargoya verilir.</p>
            <p>Teslimat süresi kargo firmasına göre 1–3 iş günüdür.</p>
          </div>
        </Accordion>

        <Accordion title="İade & Değişim">
          <div className="space-y-2">
            <p>Teslim tarihinden itibaren 14 gün içinde ücretsiz iade veya değişim yapabilirsiniz (iade koduyla, kargo ücreti bizden).</p>
            <p>Ürünün orijinal ambalajında ve kullanılmamış olması gerekmektedir.</p>
            <p>İade talepleriniz için canlı destek hattımızdan bize ulaşabilirsiniz.</p>
          </div>
        </Accordion>
      </div>
    </div>
  );
}
