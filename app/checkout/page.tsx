"use client";

import { useState, useEffect, useRef, startTransition } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/components/CartContext";
import { useAuth } from "@/app/components/AuthProvider";

const SHIPPING_FEE       = 200;
const FREE_SHIPPING_OVER = 1000;
const VALID_COUPONS: Record<string, number> = { HOSGELDIN10: 10 };

type Step = "form" | "paying" | "error";

const STEPS = [
  { key: "form",   label: "Bilgiler",   num: 1 },
  { key: "paying", label: "Ödeme",      num: 2 },
  { key: "done",   label: "Tamamlandı", num: 3 },
];

export default function CheckoutPage() {
  const { items, total } = useCart();
  const { user, profile, loading: authLoading } = useAuth();
  const router   = useRouter();
  const iframeRef = useRef<HTMLDivElement>(null);

  const [couponInput,   setCouponInput]   = useState("");
  const [couponApplied, setCouponApplied] = useState<string | null>(null);
  const [couponError,   setCouponError]   = useState("");
  const [step,  setStep]  = useState<Step>("form");
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });

  const discountRate   = couponApplied ? (VALID_COUPONS[couponApplied] ?? 0) : 0;
  const discountAmount = Math.round(total * discountRate / 100);
  const shipping       = total >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
  const grandTotal     = total - discountAmount + shipping;

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (VALID_COUPONS[code]) {
      setCouponApplied(code);
      setCouponError("");
    } else {
      setCouponError("Geçersiz kupon kodu.");
      setCouponApplied(null);
    }
  };

  useEffect(() => {
    if (profile) {
      startTransition(() => setForm(f => ({
        ...f,
        name:    profile.name    || f.name,
        phone:   profile.phone   || f.phone,
        address: profile.address || f.address,
      })));
    }
  }, [profile]);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/hesap");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (items.length === 0 && step === "form") router.replace("/");
  }, [items, step, router]);

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
    const basketItems = shipping > 0
      ? [...items, { name: "Kargo Ücreti", price: shipping, qty: 1 }]
      : items;
    try {
      const res = await fetch("/api/paytr-token", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ items: basketItems, total: grandTotal, ...form }),
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

  const currentIdx = STEPS.findIndex(s => s.key === (step === "error" ? "form" : step));

  return (
    <div className="min-h-screen pt-32 pb-20 px-6" style={{ background: "#fafaf8" }}>
      <div className="max-w-5xl mx-auto">

        {/* Progress steps */}
        <div className="flex items-center justify-center gap-0 mb-14">
          {STEPS.map(({ key, label, num }, i) => {
            const stepIdx  = STEPS.findIndex(s => s.key === key);
            const isActive = stepIdx === currentIdx;
            const isDone   = stepIdx < currentIdx;
            return (
              <div key={key} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-6 h-6 flex items-center justify-center text-[10px] font-medium transition-all"
                    style={{
                      background: isDone ? "#c9a84c" : isActive ? "#0a0a0a" : "#e5e5e5",
                      color: isDone || isActive ? "#fff" : "#bbb",
                    }}
                  >
                    {isDone ? "✓" : num}
                  </div>
                  <span
                    className="text-[8px] tracking-[0.25em] uppercase"
                    style={{ color: isActive ? "#0a0a0a" : "#bbb" }}
                  >
                    {label}
                  </span>
                </div>
                {i < 2 && (
                  <div
                    className="w-16 h-px mx-3 mb-4"
                    style={{ background: isDone ? "#c9a84c" : "#e5e5e5" }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Page title */}
        <div className="mb-10">
          <p className="text-[9px] tracking-[0.55em] uppercase mb-3" style={{ color: "#c9a84c" }}>
            OBRNHOMEN
          </p>
          <h1
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 400,
              fontFamily: "var(--font-playfair, 'Playfair Display'), Georgia, serif",
              color: "#0a0a0a",
              lineHeight: 1.1,
            }}
          >
            {step === "paying" ? "Güvenli Ödeme" : "Sipariş Bilgileri"}
          </h1>
          <div className="mt-4 h-px" style={{ background: "#e8e8e8" }} />
        </div>

        {/* FORM */}
        {step === "form" && (
          <div className="grid md:grid-cols-[1fr_360px] gap-10">

            {/* Left — Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {(
                [
                  { key: "name",    label: "Ad Soyad",         type: "text",  placeholder: "Ahmet Yılmaz" },
                  { key: "email",   label: "E-posta",           type: "email", placeholder: "ahmet@ornek.com" },
                  { key: "phone",   label: "Telefon",           type: "tel",   placeholder: "05xx xxx xx xx" },
                ] as { key: keyof typeof form; label: string; type: string; placeholder: string }[]
              ).map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-[9px] tracking-[0.35em] uppercase mb-2" style={{ color: "#999" }}>
                    {label}
                  </label>
                  <input
                    type={type}
                    required
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full border bg-white px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                    style={{ borderColor: "#e0e0e0", color: "#0a0a0a" }}
                  />
                </div>
              ))}

              <div>
                <label className="block text-[9px] tracking-[0.35em] uppercase mb-2" style={{ color: "#999" }}>
                  Teslimat Adresi
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  placeholder="Mahalle, cadde, no, ilçe, şehir"
                  className="w-full border bg-white px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
                  style={{ borderColor: "#e0e0e0", color: "#0a0a0a" }}
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 text-[10px] tracking-[0.3em] uppercase font-medium text-white transition-opacity hover:opacity-75"
                style={{ background: "#0a0a0a" }}
              >
                Ödemeye Geç →
              </button>

              <p className="text-[9px] tracking-wide text-center" style={{ color: "#bbb" }}>
                256-bit SSL ile şifrelenmiş güvenli ödeme
              </p>
            </form>

            {/* Right — Order summary */}
            <div>
              <p className="text-[9px] tracking-[0.4em] uppercase mb-5" style={{ color: "#999" }}>
                Sipariş Özeti
              </p>

              <div className="space-y-3 mb-5">
                {items.map(item => (
                  <div key={item.slug} className="flex justify-between text-sm gap-2">
                    <span className="line-clamp-1 flex-1" style={{ color: "#555" }}>
                      {item.name}{" "}
                      <span style={{ color: "#bbb" }}>x{item.qty}</span>
                    </span>
                    <span className="shrink-0" style={{ color: "#0a0a0a" }}>
                      {(item.price * item.qty).toLocaleString("tr-TR")} ₺
                    </span>
                  </div>
                ))}
              </div>

              {/* Kupon */}
              <div className="border-t pt-4 mb-4" style={{ borderColor: "#efefef" }}>
                {!couponApplied ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={e => { setCouponInput(e.target.value); setCouponError(""); }}
                      placeholder="Kupon kodu"
                      className="flex-1 border bg-white px-3 py-2 text-xs focus:outline-none focus:border-black transition-colors uppercase"
                      style={{ borderColor: "#e0e0e0", color: "#0a0a0a" }}
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      className="px-4 py-2 text-[9px] tracking-[0.2em] uppercase text-white transition-opacity hover:opacity-75"
                      style={{ background: "#0a0a0a" }}
                    >
                      Uygula
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "#16a34a" }}>✓ {couponApplied} uygulandı</span>
                    <button
                      type="button"
                      onClick={() => { setCouponApplied(null); setCouponInput(""); }}
                      className="text-[9px] underline transition-opacity hover:opacity-50"
                      style={{ color: "#999" }}
                    >
                      Kaldır
                    </button>
                  </div>
                )}
                {couponError && <p className="text-[10px] mt-1" style={{ color: "#dc2626" }}>{couponError}</p>}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2.5 mb-4" style={{ borderColor: "#efefef" }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#999" }}>Ara Toplam</span>
                  <span style={{ color: "#555" }}>{total.toLocaleString("tr-TR")} ₺</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "#16a34a" }}>İndirim (%{discountRate})</span>
                    <span style={{ color: "#16a34a" }}>-{discountAmount.toLocaleString("tr-TR")} ₺</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#999" }}>Kargo</span>
                  {shipping === 0
                    ? <span className="text-xs" style={{ color: "#16a34a" }}>Ücretsiz</span>
                    : <span style={{ color: "#555" }}>{shipping.toLocaleString("tr-TR")} ₺</span>
                  }
                </div>
              </div>

              {/* Grand total */}
              <div className="border-t pt-4 flex justify-between items-baseline" style={{ borderColor: "#0a0a0a" }}>
                <span className="text-[9px] tracking-[0.35em] uppercase" style={{ color: "#555" }}>Ödenecek</span>
                <span
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 400,
                    fontFamily: "var(--font-playfair, 'Playfair Display'), Georgia, serif",
                    color: "#0a0a0a",
                  }}
                >
                  {grandTotal.toLocaleString("tr-TR")} ₺
                </span>
              </div>

              {/* Free shipping nudge */}
              {shipping > 0 && (
                <div className="mt-4 p-3 border-l-2 text-xs leading-relaxed" style={{ borderColor: "#c9a84c", background: "#fffbf0", color: "#7a5f1a" }}>
                  {(FREE_SHIPPING_OVER - total).toLocaleString("tr-TR")} ₺ daha ekleyin, kargo ücretsiz olsun!
                </div>
              )}

              {/* Payment info */}
              <div className="mt-5 p-4 border" style={{ borderColor: "#efefef", background: "#ffffff" }}>
                <p className="text-[9px] tracking-[0.3em] uppercase mb-1" style={{ color: "#999" }}>
                  Ödeme Yöntemleri
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#aaa" }}>
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
              <p className="text-[10px] tracking-[0.3em] uppercase animate-pulse" style={{ color: "#bbb" }}>
                Yükleniyor...
              </p>
            </div>
          </div>
        )}

        {/* ERROR */}
        {step === "error" && (
          <div className="text-center py-20">
            <p className="text-sm mb-6" style={{ color: "#555" }}>{error}</p>
            <button
              onClick={() => setStep("form")}
              className="text-[9px] tracking-[0.3em] uppercase border px-6 py-3 transition-colors hover:bg-black hover:text-white"
              style={{ borderColor: "#0a0a0a", color: "#0a0a0a" }}
            >
              Tekrar Dene
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
