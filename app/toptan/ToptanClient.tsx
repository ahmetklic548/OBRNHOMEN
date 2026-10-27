"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWholesaleList, type WholesaleItem } from "@/app/components/WholesaleListContext";
import { cartMeta } from "@/app/components/CartContext";
import { WHOLESALE_MIN_TOTAL } from "@/lib/pricing";
import { WHATSAPP_URL } from "@/lib/storeNav";
import { prepare, searchProducts } from "@/lib/search";

export interface ToptanProduct {
  slug: string;
  name: string;
  category: string;
  /** Site birim fiyatı (salePrice) */
  price: number;
  image: string;
  code: string;
  color: string | null;
  size: string | null;
  subcategory?: string;
}

const SITE_URL = "https://www.obrnhomen.com";
/** Bundan uzun listelerde WhatsApp mesajı çok uzamasın diye ürün linkleri atlanır (kod yeter) */
const LINKS_UP_TO = 15;

const CUSTOMER_TYPES = [
  "Hac / Umre kafilesi (tur firması)",
  "Mevlüt / Düğün / Sünnet",
  "Cami / Dernek / Vakıf / Kuran kursu",
  "Mağaza / Bayi (tekrar satış)",
  "Kurumsal hediye",
  "Diğer",
];

const tl = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const toItem = (p: ToptanProduct): Omit<WholesaleItem, "qty"> => ({
  slug: p.slug, name: p.name, price: p.price, image: p.image, ...cartMeta({ id: p.code, color: p.color, size: p.size }),
});

const FORM_KEY = "obrnhomen-toptan-form";
type Form = { name: string; city: string; type: string; org: string; date: string; note: string };
const EMPTY_FORM: Form = { name: "", city: "", type: "", org: "", date: "", note: "" };

export default function ToptanClient({ products, categories }: { products: ToptanProduct[]; categories: string[] }) {
  const list = useWholesaleList();
  const [cat, setCat] = useState<string>("Tümü");
  const [q, setQ] = useState("");
  const [form, setForm] = useState<Form>(EMPTY_FORM);
  const [formLoaded, setFormLoaded] = useState(false);
  const [tried, setTried] = useState(false);

  // Form bilgileri tekrar yazılmasın diye tarayıcıda saklanır
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FORM_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage yalnızca istemcide okunabilir
      if (saved) setForm({ ...EMPTY_FORM, ...JSON.parse(saved) });
    } catch {}
    setFormLoaded(true);
  }, []);
  useEffect(() => {
    if (!formLoaded) return;
    try { localStorage.setItem(FORM_KEY, JSON.stringify(form)); } catch {}
  }, [form, formLoaded]);

  // Site geneliyle aynı arama motoru (Türkçe karakter, eş anlamlı, yazım hatası toleransı)
  const prepared = useMemo(() => prepare(products.map(p => ({ ...p, id: p.code }))), [products]);
  const visible = useMemo(() => {
    const base = q.trim() ? searchProducts(prepared, q) : products;
    return cat === "Tümü" ? base : base.filter(p => p.category === cat);
  }, [prepared, products, cat, q]);

  const remaining = Math.max(0, WHOLESALE_MIN_TOTAL - list.total);
  const progress = Math.min(100, (list.total / WHOLESALE_MIN_TOTAL) * 100);
  const missing = [
    !form.name.trim() && "Ad Soyad",
    !form.city.trim() && "Şehir",
    !form.type && "Müşteri tipi",
  ].filter(Boolean) as string[];
  const canSend = list.items.length > 0 && remaining === 0 && missing.length === 0;

  const message = useMemo(() => {
    const withLinks = list.items.length <= LINKS_UP_TO;
    const lines = list.items.map((i, n) =>
      `${n + 1}) ${i.name}` +
      (i.variant ? `\n   Renk/Ebat: ${i.variant}` : "") +
      (i.code ? `\n   Ürün kodu: ${i.code}` : "") +
      `\n   Adet: ${i.qty}` +
      (withLinks ? `\n   ${SITE_URL}/products/${i.slug}` : "")
    );
    return [
      "Merhaba! OBRNHOMEN toptan sipariş talebi:",
      "",
      `Ad Soyad: ${form.name.trim()}`,
      `Şehir: ${form.city.trim()}`,
      `Müşteri tipi: ${form.type}`,
      form.org.trim() ? `Firma/Kurum: ${form.org.trim()}` : null,
      form.date ? `İhtiyaç tarihi: ${new Date(form.date).toLocaleDateString("tr-TR")}` : null,
      form.note.trim() ? `Not: ${form.note.trim()}` : null,
      "",
      "Ürünler:",
      lines.join("\n\n"),
      "",
      `Toplam: ${list.items.length} çeşit, ${list.count} adet`,
      `Liste tutarı (site fiyatıyla): ${tl(list.total)} ₺`,
      "Bu liste için toptan fiyat alabilir miyim?",
    ].filter(l => l !== null).join("\n");
  }, [list.items, list.count, list.total, form]);

  const send = () => {
    setTried(true);
    if (!canSend) return;
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const field = "w-full border bg-white px-3 py-2.5 text-sm outline-none focus:border-black transition-colors";

  return (
    <div className="min-h-screen pb-28 lg:pb-16" style={{ background: "#fafaf8" }}>
      {/* ── Giriş ─────────────────────────────────────────── */}
      <section className="bg-[#1a1208] text-white">
        <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-6 md:py-14">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#e9d48f]">OBRNHOMEN · Toptan</p>
          <h1 className="mt-3 text-3xl leading-tight md:text-5xl" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Toptan Sipariş
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
            Hac/umre kafileleri, mevlüt ve düğünler, cami ve dernekler, hediyelik mağazaları için.
            Farklı ürünleri istediğiniz adette karıştırabilirsiniz; fiyatınızı listenize göre özel olarak hazırlıyoruz.
          </p>

          <ol className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["Ürünleri tek tek seçin", "Aşağıdan ihtiyacınız olan ürünleri bulun."],
              ["Adetleri yazın", "Her ürünün yanına kaç adet istediğinizi girin."],
              ["WhatsApp'tan fiyat alın", "Bilgilerinizi doldurun, listeniz tek tıkla bize gelsin."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-3 border border-white/10 bg-white/[0.03] p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#e9d48f] text-sm font-semibold text-black">{i + 1}</span>
                <span>
                  <span className="block text-sm font-medium">{t}</span>
                  <span className="mt-0.5 block text-xs text-white/60">{d}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/70">
            <span>✓ Minimum liste tutarı <strong className="text-[#e9d48f]">{tl(WHOLESALE_MIN_TOTAL)} ₺</strong> (site fiyatlarıyla)</span>
            <span>✓ Farklı ürünler bir arada</span>
            <span>✓ Toplu paketleme imkânı</span>
            <span>✓ Ödeme ve kargo WhatsApp&apos;ta netleşir</span>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-8 md:px-6 lg:grid-cols-[1fr_400px]">
        {/* ── Ürün seçimi ─────────────────────────────────── */}
        <section aria-label="Ürün seçimi" className="min-w-0">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#0a0a0a" }}>
              1 · Ürünleri seçin <span className="text-sm text-stone-400">({visible.length})</span>
            </h2>
            <input
              type="search"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Ürün, renk veya ürün kodu ara"
              className={`${field} md:w-72`}
              style={{ borderColor: "#e0e0e0" }}
            />
          </div>

          <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
            {["Tümü", ...categories].map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className="shrink-0 border px-3.5 py-1.5 text-xs transition-colors"
                style={cat === c
                  ? { background: "#0a0a0a", color: "#fff", borderColor: "#0a0a0a" }
                  : { background: "#fff", color: "#555", borderColor: "#e0e0e0" }}
              >
                {c}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <p className="py-16 text-center text-sm text-stone-400">Aramanıza uygun ürün bulunamadı.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {visible.map(p => {
                const qty = list.qtyOf(p.slug);
                const variant = cartMeta({ id: p.code, color: p.color, size: p.size }).variant;
                return (
                  <li
                    key={p.slug}
                    className="flex min-w-0 flex-col border bg-white transition-shadow"
                    style={{ borderColor: qty ? "#c9a84c" : "#efefef", boxShadow: qty ? "0 0 0 1px #c9a84c" : undefined }}
                  >
                    <Link href={`/products/${p.slug}`} target="_blank" className="relative block aspect-square bg-[#efece6]">
                      {p.image && <Image src={p.image} alt={p.name} fill sizes="(max-width: 640px) 50vw, 20vw" className="object-cover" />}
                      {qty > 0 && (
                        <span className="absolute left-2 top-2 bg-[#1f9d55] px-2 py-0.5 text-[11px] font-semibold text-white">
                          Listede: {qty}
                        </span>
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col p-3">
                      <p className="line-clamp-2 text-[12px] leading-snug text-stone-900">{p.name}</p>
                      <p className="mt-1 text-[10px] text-stone-400">
                        {[variant, `Kod: ${p.code}`].filter(Boolean).join(" · ")}
                      </p>
                      <p className="mt-1.5 text-[12px] text-stone-600">{tl(p.price)} ₺ <span className="text-[10px] text-stone-400">/ adet</span></p>

                      <div className="mt-auto pt-3">
                        <div className="flex items-center border" style={{ borderColor: "#e0e0e0" }}>
                          <button type="button" onClick={() => list.setQty(toItem(p), qty - 1)} disabled={!qty} className="h-9 w-9 text-stone-500 hover:text-black disabled:opacity-30" aria-label={`${p.name} azalt`}>−</button>
                          <input
                            type="number"
                            min={0}
                            inputMode="numeric"
                            value={qty || ""}
                            placeholder="0"
                            onChange={e => list.setQty(toItem(p), Number(e.target.value))}
                            className="h-9 w-full min-w-0 border-x text-center text-sm outline-none"
                            style={{ borderColor: "#e0e0e0" }}
                            aria-label={`${p.name} adet`}
                          />
                          <button type="button" onClick={() => list.setQty(toItem(p), qty + 1)} className="h-9 w-9 text-stone-500 hover:text-black" aria-label={`${p.name} artır`}>+</button>
                        </div>
                        <div className="mt-1.5 grid grid-cols-3 gap-1">
                          {[10, 25, 50].map(n => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => list.add(toItem(p), n)}
                              className="border py-1 text-[10px] text-stone-600 transition-colors hover:border-black hover:text-black"
                              style={{ borderColor: "#e5e5e5" }}
                            >
                              +{n}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* ── Toptan Listem + form ────────────────────────── */}
        <aside id="toptan-listem" className="min-w-0 lg:sticky lg:top-[124px] lg:self-start">
          {/* Küçük ekranlarda panel ekrandan uzun olursa buton kaybolmasın: panel kendi içinde kayar */}
          <div className="border bg-white lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto" style={{ borderColor: "#e9d9a6" }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ background: "#fffbf0" }}>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "#9a7a2c" }}>2 · Toptan Listem</p>
                <p className="mt-0.5 text-sm text-stone-800">{list.items.length} çeşit · {list.count} adet</p>
              </div>
              {list.items.length > 0 && (
                <button type="button" onClick={list.clear} className="text-[10px] uppercase tracking-widest text-stone-400 hover:text-red-500">
                  Temizle
                </button>
              )}
            </div>

            {list.items.length === 0 ? (
              <p className="px-5 py-8 text-center text-xs leading-relaxed text-stone-400">
                Listeniz boş. Soldaki ürünlerden adet girerek ekleyin.
              </p>
            ) : (
              <ul className="max-h-[38vh] divide-y overflow-y-auto px-5 lg:max-h-none lg:overflow-visible" style={{ borderColor: "#f3f3f3" }}>
                {list.items.map(i => (
                  <li key={i.slug} className="flex gap-3 py-3">
                    <div className="relative h-12 w-12 shrink-0 bg-stone-100">
                      {i.image && <Image src={i.image} alt="" fill sizes="48px" className="object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-xs text-stone-800">{i.name}</p>
                      <p className="text-[10px] text-stone-400">{[i.variant, i.code && `Kod: ${i.code}`].filter(Boolean).join(" · ")}</p>
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <input
                          type="number"
                          min={0}
                          value={i.qty}
                          onChange={e => list.setQty(i, Number(e.target.value))}
                          className="h-7 w-20 border px-2 text-xs outline-none"
                          style={{ borderColor: "#e0e0e0" }}
                          aria-label={`${i.name} adet`}
                        />
                        <span className="text-xs text-stone-600">{tl(i.price * i.qty)} ₺</span>
                      </div>
                    </div>
                    <button type="button" onClick={() => list.remove(i.slug)} className="self-start text-sm text-stone-300 hover:text-red-400" aria-label={`${i.name} çıkar`}>✕</button>
                  </li>
                ))}
              </ul>
            )}

            {/* Tutar + minimum */}
            <div className="border-t px-5 py-4" style={{ borderColor: "#efefef" }}>
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] uppercase tracking-[0.25em] text-stone-500">Liste tutarı</span>
                <span className="text-xl" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#0a0a0a" }}>{tl(list.total)} ₺</span>
              </div>
              <p className="mt-0.5 text-[10px] text-stone-400">Site fiyatlarıyla — toptan fiyatınız bu tutarın altında olur.</p>
              <div className="mt-3 h-1.5 w-full bg-stone-100">
                <div className="h-full transition-all" style={{ width: `${progress}%`, background: remaining ? "#c9a84c" : "#1f9d55" }} />
              </div>
              <p className="mt-1.5 text-[11px]" style={{ color: remaining ? "#9a7a2c" : "#1f9d55" }}>
                {remaining
                  ? `Toptan fiyat için ${tl(remaining)} ₺ daha ekleyin (min. ${tl(WHOLESALE_MIN_TOTAL)} ₺)`
                  : "✓ Minimum tutar tamam — toptan fiyat alabilirsiniz"}
              </p>
            </div>

            {/* Bilgiler */}
            <div className="space-y-3 border-t px-5 py-4" style={{ borderColor: "#efefef" }}>
              <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "#9a7a2c" }}>3 · Bilgileriniz</p>
              <input className={field} style={{ borderColor: tried && !form.name.trim() ? "#dc2626" : "#e0e0e0" }} placeholder="Ad Soyad *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <input className={field} style={{ borderColor: tried && !form.city.trim() ? "#dc2626" : "#e0e0e0" }} placeholder="Şehir *" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
              <select className={field} style={{ borderColor: tried && !form.type ? "#dc2626" : "#e0e0e0", color: form.type ? "#0a0a0a" : "#999" }} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="">Müşteri tipi *</option>
                {CUSTOMER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input className={field} style={{ borderColor: "#e0e0e0" }} placeholder="Firma / Kurum adı (isteğe bağlı)" value={form.org} onChange={e => setForm(f => ({ ...f, org: e.target.value }))} />
              <label className="block">
                <span className="mb-1 block text-[10px] text-stone-400">Ne zamana lazım? (isteğe bağlı)</span>
                <input type="date" className={field} style={{ borderColor: "#e0e0e0" }} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </label>
              <textarea rows={2} className={`${field} resize-none`} style={{ borderColor: "#e0e0e0" }} placeholder="Not: paketleme, isim baskısı, teslimat vb. (isteğe bağlı)" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />

              <button
                type="button"
                onClick={send}
                className="w-full py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-opacity"
                style={{ background: canSend ? "#1f9d55" : "#9ca3af", cursor: canSend ? "pointer" : "not-allowed" }}
                aria-disabled={!canSend}
              >
                WhatsApp&apos;tan Toptan Fiyat Al
              </button>
              {tried && !canSend && (
                <p className="text-[11px] text-red-600">
                  {list.items.length === 0
                    ? "Önce listenize ürün ekleyin."
                    : remaining
                      ? `Liste tutarı en az ${tl(WHOLESALE_MIN_TOTAL)} ₺ olmalı.`
                      : `Lütfen doldurun: ${missing.join(", ")}.`}
                </p>
              )}
              <p className="text-[10px] leading-relaxed text-stone-400">
                Butona basınca listeniz WhatsApp&apos;ta hazır mesaj olarak açılır; göndermeniz yeterli.
                Az adetli alımlar için <Link href="/koleksiyon" className="underline">mağazadan</Link> hemen sipariş verebilirsiniz.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobil: liste özeti çubuğu */}
      <a
        href="#toptan-listem"
        className="fixed inset-x-0 bottom-0 z-[60] flex items-center justify-between gap-3 border-t bg-white px-4 py-3 lg:hidden"
        style={{ borderColor: "#e9d9a6" }}
      >
        <span className="text-xs text-stone-700">
          <strong>{list.items.length}</strong> çeşit · <strong>{list.count}</strong> adet · {tl(list.total)} ₺
          <span className="block text-[10px]" style={{ color: remaining ? "#9a7a2c" : "#1f9d55" }}>
            {remaining ? `Min. tutara ${tl(remaining)} ₺ kaldı` : "✓ Fiyat alabilirsiniz"}
          </span>
        </span>
        <span className="shrink-0 bg-[#1a1208] px-4 py-2 text-[11px] uppercase tracking-[0.15em] text-[#e9d48f]">Listeyi gör</span>
      </a>
    </div>
  );
}
