"use client";

import { useState } from "react";
import Hint from "./Hint";
import Link from "next/link";
import { WHOLESALE_TIERS, WHOLESALE_MIN_TOTAL, unitPriceFor, tierPct } from "@/lib/pricing";
import { useWholesaleList, type WholesaleItem } from "./WholesaleListContext";

const tl = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * Ürün sayfası:
 * - Adet indirimi tablosu (normal sepette otomatik uygulanır — lib/pricing.ts WHOLESALE_TIERS)
 * - Toptan alıcılar için: ürünü Toptan Listesi'ne ekleme (/toptan sayfasından WhatsApp fiyat)
 */
export default function WholesaleBox({
  item,
  qty,
  onPickQty,
}: {
  /** Toptan listesine eklenecek ürün; price = site birim fiyatı (salePrice) */
  item: Omit<WholesaleItem, "qty">;
  qty: number;
  onPickQty: (qty: number) => void;
}) {
  const list = useWholesaleList();
  const [justAdded, setJustAdded] = useState(0);
  const inList = list.qtyOf(item.slug);

  const rows = [
    { min: 1, max: WHOLESALE_TIERS[0].min - 1, pct: 0 },
    ...WHOLESALE_TIERS.map((t, i) => ({ min: t.min, max: (WHOLESALE_TIERS[i + 1]?.min ?? 0) - 1, pct: t.pct })),
  ];
  const active = tierPct(qty);

  const addToList = () => {
    list.add(item, qty);
    setJustAdded(qty);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Adet indirimi — normal sepet */}
      <div className="border" style={{ borderColor: "#efefef", background: "#fff" }}>
        <p className="flex items-center px-4 pt-3 pb-2 text-[14px] font-medium text-stone-700">
          Çok alana indirim
          <Hint>Aynı üründen 10 veya daha fazla alırsanız fiyat sepette kendiliğinden düşer, bir şey yapmanıza gerek yok. Satıra tıklayınca o adet seçilir.</Hint>
        </p>
        {rows.map(({ min, max, pct }) => {
          const on = pct === active;
          return (
            <button
              key={min}
              type="button"
              onClick={() => onPickQty(min)}
              className="w-full flex justify-between items-center px-4 py-2 text-xs text-left transition-colors"
              style={{ borderTop: "1px solid #f5f5f5", color: "#444", background: on ? "#f6f3ea" : undefined, fontWeight: on ? 600 : 400 }}
            >
              <span>{max > 0 ? `${min} – ${max} adet` : `${min}+ adet`}</span>
              <span>
                {tl(unitPriceFor(item.price, min))} ₺ / adet
                {pct > 0 && <span className="ml-1.5" style={{ color: "#1f9d55" }}>-%{pct}</span>}
              </span>
            </button>
          );
        })}
      </div>

      {/* Toptan alıcılar */}
      <div className="border" style={{ borderColor: "#e9d9a6", background: "#fffbf0" }}>
        <div className="px-4 pt-4 pb-3">
          <p className="text-[12px] tracking-[0.04em] uppercase mb-1" style={{ color: "#9a7a2c" }}>Toptan alıcı mısınız?</p>
          <p className="text-[13px] leading-snug" style={{ color: "#3b2c08" }}>
            Hac/umre kafilesi, mevlüt, cami/dernek veya mağaza için alıyorsanız ürünleri <strong>Toptan Listenize</strong> ekleyin,
            listeniz {tl(WHOLESALE_MIN_TOTAL)} ₺&apos;yi geçince WhatsApp&apos;tan özel fiyat alın.
          </p>
        </div>
        <div className="px-4 pb-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={addToList}
            className="w-full py-3 text-[13px] tracking-[0.04em] uppercase font-medium text-white transition-opacity hover:opacity-85"
            style={{ background: "#1a1208" }}
          >
            {qty} Adet Toptan Listeme Ekle
          </button>
          {(justAdded > 0 || inList > 0) && (
            <p className="text-[13px]" style={{ color: "#1f6f43" }}>
              {justAdded > 0 ? `✓ ${justAdded} adet eklendi. ` : ""}Bu üründen listenizde {inList} adet var
              {" · "}{list.items.length} çeşit, {tl(list.total)} ₺
            </p>
          )}
          <Link
            href="/toptan"
            className="text-center text-[13px] underline underline-offset-2"
            style={{ color: "#7a5f1a" }}
          >
            Toptan Sipariş sayfasına git → (tüm ürünleri tek ekranda seçin)
          </Link>
        </div>
      </div>
    </div>
  );
}
