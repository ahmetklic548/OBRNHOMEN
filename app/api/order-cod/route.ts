import { NextRequest, NextResponse } from "next/server";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { computeOrder, readCustomer } from "@/lib/order";

/**
 * Kapıda ödemeli sipariş. Tutar sunucuda hesaplanır (+70 ₺ kapıda ödeme bedeli).
 * Sipariş müşterinin son adımda gönderdiği WhatsApp mesajıyla kesinleşir; Firestore kaydı
 * admin paneli için en iyi çaba ile yazılır (yazılamazsa sipariş WhatsApp'ta yine eksiksizdir).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const customer = readCustomer(body);
    if (!customer.name || !customer.phone || !customer.address) {
      return NextResponse.json({ error: "Lütfen ad, telefon ve adres bilgilerini doldurun." }, { status: 400 });
    }

    const order = await computeOrder(body.items, body.coupon, true);
    if ("error" in order) return NextResponse.json({ error: order.error }, { status: 400 });

    const orderId = `KO${Date.now()}`;
    let saved = false;
    if (db) {
      try {
        await setDoc(doc(db, "siparisler", orderId), {
          orderId,
          ...customer,
          items: order.lines,
          total: order.total,
          beklenenTutar: order.total,
          coupon: order.coupon,
          codFee: order.codFee,
          shipping: order.shipping,
          paymentMethod: "kapida-odeme",
          status: "kapida-odeme",
          paidAt: Date.now(),
        });
        saved = true;
      } catch (err) {
        console.error("Kapıda ödeme siparişi Firestore'a yazılamadı:", err);
      }
    }

    return NextResponse.json({ orderId, saved, ...order });
  } catch (err) {
    console.error("Kapıda ödeme hatası:", err);
    return NextResponse.json({ error: "Sunucu hatası. Lütfen tekrar deneyin ya da WhatsApp'tan yazın." }, { status: 500 });
  }
}
