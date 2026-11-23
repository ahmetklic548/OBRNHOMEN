import { CONTACT_EMAIL, PHONE_DISPLAY } from "@/lib/storeNav";
import { SHIPPING_FEE, FREE_SHIPPING_OVER, COD_FEE } from "@/lib/pricing";

/**
 * Yasal metinlerdeki satıcı bilgileri — TEK YER.
 * Unvan / vergi bilgisi boşsa sayfalarda "[…]" yer tutucusu görünür; canlıya almadan önce doldur.
 * Adres: Trendyol'daki fatura adresi (Fatih). Arnavutköy adresi (ev) hiçbir yerde kullanılmaz.
 */
export const SELLER = {
  unvan: "Diyar Kılıç", // şahıs şirketi (kullanıcı 2026-11-23)
  vergiDairesi: "", // yönetmelikte zorunlu değil; boşsa sayfalarda satır gizlenir
  vergiNo: "", // VKN veya TCKN
  mersisNo: "", // şahıs şirketinde yoksa boş bırak
  marka: "OBRNHOMEN",
  adres: "Mercan Mah. Mahmutpaşa Yokuşu Cad. Büyük Çorapçı Han No:155 İç Kapı No:Z01, 34116 Fatih/İstanbul",
  telefon: PHONE_DISPLAY,
  eposta: CONTACT_EMAIL,
  site: "www.obrnhomen.com",
};

export const ORDER_TERMS = {
  kargoyaVerme: "en geç 3 iş günü",
  kargoUcreti: SHIPPING_FEE,
  ucretsizKargoUstu: FREE_SHIPPING_OVER,
  kapidaOdemeBedeli: COD_FEE,
  cayma: 14,
  iadeOdeme: 14, // yasal azami süre (Mesafeli Sözleşmeler Yön. md. 13); pratikte 7 gün
};

export const LEGAL_UPDATED = "23 Kasım 2026";

/** Boş alanı görünür yer tutucuyla göster — eksik bilgi canlıda fark edilsin. */
export const fill = (v: string, label: string) => (v.trim() ? v : `[${label}]`);

export const LEGAL_LINKS = [
  { href: "/mesafeli-satis-sozlesmesi", label: "Mesafeli Satış Sözleşmesi" },
  { href: "/on-bilgilendirme", label: "Ön Bilgilendirme Formu" },
  { href: "/kvkk", label: "KVKK Aydınlatma Metni" },
  { href: "/gizlilik", label: "Gizlilik ve Çerez Politikası" },
];

export const CONSENT_KEY = "obrnhomen-cerez";
export type ConsentValue = "hepsi" | "zorunlu";
export const CONSENT_EVENT = "obrnhomen-cerez-degisti";
