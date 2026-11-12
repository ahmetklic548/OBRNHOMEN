"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart, cartMeta } from "@/app/components/CartContext";
import { unitPriceFor } from "@/lib/pricing";
import { readRef } from "@/lib/refCode";
import { isPack } from "@/lib/pack";

export interface HazirlaUrun {
  slug: string;
  name: string;
  /** Site birim fiyatı (salePrice) — paket fiyatı */
  price: number;
  image: string;
  code: string;
  color: string | null;
  size: string | null;
  /** Paketteki adet (10'lu → 10) */
  packQty: number;
}

/** Aynı ürünün renk seçenekleri — tek kartta gösterilir */
export interface Grup {
  anahtar: string;
  secenekler: HazirlaUrun[];
  /** "Diğer" adımında başlık (Yasin & Cüz, Hazır setler…) */
  bolum?: string;
}

export interface Adim {
  id: string;
  baslik: string;
  aciklama: string;
  urunler: Grup[];
}

/** Ödeme ekranı bu anahtardan hediye kartı ismini okur (app/checkout) */
export const KART_KEY = "obrnhomen-hediye-kart";
const SECIM_KEY = "obrnhomen-hazirla-secim";
const POSET_KEY = "obrnhomen-hazirla-poset";

const tl = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₺";
const kisaAd = (s: string) => (s.length > 70 ? s.slice(0, 68) + "…" : s);

export default function HazirlaClient({ adimlar, poset }: { adimlar: Adim[]; poset: HazirlaUrun }) {
  const router = useRouter();
  const { add } = useCart();
  const [adim, setAdim] = useState(0);
  const [secim, setSecim] = useState<Record<string, number>>({}); // slug → paket sayısı
  const [kartIsim, setKartIsim] = useState("");
  const [kafile, setKafile] = useState<string | null>(null);
  const [hazir, setHazir] = useState(false);
  const [renk] = useState<Record<string, string>>({}); // grup → seçili renk (slug)
  /** Hediye poşeti adedi — null: otomatik (en çok alınan üründen kaç kişiye dağıtılacaksa) */
  const [posetN, setPosetN] = useState<number | null>(null);
  /** Kafile kodunun bilgisi — toptan (Yol 1) ise umreci ödeme yapmaz, listesini kafileye gönderir */
  const [kafileBilgi, setKafileBilgi] = useState<{ ad: string; model: "kod" | "toptan"; indirim: number; whatsapp: string | null } | null>(null);
  const [umreciAd, setUmreciAd] = useState("");
  const [umreciTel, setUmreciTel] = useState("");
  /** Kafile kodu sorgusu bitti mi (fiyatlar ancak kod Yol 2 / yok ise gösterilir) */
  const [kafileKontrol, setKafileKontrol] = useState(false);
  const [gonderim, setGonderim] = useState<{ durum: "bos" | "gidiyor" | "tamam" | "hata"; mesaj?: string; listeNo?: string }>({ durum: "bos" });

  useEffect(() => {
    try {
      const s = localStorage.getItem(SECIM_KEY);
      if (s) setSecim(JSON.parse(s));
      const ps = localStorage.getItem(POSET_KEY);
      if (ps !== null && ps !== "") setPosetN(Math.max(0, parseInt(ps, 10) || 0));
      const k = localStorage.getItem(KART_KEY);
      if (k) setKartIsim(k);
    } catch {}
    // ?ref=KOD RefCapture tarafından kaydedilir; aynı sayfa yüklemesinde URL'den de okunur
    const urlRef = new URLSearchParams(window.location.search).get("ref");
    const kod = urlRef ? urlRef.toUpperCase() : readRef();
    setKafile(kod);
    if (kod)
      fetch(`/api/ortak-bilgi?kod=${encodeURIComponent(kod)}`)
        .then((r) => r.json())
        .then((d) => { if (d?.ok) setKafileBilgi({ ad: d.ad, model: d.model, indirim: d.indirim, whatsapp: d.whatsapp }); })
        .catch(() => {})
        .finally(() => setKafileKontrol(true));
    else setKafileKontrol(true);
    setHazir(true);
  }, []);
  const toptan = kafileBilgi?.model === "toptan";
  /** Yol 1 (kafile satar): umreciye fiyat gösterilmez — fiyatı kafile verir; sayfa kafilenin sayfası gibi görünür */
  const fiyatGoster = kafileKontrol && !toptan;

  // Sayfa kendi alt çubuğunu kullanır → yüzen Ara / canlı destek düğmeleri gizlenir; Yol 1'de site menüsü/altlığı da gizlenir
  useEffect(() => {
    const h = document.documentElement;
    h.setAttribute("data-hazirla", "");
    if (toptan) h.setAttribute("data-kafile-modu", "");
    return () => { h.removeAttribute("data-hazirla"); h.removeAttribute("data-kafile-modu"); };
  }, [toptan]);

  useEffect(() => {
    if (!hazir) return;
    try {
      localStorage.setItem(SECIM_KEY, JSON.stringify(secim));
      if (posetN === null) localStorage.removeItem(POSET_KEY);
      else localStorage.setItem(POSET_KEY, String(posetN));
    } catch {}
  }, [secim, posetN, hazir]);

  // Adım değişince sayfanın başına dön (adım çubuğu görünsün)
  useEffect(() => {
    if (hazir) window.scrollTo({ top: 0, behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adim]);

  const urunMap = useMemo(() => {
    const m = new Map<string, HazirlaUrun>();
    adimlar.forEach((a) => a.urunler.forEach((g) => g.secenekler.forEach((u) => m.set(u.slug, u))));
    return m;
  }, [adimlar]);

  const secilenler = Object.entries(secim)
    .filter(([slug, n]) => n > 0 && urunMap.has(slug))
    .map(([slug, n]) => ({ u: urunMap.get(slug)!, n }));
  const toplamAdet = secilenler.reduce((s, x) => s + x.n * x.u.packQty, 0);
  const toplamTutar = secilenler.reduce((s, x) => s + unitPriceFor(x.u.price, x.n) * x.n, 0);
  // Poşet: her hediye alan kişiye bir poşet + bir kart. Adet tahmin edilmez, umreciye "kaç kişiye dağıtacaksınız?" diye sorulur
  // (aynı kişiye tesbih + seccade birlikte verilebilir; ürün adedinden kişi sayısı çıkmaz). null = henüz cevaplanmadı.
  const posetAdet = posetN ?? 0;
  const posetSorulmadi = posetN === null && secilenler.length > 0;
  const posetTutar = posetAdet > 0 ? unitPriceFor(poset.price, posetAdet, poset.slug) * posetAdet : 0;
  const genelToplam = toplamTutar + posetTutar;

  const setN = (slug: string, n: number) =>
    setSecim((p) => ({ ...p, [slug]: Math.max(0, Math.min(1000, Math.floor(n) || 0)) }));

  /** Kartta gösterilen renk: seçilen, yoksa adet girilmiş olan, yoksa ilk */
  const aktif = (g: Grup) =>
    g.secenekler.find((u) => u.slug === renk[g.anahtar]) ?? g.secenekler.find((u) => (secim[u.slug] ?? 0) > 0) ?? g.secenekler[0];
  const grupSecili = (g: Grup) => g.secenekler.some((u) => (secim[u.slug] ?? 0) > 0);


  const ozet = adim >= adimlar.length;
  const a = adimlar[adim];

  const sepeteEkle = () => {
    secilenler.forEach(({ u, n }) =>
      add({ slug: u.slug, name: u.name, price: u.price, image: u.image, ...cartMeta({ id: u.code, color: u.color, size: u.size, quantity: u.packQty }) }, n),
    );
    if (posetAdet > 0)
      add({ slug: poset.slug, name: poset.name, price: poset.price, image: poset.image, ...cartMeta({ id: poset.code, color: null, size: null, quantity: 1 }) }, posetAdet);
    try {
      if (kartIsim.trim()) localStorage.setItem(KART_KEY, kartIsim.trim());
      localStorage.removeItem(SECIM_KEY);
      localStorage.removeItem(POSET_KEY);
    } catch {}
    router.push("/checkout");
  };

  const listeyiGonder = async () => {
    if (posetSorulmadi) {
      setGonderim({ durum: "hata", mesaj: "Lütfen kaç kişiye hediye dağıtacağınızı yazın." });
      return;
    }
    if (!umreciAd.trim() || umreciTel.replace(/\D/g, "").length < 10) {
      setGonderim({ durum: "hata", mesaj: "Lütfen adınızı ve telefon numaranızı yazın." });
      return;
    }
    setGonderim({ durum: "gidiyor" });
    try {
      const items = secilenler.map(({ u, n }) => ({ slug: u.slug, qty: n }));
      if (posetAdet > 0) items.push({ slug: poset.slug, qty: posetAdet });
      const r = await fetch("/api/kafile-liste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kafile, name: umreciAd, phone: umreciTel, kartIsim, items }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "Gönderilemedi");
      setGonderim({ durum: "tamam", listeNo: d.listeNo });
      try { localStorage.removeItem(SECIM_KEY); localStorage.removeItem(POSET_KEY); } catch {}
    } catch (e) {
      setGonderim({ durum: "hata", mesaj: (e as Error).message });
    }
  };

  const whatsappMetni = () => {
    const satirlar = secilenler.map(({ u, n }) => `• ${kisaAd(u.name)} (${u.code}) — ${isPack(u.packQty) ? `${n} paket = ${n * u.packQty} adet` : `${n} adet`}`);
    return [
      "Selamün aleyküm, umre dönüş hediyeliklerim için listem:",
      ...satirlar,
      posetAdet > 0 ? `• Hediye poşeti (kart dahil) — ${posetAdet} adet` : "• Hediye poşeti istemiyorum",
      `Toplam: ${toplamAdet} adet hediyelik${posetAdet > 0 ? ` + ${posetAdet} poşet` : ""}${fiyatGoster ? ` (site fiyatı ${tl(genelToplam)})` : ""}`,
      kartIsim.trim() ? `Hediye kartında yazacak isim: ${kartIsim.trim()}` : "",
      toptan ? `Ad soyad: ${umreciAd.trim()} / Telefon: ${umreciTel.trim()}${gonderim.listeNo ? ` / Liste no: ${gonderim.listeNo}` : ""}` : "Ad soyad / telefon / adres: ",
    ].filter(Boolean).join("\n");
  };

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6">
      <header className="mb-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#9a7a2c]">{toptan ? `${kafileBilgi?.ad} · Umre dönüş hediyeliği` : "Umre dönüş hediyeliği"}</p>
        <h1 className="mt-1 font-serif text-[28px] leading-tight text-stone-900 sm:text-[34px]">Dağıtacağınız hediyelikleri hazırlayın</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-stone-600">
          Her adımda istediğiniz üründen kaç tane istediğinizi seçin, istemediğiniz adımı geçin. Hediyelikleriniz
          <strong> kraft hediye poşetleri ve adınızın yazdığı kartlarla</strong>{" "}birlikte gelir; hediyeleri kendi zevkinize göre hazırlarsınız.
          Mekke&apos;de hediyelik aramayın, valiz taşımayın.
          <span className="mt-1 block text-[14px] text-stone-500">Ürünler karışık renklerde gönderilir.</span>
        </p>
        {kafile && toptan && (
          <p className="mt-3 inline-block rounded-2xl border border-[#c9a24a] bg-[#faf6ec] px-3 py-1.5 text-[13px] text-stone-700">
            <strong>{kafileBilgi?.ad}</strong> umrecilerine özel hediyelik listesi. Seçiminizi yapın, son adımda listenizi kafilenize gönderin; fiyat ve ödemeyi kafileniz bildirir.
          </p>
        )}
        {kafile && !toptan && (
          <p className="mt-3 inline-block rounded-full border border-[#c9a24a] bg-[#faf6ec] px-3 py-1 text-[13px] text-stone-700">
            {kafileBilgi ? <><strong>{kafileBilgi.ad}</strong> umrecilerine özel — </> : <>Kafile kodunuz: <strong>{kafile}</strong> — </>}
            ödemede {kafileBilgi?.indirim ? `%${kafileBilgi.indirim} ` : ""}indiriminiz otomatik uygulanır
          </p>
        )}
      </header>

      {/* Kaç kişiye dağıtılacak → poşet + kart adedi (özette de değiştirilebilir) */}
      <div className={`mb-6 rounded-xl border p-4 ${posetN === null ? "border-[#c9a24a] bg-[#fff7e0]" : "border-stone-200 bg-white"}`}>
        <label htmlFor="kisi-ust" className="block text-[15.5px] font-medium text-stone-900">Kaç kişiye hediye dağıtacaksınız?</label>
        <p className="text-[13px] text-stone-500">Her kişiye bir kraft hediye poşeti ve adınızın yazdığı bir kart hazırlanır.</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            id="kisi-ust" type="number" min={0} inputMode="numeric" placeholder="ör. 30"
            value={posetN ?? ""} onFocus={(e) => e.currentTarget.select()}
            onChange={(e) => setPosetN(e.target.value === "" ? null : Math.max(0, Math.min(5000, Math.floor(+e.target.value) || 0)))}
            className="h-10 w-24 rounded-md border border-stone-300 bg-white text-center text-[15px]"
          />
          <span className="text-[13.5px] text-stone-600">kişi{posetAdet > 0 ? ` → ${posetAdet} poşet + ${posetAdet} kart` : posetN === 0 ? " · poşet ve kart istemiyorum" : ""}</span>
        </div>
      </div>

      {/* Adım çubuğu */}
      <nav className="mb-6 flex gap-2 overflow-x-auto pb-2" aria-label="Adımlar">
        {[...adimlar.map((x) => x.baslik), "Özet"].map((b, i) => {
          const say = i < adimlar.length ? adimlar[i].urunler.filter(grupSecili).length : 0;
          return (
            <button
              key={b}
              onClick={() => setAdim(i)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[13.5px] ${i === adim ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 bg-white text-stone-700"}`}
            >
              {i + 1}. {b}{say > 0 ? ` ✓${say}` : ""}
            </button>
          );
        })}
      </nav>

      {!ozet && a && (
        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="font-serif text-[24px] text-stone-900">{adim + 1}. {a.baslik}</h2>
              <p className="text-[14.5px] text-stone-600">{a.aciklama} İstemiyorsanız <strong>“Bu adımı geç”</strong>e basın.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {a.urunler.map((g, gi) => {
              const u = aktif(g);
              const n = secim[u.slug] ?? 0;
              const baslik = g.bolum && g.bolum !== a.urunler[gi - 1]?.bolum ? g.bolum : null;
              return (
                <Fragment key={g.anahtar}>
                {baslik && <h3 className="col-span-full mt-4 border-b border-stone-200 pb-1 font-serif text-[19px] text-stone-900">{baslik}</h3>}
                <div className={`flex gap-3 rounded-xl border bg-white p-3 ${n > 0 ? "border-[#9a7a2c] ring-1 ring-[#9a7a2c]" : "border-stone-200"}`}>
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                    {u.image && <Image src={u.image} alt={u.name} fill sizes="96px" className="object-cover" />}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="line-clamp-2 text-[13.5px] leading-snug text-stone-800">{u.name}</p>
                    {fiyatGoster ? (
                      <p className="mt-1 text-[14px] font-semibold text-stone-900">
                        {tl(u.price)} <span className="text-[12px] font-normal text-stone-500">{isPack(u.packQty) ? `/ ${u.packQty}'lu paket` : "/ adet"}</span>
                      </p>
                    ) : isPack(u.packQty) ? (
                      <p className="mt-1 text-[12.5px] text-stone-500">{u.packQty}&apos;lu paket</p>
                    ) : null}
                    {g.secenekler.length > 1 && (
                      <p className="mt-1 text-[12px] text-[#8a6d2a]">Renkler karışık gönderilir</p>
                    )}
                    <div className="mt-auto flex items-center gap-2 pt-2">
                      <button aria-label="Azalt" onClick={() => setN(u.slug, n - 1)} className="h-9 w-9 rounded-md border border-stone-300 text-lg">−</button>
                      <input
                        type="number" min={0} inputMode="numeric" value={n || ""} placeholder="0"
                        onFocus={(e) => e.currentTarget.select()}
                        onChange={(e) => setN(u.slug, +e.target.value)}
                        className="h-9 w-14 rounded-md border border-stone-300 text-center text-[15px]"
                        aria-label={isPack(u.packQty) ? "Paket sayısı" : "Adet"}
                      />
                      <button aria-label="Artır" onClick={() => setN(u.slug, n + 1)} className="h-9 w-9 rounded-md border border-stone-300 text-lg">+</button>
                      <span className="text-[12px] text-stone-500">{isPack(u.packQty) ? `paket = ${n * u.packQty} adet` : "adet"}</span>
                    </div>
                  </div>
                </div>
                </Fragment>
              );
            })}
          </div>

          <div className="sticky bottom-0 mt-6 flex items-center justify-between gap-3 border-t border-stone-200 bg-[#faf6ec]/95 py-3 backdrop-blur">
            <p className="text-[14px] text-stone-700">Şu ana kadar: <strong>{toplamAdet} adet</strong>{fiyatGoster ? ` · ${tl(toplamTutar)}` : ""}</p>
            <div className="flex gap-2">
              {adim > 0 && <button onClick={() => setAdim(adim - 1)} className="rounded-md border border-stone-300 bg-white px-4 py-2.5 text-[14.5px]">Geri</button>}
              <button onClick={() => setAdim(adim + 1)} className="rounded-md bg-stone-900 px-5 py-2.5 text-[14.5px] font-medium text-white">
                {a.urunler.some(grupSecili) ? "Devam et →" : "Bu adımı geç →"}
              </button>
            </div>
          </div>
        </section>
      )}

      {ozet && (
        <section className="max-w-2xl">
          <h2 className="font-serif text-[24px] text-stone-900">Özet</h2>
          {secilenler.length === 0 ? (
            <p className="mt-3 text-[15px] text-stone-600">Henüz ürün seçmediniz. <button className="underline" onClick={() => setAdim(0)}>Seçime dönün</button>.</p>
          ) : (
            <>
              <ul className="mt-3 divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
                {secilenler.map(({ u, n }) => (
                  <li key={u.slug} className="flex items-center justify-between gap-3 px-4 py-3 text-[14px]">
                    <span className="min-w-0 flex-1 truncate text-stone-800">{u.name}</span>
                    <span className="shrink-0 text-stone-600">{isPack(u.packQty) ? `${n} paket (${n * u.packQty} adet)` : `${n} adet`}</span>
                    {fiyatGoster && <span className="w-24 shrink-0 text-right font-medium">{tl(unitPriceFor(u.price, n) * n)}</span>}
                  </li>
                ))}
                <li className={`px-4 py-3 text-[14px] ${posetSorulmadi ? "bg-[#fff7e0] ring-2 ring-inset ring-[#c9a24a]" : "bg-[#faf6ec]"}`}>
                  {posetN === 0 ? (
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-stone-600">Hediye poşeti ve kart istemiyorum</span>
                      <button onClick={() => setPosetN(null)} className="text-[12.5px] text-[#8a6d2a] underline">Poşet ve kart ekle</button>
                    </div>
                  ) : (
                    <>
                      <label htmlFor="kisi" className="block text-[15px] font-medium text-stone-900">Kaç kişiye hediye dağıtacaksınız?</label>
                      <span className="block text-[12.5px] text-stone-500">
                        Her kişiye bir <strong>kraft hediye poşeti</strong> ve adınızın yazdığı bir <strong>kart</strong> hazırlanır{fiyatGoster ? ` · ${tl(poset.price)} / kişi` : ""}
                      </span>
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          id="kisi" type="number" min={0} inputMode="numeric" placeholder="ör. 30"
                          value={posetN ?? ""} onFocus={(e) => e.currentTarget.select()}
                          onChange={(e) => setPosetN(e.target.value === "" ? null : Math.max(0, Math.min(5000, Math.floor(+e.target.value) || 0)))}
                          className="h-10 w-24 rounded-md border border-stone-300 bg-white text-center text-[15px]"
                          aria-label="Kaç kişiye dağıtacaksınız"
                        />
                        <span className="text-[13px] text-stone-600">kişi{posetAdet > 0 ? ` → ${posetAdet} poşet + ${posetAdet} kart` : ""}</span>
                        {fiyatGoster && <span className="ml-auto w-24 shrink-0 text-right font-medium">{tl(posetTutar)}</span>}
                      </div>
                      <button onClick={() => setPosetN(0)} className="mt-2 text-[12.5px] text-stone-500 underline">Poşet ve kart istemiyorum</button>
                    </>
                  )}
                </li>
                <li className="flex justify-between px-4 py-3 text-[15px] font-semibold">
                  <span>Toplam {toplamAdet} adet hediyelik{posetAdet > 0 ? ` + ${posetAdet} poşet` : ""}</span>{fiyatGoster && <span>{tl(genelToplam)}</span>}
                </li>
              </ul>

              <label className="mt-5 block text-[15px] font-medium text-stone-800" htmlFor="kart">Hediye kartında yazacak isim</label>
              <p className="text-[13px] text-stone-500">Her poşet için bir kart basılır; kartta “— isminiz” olarak yazılır.</p>
              <input
                id="kart" value={kartIsim} maxLength={60} onChange={(e) => setKartIsim(e.target.value)}
                placeholder="ör. Ahmet Yılmaz ve ailesi"
                className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2.5 text-[15px]"
              />

              {posetSorulmadi && (
                <p className="mt-4 rounded-md bg-[#fff7e0] px-3 py-2 text-[13.5px] text-[#7a5a14]">Devam etmeden önce yukarıda <strong>kaç kişiye hediye dağıtacağınızı</strong> yazın (ya da &ldquo;Poşet ve kart istemiyorum&rdquo; deyin).</p>
              )}
              {toptan ? (
                <div className="mt-6 rounded-xl border border-[#c9a24a] bg-white p-4">
                  {gonderim.durum === "tamam" ? (
                    <>
                      <p className="text-[15px] font-medium text-stone-900">Son adım: listenizi {kafileBilgi?.ad} kafilesine gönderin</p>
                      <p className="mt-1 text-[13.5px] text-stone-600">Listeniz hazır (liste no: <strong>{gonderim.listeNo}</strong>). Aşağıdaki düğmeye basın, WhatsApp açılınca <strong>Gönder</strong>&apos;e dokunun. Fiyat, ödeme ve teslimat için kafileniz size dönecek.</p>
                      <a
                        href={`https://wa.me/${kafileBilgi?.whatsapp ?? ""}?text=${encodeURIComponent(whatsappMetni())}`}
                        target="_blank" rel="noopener noreferrer"
                        className="mt-3 block w-full rounded-md bg-[#1f9d55] px-5 py-3.5 text-center text-[15px] font-medium text-white"
                      >WhatsApp&apos;tan kafileme gönder →</a>
                    </>
                  ) : (
                    <>
                      <p className="text-[15px] font-medium text-stone-900">Listenizi tamamlayın</p>
                      <p className="text-[13px] text-stone-500">Sitede ödeme yapmazsınız; ödemeyi {kafileBilgi?.ad} kafilesine yaparsınız.</p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <input value={umreciAd} onChange={(e) => setUmreciAd(e.target.value)} maxLength={120} placeholder="Adınız soyadınız" className="rounded-md border border-stone-300 px-3 py-2.5 text-[15px]" />
                        <input value={umreciTel} onChange={(e) => setUmreciTel(e.target.value)} maxLength={40} inputMode="tel" placeholder="Telefon (05xx…)" className="rounded-md border border-stone-300 px-3 py-2.5 text-[15px]" />
                      </div>
                      {gonderim.durum === "hata" && <p className="mt-2 text-[13px] text-red-600">{gonderim.mesaj}</p>}
                      <button onClick={listeyiGonder} disabled={gonderim.durum === "gidiyor" || posetSorulmadi} className="mt-3 w-full rounded-md bg-stone-900 px-5 py-3.5 text-[15px] font-medium text-white disabled:opacity-60">
                        {gonderim.durum === "gidiyor" ? "Hazırlanıyor…" : "Listemi tamamla →"}
                      </button>
                    </>
                  )}
                </div>
              ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button onClick={sepeteEkle} disabled={posetSorulmadi} className="rounded-md bg-stone-900 px-5 py-3.5 text-[15px] font-medium text-white disabled:opacity-50">
                    Siparişi tamamla →
                    <span className="block text-[12px] font-normal text-stone-300">Kendim ödeyeceğim (kart / kapıda)</span>
                  </button>
                  <a
                    aria-disabled={posetSorulmadi}
                    onClick={(e) => { if (posetSorulmadi) e.preventDefault(); }}
                    href={`https://wa.me/?text=${encodeURIComponent(whatsappMetni())}`}
                    target="_blank" rel="noopener noreferrer"
                    className="rounded-md border border-[#25d366] bg-white px-5 py-3.5 text-center text-[15px] font-medium text-stone-900"
                  >
                    Listemi kafileme gönder
                    <span className="block text-[12px] font-normal text-stone-500">WhatsApp’ta kafilenizi seçin</span>
                  </a>
                </div>
              )}
              {fiyatGoster ? (
                <p className="mt-3 text-[12.5px] text-stone-500">Fiyatlar site fiyatıdır; 10 ve üzeri pakette adet indirimi otomatik uygulanır.</p>
              ) : toptan ? (
                <p className="mt-3 text-[12.5px] text-stone-500">Fiyat ve ödeme bilgisini kafileniz size iletecek.</p>
              ) : null}
            </>
          )}
        </section>
      )}
    </main>
  );
}
