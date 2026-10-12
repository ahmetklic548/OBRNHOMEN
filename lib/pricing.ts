/** Sitedeki tüm ürünlere uygulanan indirim oranı (0.10 = %10). */
export const DISCOUNT_PERCENT = 10;

/** Müşterinin ödeyeceği indirimli fiyat — gösterim, sepet ve ödeme aynı değeri kullanır. */
export function salePrice(price: number): number {
  return Math.round(price * (1 - DISCOUNT_PERCENT / 100) * 100) / 100;
}
