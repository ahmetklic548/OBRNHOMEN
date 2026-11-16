import data from "@/data/seo-content.json";
import { getAllProducts, type Product } from "@/lib/products";
import { prepare, searchProducts } from "@/lib/search";
import { HIDDEN_SLUGS } from "@/lib/productCuration";

export interface Faq { q: string; a: string }
export interface SeoBlock { intro: string[]; faqs: Faq[]; links: string[] }
export interface Landing extends SeoBlock {
  slug: string;
  title: string;
  h1: string;
  description: string;
  queries: string[];
}

export const LANDINGS = data.landings as Landing[];
export const landingBySlug = (slug: string) => LANDINGS.find((l) => l.slug === slug);
export const categorySeo = (slug: string) =>
  (data.categories as Record<string, SeoBlock>)[slug] as SeoBlock | undefined;

/** Açılış sayfasının ürünleri: her arama ifadesinin sonuçları, sırayla ve tekrarsız. */
export function landingProducts(l: Landing, limit = 48): Product[] {
  const visible = getAllProducts().filter((p) => !HIDDEN_SLUGS.has(p.slug));
  const prepared = prepare(visible);
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const q of l.queries) {
    for (const p of searchProducts(prepared, q, limit)) {
      if (!seen.has(p.slug)) { seen.add(p.slug); out.push(p); }
      if (out.length >= limit) return out;
    }
  }
  return out;
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
