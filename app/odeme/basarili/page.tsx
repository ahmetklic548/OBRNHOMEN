import Link from "next/link";
import { IslamicStar, IslamicDivider } from "@/app/components/IslamicOrnament";
import PurchaseTracker from "@/app/components/PurchaseTracker";

export default function OdemeBasarili() {
  return (
    <>
    <PurchaseTracker />
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(180deg, #f9f3ea 0%, #faf5ec 100%)" }}
    >
      <div className="text-center px-6 max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, #c9a84c)" }} />
          <IslamicStar size={32} color="#c9a84c" opacity={0.9} />
          <div className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, #c9a84c)" }} />
        </div>

        <p
          className="text-xl mb-3 leading-loose"
          style={{ color: "#8b6914", fontFamily: "Georgia, serif", direction: "rtl" }}
        >
          الْحَمْدُ لِلَّهِ
        </p>
        <p className="text-[10px] tracking-[0.35em] uppercase mb-8" style={{ color: "rgba(139,105,20,0.6)" }}>
          Elhamdülillah
        </p>

        <h1 className="text-2xl font-light tracking-[0.2em] uppercase text-stone-800 mb-4">
          Ödemeniz Alındı
        </h1>

        <IslamicDivider color="#c9a84c" className="mb-6 opacity-50" />

        <p className="text-sm text-stone-500 leading-relaxed mb-8">
          Siparişiniz başarıyla oluşturuldu. En kısa sürede kargoya verilecek ve
          bilgilendirileceksiniz. Teşekkür ederiz.
        </p>

        <Link
          href="/koleksiyon"
          className="inline-block px-8 py-3 text-xs tracking-[0.3em] uppercase text-white transition-colors"
          style={{ background: "#1a1208" }}
        >
          Alışverişe Devam Et
        </Link>
      </div>
    </div>
    </>
  );
}
