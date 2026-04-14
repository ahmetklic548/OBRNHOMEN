import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "OBRNHOMEN", template: "%s | OBRNHOMEN" },
  description: "El işçiliği ve özgün tasarımla hazırlanan özel hediyeler.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="h-full">
      <body className="min-h-full flex flex-col">
        <header className="border-b border-stone-200 bg-stone-50">
          <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
            <Link href="/" className="text-xl tracking-[0.2em] uppercase font-light text-stone-800">
              OBRNHOMEN
            </Link>
            <nav className="flex gap-8 text-sm tracking-widest uppercase text-stone-500">
              <Link href="/" className="hover:text-stone-900 transition-colors">Koleksiyon</Link>
              <Link href="/about" className="hover:text-stone-900 transition-colors">Hakkımızda</Link>
              <Link href="/returns" className="hover:text-stone-900 transition-colors">İade</Link>
              <Link href="/payment" className="hover:text-stone-900 transition-colors">Güvenli Ödeme</Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-stone-200 bg-stone-50 mt-20">
          <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-stone-400 tracking-wide">
            <span>© {new Date().getFullYear()} OBRNHOMEN. Tüm hakları saklıdır.</span>
            <div className="flex gap-6">
              <Link href="/returns" className="hover:text-stone-600 transition-colors">İade Şartları</Link>
              <Link href="/payment" className="hover:text-stone-600 transition-colors">Güvenli Ödeme</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
