import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const params = new URLSearchParams(body);

    const merchant_oid  = params.get("merchant_oid") ?? "";
    const status        = params.get("status") ?? "";
    const total_amount  = params.get("total_amount") ?? "";
    const hash          = params.get("hash") ?? "";

    const merchant_key  = process.env.PAYTR_MERCHANT_KEY!;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT!;

    /* Hash doğrula */
    const hash_str = merchant_oid + merchant_salt + status + total_amount;
    const expected = crypto
      .createHmac("sha256", merchant_key)
      .update(hash_str)
      .digest("base64");

    if (expected !== hash) {
      console.error("PayTR notify: hash uyuşmuyor");
      return new NextResponse("PAYTR_HASH_MISMATCH", { status: 400 });
    }

    if (status === "success") {
      // SMS bildirimi gönder (arka planda, hata olsa da devam et)
      // PayTR bildirimi telefon/isim döndürmüyor; checkout anında saklanan kaydı okuyoruz.
      if (db) {
        try {
          const ref  = doc(db, "siparisTakip", merchant_oid);
          const snap = await getDoc(ref);
          const info = snap.exists() ? (snap.data() as { name?: string; phone?: string }) : null;

          if (info?.phone) {
            await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://obrnhomen.com"}/api/send-sms`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "order_confirm",
                data: {
                  phone: info.phone,
                  orderId: merchant_oid,
                  name: info.name ?? "",
                  total: (Number(total_amount) / 100).toLocaleString("tr-TR"),
                },
              }),
            }).catch(() => {});
          }

          if (snap.exists()) await deleteDoc(ref);
        } catch (err) {
          console.error("siparisTakip okuma hatası:", err);
        }
      }
    } else {
      console.error(`PayTR ödeme başarısız: ${merchant_oid} — durum: ${status}`);
    }

    /* PayTR OK beklediğini söyler */
    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("PayTR notify hatası:", err);
    return new NextResponse("ERROR", { status: 500 });
  }
}
