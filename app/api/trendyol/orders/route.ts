import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { trendyolAuthHeader, TRENDYOL_BASE } from "@/lib/trendyol";


export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const supplierId = process.env.TRENDYOL_SUPPLIER_ID;
  if (!supplierId) {
    return NextResponse.json({ error: "TRENDYOL_SUPPLIER_ID eksik" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") ?? "0";
  const size = searchParams.get("size") ?? "20";
  const status = searchParams.get("status") ?? "";

  const params = new URLSearchParams({ page, size });
  if (status) params.set("status", status);

  const url = `${TRENDYOL_BASE}/suppliers/${supplierId}/orders?${params}`;

  const res = await fetch(url, {
    headers: {
      Authorization: trendyolAuthHeader(),
      "User-Agent": `${supplierId} - SelfIntegration`,
      Accept: "application/json",
      "Accept-Language": "tr-TR,tr;q=0.9",
      "Content-Type": "application/json",
    },
    next: { revalidate: 0 },
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data }, { status: res.status });
  }

  return NextResponse.json(data);
}
