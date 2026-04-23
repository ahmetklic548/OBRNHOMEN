"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail]     = useState("");
  const [done, setDone]       = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("nl_seen")) return;
    const t = setTimeout(() => setVisible(true), 10000);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    sessionStorage.setItem("nl_seen", "1");
    setVisible(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await setDoc(doc(db, "newsletter", email), {
        email,
        createdAt: new Date().toISOString(),
        source: "popup",
      });
    } finally {
      setLoading(false);
      setDone(true);
      sessionStorage.setItem("nl_seen", "1");
      setTimeout(close, 2500);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[90] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-x-4 bottom-6 sm:inset-auto sm:left-1/2 sm:bottom-auto sm:top-1/2 sm:w-[440px] z-[91] rounded-2xl overflow-hidden"
            style={{
              background: "#ffffff",
              boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
            }}
            initial={{ opacity: 0, y: 40, x: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Gold top bar */}
            <div className="h-1.5 w-full" style={{ background: "linear-gradient(to right, #c9a84c, #e8c96d, #c9a84c)" }} />

            <div className="px-8 py-8">
              {/* Close */}
              <button
                onClick={close}
                className="absolute top-5 right-5 w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-black/5"
                style={{ color: "#86868B" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {!done ? (
                <>
                  <p className="text-[10px] tracking-[0.4em] uppercase font-medium mb-3" style={{ color: "#c9a84c" }}>
                    Özel Teklif
                  </p>
                  <h2 className="font-semibold mb-2" style={{ fontSize: "1.5rem", letterSpacing: "-0.02em", color: "#1D1D1F" }}>
                    İlk Siparişinde<br />%10 İndirim
                  </h2>
                  <p className="text-sm mb-6" style={{ color: "#86868B" }}>
                    E-posta adresini bırak, kampanyalardan ve yeni ürünlerden ilk sen haberdar ol.
                  </p>

                  <form onSubmit={submit} className="flex gap-2">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="E-posta adresin"
                      className="flex-1 px-4 py-3 rounded-full text-sm outline-none border"
                      style={{ borderColor: "rgba(0,0,0,0.12)", color: "#1D1D1F" }}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-5 py-3 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
                      style={{ background: "#1D1D1F" }}
                    >
                      {loading ? "..." : "Kaydol"}
                    </button>
                  </form>

                  <p className="text-[10px] mt-3 text-center" style={{ color: "#86868B" }}>
                    İstediğin zaman abonelikten çıkabilirsin.
                  </p>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#f0fdf4" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="font-semibold mb-1" style={{ color: "#1D1D1F" }}>Teşekkürler!</p>
                  <p className="text-sm" style={{ color: "#86868B" }}>İndirim kodun e-postana gönderildi.</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
