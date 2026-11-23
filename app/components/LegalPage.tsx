import Link from "next/link";
import { LEGAL_LINKS, LEGAL_UPDATED } from "@/lib/legal";

export type LegalSection = { title: string; body: React.ReactNode };

/** Yasal metin sayfaları için ortak düzen (İade Şartları sayfasıyla aynı görünüm). */
export default function LegalPage({
  kicker = "Yasal",
  title,
  intro,
  sections,
  current,
}: {
  kicker?: string;
  title: string;
  intro?: React.ReactNode;
  sections: LegalSection[];
  current: string;
}) {
  return (
    <div className="min-h-screen" style={{ background: "#fafaf8" }}>
      <div className="pt-10 pb-10 px-6 border-b" style={{ borderColor: "#efefef" }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] tracking-[0.4em] uppercase mb-4" style={{ color: "#9a7a2c" }}>
            {kicker}
          </p>
          <h1
            style={{
              fontSize: "clamp(1.9rem, 4.5vw, 3rem)",
              fontWeight: 400,
              fontFamily: "var(--font-playfair, 'Playfair Display'), Georgia, serif",
              color: "#0a0a0a",
              lineHeight: 1.15,
            }}
          >
            {title}
          </h1>
          {intro && <div className="mt-4 text-[15px] leading-relaxed" style={{ color: "#555" }}>{intro}</div>}
          <p className="mt-3 text-[13px]" style={{ color: "#888" }}>Son güncelleme: {LEGAL_UPDATED}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {sections.map((s, i) => (
          <section key={i} className="py-7 border-b" style={{ borderColor: "#efefef" }}>
            <h2 className="mb-3 text-[16px] font-semibold text-stone-900">{s.title}</h2>
            <div className="legal-body space-y-3 text-[15px] leading-relaxed" style={{ color: "#444" }}>
              {s.body}
            </div>
          </section>
        ))}

        <nav aria-label="Diğer yasal metinler" className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-[14px]">
          {LEGAL_LINKS.filter((l) => l.href !== current).map((l) => (
            <Link key={l.href} href={l.href} className="text-[#7a5c17] underline underline-offset-4 hover:text-black">
              {l.label}
            </Link>
          ))}
          <Link href="/returns" className="text-[#7a5c17] underline underline-offset-4 hover:text-black">
            İade Şartları
          </Link>
        </nav>
      </div>
    </div>
  );
}

/** Madde listesi */
export function Items({ children }: { children: React.ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {children.map((c, i) => <li key={i}>{c}</li>)}
    </ul>
  );
}
