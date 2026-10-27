import type { Metadata } from "next";
import { getAllProducts, getAllCategories } from "@/lib/products";
import { salePrice, WHOLESALE_MIN_TOTAL } from "@/lib/pricing";
import ToptanClient, { type ToptanProduct } from "./ToptanClient";

export const metadata: Metadata = {
  title: "Toptan Sipariş | Hac Umre, Mevlüt, Dernek ve Mağazalara Toptan Hediyelik",
  description:
    `Hac/umre kafileleri, mevlüt ve düğün, cami/dernek ve hediyelik mağazaları için toptan tesbih, seccade ve hediyelik set. Ürünleri seçin, adetleri yazın, WhatsApp'tan toptan fiyat alın. Minimum ${WHOLESALE_MIN_TOTAL.toLocaleString("tr-TR")} ₺.`,
  keywords: [
    "toptan tesbih", "toptan seccade", "toptan hac hediyeliği", "toptan umre hediyeliği",
    "mevlüt hediyeliği toptan", "toplu hediyelik", "kafile hediyesi", "toptan zikirmatik",
  ],
  openGraph: {
    title: "Toptan Sipariş | OBRNHOMEN",
    description: "Ürünleri seçin, adetleri yazın, WhatsApp'tan toptan fiyat alın.",
    url: "https://obrnhomen.com/toptan",
  },
  alternates: { canonical: "https://obrnhomen.com/toptan" },
};

export default function ToptanPage() {
  // İstemciye sadece seçim için gereken hafif veri gider
  const products: ToptanProduct[] = getAllProducts()
    .filter((p) => p.inStock)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      category: p.category,
      price: salePrice(p.price),
      image: p.images[0] ?? "",
      code: p.id,
      color: p.color,
      size: p.size,
      subcategory: p.subcategory,
    }));

  return <ToptanClient products={products} categories={getAllCategories()} />;
}
