import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { sinirAsildi } from "@/lib/rateLimit";
import { CONTACT_EMAIL, PHONE_HREF } from "@/lib/storeNav";

/**
 * Yurt dışı toptan katalog talebi (/en/wholesale, /fr/grossiste):
 * 1) alıcıya seçtiği dilde 2 katalog PDF'i e-posta eki olarak gider (PDF'ler herkese açık değil: data/katalog),
 * 2) mağazaya (merhaba@ → Gmail) "yeni yurt dışı müşteri" bildirimi gider.
 */

const FROM = `OBRNHOMEN <${CONTACT_EMAIL}>`;
const WA = PHONE_HREF.replace("tel:+", "https://wa.me/");

const KATALOG = {
  en: [
    ["en-gift-sets.pdf", "OBRNHOMEN-Gift-Sets-Catalogue-2026.pdf"],
    ["en-single-items.pdf", "OBRNHOMEN-Single-Items-Catalogue-2026.pdf"],
  ],
  fr: [
    ["fr-coffrets.pdf", "OBRNHOMEN-Catalogue-Coffrets-2026.pdf"],
    ["fr-articles-unite.pdf", "OBRNHOMEN-Catalogue-Articles-Unite-2026.pdf"],
  ],
} as const;

const METIN = {
  en: {
    subject: "Your OBRNHOMEN wholesale catalogues",
    body: (ad: string) => `<p>Hello ${ad},</p>
<p>Thank you for your interest in OBRNHOMEN. Our two wholesale catalogues are attached:</p>
<ul><li><b>Gift Sets</b> – ready Ramadan, Eid, Hajj &amp; Umrah gift sets and boxes</li><li><b>Single Items</b> – prayer mats, tasbih, Qurans, attar, ihram and more</li></ul>
<p><b>How to order:</b> send us the product codes and quantities (e.g. A-01 x 5, C-02 x 20) and we reply with a quotation within 24 hours. No minimum total – the minimum is one pack per item.</p>
<p>Fastest reply on WhatsApp: <a href="${WA}">${WA.replace("https://", "")}</a></p>
<p>Best regards,<br>OBRNHOMEN – Istanbul<br><a href="https://www.obrnhomen.com/en">www.obrnhomen.com/en</a></p>`,
  },
  fr: {
    subject: "Vos catalogues grossiste OBRNHOMEN",
    body: (ad: string) => `<p>Bonjour ${ad},</p>
<p>Merci pour votre intérêt pour OBRNHOMEN. Vous trouverez nos deux catalogues grossiste en pièce jointe :</p>
<ul><li><b>Coffrets</b> – coffrets cadeaux Ramadan, Aïd, Hajj &amp; Omra</li><li><b>Articles à l'unité</b> – tapis de prière, tasbihs, Corans, parfums, ihram et plus</li></ul>
<p><b>Pour commander :</b> envoyez-nous les codes produits et les quantités (ex. A-01 x 5, C-02 x 20) et nous vous répondons avec un devis sous 24 heures. Pas de minimum total – le minimum est d'un lot par article.</p>
<p>Réponse la plus rapide sur WhatsApp : <a href="${WA}">${WA.replace("https://", "")}</a></p>
<p>Cordialement,<br>OBRNHOMEN – Istanbul<br><a href="https://www.obrnhomen.com/fr">www.obrnhomen.com/fr</a></p>`,
  },
};

const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const temiz = (v: unknown, max = 200) => String(v ?? "").trim().slice(0, max);

async function resend(key: string, payload: Record<string, unknown>) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, ...payload }),
    signal: AbortSignal.timeout(25000),
  });
  if (!r.ok) console.error("wholesale-lead Resend:", r.status, await r.text().catch(() => ""));
  return r.ok;
}

export async function POST(req: NextRequest) {
  if (sinirAsildi(req, "wholesale-lead", 3, 30 * 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (temiz(b.website)) return NextResponse.json({ ok: true }); // bal tuzağı (bot)

  const dil = b.dil === "fr" ? "fr" : "en";
  const ad = temiz(b.ad, 80);
  const eposta = temiz(b.eposta, 120);
  const ulke = temiz(b.ulke, 60);
  const firma = temiz(b.firma, 120);
  const whatsapp = temiz(b.whatsapp, 40);
  const tur = temiz(b.tur, 60);
  const mesaj = temiz(b.mesaj, 1000);

  if (!ad || !ulke || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eposta)) {
    return NextResponse.json(
      { error: dil === "fr" ? "Merci d'indiquer votre nom, votre pays et un e-mail valide." : "Please enter your name, country and a valid e-mail." },
      { status: 400 },
    );
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "E-mail service is not configured." }, { status: 500 });

  let ekler: { filename: string; content: string }[];
  try {
    ekler = await Promise.all(
      KATALOG[dil].map(async ([dosya, ad]) => ({
        filename: ad,
        content: (await readFile(path.join(process.cwd(), "data", "katalog", dosya))).toString("base64"),
      })),
    );
  } catch (e) {
    console.error("wholesale-lead katalog okunamadı:", e);
    return NextResponse.json({ error: "Catalogue temporarily unavailable — please contact us on WhatsApp." }, { status: 500 });
  }

  const alici = await resend(key, {
    to: eposta,
    reply_to: CONTACT_EMAIL,
    subject: METIN[dil].subject,
    html: METIN[dil].body(esc(ad)),
    attachments: ekler,
  });

  // Mağazaya bildirim (alıcı e-postası gitmese de gelsin)
  const satir = (k: string, v: string) => (v ? `<tr><td style="padding:3px 10px 3px 0;color:#666">${k}</td><td>${esc(v)}</td></tr>` : "");
  await resend(key, {
    to: CONTACT_EMAIL,
    reply_to: eposta,
    subject: `🌍 Yeni yurt dışı toptan müşteri: ${firma || ad} (${ulke})`,
    html: `<p>Siteden katalog istendi (${dil.toUpperCase()}). Katalog e-postası: <b>${alici ? "gönderildi ✅" : "GÖNDERİLEMEDİ ❌ — elle gönder"}</b></p>
<table>${satir("Ad", ad)}${satir("Firma", firma)}${satir("Ülke", ulke)}${satir("E-posta", eposta)}${satir("WhatsApp", whatsapp)}${satir("İş türü", tur)}${satir("Mesaj", mesaj)}</table>
<p>Takip: admin › Yurt Dışı'nda proforma aç · şablonlar: Masaüstü › Yurt Dışı Toptan › WhatsApp-Cevap-Sablonlari.txt</p>`,
  });

  if (!alici) {
    return NextResponse.json(
      { error: dil === "fr" ? "L'e-mail n'a pas pu être envoyé. Écrivez-nous sur WhatsApp." : "We couldn't send the e-mail. Please contact us on WhatsApp." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
