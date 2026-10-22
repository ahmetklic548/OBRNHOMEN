/** Mihrap kemeri içinde Kâbe — header logosu ve açılış animasyonu aynı işareti kullanır. */
export default function KaabaMark({ className = "", animated = false }: { className?: string; animated?: boolean }) {
  const a = (name: string) => (animated ? name : undefined);
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path
        className={a("intro-draw")}
        pathLength={1}
        d="M12 59V31C12 18 21 9 32 4c11 5 20 14 20 27v28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path className={a("intro-draw intro-d1")} pathLength={1} d="M8 59h48" stroke="currentColor" strokeWidth="1.5" />
      {/* Kâbe: sol yüz, sağ yüz, üst */}
      <g className={a("intro-rise")}>
        <path d="M19 31l13 5.5V56l-13-5.5z" fill="#1d1a14" />
        <path d="M32 36.5L45 31v19.5L32 56z" fill="#2c2820" />
        <path d="M19 31l13-5.5L45 31l-13 5.5z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </g>
      {/* Altın kuşak (hizam) ve kapı */}
      <path
        className={a("intro-draw intro-d2")}
        pathLength={1}
        d="M19 35l13 5.5L45 35"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path className={a("intro-fade intro-d3")} d="M36.5 45.6l4-1.7v6l-4 1.7z" fill="currentColor" />
    </svg>
  );
}
