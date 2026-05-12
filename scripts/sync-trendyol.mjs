/**
 * Trendyol → data/products.json stok & fiyat senkronizasyonu
 *
 * Kullanım:
 *   node scripts/sync-trendyol.mjs
 *
 * Gereken ortam değişkenleri (.env.local veya shell export):
 *   TRENDYOL_SUPPLIER_ID   — Satıcı paneli > Hesap Bilgileri'ndeki mağaza ID'si
 *   TRENDYOL_API_KEY       — Entegrasyon > API Bilgileri'ndeki API Anahtarı
 *   TRENDYOL_API_SECRET    — Entegrasyon > API Bilgileri'ndeki API Gizli Anahtar
 *
 * Ne yapar:
 *   1. Trendyol'dan tüm onaylı ürünleri çeker (sayfalama otomatik)
 *   2. products.json içindeki her ürünü id (content ID) ile eşleştirir
 *   3. stock, inStock ve price alanlarını günceller
 *   4. Değişen ürün sayısını ve eşleşmeyen ID'leri raporlar
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

// ── ortam değişkenlerini .env.local'dan yükle (varsa) ──────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");

if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

// ── kimlik bilgileri ────────────────────────────────────────────────────────
const SUPPLIER_ID = process.env.TRENDYOL_SUPPLIER_ID;
const API_KEY     = process.env.TRENDYOL_API_KEY;
const API_SECRET  = process.env.TRENDYOL_API_SECRET;

if (!SUPPLIER_ID || !API_KEY || !API_SECRET) {
  console.error(`
HATA: Trendyol kimlik bilgileri eksik.

Lütfen .env.local dosyasına şu satırları ekleyin:

  TRENDYOL_SUPPLIER_ID=123456
  TRENDYOL_API_KEY=your-api-key
  TRENDYOL_API_SECRET=your-api-secret

Satıcı panelinizden: Hesabım → Entegrasyon Bilgileri → API Bilgileri
`);
  process.exit(1);
}

const BASE_URL = `https://api.trendyol.com/sapigw/suppliers/${SUPPLIER_ID}`;
const AUTH     = Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64");
const HEADERS  = {
  Authorization: `Basic ${AUTH}`,
  "User-Agent": `${SUPPLIER_ID} - SelfIntegration`,
  "Content-Type": "application/json",
  Accept: "application/json",
};

// ── PowerShell üzerinden GET (Cloudflare bypass) ─────────────────────────
function psGet(url) {
  const authVal = `Basic ${AUTH}`;
  const ua = `${SUPPLIER_ID} - SelfIntegration`;
  const cmd = `powershell -Command "` +
    `$h = @{ 'Authorization' = '${authVal}'; 'User-Agent' = '${ua}'; 'Content-Type' = 'application/json'; 'Accept' = 'application/json' }; ` +
    `(Invoke-WebRequest -Uri '${url}' -Headers $h -UseBasicParsing).Content"`;
  try {
    const out = execSync(cmd, { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 });
    return JSON.parse(out);
  } catch (e) {
    throw new Error("PowerShell GET hatası: " + e.message.slice(0, 300));
  }
}

// ── Trendyol'dan tüm ürünleri çek (sayfalama) ──────────────────────────────
async function fetchAllTrendyolProducts() {
  const allProducts = [];
  let page = 0;
  const size = 200;

  console.log("Trendyol'dan ürünler çekiliyor...");

  while (true) {
    const url = `${BASE_URL}/products?approved=true&page=${page}&size=${size}`;
    const data = psGet(url);
    const content = data.content ?? [];
    allProducts.push(...content);

    const totalPages = data.totalPages ?? 1;
    console.log(`  Sayfa ${page + 1}/${totalPages} — ${content.length} ürün`);

    if (page + 1 >= totalPages) break;
    page++;
  }

  console.log(`Toplam ${allProducts.length} Trendyol ürünü alındı.\n`);
  return allProducts;
}

// ── products.json güncelle ──────────────────────────────────────────────────
async function main() {
  const trendyolProducts = await fetchAllTrendyolProducts();

  // Trendyol ürünlerini content ID'ye göre indeksle
  const trendyolById = new Map();
  for (const tp of trendyolProducts) {
    // Trendyol API'de ürünün ana ID'si: tp.id veya tp.contentId
    const contentId = String(tp.id ?? tp.contentId ?? "");
    if (contentId) trendyolById.set(contentId, tp);
  }

  // products.json oku
  const productsPath = path.join(__dirname, "..", "data", "products.json");
  const raw = fs.readFileSync(productsPath, "utf8");
  const localProducts = JSON.parse(raw);

  let updated    = 0;
  let unchanged  = 0;
  const notFound = [];

  for (const product of localProducts) {
    const tp = trendyolById.get(String(product.id));

    if (!tp) {
      notFound.push(product.id);
      continue;
    }

    // Trendyol'daki mevcut stok ve fiyat
    const newStock   = tp.quantity ?? tp.stockQuantity ?? 0;
    const newInStock = newStock > 0;
    const newPrice   = tp.salePrice ?? tp.listPrice ?? product.price;

    const changed =
      product.stock   !== newStock   ||
      product.inStock !== newInStock ||
      Math.abs(product.price - newPrice) > 0.01;

    if (changed) {
      const diff = [];
      if (product.stock   !== newStock)   diff.push(`stok ${product.stock}→${newStock}`);
      if (product.inStock !== newInStock) diff.push(`inStock ${product.inStock}→${newInStock}`);
      if (Math.abs(product.price - newPrice) > 0.01) diff.push(`fiyat ${product.price}→${newPrice}`);

      console.log(`✓ [${product.id}] ${product.name.slice(0, 50)}`);
      console.log(`    ${diff.join(" | ")}`);

      product.stock   = newStock;
      product.inStock = newInStock;
      product.price   = newPrice;
      updated++;
    } else {
      unchanged++;
    }
  }

  // Güncellenmiş JSON yaz
  fs.writeFileSync(productsPath, JSON.stringify(localProducts, null, 2), "utf8");

  console.log("\n── Sonuç ──────────────────────────────────────");
  console.log(`  Güncellenen ürün : ${updated}`);
  console.log(`  Değişmeyen ürün  : ${unchanged}`);
  if (notFound.length > 0) {
    console.log(`  Trendyol'da bulunamayan ID'ler (${notFound.length}):`);
    for (const id of notFound) console.log(`    - ${id}`);
  }
  console.log("────────────────────────────────────────────────");
  console.log("data/products.json güncellendi.");
}

main().catch((err) => {
  console.error("Senkronizasyon hatası:", err.message);
  process.exit(1);
});
