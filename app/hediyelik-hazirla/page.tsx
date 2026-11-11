import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import { salePrice } from "@/lib/pricing";
import HazirlaClient, { type Adim, type HazirlaUrun } from "./HazirlaClient";

export const metadata: Metadata = {
  title: "Umre Dönüş Hediyeliğini Hazırla",
  description:
    "Umreden dönünce dağıtacağınız hediyelikleri adım adım seçin: seccade, eşarp, tesbih, yüzük, esans, misvak. Her hediyenin içinde adınızın yazdığı kart, kapınıza teslim.",
  alternates: { canonical: "https://obrnhomen.com/hediyelik-hazirla" },
};

/** Adımlar: kullanıcının istediği sırayla. Her adım kategori/alt grup ile ürünleri seçer. */
const ADIMLAR: { id: string; baslik: string; aciklama: string; sec: (c: string, s?: string) => boolean }[] = [
  { id: "seccade", baslik: "Seccade", aciklama: "Dağıtacağınız seccadeleri seçin.", sec: (c, s) => c === "Seccade" && s !== "Çocuk Seccadesi" },
  { id: "esarp", baslik: "Eşarp & Yazma", aciklama: "Hanımlara eşarp, yazma ya da örtü.", sec: (c) => c === "Eşarp, Yazma & Örtü" },
  { id: "tesbih", baslik: "Tesbih", aciklama: "Dağıtmalık, inci ya da kristal tesbih.", sec: (c, s) => c === "Tesbih" && s !== "Kehribar, Kuka & Erkek Tesbih" },
  { id: "yuzuk", baslik: "Yüzük & Takke", aciklama: "Hac-umre yüzüğü ve takke.", sec: (c) => c === "Takke & Yüzük" },
  { id: "esans", baslik: "Esans", aciklama: "Alkolsüz esanslar.", sec: (c, s) => c === "Misvak, Esans & Sürme" && s === "Esans" },
  { id: "misvak", baslik: "Misvak", aciklama: "Vakumlu, dağıtmalık misvak.", sec: (c, s) => c === "Misvak, Esans & Sürme" && s === "Misvak" },
  { id: "diger", baslik: "Diğer hediyelikler", aciklama: "Yasin, zikirmatik ve hazır setler (isteğe bağlı).", sec: (c, s) => (c === "Yasin & Dini Kitaplar" && s === "Yasin & Cüz") || c === "Zikirmatik" || (c === "Hediyelik Setler" && (s === "Yasin & Tesbih Setleri" || s === "Zikirmatik & Tesbih Setleri")) },
];

export default function HediyelikHazirlaPage() {
  const tum = getAllProducts().filter((p) => p.inStock);
  const adimlar: Adim[] = ADIMLAR.map((a) => ({
    id: a.id,
    baslik: a.baslik,
    aciklama: a.aciklama,
    urunler: tum
      .filter((p) => a.sec(p.category, p.subcategory))
      // Paketli (dağıtmalık) ürünler önce
      .sort((x, y) => (y.quantity ?? 1) - (x.quantity ?? 1))
      .map<HazirlaUrun>((p) => ({
        slug: p.slug,
        name: p.name,
        price: salePrice(p.price),
        image: p.images[0] ?? "",
        code: p.sku ?? p.id,
        color: p.color,
        size: p.size,
        packQty: p.quantity ?? 1,
      })),
  })).filter((a) => a.urunler.length > 0);

  return <HazirlaClient adimlar={adimlar} />;
}
