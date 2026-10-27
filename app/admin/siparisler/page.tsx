"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface FOrder {
  id: string;
  orderId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  items: { name: string; price: number; qty: number; tier?: number }[];
  total: number;
  odenenTutar?: number;
  beklenenTutar?: number | null;
  tutarUyumlu?: boolean | null;
  coupon?: string | null;
  paymentMethod?: string;
  giftWrap?: boolean;
  giftNote?: string;
  codFee?: number;
  status: string;
  paidAt: number;
}

export default function AdminSiparisler() {
  const [orders, setOrders] = useState<FOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!db) { setLoading(false); return; }
      const snap = await getDocs(query(collection(db, "siparisler"), orderBy("paidAt", "desc")));
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as FOrder)));
      setLoading(false);
    })();
  }, []);

  const totalCiro = orders.reduce((s, o) => s + (o.total || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold" style={{ color: "#1D1D1F" }}>
          Siparişler <span className="text-sm font-normal ml-2" style={{ color: "#86868B" }}>({orders.length})</span>
        </h1>
        <span className="text-sm font-medium" style={{ color: "#c9a84c" }}>
          {totalCiro.toLocaleString("tr-TR")} ₺ toplam ciro
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 bg-white animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-sm text-center py-16" style={{ color: "#86868B" }}>
          Henüz sitede tamamlanmış PayTR siparişi yok.
        </p>
      ) : (
        <div className="bg-white border overflow-hidden" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left" style={{ borderColor: "rgba(0,0,0,0.06)", background: "#F5F5F7" }}>
                <th className="px-4 py-3 text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: "#86868B" }}>Sipariş No</th>
                <th className="px-4 py-3 text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: "#86868B" }}>Müşteri</th>
                <th className="px-4 py-3 text-[10px] tracking-[0.2em] uppercase font-medium hidden md:table-cell" style={{ color: "#86868B" }}>Tarih</th>
                <th className="px-4 py-3 text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: "#86868B" }}>Tutar</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <>
                  <tr key={o.id} className="border-b last:border-0 hover:bg-stone-50 transition-colors" style={{ borderColor: "rgba(0,0,0,0.04)" }}>
                    <td className="px-4 py-3 font-medium" style={{ color: "#1D1D1F" }}>{o.orderId}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#1D1D1F" }}>{o.name}<br /><span style={{ color: "#86868B" }}>{o.phone}</span></td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs" style={{ color: "#86868B" }}>
                      {o.paidAt ? new Date(o.paidAt).toLocaleString("tr-TR") : "-"}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#1D1D1F" }}>
                      {o.total?.toLocaleString("tr-TR")} ₺
                      {o.tutarUyumlu === true && <span className="ml-1.5 px-1.5 py-0.5 text-[10px]" style={{ background: "#f0fdf4", color: "#16a34a" }}>✓ tutar doğru</span>}
                      {o.tutarUyumlu === false && <span className="ml-1.5 px-1.5 py-0.5 text-[10px]" style={{ background: "#fef2f2", color: "#dc2626" }}>⚠ tutar farklı</span>}
                      {(o.items ?? []).some(it => (it.tier ?? 0) > 0) && <span className="ml-1.5 px-1.5 py-0.5 text-[10px]" style={{ background: "#fffbf0", color: "#9a7a2c" }}>Toptan</span>}
                      {o.paymentMethod === "kapida-odeme" && <span className="ml-1.5 px-1.5 py-0.5 text-[10px]" style={{ background: "#eff6ff", color: "#1d4ed8" }}>Kapıda ödeme</span>}
                      {o.giftWrap && <span className="ml-1.5 px-1.5 py-0.5 text-[10px]" style={{ background: "#fdf2f8", color: "#be185d" }}>🎁 Hediye</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setOpen(open === o.id ? null : o.id)}
                        className="text-[10px] tracking-wide underline"
                        style={{ color: "#86868B" }}
                      >
                        {open === o.id ? "Kapat" : "Detay"}
                      </button>
                    </td>
                  </tr>
                  {open === o.id && (
                    <tr style={{ background: "#F5F5F7" }}>
                      <td colSpan={5} className="px-4 py-4 text-xs" style={{ color: "#1D1D1F" }}>
                        <p className="mb-2"><strong>Adres:</strong> {o.address || "-"}</p>
                        <p className="mb-2"><strong>E-posta:</strong> {o.email || "-"}</p>
                        {o.paymentMethod === "kapida-odeme" && <p className="mb-2"><strong>Ödeme:</strong> Kapıda ödeme (+{o.codFee ?? 70} ₺ dahil) — müşterinin WhatsApp onayını kontrol et</p>}
                        {o.giftWrap && <p className="mb-2"><strong>Hediye paketi:</strong> Evet{o.giftNote ? ` — Not: "${o.giftNote}"` : ""}</p>}
                        {o.beklenenTutar != null && (
                          <p className="mb-2">
                            <strong>Tutar kontrolü:</strong> sitenin hesapladığı {o.beklenenTutar.toLocaleString("tr-TR")} ₺ · PayTR&apos;nin tahsil ettiği {o.odenenTutar?.toLocaleString("tr-TR")} ₺
                            {o.coupon && <> · kupon {o.coupon}</>}
                          </p>
                        )}
                        <p><strong>Ürünler:</strong></p>
                        <ul className="list-disc pl-5">
                          {(o.items ?? []).map((it, i) => (
                            <li key={i}>
                              {it.name} — {it.qty} adet × {it.price?.toLocaleString("tr-TR")} ₺
                              {(it.tier ?? 0) > 0 && <span style={{ color: "#9a7a2c" }}> (toptan -%{it.tier})</span>}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
