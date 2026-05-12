import { NextRequest, NextResponse } from "next/server";

const BASE = "https://api.trendyol.com/sapigw";

function authHeader() {
  const token = Buffer.from(
    `${process.env.TRENDYOL_API_KEY}:${process.env.TRENDYOL_API_SECRET}`
  ).toString("base64");
  return `Basic ${token}`;
}

export async function GET(req: NextRequest) {
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

  const url = `${BASE}/suppliers/${supplierId}/orders?${params}`;

  const res = await fetch(url, {
    headers: {
      Authorization: authHeader(),
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
