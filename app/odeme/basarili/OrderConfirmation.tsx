"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { readLastOrder, confirmUrl, type LastOrder } from "@/lib/lastOrder";
import { qtyText } from "@/lib/pack";

const tl = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const noop = () => () => {};

function useOrder(): { order: LastOrder | null; method: "kart" | "kapida" } | null {
  return useSyncExternalStore(
    noop,
    () => {
      const params = new URLSearchParams(window.location.search);
      const oid = params.get("oid");
      const o = readLastOrder();
      const method = (params.get("yontem") === "kapida" ? "kapida" : "kart") as "kart" | "kapida";
      // Aynı referans dönsün diye önbellek (useSyncExternalStore her çağrıda eşitlik bekler)
      const key = `${oid}|${o?.orderId}|${method}`;
      if (cache.key !== key) cache = { key, value: { order: o && (!oid || o.orderId === oid) ? o : null, method } };
      return cache.value;
    },
    () => null
  );
}
let cache: { key: string; value: { order: LastOrder | null; method: "kart" | "kapida" } } = { key: "", value: { order: null, method: "kart" } };

/** Sipariş sonrası: özet + WhatsApp onayı (kapıda ödemede zorunlu son adım) */
export default function OrderConfirmation() {
  const data = useOrder();
  if (!data) return null;
  const { order, method } = data;
  const cod = method === "kapida";

  return (
    <div className="mx-auto w-full max-w-lg px-6 text-left">
      <h1 className="text-center text-3xl font-medium text-stone-900">
        {cod ? "Siparişiniz Alındı" : "Ödemeniz Alındı"}
      </h1>
      {order && (
        <p className="mt-2 text-center text-[15px] text-stone-600">Sipariş numaranız: <strong className="text-stone-900">{order.orderId}</strong></p>
      )}

      {cod ? (
        <div className="mt-6 rounded-xl border-2 border-[#1f9d55] bg-[#f0fdf4] p-5 text-center">
          <p className="text-[17px] font-semibold text-stone-900">Son adım: siparişinizi onaylayın</p>
          <p className="mt-1 text-[15px] leading-relaxed text-stone-700">
            Aşağıdaki yeşil düğmeye basın; WhatsApp açılacak ve sipariş bilgileriniz hazır yazılmış olacak.
            Sadece <strong>gönder</strong>&apos;e basmanız yeterli. Onayınızdan sonra siparişiniz kargoya hazırlanır.
          </p>
          {order ? (
            <a href={confirmUrl(order)} target="_blank" rel="noopener noreferrer" className="mt-4 block w-full rounded-lg bg-[#1f9d55] py-4 text-[17px] font-semibold text-white hover:opacity-90">
              ✓ Siparişi WhatsApp&apos;tan Onayla
            </a>
          ) : (
            <p className="mt-3 text-[14px] text-stone-600">Lütfen sipariş numaranızla bize WhatsApp&apos;tan yazın: 0531 689 38 49</p>
          )}
          <p className="mt-3 text-[13px] text-stone-500">Ödemeyi ürün elinize ulaştığında kargo görevlisine nakit veya kartla yapacaksınız.</p>
        </div>
      ) : (
        <p className="mt-4 text-center text-[15px] leading-relaxed text-stone-600">
          Siparişiniz en kısa sürede kargoya verilecek. Teşekkür ederiz.
        </p>
      )}

      {order && (
        <div className="mt-6 rounded-xl border border-stone-200 bg-white p-5">
          <p className="mb-3 text-[15px] font-medium text-stone-900">Sipariş özeti</p>
          <ul className="space-y-2 text-[14px] text-stone-700">
            {order.lines.map((l, i) => (
              <li key={i} className="flex justify-between gap-3">
                <span>{l.name} <span className="text-stone-400">× {qtyText(l.qty, l.pack)}</span></span>
                <span className="shrink-0">{tl(l.price * l.qty)} ₺</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 space-y-1 border-t pt-3 text-[14px] text-stone-600" style={{ borderColor: "#eee" }}>
            <p className="flex justify-between"><span>Kargo</span><span>{order.shipping ? `${tl(order.shipping)} ₺` : "Ücretsiz"}</span></p>
            {order.codFee > 0 && <p className="flex justify-between"><span>Kapıda ödeme bedeli</span><span>{tl(order.codFee)} ₺</span></p>}
            {order.discountAmount > 0 && <p className="flex justify-between"><span>İndirim</span><span>-{tl(order.discountAmount)} ₺</span></p>}
            <p className="flex justify-between pt-1 text-[16px] font-semibold text-stone-900"><span>{cod ? "Kapıda ödenecek" : "Ödenen"}</span><span>{tl(order.total)} ₺</span></p>
          </div>
          {order.giftWrap && <p className="mt-3 text-[14px] text-[#9a7a2c]">🎁 Hediye paketi yapılacak{order.giftNote ? ` — "${order.giftNote}"` : ""}</p>}
          <p className="mt-3 text-[13px] text-stone-500">Teslimat: {order.customer.name} · {order.customer.phone}<br />{order.customer.address}</p>
          {!cod && (
            <a href={confirmUrl(order)} target="_blank" rel="noopener noreferrer" className="mt-4 block w-full rounded-lg border-2 border-[#1f9d55] py-3 text-center text-[15px] font-medium text-[#1f9d55] hover:bg-[#f0fdf4]">
              Siparişimi WhatsApp&apos;tan Takip Et
            </a>
          )}
        </div>
      )}

      <div className="mt-6 text-center">
        <Link href="/koleksiyon" className="inline-block rounded-md bg-[#1a1208] px-8 py-3 text-[15px] text-white">Alışverişe Devam Et</Link>
      </div>
    </div>
  );
}
