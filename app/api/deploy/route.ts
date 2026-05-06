import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const webhookUrl = process.env.VERCEL_DEPLOY_HOOK;
  if (!webhookUrl) {
    return NextResponse.json({ error: "Deploy hook yapılandırılmamış." }, { status: 500 });
  }

  const res = await fetch(webhookUrl, { method: "POST" });
  if (!res.ok) {
    return NextResponse.json({ error: "Deploy tetiklenemedi." }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Deploy başlatıldı." });
}
