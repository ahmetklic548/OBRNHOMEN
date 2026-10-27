"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { prepare, searchProducts, fold } from "@/lib/search";
import { WHATSAPP_URL } from "@/lib/storeNav";

const HISTORY_KEY = "search-history";
const MAX_HISTORY = 8;
const POPULAR = ["Kur'an-ı Kerim", "Yasin", "Seccade", "Tesbih", "Zikirmatik", "İhram", "Namaz elbisesi", "Misvak"];

interface Result {
  slug: string;
  name: string;
  category: string;
  subcategory?: string;
  color?: string | null;
  size?: string | null;
  brand?: string;
  id?: string;
  image: string;
  price: number;
}

function getHistory(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]"); } catch { return []; }
}

function saveHistory(term: string) {
  try {
    const prev = getHistory().filter(h => h !== term);
    localStorage.setItem(HISTORY_KEY, JSON.stringify([term, ...prev].slice(0, MAX_HISTORY)));
  } catch {}
}

function removeHistory(term: string) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(getHistory().filter(h => h !== term))); } catch {}
}

// Ürün listesi her sayfanın JS'ine gömülmesin diye arama ilk açıldığında
// /search-index.json'dan yüklenir (app/search-index.json/route.ts).
let index: ReturnType<typeof prepare<Result>> = [];
let loading: Promise<void> | null = null;
function loadIndex(): Promise<void> {
  loading ??= fetch("/search-index.json")
    .then(r => r.json())
    .then((d: Result[]) => { index = prepare(d); })
    .catch(() => { loading = null; });
  return loading;
}

const catHref = (cat: string, sub?: string) =>
  `/koleksiyon/${encodeURIComponent(cat)}${sub ? `?alt=${encodeURIComponent(sub)}` : ""}`;

export default function SearchBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [active, setActive] = useState(-1);
  const [indexReady, setIndexReady] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const openSearch = () => {
    setOpen(true);
    setHistory(getHistory());
    loadIndex().then(() => setIndexReady(true));
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const all = useMemo(() => (indexReady && query.trim() ? searchProducts(index, query) : []), [query, indexReady]);
  const results = all.slice(0, 6);

  // Sonuçların en çok düştüğü alt gruplar → "şu bölümde ara" önerisi
  const groups = useMemo(() => {
    const q = fold(query);
    const counts = new Map<string, { cat: string; sub: string; n: number }>();
    for (const r of all) {
      const key = `${r.category}|${r.subcategory ?? ""}`;
      const g = counts.get(key) ?? { cat: r.category, sub: r.subcategory ?? "", n: 0 };
      g.n++;
      counts.set(key, g);
    }
    return [...counts.values()]
      .sort((a, b) => Number(fold(b.sub).includes(q)) - Number(fold(a.sub).includes(q)) || b.n - a.n)
      .slice(0, 3);
  }, [all, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(-1);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [close]);

  const goTo = (result: Result) => {
    saveHistory(query.trim() || result.name);
    close();
    router.push(`/products/${result.slug}`);
  };

  const goAll = (term = query) => {
    const t = term.trim();
    if (!t) return;
    saveHistory(t);
    close();
    router.push(`/koleksiyon?q=${encodeURIComponent(t)}`);
  };

  const goGroup = (cat: string, sub: string) => {
    saveHistory(query.trim());
    close();
    router.push(catHref(cat, sub));
  };

  const pick = (term: string) => {
    setQuery(term);
    setActive(-1);
    inputRef.current?.focus();
  };

  const deleteHistory = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    removeHistory(term);
    setHistory(getHistory());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(a + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(a => Math.max(a - 1, -1)); }
    else if (e.key === "Enter") {
      if (active >= 0 && results[active]) goTo(results[active]);
      else goAll();
    }
    else if (e.key === "Escape") close();
  };

  const searching = query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative">
      {/* Search icon / input toggle */}
      <div
        className={`flex items-center gap-2 transition-all duration-200 overflow-hidden ${
          open ? "w-48 md:w-64 border-b border-stone-300" : "w-8"
        }`}
      >
        <button
          onClick={openSearch}
          className="shrink-0 transition-opacity hover:opacity-60"
          aria-label="Ara"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ color: "#1D1D1F" }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
        {open && (
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setActive(-1); }}
            onKeyDown={handleKeyDown}
            placeholder="Kuran, seccade, tesbih, ürün kodu…"
            className="flex-1 text-[13px] outline-none bg-transparent text-stone-800 placeholder:text-stone-400"
            style={{ minWidth: 0 }}
            enterKeyHint="search"
          />
        )}
        {open && query && (
          <button onClick={() => setQuery("")} className="shrink-0 opacity-40 hover:opacity-70" aria-label="Temizle">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-10 z-50 overflow-hidden rounded-xl"
          style={{
            width: "min(380px, calc(100vw - 24px))",
            background: "#fff",
            boxShadow: "0 8px 32px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.07)",
          }}
        >
          {!searching && (
            <div className="pb-2">
              {history.length > 0 && (
                <div>
                  <p className="px-4 pt-3 pb-1 text-[10px] tracking-[0.2em] uppercase" style={{ color: "#86868B" }}>Son Aramalar</p>
                  {history.map(h => (
                    <div key={h} onClick={() => pick(h)} className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-stone-50">
                      <span className="text-sm" style={{ color: "#1D1D1F" }}>{h}</span>
                      <button onClick={e => deleteHistory(e, h)} className="opacity-30 hover:opacity-70" aria-label={`${h} sil`}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="px-4 pt-3 pb-2 text-[10px] tracking-[0.2em] uppercase" style={{ color: "#86868B" }}>Popüler Aramalar</p>
              <div className="flex flex-wrap gap-1.5 px-4">
                {POPULAR.map(t => (
                  <button key={t} onClick={() => pick(t)} className="rounded-full border px-3 py-1 text-xs text-stone-700 hover:border-black" style={{ borderColor: "#e5e5e5" }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {searching && !indexReady && (
            <p className="px-4 py-4 text-xs text-stone-400">Aranıyor…</p>
          )}

          {searching && indexReady && all.length === 0 && (
            <div className="px-4 py-4 text-sm text-stone-600">
              <p>&ldquo;{query}&rdquo; için sonuç bulunamadı.</p>
              <p className="mt-1 text-xs text-stone-400">Farklı bir kelime deneyin ya da bize sorun:</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {POPULAR.slice(0, 5).map(t => (
                  <button key={t} onClick={() => pick(t)} className="rounded-full border px-3 py-1 text-xs text-stone-700 hover:border-black" style={{ borderColor: "#e5e5e5" }}>{t}</button>
                ))}
              </div>
              <a
                href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Merhaba, sitede "${query}" aradım ama bulamadım. Bu ürün sizde var mı?`)}`}
                target="_blank" rel="noopener noreferrer"
                className="mt-3 inline-block text-xs font-medium text-[#1f9d55] underline"
              >
                WhatsApp&apos;tan sorun →
              </a>
            </div>
          )}

          {searching && all.length > 0 && (
            <div>
              {groups.length > 0 && (
                <div className="border-b pb-2" style={{ borderColor: "#f2f2f2" }}>
                  <p className="px-4 pt-3 pb-1 text-[10px] tracking-[0.2em] uppercase" style={{ color: "#86868B" }}>Bölümler</p>
                  {groups.map(g => (
                    <button key={`${g.cat}|${g.sub}`} onClick={() => goGroup(g.cat, g.sub)} className="flex w-full items-center justify-between px-4 py-1.5 text-left text-sm hover:bg-stone-50">
                      <span style={{ color: "#1D1D1F" }}>
                        {g.sub || g.cat}
                        {g.sub && <span className="ml-1.5 text-[11px] text-stone-400">{g.cat}</span>}
                      </span>
                      <span className="text-[11px] text-stone-400">{g.n}</span>
                    </button>
                  ))}
                </div>
              )}

              <p className="px-4 pt-3 pb-1 text-[10px] tracking-[0.2em] uppercase" style={{ color: "#86868B" }}>Ürünler</p>
              {results.map((r, i) => (
                <div
                  key={r.slug}
                  onClick={() => goTo(r)}
                  className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${active === i ? "bg-stone-50" : "hover:bg-stone-50"}`}
                >
                  {r.image && <Image src={r.image} alt="" width={40} height={40} className="h-10 w-10 rounded object-cover shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] leading-snug line-clamp-2" style={{ color: "#1D1D1F" }}>{r.name}</p>
                    <p className="text-[11px]" style={{ color: "#86868B" }}>
                      {r.subcategory ?? r.category} · {r.price.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} ₺
                    </p>
                  </div>
                </div>
              ))}

              <button
                onClick={() => goAll()}
                className="block w-full border-t px-4 py-3 text-center text-[12px] font-medium hover:bg-stone-50"
                style={{ borderColor: "#f2f2f2", color: "#9a7a2c" }}
              >
                Tüm sonuçları gör ({all.length}) →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
