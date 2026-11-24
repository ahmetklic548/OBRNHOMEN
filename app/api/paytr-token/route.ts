import { NextRequest, NextResponse } from "next/server";
import { sinirAsildi, COK_ISTEK } from "@/lib/rateLimit";
import crypto from "crypto";
import { setDocRest } from "@/lib/firestoreRest";
import { computeOrder, readCustomer, type ComputedOrder } from "@/lib/order";
import { isAdmin } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  if (sinirAsildi(req, "paytr-token", 15, 10 * 60_000)) return NextResponse.json(COK_ISTEK, { status: 429 });
  try {
    const body = await req.json();
    const { name, email, phone, address, giftWrap, giftNote } = readCustomer(body);

    /* Fiyatlar sunucuda ürün verisinden (lib/order.ts) — istemci fiyatına güvenilmez */
    /* Admin ödeme testi (/admin/odeme-testi): sadece admin oturumuyla 1 ₺, kargosuz */
    let order: ComputedOrder | { error: string };
    if (body.adminTest === true) {
      if (!(await isAdmin(req))) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
      order = { lines: [{ slug: "odeme-testi", name: "ODEME TESTI (silinecek)", price: 1, qty: 1, tier: 0 }], subtotal: 1, coupon: null, discountRate: 0, discountAmount: 0, shipping: 0, codFee: 0, total: 1, ortak: null };
    } else {
      order = await computeOrder(body.items, body.coupon);
    }
    if ("error" in order) return NextResponse.json({ error: order.error }, { status: 400 });
    const { lines: valid, coupon, discountRate, shipping, total, ortak } = order;

    /* PayTR sepeti — kupon indirimi satır fiyatlarına yansıtılır */
    const items = [
      ...valid.map(i => ({ ...i, price: Math.round(i.price * (1 - discountRate / 100) * 100) / 100 })),
      ...(shipping > 0 ? [{ slug: "kargo", name: "Kargo Ücreti", price: shipping, qty: 1, tier: 0 }] : []),
    ];

    const merchant_id   = process.env.PAYTR_MERCHANT_ID!;
    const merchant_key  = process.env.PAYTR_MERCHANT_KEY!;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT!;
    const site_url      = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.obrnhomen.com";

    if (!merchant_id || !merchant_key || !merchant_salt) {
      return NextResponse.json({ error: "PayTR yapılandırması eksik" }, { status: 500 });
    }

    /* Benzersiz sipariş no */
    /* Rastgele ek: siparisTakip kaydı (müşteri adı/adres) numara tahmin edilerek okunamasın */
    const merchant_oid = `OBR${Date.now()}${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    /* Kullanıcı IP */
    const forwarded = req.headers.get("x-forwarded-for");
    const user_ip   = (forwarded ? forwarded.split(",")[0] : "1.2.3.4").trim();

    /* Tutar — kuruş cinsinden (x100) */
    const payment_amount = Math.round(total * 100).toString();

    /* Sepet: [[isim, fiyat, adet], ...] */
    const basket = items.map((i) => [
      i.name.substring(0, 60),
      (i.price * 100).toFixed(0),
      i.qty,
    ]);
    const user_basket = Buffer.from(JSON.stringify(basket)).toString("base64");

    const no_installment  = "0";
    const max_installment = "6"; // en fazla 6 taksit (vade farkı müşteride)
    const currency        = "TL";
    const test_mode       = process.env.PAYTR_TEST_MODE ?? "0";

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
      debug_on:           "0",
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

    // Bildirim (notify) webhook'u PayTR'den telefon/isim bilgisi almıyor,
    // bu yüzden SMS gönderebilmek için burada saklıyoruz.
    await setDocRest(`siparisTakip/${merchant_oid}`, {
      name, phone, email, address, items, total, coupon, ortak, giftWrap, giftNote, paymentMethod: "kart", createdAt: Date.now(),
    });

    return NextResponse.json({ token: data.token, merchant_oid, total });
  } catch (err) {
    console.error("PayTR token hatası:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
