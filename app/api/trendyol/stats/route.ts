import { NextResponse } from "next/server";

const BASE = "https://api.trendyol.com/sapigw";

function authHeader() {
  const token = Buffer.from(
    `${process.env.TRENDYOL_API_KEY}:${process.env.TRENDYOL_API_SECRET}`
  ).toString("base64");
  return `Basic ${token}`;
}

async function fetchPage(supplierId: string, startDate: number, endDate: number, page: number) {
  const params = new URLSearchParams({
    startDate: String(startDate),
    endDate: String(endDate),
    page: String(page),
    size: "200",
  });
  const res = await fetch(`${BASE}/suppliers/${supplierId}/orders?${params}`, {
    headers: {
      Authorization: authHeader(),
      "User-Agent": `${supplierId} - SelfIntegration`,
      Accept: "application/json",
    },
    next: { revalidate: 0 },
  });
  return res.json();
}

export async function GET() {
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
      const data = await fetchPage(supplierId, start, end, 0);
      const orders: Record<string, unknown>[] = data.content ?? [];
      const total = data.totalElements ?? 0;

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
