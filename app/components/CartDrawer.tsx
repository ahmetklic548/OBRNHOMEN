"use client";
import { motion, AnimatePresence } from "framer-motion";
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
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400">Sepet</p>
                <p className="text-sm font-medium text-stone-800">{count} ürün</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-700 transition-colors"
                aria-label="Kapat"
              >
                ✕
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-stone-300 text-4xl mb-4">◻</p>
                  <p className="text-xs tracking-widest uppercase text-stone-400">Sepetiniz boş</p>
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
              <div className="px-6 py-6 border-t border-stone-200">
                <div className="flex justify-between items-center mb-5">
                  <span className="text-xs tracking-widest uppercase text-stone-400">Toplam</span>
                  <span className="text-xl font-light text-stone-900">
                    {total.toLocaleString("tr-TR")} ₺
                  </span>
                </div>
                <a
                  href={`https://wa.me/905316893849?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { clear(); onClose(); }}
                  className="block w-full py-4 bg-stone-900 text-white text-xs tracking-[0.2em] uppercase text-center hover:bg-stone-700 transition-colors duration-200 mb-3"
                >
                  WhatsApp ile Sipariş Ver
                </a>
                <button
                  onClick={clear}
                  className="block w-full text-center text-xs text-stone-400 hover:text-stone-600 transition-colors py-1 tracking-wide"
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
