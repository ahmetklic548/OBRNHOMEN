"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthProvider";
import { trackView } from "./RecentlyViewed";
import type { Product } from "@/lib/products";

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
  { Icon: TruckIcon,      label: "1000 ₺ üzeri ücretsiz kargo" },
  { Icon: ShieldIcon,     label: "256-bit SSL güvenli ödeme"   },
  { Icon: ReturnIcon,     label: "14 gün koşulsuz iade"         },
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
        <span className="text-[9px] tracking-[0.35em] uppercase" style={{ color: "#0a0a0a" }}>
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
  const { user } = useAuth();
  const router   = useRouter();
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    trackView({
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
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

  const requireAuth = () => router.push("/hesap");

  const handleAdd = () => {
    if (!user) { requireAuth(); return; }
    add({ slug: product.slug, name: product.name, price: product.price, image: product.images[0] ?? "" });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuy = () => {
    if (!user) { requireAuth(); return; }
    add({ slug: product.slug, name: product.name, price: product.price, image: product.images[0] ?? "" });
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col">

      {/* Category label */}
      <p
        className="text-[9px] tracking-[0.5em] uppercase mb-4"
        style={{ color: "#c9a84c" }}
      >
        {product.brand} · {product.category}
      </p>

      {/* Title */}
      <h1
        className="mb-4 leading-tight"
        style={{
          fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
          fontWeight: 400,
          fontFamily: "var(--font-playfair, 'Playfair Display'), Georgia, serif",
          color: "#0a0a0a",
          lineHeight: 1.1,
        }}
      >
        {product.name}
      </h1>

      {/* Quantity + SKU */}
      <div className="flex items-center gap-4 mb-6">
        {product.quantity && product.quantity > 1 && (
          <span
            className="text-[9px] tracking-widest uppercase px-3 py-1 border"
            style={{ borderColor: "#e0e0e0", color: "#666" }}
          >
            {product.quantity} Adet / Paket
          </span>
        )}
        <p className="text-[9px] tracking-widest uppercase" style={{ color: "#bbb" }}>
          SKU: {product.id}
        </p>
      </div>

      {/* Price — %20 indirimli */}
      <div className="mb-6 pb-6 border-b" style={{ borderColor: "#efefef" }}>
        <div className="flex items-baseline gap-3 mb-1">
          <span
            style={{
              fontSize: "2rem",
              fontWeight: 400,
              fontFamily: "var(--font-playfair, 'Playfair Display'), Georgia, serif",
              color: "#0a0a0a",
            }}
          >
            {(product.price * 0.8).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
          </span>
          <span
            className="text-[10px] tracking-widest uppercase px-2 py-0.5"
            style={{ background: "#0a0a0a", color: "#ffffff" }}
          >
            %20 İndirim
          </span>
        </div>
        <p className="text-sm line-through" style={{ color: "#bbb" }}>
          {product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
        </p>
        <p className="text-[10px] tracking-wide mt-1" style={{ color: "#bbb" }}>KDV dahil</p>
      </div>

      {/* Attributes */}
      {(product.color || product.size) && (
        <div className="flex flex-wrap gap-6 mb-6 text-sm">
          {product.color && (
            <div>
              <span className="text-[9px] tracking-[0.3em] uppercase block mb-1" style={{ color: "#999" }}>Renk</span>
              <span style={{ color: "#0a0a0a" }}>{product.color}</span>
            </div>
          )}
          {product.size && (
            <div>
              <span className="text-[9px] tracking-[0.3em] uppercase block mb-1" style={{ color: "#999" }}>Ebat</span>
              <span style={{ color: "#0a0a0a" }}>{product.size}</span>
            </div>
          )}
        </div>
      )}

      {/* Stock + urgency */}
      <div className="flex items-center gap-3 mb-3">
        <span
          className={`w-1.5 h-1.5 ${product.inStock ? "bg-emerald-400" : "bg-stone-300"}`}
        />
        <span className="text-[9px] tracking-widest uppercase" style={{ color: product.inStock ? "#34d399" : "#bbb" }}>
          {product.inStock ? "Stokta Var" : "Tükendi"}
        </span>
        {product.inStock && product.stock <= 20 && (
          <span className="text-[9px] tracking-widest uppercase px-2 py-0.5" style={{ background: "#0a0a0a", color: "#ffffff" }}>
            Son {product.stock} adet
          </span>
        )}
      </div>

      {/* Description */}
      {product.metaDescription && (
        <p className="text-sm leading-relaxed mb-6" style={{ color: "#86868B" }}>
          {product.metaDescription}
        </p>
      )}

      {/* CTA */}
      {product.inStock ? (
        <div className="flex flex-col gap-3 mb-8">
          <button
            onClick={handleBuy}
            className="w-full py-4 text-[10px] tracking-[0.3em] uppercase font-medium text-white transition-opacity duration-200 hover:opacity-75"
            style={{ background: "#0a0a0a" }}
          >
            Satın Al
          </button>
          <button
            onClick={handleAdd}
            className="w-full py-4 text-[10px] tracking-[0.3em] uppercase font-medium transition-all duration-200 border"
            style={
              added
                ? { background: "#f0fdf4", color: "#16a34a", borderColor: "#16a34a" }
                : { background: "transparent", color: "#0a0a0a", borderColor: "#0a0a0a" }
            }
          >
            {added ? "Sepete Eklendi ✓" : "Sepete Ekle"}
          </button>
        </div>
      ) : (
        <div
          className="w-full py-4 text-[10px] tracking-[0.3em] uppercase text-center mb-8 border"
          style={{ borderColor: "#e0e0e0", color: "#bbb" }}
        >
          Stokta Yok
        </div>
      )}

      {/* Paylaş */}
      <button
        onClick={handleShare}
        className="flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase mb-6 transition-opacity hover:opacity-50"
        style={{ color: "#999" }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        {copied ? "Link kopyalandı!" : "Paylaş"}
      </button>

      {/* Trust badges */}
      <div className="grid grid-cols-2 gap-2 mb-8">
        {TRUST_ITEMS.map(({ Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2.5 px-3 py-3 border"
            style={{ borderColor: "#efefef", background: "#fafaf8" }}
          >
            <span style={{ color: "#999", flexShrink: 0 }}><Icon /></span>
            <span className="text-[10px] leading-snug" style={{ color: "#666" }}>{label}</span>
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
            <p>1000 ₺ ve üzeri siparişlerde kargo ücretsizdir.</p>
            <p>1000 ₺ altı siparişlerde 200 ₺ kargo ücreti uygulanır.</p>
            <p>Siparişler 1–3 iş günü içinde kargoya verilir.</p>
            <p>Teslimat süresi kargo firmasına göre 1–3 iş günüdür.</p>
          </div>
        </Accordion>

        <Accordion title="İade & Değişim">
          <div className="space-y-2">
            <p>Teslim tarihinden itibaren 14 gün içinde iade veya değişim yapabilirsiniz.</p>
            <p>Ürünün orijinal ambalajında ve kullanılmamış olması gerekmektedir.</p>
            <p>İade talepleriniz için canlı destek hattımızdan bize ulaşabilirsiniz.</p>
          </div>
        </Accordion>
      </div>
    </div>
  );
}
