// SEO yardımcıları: Google'da görünen başlık ve açıklamayı temiz, kısa ve anahtar kelimeli üretir.
// Başlık şablonu layout.tsx'te "%s | OBRNHOMEN" — burada marka adı EKLENMEZ.
import { FREE_SHIPPING_OVER } from "@/lib/pricing";

const TITLE_MAX = 58; // " | OBRNHOMEN" eklenince ~70 karakter; Google ~60'ta keser, ana kelime başta kalsın

function cutAtWord(s: string, max: number): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const i = cut.lastIndexOf(" ");
  let out = i > max * 0.6 ? cut.slice(0, i) : cut;
  // yarım kalan bağlaç/sembolle bitmesin ("… Kitabı ve", "… Kuran +")
  for (let k = 0; k < 3; k++) out = out.replace(/[\s,;:–+&(-]+$/, "").replace(/\s+(ve|ile|veya|için|ya da|\+|&)$/i, "");
  return out;
}

/** Trendyol'dan gelen madde işaretli, "…" ile kesilmiş metni düz cümleye çevirir. */
export function cleanText(raw: string): string {
  return (raw || "")
    .replace(/…|\.\.\./g, "")
    .replace(/(^|[;\n])\s*[-•*]\s*/g, "$1 ")
    .replace(/\s*;\s*/g, ". ")
    .replace(/\s+-\s+/g, ". ")
    .replace(/\s+/g, " ")
    .replace(/\.\s*\./g, ".")
    .trim()
    .replace(/^[.\s]+/, "");
}

export function productSeoTitle(p: { name: string; category: string }): string {
  // "Ad | ek bilgi | ek bilgi" biçimindeki ilan adlarında ilk parça asıl ürün adıdır
  const main = p.name.split(" | ")[0].replace(/\s+/g, " ").trim();
  const short = cutAtWord(main, TITLE_MAX);
  if (short.length < 34 && !short.toLowerCase().includes(p.category.toLowerCase().split(" ")[0])) {
    return cutAtWord(`${short} – ${p.category}`, TITLE_MAX);
  }
  return short;
}

export function productSeoDescription(p: { name: string; metaDescription?: string; inStock?: boolean }): string {
  const body = cutAtWord(cleanText(p.metaDescription || p.name), 92);
  const tail = `Toptan fiyat, ${FREE_SHIPPING_OVER.toLocaleString("tr-TR")} ₺ üzeri ücretsiz kargo, 14 gün iade.`;
  return `${body.replace(/[.\s]+$/, "")}. ${tail}`;
}
