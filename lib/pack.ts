/**
 * Paketli ilanlar (10'lu, 50'li…) — sepet/teklifte girilen sayı PAKET sayısıdır.
 * "50" yazan müşteri 50 adet mi 500 adet mi aldığını karıştırmasın diye her yerde
 * birim "paket" yazılır ve toplam adet yanında gösterilir.
 */

export const isPack = (pack?: number) => (pack ?? 1) > 1;

/** Sayaç birimi: "paket" ya da "adet" */
export const unitWord = (pack?: number) => (isPack(pack) ? "paket" : "adet");

/** "5 paket (50 adet)" ya da "5 adet" */
export function qtyText(qty: number, pack?: number): string {
  return isPack(pack) ? `${qty} paket (${qty * pack!} adet)` : `${qty} adet`;
}
