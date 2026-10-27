import Link from "next/link";
import { IslamicStar, IslamicDivider } from "@/app/components/IslamicOrnament";
import PurchaseTracker from "@/app/components/PurchaseTracker";
import OrderConfirmation from "./OrderConfirmation";

export default function OdemeBasarili() {
  return (
    <>
    <PurchaseTracker />
    <div
      className="min-h-screen flex flex-col items-center justify-center py-12"
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
        <p className="text-[13px] tracking-[0.04em] uppercase mb-8" style={{ color: "rgba(139,105,20,0.6)" }}>
          Elhamdülillah
        </p>

        <IslamicDivider color="#c9a84c" className="mb-6 opacity-50" />
      </div>
      <OrderConfirmation />
    </div>
    </>
  );
}
