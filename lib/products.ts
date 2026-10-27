import productsData from "@/data/products.json";
import { HIDDEN_SLUGS, COVER_IMAGE_INDEX } from "@/lib/productCuration";
import { CATEGORIES } from "@/lib/categories";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  currency: string;
  stock: number;
  inStock: boolean;
  color: string | null;
  size: string | null;
  features: string[];
  images: string[];
  metaDescription: string;
  quantity?: number;
  /** Kategori içi ürün tipi (scripts/subcategories.mjs) — benzer ürünler yan yana dizilir */
  subcategory?: string;
  /** Ürün kodu: OBR-<KATEGORİ>-0001 (scripts/classify.mjs, data/sku-map.json) */
  sku?: string;
}

function withCover(p: Product): Product {
  const i = COVER_IMAGE_INDEX[p.slug];
  if (!i || !p.images[i]) return p;
  return { ...p, images: [p.images[i], ...p.images.filter((_, j) => j !== i)] };
}

/** Tüm ürünler — ürün sayfaları gizli ürünlerde de açılsın diye */
const allProducts = (productsData as Product[]).map(withCover);
/** Vitrinde görünenler — listeler, arama, sitemap, feed */
const products = allProducts.filter((p) => !HIDDEN_SLUGS.has(p.slug));

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

/** Ürünü olan kategori adları, menü sırasıyla (data/categories.json) */
export function getAllCategories(): string[] {
  const present = new Set(products.map((p) => p.category));
  return CATEGORIES.map((c) => c.name).filter((n) => present.has(n));
}

/** Statik üretilecek tüm ürün sayfaları (gizliler dahil) */
export function getAllSlugs(): string[] {
  return allProducts.map((p) => p.slug);
}

export function getFeaturedProducts(): Product[] {
  const picks = ["Tesbih", "Seccade", "Hediyelik Setler", "Kur'an-ı Kerim"];
  return picks
    .map((cat) => products.find((p) => p.category === cat && p.inStock))
    .filter(Boolean) as Product[];
}

export function getCategoryPreview(category: string, count = 3): Product[] {
  return products.filter((p) => p.category === category && p.inStock).slice(0, count);
}

/** Liste/kart için hafif ürün — istemciye açıklama ve tüm görseller gönderilmesin */
export function toCard(p: Product): Product {
  return { ...p, features: [], metaDescription: "", images: p.images.slice(0, 1) };
}
