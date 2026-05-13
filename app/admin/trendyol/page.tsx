"use client";

import { useState, useEffect, useCallback } from "react";

/* ─── TYPES ─── */
interface OrderLine { productName: string; quantity: number; price: number; currencyCode: string; productSize?: string; productColor?: string; lineGrossAmount?: number; }
interface Order { orderNumber: string; status: string; orderDate: number; grossAmount: number; currencyCode: string; customerFirstName: string; customerLastName: string; cargoTrackingNumber?: string | number; cargoTrackingLink?: string; lines: OrderLine[]; }
interface OrdersResp { content: Order[]; totalPages: number; totalElements: number; page: number; }
interface TopUrun { name: string; adet: number; ciro: number; }
interface StatRange { total: number; ornekSayi: number; ciro: number; iptal: number; ortalama: number; topUrunler: TopUrun[]; }
interface Stats { bugun: StatRange; yedi_gun: StatRange; otuz_gun: StatRange; }
interface TYProduct { barcode: string; title: string; productMainId: string; categoryName: string; quantity: number; salePrice: number; listPrice: number; approved: boolean; images?: { url: string }[]; }
interface ProductsResp { content: TYProduct[]; totalPages: number; totalElements: number; }

/* ─── AUTH HEADER ─── */
const adminHeaders = () => ({
  "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET ?? "",
});

/* ─── CONSTANTS ─── */
const STATUS_OPTIONS = [
  { value: "", label: "Tümü" }, { value: "Created", label: "Oluşturuldu" },
  { value: "Picking", label: "Hazırlanıyor" }, { value: "Invoiced", label: "Faturalandı" },
  { value: "Shipped", label: "Kargoya Verildi" }, { value: "Delivered", label: "Teslim Edildi" },
  { value: "Cancelled", label: "İptal" }, { value: "Returned", label: "İade" },
];
const STATUS_COLORS: Record<string, string> = {
  Created: "#007AFF", Picking: "#FF9500", Invoiced: "#AF52DE",
  Shipped: "#34C759", Delivered: "#34C759", Cancelled: "#FF3B30",
  Returned: "#FF3B30", UnDelivered: "#FF9500", Repack: "#FF9500",
};
const TL = (n: number) => n.toLocaleString("tr-TR") + " ₺";

/* ═══════════════════════════════════════════════════════════════
   SEKME 1 — SİPARİŞLER
═══════════════════════════════════════════════════════════════ */
function SiparislerTab() {
  const [data, setData] = useState<OrdersResp | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const p = new URLSearchParams({ page: String(page), size: "20" });
      if (status) p.set("status", status);
      const res = await fetch(`/api/trendyol/orders?${p}`, { headers: adminHeaders() });
      const json = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(json.error));
      setData(json);
    } catch (e) { setError(e instanceof Error ? e.message : "Hata"); }
    finally { setLoading(false); }
  }, [page, status]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return (
    <div>
      {data && <p className="text-xs mb-4" style={{ color: "#86868B" }}>Toplam {data.totalElements} sipariş</p>}
      <div className="flex gap-2 flex-wrap mb-4">
        {STATUS_OPTIONS.map(s => (
          <button key={s.value} onClick={() => { setStatus(s.value); setPage(0); }}
            className="px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase transition-all"
            style={{ background: status === s.value ? "#1D1D1F" : "transparent", color: status === s.value ? "#c9a84c" : "#86868B", border: "1px solid", borderColor: status === s.value ? "#1D1D1F" : "#e5e5e5" }}>
            {s.label}
          </button>
        ))}
        <button onClick={fetch_} className="ml-auto px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase border hover:border-[#c9a84c]" style={{ borderColor: "#e5e5e5", color: "#1D1D1F" }}>Yenile</button>
      </div>
      {error && <p className="text-sm mb-3" style={{ color: "#FF3B30" }}>Hata: {error}</p>}
      {loading && <p className="text-sm" style={{ color: "#86868B" }}>Yükleniyor...</p>}
      {data && !loading && (
        <>
          <div className="flex flex-col gap-2">
            {data.content.length === 0 && <p className="text-sm" style={{ color: "#86868B" }}>Sipariş yok.</p>}
            {data.content.map(order => (
              <div key={order.orderNumber} className="border bg-white" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                <button onClick={() => setExpanded(expanded === order.orderNumber ? null : order.orderNumber)}
                  className="w-full px-5 py-3.5 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors">
                  <span className="shrink-0 text-[10px] tracking-[0.1em] uppercase px-2 py-0.5" style={{ background: STATUS_COLORS[order.status] ?? "#86868B", color: "#fff" }}>{order.status}</span>
                  <span className="text-sm font-medium flex-1" style={{ color: "#1D1D1F" }}>#{order.orderNumber}</span>
                  <span className="text-xs hidden sm:block" style={{ color: "#86868B" }}>{order.customerFirstName} {order.customerLastName}</span>
                  <span className="text-sm font-medium tabular-nums" style={{ color: "#1D1D1F" }}>{TL(order.grossAmount)}</span>
                  <span className="text-[10px]" style={{ color: "#86868B" }}>{new Date(order.orderDate).toLocaleDateString("tr-TR")}</span>
                  <span className="text-xs" style={{ color: "#86868B" }}>{expanded === order.orderNumber ? "▲" : "▼"}</span>
                </button>
                {expanded === order.orderNumber && (
                  <div className="px-5 pb-4 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                    {order.cargoTrackingLink && (
                      <a href={String(order.cargoTrackingLink)} target="_blank" rel="noopener noreferrer"
                        className="inline-block text-xs mt-3 mb-2 underline" style={{ color: "#007AFF" }}>
                        Kargo Takip: {order.cargoTrackingNumber}
                      </a>
                    )}
                    <div className="mt-2 flex flex-col gap-1.5">
                      {order.lines.map((line, i) => (
                        <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: "rgba(0,0,0,0.04)" }}>
                          <span className="flex-1 text-sm" style={{ color: "#1D1D1F" }}>{line.productName}</span>
                          {line.productSize && <span className="text-[10px] px-2 py-0.5 border" style={{ borderColor: "#e5e5e5", color: "#86868B" }}>{line.productSize}</span>}
                          {line.productColor && <span className="text-[10px] px-2 py-0.5 border" style={{ borderColor: "#e5e5e5", color: "#86868B" }}>{line.productColor}</span>}
                          <span className="text-[10px] tabular-nums" style={{ color: "#86868B" }}>x{line.quantity}</span>
                          <span className="text-sm tabular-nums font-medium" style={{ color: "#1D1D1F" }}>{TL(line.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {data.totalPages > 1 && (
            <div className="flex gap-2 mt-4 items-center">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-4 py-2 text-xs uppercase border disabled:opacity-40" style={{ borderColor: "#e5e5e5", color: "#1D1D1F" }}>← Önceki</button>
              <span className="text-xs" style={{ color: "#86868B" }}>{page + 1} / {data.totalPages}</span>
              <button onClick={() => setPage(p => Math.min(data.totalPages - 1, p + 1))} disabled={page >= data.totalPages - 1} className="px-4 py-2 text-xs uppercase border disabled:opacity-40" style={{ borderColor: "#e5e5e5", color: "#1D1D1F" }}>Sonraki →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SEKME 2 — İSTATİSTİKLER
═══════════════════════════════════════════════════════════════ */
function IstatistiklerTab() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [aralik, setAralik] = useState<"bugun" | "yedi_gun" | "otuz_gun">("otuz_gun");

  useEffect(() => {
    fetch("/api/trendyol/stats", { headers: adminHeaders() })
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => setError("İstatistikler yüklenemedi"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm" style={{ color: "#86868B" }}>Yükleniyor...</p>;
  if (error) return <p className="text-sm" style={{ color: "#FF3B30" }}>{error}</p>;
  if (!stats) return null;

  const ARALIK_LABELS = { bugun: "Bugün", yedi_gun: "Son 7 Gün", otuz_gun: "Son 30 Gün" };
  const d = stats[aralik];

  return (
    <div>
      {/* Dönem seçici */}
      <div className="flex gap-2 mb-6">
        {(["bugun", "yedi_gun", "otuz_gun"] as const).map(k => (
          <button key={k} onClick={() => setAralik(k)}
            className="px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase transition-all"
            style={{ background: aralik === k ? "#1D1D1F" : "transparent", color: aralik === k ? "#c9a84c" : "#86868B", border: "1px solid", borderColor: aralik === k ? "#1D1D1F" : "#e5e5e5" }}>
            {ARALIK_LABELS[k]}
          </button>
        ))}
      </div>

      {/* Ana kartlar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Toplam Sipariş", value: d.total },
          { label: "Ciro", value: TL(d.ciro) },
          { label: "Ort. Sepet", value: TL(d.ortalama) },
          { label: "İptal / İade", value: d.iptal },
        ].map(s => (
          <div key={s.label} className="bg-white p-5 border" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
            <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: "#86868B" }}>{s.label}</p>
            <p className="text-2xl font-light tabular-nums" style={{ color: "#1D1D1F" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* En çok satanlar */}
      {d.topUrunler.length > 0 && (
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: "#86868B" }}>En Çok Satan Ürünler</p>
          <div className="flex flex-col gap-1.5">
            {d.topUrunler.map((u, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3 bg-white border" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                <span className="text-xs font-medium tabular-nums w-5 shrink-0" style={{ color: "#c9a84c" }}>#{i + 1}</span>
                <span className="flex-1 text-sm line-clamp-1" style={{ color: "#1D1D1F" }}>{u.name}</span>
                <span className="text-xs tabular-nums" style={{ color: "#86868B" }}>{u.adet} adet</span>
                <span className="text-sm font-medium tabular-nums" style={{ color: "#1D1D1F" }}>{TL(u.ciro)}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] mt-2" style={{ color: "#86868B" }}>* Son 200 siparişten hesaplanır</p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SEKME 3 — ÜRÜNLER
═══════════════════════════════════════════════════════════════ */
function UrunlerTab() {
  const [data, setData] = useState<ProductsResp | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [approved, setApproved] = useState<"" | "true" | "false">("");
  const [editing, setEditing] = useState<{ barcode: string; quantity: number; salePrice: number } | null>(null);
  const [saving, setSaving] = useState(false);

  const fetch_ = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const p = new URLSearchParams({ page: String(page), size: "20" });
      if (approved) p.set("approved", approved);
      const res = await fetch(`/api/trendyol/products?${p}`, { headers: adminHeaders() });
      const json = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(json.error));
      setData(json);
    } catch (e) { setError(e instanceof Error ? e.message : "Hata"); }
    finally { setLoading(false); }
  }, [page, approved]);

  useEffect(() => { fetch_(); }, [fetch_]);

  async function saveEdit() {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch("/api/trendyol/products", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...adminHeaders() },
        body: JSON.stringify({ items: [{ barcode: editing.barcode, quantity: editing.quantity, salePrice: editing.salePrice, listPrice: editing.salePrice }] }),
      });
      if (!res.ok) throw new Error("Güncelleme başarısız");
      setEditing(null);
      fetch_();
    } catch (e) { alert(e instanceof Error ? e.message : "Hata"); }
    finally { setSaving(false); }
  }

  return (
    <div>
      {data && <p className="text-xs mb-4" style={{ color: "#86868B" }}>Toplam {data.totalElements} ürün</p>}
      <div className="flex gap-2 mb-4">
        {[{ v: "" as const, l: "Tümü" }, { v: "true" as const, l: "Onaylı" }, { v: "false" as const, l: "Beklemede" }].map(s => (
          <button key={s.v} onClick={() => { setApproved(s.v); setPage(0); }}
            className="px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase transition-all"
            style={{ background: approved === s.v ? "#1D1D1F" : "transparent", color: approved === s.v ? "#c9a84c" : "#86868B", border: "1px solid", borderColor: approved === s.v ? "#1D1D1F" : "#e5e5e5" }}>
            {s.l}
          </button>
        ))}
      </div>
      {error && <p className="text-sm mb-3" style={{ color: "#FF3B30" }}>Hata: {error}</p>}
      {loading && <p className="text-sm" style={{ color: "#86868B" }}>Yükleniyor...</p>}

      {/* Düzenleme modalı */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white p-6 w-80 border" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
            <p className="text-sm font-medium mb-4" style={{ color: "#1D1D1F" }}>Stok & Fiyat Güncelle</p>
            <label className="block text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "#86868B" }}>Stok</label>
            <input type="number" value={editing.quantity} onChange={e => setEditing({ ...editing, quantity: Number(e.target.value) })}
              className="w-full px-3 py-2 text-sm border mb-3" style={{ borderColor: "#e5e5e5" }} />
            <label className="block text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "#86868B" }}>Satış Fiyatı (₺)</label>
            <input type="number" step="0.01" value={editing.salePrice} onChange={e => setEditing({ ...editing, salePrice: Number(e.target.value) })}
              className="w-full px-3 py-2 text-sm border mb-4" style={{ borderColor: "#e5e5e5" }} />
            <div className="flex gap-2">
              <button onClick={saveEdit} disabled={saving}
                className="flex-1 px-4 py-2 text-xs tracking-[0.15em] uppercase disabled:opacity-40"
                style={{ background: "#1D1D1F", color: "#c9a84c" }}>
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-xs border" style={{ borderColor: "#e5e5e5", color: "#86868B" }}>İptal</button>
            </div>
          </div>
        </div>
      )}

      {data && !loading && (
        <>
          <div className="flex flex-col gap-1.5">
            {data.content.map(p => (
              <div key={p.barcode} className="flex items-center gap-3 px-4 py-3 bg-white border" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                {p.images?.[0] && (
                  <img src={p.images[0].url} alt={p.title} className="w-10 h-10 object-cover shrink-0" style={{ border: "1px solid #eee" }} />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm line-clamp-1" style={{ color: "#1D1D1F" }}>{p.title}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "#86868B" }}>{p.categoryName} · {p.barcode}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium tabular-nums" style={{ color: "#1D1D1F" }}>{TL(p.salePrice)}</p>
                  <p className="text-[10px]" style={{ color: p.quantity <= 5 ? "#FF3B30" : "#34C759" }}>Stok: {p.quantity}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 shrink-0`} style={{ background: p.approved ? "#34C759" : "#FF9500", color: "#fff" }}>
                  {p.approved ? "Onaylı" : "Beklemede"}
                </span>
                <button onClick={() => setEditing({ barcode: p.barcode, quantity: p.quantity, salePrice: p.salePrice })}
                  className="shrink-0 text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 border hover:border-[#c9a84c] transition-colors"
                  style={{ borderColor: "#e5e5e5", color: "#86868B" }}>
                  Düzenle
                </button>
              </div>
            ))}
          </div>
          {data.totalPages > 1 && (
            <div className="flex gap-2 mt-4 items-center">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-4 py-2 text-xs uppercase border disabled:opacity-40" style={{ borderColor: "#e5e5e5", color: "#1D1D1F" }}>← Önceki</button>
              <span className="text-xs" style={{ color: "#86868B" }}>{page + 1} / {data.totalPages}</span>
              <button onClick={() => setPage(p => Math.min(data.totalPages - 1, p + 1))} disabled={page >= data.totalPages - 1} className="px-4 py-2 text-xs uppercase border disabled:opacity-40" style={{ borderColor: "#e5e5e5", color: "#1D1D1F" }}>Sonraki →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ANA SAYFA
═══════════════════════════════════════════════════════════════ */
const TABS = [
  { key: "siparisler", label: "Siparişler" },
  { key: "istatistikler", label: "İstatistikler" },
  { key: "urunler", label: "Ürünler" },
] as const;

type Tab = (typeof TABS)[number]["key"];

export default function TrendyolPage() {
  const [tab, setTab] = useState<Tab>("siparisler");

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-xl font-semibold mb-6" style={{ color: "#1D1D1F" }}>Trendyol</h1>

      {/* Tab bar */}
      <div className="flex border-b mb-6" style={{ borderColor: "#e5e5e5" }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="px-6 py-3 text-xs tracking-[0.2em] uppercase transition-colors relative"
            style={{ color: tab === t.key ? "#1D1D1F" : "#86868B" }}>
            {t.label}
            {tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "#1D1D1F" }} />}
          </button>
        ))}
      </div>

      {tab === "siparisler" && <SiparislerTab />}
      {tab === "istatistikler" && <IstatistiklerTab />}
      {tab === "urunler" && <UrunlerTab />}
    </div>
  );
}
