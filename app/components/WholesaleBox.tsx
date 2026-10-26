"use client";

import { useState } from "react";
import { WHATSAPP_URL } from "@/lib/storeNav";

/** Adet kademeleri — rakam verilmez, fiyat WhatsApp'tan teklifle konuşulur. */
const TIERS = [
  { range: "1 – 9 adet",   label: "Site fiyatı" },
  { range: "10 – 49 adet", label: "Toptan fiyat" },
  { range: "50+ adet",     label: "Özel fiyat + toplu paketleme" },
];

export default function WholesaleBox({ productName, unitPrice }: { productName: string; unitPrice: string }) {
  const [qty, setQty] = useState(10);

  const message =
    `Merhaba, "${productName}" ürününden ${qty} adet almak istiyorum. ` +
    `Toptan fiyat alabilir miyim?`;

  return (
    <div className="border" style={{ borderColor: "#e9d9a6", background: "#fffbf0" }}>
      <div className="px-4 pt-4 pb-3">
        <p className="text-[9px] tracking-[0.35em] uppercase mb-1" style={{ color: "#9a7a2c" }}>
          Toptan Satış
        </p>
        <p className="text-sm leading-snug" style={{ color: "#3b2c08" }}>
          Mevlüt, düğün, hac/umre kafilesi veya mağazanız için toplu alıyorsanız adet arttıkça fiyat düşer.
        </p>
      </div>

      <div className="border-t" style={{ borderColor: "#efe3bd" }}>
        {TIERS.map(({ range, label }, i) => (
          <div
            key={range}
            className="flex justify-between px-4 py-2 text-xs"
            style={{ borderTop: i ? "1px solid #f3eacb" : undefined, color: "#5c4710" }}
          >
            <span>{range}</span>
            <span className="font-medium">{i === 0 ? `${unitPrice} / adet` : label}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 px-4 py-3 border-t" style={{ borderColor: "#efe3bd" }}>
        <label className="flex items-center border bg-white" style={{ borderColor: "#e0d2a4" }}>
          <span className="sr-only">Adet</span>
          <input
            type="number"
            min={10}
            step={10}
            value={qty}
            onChange={e => setQty(Math.max(1, Math.floor(Number(e.target.value)) || 1))}
            className="w-16 px-2 py-2.5 text-sm text-center outline-none"
            style={{ color: "#0a0a0a" }}
          />
          <span className="pr-2 text-[10px]" style={{ color: "#9a7a2c" }}>adet</span>
        </label>
        <a
          href={`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center py-2.5 text-[10px] tracking-[0.2em] uppercase font-medium text-white transition-opacity hover:opacity-80"
          style={{ background: "#1f9d55" }}
        >
          Toptan Fiyat Al
        </a>
      </div>
    </div>
  );
}
