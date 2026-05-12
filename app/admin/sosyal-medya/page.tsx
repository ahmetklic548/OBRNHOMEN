"use client";

import { useState, useEffect } from "react";
import { getAllProducts } from "@/lib/products";

const PLATFORMS = ["instagram", "tiktok", "youtube_shorts"] as const;
type Platform = (typeof PLATFORMS)[number];

const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube_shorts: "YouTube Shorts",
};

const FIELD_LABELS: Record<string, string> = {
  video_konusu: "Video Konusu",
  kanca_cumlesi: "Kanca Cümlesi",
  video_scripti: "Video Scripti",
  gorsel_istemi: "Görsel İstemi (AI)",
  altyazi_metni: "Altyazı & Hashtagler",
  muzik_tarzi: "Müzik Tarzı",
};

type ContentPlan = Record<string, string>;
type Result = Record<Platform, ContentPlan>;

interface HistoryEntry {
  id: number;
  tarih: string;
  mod: "urun" | "konu";
  girdi: string;
  sonuc: Result;
}

const STORAGE_KEY = "sosyal-medya-gecmis";

function loadHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveToHistory(entry: HistoryEntry) {
  const existing = loadHistory();
  const updated = [entry, ...existing].slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

const products = getAllProducts();

export default function SosyalMedyaPage() {
  const [mode, setMode] = useState<"urun" | "konu">("urun");
  const [selectedSlug, setSelectedSlug] = useState(products[0]?.slug ?? "");
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string>("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  async function generate() {
    setLoading(true);
    setError("");
    setResult(null);

    const body = mode === "urun" ? { slug: selectedSlug } : { topic };

    try {
      const res = await fetch("/api/social-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Hata");

      const sonuc = data as Result;
      setResult(sonuc);

      const girdi =
        mode === "urun"
          ? products.find((p) => p.slug === selectedSlug)?.name ?? selectedSlug
          : topic;

      const entry: HistoryEntry = {
        id: Date.now(),
        tarih: new Date().toLocaleString("tr-TR"),
        mod: mode,
        girdi,
        sonuc,
      };
      saveToHistory(entry);
      setHistory(loadHistory());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  }

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  }

  function downloadJson() {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sosyal-medya-${mode === "urun" ? selectedSlug : "konu"}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-xl font-semibold mb-8" style={{ color: "#1D1D1F" }}>
        Sosyal Medya İçerik Üreteci
      </h1>

      {/* Mod Seçici */}
      <div className="flex gap-2 mb-6">
        {(["urun", "konu"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className="px-5 py-2 text-xs tracking-[0.2em] uppercase transition-all"
            style={{
              background: mode === m ? "#1D1D1F" : "transparent",
              color: mode === m ? "#c9a84c" : "#86868B",
              border: "1px solid",
              borderColor: mode === m ? "#1D1D1F" : "#e5e5e5",
            }}
          >
            {m === "urun" ? "Ürün Seç" : "Serbest Konu"}
          </button>
        ))}
      </div>

      {/* Input */}
      {mode === "urun" ? (
        <div className="mb-6">
          <label className="block text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: "#86868B" }}>
            Ürün
          </label>
          <select
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            className="w-full px-4 py-3 text-sm border bg-white"
            style={{ borderColor: "#e5e5e5", color: "#1D1D1F" }}
          >
            {products.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name} — {p.category}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="mb-6">
          <label className="block text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: "#86868B" }}>
            Konu
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={3}
            placeholder="Örn: Anneler Günü hediyesi için tesbih önerisi"
            className="w-full px-4 py-3 text-sm border bg-white resize-none"
            style={{ borderColor: "#e5e5e5", color: "#1D1D1F" }}
          />
        </div>
      )}

      {/* Üret Butonu */}
      <button
        onClick={generate}
        disabled={loading || (mode === "konu" && !topic.trim())}
        className="px-8 py-3 text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-80 disabled:opacity-40"
        style={{ background: "#1D1D1F", color: "#c9a84c" }}
      >
        {loading ? "Üretiliyor..." : "İçerik Üret"}
      </button>

      {error && (
        <p className="mt-4 text-sm" style={{ color: "#FF3B30" }}>
          Hata: {error}
        </p>
      )}

      {/* Sonuç */}
      {result && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm tracking-[0.2em] uppercase" style={{ color: "#86868B" }}>
              Üretilen İçerik
            </h2>
            <button
              onClick={downloadJson}
              className="px-4 py-2 text-xs tracking-[0.15em] uppercase border transition-colors hover:border-[#c9a84c]"
              style={{ borderColor: "#e5e5e5", color: "#1D1D1F" }}
            >
              JSON İndir
            </button>
          </div>

          <div className="grid gap-8">
            {PLATFORMS.map((platform) => {
              const plan = result[platform];
              if (!plan) return null;
              return (
                <div key={platform} className="border bg-white" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                  <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(0,0,0,0.06)", background: "#FAFAFA" }}>
                    <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: "#1D1D1F" }}>
                      {PLATFORM_LABELS[platform]}
                    </span>
                  </div>
                  <div className="divide-y" style={{ borderColor: "rgba(0,0,0,0.04)" }}>
                    {Object.entries(plan).map(([field, value]) => {
                      const copyKey = `${platform}-${field}`;
                      return (
                        <div key={field} className="px-6 py-4 flex gap-4 items-start">
                          <div className="flex-1">
                            <p className="text-[10px] tracking-[0.25em] uppercase mb-1" style={{ color: "#86868B" }}>
                              {FIELD_LABELS[field] ?? field}
                            </p>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#1D1D1F" }}>
                              {value}
                            </p>
                          </div>
                          <button
                            onClick={() => copyText(value, copyKey)}
                            className="shrink-0 text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border transition-colors"
                            style={{
                              borderColor: copied === copyKey ? "#c9a84c" : "#e5e5e5",
                              color: copied === copyKey ? "#c9a84c" : "#86868B",
                            }}
                          >
                            {copied === copyKey ? "Kopyalandı" : "Kopyala"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Geçmiş */}
      {history.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm tracking-[0.2em] uppercase" style={{ color: "#86868B" }}>
              Geçmiş
            </h2>
            <button
              onClick={clearHistory}
              className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border transition-colors hover:border-red-300"
              style={{ borderColor: "#e5e5e5", color: "#86868B" }}
            >
              Temizle
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {history.map((entry) => (
              <button
                key={entry.id}
                onClick={() => setResult(entry.sonuc)}
                className="text-left px-4 py-3 border bg-white transition-colors hover:border-[#c9a84c] flex items-center justify-between gap-4"
                style={{ borderColor: "rgba(0,0,0,0.08)" }}
              >
                <div>
                  <p className="text-sm" style={{ color: "#1D1D1F" }}>{entry.girdi}</p>
                  <p className="text-[10px] tracking-[0.15em] uppercase mt-0.5" style={{ color: "#86868B" }}>
                    {entry.mod === "urun" ? "Ürün" : "Konu"} · {entry.tarih}
                  </p>
                </div>
                <span className="text-[10px] tracking-[0.15em] uppercase shrink-0" style={{ color: "#c9a84c" }}>
                  Yükle →
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
