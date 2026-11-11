import { NextRequest, NextResponse } from "next/server";
import { ortakBilgi } from "@/lib/partners";

/** /hediyelik-hazirla: ref kodunun kafile adı ve modeli (Yol 1 toptan / Yol 2 kod) */
export async function GET(req: NextRequest) {
  const o = await ortakBilgi(req.nextUrl.searchParams.get("kod"));
  return NextResponse.json(o ? { ok: true, ...o } : { ok: false }, { headers: { "Cache-Control": "no-store" } });
}
