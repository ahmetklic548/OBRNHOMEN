import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CartProvider } from "@/app/components/CartContext";
import { AuthProvider } from "@/app/components/AuthProvider";
import NavbarClient from "@/app/components/NavbarClient";
import LiveChatWidget from "@/app/components/LiveChatWidget";
import NewsletterPopup from "@/app/components/NewsletterPopup";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "OBRNHOMEN", template: "%s | OBRNHOMEN" },
  description: "El işçiliği ve özgün tasarımla hazırlanan özel hediyeler.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`h-full ${inter.variable}`}>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <AuthProvider>

            {/* Fixed header: announcement bar + navbar stacked */}
            <div className="fixed top-0 inset-x-0 z-40">
              <div className="w-full py-2 px-4 text-center text-[11px] tracking-[0.15em]" style={{ background: "#1D1D1F", color: "#c9a84c" }}>
                1000 ₺ ve üzeri siparişlerde kargo ücretsiz &nbsp;·&nbsp; 14 gün iade garantisi
              </div>
              <NavbarClient />
            </div>

            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer style={{ background: "#1D1D1F" }}>
              <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-12">
                  {/* Brand */}
                  <div>
                    <p className="text-xl tracking-[0.3em] uppercase font-light mb-3" style={{ color: "#ffffff" }}>
                      OBRNHOMEN
                    </p>
                    <p className="text-sm leading-relaxed max-w-xs" style={{ color: "#86868B" }}>
                      El işçiliği ve özgün tasarımla hazırlanan özel hediye koleksiyonları.
                    </p>
                  </div>

                  {/* Links */}
                  <div className="grid grid-cols-2 gap-x-16 gap-y-3 text-sm" style={{ color: "#86868B" }}>
                    {[
                      { href: "/koleksiyon", label: "Koleksiyon" },
                      { href: "/about",      label: "Hakkımızda" },
                      { href: "/returns",    label: "İade Şartları" },
                      { href: "/payment",    label: "Güvenli Ödeme" },
                      { href: "/hesap",      label: "Hesabım" },
                    ].map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        className="transition-colors hover:text-white"
                        style={{ color: "#86868B" }}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Bottom */}
                <div
                  className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
                  style={{ borderColor: "rgba(255,255,255,0.08)", color: "#86868B" }}
                >
                  <span>© {new Date().getFullYear()} OBRNHOMEN. Tüm hakları saklıdır.</span>
                  <span>obrnhomen.com</span>
                </div>
              </div>
            </footer>

            <LiveChatWidget />
            <NewsletterPopup />
          </AuthProvider>
        </CartProvider>
        <GoogleAnalytics gaId="G-EZ3ZCTGL48" />
      </body>
    </html>
  );
}
