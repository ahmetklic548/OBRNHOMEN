import { VALID_COUPONS } from "@/lib/pricing";

/**
 * Ortak (kafile / influencer) indirim + referans kodları.
 * Firestore: products/_ortaklar { kodlar: { KOD: Ortak } } — products koleksiyonu herkese okunur,
 * girişli kullanıcıya yazılabilir. Bu yüzden telefon gibi kişisel bilgi burada TUTULMAZ ve
 * indirim/komisyon oranları sunucuda sınırlanır (biri kendi kodunu yazsa bile en fazla %15 indirim).
 */

export type OrtakTur = "kafile" | "influencer" | "diger";

export interface Ortak {
  ad: string;
  tur: OrtakTur;
  /** Müşteriye indirim yüzdesi */
  indirim: number;
  /** Ortağa satış başına komisyon yüzdesi (indirim sonrası ürün tutarı üzerinden; kargo hariç) */
  komisyon: number;
  aktif: boolean;
  olusturma?: string;
}

export const MAX_INDIRIM = 15;
export const MAX_KOMISYON = 30;

const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "obrnhomen-73ed9";
export const ORTAK_REST_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/products/_ortaklar`;

/** Kod biçimi: 3–20 karakter, harf/rakam (Türkçe karakterler sadeleştirilir) */
export function normalizeKod(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw
    .trim()
    .toLocaleUpperCase("tr-TR")
    .replace(/Ç/g, "C").replace(/Ğ/g, "G").replace(/İ/g, "I").replace(/Ö/g, "O").replace(/Ş/g, "S").replace(/Ü/g, "U")
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 20);
}

const clamp = (n: unknown, max: number) => {
  const v = Math.round(Number(n));
  return Number.isFinite(v) ? Math.min(Math.max(v, 0), max) : 0;
};

type FsValue = { stringValue?: string; integerValue?: string; doubleValue?: number; booleanValue?: boolean; mapValue?: { fields?: Record<string, FsValue> } };

function parseOrtak(v: FsValue): Ortak | null {
  const f = v.mapValue?.fields;
  if (!f) return null;
  const num = (x?: FsValue) => Number(x?.integerValue ?? x?.doubleValue ?? 0);
  const tur = f.tur?.stringValue;
  return {
    ad: f.ad?.stringValue ?? "",
    tur: tur === "kafile" || tur === "influencer" ? tur : "diger",
    indirim: clamp(num(f.indirim), MAX_INDIRIM),
    komisyon: clamp(num(f.komisyon), MAX_KOMISYON),
    aktif: f.aktif?.booleanValue !== false,
    olusturma: f.olusturma?.stringValue,
  };
}

/** Tüm ortak kodları (sunucu: önbelleksiz okur) */
export async function fetchOrtaklar(): Promise<Record<string, Ortak>> {
  try {
    const r = await fetch(ORTAK_REST_URL, { cache: "no-store" });
    if (!r.ok) return {};
    const d = await r.json();
    const map: Record<string, FsValue> = d.fields?.kodlar?.mapValue?.fields ?? {};
    const out: Record<string, Ortak> = {};
    for (const [kod, v] of Object.entries(map)) {
      const o = parseOrtak(v);
      if (o) out[kod] = o;
    }
    return out;
  } catch {
    return {};
  }
}

export interface ResolvedCoupon {
  code: string;
  discountRate: number;
  /** Ortak koduysa ortak bilgisi */
  ortak: { ad: string; tur: OrtakTur; komisyon: number } | null;
}

/** Kupon kodunu çöz: önce sabit kuponlar (HOSGELDIN10), sonra aktif ortak kodları */
export async function resolveCoupon(raw: unknown): Promise<ResolvedCoupon | null> {
  const code = normalizeKod(raw);
  if (!code) return null;
  if (VALID_COUPONS[code]) return { code, discountRate: VALID_COUPONS[code], ortak: null };
  const ortaklar = await fetchOrtaklar();
  const o = ortaklar[code];
  if (!o || !o.aktif) return null;
  return { code, discountRate: o.indirim, ortak: { ad: o.ad, tur: o.tur, komisyon: o.komisyon } };
}
