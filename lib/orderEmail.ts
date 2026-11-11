import { qtyText } from "@/lib/pack";
import { CONTACT_EMAIL, PHONE_DISPLAY, WHATSAPP_URL } from "@/lib/storeNav";

/**
 * Sipariş e-postaları (Resend). WhatsApp'ın yanında ikinci kanal:
 *  1) Mağazaya: her sipariş (kart + kapıda) — ORDER_NOTIFY_EMAIL (varsayılan destek Gmail'i)
 *  2) Müşteriye: sipariş onayı (e-posta verdiyse)
 * RESEND_API_KEY yoksa sessizce atlanır; e-posta hatası siparişi asla bozmaz.
 */

const FROM = `OBRNHOMEN <${CONTACT_EMAIL}>`;
const NOTIFY_TO = process.env.ORDER_NOTIFY_EMAIL || "obrnhomen.destek@gmail.com";
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.obrnhomen.com";

export interface OrderEmailData {
  orderId: string;
  method: "kart" | "kapida";
  name: string;
  email?: string;
  phone: string;
  address: string;
  lines: { name: string; sku?: string; qty: number; price: number; pack?: number }[];
  shipping: number;
  codFee?: number;
  discountAmount?: number;
  coupon?: string | null;
  ortak?: { ad: string; komisyonTutari: number } | null;
  total: number;
  giftWrap?: boolean;
  giftNote?: string;
  /** Kartlı ödemede PayTR tutarı ile sitenin hesabı uyuşmadıysa false */
  tutarUyumlu?: boolean | null;
}

const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const tl = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₺";
const validEmail = (e?: string) => !!e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

async function send(payload: { to: string; subject: string; html: string; reply_to?: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, ...payload }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) console.error("Resend hata:", r.status, await r.text().catch(() => ""));
    return r.ok;
  } catch (err) {
    console.error("Resend gönderilemedi:", err);
    return false;
  }
}

function tablo(o: OrderEmailData) {
  const satir = (sol: string, sag: string, renk = "#333") =>
    `<tr><td style="padding:4px 0;color:${renk}">${sol}</td><td style="padding:4px 0;text-align:right;color:${renk}">${sag}</td></tr>`;
  const urunler = o.lines
    .map((l) => satir(`${esc(l.name)}${l.sku ? ` <span style="color:#999">(${esc(l.sku)})</span>` : ""}<br><span style="color:#888;font-size:13px">${esc(qtyText(l.qty, l.pack))}</span>`, tl(l.price * l.qty)))
    .join("");
  return `<table style="width:100%;border-collapse:collapse;font-size:14px">${urunler}
    <tr><td colspan="2" style="border-top:1px solid #eee;padding-top:6px"></td></tr>
    ${o.discountAmount ? satir(`İndirim${o.coupon ? ` (${esc(o.coupon)})` : ""}`, "-" + tl(o.discountAmount), "#16a34a") : ""}
    ${satir("Kargo", o.shipping ? tl(o.shipping) : "Ücretsiz")}
    ${o.codFee ? satir("Kapıda ödeme bedeli", tl(o.codFee)) : ""}
    ${satir("<b>Toplam</b>", `<b>${tl(o.total)}</b>`, "#111")}
  </table>`;
}

const kutu = (icerik: string) => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#f6f4ef;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px">
    <div style="text-align:center;font-size:20px;letter-spacing:3px;color:#9a7a2c;font-weight:bold;margin-bottom:16px">OBRNHOMEN</div>
    <div style="background:#fff;border:1px solid #eee;padding:24px;color:#333;line-height:1.5">${icerik}</div>
    <p style="text-align:center;color:#999;font-size:12px;margin-top:16px">${esc(CONTACT_EMAIL)} · WhatsApp ${esc(PHONE_DISPLAY)} · <a href="${SITE}" style="color:#9a7a2c">obrnhomen.com</a></p>
  </div></body></html>`;

/** Mağaza sahibine bildirim */
function magazaMaili(o: OrderEmailData) {
  const yontem = o.method === "kart" ? "KARTLA ÖDENDİ" : "KAPIDA ÖDEME — WhatsApp onayı bekleniyor";
  const uyari =
    o.tutarUyumlu === false
      ? `<p style="background:#fee2e2;color:#991b1b;padding:10px">⚠️ PayTR'nin tahsil ettiği tutar sitenin hesabıyla uyuşmuyor. Admin panelinden kontrol et.</p>`
      : "";
  return {
    to: NOTIFY_TO,
    subject: `🛒 Yeni sipariş ${o.orderId} — ${tl(o.total)} (${o.method === "kart" ? "kart" : "kapıda"})`,
    reply_to: validEmail(o.email) ? o.email : undefined,
    html: kutu(`
      <h2 style="margin:0 0 4px;font-size:18px">Yeni sipariş: ${esc(o.orderId)}</h2>
      <p style="margin:0 0 16px;color:${o.method === "kart" ? "#16a34a" : "#b45309"};font-weight:bold">${yontem}</p>
      ${uyari}
      ${tablo(o)}
      <h3 style="font-size:15px;margin:20px 0 6px">Müşteri</h3>
      <p style="margin:0">${esc(o.name)}<br>
        Tel: <a href="tel:${esc(o.phone)}">${esc(o.phone)}</a>
        · <a href="https://wa.me/${esc(o.phone.replace(/\D/g, "").replace(/^0/, "90"))}">WhatsApp'tan yaz</a><br>
        ${validEmail(o.email) ? `E-posta: ${esc(o.email)}<br>` : ""}
        Adres: ${esc(o.address)}</p>
      ${o.giftWrap ? `<p>🎁 <b>Hediye paketi yapılsın</b>${o.giftNote ? `<br>Not: ${esc(o.giftNote)}` : ""}</p>` : ""}
      ${o.ortak ? `<p>🤝 Ortak: <b>${esc(o.ortak.ad)}</b> — komisyon ${tl(o.ortak.komisyonTutari)}</p>` : ""}
      <p style="margin-top:20px"><a href="${SITE}/admin/siparisler" style="background:#111;color:#fff;padding:10px 16px;text-decoration:none">Admin'de aç</a></p>
    `),
  };
}

/** Müşteriye sipariş onayı */
function musteriMaili(o: OrderEmailData) {
  const ilk = esc(o.name.split(" ")[0] || "");
  const kapida = o.method === "kapida";
  return {
    to: o.email!,
    reply_to: CONTACT_EMAIL,
    subject: `Siparişiniz alındı — ${o.orderId}`,
    html: kutu(`
      <h2 style="margin:0 0 8px;font-size:18px">Teşekkürler${ilk ? ` ${ilk}` : ""}, siparişiniz alındı 🌙</h2>
      <p style="margin:0 0 16px">Sipariş no: <b>${esc(o.orderId)}</b><br>
        ${kapida
          ? `Ödeme: <b>kapıda ödeme</b> (${tl(o.total)} teslimatta ödenecek).`
          : `Ödemeniz kartla alındı.`}</p>
      ${kapida
        ? `<p style="background:#fef3c7;padding:10px">Siparişiniz WhatsApp onayınızla kesinleşir. Onay mesajını göndermediyseniz
           <a href="${WHATSAPP_URL}?text=${encodeURIComponent(`Merhaba, kapıda ödemeli siparişimi onaylıyorum. Sipariş no: ${o.orderId}`)}" style="color:#9a7a2c;font-weight:bold">buradan WhatsApp'tan onaylayın</a>.</p>`
        : ""}
      ${tablo(o)}
      <h3 style="font-size:15px;margin:20px 0 6px">Teslimat adresi</h3>
      <p style="margin:0">${esc(o.name)}<br>${esc(o.address)}<br>${esc(o.phone)}</p>
      ${o.giftWrap ? `<p>🎁 Hediye paketi yapılacak.</p>` : ""}
      <p style="margin-top:20px">Siparişiniz hazırlanıp kargoya verildiğinde takip numaranızı ileteceğiz.
        Sorunuz olursa bu e-postayı yanıtlayabilir ya da WhatsApp'tan (${esc(PHONE_DISPLAY)}) yazabilirsiniz.</p>
      <p style="color:#888;font-size:13px">14 gün içinde ücretsiz iade: <a href="${SITE}/returns" style="color:#9a7a2c">iade koşulları</a></p>
    `),
  };
}

/** İki e-postayı paralel gönderir; hiçbir durumda hata fırlatmaz */
export async function sendOrderEmails(o: OrderEmailData): Promise<{ magaza: boolean; musteri: boolean }> {
  const [m, c] = await Promise.allSettled([
    send(magazaMaili(o)),
    validEmail(o.email) ? send(musteriMaili(o)) : Promise.resolve(false),
  ]);
  return { magaza: m.status === "fulfilled" && m.value, musteri: c.status === "fulfilled" && c.value };
}

/** Mağazaya serbest bildirim (ör. yeni kafile listesi). Hata fırlatmaz. */
export async function sendStoreNotice(subject: string, html: string): Promise<boolean> {
  return send({ to: NOTIFY_TO, subject, html });
}
