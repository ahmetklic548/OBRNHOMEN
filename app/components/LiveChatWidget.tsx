"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
}

const BOT_GREETING: Message = {
  id: 0,
  from: "bot",
  text: "Merhaba! OBRNHOMEN destek hattına hoş geldiniz. Size nasıl yardımcı olabiliriz?",
};

export default function LiveChatWidget() {
  const [open, setOpen]       = useState(false);
  const [input, setInput]     = useState("");
  const [msgs, setMsgs]       = useState<Message[]>([BOT_GREETING]);
  const [sending, setSending] = useState(false);
  const bottomRef             = useRef<HTMLDivElement>(null);
  const inputRef              = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: Message = { id: Date.now(), from: "user", text };
    setMsgs(m => [...m, userMsg]);
    setInput("");
    setSending(true);

    // Bot auto-reply after 800ms, then redirect to WhatsApp
    setTimeout(() => {
      const botReply: Message = {
        id: Date.now() + 1,
        from: "bot",
        text: "Mesajınızı aldık. Sizi WhatsApp üzerinden yanıtlamak için yönlendiriyoruz...",
      };
      setMsgs(m => [...m, botReply]);
      setSending(false);

      setTimeout(() => {
        const encoded = encodeURIComponent(text);
        window.open(`https://wa.me/905316893849?text=${encoded}`, "_blank");
      }, 1200);
    }, 800);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") send();
  };

  return (
    <>
      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-[340px] rounded-2xl overflow-hidden"
            style={{
              background: "#ffffff",
              boxShadow: "0 8px 40px rgba(0,0,0,0.14), 0 2px 12px rgba(0,0,0,0.08)",
            }}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: "rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#1D1D1F", letterSpacing: "-0.01em" }}>
                    Canlı Destek
                  </p>
                  <p className="text-[10px]" style={{ color: "#86868B" }}>OBRNHOMEN</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-black/5"
                style={{ color: "#86868B" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="px-4 py-4 space-y-3 overflow-y-auto" style={{ maxHeight: 260, minHeight: 160 }}>
              {msgs.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                    style={
                      msg.from === "user"
                        ? { background: "#1D1D1F", color: "#ffffff", borderBottomRightRadius: 6 }
                        : { background: "#F5F5F7", color: "#1D1D1F", borderBottomLeftRadius: 6 }
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl" style={{ background: "#F5F5F7", borderBottomLeftRadius: 6 }}>
                    <div className="flex gap-1 items-center">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: "#86868B" }}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="flex items-center gap-2 px-4 py-3 border-t"
              style={{ borderColor: "rgba(0,0,0,0.06)" }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Mesajınızı yazın..."
                className="flex-1 text-sm bg-transparent outline-none placeholder:text-stone-300"
                style={{ color: "#1D1D1F" }}
              />
              <button
                onClick={send}
                disabled={!input.trim() || sending}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity disabled:opacity-30"
                style={{ background: "#1D1D1F" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: open ? "#1D1D1F" : "#1D1D1F",
          boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.2 }}
        aria-label="Canlı destek"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.svg
              key="close"
              width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2" strokeLinecap="round"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Unread dot */}
        {!open && (
          <span
            className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-emerald-400"
          />
        )}
      </motion.button>
    </>
  );
}
