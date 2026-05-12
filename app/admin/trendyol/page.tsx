"use client";

import { useState, useEffect, useCallback } from "react";

const STATUS_OPTIONS = [
  { value: "", label: "Tümü" },
  { value: "Created", label: "Oluşturuldu" },
  { value: "Picking", label: "Hazırlanıyor" },
  { value: "Invoiced", label: "Faturalandı" },
  { value: "Shipped", label: "Kargoya Verildi" },
  { value: "Delivered", label: "Teslim Edildi" },
  { value: "Cancelled", label: "İptal" },
  { value: "Returned", label: "İade" },
];

const STATUS_COLORS: Record<string, string> = {
  Created: "#007AFF",
  Picking: "#FF9500",
  Invoiced: "#AF52DE",
  Shipped: "#34C759",
  Delivered: "#34C759",
  Cancelled: "#FF3B30",
  Returned: "#FF3B30",
  UnDelivered: "#FF9500",
  Repack: "#FF9500",
};

interface OrderLine {
  productName: string;
  quantity: number;
  price: number;
  currencyCode: string;
  productSize?: string;
  productColor?: string;
}

interface Order {
  orderNumber: string;
  status: string;
  orderDate: number;
  grossAmount: number;
  currencyCode: string;
  customerFirstName: string;
  customerLastName: string;
  cargoTrackingNumber?: string;
  lines: OrderLine[];
}

interface ApiResponse {
  content: Order[];
  totalPages: number;
  totalElements: number;
  page: number;
}

export default function TrendyolPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), size: "20" });
      if (status) params.set("status", status);
      const res = await fetch(`/api/trendyol/orders?${params}`);
      const json = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(json.error));
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  function formatDate(ts: number) {
    return new Date(ts).toLocaleString("tr-TR");
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-xl font-semibold mb-2" style={{ color: "#1D1D1F" }}>
        Trendyol Siparişleri
      </h1>

      {data && (
        <p className="text-xs mb-6" style={{ color: "#86868B" }}>
          Toplam {data.totalElements} sipariş
        </p>
      )}

      {/* Filtre */}
      <div className="flex gap-2 flex-wrap mb-6">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s.value}
            onClick={() => { setStatus(s.value); setPage(0); }}
            className="px-4 py-1.5 text-xs tracking-[0.15em] uppercase transition-all"
            style={{
              background: status === s.value ? "#1D1D1F" : "transparent",
              color: status === s.value ? "#c9a84c" : "#86868B",
              border: "1px solid",
              borderColor: status === s.value ? "#1D1D1F" : "#e5e5e5",
            }}
          >
            {s.label}
          </button>
        ))}
        <button
          onClick={fetchOrders}
          className="ml-auto px-4 py-1.5 text-xs tracking-[0.15em] uppercase border transition-colors hover:border-[#c9a84c]"
          style={{ borderColor: "#e5e5e5", color: "#1D1D1F" }}
        >
          Yenile
        </button>
      </div>

      {error && (
        <p className="text-sm mb-4" style={{ color: "#FF3B30" }}>
          Hata: {error}
        </p>
      )}

      {loading && (
        <p className="text-sm" style={{ color: "#86868B" }}>Yükleniyor...</p>
      )}

      {/* Sipariş Listesi */}
      {data && !loading && (
        <>
          <div className="flex flex-col gap-2">
            {data.content.length === 0 && (
              <p className="text-sm" style={{ color: "#86868B" }}>Sipariş bulunamadı.</p>
            )}
            {data.content.map((order) => (
              <div key={order.orderNumber} className="border bg-white" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                {/* Başlık satırı */}
                <button
                  onClick={() => setExpanded(expanded === order.orderNumber ? null : order.orderNumber)}
                  className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span
                    className="shrink-0 text-[10px] tracking-[0.15em] uppercase px-2 py-0.5"
                    style={{
                      background: STATUS_COLORS[order.status] ?? "#86868B",
                      color: "#fff",
                    }}
                  >
                    {order.status}
                  </span>
                  <span className="text-sm font-medium flex-1" style={{ color: "#1D1D1F" }}>
                    #{order.orderNumber}
                  </span>
                  <span className="text-xs" style={{ color: "#86868B" }}>
                    {order.customerFirstName} {order.customerLastName}
                  </span>
                  <span className="text-sm font-medium tabular-nums" style={{ color: "#1D1D1F" }}>
                    {order.grossAmount.toLocaleString("tr-TR")} {order.currencyCode}
                  </span>
                  <span className="text-[10px]" style={{ color: "#86868B" }}>
                    {formatDate(order.orderDate)}
                  </span>
                  <span className="text-xs" style={{ color: "#86868B" }}>
                    {expanded === order.orderNumber ? "▲" : "▼"}
                  </span>
                </button>

                {/* Detay */}
                {expanded === order.orderNumber && (
                  <div className="px-5 pb-4 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                    {order.cargoTrackingNumber && (
                      <p className="text-xs mt-3 mb-2" style={{ color: "#86868B" }}>
                        Kargo Takip: <span style={{ color: "#1D1D1F" }}>{order.cargoTrackingNumber}</span>
                      </p>
                    )}
                    <div className="mt-3 flex flex-col gap-2">
                      {order.lines.map((line, i) => (
                        <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: "rgba(0,0,0,0.04)" }}>
                          <span className="flex-1 text-sm" style={{ color: "#1D1D1F" }}>
                            {line.productName}
                          </span>
                          {line.productSize && (
                            <span className="text-xs px-2 py-0.5 border" style={{ borderColor: "#e5e5e5", color: "#86868B" }}>
                              {line.productSize}
                            </span>
                          )}
                          {line.productColor && (
                            <span className="text-xs px-2 py-0.5 border" style={{ borderColor: "#e5e5e5", color: "#86868B" }}>
                              {line.productColor}
                            </span>
                          )}
                          <span className="text-xs tabular-nums" style={{ color: "#86868B" }}>
                            x{line.quantity}
                          </span>
                          <span className="text-sm tabular-nums font-medium" style={{ color: "#1D1D1F" }}>
                            {line.price.toLocaleString("tr-TR")} {line.currencyCode}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sayfalama */}
          {data.totalPages > 1 && (
            <div className="flex gap-2 mt-6 items-center">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 text-xs tracking-[0.15em] uppercase border disabled:opacity-40"
                style={{ borderColor: "#e5e5e5", color: "#1D1D1F" }}
              >
                ← Önceki
              </button>
              <span className="text-xs" style={{ color: "#86868B" }}>
                {page + 1} / {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages - 1, p + 1))}
                disabled={page >= data.totalPages - 1}
                className="px-4 py-2 text-xs tracking-[0.15em] uppercase border disabled:opacity-40"
                style={{ borderColor: "#e5e5e5", color: "#1D1D1F" }}
              >
                Sonraki →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
