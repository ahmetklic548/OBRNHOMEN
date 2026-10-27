import { NextRequest, NextResponse } from "next/server";
import { trendyolAuthHeader } from "@/lib/trendyol";

// Trendyol ürün/stok uçları eski sapigw adresinden kaldırıldı (2026-10'da 500 veriyordu);
// yeni entegrasyon adresleri:
const PRODUCT_BASE   = "https://apigw.trendyol.com/integration/product/sellers";
const INVENTORY_BASE = "https://apigw.trendyol.com/integration/inventory/sellers";

function isAuthorized(req: NextRequest) {
  return req.headers.get("x-admin-secret") === process.env.ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const supplierId = process.env.TRENDYOL_SUPPLIER_ID;
  if (!supplierId) return NextResponse.json({ error: "TRENDYOL_SUPPLIER_ID eksik" }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") ?? "0";
  const size = searchParams.get("size") ?? "50";
  const approved = searchParams.get("approved") ?? "";

  const params = new URLSearchParams({ page, size });
  if (approved) params.set("approved", approved);

  const res = await fetch(`${PRODUCT_BASE}/${supplierId}/products?${params}`, {
    headers: {
      Authorization: trendyolAuthHeader(),
      "User-Agent": `${supplierId} - SelfIntegration`,
      Accept: "application/json",
    },
    next: { revalidate: 0 },
  });

  const text = await res.text();
  let data: unknown;
  try { data = JSON.parse(text); } catch { data = { message: text.slice(0, 300) }; }
  if (!res.ok) return NextResponse.json({ error: data }, { status: res.status });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const supplierId = process.env.TRENDYOL_SUPPLIER_ID;
  if (!supplierId) return NextResponse.json({ error: "TRENDYOL_SUPPLIER_ID eksik" }, { status: 500 });

  const body = await req.json();

  const res = await fetch(`${INVENTORY_BASE}/${supplierId}/products/price-and-inventory`, {
    method: "POST",
    headers: {
      Authorization: trendyolAuthHeader(),
      "User-Agent": `${supplierId} - SelfIntegration`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data: unknown;
  try { data = JSON.parse(text); } catch { data = { message: text.slice(0, 300) }; }
  if (!res.ok) return NextResponse.json({ error: data }, { status: res.status });
  return NextResponse.json(data);
}
