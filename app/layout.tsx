import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CartProvider } from "@/app/components/CartContext";
import { AuthProvider } from "@/app/components/AuthProvider";
import { WishlistProvider } from "@/app/components/WishlistContext";
import NavbarClient from "@/app/components/NavbarClient";
import LiveChatWidget from "@/app/components/LiveChatWidget";
import NewsletterPopup from "@/app/components/NewsletterPopup";
import ScrollToTop from "@/app/components/ScrollToTop";
import { CATEGORY_LINKS, UTILITY_LINKS, WHATSAPP_URL, INSTAGRAM_URL } from "@/lib/storeNav";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  style: ["italic"],
  variable: "--font-cormorant",
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
    <html lang="tr" className={`h-full ${inter.variable} ${playfair.variable} ${cormorant.variable}`}>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <WishlistProvider>
          <AuthProvider>

            {/* Duyuru şeridi */}
            <div className="bg-gradient-to-r from-[#e9d48f] via-[#f3e3a6] to-[#e9d48f] text-[#3b2c08]">
              <div className="mx-auto flex max-w-[1500px] items-center justify-center gap-6 px-4 py-2 text-[12px] md:justify-between md:px-6">
                <p className="text-center">
                  Tüm ürünlerde <strong>%10 indirim</strong> · 1000 ₺ üzeri <strong>ücretsiz kargo</strong>
                </p>
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
                  <ul className="space-y-2.5 text-[13px]">
                    {CATEGORY_LINKS.slice(0, 7).map(({ href, label }) => (
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

            <LiveChatWidget />
            <NewsletterPopup />
            <ScrollToTop />
          </AuthProvider>
          </WishlistProvider>
        </CartProvider>
        <GoogleAnalytics gaId="G-EZ3ZCTGL48" />
      </body>
    </html>
  );
}
