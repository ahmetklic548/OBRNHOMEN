import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/products";

export const dynamic = "force-static";
export const revalidate = 86400; // 24 saat

export async function GET() {
  const products = getAllProducts().filter((p) => p.inStock && p.images[0]);
  const BASE = "https://obrnhomen.com";

  const items = products
    .map((p) => {
      const discountedPrice = (p.price * 0.8).toFixed(2);
      const originalPrice = p.price.toFixed(2);
      return `
    <item>
      <g:id>${p.id}</g:id>
      <g:title><![CDATA[${p.name}]]></g:title>
      <g:description><![CDATA[${p.metaDescription || p.name}]]></g:description>
      <g:link>${BASE}/products/${p.slug}</g:link>
      <g:image_link>${p.images[0]}</g:image_link>
      ${p.images[1] ? `<g:additional_image_link>${p.images[1]}</g:additional_image_link>` : ""}
      <g:availability>in_stock</g:availability>
      <g:price>${originalPrice} TRY</g:price>
      <g:sale_price>${discountedPrice} TRY</g:sale_price>
      <g:brand>${p.brand || "OBRNHOMEN"}</g:brand>
      <g:condition>new</g:condition>
      <g:google_product_category>5047</g:google_product_category>
      <g:product_type><![CDATA[${p.category}]]></g:product_type>
      <g:shipping>
        <g:country>TR</g:country>
        <g:price>${p.price >= 1000 ? "0.00" : "200.00"} TRY</g:price>
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
    <description>El işçiliği ve özgün tasarımla hazırlanan özel hediyeler.</description>
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
