"use client";

import { useState } from "react";
import { WHATSAPP_URL, PHONE_DISPLAY, PHONE_HREF } from "@/lib/storeNav";
import { businessDaysUntil, verdictFor } from "@/lib/delivery";

const toIso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/**
 * "Mevlit / etkinlik tarihime yetişir mi?" — müşteri tarihi seçer, hemen cevap görür.
 * Yetişmeyebilirse WhatsApp'a tarihli hazır mesajla yönlendirir (kargo hızlandırma/elden teslim konuşulur).
 */
export default function DeliveryCheck({ productName, compact = false }: { productName?: string; compact?: boolean }) {
  const [date, setDate] = useState("");
  const min = toIso(new Date());

  let verdict: ReturnType<typeof verdictFor> | null = null;
  if (date) {
    const [y, m, d] = date.split("-").map(Number);
    verdict = verdictFor(businessDaysUntil(new Date(y, m - 1, d)));
  }

  const nice = date ? new Date(date + "T12:00:00").toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" }) : "";
  const wa = `${WHATSAPP_URL}?text=${encodeURIComponent(
    `Merhaba, ${nice || "belirli bir tarihe"} tarihine yetişmesi gereken bir siparişim var${productName ? ` (${productName})` : ""}. Yetişir mi?`,
  )}`;

  const box: Record<string, { bg: string; fg: string; title: string; text: string }> = {
    guvenli: {
      bg: "#f0fdf4", fg: "#166534", title: "Çoğunlukla yetişir ✓",
      text: `${nice} gününe kadar çoğunlukla elinizde olur. Siparişi bugün verirseniz süre yeterli.`,
    },
    buyukihtimal: {
      bg: "#fffbeb", fg: "#92400e", title: "Büyük ihtimalle yetişir",
      text: `Süre biraz dar ama büyük ihtimalle elinizde olur. Siparişi bugün verin; emin olmak için WhatsApp'tan da yazın.`,
    },
    riskli: {
      bg: "#fef2f2", fg: "#991b1b", title: "Çok kısa süre var, bize yazın",
      text: `Ertesi güne istiyorsanız siparişi vermeden önce WhatsApp'tan yazın veya arayın, ne yapabileceğimize birlikte bakalım.`,
    },
    gecmis: {
      bg: "#fef2f2", fg: "#991b1b", title: "Geçmiş bir tarih seçtiniz",
      text: "Lütfen etkinlik tarihini yeniden seçin.",
    },
  };
  const r = verdict ? box[verdict] : null;

  return (
    <div className="rounded-lg border border-stone-200 bg-white px-4 py-3.5">
      <p className="text-[15px] font-medium text-stone-800">🕌 Mevlit / etkinlik tarihine yetişir mi?</p>
      {!compact && (
        <p className="mt-1 text-[13px] leading-snug text-stone-500">
          Çoğu sipariş 2–3 gün içinde ulaşır. Tarihi seçin, size ne kadar süre olduğunu hemen söyleyelim.
        </p>
      )}
      <label className="mt-3 block text-[13px] text-stone-600">
        Ürünün elimde olması gereken gün
        <input
          type="date"
          min={min}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2.5 text-[16px] text-stone-900"
        />
      </label>

      {r && (
        <div className="mt-3 rounded-md px-3 py-3 text-[14px] leading-snug" style={{ background: r.bg, color: r.fg }}>
          <p className="font-semibold">{r.title}</p>
          <p className="mt-1">{r.text}</p>
          {(verdict === "buyukihtimal" || verdict === "riskli") && (
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-md bg-[#25D366] px-4 py-2.5 text-[14px] font-medium text-white">
                WhatsApp&apos;tan yazın
              </a>
              <a href={PHONE_HREF} className="rounded-md border border-stone-400 bg-white px-4 py-2.5 text-[14px] font-medium text-stone-800">
                Arayın: {PHONE_DISPLAY}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Sepet/ödeme için güven şeridi: ödeme güvenliği, iade, teslimat, satıcı, ulaşım. */
export function TrustBlock() {
  const rows: [string, string][] = [
    ["🔒", "Kart bilgileriniz PayTR'nin güvenli ödeme sayfasında girilir; bizde saklanmaz."],
    ["↩️", "14 gün içinde iade hakkı. İade kargo ücreti alıcıya aittir (kusurlu/hatalı üründe bizden)."],
    ["🚚", "Çoğu sipariş 2–3 günde ulaşır. 2.000 ₺ üzeri kargo bedava."],
    ["🏬", "Fatih/İstanbul'da adresi belli, Trendyol'da da satış yapan kayıtlı bir işletmeyiz."],
    ["📞", `Aklınıza takılan olursa arayın: ${PHONE_DISPLAY}`],
  ];
  return (
    <ul className="space-y-2 rounded-lg border border-stone-200 bg-[#fafaf8] px-4 py-3.5 text-[14px] leading-snug text-stone-700">
      {rows.map(([i, t]) => (
        <li key={t} className="flex gap-2.5">
          <span aria-hidden="true">{i}</span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
