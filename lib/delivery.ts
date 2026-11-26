/**
 * Teslimat süresi — TEK YER. Metinler ve "yetişir mi" hesabı buradan.
 * Hazırlık: stoktaki ürün 1–2 iş gününde kargoya verilir (sözleşmede en geç 3 iş günü, lib/legal.ts).
 * Kargo (HepsiJet): 1–3 iş günü.
 */
export const DELIVERY = {
  /** Kargoya verme — olağan / en geç (iş günü) */
  prepMin: 1,
  prepMax: 2,
  prepWorst: 3,
  /** Kargo teslimat (iş günü) */
  shipMin: 1,
  shipMax: 3,
} as const;

/** Olağan: hazırlık + kargo (en iyi / olağan üst sınır) ve garanti (en kötü) */
/**
 * "Yetişir mi" eşikleri (kullanıcı kararı 2026-11-26): cumartesi sayılır, pazar sayılmaz.
 *  - sipariş günü + 1 gün (yarın)      → WhatsApp'tan yazsın
 *  - 2 gün sonrası                    → büyük ihtimalle elinde
 *  - 3 gün ve sonrası                 → çoğunlukla yetişmiş olur
 */
export const MIN_DAYS_LIKELY = 2;
export const MIN_DAYS_SAFE = 3;

/** Bugünden hedef tarihe kaç kargo günü var: pazartesi–cumartesi sayılır, pazar sayılmaz. */
export function businessDaysUntil(target: Date, from: Date = new Date()): number {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const b = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  if (b <= a) return 0;
  let n = 0;
  const d = new Date(a);
  while (d < b) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) n++; // pazar kargo yok
  }
  return n;
}

export type Verdict = "guvenli" | "buyukihtimal" | "riskli" | "gecmis";

/** Etkinlik tarihine göre sonuç. Gün sayısı = siparişten etkinliğe kalan iş günü. */
export function verdictFor(days: number): Verdict {
  if (days <= 0) return "gecmis";
  if (days >= MIN_DAYS_SAFE) return "guvenli";
  if (days >= MIN_DAYS_LIKELY) return "buyukihtimal";
  return "riskli";
}
