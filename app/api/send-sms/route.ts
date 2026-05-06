import { NextRequest, NextResponse } from "next/server";

async function sendSms(to: string, message: string) {
  const username = process.env.NETGSM_USERNAME!;
  const password = process.env.NETGSM_PASSWORD!;
  const header   = process.env.NETGSM_HEADER ?? "OBRNHOMEN";

  const params = new URLSearchParams({
    usercode: username,
    password,
    gsmno: to.replace(/\D/g, "").replace(/^0/, "90"),
    message,
    msgheader: header,
    dil: "TR",
  });

  const res = await fetch(`https://api.netgsm.com.tr/sms/send/get?${params.toString()}`);
  const text = await res.text();

  if (!text.startsWith("00") && !text.startsWith("01")) {
    throw new Error(`Netgsm hata kodu: ${text}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { type, data } = await req.json();

    if (!process.env.NETGSM_USERNAME) {
      return NextResponse.json({ error: "SMS servisi yapılandırılmamış." }, { status: 500 });
    }

    if (type === "order_confirm") {
      // Müşteriye sipariş onayı
      await sendSms(
        data.phone,
        `OBRNHOMEN: Siparişiniz alındı! Sipariş no: ${data.orderId}. Kargoya verildiğinde bildirim alacaksınız. Teşekkürler.`
      );
      // Yöneticiye yeni sipariş bildirimi
      if (process.env.ADMIN_PHONE) {
        await sendSms(
          process.env.ADMIN_PHONE,
          `Yeni sipariş! ${data.orderId} — ${data.name} — ${data.total} TL`
        );
      }
    } else if (type === "cargo") {
      await sendSms(
        data.phone,
        `OBRNHOMEN: Siparişiniz kargoya verildi! Takip no: ${data.trackingNo}. Kolay gelsin.`
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SMS hatası:", err);
    return NextResponse.json({ error: "SMS gönderilemedi." }, { status: 500 });
  }
}
