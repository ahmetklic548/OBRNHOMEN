/**
 * Yol 1 — "Kafile satar" (toptan) modeli: kafile ürünleri site fiyatının %20 altında alır,
 * umrecisine site fiyatından satar. Bilerek sınırlı tutulur (yüklü alım içindir); küçük
 * kafileler Yol 2'ye (ortaklık kodu %10/%10) yönlendirilir.
 * Kurallar tek yerde: site (hediyelik-hazirla), admin (kafile-toptan) ve metinler buradan okur.
 */
export const TOPTAN = {
  /** Kafileye site fiyatı üzerinden indirim */
  INDIRIM: 20,
  /** En az sipariş — kafile fiyatıyla (indirim sonrası), tek seferde (2026-11-12: 15.000 → 30.000) */
  MIN_TUTAR: 30000,
  /** Onayda alınan kapora oranı */
  KAPORA: 50,
  /** Kapora sonrası hazırlık süresi (iş günü) */
  HAZIRLIK_GUN: 10,
  /** Grubun yola çıkışından en geç kaç gün önce sipariş kesinleşmeli */
  SON_SIPARIS_GUN: 15,
  /** Teklif geçerlilik süresi (gün) */
  TEKLIF_GECERLILIK: 7,
} as const;

export const CONTACT_PHONE_TEXT = "0531 689 38 49";

const tl = (n: number) => n.toLocaleString("tr-TR") + " ₺";

/** Kafileye giden şartlar — sade dille, sırasıyla */
export const TOPTAN_KURALLAR: string[] = [
  `Ürünleri sitedeki fiyatın %${TOPTAN.INDIRIM} altında alırsınız. Umrecinize sitedeki fiyattan satarsınız, aradaki fark sizin kazancınızdır.`,
  `Bu yol toplu alım içindir: bir siparişte en az ${tl(TOPTAN.MIN_TUTAR)}lik ürün alınır. Daha az olacaksa Yol 2 (kod) sizin için daha uygundur.`,
  `Umrecileriniz size verdiğimiz linkten ne istediğini seçer. Listeler bize gelir, siz onaylayınca hepsi tek sipariş olur.`,
  `Siparişi onaylarken tutarın yarısını (%${TOPTAN.KAPORA}) kapora olarak ödersiniz, kalanını malı teslim alırken.`,
  `Kaporadan sonra ${TOPTAN.HAZIRLIK_GUN} iş gününde hazırlarız. Bu yüzden siparişi grubunuz yola çıkmadan en az ${TOPTAN.SON_SIPARIS_GUN} gün önce verin.`,
  `Her şey tek koliyle size gelir. Her umrecinin ürünleri ayrı ayrı, üzerinde adı yazılı; yanında kraft poşetleri ve isimli kartları. Paketlemeyi umreci kendi zevkine göre yapar.`,
  `Umreciden parayı siz alırsınız, ürünleri umrecilere siz dağıtırsınız. Umreciye sitedeki fiyattan pahalı satılmaz.`,
  `Hasarlı ya da eksik ürünü hemen değiştiririz. Teklifimiz ${TOPTAN.TEKLIF_GECERLILIK} gün geçerlidir.`,
];

/** Kafilenin anlaması için somut örnek (teklif PDF ve özet metni) */
export const TOPTAN_ORNEK = {
  umreci: 40,
  kisiBasi: 1000,
  get site() { return this.umreci * this.kisiBasi; },
  get kafile() { return kafileTutari(this.site); },
  get kazanc() { return this.site - this.kafile; },
};

/** Kafilenin bize ödeyeceği tutar (site satış tutarından %20 düşük) */
export function kafileTutari(siteTutari: number) {
  return Math.round(siteTutari * (1 - TOPTAN.INDIRIM / 100) * 100) / 100;
}

export type ListeDurum = "yeni" | "onaylandi" | "hazirlaniyor" | "teslim" | "iptal";
export const DURUM_ETIKET: Record<ListeDurum, string> = {
  yeni: "Yeni liste",
  onaylandi: "Kafile onayladı",
  hazirlaniyor: "Hazırlanıyor",
  teslim: "Teslim edildi",
  iptal: "İptal",
};
