import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CartProvider } from "@/app/components/CartContext";
import { AuthProvider } from "@/app/components/AuthProvider";
import { WishlistProvider } from "@/app/components/WishlistContext";
import { WholesaleListProvider } from "@/app/components/WholesaleListContext";
import CallButton from "@/app/components/CallButton";
import { BIG_TEXT_PREPAINT } from "@/lib/bigText";
import NavbarClient from "@/app/components/NavbarClient";
import LiveChatWidget from "@/app/components/LiveChatWidget";
import NewsletterPopup from "@/app/components/NewsletterPopup";
import ScrollToTop from "@/app/components/ScrollToTop";
import { CATEGORY_LINKS, UTILITY_LINKS, WHATSAPP_URL, INSTAGRAM_URL, STORE_ADDRESS } from "@/lib/storeNav";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

// Başlık fontu: Lora — okunaklı, ciddi, rakamları düz hizalı (Playfair'in "zıplayan" rakamları ve
// italik Cormorant çocukça duruyordu). Değişken adı eski kodla uyum için --font-playfair kaldı.
const playfair = Lora({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://obrnhomen.com"),
  title: { default: "OBRNHOMEN | El İşi Tesbih, Seccade & Hediyelik", template: "%s | OBRNHOMEN" },
  description: "Hac, umre, mevlüt ve düğün için el işçiliğiyle üretilmiş tesbih, seccade ve özel hediyelik setler. 198+ ürün, hızlı kargo, 14 gün iade garantisi.",
  keywords: ["tesbih", "seccade", "hac hediyeliği", "umre hediyeliği", "mevlüt hediyeliği", "hediyelik set", "el işi hediye", "namaz örtüsü", "çeyizlik tesbih", "toplu hediyelik", "ramazan hediyesi", "düğün hediyesi", "misvak", "ihram", "din kitabı", "obrnhomen"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OBRNHOMEN",
  },
  formatDetection: { telephone: false },
  openGraph: {
    siteName: "OBRNHOMEN",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@obrnhomen",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning className={`h-full ${inter.variable} ${playfair.variable}`}>
      <body className="min-h-full flex flex-col">
        {/* A+ tercihi ilk boyamadan önce uygulanır */}
        <script dangerouslySetInnerHTML={{ __html: BIG_TEXT_PREPAINT }} />
        <CartProvider>
          <WishlistProvider>
          <WholesaleListProvider>
          <AuthProvider>

            {/* Duyuru şeridi */}
            <div className="print-hidden bg-gradient-to-r from-[#e9d48f] via-[#f3e3a6] to-[#e9d48f] text-[#3b2c08]">
              <div className="mx-auto flex max-w-[1500px] items-center justify-center gap-6 px-4 py-2 text-[13px] md:justify-between md:px-6">
                {/* İki ayrı mesaj: kargo tüm siparişler için, toptan ayrı bölüm */}
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
                  <span className="flex items-center gap-1.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                    Tüm siparişlerde <strong>2.000 ₺ üzeri kargo bedava</strong>
                  </span>
                  <span className="hidden h-4 w-px bg-[#3b2c08]/30 sm:block" aria-hidden="true" />
                  <Link href="/toptan" className="hidden items-center gap-1.5 hover:underline sm:flex">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 7h18v13H3z" /><path d="M8 7V4h8v3" /></svg>
                    <strong>Toptan alım</strong> mı? Kafile, mevlüt ve mağazalara özel fiyat →
                  </Link>
                </div>
                <nav className="hidden items-center divide-x divide-[#3b2c08]/30 md:flex">
                  {UTILITY_LINKS.map(({ href, label }) => (
                    <Link key={href} href={href} className="px-3 last:pr-0 hover:underline">
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>

            <div className="sticky top-0 z-40">
              <NavbarClient />
            </div>

            <main className="flex-1">{children}</main>

            <footer className="border-t border-stone-200 bg-[#f6f4ef] text-stone-700">
              <div className="mx-auto grid max-w-[1500px] gap-10 px-4 py-14 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
                <div>
                  <p
                    className="mb-4 text-xl uppercase text-[#7a5c17]"
                    style={{ fontFamily: "var(--font-playfair), serif", letterSpacing: "0.3em" }}
                  >
                    Obrnhomen
                  </p>
                  <p className="max-w-xs text-[13px] leading-relaxed text-stone-500">
                    Hac, umre, mevlüt ve düğün için el işçiliğiyle hazırlanan tesbih, seccade ve hediyelik setler.
                  </p>
                  <div className="mt-5 flex gap-3">
                    <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-[13px] underline-offset-4 hover:underline">
                      Instagram
                    </a>
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-[13px] underline-offset-4 hover:underline">
                      WhatsApp
                    </a>
                  </div>
                </div>

                <div>
                  <p className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-stone-900">Kategoriler</p>
                  <ul className="grid grid-cols-1 gap-y-2.5 text-[13px] sm:grid-cols-2 sm:gap-x-4">
                    {CATEGORY_LINKS.map(({ href, label }) => (
                      <li key={href}><Link href={href} className="hover:text-[#b8902e]">{label}</Link></li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-stone-900">Kurumsal</p>
                  <ul className="space-y-2.5 text-[13px]">
                    {[...UTILITY_LINKS, { href: "/blog", label: "Blog" }, { href: "/hesap", label: "Hesabım" }].map(({ href, label }) => (
                      <li key={href}><Link href={href} className="hover:text-[#b8902e]">{label}</Link></li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-stone-900">İletişim</p>
                  <ul className="space-y-2.5 text-[13px]">
                    <li>WhatsApp: <a href={WHATSAPP_URL} className="hover:text-[#b8902e]">0531 689 38 49</a></li>
                    <li>
                      <a href={STORE_ADDRESS.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#b8902e]">
                        Mağaza (Eminönü): {STORE_ADDRESS.line1}, {STORE_ADDRESS.line2}
                      </a>
                    </li>
                    <li>Pzt–Cmt 09:00 – 21:00</li>
                    <li>Toplu hediyelik siparişleriniz için bize yazın.</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-stone-200">
                <div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-2 px-4 py-5 text-[12px] text-stone-500 md:flex-row md:px-6">
                  <span>© {new Date().getFullYear()} OBRNHOMEN. Tüm hakları saklıdır.</span>
                  <span>Güvenli ödeme · PayTR</span>
                </div>
              </div>
            </footer>

            <div className="print-hidden">
              <LiveChatWidget />
              <CallButton />
            </div>
            <NewsletterPopup />
            <ScrollToTop />
          </AuthProvider>
          </WholesaleListProvider>
          </WishlistProvider>
        </CartProvider>
        <GoogleAnalytics gaId="G-EZ3ZCTGL48" />
      </body>
    </html>
  );
}
