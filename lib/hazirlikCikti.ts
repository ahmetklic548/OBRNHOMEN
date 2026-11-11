"use client";

import { qtyText } from "@/lib/pack";
import { POSET_SLUG } from "@/lib/hediyePoseti";
import { CONTACT_PHONE_TEXT } from "@/lib/kafileToptan";

/**
 * Sipariş hazırlık çıktıları (admin): toplama listesi, paket fişleri, hediye kartları, koli bilgi kartı.
 * Hem Yol 1 kafile listeleri (admin/kafile-toptan) hem site siparişleri (admin/siparisler) kullanır.
 * Paketleme müşteride: koliye ürünler + kraft poşetler + isimli kartlar ayrı konur, bilgi kartı eklenir.
 */

export interface HazirlikKalem { slug: string; name: string; sku?: string; qty: number; pack?: number }
export interface HazirlikListe {
  orderId: string;
  name: string;
  phone?: string;
  /** Kartta yazacak isim (yoksa müşteri adı) */
  kartIsim?: string;
  /** Kartın alt satırı: "<grup> umre hatırası" — kafile adı */
  grupAd?: string;
  items: HazirlikKalem[];
}

const esc = (s: unknown) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const adet = (k: HazirlikKalem) => k.qty * (k.pack ?? 1);

/** Poşet adedi (siparişte varsa) */
export const posetSayisi = (l: HazirlikListe) => l.items.find((k) => k.slug === POSET_SLUG)?.qty ?? 0;
/** Kart sayısı = poşet adedi; poşet yoksa en çok alınan üründeki adet (kaç kişiye dağıtılacağı) */
export const kartSayisi = (l: HazirlikListe) => posetSayisi(l) || l.items.reduce((m, k) => Math.max(m, adet(k)), 0);

/** Site siparişindeki hediye notundan kart ismi ("Hediye kartı ismi: X") */
export const kartIsmiNottan = (not?: string) => {
  const m = /Hediye kartı ismi:\s*(.+)/i.exec(not ?? "");
  return m ? m[1].trim().slice(0, 60) : undefined;
};

function yazdir(baslik: string, govde: string, ekCss = "") {
  const w = window.open("", "_blank");
  if (!w) return alert("Açılır pencere engellendi — tarayıcıda bu siteye izin ver.");
  w.document.write(`<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>${esc(baslik)}</title>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,500&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0} body{font-family:Inter,sans-serif;color:#1d1d1f;padding:12mm;font-size:11pt}
h1{font-family:Lora,serif;font-size:18pt;margin-bottom:2mm} h2{font-family:Lora,serif;font-size:14pt;margin:5mm 0 2mm}
table{width:100%;border-collapse:collapse;margin-top:3mm} td,th{border-bottom:1px solid #ddd;padding:2mm 1.5mm;text-align:left;vertical-align:top}
th{font-size:9pt;color:#666;text-transform:uppercase;letter-spacing:.5px} .r{text-align:right} .k{color:#666;font-size:9.5pt}
.fis{page-break-after:always} .fis:last-child{page-break-after:auto} .kutu{display:inline-block;width:4mm;height:4mm;border:1px solid #333;margin-right:2mm;vertical-align:-0.5mm}
@media print{body{padding:0} @page{size:A4;margin:12mm}} ${ekCss}</style></head><body>${govde}
<script>document.fonts.ready.then(()=>setTimeout(()=>print(),300))</script></body></html>`);
  w.document.close();
}

/** Seçili siparişlerdeki tüm ürünler tek listede — toptancı alımı ve depodan toplama için */
export function toplamaListesi(baslik: string, listeler: HazirlikListe[]) {
  const m = new Map<string, { name: string; sku?: string; qty: number; pack?: number }>();
  listeler.forEach((l) => l.items.forEach((k) => {
    const x = m.get(k.slug) ?? { name: k.name, sku: k.sku, qty: 0, pack: k.pack };
    x.qty += k.qty;
    m.set(k.slug, x);
  }));
  const satirlar = [...m.values()].sort((a, b) => (a.sku ?? "").localeCompare(b.sku ?? ""));
  const kart = listeler.reduce((s, l) => s + kartSayisi(l), 0);
  yazdir(`Toplama listesi — ${baslik}`, `<h1>Toplama listesi — ${esc(baslik)}</h1>
    <p class="k">${listeler.length} sipariş · ${new Date().toLocaleDateString("tr-TR")}</p>
    <table><tr><th></th><th>Kod</th><th>Ürün</th><th class="r">Miktar</th></tr>
    ${satirlar.map((s) => `<tr><td><span class="kutu"></span></td><td>${esc(s.sku ?? "")}</td><td>${esc(s.name)}</td><td class="r"><b>${esc(qtyText(s.qty, s.pack))}</b></td></tr>`).join("")}
    <tr><td><span class="kutu"></span></td><td></td><td>Hediye kartı (isimli, ayrı basılır)</td><td class="r"><b>${kart} adet</b></td></tr>
    <tr><td><span class="kutu"></span></td><td></td><td>Koli bilgi kartı</td><td class="r"><b>${listeler.length} adet</b></td></tr></table>`);
}

/** Her sipariş için bir sayfa: içine girecekler, işaretle-koy */
export function paketFisleri(baslik: string, listeler: HazirlikListe[]) {
  yazdir(`Paket fişleri — ${baslik}`, listeler.map((l) => `<div class="fis">
    <h1>${esc(l.name)}</h1>
    <p class="k">${l.grupAd ? `${esc(l.grupAd)} · ` : ""}${esc(l.phone ?? "")} · ${esc(l.orderId)}${l.kartIsim ? ` · Kart: <b>${esc(l.kartIsim)}</b>` : ""}</p>
    <table><tr><th></th><th>Ürün</th><th class="r">Miktar</th></tr>
    ${l.items.map((k) => `<tr><td><span class="kutu"></span></td><td>${esc(k.name)}</td><td class="r"><b>${esc(qtyText(k.qty, k.pack))}</b></td></tr>`).join("")}
    <tr><td><span class="kutu"></span></td><td>Hediye kartı — “${esc(l.kartIsim || l.name)}”</td><td class="r"><b>${kartSayisi(l)} adet</b></td></tr>
    <tr><td><span class="kutu"></span></td><td>Koli bilgi kartı (“kendi zevkinize göre hazırlayın”)</td><td class="r"><b>1 adet</b></td></tr></table>
    <p class="k" style="margin-top:4mm">Ürünler, poşetler ve kartlar ayrı ayrı konur; paketlemeyi müşteri kendisi yapar.</p></div>`).join(""));
}

/** A4'e 10'lu dizili isimli hediye kartları (85×55 mm, kesim çizgili) */
export function hediyeKartlari(baslik: string, listeler: HazirlikListe[]) {
  const kartHtml = (isim: string, grup?: string) => `<div class="kart"><div class="cer"></div>
    <div class="b">Umreniz kabul olsun</div>
    <div class="t">Mübarek topraklardan getirdiğim bu hediye, dualarınızda beni de hatırlamanız içindir.</div>
    <div class="i">— ${esc(isim)}</div>
    <div class="a">${grup ? `${esc(grup)} umre hatırası · ` : ""}OBRNHOMEN</div></div>`;
  const hepsi = listeler.flatMap((l) => Array.from({ length: kartSayisi(l) }, () => kartHtml(l.kartIsim || l.name, l.grupAd)));
  const sayfalar: string[] = [];
  for (let i = 0; i < hepsi.length; i += 10) sayfalar.push(`<div class="sayfa">${hepsi.slice(i, i + 10).join("")}</div>`);
  yazdir(`Hediye kartları — ${baslik}`, sayfalar.join(""), `
    body{padding:0} @page{size:A4;margin:0}
    .sayfa{width:210mm;height:297mm;display:grid;grid-template-columns:repeat(2,85mm);grid-auto-rows:55mm;justify-content:center;align-content:center;page-break-after:always}
    .sayfa:last-child{page-break-after:auto}
    .kart{position:relative;background:#14392b;color:#f5efe0;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 7mm;outline:0.1mm dashed #bbb;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    .cer{position:absolute;inset:2.5mm;border:0.3mm solid #9a7a35;border-radius:1.5mm}
    .b{font-family:Lora,serif;font-weight:600;font-size:13pt;color:#c9a24a}
    .t{font-family:Lora,serif;font-style:italic;font-size:7pt;line-height:1.4;color:#ddd5c0;margin-top:1.2mm}
    .i{font-family:Lora,serif;font-style:italic;font-size:10pt;margin-top:2mm}
    .a{position:absolute;bottom:4.5mm;left:0;right:0;font-size:5.8pt;letter-spacing:.6px;color:#c9b98a}`);
}

/** Koliye konan bilgi kartı (A4'e 2'li A5): poşet ve kartlar size bırakıldı, kendi zevkinize göre hazırlayın */
export function koliBilgiKartlari(listeler: HazirlikListe[]) {
  const kart = (l: HazirlikListe) => {
    const p = posetSayisi(l);
    const k = kartSayisi(l);
    return `<div class="a5"><div class="cer"></div>
      <div class="ust">OBRNHOMEN</div>
      <div class="bas">Hediyelerinizi kendi zevkinize göre hazırlayın</div>
      <p>Değerli ${esc(l.name)},</p>
      <p>Kolinizde hediyelikleriniz${p ? `, <b>${p} kraft hediye poşeti</b>` : ""} ve adınızın yazdığı <b>${k} hediye kartı</b> var.
      Poşetleri ve kartları bilerek ayrı koyduk: hangi hediyeyi kime, nasıl vereceğinizi en iyi siz bilirsiniz.
      Dilediğiniz gibi eşleştirin, süsleyin, kendi tarzınızla hazırlayın.</p>
      <p class="dua">Rabbim umrenizi kabul etsin, dağıttığınız her hediye hayırla anılsın.</p>
      <p class="alt">Eksik ya da hasarlı bir şey olursa WhatsApp: ${CONTACT_PHONE_TEXT} · obrnhomen.com</p></div>`;
  };
  const sayfalar: string[] = [];
  for (let i = 0; i < listeler.length; i += 2) sayfalar.push(`<div class="sayfa">${listeler.slice(i, i + 2).map(kart).join("")}</div>`);
  yazdir("Koli bilgi kartları", sayfalar.join(""), `
    body{padding:0} @page{size:A4;margin:0}
    .sayfa{width:210mm;height:297mm;display:flex;flex-direction:column;page-break-after:always}
    .sayfa:last-child{page-break-after:auto}
    .a5{position:relative;height:148.5mm;padding:20mm 22mm;background:#faf6ec;border-bottom:0.1mm dashed #bbb;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    .cer{position:absolute;inset:8mm;border:0.4mm solid #c9a24a;border-radius:3mm}
    .ust{font-family:Lora,serif;letter-spacing:4px;color:#9a7a35;font-size:10pt}
    .bas{font-family:Lora,serif;font-weight:700;color:#14392b;font-size:19pt;line-height:1.2;margin:4mm 0 5mm}
    .a5 p{font-size:11pt;line-height:1.6;color:#3d4a42;margin-bottom:3mm;position:relative}
    .dua{font-family:Lora,serif;font-style:italic;color:#14392b}
    .alt{position:absolute !important;left:22mm;right:22mm;bottom:14mm;font-size:8.5pt !important;color:#8a8572 !important}`);
}
