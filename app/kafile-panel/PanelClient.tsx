"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ODEME_GUNU, sha256Hex, type OrtakPanelKayit } from "@/lib/ortakPanel";

const SITE = "https://www.obrnhomen.com";
const tl = (n: number) => n.toLocaleString("tr-TR", { maximumFractionDigits: 0 }) + " ₺";
const tarih = (ms: number) => new Date(ms).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

/** Bir sonraki komisyon ödeme günü (her ayın ODEME_GUNU'ü) */
function sonrakiOdeme() {
  const d = new Date();
  const t = new Date(d.getFullYear(), d.getMonth() + (d.getDate() > ODEME_GUNU ? 1 : 0), ODEME_GUNU);
  return t.toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
}

export default function PanelClient() {
  const [durum, setDurum] = useState<"yukleniyor" | "yok" | "hazir">("yukleniyor");
  const [p, setP] = useState<OrtakPanelKayit | null>(null);
  const [kopya, setKopya] = useState(false);

  useEffect(() => {
    const k = new URLSearchParams(window.location.search).get("k")?.trim() ?? "";
    if (!k || !db) { void Promise.resolve().then(() => setDurum("yok")); return; }
    sha256Hex(k)
      .then((id) => getDoc(doc(db!, "ortakPanel", id)))
      .then((s) => {
        if (!s.exists()) return setDurum("yok");
        setP(s.data() as OrtakPanelKayit);
        setDurum("hazir");
      })
      .catch(() => setDurum("yok"));
  }, []);

  if (durum === "yukleniyor") {
    return <main className="mx-auto max-w-3xl px-4 py-16"><div className="h-40 animate-pulse rounded-xl bg-stone-100" /></main>;
  }
  if (durum === "yok" || !p) {
    return (
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-serif text-[26px] text-stone-900">Panel bulunamadı</h1>
        <p className="mt-2 text-[15px] text-stone-600">Linkin tamamını kopyaladığınızdan emin olun. Sorun devam ederse bize WhatsApp&apos;tan yazın: 0531 955 68 30</p>
      </main>
    );
  }

  const sip = p.siparisler ?? [];
  const ay = new Date();
  ay.setDate(1);
  ay.setHours(0, 0, 0, 0);
  const buAy = sip.filter((s) => s.tarih >= ay.getTime());
  const hakEdilen = sip.filter((s) => s.teslim).reduce((t, s) => t + s.komisyon, 0);
  const bekleyen = sip.filter((s) => !s.teslim).reduce((t, s) => t + s.komisyon, 0);
  const odenecek = Math.max(hakEdilen - (p.odenen ?? 0), 0);
  const kart = sip.reduce((t, s) => t + (s.kart || 0), 0);
  const link = `${SITE}/hediyelik-hazirla?ref=${p.kod}`;

  const kopyala = async () => {
    try { await navigator.clipboard.writeText(link); setKopya(true); setTimeout(() => setKopya(false), 1500); } catch {}
  };

  const kutu = (baslik: string, deger: string, alt?: string, vurgu?: boolean) => (
    <div className={`rounded-xl border p-4 ${vurgu ? "border-[#c9a24a] bg-[#faf6ec]" : "border-stone-200 bg-white"}`}>
      <p className="text-[12px] uppercase tracking-[0.12em] text-stone-500">{baslik}</p>
      <p className="mt-1 font-serif text-[24px] leading-tight text-stone-900">{deger}</p>
      {alt && <p className="mt-0.5 text-[12.5px] text-stone-500">{alt}</p>}
    </div>
  );

  return (
    <main className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:px-6">
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#9a7a2c]">Kafile paneli</p>
      <h1 className="mt-1 font-serif text-[28px] leading-tight text-stone-900 sm:text-[32px]">{p.ad}</h1>
      <p className="mt-1 text-[14px] text-stone-600">
        Kodunuz <strong className="font-mono">{p.kod}</strong> · umreciniz %{p.indirim} indirim alır, siz her satıştan %{p.komisyon} kazanırsınız.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {kutu("Bu ay", `${buAy.length} sipariş`)}
        {kutu("Toplam", `${sip.length} sipariş`)}
        {kutu("Ödenecek", tl(odenecek), `${sonrakiOdeme()} günü`, true)}
        {kutu("Teslim bekleyen", tl(bekleyen), "teslim olunca eklenir")}
      </div>

      <div className="mt-4 rounded-xl bg-[#14392b] p-5 text-[#f5efe0]">
        <p className="font-serif text-[20px] leading-snug text-[#e3c77a]">
          {kart > 0 ? `Kafilenizin adı ${kart} hediyeyle eve girdi` : "Kafilenizin adı her hediyeyle eve girer"}
        </p>
        <p className="mt-1 text-[14px] leading-relaxed text-[#ddd5c0]">
          Umrecilerinizin dağıttığı her hediyenin içinde kafilenizin adının yazdığı bir kart var. Komisyon ilk kazancınız;
          asıl kazanç bu kartları görüp bir sonraki umresinde sizi soracak olanlar.
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-stone-200 bg-white p-4">
        <p className="text-[14px] font-medium text-stone-900">Umrecilerinize göndereceğiniz link</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <code className="min-w-0 flex-1 break-all rounded-md bg-stone-50 px-3 py-2 text-[13px] text-stone-700">{link}</code>
          <button onClick={kopyala} className="rounded-md bg-[#1f9d55] px-4 py-2 text-[14px] font-medium text-white">{kopya ? "Kopyalandı ✓" : "Kopyala"}</button>
        </div>
        <p className="mt-2 text-[12.5px] text-stone-500">Umreciniz bu linkten girince indirimi kendiliğinden uygulanır; ödeme ekranında <b>{p.kod}</b> kodunu da yazabilir.</p>
      </div>

      <h2 className="mt-8 font-serif text-[20px] text-stone-900">Siparişler</h2>
      {sip.length === 0 ? (
        <p className="mt-2 text-[14px] text-stone-500">Henüz sipariş yok. Linki umreci grubunuza gönderdiğinizde siparişler burada görünür.</p>
      ) : (
        <div className="mt-2 overflow-x-auto rounded-xl border border-stone-200 bg-white">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50 text-left text-[11.5px] uppercase tracking-wider text-stone-500">
                <th className="px-3 py-2.5 font-medium">Tarih</th>
                <th className="px-3 py-2.5 text-right font-medium">Sipariş</th>
                <th className="px-3 py-2.5 text-right font-medium">Komisyonunuz</th>
                <th className="px-3 py-2.5 font-medium">Durum</th>
              </tr>
            </thead>
            <tbody>
              {sip.map((s, i) => (
                <tr key={i} className="border-b border-stone-50 last:border-0">
                  <td className="whitespace-nowrap px-3 py-2.5 text-stone-700">{tarih(s.tarih)}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right">{tl(s.tutar)}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right font-medium text-[#9a7a2c]">{tl(s.komisyon)}</td>
                  <td className="whitespace-nowrap px-3 py-2.5">
                    {s.teslim
                      ? <span className="rounded-full bg-green-50 px-2 py-0.5 text-[12px] text-green-700">Teslim edildi</span>
                      : <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[12px] text-amber-700">Yolda</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 space-y-1 text-[12.5px] leading-relaxed text-stone-500">
        <p>Komisyon her ayın {ODEME_GUNU}&apos;inde, teslim edilmiş siparişler için ödenir. Bugüne kadar ödenen: <b>{tl(p.odenen ?? 0)}</b>.</p>
        <p>Umrecilerinizin adı, telefonu ve adresi gizlilik gereği burada gösterilmez.</p>
        <p>Son güncelleme: {tarih(p.guncelleme)}. Sorunuz olursa WhatsApp: 0531 955 68 30</p>
      </div>
    </main>
  );
}
