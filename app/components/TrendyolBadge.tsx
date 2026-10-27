/**
 * Güven rozeti: Trendyol mağaza puanı. Puan elle güncellenir (Trendyol satıcı paneli → Mağaza Puanı).
 * Son kontrol: 2026-10-21 → 9,02
 */
export const TRENDYOL_STORE_URL = "https://www.trendyol.com/magaza/obrnhomen";
const SCORE = "9,0";

export default function TrendyolBadge({ compact = false }: { compact?: boolean }) {
  return (
    <a
      href={TRENDYOL_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 rounded-lg border border-[#f27a1a]/30 bg-[#fff7f0] text-stone-800 hover:border-[#f27a1a] ${compact ? "px-3 py-2" : "px-4 py-3"}`}
      title="Trendyol mağazamızı ve müşteri yorumlarını görün"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#f27a1a] text-[15px] font-bold text-white">{SCORE}</span>
      <span className="text-left leading-tight">
        <span className="block text-[14px] font-semibold">Trendyol Mağaza Puanı {SCORE} / 10</span>
        <span className="block text-[12px] text-stone-500">Binlerce siparişte müşteri değerlendirmesi · yorumları gör →</span>
      </span>
    </a>
  );
}
