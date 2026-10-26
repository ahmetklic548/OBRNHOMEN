"use client";

import { WHOLESALE_TIERS, QUOTE_FROM_QTY, unitPriceFor, tierPct } from "@/lib/pricing";

const tl = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Ürün sayfası toptan tablosu — kademeler lib/pricing.ts WHOLESALE_TIERS'tan gelir. */
export default function WholesaleBox({
  unitPrice,
  qty,
  onPickQty,
  onAddToQuote,
}: {
  /** Site birim fiyatı (salePrice) */
  unitPrice: number;
  qty: number;
  onPickQty: (qty: number) => void;
  /** Seçili adetle sepete ekleyip teklif sepetini açar */
  onAddToQuote: () => void;
}) {
  const rows = [
    { min: 1, max: WHOLESALE_TIERS[0].min - 1, pct: 0 },
    ...WHOLESALE_TIERS.map((t, i) => ({ min: t.min, max: (WHOLESALE_TIERS[i + 1]?.min ?? 0) - 1, pct: t.pct })),
  ];
  const active = tierPct(qty);

  return (
    <div className="border" style={{ borderColor: "#e9d9a6", background: "#fffbf0" }}>
      <div className="px-4 pt-4 pb-3">
        <p className="text-[9px] tracking-[0.35em] uppercase mb-1" style={{ color: "#9a7a2c" }}>
          Toptan Satış
        </p>
        <p className="text-sm leading-snug" style={{ color: "#3b2c08" }}>
          Mevlüt, düğün, hac/umre kafilesi veya mağazanız için toplu alıyorsanız adet arttıkça fiyat otomatik düşer.
        </p>
      </div>

      <div className="border-t" style={{ borderColor: "#efe3bd" }}>
        {rows.map(({ min, max, pct }) => {
          const on = pct === active;
          return (
            <button
              key={min}
              type="button"
              onClick={() => onPickQty(min)}
              className="w-full flex justify-between items-center px-4 py-2 text-xs text-left transition-colors"
              style={{
                borderTop: min > 1 ? "1px solid #f3eacb" : undefined,
                color: "#5c4710",
                background: on ? "#f6e9bf" : undefined,
                fontWeight: on ? 600 : 400,
              }}
            >
              <span>{max > 0 ? `${min} – ${max} adet` : `${min}+ adet`}</span>
              <span>
                {tl(unitPriceFor(unitPrice, min))} ₺ / adet
                {pct > 0 && <span className="ml-1.5" style={{ color: "#1f9d55" }}>-%{pct}</span>}
              </span>
            </button>
          );
        })}
      </div>

      {/* Teklif sepeti — karışık ürünleri tek listede toplayıp fiyat istemek için */}
      <div className="px-4 py-3 border-t" style={{ borderColor: "#efe3bd" }}>
        <p className="text-[11px] leading-relaxed mb-2.5" style={{ color: "#5c4710" }}>
          <strong>Birden fazla üründen mi alacaksınız?</strong> {QUOTE_FROM_QTY}+ adette daha iyi fiyat veriyoruz:
          <span className="block mt-1">① Ürünleri seçin &nbsp;② Adetleri girin &nbsp;③ Sepetten toptan fiyat alın</span>
        </p>
        <button
          type="button"
          onClick={onAddToQuote}
          className="w-full py-2.5 text-[10px] tracking-[0.2em] uppercase font-medium text-white transition-opacity hover:opacity-80"
          style={{ background: "#1f9d55" }}
        >
          {qty} Adet Teklif Sepetine Ekle
        </button>
      </div>
    </div>
  );
}
