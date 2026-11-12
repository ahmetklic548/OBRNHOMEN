/** Sitedeki tüm ürünlere uygulanan indirim oranı (0.10 = %10). */
export const DISCOUNT_PERCENT = 5;

import { POSET_SLUG } from "@/lib/hediyePoseti";

/** Hiçbir indirimin uygulanmadığı ürünler (site indirimi, toptan kademe, kupon/ortak kodu, kafile -%20, komisyon).
 *  Kraft hediye poşeti sabit fiyatlı (kullanıcı, 2026-11-12). */
export const NO_DISCOUNT_SLUGS = new Set<string>([POSET_SLUG]);
export const isNoDiscount = (slug?: string) => !!slug && NO_DISCOUNT_SLUGS.has(slug);

/** İndirim dışı satırların toplamı — kupon/kafile indirimi ve komisyon bu tutar hariç hesaplanır */
export function indirimsizTutar(lines: { slug: string; price: number; qty: number }[]): number {
  return Math.round(lines.filter((l) => isNoDiscount(l.slug)).reduce((s, l) => s + l.price * l.qty, 0) * 100) / 100;
}

/** Müşterinin ödeyeceği indirimli fiyat — gösterim, sepet ve ödeme aynı değeri kullanır. */
export function salePrice(price: number, slug?: string): number {
  if (isNoDiscount(slug)) return price;
  return Math.round(price * (1 - DISCOUNT_PERCENT / 100) * 100) / 100;
}

/** Toptan kademe — aynı üründen alınan adete göre site fiyatının ÜSTÜNE ek indirim. */
export const WHOLESALE_TIERS = [
  { min: 10, pct: 5 },
  { min: 25, pct: 10 },
  { min: 50, pct: 15 },
];
/** Bu adetten itibaren "daha iyi fiyat için teklif iste" önerilir */
export const QUOTE_FROM_QTY = 50;

export function tierPct(qty: number, slug?: string): number {
  if (isNoDiscount(slug)) return 0;
  let pct = 0;
  for (const t of WHOLESALE_TIERS) if (qty >= t.min) pct = t.pct;
  return pct;
}

/** Bir sonraki kademe — sepette "X adet daha ekle → %Y" ipucu için */
export function nextTier(qty: number) {
  return WHOLESALE_TIERS.find(t => qty < t.min) ?? null;
}

/** Site birim fiyatı (salePrice) + adet → kademeli birim fiyat */
export function unitPriceFor(saleUnit: number, qty: number, slug?: string): number {
  return Math.round(saleUnit * (1 - tierPct(qty, slug) / 100) * 100) / 100;
}

export const SHIPPING_FEE       = 200;
export const FREE_SHIPPING_OVER = 2000;
/** Toptan Sipariş sayfasında WhatsApp fiyat talebi için minimum liste tutarı (site fiyatlarıyla) */
export const WHOLESALE_MIN_TOTAL = 5000;
export const VALID_COUPONS: Record<string, number> = { HOSGELDIN10: 10 };

/** Sepet toplamı (indirimli fiyatlarla) → kupon indirimi, kargo, ödenecek tutar.
 *  Checkout ekranı ve PayTR token API'si aynı hesabı kullanır. */
/** Kapıda ödeme hizmet bedeli (kargo firmasının tahsilat ücreti) */
export const COD_FEE = 70;

/** discountRate: kupon/ortak kodunun indirim yüzdesi (kod çözümü lib/partners.ts resolveCoupon)
 *  indirimsiz: ara toplamın indirim dışı kısmı (indirimsizTutar) — kupon ona uygulanmaz */
export function orderTotals(subtotal: number, discountRate: number, cod = false, indirimsiz = 0) {
  const discountAmount = Math.round(Math.max(0, subtotal - indirimsiz) * discountRate / 100);
  const shipping       = subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
  const codFee         = cod ? COD_FEE : 0;
  const grandTotal     = Math.round((subtotal - discountAmount + shipping + codFee) * 100) / 100;
  return { discountRate, discountAmount, shipping, codFee, grandTotal };
}
