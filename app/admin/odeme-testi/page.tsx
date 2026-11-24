"use client";

import { useEffect, useRef, useState } from "react";
import { adminHeaders } from "@/lib/adminClient";
import { useAuth } from "@/app/components/AuthProvider";

/** 1 ₺'lik gerçek kart ödemesi testi — sadece admin. Akış canlı siparişle birebir aynı (PayTR → notify → sipariş kaydı + mail). */
export default function OdemeTesti() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "Ödeme testi" });
  const [token, setToken] = useState<string | null>(null);
  const [oid, setOid] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.email) setForm((f) => ({ ...f, email: f.email || user.email!, name: f.name || user.displayName || "" }));
  }, [user]);

  useEffect(() => {
    if (!token || !box.current) return;
    box.current.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.paytr.com/odeme/guvenli/${token}`;
    iframe.style.cssText = "width:100%;height:620px;border:none;";
    box.current.appendChild(iframe);
  }, [token]);

  const start = async () => {
    setErr(""); setBusy(true);
    try {
      const res = await fetch("/api/paytr-token", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await adminHeaders()) },
        body: JSON.stringify({ ...form, adminTest: true }),
      });
      const d = await res.json();
      if (!res.ok || !d.token) { setErr(d.error ?? "Başlatılamadı"); return; }
      setOid(d.merchant_oid); setToken(d.token);
    } catch { setErr("Bağlantı hatası"); } finally { setBusy(false); }
  };

  const inp = "w-full border px-3 py-2 text-sm";
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-xl font-semibold mb-2">Ödeme Testi (1 ₺)</h1>
      <p className="text-sm mb-6" style={{ color: "#86868B" }}>
        Gerçek kartla 1 ₺ çekilir, kargo yok. Ödeme bitince sipariş kaydı ve mailler normal siparişteki gibi oluşur.
        Sonra PayTR panelinden iade edip Siparişler&apos;den silebilirsin.
      </p>
      {!token ? (
        <div className="space-y-3">
          <input className={inp} placeholder="Ad Soyad" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className={inp} placeholder="Telefon (05...)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className={inp} placeholder="E-posta" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className={inp} placeholder="Adres" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button onClick={start} disabled={busy || !form.name || !form.email || !form.phone}
            className="px-6 py-3 text-sm text-white disabled:opacity-50" style={{ background: "#1D1D1F" }}>
            {busy ? "Hazırlanıyor…" : "1 ₺ ile Kart Ödemesini Başlat"}
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs mb-3" style={{ color: "#86868B" }}>Sipariş no: {oid}</p>
          <div ref={box} />
        </>
      )}
    </div>
  );
}
