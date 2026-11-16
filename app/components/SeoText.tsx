import Link from "next/link";
import { categoryBySlug } from "@/lib/categories";
import { faqJsonLd, landingBySlug, type SeoBlock } from "@/lib/seoContent";

/** Kategori / açılış sayfasının altındaki bilgilendirici metin + Sık Sorulanlar (FAQPage şeması). */
export default function SeoText({ block, heading }: { block: SeoBlock; heading: string }) {
  const links = block.links
    .map((s) => {
      const c = categoryBySlug(s);
      if (c) return { href: `/koleksiyon/${c.slug}`, label: c.name };
      const l = landingBySlug(s);
      if (l) return { href: `/koleksiyon/${l.slug}`, label: l.h1 };
      return null;
    })
    .filter(Boolean) as { href: string; label: string }[];

  return (
    <section className="border-t border-stone-200 bg-[#f6f4ef]">
      {block.faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(block.faqs)) }} />
      )}
      <div className="mx-auto max-w-3xl px-6 py-12 text-[15px] leading-relaxed text-stone-700">
        <h2 className="text-2xl text-stone-900" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          {heading}
        </h2>
        <div className="mt-4 space-y-3">
          {block.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {block.faqs.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-stone-900">Sık Sorulan Sorular</h3>
            <div className="mt-3 divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
              {block.faqs.map((f, i) => (
                <details key={i} className="group px-4 py-3">
                  <summary className="cursor-pointer list-none font-medium text-stone-900 marker:hidden">
                    {f.q}
                  </summary>
                  <p className="mt-2 text-stone-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        {links.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full border border-stone-300 bg-white px-4 py-1.5 text-[13px] text-stone-700 hover:border-stone-900 hover:text-stone-900"
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
