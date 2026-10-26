/** Sitedeki tüm ürünlere uygulanan indirim oranı (0.10 = %10). */
export const DISCOUNT_PERCENT = 10;

/** Müşterinin ödeyeceği indirimli fiyat — gösterim, sepet ve ödeme aynı değeri kullanır. */
export function salePrice(price: number): number {
  return Math.round(price * (1 - DISCOUNT_PERCENT / 100) * 100) / 100;
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
