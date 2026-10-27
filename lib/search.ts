/**
 * Site içi ürün araması — üst arama çubuğu, koleksiyon ve toptan sayfası aynı motoru kullanır.
 * - Türkçe karakter/büyük-küçük harf duyarsız ("kuran" = "Kur'an" = "KURANI")
 * - Eş anlamlılar (tespih→tesbih, namazlık→seccade, başörtü→eşarp …)
 * - Çok kelimeli arama: her kelime ürünün bir yerinde geçmeli (yoksa en çok eşleşen gösterilir)
 * - Küçük yazım hataları (5+ harfli kelimede 1 harf farkı)
 */

export interface Searchable {
  name: string;
  category: string;
  subcategory?: string;
  color?: string | null;
  size?: string | null;
  brand?: string;
  id?: string;
}

export function fold(s: string): string {
  return s
    .toLocaleLowerCase("tr-TR")
    .replace(/[ıi̇îí]/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g").replace(/[üû]/g, "u")
    .replace(/ö/g, "o").replace(/ç/g, "c").replace(/[âà]/g, "a")
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Aranan kelime → ürünlerde geçebilecek karşılıkları */
const SYNONYMS: Record<string, string[]> = {
  tespih: ["tesbih"], tesbi: ["tesbih"], tesbh: ["tesbih"],
  namazlik: ["seccade", "namazlik"], seccad: ["seccade"], secade: ["seccade"], sejjade: ["seccade"],
  kuran: ["kuran", "kurani", "kerim", "mushaf"], kurani: ["kuran"], kerim: ["kuran", "kerim"],
  yasini: ["yasin"], yasinler: ["yasin"], yasin: ["yasin"], cuz: ["cuz", "cuzu"],
  basortu: ["basortu", "esarp", "yazma", "tulbent", "ortu"], basortusu: ["basortu", "esarp", "yazma"],
  esarp: ["esarp", "basortu", "yazma"], sal: ["sal", "esarp"], ortu: ["ortu", "tulbent", "esarp"],
  zikir: ["zikir", "zikirmatik"], zikirmatik: ["zikirmatik"], sayac: ["zikirmatik", "sayac"],
  misvak: ["misvak", "miswak", "sewak", "swak"], sivak: ["misvak"], miswak: ["misvak"],
  esans: ["esans", "parfum"], parfum: ["esans", "parfum"], koku: ["esans", "kokulu"],
  surme: ["surme", "goz kalemi"],
  ihram: ["ihram"], ihrami: ["ihram"],
  takke: ["takke"], patik: ["patik", "ayakkabi"],
  elifba: ["elifba", "elif ba"], elif: ["elifba", "elif"],
  mevlut: ["mevlut", "mevlit", "mevlid"], mevlit: ["mevlut", "mevlit", "mevlid"], mevlid: ["mevlut", "mevlit", "mevlid"],
  hediye: ["hediye", "hediyelik"], hediyelik: ["hediyelik", "hediye"],
  dagitmalik: ["dagitmalik", "toptan", "adet"], toptan: ["toptan", "dagitmalik", "adet"],
  cocuk: ["cocuk"], bebek: ["bebek", "cocuk"],
  elbise: ["elbise", "kiyafet"], kiyafet: ["kiyafet", "elbise"], namaz: ["namaz"],
  ceyiz: ["ceyiz", "ceyizlik", "bohca"], bohca: ["bohca", "ceyiz"], gelin: ["gelin", "ceyiz", "bohca"],
  cevsen: ["cevsen"], meal: ["meal", "mealli"], tecvid: ["tecvid", "tecvidli"],
};

function stems(token: string): string[] {
  const out = new Set([token]);
  for (const s of SYNONYMS[token] ?? []) out.add(s);
  // Türkçe ekleri kaba şekilde at: seccadeler → seccade, tesbihi → tesbih
  const bare = token.replace(/(lar|ler|lari|leri|si|su|i|u|li|lu|lik|luk)$/, "");
  if (bare.length >= 4 && bare !== token) {
    out.add(bare);
    for (const s of SYNONYMS[bare] ?? []) out.add(s);
  }
  return [...out];
}

/** 1 harf ekleme/silme/değiştirme mesafesinde mi */
function near(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, diff = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++diff > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else { i++; j++; }
  }
  return diff + (a.length - i) + (b.length - j) <= 1;
}

interface Prepared<T> { item: T; name: string; meta: string; cat: string; sub: string; words: string[] }

export function prepare<T extends Searchable>(items: T[]): Prepared<T>[] {
  return items.map((item) => {
    const name = fold(item.name);
    const meta = fold([item.category, item.subcategory, item.color, item.size, item.brand, item.id].filter(Boolean).join(" "));
    const cat = fold(item.category);
    const sub = fold(item.subcategory ?? "");
    return { item, name, meta, cat, sub, words: `${name} ${meta}`.split(" ") };
  });
}

function tokenScore(p: Prepared<unknown>, token: string): number {
  let best = 0;
  for (const s of stems(token)) {
    if (s.includes(" ")) { if (p.name.includes(s)) best = Math.max(best, 3); else if (p.meta.includes(s)) best = Math.max(best, 2); continue; }
    if (p.name.split(" ").some((w) => w.startsWith(s))) best = Math.max(best, 3);
    else if (p.meta.split(" ").some((w) => w.startsWith(s))) best = Math.max(best, 2);
    else if (s.length >= 4 && (p.name.includes(s) || p.meta.includes(s))) best = Math.max(best, 1.5);
  }
  if (!best && token.length >= 5 && p.words.some((w) => near(w, token))) best = 1;
  // Kategori/alt grup doğrudan aranan şeyse (ör. "esans" → Esans alt grubu) o ürünler öne çıksın
  if (best) {
    const hits = (field: string) => {
      const ws = field.split(" ").filter(Boolean);
      return stems(token).some((s) => ws.some((w) => w.startsWith(s))) || (token.length >= 5 && ws.some((w) => near(w, token)));
    };
    if (hits(p.sub)) best += 2.5;
    else if (hits(p.cat)) best += 1;
  }
  return best;
}

/** Sonuçlar alaka sırasına göre; her kelimeyi içerenler önce. */
export function searchProducts<T extends Searchable>(prepared: Prepared<T>[], query: string, limit = Infinity): T[] {
  const tokens = fold(query).split(" ").filter((t) => t.length >= 2 || /\d/.test(t));
  if (!tokens.length) return [];
  const scored = prepared
    .map((p, idx) => {
      const scores = tokens.map((t) => tokenScore(p, t));
      const hits = scores.filter(Boolean).length;
      const phrase = p.name.includes(tokens.join(" ")) ? 2 : 0;
      return { p, idx, hits, score: scores.reduce((a, b) => a + b, 0) + phrase };
    })
    .filter((r) => r.hits > 0);
  const all = scored.filter((r) => r.hits === tokens.length);
  const pool = all.length ? all : scored.filter((r) => r.hits >= Math.max(1, tokens.length - 1));
  return pool
    // eşit puanda kısa (daha öz) ad ve katalog sırası önce
    .sort((a, b) => b.score - a.score || a.p.name.length - b.p.name.length || a.idx - b.idx)
    .slice(0, limit)
    .map((r) => r.p.item);
}
