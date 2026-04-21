import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, total, name, email, phone, address } = body;

    const merchant_id   = process.env.PAYTR_MERCHANT_ID!;
    const merchant_key  = process.env.PAYTR_MERCHANT_KEY!;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT!;
    const site_url      = process.env.NEXT_PUBLIC_SITE_URL ?? "https://obrnhomen.com";

    if (!merchant_id || !merchant_key || !merchant_salt) {
      return NextResponse.json({ error: "PayTR yapılandırması eksik" }, { status: 500 });
    }

    /* Benzersiz sipariş no */
    const merchant_oid = `OBR${Date.now()}`;

    /* Kullanıcı IP */
    const forwarded = req.headers.get("x-forwarded-for");
    const user_ip   = (forwarded ? forwarded.split(",")[0] : "1.2.3.4").trim();

    /* Tutar — kuruş cinsinden (x100) */
    const payment_amount = Math.round(total * 100).toString();

    /* Sepet: [[isim, fiyat, adet], ...] */
    const basket = items.map((i: { name: string; price: number; qty: number }) => [
      i.name.substring(0, 60),
      (i.price * 100).toFixed(0),
      i.qty,
    ]);
    const user_basket = Buffer.from(JSON.stringify(basket)).toString("base64");

    const no_installment  = "0";
    const max_installment = "0";
    const currency        = "TL";
    const test_mode       = "1"; /* test modu */

    /* Hash hesapla */
    const hash_str =
      merchant_id +
      user_ip +
      merchant_oid +
      email +
      payment_amount +
      user_basket +
      no_installment +
      max_installment +
      currency +
      test_mode +
      merchant_salt;

    const paytr_token = crypto
      .createHmac("sha256", merchant_key)
      .update(hash_str)
      .digest("base64");

    /* PayTR'ye token isteği */
    const params = new URLSearchParams({
      merchant_id,
      user_ip,
      merchant_oid,
      email,
      payment_amount,
      paytr_token,
      user_basket,
      debug_on:           "1",
      no_installment,
      max_installment,
      user_name:          name,
      user_address:       address,
      user_phone:         phone,
      merchant_ok_url:    `${site_url}/odeme/basarili?oid=${merchant_oid}`,
      merchant_fail_url:  `${site_url}/odeme/hata?oid=${merchant_oid}`,
      merchant_notify_url:`${site_url}/api/paytr-notify`,
      currency,
      test_mode,
      lang:               "tr",
    });

    const paytrRes = await fetch("https://www.paytr.com/odeme/api/get-token", {
      method:  "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:    params.toString(),
    });

    const data = await paytrRes.json();

    if (data.status !== "success") {
      console.error("PayTR hata:", data);
      return NextResponse.json({ error: data.reason ?? "Token alınamadı" }, { status: 400 });
    }

    return NextResponse.json({ token: data.token, merchant_oid });
  } catch (err) {
    console.error("PayTR token hatası:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
