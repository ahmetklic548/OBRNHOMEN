import type { NextRequest } from "next/server";

/**
 * Basit IP başına istek sınırı (spam koruması). Bellekte tutulur → her sunucu örneği kendi sayar;
 * kusursuz değil ama formu otomatik dolduran botları ve art arda gönderimleri keser.
 */
const kayit = new Map<string, number[]>();

export function ipOf(req: NextRequest) {
  return (req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "?").trim();
}

/** true → sınır aşıldı (isteği reddet). ad: uç nokta adı, limit: pencere başına izin, pencereMs: süre */
export function sinirAsildi(req: NextRequest, ad: string, limit: number, pencereMs: number) {
  const k = `${ad}:${ipOf(req)}`;
  const simdi = Date.now();
  const l = (kayit.get(k) ?? []).filter((t) => simdi - t < pencereMs);
  if (l.length >= limit) { kayit.set(k, l); return true; }
  l.push(simdi);
  kayit.set(k, l);
  if (kayit.size > 5000) for (const [kk, v] of kayit) if (!v.some((t) => simdi - t < pencereMs)) kayit.delete(kk);
  return false;
}

export const COK_ISTEK = { error: "Çok fazla deneme yaptınız. Lütfen birkaç dakika sonra tekrar deneyin." };
