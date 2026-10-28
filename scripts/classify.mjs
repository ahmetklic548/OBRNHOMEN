/**
 * Katalog düzenleyici — data/products.json'ı yerinde günceller:
 *  1. Kategori + alt grup: ürün ADINA göre, öncelik sıralı kurallarla (Trendyol kategorisine güvenilmez;
 *     ör. "12 Adet Takke" Trendyol'da Şapka/ihram altındaydı → Takke & Yüzük)
 *  2. Ürün kodu (sku): OBR-<KATEGORİ>-<SIRA>, data/sku-map.json'da kalıcı (ürün silinse de kod değişmez)
 *  3. Sıralama: menü sırası → alt grup görünme sırası → benzer ad → adet
 *  4. Tekrar/benzer ürün raporu: hafiza/benzer-urunler.md (--dedupe ile kesin tekrarları düşürür:
 *     aynı ilan → fiyatı yüksek olan kalır; kullanıcının kuralı)
 *
 * Kullanım: node scripts/classify.mjs [--dedupe]
 */
import fs from "fs";

const ROOT = new URL("..", import.meta.url);
const PRODUCTS = new URL("data/products.json", ROOT);
const SKU_MAP = new URL("data/sku-map.json", ROOT);
const REPORT = new URL("hafiza/benzer-urunler.md", ROOT);

export const fold = (s) => s.toLocaleLowerCase("tr-TR")
  .replace(/[ıi̇îí]/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g").replace(/[üû]/g, "u")
  .replace(/ö/g, "o").replace(/ç/g, "c").replace(/[âà]/g, "a").replace(/['’`]/g, "");

/** Kategori tanımları (menü sırası, ürün kodu öneki, alt gruplar, SEO) — site de aynı dosyayı kullanır */
export const CATEGORIES = JSON.parse(fs.readFileSync(new URL("data/categories.json", ROOT), "utf8"));

const ITEM_TYPES = [/tesbih|tespih/, /zikirmatik/, /yasin|cuz/, /kuran|kur an|mushaf/, /basortu|esarp|ortu|yazma/, /seccade/, /esans|misvak|takke/];
const typeCount = (t) => ITEM_TYPES.filter((re) => re.test(t)).length;

/** [kategori, alt grup, koşul] — ilk eşleşen kazanır */
function classify(name, prevCategory) {
  const t = fold(name).replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ");
  const kisi = t.match(/(\d{2,3})\s*kisilik/);
  if (kisi && !/zemzem|kahve|fincan/.test(t)) {
    const n = +kisi[1];
    return ["Hac Umre Kafile Setleri", n <= 25 ? "20 Kişilik Setler" : n < 50 ? "30–40 Kişilik Setler" : "50 Kişi ve Üzeri"];
  }
  if (/kafile|bol cesitli umre seti|umre seti/.test(t)) return ["Hac Umre Kafile Setleri", "50 Kişi ve Üzeri"];

  // Giyim (ad "namazlık" içerse de elbise)
  if (/namaz elbise|namaz kiyafet|ferace|jile|tesettur.*elbise/.test(t)) {
    return ["Namaz Elbisesi & Tesettür", /cift parca|iki parca|2 parca|etekli/.test(t) ? "Çift Parça Namaz Elbisesi" : "Tek Parça & Pratik Namaz Elbisesi"];
  }
  if (/\bbone\b|kolluk|boyunluk/.test(t)) return ["Namaz Elbisesi & Tesettür", "Bone & Kolluk"];

  // Çeyiz & bohça (seccade setleri dahil)
  if (/bohca seti|bohca takimi|bohcasi|bohcalik|gelin|damat|ceyizlik seccade|seccade seti|seccade takimi|ibadet seti|namaz seti|parcali ceyiz|cift seccade|seccade ve basortusu/.test(t) ||
      (/seccade/.test(t) && typeCount(t) >= 2)) {
    const sub = /gelin|damat|bohcasi|bohca seti/.test(t) && !/seccade seti/.test(t) ? "Gelin & Damat Bohçası"
      : /ibadet|namaz seti|elifba|cocuk|sesli/.test(t) ? "İbadet & Namaz Setleri"
      : /seccade/.test(t) ? "Seccade Setleri" : "Diğer Çeyiz Setleri";
    return ["Çeyiz & Bohça Setleri", sub];
  }

  // Hediyelik eşya
  if (/biblo|maket|zemzem|fincan/.test(t)) return ["Hediyelik Eşya & Dekor", "Dekor & Biblo"];
  if (/oyuncak|cocuk kolye|kamera/.test(t)) return ["Hediyelik Eşya & Dekor", "Çocuk Hediyelikleri"];
  if (/\bkina\b|kinasi/.test(t)) return ["Hediyelik Eşya & Dekor", "Kına & Diğer"];

  // Takke & yüzük
  if (/takke/.test(t)) return ["Takke & Yüzük", "Takke"];
  if (/yuzuk/.test(t) && !/zikirmatik|zikir/.test(t)) return ["Takke & Yüzük", "Yüzük"];

  // İhram & hac malzemeleri ("pudra" tek başına renk adı olabilir: "Pudra Pembe")
  if (/kemer/.test(t) && /ihram|hac|umre/.test(t)) return ["İhram & Hac Malzemeleri", "İhram Kemeri"];
  if (/kokusuz|ihram sabun/.test(t)) return ["İhram & Hac Malzemeleri", "Kokusuz Bakım"];
  if (/patik|corap|corab|atlet|ayakkabi/.test(t)) return ["İhram & Hac Malzemeleri", "Patik, Çorap & Atlet"];
  if (/ihram/.test(t)) return ["İhram & Hac Malzemeleri", /cocuk/.test(t) ? "Çocuk İhramı" : "Erkek İhram"];

  // Yayınevi Kur'anları (adında "Kur'an" geçmeyebilir)
  if (/yayin|mealli|tecvidli|okunuslu|bilgisayar hatli/.test(t) && !/tesbih|tespih|zikirmatik|yasin|cevsen|elif/.test(t)) {
    return ["Kur'an-ı Kerim", /meal|tefsir/.test(t) ? "Meal & Tefsir" : /cep/.test(t) ? "Cep Boy" : /hafiz/.test(t) ? "Hafız Boy"
      : /orta ?boy/.test(t) ? "Orta Boy" : /cami|rahle/.test(t) ? "Cami & Rahle Boy" : "Diğer Kur'an-ı Kerimler"];
  }

  // Hediyelik setler: birden fazla ürün tipi bir arada — "set"/"ve" ile birleştirilmiş olmalı
  // ("Dijital Tespih Zikirmatik" tek üründür, "Zikirmatik ve Tesbih Seti" settir)
  const isSetWord = /\bset|seti|setimix|takimi|paket/.test(t) || /(tesbih|tespih|zikirmatik|yasin|cuzu?|kuran|kerim|basortu|esarp|ortu|esans) ve /.test(t);
  const bookPlusTesbih = /yasin|cuz|kuran|kur an/.test(t) && /tesbih|tespih/.test(t);
  const hasGiftItem = /tesbih|tespih|zikirmatik|basortu|esarp|yazma|esans|seccade/.test(t); // sadece kitaplardan oluşan "30 cüz hatim seti" hediyelik set değildir
  if (typeCount(t) >= 2 && hasGiftItem && (isSetWord || bookPlusTesbih)) {
    const sub = /yasin|cuz/.test(t) ? "Yasin & Tesbih Setleri"
      : /kuran|kur an/.test(t) ? "Mini Kuran & Tesbih Setleri"
      : /basortu|esarp|ortu|yazma/.test(t) ? "Başörtü & Tesbih Setleri"
      : /zikirmatik/.test(t) ? "Zikirmatik & Tesbih Setleri" : "Diğer Hediyelik Setler";
    return ["Hediyelik Setler", sub];
  }

  // Misvak, esans, sürme
  if (/misvak|miswak|sewak|swak|sivak/.test(t)) return ["Misvak, Esans & Sürme", "Misvak"];
  if (/esans|parfum/.test(t)) return ["Misvak, Esans & Sürme", "Esans"];
  if (/surme|goz kalemi/.test(t)) return ["Misvak, Esans & Sürme", "Sürme"];

  // Kitaplar (elifba/yasin önce: "Kur'an Öğreniyorum Elifba" kitap)
  if (/elif ?ba|elifbasi|tecvid kaide|kartela|ilmihal|namaz hocasi|defter|ogreniyorum/.test(t)) return ["Yasin & Dini Kitaplar", "Elifba & Eğitim"];
  if (/cevsen|delail|\bdua|dualar|salavat|tesbihat|telkin|munacat/.test(t)) return ["Yasin & Dini Kitaplar", "Cevşen & Dua Kitapları"];
  if (/yasin|cuz/.test(t) && !/kuran|kur an/.test(t)) return ["Yasin & Dini Kitaplar", "Yasin & Cüz"];
  if (/kuran|kur an|mushaf|kerim/.test(t)) {
    const sub = /meal|tefsir|tercume/.test(t) ? "Meal & Tefsir"
      : /cep boy|cep boyu|kucuk boy|canta boy/.test(t) ? "Cep Boy"
      : /hafiz/.test(t) ? "Hafız Boy"
      : /orta boy/.test(t) ? "Orta Boy"
      : /cami boy|rahle|buyuk boy|iri yazi|30 cuz/.test(t) ? "Cami & Rahle Boy" : "Diğer Kur'an-ı Kerimler";
    return ["Kur'an-ı Kerim", sub];
  }
  if (/mevlid|ajanda|kalem|kitab/.test(t)) return ["Yasin & Dini Kitaplar", "Mevlid & Diğer Kitaplar"];

  // Zikirmatik & tesbih
  if (/zikirmatik|zikir say|sayac|dijital (tesbih|tespih)/.test(t)) {
    return ["Zikirmatik", /tasli|suslu|kristal|kalp|isikli|boncuk/.test(t) ? "Taşlı & Süslü Zikirmatik" : "Dijital Zikirmatik"];
  }
  if (/tesbih|tespih/.test(t)) {
    const sub = /erkek|kuka|kehribar|oltu|akik|arpa kesim|33/.test(t) ? "Kehribar, Kuka & Erkek Tesbih"
      : /tavaf|8 ?mm|minik/.test(t) ? "Tavaf & Dağıtmalık Tesbih"
      : /kristal/.test(t) ? "Kristal Tesbih"
      : /inci|cam/.test(t) ? "İnci & Cam Tesbih"
      : "Tavaf & Dağıtmalık Tesbih";
    return ["Tesbih", sub];
  }

  // Seccade
  if (/seccade|namazlik|secde/.test(t)) {
    const sub = /cep|seyahat|yolculuk/.test(t) ? "Cep & Seyahat Seccadesi"
      : /cocuk/.test(t) ? "Çocuk Seccadesi"
      : /goblen|simli/.test(t) ? "Simli Goblen Seccade"
      : /sonil|hali|dokuma|premium|makine/.test(t) ? "Şönil & Halı Seccade"
      : /kadife|tafta|pelus|welsoft|sipinger|battal/.test(t) ? "Kadife, Tafta & Peluş Seccade" : "Diğer Seccadeler";
    return ["Seccade", sub];
  }

  // Eşarp & örtü
  if (/esarp|yazma|tulbent|ortu|basortu|\bsal\b/.test(t)) {
    const sub = /oya|ortu|tulbent/.test(t) ? "Namaz & Mevlüt Örtüsü"
      : /dagitmalik|20 li|20li|\d+ adet/.test(t) ? "Dağıtmalık Yazma & Eşarp" : "Eşarp";
    return ["Eşarp, Yazma & Örtü", sub];
  }

  const fallback = CATEGORIES.find((c) => c.name === prevCategory) ?? CATEGORIES[0];
  return [fallback.name, fallback.subs[fallback.subs.length - 1]];
}

/** Benzer ad anahtarı: adet, renk eki ve dolgu kelimeleri olmadan ("Model 3" gibi model numaraları korunur) */
const STOP = new Set(["hac", "umre", "mevlut", "mevlit", "mevlid", "hediyelik", "hediye", "hediyesi", "dagitmalik", "ve", "icin", "ceyiz", "ceyizlik", "adet", "li", "lu", "lik", "luk", "seti", "set", "sunnet", "kutulu", "lux", "luks", "ozel"]);
const COLORS = new Set(["saks", "taba", "beyaz", "siyah", "kirmizi", "bordo", "mavi", "lacivert", "yesil", "sari", "gold", "altin", "gumus", "gri", "fume", "pembe", "mor", "lila", "krem", "bej", "kahve", "kahverengi", "vizon", "ekru", "turuncu", "turkuaz", "indigo", "fusya", "fosya", "pudra", "murdum", "haki", "zumrut", "acik", "koyu", "bebe", "petrol", "rose", "renkli", "karisik", "cok", "tek", "renk"]);
const tokens = (name, keepColorSuffix = false) => fold(keepColorSuffix ? name : name.replace(/\s+–\s+[^–]+$/, ""))
  .replace(/model\s*(\d+)/g, (_, n) => "model" + n.replace(/\d/g, (d) => "abcdefghij"[d])) // "Model 3" rakam temizliğinden korunur
  .replace(/\d+/g, " ")
  .replace(/[^a-z0-9 ]+/g, " ")
  .split(/\s+/).filter((w) => w.length > 1 && !STOP.has(w));
export function groupKey(name) {
  return tokens(name).filter((w) => !COLORS.has(w)).join(" ");
}
/** İki ad sadece renk kelimeleriyle ayrışıyorsa farklı renk varyantıdır, tekrar değildir */
const onlyColorDiff = (a, b) => {
  const A = new Set(tokens(a)), B = new Set(tokens(b));
  const diff = [...A].filter((x) => !B.has(x)).concat([...B].filter((x) => !A.has(x)));
  return diff.length > 0 && diff.every((w) => COLORS.has(w));
};
const jaccard = (a, b) => {
  const A = new Set(a.split(" ")), B = new Set(b.split(" "));
  const inter = [...A].filter((x) => B.has(x)).length;
  return inter / (A.size + B.size - inter || 1);
};

if (process.argv[1]?.endsWith("classify.mjs")) {
  let products = JSON.parse(fs.readFileSync(PRODUCTS, "utf8"));

  for (const p of products) [p.category, p.subcategory] = classify(p.name, p.category);

  // ── Tekrar / benzer ürün tespiti ──
  const exact = [], similar = [];
  const byCat = new Map();
  for (const p of products) (byCat.get(p.category) ?? byCat.set(p.category, []).get(p.category)).push(p);
  for (const list of byCat.values()) {
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
      const a = list[i], b = list[j];
      const sameColor = fold(a.color ?? "") === fold(b.color ?? "");
      const sameQty = (a.quantity ?? 1) === (b.quantity ?? 1);
      const sameImg = a.images[0] && a.images[0] === b.images[0];
      if (onlyColorDiff(a.name, b.name)) continue;
      const sim = jaccard(groupKey(a.name), groupKey(b.name));
      // Kesin tekrar: renk/desen kelimeleri DAHİL ad aynı (sadece barkod, noktalama, yazım farkı) ya da aynı kapak fotoğrafı
      const full = (n) => tokens(n, true).sort().join(" ");
      const sameTokens = full(a.name) === full(b.name);
      if ((sameTokens || (sameImg && sameColor)) && sameQty) exact.push([a, b, sim]);
      else if (sim >= 0.85 && sameColor && a.subcategory === b.subcategory) similar.push([a, b, sim]);
    }
  }

  let removed = [];
  if (process.argv.includes("--dedupe")) {
    const drop = new Set();
    for (const [a, b] of exact) {
      if (drop.has(a.id) || drop.has(b.id)) continue;
      const loser = a.price >= b.price ? b : a; // fiyatı yüksek olan kalır
      drop.add(loser.id);
      removed.push([loser, loser === a ? b : a]);
    }
    products = products.filter((p) => !drop.has(p.id));
  }

  // ── Ürün kodları (kalıcı) ──
  const skuMap = fs.existsSync(SKU_MAP) ? JSON.parse(fs.readFileSync(SKU_MAP, "utf8")) : {};
  const used = new Set(Object.values(skuMap));
  const next = {};
  for (const v of Object.values(skuMap)) {
    const [, code, n] = v.split("-");
    next[code] = Math.max(next[code] ?? 0, +n);
  }

  // ── Sıralama ──
  const catIdx = (c) => CATEGORIES.findIndex((x) => x.name === c);
  const subIdx = (p) => CATEGORIES[catIdx(p.category)].subs.indexOf(p.subcategory);
  products.sort((a, b) =>
    catIdx(a.category) - catIdx(b.category) || subIdx(a) - subIdx(b) ||
    groupKey(a.name).localeCompare(groupKey(b.name), "tr") || (a.quantity ?? 1) - (b.quantity ?? 1) || a.name.localeCompare(b.name, "tr"));

  for (const p of products) {
    const code = CATEGORIES[catIdx(p.category)].code;
    const existing = skuMap[p.id];
    if (existing && existing.split("-")[1] === code) { p.sku = existing; continue; }
    let sku;
    do { next[code] = (next[code] ?? 0) + 1; sku = `OBR-${code}-${String(next[code]).padStart(4, "0")}`; } while (used.has(sku));
    used.add(sku); skuMap[p.id] = sku; p.sku = sku;
  }

  fs.writeFileSync(PRODUCTS, JSON.stringify(products, null, 2));
  fs.writeFileSync(SKU_MAP, JSON.stringify(skuMap, null, 2));

  const line = (p) => `${p.sku ?? "—"} · ${p.name} · ${p.price} TL`;
  let md = `# Benzer / tekrar eden ürünler — ${new Date().toISOString().slice(0, 10)}\n\n`;
  if (removed.length) md += `## Kaldırılan kesin tekrarlar (${removed.length}) — fiyatı yüksek olan kaldı\n` + removed.map(([l, k]) => `- ✗ ${line(l)}\n  - kalan: ${line(k)}`).join("\n") + "\n\n";
  md += `## Benzer olabilecek ürünler (${similar.length}) — kontrol edin, gereksizse admin panelinden silin\n` +
    similar.sort((x, y) => y[2] - x[2]).map(([a, b, s]) => `- %${Math.round(s * 100)} benzer\n  - ${line(a)}\n  - ${line(b)}`).join("\n") + "\n";
  fs.writeFileSync(REPORT, md);
  // Admin "Benzer Ürünler" sayfası için (fotoğraflı, Sil düğmeli)
  fs.writeFileSync(new URL("data/similar.json", ROOT), JSON.stringify(
    similar.sort((x, y) => y[2] - x[2]).map(([a, b, s]) => ({ a: a.slug, b: b.slug, score: Math.round(s * 100) })), null, 2) + "\n");

  const stats = {};
  for (const p of products) (stats[p.category] ??= {})[p.subcategory] = (stats[p.category][p.subcategory] ?? 0) + 1;
  console.log(JSON.stringify(stats, null, 1));
  console.log(`ürün ${products.length} | kesin tekrar ${exact.length} | kaldırılan ${removed.length} | benzer ${similar.length}`);
}
