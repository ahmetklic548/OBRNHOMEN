"use client";

import { WHATSAPP_URL } from "@/lib/storeNav";

/** Son verilen sipariş — başarı sayfası özet ve WhatsApp onay mesajı için (yalnızca bu tarayıcıda) */
export interface LastOrder {
  orderId: string;
  method: "kart" | "kapida";
  lines: { name: string; sku?: string; qty: number; price: number }[];
  shipping: number;
  codFee: number;
  discountAmount: number;
  total: number;
  customer: { name: string; phone: string; address: string };
  giftWrap: boolean;
  giftNote: string;
  createdAt: number;
}

const KEY = "obrnhomen-last-order";

export function saveLastOrder(o: LastOrder) {
  try { localStorage.setItem(KEY, JSON.stringify(o)); } catch {}
}

export function readLastOrder(): LastOrder | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as LastOrder) : null;
  } catch {
    return null;
  }
}

const tl = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Müşterinin mağazaya göndereceği hazır onay mesajı */
export function confirmMessage(o: LastOrder): string {
  const lines = o.lines.map((l, i) => `${i + 1}) ${l.name}${l.sku ? ` (${l.sku})` : ""} — ${l.qty} adet`);
  return [
    o.method === "kapida"
      ? `Merhaba, KAPIDA ÖDEMELİ siparişimi onaylıyorum. Sipariş no: ${o.orderId}`
      : `Merhaba, kartla ödeme yaptım. Sipariş no: ${o.orderId}`,
    "",
    ...lines,
    "",
    o.shipping ? `Kargo: ${tl(o.shipping)} ₺` : "Kargo: ücretsiz",
    o.codFee ? `Kapıda ödeme bedeli: ${tl(o.codFee)} ₺` : null,
    o.discountAmount ? `İndirim: -${tl(o.discountAmount)} ₺` : null,
    `Toplam: ${tl(o.total)} ₺${o.method === "kapida" ? " (kapıda ödenecek)" : ""}`,
    "",
    `Ad Soyad: ${o.customer.name}`,
    `Telefon: ${o.customer.phone}`,
    `Adres: ${o.customer.address}`,
    o.giftWrap ? "🎁 Hediye paketi yapılsın" : null,
    o.giftNote ? `Hediye notu: ${o.giftNote}` : null,
  ].filter((l) => l !== null).join("\n");
}

export function confirmUrl(o: LastOrder): string {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(confirmMessage(o))}`;
}
