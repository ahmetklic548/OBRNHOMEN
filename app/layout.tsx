import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CartProvider } from "@/app/components/CartContext";
import { AuthProvider } from "@/app/components/AuthProvider";
import { WishlistProvider } from "@/app/components/WishlistContext";
import NavbarClient from "@/app/components/NavbarClient";
import LiveChatWidget from "@/app/components/LiveChatWidget";
import NewsletterPopup from "@/app/components/NewsletterPopup";
import ScrollToTop from "@/app/components/ScrollToTop";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "OBRNHOMEN", template: "%s | OBRNHOMEN" },
  description: "El işçiliği ve özgün tasarımla hazırlanan özel hediyeler.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OBRNHOMEN",
  },
  formatDetection: { telephone: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`h-full ${inter.variable} ${playfair.variable}`}>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <WishlistProvider>
          <AuthProvider>

            {/* Fixed header: announcement bar + navbar stacked */}
            <div className="fixed top-0 inset-x-0 z-40">
              <div className="w-full py-2 px-4 text-center text-[10px] tracking-[0.25em] uppercase" style={{ background: "#000000", color: "#ffffff" }}>
                İlk siparişinizde %10 indirim&nbsp;·&nbsp;
                <span className="font-medium tracking-widest" style={{ color: "#c9a84c" }}>HOSGELDIN10</span>
                &nbsp;·&nbsp; 1000 ₺ üzeri kargo ücretsiz
              </div>
              <NavbarClient />
            </div>

            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer style={{ background: "#0a0a0a", borderTop: "1px solid #1a1a1a" }}>
              <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-14">
                  {/* Brand */}
                  <div>
                    <p
                      className="text-2xl tracking-[0.35em] uppercase mb-4"
                      style={{ color: "#ffffff", fontFamily: "var(--font-playfair), serif", fontWeight: 400, letterSpacing: "0.35em" }}
                    >
                      OBRNHOMEN
                    </p>
                    <p className="text-xs leading-relaxed max-w-xs tracking-wide" style={{ color: "#555" }}>
                      El işçiliği ve özgün tasarımla hazırlanan<br />özel hediye koleksiyonları.
                    </p>
                    <div className="mt-5 w-8 h-px" style={{ background: "#c9a84c" }} />
                  </div>

                  {/* Links */}
                  <div className="grid grid-cols-2 gap-x-16 gap-y-4 text-[11px] tracking-[0.2em] uppercase">
                    {[
                      { href: "/koleksiyon", label: "Koleksiyon" },
                      { href: "/blog",       label: "Blog" },
                      { href: "/about",      label: "Hakkımızda" },
                      { href: "/returns",    label: "İade Şartları" },
                      { href: "/payment",    label: "Güvenli Ödeme" },
                      { href: "/hesap",      label: "Hesabım" },
                      { href: "/kargo-takip", label: "Kargo Takip" },
                    ].map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        className="transition-colors duration-200 hover:text-white"
                        style={{ color: "#555" }}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Bottom */}
                <div
                  className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] tracking-[0.2em] uppercase"
                  style={{ borderColor: "#1a1a1a", color: "#333" }}
                >
                  <span>© {new Date().getFullYear()} OBRNHOMEN. Tüm hakları saklıdır.</span>
                  <span>obrnhomen.com</span>
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
