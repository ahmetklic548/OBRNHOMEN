import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sendOrderEmails } from "@/lib/orderEmail";

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
          const info = snap.exists()
            ? (snap.data() as { name?: string; phone?: string; email?: string; address?: string; items?: unknown; total?: number; coupon?: string | null; ortak?: unknown; giftWrap?: boolean; giftNote?: string })
            : null;

          // Tutar kontrolü: sitenin hesapladığı (toptan kademe + kupon + kargo) tutar ile
          // PayTR'nin tahsil ettiği sipariş tutarı. payment_amount taksit farkı içermez;
          // yoksa total_amount'a düşülür (taksitli ödemede fark çıkabilir).
          const paid     = Number(params.get("payment_amount") || total_amount) / 100;
          const beklenen = typeof info?.total === "number" ? info.total : null;
          const tutarUyumlu = beklenen === null ? null : Math.abs(paid - beklenen) < 0.01;
          if (tutarUyumlu === false) {
            console.error(`PayTR tutar uyuşmazlığı: ${merchant_oid} beklenen ${beklenen} ödenen ${paid}`);
          }

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

          // Kalıcı sipariş kaydı — daha önce siparisTakip anlık SMS için kullanılıp
          // hemen siliniyordu, hiçbir yerde sipariş geçmişi tutulmuyordu.
          try {
            await setDoc(doc(db, "siparisler", merchant_oid), {
              orderId: merchant_oid,
              name: info?.name ?? "",
              phone: info?.phone ?? "",
              email: info?.email ?? "",
              address: info?.address ?? "",
              items: info?.items ?? [],
              total: Number(total_amount) / 100,
              odenenTutar: paid,
              beklenenTutar: beklenen,
              tutarUyumlu,
              coupon: info?.coupon ?? null,
              ortak: info?.ortak ?? null,
              giftWrap: info?.giftWrap ?? false,
              giftNote: info?.giftNote ?? "",
              paymentMethod: "kart",
              status: "success",
              paidAt: Date.now(),
            });
          } catch (err) {
            console.error("siparisler kaydı başarısız:", err);
          }

          // E-posta: mağazaya bildirim + müşteriye onay. info yoksa (PayTR bildirimi tekrarı) gönderilmez.
          if (info) {
            type PItem = { slug?: string; name: string; sku?: string; qty: number; price: number; pack?: number };
            const items = (Array.isArray(info.items) ? info.items : []) as PItem[];
            const kargo = items.find((i) => i.slug === "kargo");
            await sendOrderEmails({
              orderId: merchant_oid,
              method: "kart",
              name: info.name ?? "",
              email: info.email,
              phone: info.phone ?? "",
              address: info.address ?? "",
              lines: items.filter((i) => i.slug !== "kargo"),
              shipping: kargo ? kargo.price : 0,
              coupon: info.coupon ?? null,
              ortak: (info.ortak as { ad: string; komisyonTutari: number } | null) ?? null,
              total: paid,
              giftWrap: info.giftWrap,
              giftNote: info.giftNote,
              tutarUyumlu,
            });
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
