/** Yurt dışı toptan: proforma + kapora/bakiye takibi (Firestore `yurtdisi`, sadece admin). */
import { SELLER } from "@/lib/legal";
import { esc } from "@/lib/hazirlikCikti";

export type Para = "USD" | "EUR";
export type YDDurum = "teklif" | "kapora-bekleniyor" | "kapora-geldi" | "hazirlaniyor" | "bakiye-bekleniyor" | "sevk-edildi" | "iptal";

export const YD_DURUM: Record<YDDurum, string> = {
  "teklif": "Teklif verildi",
  "kapora-bekleniyor": "Kapora bekleniyor",
  "kapora-geldi": "Kapora geldi",
  "hazirlaniyor": "Hazırlanıyor",
  "bakiye-bekleniyor": "Bakiye bekleniyor",
  "sevk-edildi": "Sevk edildi",
  "iptal": "İptal",
};

export interface YDKalem { kod: string; aciklama: string; paket: string; adet: number; birim: number }
export interface YDOdeme { tarih: string; tutar: number; not?: string }
export interface YDMusteri { ad: string; firma?: string; ulke: string; tel?: string; eposta?: string; adres?: string }
export interface YDProforma {
  id: string;
  no: string;
  tarih: string; // YYYY-MM-DD
  musteri: YDMusteri;
  para: Para;
  kalemler: YDKalem[];
  kargo: number;
  kaporaYuzde: number;
  odemeler: YDOdeme[];
  durum: YDDurum;
  teslimSekli: string; // örn. "EXW Istanbul" / "DAP Dakar"
  not?: string;
  createdAt: number;
}

export const AYAR_ID = "_ayar";
export interface YDAyar { banka: string }

export const araToplam = (p: Pick<YDProforma, "kalemler">) => p.kalemler.reduce((s, k) => s + (Number(k.adet) || 0) * (Number(k.birim) || 0), 0);
export const genelToplam = (p: Pick<YDProforma, "kalemler" | "kargo">) => araToplam(p) + (Number(p.kargo) || 0);
export const kaporaTutari = (p: Pick<YDProforma, "kalemler" | "kargo" | "kaporaYuzde">) => Math.round(genelToplam(p) * (Number(p.kaporaYuzde) || 0)) / 100;
export const odenen = (p: Pick<YDProforma, "odemeler">) => p.odemeler.reduce((s, o) => s + (Number(o.tutar) || 0), 0);
export const kalan = (p: YDProforma) => Math.round((genelToplam(p) - odenen(p)) * 100) / 100;

export const para = (n: number, c: Para) =>
  (c === "USD" ? "$" : "€") + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Yeni proforma numarası: PI-2026-001 (yıl içinde sıra) */
export function yeniNo(mevcut: string[], yil = new Date().getFullYear()) {
  const on = `PI-${yil}-`;
  const max = mevcut.filter((n) => n.startsWith(on)).reduce((m, n) => Math.max(m, parseInt(n.slice(on.length)) || 0), 0);
  return on + String(max + 1).padStart(3, "0");
}

const tarihEn = (s: string) => {
  const d = new Date(s + "T12:00:00");
  return isNaN(+d) ? s : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

/** İngilizce proforma fatura gövdesi (yazdir() ile basılır) */
export function proformaHtml(p: YDProforma, ayar: YDAyar) {
  const m = p.musteri;
  const satirlar = p.kalemler
    .map(
      (k, i) => `<tr><td>${i + 1}</td><td>${esc(k.kod)}</td><td>${esc(k.aciklama)}</td><td>${esc(k.paket)}</td>
<td class="r">${k.adet}</td><td class="r">${para(k.birim, p.para)}</td><td class="r">${para(k.adet * k.birim, p.para)}</td></tr>`,
    )
    .join("");
  const od = odenen(p);
  return `
<div class="ust"><div><div class="marka">OBRNHOMEN</div><div class="k">Islamic gifts &amp; worship items · Istanbul, Türkiye</div></div>
<div class="sag"><h1>PROFORMA INVOICE</h1><div>No: <b>${esc(p.no)}</b></div><div>Date: ${esc(tarihEn(p.tarih))}</div><div class="k">Valid for 7 days</div></div></div>
<div class="iki">
 <div><h3>Seller</h3><b>${esc(SELLER.unvan || SELLER.marka)}</b> (${esc(SELLER.marka)})<br>${esc(SELLER.adres)}<br>Tel / WhatsApp: ${esc(SELLER.telefon.replace(/^0/, "+90 "))}<br>${esc(SELLER.eposta)}</div>
 <div><h3>Buyer</h3><b>${esc(m.firma || m.ad)}</b>${m.firma ? `<br>Attn: ${esc(m.ad)}` : ""}<br>${esc(m.adres || "")}${m.adres ? "<br>" : ""}${esc(m.ulke)}${m.tel ? `<br>Tel: ${esc(m.tel)}` : ""}${m.eposta ? `<br>${esc(m.eposta)}` : ""}</div>
</div>
<table><thead><tr><th>#</th><th>Code</th><th>Description</th><th>Pack</th><th class="r">Qty</th><th class="r">Unit price</th><th class="r">Amount</th></tr></thead><tbody>${satirlar}</tbody></table>
<table class="top"><tr><td>Subtotal</td><td class="r">${para(araToplam(p), p.para)}</td></tr>
<tr><td>Shipping${p.kargo ? "" : " (quoted separately)"}</td><td class="r">${p.kargo ? para(p.kargo, p.para) : "—"}</td></tr>
<tr class="b"><td>TOTAL (${p.para})</td><td class="r">${para(genelToplam(p), p.para)}</td></tr>
<tr><td>Deposit due now (${p.kaporaYuzde}%)</td><td class="r">${para(kaporaTutari(p), p.para)}</td></tr>
${od ? `<tr><td>Received</td><td class="r">− ${para(od, p.para)}</td></tr><tr class="b"><td>Balance due</td><td class="r">${para(kalan(p), p.para)}</td></tr>` : `<tr><td>Balance before shipment</td><td class="r">${para(genelToplam(p) - kaporaTutari(p), p.para)}</td></tr>`}
</table>
<h3>Terms</h3>
<ul>
<li>Delivery terms: ${esc(p.teslimSekli || "EXW Istanbul")}. Country of origin: Türkiye.</li>
<li>Preparation starts after the deposit is received. We send photos/video of your goods before dispatch; the balance is paid before shipment.</li>
<li>Colours may be mixed unless agreed otherwise. Commercial invoice and packing list are provided with the shipment.</li>
<li>Bank charges are paid by the buyer. Please write the proforma number (${esc(p.no)}) in the payment reference.</li>
</ul>
${p.not ? `<h3>Notes</h3><p>${esc(p.not).replace(/\n/g, "<br>")}</p>` : ""}
<h3>Payment details</h3><p class="banka">${ayar.banka ? esc(ayar.banka).replace(/\n/g, "<br>") : "<i>Bank details will be sent separately.</i>"}</p>
<p class="alt">Thank you for your order — OBRNHOMEN · www.obrnhomen.com</p>`;
}

export const PROFORMA_CSS = `
.ust{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #7a5c17;padding-bottom:4mm;margin-bottom:5mm}
.marka{font-family:Lora,serif;font-size:20pt;letter-spacing:5px;color:#7a5c17}.sag{text-align:right}.sag h1{font-size:16pt;letter-spacing:1px}
.iki{display:grid;grid-template-columns:1fr 1fr;gap:8mm;margin-bottom:3mm;font-size:10pt;line-height:1.5}
h3{font-family:Lora,serif;font-size:11pt;margin:5mm 0 1.5mm;color:#7a5c17}
.top{width:45%;margin-left:auto}.top td{border-bottom:1px solid #eee}.top .b td{font-weight:700;border-bottom:2px solid #333}
ul{padding-left:5mm;font-size:9.5pt;line-height:1.5}.banka{font-size:10pt;line-height:1.5}.alt{margin-top:8mm;text-align:center;color:#888;font-size:9pt}`;
