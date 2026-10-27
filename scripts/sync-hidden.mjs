/**
 * Build öncesi: admin'in sitede sildiği ürünleri Firestore'dan (products/_site_hidden)
 * data/hidden.json'a yazar; lib/productCuration.ts bu listeyi HIDDEN_SLUGS'a ekler.
 * Ağ hatasında mevcut dosya korunur, build durmaz. (package.json "prebuild")
 */
import fs from "fs";

const OUT = new URL("../data/hidden.json", import.meta.url);
const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "obrnhomen-73ed9";
const URL_ = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/products/_site_hidden`;

try {
  const res = await fetch(URL_);
  if (res.status === 404) {
    fs.writeFileSync(OUT, "[]\n");
    console.log("sync-hidden: gizlenen ürün yok");
  } else if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  } else {
    const data = await res.json();
    const slugs = (data.fields?.slugs?.arrayValue?.values ?? []).map((v) => v.stringValue).filter(Boolean);
    fs.writeFileSync(OUT, JSON.stringify(slugs, null, 2) + "\n");
    console.log(`sync-hidden: ${slugs.length} gizlenen ürün`);
  }
} catch (e) {
  if (!fs.existsSync(OUT)) fs.writeFileSync(OUT, "[]\n");
  console.warn("sync-hidden: Firestore okunamadı, mevcut liste kullanılıyor —", e.message);
}
