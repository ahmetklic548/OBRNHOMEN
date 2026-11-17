/**
 * Kafile takip paneli (Yol 2 · kod): kafile kendi linkinden gelen siparişleri ve komisyonunu görür.
 * Kayıt: ortakPanel/{sha256(anahtar)} — belge kimliği anahtarın özeti olduğu için sadece linki bilen okuyabilir
 * (Firestore kuralı: get herkese, list/yazma sadece admin). Admin "Ortak Kodları" sayfası açıldıkça güncellenir.
 * Müşteri adı/telefonu/adresi panele YAZILMAZ.
 */
export interface PanelSiparis {
  /** ms */
  tarih: number;
  /** Komisyona esas ürün tutarı yerine müşterinin ödediği tutar (bilgi amaçlı) */
  tutar: number;
  komisyon: number;
  teslim: boolean;
  /** Bu siparişle giden isimli hediye kartı sayısı (poşet adedi) */
  kart: number;
}

export interface OrtakPanelKayit {
  kod: string;
  ad: string;
  /** Linkteki anahtar — admin linki yeniden kopyalayabilsin diye (belgeyi zaten sadece anahtarı bilen açabilir) */
  anahtar: string;
  indirim: number;
  komisyon: number;
  siparisler: PanelSiparis[];
  odenen: number;
  guncelleme: number;
}

export const PANEL_YOLU = "/kafile-panel";
export const ODEME_GUNU = 5;

export async function sha256Hex(s: string): Promise<string> {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

export function yeniAnahtar(): string {
  const b = new Uint8Array(18);
  crypto.getRandomValues(b);
  return [...b].map((x) => x.toString(36).padStart(2, "0")).join("").slice(0, 24);
}
