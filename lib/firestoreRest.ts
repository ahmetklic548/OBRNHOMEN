/**
 * Sunucu tarafı Firestore yazma/okuma — REST API ile, zaman aşımlı.
 * Neden: firebase/firestore istemci SDK'sı Vercel fonksiyonlarında gRPC "Write" akışında
 * hata alıp sonsuza kadar yeniden deniyordu (setDoc hiç dönmüyor → kapıda ödeme isteği askıda
 * kalıyordu). REST aynı yetkiyle (web API anahtarı, girişsiz) çalışır ve en geç TIMEOUT_MS'de döner.
 */

const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "obrnhomen-73ed9";
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "";
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
const TIMEOUT_MS = 7000;

type FsValue =
  | { nullValue: null }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { stringValue: string }
  | { arrayValue: { values?: FsValue[] } }
  | { mapValue: { fields?: Record<string, FsValue> } };

function toValue(v: unknown): FsValue {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === "string") return { stringValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(toValue) } };
  if (typeof v === "object") return { mapValue: { fields: toFields(v as Record<string, unknown>) } };
  return { stringValue: String(v) };
}

function toFields(o: Record<string, unknown>): Record<string, FsValue> {
  const out: Record<string, FsValue> = {};
  for (const [k, v] of Object.entries(o)) if (v !== undefined) out[k] = toValue(v);
  return out;
}

function fromValue(v: Record<string, unknown>): unknown {
  if ("nullValue" in v) return null;
  if ("booleanValue" in v) return v.booleanValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return Number(v.doubleValue);
  if ("stringValue" in v) return v.stringValue;
  if ("timestampValue" in v) return v.timestampValue;
  if ("arrayValue" in v) return ((v.arrayValue as { values?: Record<string, unknown>[] }).values ?? []).map(fromValue);
  if ("mapValue" in v) return fromFields((v.mapValue as { fields?: Record<string, Record<string, unknown>> }).fields ?? {});
  return null;
}

function fromFields(f: Record<string, Record<string, unknown>>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(f)) out[k] = fromValue(v);
  return out;
}

const url = (path: string) => `${BASE}/${path}${API_KEY ? `?key=${encodeURIComponent(API_KEY)}` : ""}`;

/** Belgeyi yaz (varsa üzerine yazar). Başarısızsa false döner, hata fırlatmaz. */
export async function setDocRest(path: string, data: Record<string, unknown>): Promise<boolean> {
  try {
    const r = await fetch(url(path), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields: toFields(data) }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!r.ok) console.error(`Firestore REST yazma ${path}: ${r.status} ${(await r.text().catch(() => "")).slice(0, 300)}`);
    return r.ok;
  } catch (err) {
    console.error(`Firestore REST yazma ${path} hatası:`, err);
    return false;
  }
}

/** Belgeyi oku; yoksa ya da okunamazsa null */
export async function getDocRest(path: string): Promise<Record<string, unknown> | null> {
  try {
    const r = await fetch(url(path), { signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store" });
    if (!r.ok) {
      if (r.status !== 404) console.error(`Firestore REST okuma ${path}: ${r.status}`);
      return null;
    }
    const d = (await r.json()) as { fields?: Record<string, Record<string, unknown>> };
    return fromFields(d.fields ?? {});
  } catch (err) {
    console.error(`Firestore REST okuma ${path} hatası:`, err);
    return null;
  }
}

export async function deleteDocRest(path: string): Promise<boolean> {
  try {
    const r = await fetch(url(path), { method: "DELETE", signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store" });
    return r.ok;
  } catch {
    return false;
  }
}
