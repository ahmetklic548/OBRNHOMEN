"use client";

import { auth } from "@/lib/firebase";

/** Admin API istekleri için başlık: oturumdaki kullanıcının Firebase ID token'ı (sunucu: lib/adminAuth.ts) */
export async function adminHeaders(): Promise<Record<string, string>> {
  const token = (await auth?.currentUser?.getIdToken()) ?? "";
  return { Authorization: `Bearer ${token}` };
}
