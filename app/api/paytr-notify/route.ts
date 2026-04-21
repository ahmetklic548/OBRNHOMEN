import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

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
      /* ✅ Ödeme başarılı — sipariş kaydı için buraya loglama eklenebilir */
      console.log(`Sipariş başarılı: ${merchant_oid} — ${total_amount} kuruş`);
    } else {
      /* ❌ Ödeme başarısız veya iptal */
      console.log(`Sipariş başarısız: ${merchant_oid} — durum: ${status}`);
    }

    /* PayTR OK beklediğini söyler */
    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("PayTR notify hatası:", err);
    return new NextResponse("ERROR", { status: 500 });
  }
}
