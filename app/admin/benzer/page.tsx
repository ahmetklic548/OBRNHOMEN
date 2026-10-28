"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import pairs from "@/data/similar.json";
import { useHiddenSlugs } from "@/lib/hidden";
import AdminProductTools from "@/app/components/AdminProductTools";

interface IndexItem { slug: string; name: string; image: string; category: string; subcategory?: string; id?: string; price: number }

const tl = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * Benzer olabilecek ürün çiftleri (scripts/classify.mjs → data/similar.json).
 * Gereksiz olanı "Sil" ile kaldır; silinen çift "çözüldü" olarak soluklaşır.
 */
export default function BenzerUrunler() {
  const hidden = useHiddenSlugs();
  const [index, setIndex] = useState<IndexItem[] | null>(null);
  const [showDone, setShowDone] = useState(false);

  useEffect(() => {
    fetch("/search-index.json").then(r => r.json()).then(setIndex).catch(() => setIndex([]));
  }, []);
  const bySlug = useMemo(() => new Map((index ?? []).map(i => [i.slug, i])), [index]);

  const rows = pairs.map(p => ({ ...p, done: hidden.has(p.a) || hidden.has(p.b) }));
  const open = rows.filter(r => !r.done).length;

  const Card = ({ slug }: { slug: string }) => {
    const it = bySlug.get(slug);
    const gone = hidden.has(slug);
    return (
      <div className={`relative flex gap-3 rounded-lg border bg-white p-3 ${gone ? "opacity-40" : ""}`}>
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded bg-stone-100">
          {it?.image && <Image src={it.image} alt="" fill sizes="96px" className="object-cover" />}
          {!gone && <AdminProductTools slug={slug} name={it?.name ?? slug} compact />}
        </div>
        <div className="min-w-0 flex-1 text-[13px]">
          <Link href={`/products/${slug}`} target="_blank" className="line-clamp-3 text-stone-900 hover:underline">{it?.name ?? slug}</Link>
          <p className="mt-1 text-stone-500">{it?.id} · {it ? `${tl(it.price)} ₺` : ""}</p>
          {gone && <p className="mt-1 font-medium text-red-600">Silindi</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <h1 className="text-xl font-semibold text-stone-900">Benzer Ürünler <span className="text-sm font-normal text-stone-400">({open} kontrol bekliyor / {rows.length})</span></h1>
      <p className="mt-2 text-[14px] leading-relaxed text-stone-600">
        Adları çok benzeyen ürün çiftleri. Çoğu aynı ürünün farklı desen/rengi olabilir — öyleyse ikisini de bırak.
        Gerçekten aynı ürünse istemediğinin fotoğrafındaki kırmızı <strong>Sil</strong> düğmesine bas (geri almak için: Gizlenen Ürünler).
      </p>
      <label className="mt-3 inline-flex items-center gap-2 text-[13px] text-stone-600">
        <input type="checkbox" checked={showDone} onChange={e => setShowDone(e.target.checked)} /> Çözülenleri de göster
      </label>

      {index === null ? (
        <p className="py-16 text-center text-sm text-stone-400">Yükleniyor…</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {rows.filter(r => showDone || !r.done).map(r => (
            <li key={`${r.a}|${r.b}`} className="rounded-xl border border-stone-200 bg-[#fafaf8] p-3">
              <p className="mb-2 text-[12px] text-stone-500">%{r.score} benzer{r.done ? " · ✓ çözüldü" : ""}</p>
              <div className="grid gap-3 md:grid-cols-2">
                <Card slug={r.a} />
                <Card slug={r.b} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
