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
  if (!supplierId) return NextResponse.json({ error: "TRENDYOL_SUPPLIER_ID eksik" }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") ?? "0";
  const size = searchParams.get("size") ?? "50";
  const approved = searchParams.get("approved") ?? "";

  const params = new URLSearchParams({ page, size });
  if (approved) params.set("approved", approved);

  const res = await fetch(`${BASE}/suppliers/${supplierId}/products?${params}`, {
    headers: {
      Authorization: authHeader(),
      "User-Agent": `${supplierId} - SelfIntegration`,
      Accept: "application/json",
    },
    next: { revalidate: 0 },
  });

  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data }, { status: res.status });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supplierId = process.env.TRENDYOL_SUPPLIER_ID;
  if (!supplierId) return NextResponse.json({ error: "TRENDYOL_SUPPLIER_ID eksik" }, { status: 500 });

  const body = await req.json();

  const res = await fetch(`${BASE}/suppliers/${supplierId}/products/price-and-inventory`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "User-Agent": `${supplierId} - SelfIntegration`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data }, { status: res.status });
  return NextResponse.json(data);
}
