/**
 * Vitrin düzenlemesi (2026-10-21). products.json Trendyol senkronundan geldiği için
 * elle yapılan seçimler burada tutulur.
 *
 * HIDDEN_SLUGS: fotoğrafı profesyonel olmayan (beyaz fon kolaj, üstü yazılı, bulanık)
 * veya görseli 404 veren ürünler. Listelerde, aramada, sitemap'te ve Merchant feed'de
 * görünmez; ürün sayfası eski linkler kırılmasın diye açık kalır.
 * Yeni fotoğraf gelince satırı silmek yeterli.
 */
export const HIDDEN_SLUGS = new Set<string>([
  // Görseli 404 — Trendyol'da en çok satanlar (#1, #2, #3, #8): önce bunlara fotoğraf çekilmeli
  "misvak-vakumlu-yas",
  "dikis-kutusu-igne-iplik-mezura-makas-seyahat-seti",
  "50-adet-kina-cerez-kesesi-kirmizi-kucuk-boy",
  "1250gr-100-pamuk-hac-umre-erkek-ihram",

  // Başörtü setleri: beyaz fon kolaj / üstü yazılı gri görsel
  "basortu-seti-tasli-zikirmatik-inci-tesbih-ceyizlik-seti",
  "basortu-seti-tasli-zikirmatik-inci-tesbih-ceyizlik-seti_2",
  "15-li-basortu-seti-tasli-zikirmatik-inci-tesbih-ceyizlik-seti",
  "30-lu-basortu-seti-tasli-zikirmatik-inci-tesbih-ceyizlik-seti",
  "2-li-basortu-seti-tasli-zikirmatik-inci-tesbih-ceyizlik-seti",
  "4-lu-basortu-seti-tasli-zikirmatik-inci-tesbih-ceyizlik-seti",
  "10-lu-basortu-seti-tasli-zikirmatik-inci-tesbih-ceyizlik-seti",
  "8-li-basortu-seti-tasli-zikirmatik-inci-tesbih-ceyizlik-seti",
  "7-li-basortu-seti-tasli-zikirmatik-inci-tesbih-ceyizlik-seti",
  "10-lu-basortu-seti-tasli-zikirmatik-inci-tesbih-ceyizlik",
  "5-li-basortu-seti-tasli-zikirmatik-inci-tesbih-ceyizlik-seti",
  "10-lu-basortu-seti-tasli-zikirmatik-inci-tesbih-ceyizlik-seti_2",
  "5-li-basortu-seti-tasli-zikirmatik-inci-tesbih-ceyizlik-seti_2",
  "10-lu-basortu-seti-tasli-zikirmatik-inci-tesbih-ceyizlik_2",
  "basortu-tasli-zikirmatik-inci-cam-tesbih-ceyizlik-gelin-flamli-bas-ortu-set",
  "basortu-tasli-zikirmatik-inci-cam-tesbih-ceyizlik-gelin-flamli-bas-ortu-set_2",
  "asetat-canta-basortu-zikirmatikli-inci-tesbih-set-ceyiz", // Trendyol ciro #1 civarı — fotoğraf öncelikli
  "asetat-canta-basortu-zikirmatikli-inci-tesbih-set-ceyiz_2",
  "41-li-basortusu-tesbih-seti-karisik-kandil-ve-ozel-gunler-icin",
  "10-lu-basortusu-tesbih-seti-karisik-kandil-ve-ozel-gunler-icin",

  // Seccade: üstü yazılı/ikonlu, beyaz fonda küçük ya da ambalajlı
  "kadife-seccade-500-gr",
  "karma-yumusak-sik-desensiz-duz-seccade-hafif-namazlik",
  "kadife-seccade-sipinger-desen-namazlik",
  "luks-kadife-dokulu-6-li-seccade-seti-desenli-namazlik-takimi-cok-renkli",
  "sade-az-desenli-kadife-seccade-namazlik-sik-dokuma-dodya-iplik-goz-yormayan-desen_2",
  "luks-sonil-ceyizlik-seccade-kendinden-desenli-seccadesi",
  "set-40-kisilik",
  "kiz-cocuk-namaz-seti-seccadeli-tesbihli-elifbali-ibadet-seti",
  "erkek-cocuk-ibadet-seti-seccade-tesbih-elifba-namaz-seti",
  "kiz-cocuk-ibadet-seti-seccade-tesbih-elifba-namaz-seti",
  "seccade-basortu-inci-tesbih-zikirmatik-seti",
  "seccade-inci-tesbih-yasini-serif-tasli-zikirmatik-seti",

  // Diğer: üstü yazılı, dağınık ya da bulanık
  "kutulu-kadife-yasin-i-serif-ve-inci-tesbih-seti",
  "tul-keseli-kadife-kapli-yasin-i-serif-hediyesi-karisik-renk",
  "hakiki-akik-tasi-yuzuk-seti-dogal-tas-paket",
  "tasli-dijital-zikirmatik-10-lu-karisik-renk-set-hatirasi",
  "duzrenk-ceyizlik-flamli-pamuk-esarp-yazma",
  "dogal-taze-misvak-kaliteli-paketli-agiz-bakim-urunu",
]);

/** Kapak görseli zayıf ama galeride iyi fotoğrafı olan ürünler: slug → öne alınacak görsel sırası */
export const COVER_IMAGE_INDEX: Record<string, number> = {
  "karisik-kadife-seccade-500-gr": 1,
  "karma-kadife-seccade-500-gr": 1,
};
