"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthProvider";
import type { Product } from "@/lib/products";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-stone-100">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-xs tracking-[0.3em] uppercase text-stone-600">{title}</span>
        <ChevronIcon open={open} />
      </button>
      {open && (
        <div className="pb-5 text-sm text-stone-500 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductInfo({ product }: { product: Product }) {
  const { add } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const waText = encodeURIComponent(
    `Merhaba, "${product.name}" ürünü hakkında bilgi almak istiyorum.`
  );

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
      {/* Kategori + marka */}
      <p className="text-[10px] tracking-[0.4em] uppercase mb-2" style={{ color: "#c9a84c" }}>
        {product.brand} · {product.category}
      </p>

      {/* Başlık */}
      <h1 className="text-2xl md:text-3xl font-light text-stone-800 leading-snug mb-4">
        {product.name}
      </h1>

      {/* Stok kodu */}
      <p className="text-[10px] tracking-widest text-stone-400 uppercase mb-5">
        Stok No: {product.id}
      </p>

      {/* Fiyat */}
      <div className="mb-5">
        <p className="text-3xl font-light text-stone-900">
          {product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
        </p>
        <p className="text-xs text-stone-400 mt-1">KDV dahil</p>
      </div>

      {/* Renk / Ebat */}
      {(product.color || product.size) && (
        <div className="flex flex-wrap gap-6 mb-5 pb-5 border-b border-stone-100 text-sm">
          {product.color && (
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-stone-400 block mb-1">Renk</span>
              <span className="text-stone-700">{product.color}</span>
            </div>
          )}
          {product.size && (
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-stone-400 block mb-1">Ebat</span>
              <span className="text-stone-700">{product.size}</span>
            </div>
          )}
        </div>
      )}

      {/* Stok durumu */}
      <div className="flex items-center gap-2 mb-6">
        <span className={`w-2 h-2 rounded-full ${product.inStock ? "bg-emerald-500" : "bg-stone-300"}`} />
        <span className={`text-xs tracking-widest uppercase ${product.inStock ? "text-emerald-600" : "text-stone-400"}`}>
          {product.inStock ? "Stok: Var" : "Tükendi"}
        </span>
      </div>

      {/* CTA butonları */}
      {product.inStock ? (
        <div className="space-y-3 mb-6">
          {/* Satın Al */}
          <button
            onClick={handleBuy}
            className="w-full py-4 text-white text-xs tracking-[0.35em] uppercase transition-opacity duration-200 hover:opacity-85"
            style={{ background: "#1a1208" }}
          >
            Satın Al
          </button>

          {/* Sepete Ekle */}
          <button
            onClick={handleAdd}
            className="w-full py-4 border text-xs tracking-[0.35em] uppercase transition-colors duration-200"
            style={
              added
                ? { borderColor: "#2d6a4f", color: "#2d6a4f", background: "#f0fdf4" }
                : { borderColor: "#c9a84c", color: "#8b6914" }
            }
          >
            {added ? "✓ Sepete Eklendi" : "Sepete Ekle"}
          </button>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/905316893849?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 text-xs tracking-[0.3em] uppercase border border-stone-200 text-stone-500 hover:border-stone-400 hover:text-stone-700 transition-colors duration-200"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.857L.057 23.07a1 1 0 0 0 1.236 1.235l5.206-1.476A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.6a9.547 9.547 0 0 1-4.87-1.333l-.35-.208-3.614 1.025 1.026-3.615-.21-.36A9.6 9.6 0 1 1 12 21.6z"/>
            </svg>
            WhatsApp ile Sipariş
          </a>
        </div>
      ) : (
        <div className="w-full py-4 bg-stone-100 text-stone-400 text-xs tracking-[0.3em] uppercase text-center mb-6">
          Tükendi
        </div>
      )}

      {/* Güven ikonları */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { icon: "🚚", text: "1000 ₺ üzeri kargo ücretsiz" },
          { icon: "🔒", text: "256-bit SSL güvenli ödeme" },
          { icon: "↩️", text: "14 gün koşulsuz iade" },
          { icon: "✅", text: "Orijinal & garantili ürün" },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-2 p-2 bg-stone-50 border border-stone-100">
            <span className="text-sm">{icon}</span>
            <span className="text-[10px] text-stone-500 leading-tight">{text}</span>
          </div>
        ))}
      </div>

      {/* Accordion — Açıklamalar */}
      <div className="border-t border-stone-100">
        {product.features.length > 0 && (
          <Accordion title="Ürün Detayları">
            <ul className="space-y-2">
              {product.features.map((f, i) => (
                <li key={i} className="flex gap-2">
                  <span style={{ color: "#c9a84c" }} className="shrink-0 mt-0.5">—</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </Accordion>
        )}

        <Accordion title="Kargo & Teslimat">
          <div className="space-y-2 text-sm text-stone-500">
            <p>1000 ₺ ve üzeri siparişlerde <strong className="text-stone-700">kargo ücretsizdir</strong>.</p>
            <p>1000 ₺ altı siparişlerde 200 ₺ kargo ücreti uygulanır.</p>
            <p>Siparişler 1–3 iş günü içinde kargoya verilir.</p>
            <p>Teslimat süresi kargo firmasına göre 1–3 iş günüdür.</p>
          </div>
        </Accordion>

        <Accordion title="İade & Değişim">
          <div className="space-y-2 text-sm text-stone-500">
            <p>Teslim tarihinden itibaren <strong className="text-stone-700">14 gün</strong> içinde iade veya değişim yapabilirsiniz.</p>
            <p>Ürünün orijinal ambalajında ve kullanılmamış olması gerekmektedir.</p>
            <p>İade talebiniz için WhatsApp üzerinden bize ulaşabilirsiniz.</p>
          </div>
        </Accordion>
      </div>
    </div>
  );
}
