"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { qtyText } from "@/lib/pack";
import { indirimsizTutar } from "@/lib/pricing";
import { TOPTAN, TOPTAN_KURALLAR, DURUM_ETIKET, kafileTutari, type ListeDurum } from "@/lib/kafileToptan";
import { toplamaListesi, paketFisleri, hediyeKartlari, koliBilgiKartlari, kartSayisi as kartSay, type HazirlikListe } from "@/lib/hazirlikCikti";

/**
 * Yol 1 — Kafile satar. Umrecilerin /hediyelik-hazirla?ref=KOD'dan gönderdiği listeler
 * (siparisler, paymentMethod "kafile-toptan") kafile kafile toplanır:
 * özet → kafile onayı + kapora → toplama listesi, paket fişleri, hediye kartları → teslim.
 */

interface Kalem { slug: string; name: string; sku?: string; price: number; qty: number; pack?: number }
interface Liste {
  id: string;
  orderId: string;
  name: string;
  phone: string;
  kartIsim?: string;
  items: Kalem[];
  total: number;
  kafileTutari?: number;
  kafile: { kod: string; ad: string };
  status: ListeDurum;
  paidAt: number;
}

const tl = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + " ₺";
const DURUMLAR = Object.keys(DURUM_ETIKET) as ListeDurum[];
const adet = (k: Kalem) => k.qty * (k.pack ?? 1);
const hazirlik = (l: Liste): HazirlikListe => ({ orderId: l.orderId, name: l.name, phone: l.phone, kartIsim: l.kartIsim, grupAd: l.kafile.ad, items: l.items });
const kartSayisi = (l: Liste) => kartSay(hazirlik(l));

export default function KafileToptan() {
  const [listeler, setListeler] = useState<Liste[]>([]);
  const [loading, setLoading] = useState(true);
  const [hata, setHata] = useState("");
  const [aktifKod, setAktifKod] = useState<string | null>(null);
  const [secili, setSecili] = useState<Record<string, boolean>>({});
  const [kopya, setKopya] = useState(false);

  const yukle = useCallback(async () => {
    if (!db) { setLoading(false); return; }
    try {
      const snap = await getDocs(query(collection(db, "siparisler"), where("paymentMethod", "==", "kafile-toptan")));
      const l = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Liste)).sort((a, b) => b.paidAt - a.paidAt);
      setListeler(l);
      setAktifKod((k) => k ?? l[0]?.kafile?.kod ?? null);
    } catch (e) {
      setHata("Listeler okunamadı: " + (e as Error).message);
    }
    setLoading(false);
  }, []);
  useEffect(() => { void Promise.resolve().then(yukle); }, [yukle]);

  const kafileler = useMemo(() => {
    const m = new Map<string, { ad: string; sayi: number; yeni: number }>();
    listeler.forEach((l) => {
      const x = m.get(l.kafile.kod) ?? { ad: l.kafile.ad, sayi: 0, yeni: 0 };
      x.sayi++;
      if (l.status === "yeni") x.yeni++;
      m.set(l.kafile.kod, x);
    });
    return [...m.entries()];
  }, [listeler]);

  const bu = listeler.filter((l) => l.kafile.kod === aktifKod);
  const kafileAd = bu[0]?.kafile.ad ?? "";
  // Varsayılan seçim: iptal ve teslim edilmemiş tüm listeler
  const secilenler = bu.filter((l) => secili[l.id] ?? (l.status !== "iptal" && l.status !== "teslim"));
  const siteToplam = secilenler.reduce((s, l) => s + (l.total ?? 0), 0);
  const kafileToplam = kafileTutari(siteToplam, secilenler.reduce((s, l) => s + indirimsizTutar(l.items ?? []), 0));
  const minOran = Math.min(1, kafileToplam / TOPTAN.MIN_TUTAR);
  const kapora = Math.round(kafileToplam * TOPTAN.KAPORA / 100);

  const durumDegis = async (ids: string[], status: ListeDurum) => {
    setHata("");
    try {
      await Promise.all(ids.map((id) => updateDoc(doc(db!, "siparisler", id), { status })));
      setListeler((ls) => ls.map((l) => (ids.includes(l.id) ? { ...l, status } : l)));
    } catch (e) {
      setHata("Güncellenemedi: " + (e as Error).message);
    }
  };

  // ---- Çıktılar (lib/hazirlikCikti) ----
  const cikti = () => secilenler.map(hazirlik);

  const ozetMetni = () => [
    `${kafileAd} — umre hediyelik siparişi özeti`,
    ``,
    ...secilenler.map((l, i) => `${i + 1}) ${l.name} — ${l.items.reduce((s, k) => s + adet(k), 0)} parça · site fiyatı ${tl(l.total)}`),
    ``,
    `Umrecilere satış toplamı (site fiyatı): ${tl(siteToplam)}`,
    `Kafile fiyatı (-%${TOPTAN.INDIRIM}): ${tl(kafileToplam)}`,
    `Kafilenizin kazancı: ${tl(siteToplam - kafileToplam)}`,
    `Onay için kapora (%${TOPTAN.KAPORA}): ${tl(kapora)} · kalanı teslimde`,
    kafileToplam < TOPTAN.MIN_TUTAR
      ? `Not: Bu yolda en az sipariş ${tl(TOPTAN.MIN_TUTAR)} (sizin ödeyeceğiniz tutar). Şu an ${tl(TOPTAN.MIN_TUTAR - kafileToplam)} eksik. Tamamlanmazsa umrecileriniz size özel kodla siteden %10 indirimli alabilir, siz de her satıştan %10 kazanırsınız.`
      : ``,
    ``,
    `Şartlar:`,
    ...TOPTAN_KURALLAR.map((k) => `• ${k}`),
  ].filter((x, i, a) => !(x === "" && a[i - 1] === "")).join("\n");

  const ozetKopyala = async () => {
    try { await navigator.clipboard.writeText(ozetMetni()); setKopya(true); setTimeout(() => setKopya(false), 1500); } catch {}
  };

  const btn = "px-3.5 py-2 text-[13px] font-medium border";
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-xl font-semibold mb-1" style={{ color: "#1D1D1F" }}>Kafile Toptan <span className="text-sm font-normal ml-2" style={{ color: "#86868B" }}>Yol 1 · kafile satar (-%{TOPTAN.INDIRIM})</span></h1>
      <p className="text-sm mb-6" style={{ color: "#86868B" }}>
        Umreciler /hediyelik-hazirla?ref=KOD&apos;dan listesini gönderir (ödeme yok). Akış: <b>Yeni liste</b> → kafileye özeti gönder →
        kafile onay + %{TOPTAN.KAPORA} kapora → <b>Kafile onayladı</b> → toplama listesi, paket fişleri, kartlar → <b>Hazırlanıyor</b> → <b>Teslim</b>.
        En az sipariş {tl(TOPTAN.MIN_TUTAR)} (kafile fiyatıyla).
      </p>
      {hata && <p className="text-sm mb-4" style={{ color: "#dc2626" }}>{hata}</p>}

      {loading ? (
        <div className="h-24 bg-white animate-pulse" />
      ) : kafileler.length === 0 ? (
        <p className="text-sm text-center py-16" style={{ color: "#86868B" }}>
          Henüz liste yok. Ortak Kodları&apos;nda bir kafileyi &quot;Yol 1 · Kafile satar&quot; olarak ekle ve hediyelik linkini kafileye ver.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-5">
            {kafileler.map(([kod, x]) => (
              <button key={kod} onClick={() => { setAktifKod(kod); setSecili({}); }}
                className="px-3 py-1.5 text-[13px] border" style={kod === aktifKod ? { background: "#1D1D1F", color: "#fff", borderColor: "#1D1D1F" } : { background: "#fff", borderColor: "rgba(0,0,0,0.12)" }}>
                {x.ad} <span style={{ opacity: 0.6 }}>· {x.sayi}{x.yeni ? ` (${x.yeni} yeni)` : ""}</span>
              </button>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-4 mb-5">
            {[
              ["Seçili liste", `${secilenler.length} umreci`],
              ["Site fiyatı toplam", tl(siteToplam)],
              [`Kafile fiyatı (-%${TOPTAN.INDIRIM})`, tl(kafileToplam)],
              [`Kapora (%${TOPTAN.KAPORA})`, tl(kapora)],
            ].map(([a, b]) => (
              <div key={a} className="bg-white border p-4" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                <p className="text-[11px] uppercase tracking-wider" style={{ color: "#86868B" }}>{a}</p>
                <p className="text-lg font-semibold mt-1">{b}</p>
              </div>
            ))}
          </div>
          <div className="bg-white border p-4 mb-5" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            <div className="flex justify-between text-[13px] mb-1.5">
              <span>En az sipariş: {tl(TOPTAN.MIN_TUTAR)}</span>
              <span style={{ color: minOran >= 1 ? "#16a34a" : "#9a7a2c" }}>
                {minOran >= 1 ? "✓ Sınır aşıldı" : `${tl(TOPTAN.MIN_TUTAR - kafileToplam)} eksik`}
              </span>
            </div>
            <div className="h-2 bg-stone-100"><div className="h-2" style={{ width: `${minOran * 100}%`, background: minOran >= 1 ? "#16a34a" : "#c9a84c" }} /></div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={ozetKopyala} className={btn} style={{ background: "#1D1D1F", color: "#fff" }}>{kopya ? "Kopyalandı ✓" : "Kafileye özet (WhatsApp metni)"}</button>
            <button onClick={() => toplamaListesi(kafileAd, cikti())} className={btn}>Toplama listesi</button>
            <button onClick={() => paketFisleri(kafileAd, cikti())} className={btn}>Paket fişleri</button>
            <button onClick={() => hediyeKartlari(kafileAd, cikti())} className={btn}>Hediye kartları (A4)</button>
            <button onClick={() => koliBilgiKartlari(cikti())} className={btn}>Koli bilgi kartları</button>
            <span className="mx-1" />
            <button onClick={() => durumDegis(secilenler.map((l) => l.id), "onaylandi")} className={btn}>Seçilileri: kafile onayladı</button>
            <button onClick={() => durumDegis(secilenler.map((l) => l.id), "hazirlaniyor")} className={btn}>Hazırlanıyor</button>
            <button onClick={() => durumDegis(secilenler.map((l) => l.id), "teslim")} className={btn}>Teslim edildi</button>
          </div>

          <div className="bg-white border overflow-x-auto" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left" style={{ borderColor: "rgba(0,0,0,0.06)", background: "#F5F5F7" }}>
                  {["", "Umreci", "Kart ismi", "Ürünler", "Site", "Kafile", "Durum"].map((h) => (
                    <th key={h} className="px-3 py-3 text-[10px] tracking-[0.2em] uppercase font-medium whitespace-nowrap" style={{ color: "#86868B" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bu.map((l) => {
                  const sec = secili[l.id] ?? (l.status !== "iptal" && l.status !== "teslim");
                  return (
                    <tr key={l.id} className="border-b align-top" style={{ borderColor: "rgba(0,0,0,0.04)", opacity: l.status === "iptal" ? 0.45 : 1 }}>
                      <td className="px-3 py-3"><input type="checkbox" checked={sec} onChange={(e) => setSecili((s) => ({ ...s, [l.id]: e.target.checked }))} /></td>
                      <td className="px-3 py-3 whitespace-nowrap">{l.name}<span className="block text-[11px]" style={{ color: "#86868B" }}>{l.phone} · {new Date(l.paidAt).toLocaleDateString("tr-TR")}</span></td>
                      <td className="px-3 py-3">{l.kartIsim || <span style={{ color: "#86868B" }}>—</span>}<span className="block text-[11px]" style={{ color: "#86868B" }}>{kartSayisi(l)} kart</span></td>
                      <td className="px-3 py-3 text-[12px]">{l.items.map((k) => <div key={k.slug}>{qtyText(k.qty, k.pack)} · {k.name.slice(0, 48)}</div>)}</td>
                      <td className="px-3 py-3 whitespace-nowrap">{tl(l.total)}</td>
                      <td className="px-3 py-3 whitespace-nowrap" style={{ color: "#9a7a2c" }}>{tl(l.kafileTutari ?? kafileTutari(l.total, indirimsizTutar(l.items ?? [])))}</td>
                      <td className="px-3 py-3">
                        <select value={l.status} onChange={(e) => durumDegis([l.id], e.target.value as ListeDurum)} className="border px-2 py-1 text-[12px]" style={{ borderColor: "rgba(0,0,0,0.12)" }}>
                          {DURUMLAR.map((d) => <option key={d} value={d}>{DURUM_ETIKET[d]}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="mt-8 bg-white border p-5" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        <p className="text-[13px] font-semibold mb-2">Yol 1 şartları (kafileye özetle birlikte gider)</p>
        <ul className="list-disc pl-5 text-[13px] space-y-1" style={{ color: "#3d3d3f" }}>{TOPTAN_KURALLAR.map((k) => <li key={k}>{k}</li>)}</ul>
      </div>
    </div>
  );
}
