import { getProductBySlug } from "@/lib/products";
import { salePrice, unitPriceFor, tierPct, orderTotals, VALID_COUPONS } from "@/lib/pricing";

/**
 * Sunucu tarafı sipariş hesabı — kartlı (PayTR) ve kapıda ödeme aynı fonksiyonu kullanır.
 * Fiyatlar istemciden alınmaz; ürün verisinden ve kademe/kupon kurallarından hesaplanır.
 */

/** qty = paket sayısı; pack = paketteki adet (paketli ilanlarda) */
export interface OrderLine { slug: string; name: string; sku?: string; price: number; qty: number; tier: number; pack?: number }

export interface ComputedOrder {
  lines: OrderLine[];
  subtotal: number;
  coupon: string | null;
  discountRate: number;
  discountAmount: number;
  shipping: number;
  codFee: number;
  total: number;
}

/** Admin'in sitede sildiği ürünler (build'den sonra silinenler dahil) — satılmasın */
export async function fetchHiddenSlugs(): Promise<Set<string>> {
  try {
    const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "obrnhomen-73ed9";
    const r = await fetch(`https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/products/_site_hidden`, { cache: "no-store" });
    if (!r.ok) return new Set();
    const d = await r.json();
    return new Set((d.fields?.slugs?.arrayValue?.values ?? []).map((v: { stringValue?: string }) => v.stringValue ?? ""));
  } catch {
    return new Set();
  }
}

export async function computeOrder(
  rawItems: unknown,
  rawCoupon: unknown,
  cod = false
): Promise<ComputedOrder | { error: string }> {
  const reqItems: { slug: string; qty: number }[] = Array.isArray(rawItems) ? rawItems : [];
  const hidden = await fetchHiddenSlugs();
  const lines = reqItems.map(({ slug, qty }) => {
    const p = hidden.has(String(slug)) ? undefined : getProductBySlug(String(slug));
    const n = Math.floor(Number(qty));
    if (!p || !p.inStock || !(n >= 1 && n <= 1000)) return null;
    return { slug: p.slug, name: p.name, sku: p.sku, price: unitPriceFor(salePrice(p.price), n), qty: n, tier: tierPct(n), ...((p.quantity ?? 1) > 1 ? { pack: p.quantity } : {}) };
  });
  if (lines.length === 0 || lines.some((l) => l === null)) {
    return { error: "Sepetteki bir ürün artık satışta değil. Sepetinizi kontrol edin." };
  }
  const valid = lines as OrderLine[];
  const subtotal = Math.round(valid.reduce((s, i) => s + i.price * i.qty, 0) * 100) / 100;
  const coupon = typeof rawCoupon === "string" && VALID_COUPONS[rawCoupon] ? rawCoupon : null;
  const { discountRate, discountAmount, shipping, codFee, grandTotal } = orderTotals(subtotal, coupon, cod);
  return { lines: valid, subtotal, coupon, discountRate, discountAmount, shipping, codFee, total: grandTotal };
}

/** Müşteri bilgisi + hediye seçenekleri (her iki ödeme yolunda aynı) */
export function readCustomer(body: Record<string, unknown>) {
  const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  return {
    name: str(body.name, 120),
    email: str(body.email, 160),
    phone: str(body.phone, 40),
    address: str(body.address, 600),
    giftWrap: body.giftWrap === true,
    giftNote: str(body.giftNote, 300),
  };
}
