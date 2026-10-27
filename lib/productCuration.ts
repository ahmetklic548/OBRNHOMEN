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
