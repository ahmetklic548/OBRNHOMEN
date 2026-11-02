import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/products";
import { salePrice, FREE_SHIPPING_OVER, SHIPPING_FEE } from "@/lib/pricing";

export const dynamic = "force-static";
export const revalidate = 86400; // 24 saat

/** Google ürün kategorisi (taxonomy ID) — kategori/alt kategoriye göre */
const GOOGLE_CATEGORY: Record<string, number> = {
  "Hediyelik Setler": 97, "Çeyiz & Bohça Setleri": 97, "Hac Umre Kafile Setleri": 97, "Seccade": 97,
  "Hediyelik Eşya & Dekor": 696,
  "Kur'an-ı Kerim": 543543, "Yasin & Dini Kitaplar": 543543,
  "Tesbih": 3923, "Zikirmatik": 97,
  "Namaz Elbisesi & Tesettür": 5483, "İhram & Hac Malzemeleri": 5483,
  "Eşarp, Yazma & Örtü": 543673,
  "Takke & Yüzük": 173, "Misvak, Esans & Sürme": 97,
};
const GOOGLE_SUBCATEGORY: Record<string, number> = {
  "Namaz & Mevlüt Örtüsü": 1949, "İhram Kemeri": 169, "Patik, Çorap & Atlet": 209,
  "Yüzük": 200, "Misvak": 527, "Esans": 479,
};

const BOOK_CATEGORIES = new Set(["Kur'an-ı Kerim", "Yasin & Dini Kitaplar"]);

/** Ad içinden "tarz" ifadeleri (Google kitaplar için Tarz bilgisi istiyor) */
const BOOK_STYLES: [RegExp, string][] = [
  [/tecvid/i, "Tecvidli"], [/meal/i, "Mealli"], [/kelime meal/i, "Kelime Mealli"],
  [/bilgisayar hat/i, "Bilgisayar Hatlı"], [/medine hat/i, "Medine Hatlı"], [/hafız osman/i, "Hafız Osman Hatlı"],
  [/termo deri/i, "Termo Deri Kapak"], [/kadife/i, "Kadife Kapak"], [/cilt bezi/i, "Cilt Bezi Kapak"],
  [/sıvama/i, "Sıvama Kapak"], [/tepe varak/i, "Tepe Varaklı"], [/kenar yald/i, "Kenar Yaldızlı"],
  [/m[iı]klep/i, "Mıklepli"], [/sesli|qr|kare kod/i, "Sesli (QR Kodlu)"], [/iri yaz/i, "İri Yazılı"],
];

/** Kitap ürünleri için sayfa sayısı, boyut, dil, yazar ve tarz (yalnızca veride olanlar) */
function bookDetails(p: { name: string; features: string[] }) {
  const feat = (key: string) => {
    const f = p.features.find((x) => x.startsWith(key + ": "));
    const v = f?.slice(key.length + 2).trim();
    return v && v !== "Belirtilmemiş" ? v : undefined;
  };
  const pages = feat("Sayfa Sayısı") ?? p.features.join(" ").match(/Sayfa Sayısı:\s*(\d{2,4})/)?.[1];
  const styles = [...new Set(BOOK_STYLES.filter(([re]) => re.test(p.name)).map(([, s]) => s))];
  return [
    ["Sayfa Sayısı", pages],
    ["Boyut", feat("Boyut")],
    ["Basım Dili", feat("Basım Dili")],
    ["Yazar", feat("Yazar")],
    ["Tarz", styles.join(", ") || undefined],
  ].filter((d): d is [string, string] => Boolean(d[1]));
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function GET() {
  const products = getAllProducts().filter((p) => p.inStock && p.images[0]);
  const BASE = "https://www.obrnhomen.com";

  const items = products
    .map((p) => {
      const discountedPrice = salePrice(p.price).toFixed(2);
      const originalPrice = p.price.toFixed(2);
      const details = BOOK_CATEGORIES.has(p.category) ? bookDetails(p) : [];
      const description = [p.metaDescription || p.name, ...details.map(([k, v]) => `${k}: ${v}.`)].join(" ");
      return `
    <item>
      <g:id>${p.id}</g:id>
      <g:title><![CDATA[${p.name.slice(0, 150)}]]></g:title>
      <g:description><![CDATA[${description.slice(0, 5000)}]]></g:description>
      ${details.map(([k, v]) => `<g:product_detail><g:section_name>Kitap Bilgileri</g:section_name><g:attribute_name>${esc(k)}</g:attribute_name><g:attribute_value>${esc(v)}</g:attribute_value></g:product_detail>`).join("")}
      <g:link>${BASE}/products/${p.slug}</g:link>
      <g:image_link>${p.images[0]}</g:image_link>
      ${p.images.slice(1, 11).map((u) => `<g:additional_image_link>${u}</g:additional_image_link>`).join("")}
      <g:availability>in_stock</g:availability>
      <g:price>${originalPrice} TRY</g:price>
      <g:sale_price>${discountedPrice} TRY</g:sale_price>
      <g:brand>${p.brand || "OBRNHOMEN"}</g:brand>
      <g:condition>new</g:condition>
      <g:google_product_category>${(p.subcategory && GOOGLE_SUBCATEGORY[p.subcategory]) || GOOGLE_CATEGORY[p.category] || 97}</g:google_product_category>
      <g:product_type><![CDATA[${[p.category, p.subcategory].filter(Boolean).join(" > ")}]]></g:product_type>
      <g:shipping>
        <g:country>TR</g:country>
        <g:price>${salePrice(p.price) >= FREE_SHIPPING_OVER ? "0.00" : SHIPPING_FEE.toFixed(2)} TRY</g:price>
      </g:shipping>
      <g:identifier_exists>false</g:identifier_exists>
      ${p.color ? `<g:color><![CDATA[${p.color}]]></g:color>` : ""}
      ${p.size ? `<g:size><![CDATA[${p.size}]]></g:size>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>OBRNHOMEN Ürün Kataloğu</title>
    <link>${BASE}</link>
    <description>Tesbih, seccade, Kur'an-ı Kerim, hac-umre ve mevlüt hediyelikleri.</description>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
