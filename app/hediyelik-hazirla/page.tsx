import type { Metadata } from "next";
import { getAllProducts, type Product } from "@/lib/products";
import { salePrice } from "@/lib/pricing";
import HazirlaClient, { type Adim, type Grup, type HazirlaUrun } from "./HazirlaClient";

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

/** Seccade adımında sadece tekli seccadeler (umreci tam adet yazsın); çocuk/sesli seccadeler hariç */
const seccadeUygun = (p: Product) => (p.quantity ?? 1) === 1 && !/çocuk|sesli|kulaklık/i.test(p.name);

/** Aynı ürünün renkleri tek kartta birleşsin: ad (renk çıkarılmış) + paket adedi + ebat */
function grupAnahtari(p: Product): string {
  let n = p.name.toLocaleLowerCase("tr-TR");
  if (p.color) n = n.split(p.color.toLocaleLowerCase("tr-TR")).join("");
  return `${n.replace(/[–\-|(),]/g, " ").replace(/\s+/g, " ").trim()}#${p.quantity ?? 1}#${p.size ?? ""}`;
}

const toUrun = (p: Product): HazirlaUrun => ({
  slug: p.slug,
  name: p.name,
  price: salePrice(p.price),
  image: p.images[0] ?? "",
  code: p.sku ?? p.id,
  color: p.color,
  size: p.size,
  packQty: p.quantity ?? 1,
});

export default function HediyelikHazirlaPage() {
  const tum = getAllProducts().filter((p) => p.inStock);
  const adimlar: Adim[] = ADIMLAR.map((a) => {
    const secilen = tum.filter((p) => a.sec(p.category, p.subcategory) && (a.id !== "seccade" || seccadeUygun(p)));
    const gruplar = new Map<string, Product[]>();
    for (const p of secilen) {
      const k = grupAnahtari(p);
      gruplar.set(k, [...(gruplar.get(k) ?? []), p]);
    }
    const urunler: Grup[] = [...gruplar.values()]
      // Paketli (dağıtmalık) ürünler önce
      .sort((x, y) => (y[0].quantity ?? 1) - (x[0].quantity ?? 1))
      .map((g) => ({ anahtar: g[0].slug, secenekler: g.map(toUrun) }));
    return { id: a.id, baslik: a.baslik, aciklama: a.aciklama, urunler };
  }).filter((a) => a.urunler.length > 0);

  return <HazirlaClient adimlar={adimlar} />;
}
