"use client";

import { useState, useEffect } from "react";

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}

function Stars({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (r: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type={interactive ? "button" : undefined}
          disabled={!interactive}
          onClick={() => onRate?.(i)}
          onMouseEnter={() => interactive && setHovered(i)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={(hovered || rating) >= i ? "#c9a84c" : "#e5e7eb"}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({ slug }: { slug: string }) {
  const key = `obrnhomen-reviews-${slug}`;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) setReviews(JSON.parse(saved));
    } catch {}
  }, [key]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    const review: Review = {
      id: Date.now().toString(),
      name: name.trim(),
      rating,
      text: text.trim(),
      date: new Date().toISOString(),
    };
    const updated = [review, ...reviews];
    setReviews(updated);
    try { localStorage.setItem(key, JSON.stringify(updated)); } catch {}
    setSubmitted(true);
    setShowForm(false);
    setName(""); setText(""); setRating(5);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="border-t px-6 py-14" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
      <div className="max-w-screen-xl mx-auto max-w-2xl">

        {/* Başlık */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[11px] tracking-[0.4em] uppercase font-medium mb-1" style={{ color: "#86868B" }}>
              Müşteri Yorumları
            </p>
            {avg && (
              <div className="flex items-center gap-2">
                <Stars rating={Math.round(Number(avg))} />
                <span className="text-sm font-medium" style={{ color: "#1D1D1F" }}>{avg}</span>
                <span className="text-xs" style={{ color: "#86868B" }}>({reviews.length} yorum)</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-all"
            style={{ background: "#1D1D1F", color: "#c9a84c" }}
          >
            {showForm ? "İptal" : "Yorum Yaz"}
          </button>
        </div>

        {/* Yorum formu */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-10 p-6 border" style={{ borderColor: "rgba(201,168,76,0.2)", background: "rgba(201,168,76,0.03)" }}>
            <p className="text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: "#86868B" }}>Puan</p>
            <Stars rating={rating} interactive onRate={setRating} />
            <div className="mt-4 space-y-3">
              <input
                type="text"
                required
                placeholder="Adınız"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border px-4 py-2.5 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
                style={{ borderColor: "#e5e5e5" }}
              />
              <textarea
                required
                rows={3}
                placeholder="Yorumunuz..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full border px-4 py-2.5 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors resize-none"
                style={{ borderColor: "#e5e5e5" }}
              />
              <button
                type="submit"
                className="px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-opacity hover:opacity-80"
                style={{ background: "#c9a84c", color: "#1D1D1F" }}
              >
                Gönder
              </button>
            </div>
          </form>
        )}

        {submitted && (
          <p className="text-xs text-emerald-600 mb-6 tracking-wide">Yorumunuz eklendi, teşekkürler!</p>
        )}

        {/* Yorumlar */}
        {reviews.length === 0 ? (
          <p className="text-sm" style={{ color: "#86868B" }}>Henüz yorum yapılmamış. İlk yorumu siz yazın!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((r) => (
              <div key={r.id} className="pb-6 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: "#1D1D1F", color: "#c9a84c" }}>
                    {r.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: "#1D1D1F" }}>{r.name}</p>
                    <p className="text-[10px]" style={{ color: "#86868B" }}>
                      {new Date(r.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <div className="ml-auto"><Stars rating={r.rating} /></div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#555" }}>{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
