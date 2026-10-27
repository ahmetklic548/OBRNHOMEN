"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useHiddenSlugs, unhideProduct } from "@/lib/hidden";

interface IndexItem { slug: string; name: string; image: string; category: string; id?: string }

/** Sitede "Sil" ile kaldırılan ürünler — tek tıkla geri alınır */
export default function GizlenenUrunler() {
  const hidden = useHiddenSlugs();
  const [index, setIndex] = useState<IndexItem[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  // Ürün adları/görselleri için arama listesi (kalıcı gizlenenler listede olmayabilir → slug gösterilir)
  useEffect(() => {
    fetch("/search-index.json").then(r => r.json()).then(setIndex).catch(() => setIndex([]));
  }, []);
  const bySlug = useMemo(() => new Map((index ?? []).map(i => [i.slug, i])), [index]);
  const list = [...hidden];

  const restore = async (slug: string) => {
    setBusy(slug);
    try { await unhideProduct(slug); } catch (e) { alert("Geri alınamadı: " + (e instanceof Error ? e.message : "")); }
    finally { setBusy(null); }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-xl font-semibold mb-2" style={{ color: "#1D1D1F" }}>Gizlenen Ürünler <span className="text-sm font-normal text-stone-400">({list.length})</span></h1>
      <p className="text-sm mb-8 text-stone-500">
        Sitede ürün kartlarındaki kırmızı <strong>Sil</strong> düğmesiyle kaldırdığın ürünler. Müşteriler bu ürünleri görmez ve satın alamaz.
        &ldquo;Geri al&rdquo; ile hemen siteye döner.
      </p>
      {list.length === 0 ? (
        <p className="py-16 text-center text-sm text-stone-400">Gizlenen ürün yok.</p>
      ) : (
        <ul className="divide-y rounded-lg border bg-white">
          {list.map(slug => {
            const it = bySlug.get(slug);
            return (
              <li key={slug} className="flex items-center gap-4 px-4 py-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded bg-stone-100">
                  {it?.image && <Image src={it.image} alt="" fill sizes="56px" className="object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/products/${slug}`} className="line-clamp-2 text-sm text-stone-900 hover:underline">{it?.name ?? slug}</Link>
                  <p className="text-xs text-stone-400">{it?.category ?? ""}</p>
                </div>
                <button onClick={() => restore(slug)} disabled={busy === slug} className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
                  {busy === slug ? "…" : "Geri al"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
