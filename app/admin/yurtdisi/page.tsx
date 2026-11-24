"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { yazdir } from "@/lib/hazirlikCikti";
import {
  AYAR_ID, PROFORMA_CSS, YD_DURUM, araToplam, genelToplam, kalan, kaporaTutari, odenen, para, proformaHtml, yeniNo,
  type Para, type YDAyar, type YDDurum, type YDKalem, type YDProforma,
} from "@/lib/yurtdisi";

/**
 * Yurt dışı toptan: müşteri kartları + İngilizce proforma (USD/EUR) + kapora/bakiye takibi.
 * Veri: Firestore `yurtdisi` (kural: sadece admin okur/yazar). `_ayar` belgesi banka bilgisini tutar.
 */

const bugun = () => new Date().toISOString().slice(0, 10);
const bosKalem = (): YDKalem => ({ kod: "", aciklama: "", paket: "", adet: 1, birim: 0 });
const DURUMLAR = Object.keys(YD_DURUM) as YDDurum[];
const inp = "w-full rounded border border-stone-300 px-2 py-1.5 text-[13px] focus:border-black focus:outline-none";
const btn = "rounded border bg-white px-3 py-1.5 text-[12.5px] font-medium hover:bg-stone-50";

export default function YurtDisi() {
  const [list, setList] = useState<YDProforma[]>([]);
  const [ayar, setAyar] = useState<YDAyar>({ banka: "" });
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<YDProforma | null>(null);
  const [hata, setHata] = useState("");
  const [filtre, setFiltre] = useState<"acik" | "hepsi">("acik");

  useEffect(() => {
    (async () => {
      if (!db) { setLoading(false); return; }
      try {
        const snap = await getDocs(collection(db, "yurtdisi"));
        const rows: YDProforma[] = [];
        snap.docs.forEach((d) => {
          if (d.id === AYAR_ID) setAyar({ banka: String((d.data() as Partial<YDAyar>).banka ?? "") });
          else rows.push({ ...(d.data() as YDProforma), id: d.id });
        });
        setList(rows.sort((a, b) => b.createdAt - a.createdAt));
      } catch (e) {
        setHata("Yüklenemedi: " + (e as Error).message);
      }
      setLoading(false);
    })();
  }, []);

  const yeni = () => {
    const no = yeniNo(list.map((p) => p.no));
    setEdit({
      id: no, no, tarih: bugun(), musteri: { ad: "", ulke: "" }, para: "USD", kalemler: [bosKalem()],
      kargo: 0, kaporaYuzde: 50, odemeler: [], durum: "teklif", teslimSekli: "EXW Istanbul", createdAt: Date.now(),
    });
  };

  // Aynı müşteriye yeni teklif: bilgileri kopyala
  const tekrar = (p: YDProforma) => {
    const no = yeniNo(list.map((x) => x.no));
    setEdit({ ...p, id: no, no, tarih: bugun(), odemeler: [], durum: "teklif", createdAt: Date.now(), not: "" });
  };

  const kaydet = async (p: YDProforma) => {
    setHata("");
    if (!p.musteri.ad.trim() || !p.musteri.ulke.trim()) return setHata("Müşteri adı ve ülke zorunlu.");
    const temiz: YDProforma = {
      ...p,
      kalemler: p.kalemler.filter((k) => k.kod || k.aciklama).map((k) => ({ ...k, adet: Number(k.adet) || 0, birim: Number(k.birim) || 0 })),
      odemeler: p.odemeler.filter((o) => Number(o.tutar)).map((o) => ({ ...o, tutar: Number(o.tutar) })),
      kargo: Number(p.kargo) || 0,
      kaporaYuzde: Number(p.kaporaYuzde) || 0,
    };
    try {
      const { id, ...veri } = temiz;
      await setDoc(doc(db!, "yurtdisi", id), JSON.parse(JSON.stringify(veri)));
      setList((l) => [temiz, ...l.filter((x) => x.id !== id)].sort((a, b) => b.createdAt - a.createdAt));
      setEdit(null);
    } catch (e) {
      setHata("Kaydedilemedi: " + (e as Error).message);
    }
  };

  const sil = async (p: YDProforma) => {
    if (!window.confirm(`${p.no} (${p.musteri.firma || p.musteri.ad}) kalıcı olarak silinsin mi?`)) return;
    try {
      await deleteDoc(doc(db!, "yurtdisi", p.id));
      setList((l) => l.filter((x) => x.id !== p.id));
      setEdit(null);
    } catch (e) {
      setHata("Silinemedi: " + (e as Error).message);
    }
  };

  const bankaKaydet = async () => {
    try {
      await setDoc(doc(db!, "yurtdisi", AYAR_ID), ayar);
      setHata("");
      window.alert("Banka bilgisi kaydedildi.");
    } catch (e) {
      setHata("Banka bilgisi kaydedilemedi: " + (e as Error).message);
    }
  };

  const yazdirP = (p: YDProforma) => yazdir(`Proforma ${p.no}`, proformaHtml(p, ayar), PROFORMA_CSS);

  // Müşteri kartları: aynı müşteri (firma/ad) altında teklifler
  const musteriler = useMemo(() => {
    const m = new Map<string, { ad: string; ulke: string; tel?: string; adet: number; ciro: Record<Para, number>; son: string }>();
    list.filter((p) => p.durum !== "iptal").forEach((p) => {
      const key = (p.musteri.firma || p.musteri.ad).trim().toLowerCase();
      const r = m.get(key) ?? { ad: p.musteri.firma || p.musteri.ad, ulke: p.musteri.ulke, tel: p.musteri.tel, adet: 0, ciro: { USD: 0, EUR: 0 }, son: p.tarih };
      r.adet++;
      if (["kapora-geldi", "hazirlaniyor", "bakiye-bekleniyor", "sevk-edildi"].includes(p.durum)) r.ciro[p.para] += genelToplam(p);
      if (p.tarih > r.son) r.son = p.tarih;
      m.set(key, r);
    });
    return [...m.values()].sort((a, b) => b.son.localeCompare(a.son));
  }, [list]);

  const gorunen = list.filter((p) => filtre === "hepsi" || !["sevk-edildi", "iptal"].includes(p.durum));
  const bekleyenKapora = list.filter((p) => p.durum === "kapora-bekleniyor");

  if (loading) return <div className="p-10 text-sm text-stone-500">Yükleniyor…</div>;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-stone-900">Yurt Dışı Toptan</h1>
          <p className="text-[13px] text-stone-500">İngilizce proforma (USD/EUR) · kapora / bakiye · müşteri kartları</p>
        </div>
        <button onClick={yeni} className="rounded bg-black px-4 py-2 text-[13px] font-semibold text-white">+ Yeni proforma</button>
      </div>

      {hata && <p className="mb-4 rounded bg-red-50 px-3 py-2 text-[13px] text-red-700">{hata}</p>}

      {bekleyenKapora.length > 0 && (
        <p className="mb-4 rounded bg-amber-50 px-3 py-2 text-[13px] text-amber-800">
          Kapora bekleyen: {bekleyenKapora.map((p) => `${p.musteri.firma || p.musteri.ad} (${para(kaporaTutari(p), p.para)})`).join(" · ")}
        </p>
      )}

      {edit && <Duzenle p={edit} setP={setEdit} kaydet={kaydet} sil={list.some((x) => x.id === edit.id) ? () => sil(edit) : undefined} yazdir={yazdirP} />}

      {/* Proformalar */}
      <div className="mb-2 flex items-center gap-3">
        <h2 className="text-[15px] font-semibold">Proformalar</h2>
        <select value={filtre} onChange={(e) => setFiltre(e.target.value as "acik" | "hepsi")} className="rounded border px-2 py-1 text-[12.5px]">
          <option value="acik">Açık olanlar</option>
          <option value="hepsi">Hepsi (sevk/iptal dahil)</option>
        </select>
      </div>
      <div className="mb-10 overflow-x-auto rounded border border-stone-200 bg-white">
        <table className="w-full text-[13px]">
          <thead className="bg-stone-50 text-left text-[11px] uppercase tracking-wide text-stone-500">
            <tr><th className="p-2">No</th><th className="p-2">Müşteri</th><th className="p-2">Ülke</th><th className="p-2 text-right">Toplam</th><th className="p-2 text-right">Ödenen</th><th className="p-2 text-right">Kalan</th><th className="p-2">Durum</th><th className="p-2" /></tr>
          </thead>
          <tbody>
            {gorunen.length === 0 && <tr><td colSpan={8} className="p-4 text-center text-stone-400">Henüz proforma yok — “+ Yeni proforma” ile başla.</td></tr>}
            {gorunen.map((p) => (
              <tr key={p.id} className="border-t border-stone-100">
                <td className="p-2 font-mono text-[12px]">{p.no}<div className="text-stone-400">{p.tarih}</div></td>
                <td className="p-2">{p.musteri.firma || p.musteri.ad}{p.musteri.firma && <div className="text-stone-400">{p.musteri.ad}</div>}</td>
                <td className="p-2">{p.musteri.ulke}</td>
                <td className="p-2 text-right">{para(genelToplam(p), p.para)}</td>
                <td className="p-2 text-right">{para(odenen(p), p.para)}</td>
                <td className="p-2 text-right font-medium">{para(kalan(p), p.para)}</td>
                <td className="p-2">{YD_DURUM[p.durum]}</td>
                <td className="whitespace-nowrap p-2 text-right">
                  <button onClick={() => yazdirP(p)} className={btn}>PDF</button>{" "}
                  <button onClick={() => setEdit(structuredClone(p))} className={btn}>Düzenle</button>{" "}
                  <button onClick={() => tekrar(p)} className={btn} title="Aynı müşteriye yeni teklif">Tekrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Müşteri kartları */}
      <h2 className="mb-2 text-[15px] font-semibold">Müşteriler</h2>
      <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {musteriler.length === 0 && <p className="text-[13px] text-stone-400">İlk proformayı kaydedince müşteri kartı burada çıkar.</p>}
        {musteriler.map((m) => (
          <div key={m.ad} className="rounded border border-stone-200 bg-white p-3 text-[13px]">
            <div className="font-semibold">{m.ad}</div>
            <div className="text-stone-500">{m.ulke}{m.tel ? ` · ${m.tel}` : ""}</div>
            <div className="mt-1">{m.adet} teklif · son: {m.son}</div>
            <div className="text-stone-600">Onaylı ciro: {m.ciro.USD ? para(m.ciro.USD, "USD") : ""}{m.ciro.USD && m.ciro.EUR ? " + " : ""}{m.ciro.EUR ? para(m.ciro.EUR, "EUR") : ""}{!m.ciro.USD && !m.ciro.EUR ? "—" : ""}</div>
          </div>
        ))}
      </div>

      {/* Banka bilgisi */}
      <h2 className="mb-2 text-[15px] font-semibold">Proformadaki banka bilgisi</h2>
      <p className="mb-2 text-[12.5px] text-stone-500">Hesap sahibi, banka, IBAN, SWIFT/BIC — her proformanın altına basılır. Boşsa “Bank details will be sent separately” yazar.</p>
      <textarea value={ayar.banka} onChange={(e) => setAyar({ banka: e.target.value })} rows={5} className={inp} placeholder={"Account holder: Diyar Kılıç\nBank: ...\nIBAN (USD): TR..\nIBAN (EUR): TR..\nSWIFT/BIC: ..."} />
      <button onClick={bankaKaydet} className={btn + " mt-2"}>Banka bilgisini kaydet</button>
    </div>
  );
}

function Duzenle({ p, setP, kaydet, sil, yazdir }: {
  p: YDProforma; setP: (p: YDProforma | null) => void; kaydet: (p: YDProforma) => void; sil?: () => void; yazdir: (p: YDProforma) => void;
}) {
  const set = <K extends keyof YDProforma>(k: K, v: YDProforma[K]) => setP({ ...p, [k]: v });
  const setM = (k: keyof YDProforma["musteri"], v: string) => setP({ ...p, musteri: { ...p.musteri, [k]: v } });
  const setK = (i: number, k: keyof YDKalem, v: string) =>
    setP({ ...p, kalemler: p.kalemler.map((x, j) => (j === i ? { ...x, [k]: k === "adet" || k === "birim" ? (v as unknown as number) : v } : x)) });

  return (
    <div className="mb-8 rounded-lg border-2 border-stone-800 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-[16px] font-semibold">{p.no}</h2>
        <div className="flex gap-2">
          <button onClick={() => yazdir(p)} className={btn}>PDF önizle</button>
          {sil && <button onClick={sil} className={btn} style={{ color: "#dc2626" }}>Sil</button>}
          <button onClick={() => setP(null)} className={btn}>Vazgeç</button>
          <button onClick={() => kaydet(p)} className="rounded bg-black px-4 py-1.5 text-[12.5px] font-semibold text-white">Kaydet</button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <L t="Müşteri adı *"><input className={inp} value={p.musteri.ad} onChange={(e) => setM("ad", e.target.value)} /></L>
        <L t="Firma"><input className={inp} value={p.musteri.firma ?? ""} onChange={(e) => setM("firma", e.target.value)} /></L>
        <L t="Ülke *"><input className={inp} value={p.musteri.ulke} onChange={(e) => setM("ulke", e.target.value)} /></L>
        <L t="Telefon / WhatsApp"><input className={inp} value={p.musteri.tel ?? ""} onChange={(e) => setM("tel", e.target.value)} /></L>
        <L t="E-posta"><input className={inp} value={p.musteri.eposta ?? ""} onChange={(e) => setM("eposta", e.target.value)} /></L>
        <L t="Adres (proformada görünür)"><input className={inp} value={p.musteri.adres ?? ""} onChange={(e) => setM("adres", e.target.value)} /></L>
        <L t="Tarih"><input type="date" className={inp} value={p.tarih} onChange={(e) => set("tarih", e.target.value)} /></L>
        <L t="Para birimi">
          <select className={inp} value={p.para} onChange={(e) => set("para", e.target.value as Para)}><option>USD</option><option>EUR</option></select>
        </L>
        <L t="Teslim şekli"><input className={inp} value={p.teslimSekli} onChange={(e) => set("teslimSekli", e.target.value)} placeholder="EXW Istanbul / DAP Dakar" /></L>
      </div>

      <h3 className="mb-1 mt-5 text-[13px] font-semibold">Kalemler <span className="font-normal text-stone-500">(katalog kodu, örn. A-01 — fiyat: Fiyat-Listesi.xlsx)</span></h3>
      <table className="w-full text-[13px]">
        <thead className="text-left text-[11px] uppercase text-stone-500"><tr><th>Kod</th><th>Açıklama (İngilizce)</th><th>Paket</th><th className="w-20">Adet</th><th className="w-28">Birim fiyat</th><th className="w-28 text-right">Tutar</th><th /></tr></thead>
        <tbody>
          {p.kalemler.map((k, i) => (
            <tr key={i}>
              <td className="w-20 pr-1"><input className={inp} value={k.kod} onChange={(e) => setK(i, "kod", e.target.value)} /></td>
              <td className="pr-1"><input className={inp} value={k.aciklama} onChange={(e) => setK(i, "aciklama", e.target.value)} /></td>
              <td className="w-36 pr-1"><input className={inp} value={k.paket} onChange={(e) => setK(i, "paket", e.target.value)} placeholder="Pack of 10" /></td>
              <td className="pr-1"><input type="number" min={0} className={inp} value={k.adet} onChange={(e) => setK(i, "adet", e.target.value)} /></td>
              <td className="pr-1"><input type="number" min={0} step="0.01" className={inp} value={k.birim} onChange={(e) => setK(i, "birim", e.target.value)} /></td>
              <td className="text-right">{para((Number(k.adet) || 0) * (Number(k.birim) || 0), p.para)}</td>
              <td className="pl-2"><button onClick={() => set("kalemler", p.kalemler.filter((_, j) => j !== i))} className="text-stone-400 hover:text-red-600" aria-label="Kalemi sil">✕</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => set("kalemler", [...p.kalemler, bosKalem()])} className={btn + " mt-2"}>+ Kalem</button>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        <L t={`Kargo (${p.para}, yoksa 0)`}><input type="number" min={0} step="0.01" className={inp} value={p.kargo} onChange={(e) => set("kargo", e.target.value as unknown as number)} /></L>
        <L t="Kapora %"><input type="number" min={0} max={100} className={inp} value={p.kaporaYuzde} onChange={(e) => set("kaporaYuzde", e.target.value as unknown as number)} /></L>
        <L t="Durum">
          <select className={inp} value={p.durum} onChange={(e) => set("durum", e.target.value as YDDurum)}>{DURUMLAR.map((d) => <option key={d} value={d}>{YD_DURUM[d]}</option>)}</select>
        </L>
        <div className="rounded bg-stone-50 p-2 text-[12.5px] leading-6">
          Ara toplam: {para(araToplam(p), p.para)}<br />
          <b>Toplam: {para(genelToplam(p), p.para)}</b><br />
          Kapora: {para(kaporaTutari(p), p.para)} · Kalan: {para(kalan(p), p.para)}
        </div>
      </div>

      <h3 className="mb-1 mt-5 text-[13px] font-semibold">Gelen ödemeler</h3>
      {p.odemeler.map((o, i) => (
        <div key={i} className="mb-1 flex gap-2">
          <input type="date" className={inp + " max-w-40"} value={o.tarih} onChange={(e) => set("odemeler", p.odemeler.map((x, j) => (j === i ? { ...x, tarih: e.target.value } : x)))} />
          <input type="number" min={0} step="0.01" className={inp + " max-w-32"} value={o.tutar} onChange={(e) => set("odemeler", p.odemeler.map((x, j) => (j === i ? { ...x, tutar: e.target.value as unknown as number } : x)))} />
          <input className={inp} placeholder="Not (örn. kapora, SWIFT ref)" value={o.not ?? ""} onChange={(e) => set("odemeler", p.odemeler.map((x, j) => (j === i ? { ...x, not: e.target.value } : x)))} />
          <button onClick={() => set("odemeler", p.odemeler.filter((_, j) => j !== i))} className="text-stone-400 hover:text-red-600" aria-label="Ödemeyi sil">✕</button>
        </div>
      ))}
      <button onClick={() => set("odemeler", [...p.odemeler, { tarih: bugun(), tutar: kaporaTutari(p) }])} className={btn}>+ Ödeme</button>

      <L t="Not (proformada görünür, İngilizce yaz)"><textarea rows={2} className={inp + " mt-4"} value={p.not ?? ""} onChange={(e) => set("not", e.target.value)} /></L>
    </div>
  );
}

function L({ t, children }: { t: string; children: React.ReactNode }) {
  return (
    <label className="block text-[12px] text-stone-600">
      <span className="mb-1 block">{t}</span>
      {children}
    </label>
  );
}
