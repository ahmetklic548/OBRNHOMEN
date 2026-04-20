/**
 * İslami geometrik süs bileşenleri (saf SVG, sıfır bağımlılık)
 *
 * Kullanım:
 *   <IslamicStar size={32} color="#c9a84c" />
 *   <IslamicCorner position="top-left" size={64} />
 *   <IslamicDivider />
 */

type Color = string;

/* ---------- 8 köşeli İslami yıldız ---------- */
export function IslamicStar({
  size = 32,
  color = "#c9a84c",
  opacity = 0.85,
  className = "",
}: {
  size?: number;
  color?: Color;
  opacity?: number;
  className?: string;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2.2;
  const r = size / 4.8;

  const pts = Array.from({ length: 16 }, (_, i) => {
    const angle = (i * Math.PI) / 8 - Math.PI / 2;
    const radius = i % 2 === 0 ? R : r;
    return `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`;
  }).join(" ");

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <polygon points={pts} fill={color} opacity={opacity} />
    </svg>
  );
}

/* ---------- Köşe süsü (L-şekli + yıldız) ---------- */
export function IslamicCorner({
  size = 56,
  color = "#c9a84c",
  position = "top-left",
  className = "",
}: {
  size?: number;
  color?: Color;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}) {
  const rotation =
    position === "top-right" ? "rotate(90)" :
    position === "bottom-right" ? "rotate(180)" :
    position === "bottom-left" ? "rotate(270)" : "";

  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      style={{ transform: rotation || undefined }}
    >
      {/* L köşe çerçevesi */}
      <path
        d="M2 2 L22 2 L22 5 L5 5 L5 22 L2 22 Z"
        fill={color}
        opacity={0.75}
      />
      {/* İnce diagonal çizgi */}
      <line x1="3" y1="24" x2="24" y2="3" stroke={color} strokeWidth="0.6" opacity={0.35} />
      {/* Merkez 4-kollu yıldız */}
      <polygon
        points="11,8 12.5,11 11,14 9.5,11"
        fill={color}
        opacity={0.9}
      />
      <polygon
        points="8,11 11,9.5 14,11 11,12.5"
        fill={color}
        opacity={0.9}
      />
    </svg>
  );
}

/* ---------- Bölücü çizgi (köşe süslü) ---------- */
export function IslamicDivider({
  color = "#c9a84c",
  className = "",
}: {
  color?: Color;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="h-px flex-1 max-w-[120px]" style={{ background: `linear-gradient(to right, transparent, ${color})` }} />
      <IslamicStar size={18} color={color} opacity={0.9} />
      <div className="h-px flex-1 max-w-[120px]" style={{ background: `linear-gradient(to left, transparent, ${color})` }} />
    </div>
  );
}

/* ---------- Panel çerçeve (ürün açıklama kartları için) ---------- */
export function OrnamentedPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Köşe süsleri */}
      <IslamicCorner position="top-left"    size={40} className="absolute top-0 left-0" />
      <IslamicCorner position="top-right"   size={40} className="absolute top-0 right-0" />
      <IslamicCorner position="bottom-left" size={40} className="absolute bottom-0 left-0" />
      <IslamicCorner position="bottom-right"size={40} className="absolute bottom-0 right-0" />
      {/* İç içerik */}
      <div className="p-6">{children}</div>
    </div>
  );
}
