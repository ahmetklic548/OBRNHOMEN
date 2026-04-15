import type { Metadata } from "next";
import Link from "next/link";
import MobileNav from "@/app/components/MobileNav";
import FloatingWhatsApp from "@/app/components/FloatingWhatsApp";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "OBRNHOMEN", template: "%s | OBRNHOMEN" },
  description: "El işçiliği ve özgün tasarımla hazırlanan özel hediyeler.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="h-full">
      <body className="min-h-full flex flex-col">
        <header className="border-b border-stone-200 bg-stone-50 sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between relative">
            <Link
              href="/"
              className="text-lg tracking-[0.25em] uppercase font-light text-stone-800 hover:text-stone-600 transition-colors"
            >
              OBRNHOMEN
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex gap-8 text-xs tracking-widest uppercase text-stone-500">
              <Link href="/" className="hover:text-stone-900 transition-colors">Koleksiyon</Link>
              <Link href="/about" className="hover:text-stone-900 transition-colors">Hakkımızda</Link>
              <Link href="/returns" className="hover:text-stone-900 transition-colors">İade</Link>
              <Link href="/payment" className="hover:text-stone-900 transition-colors">Güvenli Ödeme</Link>
            </nav>

            {/* Mobile hamburger */}
            <MobileNav />
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-stone-200 bg-stone-50 mt-20">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
              <div>
                <p className="text-base tracking-[0.25em] uppercase font-light text-stone-800 mb-2">
                  OBRNHOMEN
                </p>
                <p className="text-xs text-stone-400 leading-relaxed max-w-xs">
                  El işçiliği ve özgün tasarımla hazırlanan özel hediye koleksiyonları.
                </p>
              </div>
              <div className="flex flex-col gap-2 text-xs tracking-widest uppercase text-stone-400">
                <Link href="/about" className="hover:text-stone-700 transition-colors">Hakkımızda</Link>
                <Link href="/returns" className="hover:text-stone-700 transition-colors">İade Şartları</Link>
                <Link href="/payment" className="hover:text-stone-700 transition-colors">Güvenli Ödeme</Link>
              </div>
            </div>
            <div className="border-t border-stone-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-stone-400">
              <span>© {new Date().getFullYear()} OBRNHOMEN. Tüm hakları saklıdır.</span>
              <span className="tracking-wide">obrnhomen.com</span>
            </div>
          </div>
        </footer>

        <FloatingWhatsApp />
      </body>
    </html>
  );
}
