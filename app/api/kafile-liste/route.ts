import { NextRequest, NextResponse } from "next/server";
import { setDocRest } from "@/lib/firestoreRest";
import { computeOrder } from "@/lib/order";
import { ortakBilgi } from "@/lib/partners";
import { kafileTutari } from "@/lib/kafileToptan";
import { indirimsizTutar } from "@/lib/pricing";
import { sendStoreNotice } from "@/lib/orderEmail";

/**
 * Yol 1 (kafile satar): umrecinin hediyelik listesi. Ödeme yok — umreci kafileye öder,
 * kafile listeleri toplayıp tek sipariş olarak onaylar (admin/kafile-toptan).
 * Kayıt siparisler koleksiyonuna paymentMethod "kafile-toptan" ile yazılır (sitenin sipariş kaydı yetkisiyle).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
    const name = str(body.name, 120);
    const phone = str(body.phone, 40);
    const kartIsim = str(body.kartIsim, 60);
    if (!name || phone.replace(/\D/g, "").length < 10) {
      return NextResponse.json({ error: "Lütfen adınızı ve telefon numaranızı yazın." }, { status: 400 });
    }
    const kafile = await ortakBilgi(body.kafile);
    if (!kafile || kafile.model !== "toptan") {
      return NextResponse.json({ error: "Kafile kodu bulunamadı. Linki kafilenizden tekrar isteyin." }, { status: 400 });
    }
    const order = await computeOrder(body.items, null, false);
    if ("error" in order) return NextResponse.json({ error: order.error }, { status: 400 });

    const listeNo = `KL${Date.now()}`;
    const siteTutari = order.subtotal;
    const indirimsiz = indirimsizTutar(order.lines);
    const kafileT = kafileTutari(siteTutari, indirimsiz);
    const saved = await setDocRest(`siparisler/${listeNo}`, {
      orderId: listeNo,
      name,
      phone,
      email: "",
      address: "",
      kartIsim,
      items: order.lines,
      total: siteTutari,
      kafileTutari: kafileT,
      kafile: { kod: kafile.kod, ad: kafile.ad },
      paymentMethod: "kafile-toptan",
      status: "yeni",
      paidAt: Date.now(),
    });

    const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
    await sendStoreNotice(
      `Yeni kafile listesi: ${kafile.ad} — ${name}`,
      `<p><b>${esc(kafile.ad)}</b> (${kafile.kod}) umrecisi <b>${esc(name)}</b> (${esc(phone)}) liste gönderdi.</p>
       <ul>${order.lines.map((l) => `<li>${esc(l.name)} — ${l.qty}${l.pack ? ` paket (${l.qty * l.pack} adet)` : " adet"}</li>`).join("")}</ul>
       <p>Site tutarı ${siteTutari.toLocaleString("tr-TR")} ₺ · kafile tutarı ${kafileT.toLocaleString("tr-TR")} ₺${kartIsim ? ` · kart: ${esc(kartIsim)}` : ""}</p>
       <p>Liste no ${listeNo} — Admin › Kafile Toptan</p>`,
    );
    return NextResponse.json({ listeNo, saved, siteTutari });
  } catch (err) {
    console.error("Kafile listesi hatası:", err);
    return NextResponse.json({ error: "Sunucu hatası. Lütfen tekrar deneyin ya da WhatsApp'tan yazın." }, { status: 500 });
  }
}
