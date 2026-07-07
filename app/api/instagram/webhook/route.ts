import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Anthropic from "@anthropic-ai/sdk";
import { getAllCategories, getFeaturedProducts } from "@/lib/products";

export const runtime = "nodejs";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const GRAPH_API_VERSION = "v21.0";
const WHATSAPP_NUMBER = "905316893849";

function buildSystemPrompt(): string {
  const categories = getAllCategories();
  const featured = getFeaturedProducts();

  const productLines = featured
    .map((p) => `- ${p.name} (${p.category}): ${p.price.toLocaleString("tr-TR")} TL`)
    .join("\n");

  return `Sen OBRNHOMEN markasının Instagram DM asistanısın. OBRNHOMEN; hac, umre, mevlüt ve düğün için el yapımı tesbih, seccade, eşarp ve hediyelik setler satan bir Türk markası.

Kategoriler: ${categories.join(", ")}

Örnek ürünler:
${productLines}

Kurallar:
- Kısa, sıcak, samimi Instagram DM üslubu kullan (1-3 cümle, gereksiz uzatma yok).
- Sipariş kesinleştirme, kargo takibi ve özel talepler için müşteriyi WhatsApp'a yönlendir: wa.me/${WHATSAPP_NUMBER}
- İade: teslimden itibaren 14 gün, ürün kullanılmamış ve orijinal ambalajında olmalı. İade talebi WhatsApp üzerinden alınır.
- Fiyat/stok bilgisi net değilse tahmin üretme, WhatsApp'tan teyit almasını söyle.
- Emoji ölçülü kullanılabilir, aşırıya kaçma.
- Türkçe dışında bir dilde yazılırsa aynı dilde kısa cevap ver.
- Marka adına konuş, asla "yapay zeka" olduğunu öne çıkarma; doğrudan sorulursa dürüst ol ama konuyu ürüne getir.`;
}

function verifySignature(rawBody: string, signatureHeader: string | null): boolean {
  const appSecret = process.env.INSTAGRAM_APP_SECRET;
  if (!appSecret || !signatureHeader) return false;

  const expected =
    "sha256=" + crypto.createHmac("sha256", appSecret).update(rawBody).digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(signatureHeader);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

async function generateReply(userText: string): Promise<string> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 300,
    system: buildSystemPrompt(),
    messages: [{ role: "user", content: userText }],
  });

  return message.content[0].type === "text"
    ? message.content[0].text
    : "Merhaba! Mesajın için teşekkürler, sana en kısa sürede dönüş yapacağız.";
}

async function sendInstagramReply(recipientId: string, text: string) {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("INSTAGRAM_ACCESS_TOKEN tanımlı değil");
    return;
  }

  const res = await fetch(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/me/messages?access_token=${accessToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text },
      }),
    }
  );

  if (!res.ok) {
    console.error("Instagram mesaj gönderme hatası:", await res.text());
  }
}

/* Meta webhook doğrulama (kurulum sırasında bir kez çağrılır) */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.INSTAGRAM_VERIFY_TOKEN) {
    return new NextResponse(challenge ?? "", { status: 200 });
  }
  return new NextResponse("Yetkisiz", { status: 403 });
}

/* Gelen Instagram DM'lerini işler */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  if (!verifySignature(rawBody, req.headers.get("x-hub-signature-256"))) {
    return new NextResponse("Geçersiz imza", { status: 401 });
  }

  if (process.env.INSTAGRAM_BOT_ENABLED === "false") {
    return new NextResponse("OK", { status: 200 });
  }

  const body = JSON.parse(rawBody);

  if (body.object !== "instagram") {
    return new NextResponse("OK", { status: 200 });
  }

  for (const entry of body.entry ?? []) {
    for (const event of entry.messaging ?? []) {
      const senderId: string | undefined = event.sender?.id;
      const text: string | undefined = event.message?.text;
      const isEcho: boolean = event.message?.is_echo ?? false;

      if (!senderId || !text || isEcho) continue;

      try {
        const reply = await generateReply(text);
        await sendInstagramReply(senderId, reply);
      } catch (err) {
        console.error("Instagram otomatik cevap hatası:", err);
      }
    }
  }

  return new NextResponse("OK", { status: 200 });
}
