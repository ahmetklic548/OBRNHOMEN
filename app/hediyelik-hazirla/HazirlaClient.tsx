"use client";

import { useEffect, useMemo, useState } from "react";
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

const tl = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₺";
const kisaAd = (s: string) => (s.length > 70 ? s.slice(0, 68) + "…" : s);

export default function HazirlaClient({ adimlar }: { adimlar: Adim[] }) {
  const router = useRouter();
  const { add } = useCart();
  const [adim, setAdim] = useState(0);
  const [secim, setSecim] = useState<Record<string, number>>({}); // slug → paket sayısı
  const [kartIsim, setKartIsim] = useState("");
  const [kafile, setKafile] = useState<string | null>(null);
  const [hazir, setHazir] = useState(false);
  const [renk, setRenk] = useState<Record<string, string>>({}); // grup → seçili renk (slug)

  useEffect(() => {
    try {
      const s = localStorage.getItem(SECIM_KEY);
      if (s) setSecim(JSON.parse(s));
      const k = localStorage.getItem(KART_KEY);
      if (k) setKartIsim(k);
    } catch {}
    // ?ref=KOD RefCapture tarafından kaydedilir; aynı sayfa yüklemesinde URL'den de okunur
    const urlRef = new URLSearchParams(window.location.search).get("ref");
    setKafile(urlRef ? urlRef.toUpperCase() : readRef());
    setHazir(true);
  }, []);

  useEffect(() => {
    if (!hazir) return;
    try { localStorage.setItem(SECIM_KEY, JSON.stringify(secim)); } catch {}
  }, [secim, hazir]);

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
    try {
      if (kartIsim.trim()) localStorage.setItem(KART_KEY, kartIsim.trim());
      localStorage.removeItem(SECIM_KEY);
    } catch {}
    router.push("/checkout");
  };

  const whatsappMetni = () => {
    const satirlar = secilenler.map(({ u, n }) => `• ${kisaAd(u.name)} (${u.code}) — ${isPack(u.packQty) ? `${n} paket = ${n * u.packQty} adet` : `${n} adet`}`);
    return [
      "Selamün aleyküm, umre dönüş hediyeliklerim için listem:",
      ...satirlar,
      `Toplam: ${toplamAdet} adet hediyelik (site fiyatı ${tl(toplamTutar)})`,
      kartIsim.trim() ? `Hediye kartında yazacak isim: ${kartIsim.trim()}` : "",
      "Ad soyad / telefon / adres: ",
    ].filter(Boolean).join("\n");
  };

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6">
      <header className="mb-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#9a7a2c]">Umre dönüş hediyeliği</p>
        <h1 className="mt-1 font-serif text-[28px] leading-tight text-stone-900 sm:text-[34px]">Dağıtacağınız hediyelikleri hazırlayın</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-stone-600">
          Her adımda istediğiniz üründen kaç tane istediğinizi seçin, istemediğiniz adımı geçin. Her hediyenin içine
          <strong> adınızın yazdığı bir hediye kartı</strong> koyuyoruz; Mekke&apos;de hediyelik aramayın, valiz taşımayın.
          <span className="mt-1 block text-[14px] text-stone-500">Ürünler karışık renklerde gönderilir.</span>
        </p>
        {kafile && (
          <p className="mt-3 inline-block rounded-full border border-[#c9a24a] bg-[#faf6ec] px-3 py-1 text-[13px] text-stone-700">
            Kafile kodunuz: <strong>{kafile}</strong> — ödemede indiriminiz otomatik uygulanır
          </p>
        )}
      </header>

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
            {a.urunler.map((g) => {
              const u = aktif(g);
              const n = secim[u.slug] ?? 0;
              return (
                <div key={g.anahtar} className={`flex gap-3 rounded-xl border bg-white p-3 ${n > 0 ? "border-[#9a7a2c] ring-1 ring-[#9a7a2c]" : "border-stone-200"}`}>
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                    {u.image && <Image src={u.image} alt={u.name} fill sizes="96px" className="object-cover" />}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="line-clamp-2 text-[13.5px] leading-snug text-stone-800">{u.name}</p>
                    <p className="mt-1 text-[14px] font-semibold text-stone-900">
                      {tl(u.price)} <span className="text-[12px] font-normal text-stone-500">{isPack(u.packQty) ? `/ ${u.packQty}'lu paket` : "/ adet"}</span>
                    </p>
                    {g.secenekler.length > 1 && (
                      <p className="mt-1 text-[12px] text-[#8a6d2a]">Renkler karışık gönderilir</p>
                    )}
                    <div className="mt-auto flex items-center gap-2 pt-2">
                      <button aria-label="Azalt" onClick={() => setN(u.slug, n - 1)} className="h-9 w-9 rounded-md border border-stone-300 text-lg">−</button>
                      <input
                        type="number" min={0} inputMode="numeric" value={n}
                        onChange={(e) => setN(u.slug, +e.target.value)}
                        className="h-9 w-14 rounded-md border border-stone-300 text-center text-[15px]"
                        aria-label={isPack(u.packQty) ? "Paket sayısı" : "Adet"}
                      />
                      <button aria-label="Artır" onClick={() => setN(u.slug, n + 1)} className="h-9 w-9 rounded-md border border-stone-300 text-lg">+</button>
                      <span className="text-[12px] text-stone-500">{isPack(u.packQty) ? `paket = ${n * u.packQty} adet` : "adet"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="sticky bottom-0 mt-6 flex items-center justify-between gap-3 border-t border-stone-200 bg-[#faf6ec]/95 py-3 backdrop-blur">
            <p className="text-[14px] text-stone-700">Şu ana kadar: <strong>{toplamAdet} adet</strong> · {tl(toplamTutar)}</p>
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
                    <span className="w-24 shrink-0 text-right font-medium">{tl(unitPriceFor(u.price, n) * n)}</span>
                  </li>
                ))}
                <li className="flex justify-between px-4 py-3 text-[15px] font-semibold">
                  <span>Toplam {toplamAdet} adet hediyelik</span><span>{tl(toplamTutar)}</span>
                </li>
              </ul>

              <label className="mt-5 block text-[15px] font-medium text-stone-800" htmlFor="kart">Hediye kartında yazacak isim</label>
              <p className="text-[13px] text-stone-500">Her hediyenin içindeki kartta “… umre hatırasıdır” olarak yazılır.</p>
              <input
                id="kart" value={kartIsim} maxLength={60} onChange={(e) => setKartIsim(e.target.value)}
                placeholder="ör. Ahmet Yılmaz ve ailesi"
                className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2.5 text-[15px]"
              />

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button onClick={sepeteEkle} className="rounded-md bg-stone-900 px-5 py-3.5 text-[15px] font-medium text-white">
                  Siparişi tamamla →
                  <span className="block text-[12px] font-normal text-stone-300">Kendim ödeyeceğim (kart / kapıda)</span>
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(whatsappMetni())}`}
                  target="_blank" rel="noopener noreferrer"
                  className="rounded-md border border-[#25d366] bg-white px-5 py-3.5 text-center text-[15px] font-medium text-stone-900"
                >
                  Listemi kafileme gönder
                  <span className="block text-[12px] font-normal text-stone-500">WhatsApp’ta kafilenizi seçin</span>
                </a>
              </div>
              <p className="mt-3 text-[12.5px] text-stone-500">Fiyatlar site fiyatıdır; 10 ve üzeri pakette adet indirimi otomatik uygulanır.</p>
            </>
          )}
        </section>
      )}
    </main>
  );
}
