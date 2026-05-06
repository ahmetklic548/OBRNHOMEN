import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Geçerli bir e-posta adresi girin." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Servis yapılandırılmamış." }, { status: 500 });
    }

    // Resend API ile abone ekle
    const res = await fetch("https://api.resend.com/contacts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        audience_id: process.env.RESEND_AUDIENCE_ID,
        unsubscribed: false,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      // Zaten abone olan kullanıcıyı hata saymıyoruz
      if (data.name === "validation_error") {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: "Kayıt sırasında hata oluştu." }, { status: 400 });
    }

    // Hoş geldin e-postası gönder
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "OBRNHOMEN <merhaba@obrnhomen.com>",
        to: email,
        subject: "OBRNHOMEN'e hoş geldiniz 🌙",
        html: `
          <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; background: #1D1D1F; color: #ffffff; padding: 48px 32px;">
            <p style="font-size: 11px; letter-spacing: 0.4em; text-transform: uppercase; color: #c9a84c; margin-bottom: 24px;">OBRNHOMEN</p>
            <h1 style="font-size: 24px; font-weight: 300; letter-spacing: 0.1em; margin-bottom: 16px;">Hoş Geldiniz</h1>
            <p style="font-size: 14px; color: #86868B; line-height: 1.7; margin-bottom: 24px;">
              Bültenimize abone olduğunuz için teşekkürler. Yeni ürünler, özel indirimler ve kampanyalardan ilk siz haberdar olacaksınız.
            </p>
            <p style="font-size: 13px; color: #c9a84c; letter-spacing: 0.15em; margin-bottom: 32px;">
              İlk siparişinizde %10 indirim: <strong>HOSGELDIN10</strong>
            </p>
            <a href="https://obrnhomen.com/koleksiyon" style="display: inline-block; padding: 14px 32px; background: #c9a84c; color: #1D1D1F; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none;">
              Koleksiyonu Gör
            </a>
            <p style="font-size: 11px; color: #555; margin-top: 40px;">
              Bu e-postayı almak istemiyorsanız <a href="#" style="color: #86868B;">aboneliğinizi iptal edebilirsiniz</a>.
            </p>
          </div>
        `,
      }),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
