import Link from "next/link";
import { IslamicStar } from "@/app/components/IslamicOrnament";

export default function OdemeHata() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(180deg, #f9f3ea 0%, #faf5ec 100%)" }}
    >
      <div className="text-center px-6 max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <IslamicStar size={24} color="#c9a84c" opacity={0.5} />
        </div>

        <h1 className="text-2xl font-light tracking-[0.2em] uppercase text-stone-700 mb-4">
          Ödeme Tamamlanamadı
        </h1>

        <p className="text-sm text-stone-400 leading-relaxed mb-8">
          İşleminiz tamamlanamadı. Kartınızı kontrol edip tekrar deneyebilir
          ya da WhatsApp üzerinden sipariş verebilirsiniz.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/checkout"
            className="px-8 py-3 text-xs tracking-[0.3em] uppercase text-white transition-colors"
            style={{ background: "#1a1208" }}
          >
            Tekrar Dene
          </Link>
          <a
            href="https://wa.me/905316893849"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 text-xs tracking-[0.3em] uppercase border border-stone-300 text-stone-500 hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
          >
            WhatsApp ile Sipariş Ver
          </a>
        </div>
      </div>
    </div>
  );
}
