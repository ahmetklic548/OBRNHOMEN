import type { Metadata } from "next";
import { getAllProducts, type Product } from "@/lib/products";
import { salePrice } from "@/lib/pricing";
import { HEDIYE_POSETI } from "@/lib/hediyePoseti";
import HazirlaClient, { type Adim, type Grup, type HazirlaUrun } from "./HazirlaClient";

export const metadata: Metadata = {
  title: "Umre Dönüş Hediyeliğini Hazırla",
  description:
    "Umreden dönünce dağıtacağınız hediyelikleri adım adım seçin: seccade, eşarp, tesbih, yüzük, esans, misvak. Kraft hediye poşeti ve adınızın yazdığı kartlarla, kapınıza teslim.",
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
  { id: "diger", baslik: "Diğer hediyelikler", aciklama: "Yasin, hazır setler, zikirmatik, cep Kur'an, çocuklar için ve hatıra hediyelikler.", sec: (c, s) => DIGER_BOLUM(c, s) !== null },
];

/** "Diğer" adımı başlıklara ayrılır: [sıra, başlık] — null ise adımda yok */
function DIGER_BOLUM(c: string, s?: string): [number, string] | null {
  if (c === "Yasin & Dini Kitaplar" && s === "Yasin & Cüz") return [1, "Yasin & Cüz"];
  if (c === "Hediyelik Setler" && s && ["Yasin & Tesbih Setleri", "Başörtü & Tesbih Setleri", "Mini Kuran & Tesbih Setleri", "Zikirmatik & Tesbih Setleri"].includes(s)) return [2, "Hazır hediyelik setler"];
  if (c === "Zikirmatik") return [3, "Zikirmatik"];
  if (c === "Kur'an-ı Kerim" && s === "Cep Boy") return [4, "Cep boy Kur'an-ı Kerim"];
  if (c === "Hediyelik Eşya & Dekor" && s === "Çocuk Hediyelikleri") return [5, "Çocuklar için"];
  if (c === "Hediyelik Eşya & Dekor") return [6, "Hatıra & dekor"];
  return null;
}

/** Seccade adımında sadece tekli seccadeler (umreci tam adet yazsın); çocuk/sesli seccadeler hariç */
const seccadeUygun = (p: Product) => (p.quantity ?? 1) === 1 && !/çocuk|sesli|kulaklık/i.test(p.name);

/** Ürün adlarında geçen renkler — aynı ürünün renkleri tek kartta birleşsin diye addan çıkarılır */
const RENKLER = ["koyu yeşil", "açık pudra", "bebe mavi", "zümrüt yeşili", "bordo", "gold", "gümüş", "krem", "siyah", "yeşil", "lacivert", "pudra", "kırmızı", "mor", "altın", "beyaz", "mavi", "pembe", "gri", "kahverengi", "kahve rengi", "bej", "haki", "mürdüm", "turuncu", "sarı", "lila", "ekru"];

/** Aynı ürünün renkleri tek kartta birleşsin: ad (renkler ve kesik son kelime çıkarılmış) + paket adedi + ebat */
function grupAnahtari(p: Product): string {
  let n = p.name.toLocaleLowerCase("tr-TR");
  if (p.color) n = n.split(p.color.toLocaleLowerCase("tr-TR")).join(" ");
  for (const r of RENKLER) n = n.split(r).join(" ");
  n = n.replace(/[–\-|(),+]/g, " ").replace(/\s+/g, " ").trim();
  // Trendyol'da kesilmiş adlar ("… Seti Bor", "… Seti Beb"): sondaki 1-4 harflik kelimeyi at
  n = n.replace(/\s\S{1,4}$/, "");
  return `${n}#${p.quantity ?? 1}#${p.size ?? ""}`;
}

/** Adım adım gösterilecek ürünler — kullanıcının seçtikleri, bu sırayla (2026-11-11).
 *  Listesi olmayan adımda (yüzük-takke, esans, diğer) tüm ürünler gösterilir.
 *  Gruptaki herhangi bir renk listedeyse kart gösterilir. */
const SECIM: Record<string, string[]> = {
  seccade: [
    "buyuk-boy-seccade-80x120-cm-battal-kadife-namazlik-hediyelik-kahverengi",
    "1-adet-kadife-seccade-hac-umre-mevlut-hediyelik-dagitmalik",
    "luks-kadife-seccade-namazlik-az-desenli-yumusak-dokulu-ve-kaliteli-ibadet-mati-sade-sik-ta",
    "1-adet-pelus-namaz-seccadesi-namazlik-hac-umre-mevlut-hediyelik-dagitmalik-mihrap-rengaren",
    "1-adet-simli-goblen-namaz-seccade-hac-umre-hediyelik-seccade-renk-secenekli-altin",
    "1-adet-karma-renk-hic-desensiz-kadife-seccade-namazlik-dodya-imalat-sik-dokuma-sik-550-600",
    "1-adet-sade-az-desenli-kadife-seccade-namazlik-sik-dokuma-dodya-iplik-goz-yormayan-desen-s",
    "sade-mihrap-desen-astarsiz-sonil-seccade-namazlik-hac-umre-mevlut-ceyiz-hediyelik-bohca-da",
    "luks-sonil-seccade-namazlik-geleneksel-desenli-sacakli-kaliteli-dokuma-yumusak-doku-sik-ve",
    "luks-sonil-seccade-namazlik-oval-mihrap-desenli-sacakli-kaliteli-dokuma-yumusak-doku-sik-d",
    "1-adet-kirkyama-seccade-karma-renk-ceyiz-mevlut-bohca-hac-umre-dagitmalik-lux-patchwork-na",
  ],
  esarp: [
    "10-adet-luks-bambu-esarp-hac-umre-ozel-seri-hediyelik-dagitmalik-basortusu-karisik-renk",
    "duz-flamli-esarp-acik-pudra",
  ],
  tesbih: [
    "10-adet-cam-inci-tesbih-99-luk-namaz-tesbihi-tespih-hac-umre-mevlut-hediyelik-dagitmalik-c",
    "10-adet-tullu-plastik-inci-tesbih-99-lu-namaz-tesbihi-hac-umre-mevlut-hediyelik-ceyiz-dagi",
    "10-adet-hediyelik-vavli-puskullu-krem-cam-inci-namaz-tesbihi",
    "kristal-kesim-akrilik-99-lu-namaz-tesbihi-renk-secenekli-mevlut-hac-umre-hediyelik-tesbih",
    "10-adet-karma-renk-99-luk-ahsap-namaz-tesbihi-hac-umre-mevlut-ceyiz-bohca-hediyelik-dagitm",
    "kokulu-mevlut-tesbihi-gul-islemeli-seffaf-kutulu-hediyelik-8-adet",
  ],
  misvak: [
    "10-adet-dogal-taze-misvak-kaliteli-paketli-agiz-bakim-urunu",
    "buyuk-boy-kalin-dogal-misvak-5-adet-vakumlu-ambalaj",
  ],
};
const sira = (liste: string[], g: Product[]) => Math.min(...g.map((p) => { const i = liste.indexOf(p.slug); return i < 0 ? Infinity : i; }));

const toUrun = (p: Product): HazirlaUrun => ({
  slug: p.slug,
  name: p.name,
  price: salePrice(p.price, p.slug),
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
    let liste = [...gruplar.values()];
    const secim = SECIM[a.id];
    liste = secim
      ? liste.filter((g) => sira(secim, g) < Infinity).sort((x, y) => sira(secim, x) - sira(secim, y))
      // Paketli (dağıtmalık) ürünler önce
      : liste.sort((x, y) => (y[0].quantity ?? 1) - (x[0].quantity ?? 1));
    if (a.id === "diger") {
      const b = (g: Product[]) => DIGER_BOLUM(g[0].category, g[0].subcategory)?.[0] ?? 99;
      liste.sort((x, y) => b(x) - b(y));
    }
    const urunler: Grup[] = liste.map((g) => ({
      anahtar: g[0].slug,
      secenekler: g.map(toUrun),
      ...(a.id === "diger" ? { bolum: DIGER_BOLUM(g[0].category, g[0].subcategory)?.[1] } : {}),
    }));
    return { id: a.id, baslik: a.baslik, aciklama: a.aciklama, urunler };
  }).filter((a) => a.urunler.length > 0);

  return <HazirlaClient adimlar={adimlar} poset={toUrun(HEDIYE_POSETI)} />;
}
