import type { NextRequest } from "next/server";

/**
 * Admin API yetkisi — sunucu tarafı. İstemci Firebase oturum jetonunu (ID token) gönderir:
 *   Authorization: Bearer <idToken>   (lib/adminClient.ts → adminHeaders())
 * Jeton Google Identity Toolkit ile doğrulanır (süresi/imzası geçersizse reddedilir) ve e-posta
 * NEXT_PUBLIC_ADMIN_EMAIL ile karşılaştırılır. 2026-11-16: eski x-admin-secret yöntemi kaldırıldı —
 * anahtar NEXT_PUBLIC_ olduğu için sitenin herkese açık JS'inde görünüyordu.
 */
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "";
const ADMIN = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").toLowerCase();

export async function isAdmin(req: NextRequest): Promise<boolean> {
  const h = req.headers.get("authorization") || "";
  const token = h.startsWith("Bearer ") ? h.slice(7).trim() : "";
  if (!token || !ADMIN || !API_KEY) return false;
  try {
    const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token }),
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    if (!r.ok) return false;
    const u = (await r.json())?.users?.[0];
    return !!u && u.emailVerified === true && String(u.email ?? "").toLowerCase() === ADMIN;
  } catch {
    return false;
  }
}
