import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getProductBySlug } from "@/lib/products";
import { salePrice, unitPriceFor, tierPct, orderTotals, VALID_COUPONS } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, address } = body;

    /* Fiyatları istemciye güvenmeden ürün verisinden hesapla */
    const reqItems: { slug: string; qty: number }[] = Array.isArray(body.items) ? body.items : [];
    const lines = reqItems.map(({ slug, qty }) => {
      const p = getProductBySlug(String(slug));
      const n = Math.floor(Number(qty));
      if (!p || !p.inStock || !(n >= 1 && n <= 1000)) return null;
      // Toptan kademe sunucuda da aynı formülle — istemci fiyatına güvenilmez
      return { slug: p.slug, name: p.name, price: unitPriceFor(salePrice(p.price), n), qty: n, tier: tierPct(n) };
    });
    if (lines.length === 0 || lines.some(l => l === null)) {
      return NextResponse.json({ error: "Sepetteki bir ürün artık satışta değil. Sepetinizi kontrol edin." }, { status: 400 });
    }
    const valid = lines as { slug: string; name: string; price: number; qty: number; tier: number }[];
    const subtotal = Math.round(valid.reduce((s, i) => s + i.price * i.qty, 0) * 100) / 100;
    const coupon = typeof body.coupon === "string" && VALID_COUPONS[body.coupon] ? body.coupon : null;
    const { discountRate, shipping, grandTotal: total } = orderTotals(subtotal, coupon);

    /* PayTR sepeti — kupon indirimi satır fiyatlarına yansıtılır */
    const items = [
      ...valid.map(i => ({ ...i, price: Math.round(i.price * (1 - discountRate / 100) * 100) / 100 })),
      ...(shipping > 0 ? [{ slug: "kargo", name: "Kargo Ücreti", price: shipping, qty: 1, tier: 0 }] : []),
    ];

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
    const basket = items.map((i) => [
      i.name.substring(0, 60),
      (i.price * 100).toFixed(0),
      i.qty,
    ]);
    const user_basket = Buffer.from(JSON.stringify(basket)).toString("base64");

    const no_installment  = "0";
    const max_installment = "0";
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
    if (db) {
      try {
        await setDoc(doc(db, "siparisTakip", merchant_oid), {
          name, phone, email, address, items, total, coupon, createdAt: Date.now(),
        });
      } catch (err) {
        console.error("siparisTakip kaydı başarısız:", err);
      }
    }

    return NextResponse.json({ token: data.token, merchant_oid, total });
  } catch (err) {
    console.error("PayTR token hatası:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
