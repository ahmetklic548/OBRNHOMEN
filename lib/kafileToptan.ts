/**
 * Yol 1 — "Kafile satar" (toptan) modeli: kafile ürünleri site fiyatının %20 altında alır,
 * umrecisine site fiyatından satar. Bilerek sınırlı tutulur (yüklü alım içindir); küçük
 * kafileler Yol 2'ye (ortaklık kodu %10/%10) yönlendirilir.
 * Kurallar tek yerde: site (hediyelik-hazirla), admin (kafile-toptan) ve metinler buradan okur.
 */
export const TOPTAN = {
  /** Kafileye site fiyatı üzerinden indirim */
  INDIRIM: 20,
  /** En az sipariş — kafile fiyatıyla (indirim sonrası), tek seferde */
  MIN_TUTAR: 15000,
  /** Onayda alınan kapora oranı */
  KAPORA: 50,
  /** Kapora sonrası hazırlık süresi (iş günü) */
  HAZIRLIK_GUN: 10,
  /** Grubun yola çıkışından en geç kaç gün önce sipariş kesinleşmeli */
  SON_SIPARIS_GUN: 15,
  /** Teklif geçerlilik süresi (gün) */
  TEKLIF_GECERLILIK: 7,
} as const;

/** Kafileye gösterilen/iletilen şartlar (sırasıyla) */
export const TOPTAN_KURALLAR: string[] = [
  `Yüklü alım içindir: tek siparişte en az ${TOPTAN.MIN_TUTAR.toLocaleString("tr-TR")} ₺ (kafile fiyatıyla).`,
  `Kafile ürünleri site fiyatının %${TOPTAN.INDIRIM} altında alır; umreciye site fiyatının üstünde satılmaz.`,
  `Umrecilerin listeleri toplanır, kafile tek sipariş olarak onaylar. Parça parça sipariş alınmaz.`,
  `Onayda %${TOPTAN.KAPORA} kapora, kalanı teslimde (nakit ya da faturalı havale +%10 KDV).`,
  `Kapora sonrası ${TOPTAN.HAZIRLIK_GUN} iş günü içinde hazırlanır; sipariş grubun yola çıkışından en geç ${TOPTAN.SON_SIPARIS_GUN} gün önce kesinleşmelidir.`,
  `Teslimat tek adrese, tek koli: her umrecinin hediyeleri ayrı kraft poşetlerde, üzerinde adı yazılı.`,
  `Umreciden tahsilat ve umreciye dağıtım kafilenin sorumluluğundadır. Değişim sadece hasarlı/eksik üründe.`,
  `Teklif ${TOPTAN.TEKLIF_GECERLILIK} gün geçerlidir.`,
];

/** Kafilenin bize ödeyeceği tutar (site satış tutarından %20 düşük) */
export const kafileTutari = (siteTutari: number) => Math.round(siteTutari * (1 - TOPTAN.INDIRIM / 100) * 100) / 100;

export type ListeDurum = "yeni" | "onaylandi" | "hazirlaniyor" | "teslim" | "iptal";
export const DURUM_ETIKET: Record<ListeDurum, string> = {
  yeni: "Yeni liste",
  onaylandi: "Kafile onayladı",
  hazirlaniyor: "Hazırlanıyor",
  teslim: "Teslim edildi",
  iptal: "İptal",
};
