"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getAllProducts } from "@/lib/products";

const HISTORY_KEY = "search-history";
const MAX_HISTORY = 8;

interface Result {
  slug: string;
  name: string;
  category: string;
  image: string;
  price: number;
}

function getHistory(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]"); } catch { return []; }
}

function saveHistory(term: string) {
  const prev = getHistory().filter(h => h !== term);
  localStorage.setItem(HISTORY_KEY, JSON.stringify([term, ...prev].slice(0, MAX_HISTORY)));
}

function removeHistory(term: string) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(getHistory().filter(h => h !== term)));
}

const allProducts: Result[] = getAllProducts().map(p => ({
  slug: p.slug,
  name: p.name,
  category: p.category,
  image: p.images[0] ?? "",
  price: p.price,
}));

function search(query: string): Result[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return allProducts
    .filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    )
    .slice(0, 6);
}

export default function SearchBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setHistory(getHistory());
  }, [open]);

  useEffect(() => {
    setResults(search(query));
    setActive(-1);
  }, [query]);

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
    saveHistory(result.name);
    close();
    router.push(`/products/${result.slug}`);
  };

  const goHistoryItem = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  const deleteHistory = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    removeHistory(term);
    setHistory(getHistory());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = query ? results : [];
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(a + 1, items.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(a => Math.max(a - 1, -1)); }
    else if (e.key === "Enter") {
      if (active >= 0 && items[active]) { goTo(items[active]); }
      else if (query.trim()) { saveHistory(query.trim()); close(); router.push(`/koleksiyon?q=${encodeURIComponent(query.trim())}`); }
    }
    else if (e.key === "Escape") close();
  };

  const showDropdown = open && (query ? results.length > 0 : history.length > 0);

  return (
    <div ref={containerRef} className="relative">
      {/* Search icon / input toggle */}
      <div
        className={`flex items-center gap-2 transition-all duration-200 overflow-hidden ${
          open ? "w-52 border-b border-stone-300" : "w-8"
        }`}
      >
        <button
          onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
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
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ürün ara..."
            className="flex-1 text-[12px] outline-none bg-transparent text-stone-800 placeholder:text-stone-400"
            style={{ minWidth: 0 }}
          />
        )}
        {open && query && (
          <button onClick={() => setQuery("")} className="shrink-0 opacity-40 hover:opacity-70">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className="absolute right-0 top-10 z-50 rounded-xl overflow-hidden"
          style={{
            width: 320,
            background: "#fff",
            boxShadow: "0 8px 32px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.07)",
          }}
        >
          {/* Geçmiş */}
          {!query && history.length > 0 && (
            <div>
              <p className="px-4 pt-3 pb-1 text-[10px] tracking-[0.2em] uppercase" style={{ color: "#86868B" }}>
                Son Aramalar
              </p>
              {history.map((h, i) => (
                <div
                  key={h}
                  onClick={() => goHistoryItem(h)}
                  className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${active === i ? "bg-stone-50" : "hover:bg-stone-50"}`}
                >
                  <div className="flex items-center gap-3">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "#86868B" }}>
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span className="text-sm" style={{ color: "#1D1D1F" }}>{h}</span>
                  </div>
                  <button
                    onClick={e => deleteHistory(e, h)}
                    className="opacity-30 hover:opacity-70 transition-opacity"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Sonuçlar */}
          {query && results.length > 0 && (
            <div>
              <p className="px-4 pt-3 pb-1 text-[10px] tracking-[0.2em] uppercase" style={{ color: "#86868B" }}>
                Ürünler
              </p>
              {results.map((r, i) => (
                <div
                  key={r.slug}
                  onClick={() => goTo(r)}
                  className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${active === i ? "bg-stone-50" : "hover:bg-stone-50"}`}
                >
                  {r.image && (
                    <Image src={r.image} alt="" width={36} height={36} className="rounded object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate" style={{ color: "#1D1D1F" }}>{r.name}</p>
                    <p className="text-[11px]" style={{ color: "#86868B" }}>{r.category} · {r.price.toLocaleString("tr-TR")} ₺</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
