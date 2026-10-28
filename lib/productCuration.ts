/**
 * Vitrin düzenlemesi. products.json 2026-10-27'de kullanıcının Trendyol koleksiyonlarından
 * (site, ss1, sw, Aksesuarn, knmkk, dıdıd, buhııjın, hııhınon, okggu, kdododp, ıvıbonoj,
 * ıg ki kbb ln, upvp üç jp, hcphcu) yeniden kuruldu; aynı ilanlar ve büyük paketler ayıklandı.
 * Önceki katalog: data/products.before-trendyol-2026-10-27.json
 *
 * HIDDEN_SLUGS: listelerde, aramada, sitemap'te ve Merchant feed'de görünmez;
 * ürün sayfası eski linkler kırılmasın diye açık kalır.
 */
import siteHidden from "@/data/hidden.json";

/** Admin'in sitede "Sil" ile kaldırdıkları (scripts/sync-hidden.mjs, build öncesi) + elle eklenenler */
export const HIDDEN_SLUGS = new Set<string>([...(siteHidden as string[])]);

/** Kapak olarak ilk görsel yerine kullanılacak görselin sırası */
export const COVER_IMAGE_INDEX: Record<string, number> = {};

/**
 * Trendyol'dan yanlış gelen metinler — sync-trendyol products.json'ı ezdiği için düzeltme burada.
 * Slug'lar bilerek değişmiyor (eski linkler ve Merchant Center ilanları kırılmasın).
 * 2026-10-28: Yasin + tesbih setleri jelatinde değil tül kesede (kullanıcı teyidi).
 */
const TUL_KESE_SKUS = [
  "OBR-HED-0002", "OBR-HED-0003", "OBR-HED-0004", "OBR-HED-0005", "OBR-HED-0006",
  "OBR-HED-0007", "OBR-HED-0008", "OBR-HED-0009", "OBR-HED-0010",
];

function jelatinToTul(s: string): string {
  return s
    .replace(/Jelatinde/g, "Tül Kesede")
    .replace(/jelatinde/g, "tül kesede")
    .replace(/Jelatinli/g, "Tül Keseli")
    .replace(/jelatinli/g, "tül keseli")
    .replace(/Jelatin/g, "Tül kese")
    .replace(/jelatin/g, "tül kese");
}

export const TEXT_FIXES: Record<string, (s: string) => string> = Object.fromEntries(
  TUL_KESE_SKUS.map((sku) => [sku, jelatinToTul]),
);
