"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "./CartContext";
import Image from "next/image";

const springConfig = { type: "spring", stiffness: 320, damping: 32, mass: 0.8 } as const;

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, remove, clear, total, count } = useCart();
  const router = useRouter();

  const waText = encodeURIComponent(
    "Merhaba! OBRNHOMEN'den sipariş vermek istiyorum:\n\n" +
      items
        .map((i) => `• ${i.name} (x${i.qty}) — ${(i.price * i.qty).toLocaleString("tr-TR")} ₺`)
        .join("\n") +
      `\n\nToplam: ${total.toLocaleString("tr-TR")} ₺\n\nAdres ve ödeme bilgilerini paylaşabilir misiniz?`
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.4)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            className="fixed top-0 right-0 h-full w-full max-w-sm z-50 flex flex-col"
            style={{ background: "#fff" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={springConfig}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "#efefef" }}>
              <div>
                <p className="text-[9px] tracking-[0.4em] uppercase mb-0.5" style={{ color: "#999" }}>Sepet</p>
                <p className="text-sm" style={{ color: "#0a0a0a" }}>{count} ürün</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-50"
                aria-label="Kapat"
                style={{ color: "#999" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {items.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center gap-4">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e5e5e5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                  <div>
                    <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">Sepetiniz boş</p>
                    <p className="text-[11px] text-stone-300">Koleksiyonumuza göz atın</p>
                  </div>
                  <Link
                    href="/koleksiyon"
                    onClick={onClose}
                    className="mt-2 px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-opacity hover:opacity-75"
                    style={{ background: "#0a0a0a", color: "#ffffff" }}
                  >
                    Koleksiyonu Gör
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.slug} className="flex gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0 bg-stone-100 overflow-hidden">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300 text-xl">◻</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-stone-700 leading-snug line-clamp-2 mb-1">{item.name}</p>
                      <p className="text-xs text-stone-400">x{item.qty} · {(item.price * item.qty).toLocaleString("tr-TR")} ₺</p>
                    </div>
                    <button
                      onClick={() => remove(item.slug)}
                      className="text-stone-300 hover:text-red-400 transition-colors text-sm flex-shrink-0 mt-1"
                      aria-label="Kaldır"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-6 border-t" style={{ borderColor: "#efefef" }}>
                <div className="flex justify-between items-center mb-5">
                  <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: "#999" }}>Toplam</span>
                  <span
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: 400,
                      fontFamily: "var(--font-playfair, 'Playfair Display'), Georgia, serif",
                      color: "#0a0a0a",
                    }}
                  >
                    {total.toLocaleString("tr-TR")} ₺
                  </span>
                </div>
                <button
                  onClick={() => { onClose(); router.push("/checkout"); }}
                  className="block w-full py-4 text-[10px] tracking-[0.25em] uppercase text-center transition-opacity hover:opacity-75 mb-3"
                  style={{ background: "#0a0a0a", color: "#ffffff" }}
                >
                  Güvenli Ödeme Yap
                </button>

                <a
                  href={`https://wa.me/905316893849?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 border text-[10px] tracking-[0.2em] uppercase text-center transition-colors duration-200 mb-3 hover:border-black hover:text-black"
                  style={{ borderColor: "#e0e0e0", color: "#888" }}
                >
                  WhatsApp ile Sipariş Ver
                </a>
                <button
                  onClick={clear}
                  className="block w-full text-center text-[9px] tracking-widest uppercase transition-opacity hover:opacity-50 py-1"
                  style={{ color: "#bbb" }}
                >
                  Sepeti Temizle
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
