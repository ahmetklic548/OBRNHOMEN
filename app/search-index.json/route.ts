import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/products";
import { salePrice } from "@/lib/pricing";

// Build sırasında üretilen hafif arama listesi (SearchBar ilk açılışta yükler)
export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(
    getAllProducts().map((p) => ({
      slug: p.slug,
      name: p.name,
      category: p.category,
      subcategory: p.subcategory,
      color: p.color,
      size: p.size,
      brand: p.brand,
      id: p.id,
      image: p.images[0] ?? "",
      price: salePrice(p.price),
    }))
  );
}
