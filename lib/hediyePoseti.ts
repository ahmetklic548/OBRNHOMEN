import type { Product } from "@/lib/products";

/**
 * Umre hediye poşeti — /hediyelik-hazirla özetinde otomatik eklenir (umreci adedi değiştirebilir).
 * Trendyol senkronu data/products.json'ı ezdiği için burada tanımlı; vitrinde gizli (productCuration HIDDEN_SLUGS),
 * sipariş/ödeme tarafında normal ürün gibi doğrulanır.
 * Fiyat 25 TL (kullanıcı, 2026-11-12, "şimdilik"). Görsel: çizim (public/hediye-poseti.svg) — gerçek foto gelince değiştir.
 */
export const POSET_SLUG = "umre-hediye-poseti";

export const HEDIYE_POSETI: Product = {
  id: "OBR-POSET-0001",
  slug: POSET_SLUG,
  name: "Kraft Hediye Poşeti (Hediye Kartı Dahil)",
  category: "Hediyelik Setler",
  brand: "OBRNHOMEN",
  price: 25,
  currency: "TRY",
  stock: 5000,
  inStock: true,
  color: null,
  size: null,
  features: [
    "Dağıtacağınız her hediye için bir kraft kâğıt poşet",
    "İçinde adınızın ve kafilenizin yazdığı hediye kartı",
    "Poşet ve kartlar ürünlerle birlikte ayrı gelir; hediyeleri kendi zevkinize göre hazırlarsınız",
  ],
  images: ["/hediye-poseti.svg"],
  metaDescription: "Umre dönüşü dağıtacağınız hediyelikler için hediye poşeti, içinde isminizin yazdığı hediye kartıyla.",
  quantity: 1,
  subcategory: "Hediye Paketleme",
  sku: "OBR-POSET-0001",
};
