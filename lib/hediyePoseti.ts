import type { Product } from "@/lib/products";

/**
 * Umre hediye poşeti — /hediyelik-hazirla özetinde otomatik eklenir (umreci adedi değiştirebilir).
 * Trendyol senkronu data/products.json'ı ezdiği için burada tanımlı; vitrinde gizli (productCuration HIDDEN_SLUGS),
 * sipariş/ödeme tarafında normal ürün gibi doğrulanır.
 * FİYAT/GÖRSEL: kullanıcı teyit edecek (2026-11-11 yer tutucu).
 */
export const POSET_SLUG = "umre-hediye-poseti";

export const HEDIYE_POSETI: Product = {
  id: "OBR-POSET-0001",
  slug: POSET_SLUG,
  name: "Kraft Hediye Poşeti (Hediye Kartı Dahil)",
  category: "Hediyelik Setler",
  brand: "OBRNHOMEN",
  price: 15,
  currency: "TRY",
  stock: 5000,
  inStock: true,
  color: null,
  size: null,
  features: [
    "Dağıtacağınız her hediye için bir kraft kâğıt poşet",
    "İçinde adınızın ve kafilenizin yazdığı hediye kartı",
    "Hediyeler poşetlenmiş olarak gönderilir",
  ],
  images: ["/hediye-poseti.svg"],
  metaDescription: "Umre dönüşü dağıtacağınız hediyelikler için hediye poşeti, içinde isminizin yazdığı hediye kartıyla.",
  quantity: 1,
  subcategory: "Hediye Paketleme",
  sku: "OBR-POSET-0001",
};
