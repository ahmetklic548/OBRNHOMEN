"use client";

import { useState, useEffect, useRef, startTransition } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/components/CartContext";
import { useAuth } from "@/app/components/AuthProvider";
import { trackBeginCheckout } from "@/lib/analytics";
import Hint from "@/app/components/Hint";
import { WHATSAPP_URL } from "@/lib/storeNav";
import { FREE_SHIPPING_OVER, VALID_COUPONS, COD_FEE, orderTotals, unitPriceFor, tierPct } from "@/lib/pricing";
import { saveLastOrder, type LastOrder } from "@/lib/lastOrder";
import { qtyText } from "@/lib/pack";

type Step = "form" | "paying" | "error" | "done";

const STEPS = [
  { key: "form",   label: "Bilgiler",   num: 1 },
  { key: "paying", label: "Ödeme",      num: 2 },
  { key: "done",   label: "Tamamlandı", num: 3 },
];

export default function CheckoutPage() {
  const { items, total, ready, clear } = useCart();
  // Giriş zorunlu değil — misafir de ödeme yapabilir; girişliyse form profilden dolar.
  const { profile } = useAuth();
  const router   = useRouter();
  const iframeRef = useRef<HTMLDivElement>(null);

  const [couponInput,   setCouponInput]   = useState("");
  const [couponApplied, setCouponApplied] = useState<string | null>(null);
  const [couponError,   setCouponError]   = useState("");
  const [step,  setStep]  = useState<Step>("form");
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [payMethod, setPayMethod] = useState<"kart" | "kapida">("kart");
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [sending, setSending] = useState(false);

  const { discountRate, discountAmount, shipping, codFee, grandTotal } = orderTotals(total, couponApplied, payMethod === "kapida");
  // Ara toplam zaten kademeli; bilgi olarak kademesiz farkı göster
  const wholesaleSaving = Math.round((items.reduce((s, i) => s + i.price * i.qty, 0) - total) * 100) / 100;

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
    if (ready && items.length === 0 && step === "form") router.replace("/");
  }, [ready, items, step, router]);

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

  /** Başarı sayfasında özet + WhatsApp onayı için siparişi bu tarayıcıda sakla */
  const remember = (
    orderId: string,
    method: LastOrder["method"],
    o: { total: number; shipping: number; codFee: number; discountAmount: number; lines?: { name: string; sku?: string; qty: number; price: number; pack?: number }[] }
  ) => {
    saveLastOrder({
      orderId, method,
      lines: o.lines ?? items.map(i => ({ name: i.name, sku: i.code, qty: i.qty, price: unitPriceFor(i.price, i.qty), pack: i.packQty })),
      shipping: o.shipping, codFee: o.codFee, discountAmount: o.discountAmount, total: o.total,
      customer: { name: form.name, phone: form.phone, address: form.address },
      giftWrap, giftNote: giftNote.trim(), createdAt: Date.now(),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSending(true);
    const payload = {
      items:  items.map(i => ({ slug: i.slug, qty: i.qty })),
      coupon: couponApplied,
      ...form,
      giftWrap,
      giftNote: giftNote.trim(),
    };
    try {
      if (payMethod === "kapida") {
        // Kapıda ödeme: sipariş oluştur → başarı sayfasında WhatsApp'tan onaylanır
        const res = await fetch("/api/order-cod", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        const data = await res.json();
        if (!res.ok || !data.orderId) {
          setError(data.error ?? "Sipariş oluşturulamadı. Lütfen tekrar deneyin.");
          setStep("error");
          return;
        }
        remember(data.orderId, "kapida", data);
        setStep("done"); // sepet boşalınca ana sayfaya yönlendirme tetiklenmesin
        clear();
        router.push(`/odeme/basarili?oid=${data.orderId}&yontem=kapida`);
        return;
      }

      // Fiyatlar sunucuda ürün verisinden yeniden hesaplanır; burada sadece slug/adet gider.
      const res = await fetch("/api/paytr-token", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.token) {
        setError(data.error ?? "Ödeme başlatılamadı. Lütfen tekrar deneyin.");
        setStep("error");
        return;
      }
      setToken(data.token);
      const paidTotal = typeof data.total === "number" ? data.total : grandTotal;
      remember(data.merchant_oid, "kart", { total: paidTotal, shipping, codFee: 0, discountAmount });
      trackBeginCheckout(paidTotal, items.map(i => ({ slug: i.slug, name: i.name, price: i.price, qty: i.qty })));
      localStorage.setItem("obrnhomen-pending-total", String(paidTotal));
      setStep("paying");
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
      setStep("error");
    } finally {
      setSending(false);
    }
  };

  const currentIdx = STEPS.findIndex(s => s.key === (step === "error" ? "form" : step));

  return (
    <div className="min-h-screen pt-10 pb-20 px-6" style={{ background: "#fafaf8" }}>
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
                    className="w-6 h-6 flex items-center justify-center text-[13px] font-medium transition-all"
                    style={{
                      background: isDone ? "#c9a84c" : isActive ? "#0a0a0a" : "#e5e5e5",
                      color: isDone || isActive ? "#fff" : "#bbb",
                    }}
                  >
                    {isDone ? "✓" : num}
                  </div>
                  <span
                    className="text-[12px] tracking-[0.04em] uppercase"
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
          <p className="text-[12px] tracking-[0.04em] uppercase mb-3" style={{ color: "#c9a84c" }}>
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-lg border border-[#e9d9a6] bg-[#fffbf0] px-4 py-3 text-[14px] leading-relaxed text-[#5c4710]">
                <strong>Siparişiniz 2 adımda tamamlanır:</strong> ① Aşağıya bilgilerinizi yazın ② Kartla ya da kapıda ödemeyi seçip siparişi tamamlayın.
                Takıldığınız yerde <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="font-medium underline">WhatsApp&apos;tan yazın</a>, birlikte tamamlayalım.
              </div>

              {(
                [
                  { key: "name", label: "Adınız ve soyadınız", type: "text", placeholder: "Örnek: Ayşe Yılmaz", autoComplete: "name",
                    hint: "Kargo bu isme gönderilir. Paketi teslim alacak kişinin adını yazın." },
                  { key: "phone", label: "Cep telefonunuz", type: "tel", placeholder: "Örnek: 0532 123 45 67", autoComplete: "tel",
                    hint: "Kargo görevlisi teslimattan önce bu numarayı arar. Başında 0 olacak şekilde 11 hane yazın." },
                  { key: "email", label: "E-posta adresiniz", type: "email", placeholder: "Örnek: ayse@gmail.com", autoComplete: "email",
                    hint: "Sipariş özetiniz ve kargo takip bilgisi bu adrese gönderilir. E-postanız yoksa bir yakınınızınkini yazabilirsiniz." },
                ] as { key: keyof typeof form; label: string; type: string; placeholder: string; autoComplete: string; hint: string }[]
              ).map(({ key, label, type, placeholder, autoComplete, hint }) => (
                <div key={key}>
                  <label htmlFor={`f-${key}`} className="mb-2 flex items-center text-[15px] font-medium text-stone-800">
                    {label} <Hint>{hint}</Hint>
                  </label>
                  <input
                    id={`f-${key}`}
                    type={type}
                    required
                    autoComplete={autoComplete}
                    inputMode={type === "tel" ? "tel" : undefined}
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full rounded-md border bg-white px-4 py-3.5 text-[16px] focus:outline-none focus:border-black transition-colors"
                    style={{ borderColor: "#d6d3d1", color: "#0a0a0a" }}
                  />
                </div>
              ))}

              <div>
                <label htmlFor="f-address" className="mb-2 flex items-center text-[15px] font-medium text-stone-800">
                  Teslimat adresiniz
                  <Hint>Paketin geleceği açık adres. Mahalle, sokak/cadde, bina ve daire numarası, ilçe ve şehri yazmayı unutmayın.</Hint>
                </label>
                <textarea
                  id="f-address"
                  required
                  rows={3}
                  autoComplete="street-address"
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  placeholder="Örnek: Kocatepe Mah. Gül Sok. No: 5 Daire: 3, Çankaya / Ankara"
                  className="w-full rounded-md border bg-white px-4 py-3.5 text-[16px] focus:outline-none focus:border-black transition-colors resize-none"
                  style={{ borderColor: "#d6d3d1", color: "#0a0a0a" }}
                />
              </div>

              {/* Hediye */}
              <fieldset className="rounded-lg border border-stone-200 bg-white p-4">
                <label className="flex cursor-pointer items-start gap-3 text-[15px] text-stone-800">
                  <input type="checkbox" checked={giftWrap} onChange={e => setGiftWrap(e.target.checked)} className="mt-1 h-5 w-5 accent-[#9a7a2c]" />
                  <span>
                    <strong className="font-medium">🎁 Hediye paketi yapılsın</strong> <span className="text-stone-500">(ücretsiz)</span>
                    <span className="block text-[13px] text-stone-500">Fiyat etiketi çıkarılır, şık şekilde paketlenir.</span>
                  </span>
                </label>
                {giftWrap && (
                  <textarea
                    rows={2}
                    maxLength={300}
                    value={giftNote}
                    onChange={e => setGiftNote(e.target.value)}
                    placeholder="Hediye notu (isteğe bağlı) — örn: Hayırlı hac dönüşleri, Ayşe teyzen"
                    className="mt-3 w-full rounded-md border border-stone-300 px-3 py-2.5 text-[15px] focus:outline-none focus:border-black"
                  />
                )}
              </fieldset>

              {/* Ödeme yöntemi */}
              <fieldset>
                <legend className="mb-2 flex items-center text-[15px] font-medium text-stone-800">
                  Nasıl ödemek istersiniz?
                  <Hint>Kartla ödemede ödemeyi şimdi yaparsınız. Kapıda ödemede ürünü teslim alırken kargo görevlisine nakit veya kartla ödersiniz; kargo firması bunun için {COD_FEE} ₺ hizmet bedeli alır.</Hint>
                </legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {([
                    ["kart", "💳 Kartla öde", "Kredi/banka kartı, taksit imkânı"],
                    ["kapida", "🚚 Kapıda öde", `Teslimatta nakit/kart · +${COD_FEE} ₺`],
                  ] as const).map(([v, t, d]) => (
                    <label
                      key={v}
                      className="flex cursor-pointer items-start gap-3 rounded-lg border-2 bg-white p-4 transition-colors"
                      style={{ borderColor: payMethod === v ? "#0a0a0a" : "#e7e5e4" }}
                    >
                      <input type="radio" name="pay" checked={payMethod === v} onChange={() => setPayMethod(v)} className="mt-1 h-5 w-5 accent-black" />
                      <span><span className="block text-[16px] font-medium text-stone-900">{t}</span><span className="block text-[13px] text-stone-500">{d}</span></span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-md py-4 text-[16px] font-semibold text-white transition-opacity hover:opacity-85 disabled:opacity-60"
                style={{ background: "#0a0a0a" }}
              >
                {sending
                  ? "Lütfen bekleyin…"
                  : payMethod === "kapida"
                    ? `Siparişi Tamamla (${grandTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺ kapıda) →`
                    : "Kart Bilgilerine Geç →"}
              </button>

              <p className="flex items-center justify-center gap-2 text-center text-[13px] text-stone-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                {payMethod === "kapida"
                  ? "Siparişinizi son adımda WhatsApp'tan tek dokunuşla onaylayacaksınız."
                  : "Kart bilgileriniz PayTR güvenli ödeme sayfasında girilir, bizde saklanmaz."}
              </p>
            </form>

            {/* Right — Order summary */}
            <div>
              <p className="text-[12px] tracking-[0.04em] uppercase mb-5" style={{ color: "#999" }}>
                Sipariş Özeti
              </p>

              <div className="space-y-3 mb-5">
                {items.map(item => (
                  <div key={item.slug} className="flex justify-between text-sm gap-2">
                    <span className="line-clamp-1 flex-1" style={{ color: "#555" }}>
                      {item.name}{" "}
                      <span style={{ color: "#bbb" }}>× {qtyText(item.qty, item.packQty)}</span>
                    </span>
                    <span className="shrink-0" style={{ color: "#0a0a0a" }}>
                      {(unitPriceFor(item.price, item.qty) * item.qty).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                      {tierPct(item.qty) > 0 && (
                        <span className="ml-1 text-[13px]" style={{ color: "#9a7a2c" }}>(-%{tierPct(item.qty)})</span>
                      )}
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
                      className="px-4 py-2 text-[12px] tracking-[0.04em] uppercase text-white transition-opacity hover:opacity-75"
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
                      className="text-[12px] underline transition-opacity hover:opacity-50"
                      style={{ color: "#999" }}
                    >
                      Kaldır
                    </button>
                  </div>
                )}
                {couponError && <p className="text-[13px] mt-1" style={{ color: "#dc2626" }}>{couponError}</p>}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2.5 mb-4" style={{ borderColor: "#efefef" }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#999" }}>Ara Toplam</span>
                  <span style={{ color: "#555" }}>{total.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺</span>
                </div>
                {wholesaleSaving > 0 && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "#9a7a2c" }}>Toptan kazancınız</span>
                    <span style={{ color: "#9a7a2c" }}>{wholesaleSaving.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "#16a34a" }}>İndirim (%{discountRate})</span>
                    <span style={{ color: "#16a34a" }}>-{discountAmount.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺</span>
                  </div>
                )}
                {codFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "#999" }}>Kapıda ödeme bedeli</span>
                    <span style={{ color: "#555" }}>{codFee.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#999" }}>Kargo</span>
                  {shipping === 0
                    ? <span className="text-xs" style={{ color: "#16a34a" }}>Ücretsiz</span>
                    : <span style={{ color: "#555" }}>{shipping.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺</span>
                  }
                </div>
              </div>

              {/* Grand total */}
              <div className="border-t pt-4 flex justify-between items-baseline" style={{ borderColor: "#0a0a0a" }}>
                <span className="text-[12px] tracking-[0.04em] uppercase" style={{ color: "#555" }}>Ödenecek</span>
                <span
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 400,
                    fontFamily: "var(--font-playfair, 'Playfair Display'), Georgia, serif",
                    color: "#0a0a0a",
                  }}
                >
                  {grandTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                </span>
              </div>

              {/* Free shipping nudge */}
              {shipping > 0 && (
                <div className="mt-4 p-3 border-l-2 text-xs leading-relaxed" style={{ borderColor: "#c9a84c", background: "#fffbf0", color: "#7a5f1a" }}>
                  {(FREE_SHIPPING_OVER - total).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺ daha ekleyin, kargo ücretsiz olsun!
                </div>
              )}

              {/* Payment info */}
              <div className="mt-5 p-4 border" style={{ borderColor: "#efefef", background: "#ffffff" }}>
                <p className="text-[12px] tracking-[0.04em] uppercase mb-1" style={{ color: "#999" }}>
                  Ödeme Yöntemleri
                </p>
                <p className="text-[13px] leading-relaxed text-stone-500">
                  Kartla (PayTR güvenli ödeme, taksit imkânı) veya kapıda nakit/kart ile ödeyebilirsiniz.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PAYTR IFRAME */}
        {step === "paying" && (
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <div ref={iframeRef} className="w-full min-h-[540px]">
              <div className="flex items-center justify-center h-40">
                <p className="text-[15px] animate-pulse text-stone-400">Güvenli ödeme ekranı yükleniyor…</p>
              </div>
            </div>
            <CardHelp />
          </div>
        )}

        {/* ERROR */}
        {step === "error" && (
          <div className="text-center py-20">
            <p className="text-sm mb-6" style={{ color: "#555" }}>{error}</p>
            <button
              onClick={() => setStep("form")}
              className="text-[12px] tracking-[0.04em] uppercase border px-6 py-3 transition-colors hover:bg-black hover:text-white"
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

/** Kart bilgisi girerken yanda duran rehber — PayTR ekranı iframe olduğu için içine yazamıyoruz */
function CardHelp() {
  const steps: [string, string][] = [
    ["Kart üzerindeki isim", "Kartın ön yüzünde yazan adınız soyadınız. Büyük-küçük harf fark etmez."],
    ["Kart numarası", "Kartın ön yüzündeki 16 haneli numara. Boşluk bırakmadan yazabilirsiniz."],
    ["Son kullanma tarihi", "Kartın önünde 'AA/YY' şeklinde yazar. Örneğin 08/28 → Ay: 08, Yıl: 28."],
    ["Güvenlik kodu (CVV)", "Kartın ARKA yüzünde, imza bandının yanındaki 3 haneli sayı."],
    ["Taksit", "İsterseniz taksit seçebilirsiniz; tek çekim için 'Tek Çekim'i seçin."],
    ["SMS onay kodu", "Ödeme düğmesine bastıktan sonra bankanız telefonunuza bir kod gönderir. O kodu açılan ekrana yazın. Bu, kartınızı sizin kullandığınızı doğrular."],
  ];
  return (
    <aside className="h-fit rounded-xl border border-stone-200 bg-[#faf9f6] p-5 text-stone-800">
      <p className="text-[16px] font-semibold">Kart bilgilerini nasıl gireceğim?</p>
      <div className="mt-4 flex gap-3" aria-hidden="true">
        <div className="relative h-24 flex-1 rounded-lg bg-gradient-to-br from-stone-700 to-stone-900 p-2.5 text-white shadow">
          <div className="h-4 w-6 rounded-sm bg-amber-300/90" />
          <p className="mt-2.5 font-mono text-[11px] tracking-wider">1234 5678 9012 3456</p>
          <div className="mt-1 flex justify-between font-mono text-[9px] text-white/80"><span>AYŞE YILMAZ</span><span>08/28</span></div>
          <span className="absolute -top-2 left-2 rounded bg-amber-400 px-1 text-[9px] font-bold text-black">ÖN</span>
        </div>
        <div className="relative h-24 flex-1 rounded-lg bg-gradient-to-br from-stone-600 to-stone-800 shadow">
          <div className="mt-3 h-4 bg-black" />
          <div className="mx-2 mt-2.5 flex items-center justify-end rounded-sm bg-white px-1.5 py-0.5">
            <span className="font-mono text-[11px] font-bold text-black ring-2 ring-amber-400">123</span>
          </div>
          <span className="absolute -top-2 left-2 rounded bg-amber-400 px-1 text-[9px] font-bold text-black">ARKA</span>
        </div>
      </div>
      <ol className="mt-5 space-y-3.5">
        {steps.map(([t, d], i) => (
          <li key={t} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-900 text-[12px] font-semibold text-white">{i + 1}</span>
            <span><span className="block text-[14px] font-medium">{t}</span><span className="block text-[13px] leading-relaxed text-stone-600">{d}</span></span>
          </li>
        ))}
      </ol>
      <p className="mt-5 rounded-md bg-white p-3 text-[13px] leading-relaxed text-stone-600">
        🔒 Kart bilgileriniz doğrudan bankaya/PayTR&apos;ye gider, biz göremeyiz. Sorun yaşarsanız{" "}
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-[#1f9d55] underline">WhatsApp&apos;tan yazın</a>.
      </p>
    </aside>
  );
}
