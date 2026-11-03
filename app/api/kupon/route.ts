import { NextRequest, NextResponse } from "next/server";
import { resolveCoupon } from "@/lib/partners";

/** Ödeme ekranı kupon kontrolü: sabit kuponlar + aktif ortak (kafile/influencer) kodları.
 *  Asıl indirim yine sipariş anında sunucuda (lib/order.ts) yeniden hesaplanır. */
export async function GET(req: NextRequest) {
  const r = await resolveCoupon(req.nextUrl.searchParams.get("kod"));
  if (!r || r.discountRate <= 0) return NextResponse.json({ ok: false }, { headers: { "Cache-Control": "no-store" } });
  return NextResponse.json(
    { ok: true, kod: r.code, oran: r.discountRate, ortak: r.ortak ? r.ortak.ad : null },
    { headers: { "Cache-Control": "no-store" } }
  );
}
