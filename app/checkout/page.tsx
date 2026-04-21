"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/components/CartContext";
import { useAuth } from "@/app/components/AuthProvider";
import { IslamicStar, IslamicDivider } from "@/app/components/IslamicOrnament";

type Step = "form" | "paying" | "error";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { profile } = useAuth();
  const router = useRouter();
  const iframeRef = useRef<HTMLDivElement>(null);

  const [step,  setStep]  = useState<Step>("form");
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const [form, setForm] = useState({
    name:    "",
    email:   "",
    phone:   "",
    address: "",
  });

  /* Profil varsa formu otomatik doldur */
  useEffect(() => {
    if (profile) {
      setForm(f => ({
        ...f,
        name:    profile.name    || f.name,
        phone:   profile.phone   || f.phone,
        address: profile.address || f.address,
      }));
    }
  }, [profile]);

  /* Sepet boşsa anasayfaya yönlendir */
  useEffect(() => {
    if (items.length === 0 && step === "form") router.replace("/");
  }, [items, step, router]);

  /* PayTR iFrame scripti enjekte et */
  useEffect(() => {
    if (step !== "paying" || !token || !iframeRef.current) return;
    iframeRef.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://www.paytr.com/js/iframeResizer.min.js";
    script.onload = () => {
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.paytr.com/odeme/guvenli/${token}`;
      iframe.id = "paytriframe";
      iframe.frameBorder = "0";
      iframe.scrolling = "no";
      iframe.style.cssText = "width:100%;height:540px;border:none;";
      iframeRef.current!.appendChild(iframe);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).iFrameResize) (window as any).iFrameResize({}, "#paytriframe");
    };
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, [step, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/paytr-token", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ items, total, ...form }),
      });

      const data = await res.json();

      if (!res.ok || !data.token) {
        setError(data.error ?? "Ödeme başlatılamadı. Lütfen tekrar deneyin.");
        setStep("error");
        return;
      }

      setToken(data.token);
      setStep("paying");
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
      setStep("error");
    }
  };

  const field = (key: keyof typeof form, label: string, type = "text", placeholder = "") => (
    <div>
      <label className="block text-[10px] tracking-[0.3em] uppercase text-stone-400 mb-2">
        {label}
      </label>
      <input
        type={type}
        required
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus:outline-none focus:border-[#c9a84c] transition-colors"
      />
    </div>
  );

  return (
    <div
      className="min-h-screen py-16"
      style={{ background: "linear-gradient(180deg, #f9f3ea 0%, #faf5ec 100%)" }}
    >
      <div className="absolute inset-0 opacity-[0.035] islamic-pattern pointer-events-none" style={{ zIndex: 0 }} />

      <div className="relative z-10 max-w-2xl mx-auto px-6">

        {/* Başlık */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, #c9a84c)" }} />
            <IslamicStar size={18} color="#c9a84c" opacity={0.8} />
            <div className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, #c9a84c)" }} />
          </div>
          <h1 className="text-2xl tracking-[0.3em] uppercase font-light text-stone-800 mb-2">
            {step === "paying" ? "Güvenli Ödeme" : "Sipariş Bilgileri"}
          </h1>
          <IslamicDivider color="#c9a84c" className="mt-4 opacity-40" />
        </div>

        {/* FORM */}
        {step === "form" && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Sol — Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {field("name",    "Ad Soyad",    "text",  "Ahmet Yılmaz")}
              {field("email",   "E-posta",     "email", "ahmet@ornek.com")}
              {field("phone",   "Telefon",     "tel",   "05xx xxx xx xx")}
              <div>
                <label className="block text-[10px] tracking-[0.3em] uppercase text-stone-400 mb-2">
                  Teslimat Adresi
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  placeholder="Mahalle, cadde, no, ilçe, şehir"
                  className="w-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus:outline-none focus:border-[#c9a84c] transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 text-white text-xs tracking-[0.3em] uppercase transition-colors duration-200"
                style={{ background: "#1a1208" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#2d1f0a")}
                onMouseLeave={e => (e.currentTarget.style.background = "#1a1208")}
              >
                Ödemeye Geç →
              </button>
              <p className="text-[10px] text-stone-400 text-center tracking-wide">
                256-bit SSL ile şifrelenmiş güvenli ödeme
              </p>
            </form>

            {/* Sağ — Sipariş özeti */}
            <div>
              <p className="text-[10px] tracking-[0.35em] uppercase text-stone-400 mb-4">Sipariş Özeti</p>
              <div className="space-y-3 mb-6">
                {items.map(item => (
                  <div key={item.slug} className="flex justify-between text-sm">
                    <span className="text-stone-600 line-clamp-1 flex-1 mr-2">
                      {item.name} <span className="text-stone-400">x{item.qty}</span>
                    </span>
                    <span className="text-stone-800 shrink-0">
                      {(item.price * item.qty).toLocaleString("tr-TR")} ₺
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-stone-200 pt-4 flex justify-between">
                <span className="text-xs tracking-widest uppercase text-stone-400">Toplam</span>
                <span className="text-lg font-light text-stone-900">
                  {total.toLocaleString("tr-TR")} ₺
                </span>
              </div>
              <div className="mt-6 p-4 border border-[#c9a84c]/20" style={{ background: "rgba(201,168,76,0.04)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <IslamicStar size={12} color="#c9a84c" opacity={0.7} />
                  <p className="text-[10px] tracking-widest uppercase text-stone-500">Ödeme Yöntemleri</p>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Kredi kartı, banka kartı ve taksit seçenekleri PayTR altyapısıyla güvenle sunulmaktadır.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PAYTR IFRAME */}
        {step === "paying" && (
          <div ref={iframeRef} className="w-full min-h-[540px]">
            <div className="flex items-center justify-center h-40">
              <p className="text-xs tracking-widest uppercase text-stone-400 animate-pulse">
                Yükleniyor...
              </p>
            </div>
          </div>
        )}

        {/* HATA */}
        {step === "error" && (
          <div className="text-center py-16">
            <p className="text-stone-500 mb-2 text-sm">{error}</p>
            <button
              onClick={() => setStep("form")}
              className="mt-4 text-xs tracking-widest uppercase underline text-stone-400 hover:text-stone-700"
            >
              Tekrar Dene
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
