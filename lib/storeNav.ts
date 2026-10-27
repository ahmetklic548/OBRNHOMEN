import { CATEGORIES } from "@/lib/categories";

/** Tüm kategori linkleri (altbilgi). Üst menü grupları: lib/categories.ts NAV_GROUPS */
export const CATEGORY_LINKS = CATEGORIES.map((c) => ({ href: `/koleksiyon/${c.slug}`, label: c.name }));

export const UTILITY_LINKS = [
  { href: "/about", label: "Hakkımızda" },
  { href: "/returns", label: "İade Şartları" },
  { href: "/payment", label: "Güvenli Ödeme" },
  { href: "/kargo-takip", label: "Sipariş Takip" },
];

export const WHATSAPP_URL = "https://wa.me/905316893849";
/** Telefonla sipariş — yaşlı müşteriler formla uğraşmadan arasın */
export const PHONE_DISPLAY = "0531 689 38 49";
export const PHONE_HREF = "tel:+905316893849";
export const INSTAGRAM_URL = "https://www.instagram.com/obrnhomen";

/** Müşteriye gösterilen mağaza (Eminönü / Mahmutpaşa). Depo adresi hiçbir yerde gösterilmez. */
export const STORE_ADDRESS = {
  line1: "Mahmutpaşa Yokuşu, Büyük Çorapçı Han D:219/10-1",
  line2: "Beyazıt, 34116 Fatih/İstanbul",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Hira+Hac+Malzemeleri+B%C3%BCy%C3%BCk+%C3%87orap%C3%A7%C4%B1+Han+Fatih",
};
