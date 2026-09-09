import { NextRequest, NextResponse } from "next/server";
import { trendyolAuthHeader, TRENDYOL_BASE } from "@/lib/trendyol";

async function fetchPage(supplierId: string, startDate: number, endDate: number, page: number) {
  const params = new URLSearchParams({
    startDate: String(startDate),
    endDate: String(endDate),
    page: String(page),
    size: "200",
  });
  const res = await fetch(`${TRENDYOL_BASE}/suppliers/${supplierId}/orders?${params}`, {
    headers: {
      Authorization: trendyolAuthHeader(),
      "User-Agent": `${supplierId} - SelfIntegration`,
      Accept: "application/json",
    },
    next: { revalidate: 0 },
  });
  return res.json();
}

const MAX_PAGES = 20;

async function fetchAllOrders(supplierId: string, startDate: number, endDate: number) {
  const allOrders: Record<string, unknown>[] = [];
  let totalElements = 0;
  let page = 0;

  while (page < MAX_PAGES) {
    const data = await fetchPage(supplierId, startDate, endDate, page);
    const orders: Record<string, unknown>[] = data.content ?? [];
    totalElements = data.totalElements ?? totalElements;
    allOrders.push(...orders);

    const totalPages = data.totalPages ?? 1;
    page++;
    if (page >= totalPages || orders.length === 0) break;
  }

  return { orders: allOrders, totalElements };
}

export async function GET(req: NextRequest) {
  if (req.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const supplierId = process.env.TRENDYOL_SUPPLIER_ID;
  if (!supplierId) return NextResponse.json({ error: "TRENDYOL_SUPPLIER_ID eksik" }, { status: 500 });

  const now = Date.now();
  const day = 86_400_000;

  const ranges = [
    { key: "bugun", start: now - day, end: now },
    { key: "yedi_gun", start: now - 7 * day, end: now },
    { key: "otuz_gun", start: now - 30 * day, end: now },
  ];

  const results = await Promise.all(
    ranges.map(async ({ key, start, end }) => {
      const { orders, totalElements: total } = await fetchAllOrders(supplierId, start, end);

      let ciro = 0;
      let iptal = 0;
      const urunSayim: Record<string, { name: string; adet: number; ciro: number }> = {};

      for (const o of orders) {
        const status = o.status as string;
        const gross = (o.grossAmount as number) ?? 0;
        if (status === "Cancelled" || status === "Returned") { iptal++; continue; }
        ciro += gross;
        const lines = (o.lines as Record<string, unknown>[]) ?? [];
        for (const l of lines) {
          const name = (l.productName as string) ?? "";
          const qty = (l.quantity as number) ?? 1;
          const price = (l.lineGrossAmount as number) ?? 0;
          const key2 = name.slice(0, 60);
          if (!urunSayim[key2]) urunSayim[key2] = { name, adet: 0, ciro: 0 };
          urunSayim[key2].adet += qty;
          urunSayim[key2].ciro += price;
        }
      }

      const topUrunler = Object.values(urunSayim)
        .sort((a, b) => b.adet - a.adet)
        .slice(0, 5);

      return {
        key,
        total,
        ornekSayi: orders.length,
        ciro: Math.round(ciro),
        iptal,
        ortalama: orders.length > 0 ? Math.round(ciro / (orders.length - iptal || 1)) : 0,
        topUrunler,
      };
    })
  );

  const istatistik = Object.fromEntries(results.map((r) => [r.key, r]));
  return NextResponse.json(istatistik);
}
