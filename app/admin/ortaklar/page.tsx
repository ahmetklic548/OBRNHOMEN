"use client";

import { useCallback, useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteField } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { normalizeKod, MAX_INDIRIM, MAX_KOMISYON, type OrtakTur, type OrtakModel } from "@/lib/partners";
import { TOPTAN } from "@/lib/kafileToptan";

/**
 * Kafile / influencer ortak kodları.
 * Kayıt: products/_ortaklar { kodlar: { KOD: { ad, tur, indirim, komisyon, aktif, odenen, olusturma } } }
 * Satışlar: siparisler koleksiyonundaki ortak.kod alanından sayılır.
 */

interface OrtakKayit {
  ad: string;
  tur: OrtakTur;
  indirim: number;
  komisyon: number;
  aktif: boolean;
  odenen?: number;
  olusturma?: string;
  model?: OrtakModel;
  whatsapp?: string;
}

interface SiparisOzet {
  ortak?: { kod?: string; komisyonTutari?: number } | null;
  coupon?: string | null;
  total?: number;
  paymentMethod?: string;
  paidAt?: number;
}

interface Istatistik { adet: number; kart: number; kapida: number; ciro: number; komisyon: number; son?: number }

const SITE = "https://www.obrnhomen.com";
const TUR_ETIKET: Record<OrtakTur, string> = { kafile: "Kafile", influencer: "Influencer", diger: "Diğer" };
const ref = () => doc(db!, "products", "_ortaklar");
const tl = (n: number) => n.toLocaleString("tr-TR", { maximumFractionDigits: 0 }) + " ₺";

const BOS = { kod: "", ad: "", tur: "kafile" as OrtakTur, indirim: 10, komisyon: 10, model: "kod" as OrtakModel, whatsapp: "" };
/** Kafileye verilen link: doğrudan hediyelik seçim ekranı */
const linkOf = (kod: string, o?: { tur?: OrtakTur }) => (o?.tur === "kafile" ? `${SITE}/hediyelik-hazirla?ref=${kod}` : `${SITE}/?ref=${kod}`);

export default function AdminOrtaklar() {
  const [kodlar, setKodlar] = useState<Record<string, OrtakKayit>>({});
  const [stat, setStat] = useState<Record<string, Istatistik>>({});
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(BOS);
  const [mesaj, setMesaj] = useState("");
  const [hata, setHata] = useState("");
  const [kopyalanan, setKopyalanan] = useState<string | null>(null);

  const yukle = useCallback(async () => {
    if (!db) { setLoading(false); return; }
    try {
      const snap = await getDoc(ref());
      setKodlar((snap.data()?.kodlar ?? {}) as Record<string, OrtakKayit>);
    } catch (e) {
      setHata("Kodlar okunamadı: " + (e as Error).message);
    }
    try {
      const s = await getDocs(collection(db, "siparisler"));
      const out: Record<string, Istatistik> = {};
      s.docs.forEach((d) => {
        const o = d.data() as SiparisOzet;
        const kod = o.ortak?.kod;
        if (!kod) return;
        const st = (out[kod] ??= { adet: 0, kart: 0, kapida: 0, ciro: 0, komisyon: 0 });
        st.adet++;
        if (o.paymentMethod === "kart") st.kart++; else st.kapida++;
        st.ciro += o.total ?? 0;
        st.komisyon += o.ortak?.komisyonTutari ?? 0;
        if (o.paidAt && (!st.son || o.paidAt > st.son)) st.son = o.paidAt;
      });
      setStat(out);
    } catch (e) {
      setHata("Siparişler okunamadı: " + (e as Error).message);
    }
    setLoading(false);
  }, []);

  useEffect(() => { yukle(); }, [yukle]);

  const kaydet = async (e: React.FormEvent) => {
    e.preventDefault();
    setHata(""); setMesaj("");
    const kod = normalizeKod(form.kod);
    if (kod.length < 3) return setHata("Kod en az 3 harf/rakam olmalı (ör. ABCTUR).");
    if (kod === "HOSGELDIN10") return setHata("Bu kod bülten kuponu olarak kullanılıyor.");
    if (!form.ad.trim()) return setHata("Kafile / kişi adını yaz.");
    const kayit: OrtakKayit = {
      ad: form.ad.trim().slice(0, 80),
      tur: form.tur,
      indirim: form.model === "toptan" ? 0 : Math.min(Math.max(Math.round(form.indirim), 0), MAX_INDIRIM),
      komisyon: form.model === "toptan" ? 0 : Math.min(Math.max(Math.round(form.komisyon), 0), MAX_KOMISYON),
      model: form.tur === "kafile" ? form.model : "kod",
      whatsapp: form.whatsapp.replace(/\D/g, "").replace(/^0/, "90").slice(0, 15),
      aktif: kodlar[kod]?.aktif ?? true,
      odenen: kodlar[kod]?.odenen ?? 0,
      olusturma: kodlar[kod]?.olusturma ?? new Date().toISOString().slice(0, 10),
    };
    try {
      await setDoc(ref(), { kodlar: { [kod]: kayit } }, { merge: true });
      setKodlar((k) => ({ ...k, [kod]: kayit }));
      setForm(BOS);
      setMesaj(`${kod} kaydedildi. Link: ${linkOf(kod, kayit)}`);
    } catch (e) {
      setHata("Kaydedilemedi: " + (e as Error).message);
    }
  };

  const guncelle = async (kod: string, alan: Partial<OrtakKayit>) => {
    setHata("");
    try {
      const yeni = { ...kodlar[kod], ...alan };
      await setDoc(ref(), { kodlar: { [kod]: yeni } }, { merge: true });
      setKodlar((k) => ({ ...k, [kod]: yeni }));
    } catch (e) {
      setHata("Güncellenemedi: " + (e as Error).message);
    }
  };

  const sil = async (kod: string) => {
    if (stat[kod]?.adet) return setHata(`${kod} ile satış yapılmış; silmek yerine pasif yap (geçmiş kayıtlar korunur).`);
    try {
      await updateDoc(ref(), { [`kodlar.${kod}`]: deleteField() });
      setKodlar((k) => { const c = { ...k }; delete c[kod]; return c; });
    } catch (e) {
      setHata("Silinemedi: " + (e as Error).message);
    }
  };

  const odemeEkle = async (kod: string) => {
    const girdi = window.prompt(`${kod} için ödediğin komisyon tutarı (₺):`);
    const n = Number((girdi ?? "").replace(",", "."));
    if (!girdi || !Number.isFinite(n) || n <= 0) return;
    await guncelle(kod, { odenen: Math.round(((kodlar[kod].odenen ?? 0) + n) * 100) / 100 });
  };

  const kopyala = async (kod: string) => {
    try {
      await navigator.clipboard.writeText(linkOf(kod, kodlar[kod]));
      setKopyalanan(kod);
      setTimeout(() => setKopyalanan(null), 1500);
    } catch {}
  };

  const liste = Object.entries(kodlar).sort((a, b) => (stat[b[0]]?.ciro ?? 0) - (stat[a[0]]?.ciro ?? 0) || a[0].localeCompare(b[0]));
  const toplam = Object.values(stat).reduce((s, x) => ({ ciro: s.ciro + x.ciro, komisyon: s.komisyon + x.komisyon, adet: s.adet + x.adet }), { ciro: 0, komisyon: 0, adet: 0 });

  const input = "border bg-white px-3 py-2 text-sm focus:outline-none focus:border-black";
  const bc = { borderColor: "rgba(0,0,0,0.12)", color: "#1D1D1F" };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
        <h1 className="text-xl font-semibold" style={{ color: "#1D1D1F" }}>
          Ortak Kodları <span className="text-sm font-normal ml-2" style={{ color: "#86868B" }}>({liste.length})</span>
        </h1>
        <span className="text-sm" style={{ color: "#86868B" }}>
          {toplam.adet} sipariş · <b style={{ color: "#c9a84c" }}>{tl(toplam.ciro)}</b> ciro · {tl(toplam.komisyon)} komisyon
        </span>
      </div>
      <p className="text-sm mb-6" style={{ color: "#86868B" }}>
        Kafile ve influencer&apos;lara özel kod. Müşteri kodu ödeme ekranına yazar ya da <code>{SITE}/?ref=KOD</code> linkiyle gelir
        (kod 30 gün hatırlanır, ödemede kendiliğinden uygulanır). Komisyon, indirim sonrası ürün tutarından hesaplanır; kargo hariç.
      </p>

      {/* Yeni kod */}
      <form onSubmit={kaydet} className="bg-white border p-4 mb-6 grid gap-3 md:grid-cols-[1fr_1.5fr_1fr_1.3fr_0.7fr_0.7fr_1.2fr_auto] items-end" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        <label className="text-xs" style={{ color: "#86868B" }}>Kod
          <input className={input + " w-full mt-1 uppercase"} style={bc} value={form.kod} placeholder="ABCTUR"
            onChange={(e) => setForm({ ...form, kod: normalizeKod(e.target.value) })} />
        </label>
        <label className="text-xs" style={{ color: "#86868B" }}>Kafile / kişi adı
          <input className={input + " w-full mt-1"} style={bc} value={form.ad} placeholder="ABC Turizm"
            onChange={(e) => setForm({ ...form, ad: e.target.value })} />
        </label>
        <label className="text-xs" style={{ color: "#86868B" }}>Tür
          <select className={input + " w-full mt-1"} style={bc} value={form.tur}
            onChange={(e) => {
              const tur = e.target.value as OrtakTur;
              setForm({ ...form, tur, ...(tur === "influencer" ? { indirim: 10, komisyon: 15 } : tur === "kafile" ? { indirim: 10, komisyon: 10 } : {}) });
            }}>
            <option value="kafile">Kafile</option>
            <option value="influencer">Influencer</option>
            <option value="diger">Diğer</option>
          </select>
        </label>
        <label className="text-xs" style={{ color: "#86868B" }}>Çalışma şekli
          <select className={input + " w-full mt-1"} style={bc} value={form.tur === "kafile" ? form.model : "kod"} disabled={form.tur !== "kafile"}
            onChange={(e) => setForm({ ...form, model: e.target.value as OrtakModel })}>
            <option value="kod">Yol 2 · Kod (indirim + komisyon)</option>
            <option value="toptan">Yol 1 · Kafile satar (-%{TOPTAN.INDIRIM})</option>
          </select>
        </label>
        <label className="text-xs" style={{ color: "#86868B" }}>İndirim %
          <input type="number" min={0} max={MAX_INDIRIM} className={input + " w-full mt-1"} style={bc} value={form.indirim}
            onChange={(e) => setForm({ ...form, indirim: Number(e.target.value) })} />
        </label>
        <label className="text-xs" style={{ color: "#86868B" }}>Komisyon %
          <input type="number" min={0} max={MAX_KOMISYON} className={input + " w-full mt-1"} style={bc} value={form.komisyon}
            onChange={(e) => setForm({ ...form, komisyon: Number(e.target.value) })} />
        </label>
        <label className="text-xs" style={{ color: "#86868B" }}>Kafile WhatsApp
          <input className={input + " w-full mt-1"} style={bc} value={form.whatsapp} placeholder="05xx xxx xx xx" inputMode="tel"
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
        </label>
        <button type="submit" className="px-5 py-2 text-sm font-medium" style={{ background: "#1D1D1F", color: "#fff" }}>Kaydet</button>
      </form>

      {mesaj && <p className="text-sm mb-4" style={{ color: "#16a34a" }}>✓ {mesaj}</p>}
      {hata && <p className="text-sm mb-4" style={{ color: "#dc2626" }}>{hata}</p>}

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 bg-white animate-pulse" />)}</div>
      ) : liste.length === 0 ? (
        <p className="text-sm text-center py-16" style={{ color: "#86868B" }}>Henüz kod yok. İlk kafile ya da influencer kodunu yukarıdan ekle.</p>
      ) : (
        <div className="bg-white border overflow-x-auto" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left" style={{ borderColor: "rgba(0,0,0,0.06)", background: "#F5F5F7" }}>
                {["Kod", "Ortak", "İnd. / Kom.", "Sipariş", "Ciro", "Komisyon", "Ödenen / Kalan", ""].map((h) => (
                  <th key={h} className="px-3 py-3 text-[10px] tracking-[0.2em] uppercase font-medium whitespace-nowrap" style={{ color: "#86868B" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {liste.map(([kod, o]) => {
                const s = stat[kod];
                const kalan = Math.max((s?.komisyon ?? 0) - (o.odenen ?? 0), 0);
                return (
                  <tr key={kod} className="border-b align-top" style={{ borderColor: "rgba(0,0,0,0.04)", opacity: o.aktif ? 1 : 0.5 }}>
                    <td className="px-3 py-3 font-mono font-semibold whitespace-nowrap">
                      {kod}
                      <button onClick={() => kopyala(kod)} className="block text-[11px] font-sans font-normal underline mt-1" style={{ color: "#9a7a2c" }}>
                        {kopyalanan === kod ? "Kopyalandı ✓" : "Linki kopyala"}
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      {o.ad}
                      <span className="block text-[11px]" style={{ color: "#86868B" }}>
                        {TUR_ETIKET[o.tur] ?? o.tur}{o.olusturma && ` · ${o.olusturma}`}{!o.aktif && " · PASİF"}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {o.model === "toptan" ? <span style={{ color: "#9a7a2c" }}>Yol 1 · -%{TOPTAN.INDIRIM}</span> : <>%{o.indirim} / %{o.komisyon}</>}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {s?.adet ?? 0}
                      {s && <span className="block text-[11px]" style={{ color: "#86868B" }}>{s.kart} kart · {s.kapida} kapıda</span>}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">{tl(s?.ciro ?? 0)}</td>
                    <td className="px-3 py-3 whitespace-nowrap" style={{ color: "#9a7a2c" }}>{tl(s?.komisyon ?? 0)}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {tl(o.odenen ?? 0)} / <b>{tl(kalan)}</b>
                      <button onClick={() => odemeEkle(kod)} className="block text-[11px] underline mt-1" style={{ color: "#1D1D1F" }}>Ödeme ekle</button>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-right">
                      <button onClick={() => guncelle(kod, { aktif: !o.aktif })} className="text-[12px] underline mr-3">{o.aktif ? "Pasif yap" : "Aktif yap"}</button>
                      <button onClick={() => setForm({ kod, ad: o.ad, tur: o.tur, indirim: o.indirim, komisyon: o.komisyon, model: o.model ?? "kod", whatsapp: o.whatsapp ?? "" })} className="text-[12px] underline mr-3">Düzenle</button>
                      {!s?.adet && <button onClick={() => sil(kod)} className="text-[12px] underline" style={{ color: "#dc2626" }}>Sil</button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-[12px] mt-4" style={{ color: "#86868B" }}>
        Kapıda ödemeli siparişler WhatsApp onayından önce de sayılır; komisyonu ödemeden önce siparişin teslim edildiğini Siparişler sayfasından kontrol et.
        Sınırlar: indirim en fazla %{MAX_INDIRIM}, komisyon en fazla %{MAX_KOMISYON}. Yol 1 (kafile satar) kodları sitede indirim vermez;
        umreci listesini kafileye gönderir, listeler <a href="/admin/kafile-toptan" className="underline">Kafile Toptan</a> sayfasında toplanır.
      </p>
    </div>
  );
}
