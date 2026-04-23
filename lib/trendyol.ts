import data from "@/data/top100_products.json";

export interface TrendyolProduct {
  rank: number;
  name: string;
  category: string;
  brand: string;
  net_sales: number;
  net_revenue_tl: number;
  return_rate_pct: number;
  avg_price_tl: number;
  quality_score: number;
  selection_reason: string;
  placement: "hero" | "featured" | "grid";
  usp: string;
}

const products = data as TrendyolProduct[];

export function getTop100(): TrendyolProduct[] {
  return products;
}

export function getTopByPlacement(placement: TrendyolProduct["placement"]): TrendyolProduct[] {
  return products.filter((p) => p.placement === placement);
}

export function getTopHero(): TrendyolProduct[] {
  return products.filter((p) => p.placement === "hero");
}

export function getTopFeatured(): TrendyolProduct[] {
  return products.filter((p) => p.placement === "featured");
}

export function getTopByCategory(category: string): TrendyolProduct[] {
  return products.filter((p) =>
    p.category.toLowerCase().includes(category.toLowerCase())
  );
}

/** En yüksek cirolu N ürün */
export function getTopByRevenue(n = 10): TrendyolProduct[] {
  return [...products].sort((a, b) => b.net_revenue_tl - a.net_revenue_tl).slice(0, n);
}

/** En düşük iade oranına sahip N ürün */
export function getLowestReturn(n = 10): TrendyolProduct[] {
  return [...products].sort((a, b) => a.return_rate_pct - b.return_rate_pct).slice(0, n);
}
