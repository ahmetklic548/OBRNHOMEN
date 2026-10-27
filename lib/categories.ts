import data from "@/data/categories.json";

/** Kategori tanımı — scripts/classify.mjs ile ortak (data/categories.json) */
export interface Category {
  name: string;
  slug: string;
  /** Ürün kodu öneki: OBR-<code>-0001 */
  code: string;
  /** Menüdeki üst grup */
  group: string;
  subs: string[];
  title: string;
  description: string;
}

export const CATEGORIES = data as Category[];

export const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const categoryByName = (name: string) => CATEGORIES.find((c) => c.name === name);

/** /koleksiyon/<slug>; alt grup verilirse ?alt= ile filtreli açılır */
export function categoryHref(name: string, sub?: string): string {
  const slug = categoryByName(name)?.slug ?? "";
  return `/koleksiyon/${slug}${sub ? `?alt=${encodeURIComponent(sub)}` : ""}`;
}

/** Menü grupları (sırayla): tek kategorili grup doğrudan link, diğerleri açılır menü */
export const NAV_GROUPS: { label: string; categories: Category[] }[] = (() => {
  const groups: { label: string; categories: Category[] }[] = [];
  for (const c of CATEGORIES) {
    const g = groups.find((x) => x.label === c.group);
    if (g) g.categories.push(c);
    else groups.push({ label: c.group, categories: [c] });
  }
  return groups;
})();
