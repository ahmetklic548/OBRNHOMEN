import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getProductBySlug } from "@/lib/products";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Sen bir Sosyal Medya Otomasyon Uzmanısın. Görevin, verilen konu veya ürün bilgisinden; Instagram, YouTube Shorts ve TikTok için optimize edilmiş içerik planları üretmektir.

Platform dinamiklerine sadık kal:
- Instagram: Estetik, lüks, duygusal bağ, yavaş anlatım
- TikTok: Hız, eğlence, merak, unboxing enerjisi
- YouTube Shorts: Bilgi verici, "neden almalısın", hediye fikirleri

Çıktıyı SADECE aşağıdaki geçerli JSON formatında ver. Başka hiçbir açıklama, başlık veya metin ekleme:

{
  "instagram": {
    "video_konusu": "Konu başlığı",
    "kanca_cumlesi": "İlk 3 saniyede söylenecek çarpıcı cümle",
    "video_scripti": "Videonun tam metni (max 150 kelime)",
    "gorsel_istemi": "Midjourney/Runway formatında görsel betimleme",
    "altyazi_metni": "Paylaşım açıklaması ve #hashtagler",
    "muzik_tarzi": "Trendlere uygun müzik önerisi"
  },
  "tiktok": {
    "video_konusu": "...",
    "kanca_cumlesi": "...",
    "video_scripti": "...",
    "gorsel_istemi": "...",
    "altyazi_metni": "...",
    "muzik_tarzi": "..."
  },
  "youtube_shorts": {
    "video_konusu": "...",
    "kanca_cumlesi": "...",
    "video_scripti": "...",
    "gorsel_istemi": "...",
    "altyazi_metni": "...",
    "muzik_tarzi": "..."
  }
}`;

export async function POST(req: NextRequest) {
  if (req.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const { slug, topic } = await req.json() as { slug?: string; topic?: string };

    if (!slug && !topic) {
      return NextResponse.json({ error: "slug veya topic gerekli" }, { status: 400 });
    }

    let userMessage = "";

    if (slug) {
      const product = getProductBySlug(slug);
      if (!product) {
        return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
      }
      userMessage = `Ürün: ${product.name}
Kategori: ${product.category}
Marka: ${product.brand}
Fiyat: ${product.price.toLocaleString("tr-TR")} TL
Özellikler: ${product.features.join(", ")}
Açıklama: ${product.metaDescription}`;
    } else {
      userMessage = `Konu: ${topic}`;
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";

    let parsed: unknown;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "JSON parse hatası", raw: text }, { status: 500 });
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Social content hatası:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
