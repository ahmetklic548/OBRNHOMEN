/** Sitedeki tüm ürünlere uygulanan indirim oranı (0.10 = %10). */
export const DISCOUNT_PERCENT = 10;

/** Müşterinin ödeyeceği indirimli fiyat — gösterim, sepet ve ödeme aynı değeri kullanır. */
export function salePrice(price: number): number {
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

export function tierPct(qty: number): number {
  let pct = 0;
  for (const t of WHOLESALE_TIERS) if (qty >= t.min) pct = t.pct;
  return pct;
}

/** Bir sonraki kademe — sepette "X adet daha ekle → %Y" ipucu için */
export function nextTier(qty: number) {
  return WHOLESALE_TIERS.find(t => qty < t.min) ?? null;
}

/** Site birim fiyatı (salePrice) + adet → kademeli birim fiyat */
export function unitPriceFor(saleUnit: number, qty: number): number {
  return Math.round(saleUnit * (1 - tierPct(qty) / 100) * 100) / 100;
}

export const SHIPPING_FEE       = 200;
export const FREE_SHIPPING_OVER = 1000;
export const VALID_COUPONS: Record<string, number> = { HOSGELDIN10: 10 };

/** Sepet toplamı (indirimli fiyatlarla) → kupon indirimi, kargo, ödenecek tutar.
 *  Checkout ekranı ve PayTR token API'si aynı hesabı kullanır. */
export function orderTotals(subtotal: number, coupon: string | null) {
  const discountRate   = coupon ? (VALID_COUPONS[coupon] ?? 0) : 0;
  const discountAmount = Math.round(subtotal * discountRate / 100);
  const shipping       = subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
  const grandTotal     = subtotal - discountAmount + shipping;
  return { discountRate, discountAmount, shipping, grandTotal };
}
