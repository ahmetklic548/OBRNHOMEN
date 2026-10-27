"use client";

import { useSyncExternalStore } from "react";
import { doc, setDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";
import builtHidden from "@/data/hidden.json";

/**
 * Admin'in sitede "Sil" ile kaldırdığı ürünler.
 * Firestore: products/_site_hidden { slugs: string[] } (products koleksiyonu herkese okunur,
 * yazma girişli kullanıcıya açık). Build öncesi scripts/sync-hidden.mjs aynı listeyi
 * data/hidden.json'a yazar → statik sayfalardan da kalıcı olarak çıkar.
 * Bu modül değişikliği beklemeden tarayıcıda anında gizler.
 */
const ref = () => doc(db!, "products", "_site_hidden");

let hidden = new Set<string>(builtHidden as string[]);
let loaded = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

// Okuma: tek seferlik REST isteği (Firestore SDK'nın sürekli açık bağlantısı her ziyaretçiye gereksiz)
const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "obrnhomen-73ed9";
const REST_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/products/_site_hidden`;

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  fetch(REST_URL)
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      const slugs: string[] = (d?.fields?.slugs?.arrayValue?.values ?? []).map((v: { stringValue?: string }) => v.stringValue ?? "");
      hidden = new Set([...(builtHidden as string[]), ...slugs.filter(Boolean)]);
      emit();
    })
    .catch(() => { loaded = false; });
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  load();
  return () => listeners.delete(cb);
}

const EMPTY = new Set<string>();
/** Gizlenen ürün slug'ları (her değişimde yeni Set) */
export function useHiddenSlugs(): Set<string> {
  return useSyncExternalStore(subscribe, () => hidden, () => EMPTY);
}

export async function hideProduct(slug: string) {
  if (!db) throw new Error("Firebase yok");
  await setDoc(ref(), { slugs: arrayUnion(slug), updatedAt: new Date().toISOString() }, { merge: true });
  hidden = new Set([...hidden, slug]);
  emit();
}

export async function unhideProduct(slug: string) {
  if (!db) throw new Error("Firebase yok");
  await setDoc(ref(), { slugs: arrayRemove(slug), updatedAt: new Date().toISOString() }, { merge: true });
  const next = new Set(hidden);
  next.delete(slug);
  hidden = next;
  emit();
}
