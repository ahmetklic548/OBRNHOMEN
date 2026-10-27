/**
 * Ürünlere alt grup (subcategory) atar — benzer ürünler listede yan yana dursun,
 * kategori sayfasında alt grup filtresi çıksın. Kurallar sırayla denenir, ilk eşleşen kazanır.
 * Kullanım: node scripts/subcategories.mjs   (data/products.json'ı yerinde günceller)
 */
import fs from "fs";

const fold = (s) => s.toLocaleLowerCase("tr-TR")
  .replace(/[ıi̇]/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ü/g, "u")
  .replace(/ö/g, "o").replace(/ç/g, "c").replace(/[âà]/g, "a").replace(/î/g, "i").replace(/û/g, "u");

export const RULES = {
  "Kuran & Dini Kitaplar": [
    ["Yasin & Cüz", /yasin|cuz(u|leri)?\b|munacat/],
    ["Cevşen & Dua Kitapları", /cevsen|delail|dua|salavat|tesbihat|telkin/],
    ["Elifba & Eğitim", /elif ?ba|elifbasi|tecvid kaide|kartela|namaz hocasi|ilmihal|defter/],
    ["Kur'an-ı Kerim – Meal & Tefsir", /meal|tefsir|tercume/],
    ["Kur'an-ı Kerim – Cep Boy", /cep boy|cep boyu|kucuk boy/],
    ["Kur'an-ı Kerim – Hafız Boy", /hafiz/],
    ["Kur'an-ı Kerim – Orta Boy", /orta boy/],
    ["Kur'an-ı Kerim – Cami & Rahle Boy", /cami boy|rahle|buyuk boy|iri yazi|30 cuz/],
    ["Kur'an-ı Kerim – Diğer", /kur.?an|kuran|mushaf/],
    ["Mevlid & Diğer Kitaplar", /./],
  ],
  "Seccade": [
    ["Hac Umre Kafile Setleri", /kisilik|kafile/],
    ["Çeyiz, Bohça & İbadet Setleri", /bohca|gelin|damat|ibadet seti|namaz seti|seccade seti|set\b|seti|parca|tesbih|yasin|paket/],
    ["Cep & Seyahat Seccadesi", /cep|seyahat|yolculuk/],
    ["Çocuk Seccadesi", /cocuk/],
    ["Simli Goblen Seccade", /goblen|simli/],
    ["Şönil & Halı Seccade", /sonil|hali|dokuma|premium|makine/],
    ["Kadife, Tafta & Peluş Seccade", /kadife|tafta|pelus|welsoft|sipinger|battal/],
    ["Diğer Seccadeler", /./],
  ],
  "Tesbih & Zikirmatik": [
    ["Zikirmatik", /zikirmatik|zikir say|sayac|dijital/],
    ["Tesbih Setleri", /set|yasin|basortu|esans|kutulu/],
    ["Kehribar, Kuka & Erkek Tesbih", /erkek|kuka|kehribar|oltu|akik|arpa kesim|33/],
    ["Kristal Tesbih", /kristal/],
    ["İnci & Cam Tesbih", /inci|cam/],
    ["Tavaf & Dağıtmalık Tesbih", /./],
  ],
  "Hediyelik Setler": [
    ["Hac Umre Kafile Setleri", /kisilik|kafile|umre seti|hac umre hediyelik seti|ravza/],
    ["Yasin & Tesbih Setleri", /yasin|cuz/],
    ["Mini Kuran Setleri", /mini kuran|mikro|kuran/],
    ["Tesbih & Zikirmatik Setleri", /tesbih|zikirmatik/],
    ["Dekor & Biblo", /biblo|maket|kabe|zemzem|fincan/],
    ["Çocuk Hediyelikleri", /cocuk|oyuncak|bileklik|kolye/],
    ["Diğer Hediyelikler", /./],
  ],
  "Namaz Elbisesi & Tesettür": [
    ["Çift Parça Namaz Elbisesi", /cift parca|iki parca|2 parca|etekli/],
    ["Tek Parça & Pratik Namaz Elbisesi", /tek parca|pratik|kendinden/],
    ["Bone & Kolluk", /bone|kolluk|boyunluk/],
    ["Diğer", /./],
  ],
  "Eşarp & Örtü": [
    ["Namaz & Mevlüt Örtüsü", /oya|ortu|tulbent/],
    ["Dağıtmalık Yazma & Eşarp", /dagitmalik|yazma|20.?li|10 adet/],
    ["Eşarp", /./],
  ],
  "İhram & Hac Umre": [
    ["İhram Kemeri", /kemer/],
    ["Kokusuz Bakım", /sabun|pudra/],
    ["Takke, Patik & Aksesuar", /takke|patik|ayakkabi|corap|atlet/],
    ["Çocuk İhramı", /cocuk/],
    ["Erkek İhram", /./],
  ],
  "Misvak, Esans & Sürme": [
    ["Misvak", /misvak|miswak|sewak|swak/],
    ["Esans", /esans|parfum/],
    ["Sürme", /surme|goz kalemi/],
    ["Diğer", /./],
  ],
};

/** Listede görünme sırası (eşleştirme sırasından farklı: önce tekli ürünler, setler sonra) */
export const DISPLAY_ORDER = {
  "Kuran & Dini Kitaplar": ["Kur'an-ı Kerim – Cep Boy", "Kur'an-ı Kerim – Orta Boy", "Kur'an-ı Kerim – Hafız Boy", "Kur'an-ı Kerim – Cami & Rahle Boy", "Kur'an-ı Kerim – Meal & Tefsir", "Kur'an-ı Kerim – Diğer", "Yasin & Cüz", "Cevşen & Dua Kitapları", "Elifba & Eğitim", "Mevlid & Diğer Kitaplar"],
  "Seccade": ["Kadife, Tafta & Peluş Seccade", "Simli Goblen Seccade", "Şönil & Halı Seccade", "Cep & Seyahat Seccadesi", "Çocuk Seccadesi", "Diğer Seccadeler", "Çeyiz, Bohça & İbadet Setleri", "Hac Umre Kafile Setleri"],
  "Tesbih & Zikirmatik": ["İnci & Cam Tesbih", "Kristal Tesbih", "Kehribar, Kuka & Erkek Tesbih", "Tavaf & Dağıtmalık Tesbih", "Zikirmatik", "Tesbih Setleri"],
  "Hediyelik Setler": ["Yasin & Tesbih Setleri", "Mini Kuran Setleri", "Tesbih & Zikirmatik Setleri", "Dekor & Biblo", "Çocuk Hediyelikleri", "Diğer Hediyelikler", "Hac Umre Kafile Setleri"],
  "İhram & Hac Umre": ["Erkek İhram", "Çocuk İhramı", "İhram Kemeri", "Kokusuz Bakım", "Takke, Patik & Aksesuar"],
};
const rank = (cat, sub) => {
  const order = DISPLAY_ORDER[cat] ?? (RULES[cat] ?? []).map(([l]) => l);
  const i = order.indexOf(sub);
  return i === -1 ? 999 : i;
};

export function subcategoryOf(p) {
  const t = fold(p.name);
  for (const [label, re] of RULES[p.category] ?? []) if (re.test(t)) return label;
  return "Diğer";
}

/** Sıralama anahtarı: adetten ve renkten arındırılmış ad → aynı ürünün renkleri yan yana */
export function groupKey(p) {
  return fold(p.name)
    .replace(/\s+–\s+[^–]+$/, "")                 // " – Renk" eki
    .replace(/^\s*\d{1,4}\s*(adet|adett|'?\s*l[iu]|'?\s*lu|li|lu)\b\s*/, "")
    .replace(/\b\d{1,4}\s*adet\b/g, "")
    .replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

if (process.argv[1]?.endsWith("subcategories.mjs")) {
  const file = new URL("../data/products.json", import.meta.url);
  const products = JSON.parse(fs.readFileSync(file, "utf8"));
  // Menüdeki sırayla aynı
  const catOrder = ["Hediyelik Setler", "Kuran & Dini Kitaplar", "Seccade", "Tesbih & Zikirmatik", "Namaz Elbisesi & Tesettür", "Eşarp & Örtü", "İhram & Hac Umre", "Misvak, Esans & Sürme"];
  for (const p of products) p.subcategory = subcategoryOf(p);
  products.sort((a, b) => {
    const ca = catOrder.indexOf(a.category), cb = catOrder.indexOf(b.category);
    if (ca !== cb) return ca - cb;
    const sa = rank(a.category, a.subcategory);
    const sb = rank(b.category, b.subcategory);
    if (sa !== sb) return sa - sb;
    return groupKey(a).localeCompare(groupKey(b), "tr") || (a.quantity ?? 1) - (b.quantity ?? 1) || a.name.localeCompare(b.name, "tr");
  });
  fs.writeFileSync(file, JSON.stringify(products, null, 2));
  const stats = {};
  for (const p of products) (stats[p.category] ??= {})[p.subcategory] = (stats[p.category][p.subcategory] ?? 0) + 1;
  console.log(JSON.stringify(stats, null, 1));
}
