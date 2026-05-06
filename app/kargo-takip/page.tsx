"use client";

import { useState } from "react";
import type { Metadata } from "next";

const CARGO_LINKS: Record<string, string> = {
  yurtici:  "https://www.yurticikargo.com/tr/online-islemler/gonderi-sorgula?code=",
  aras:     "https://www.araskargo.com.tr/tr/kargo-takip?trackingNumber=",
  mng:      "https://www.mngkargo.com.tr/wps/portal/mng/musteri/gonderiTakip?BARKOD_NO=",
  ptt:      "https://www.ptt.gov.tr/tr/anasayfa/kargotakip?barcode=",
  ups:      "https://www.ups.com/track?tracknum=",
  sendeo:   "https://www.sendeo.com.tr/kargo-takip?trackingNumber=",
};

const CARGO_NAMES: Record<string, string> = {
  yurtici: "Yurtiçi Kargo",
  aras:    "Aras Kargo",
  mng:     "MNG Kargo",
  ptt:     "PTT Kargo",
  ups:     "UPS",
  sendeo:  "Sendeo",
};

export default function KargoTakipPage() {
  const [company, setCompany] = useState("yurtici");
  const [code, setCode]       = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    const url = CARGO_LINKS[company] + encodeURIComponent(code.trim());
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen" style={{ background: "#F5F5F7" }}>
      <div className="max-w-lg mx-auto px-6 pt-40 pb-20">

        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[0.5em] uppercase font-medium mb-3" style={{ color: "#86868B" }}>
            OBRNHOMEN
          </p>
          <h1
            className="font-semibold mb-3"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", letterSpacing: "-0.02em", color: "#1D1D1F" }}
          >
            Kargo Takip
          </h1>
          <p className="text-sm" style={{ color: "#86868B" }}>
            Kargo firmanızı seçin ve takip kodunuzu girin.
          </p>
        </div>

        <form onSubmit={handleTrack} className="bg-white p-8 shadow-sm">
          {/* Kargo firması seçimi */}
          <div className="mb-6">
            <label className="block text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: "#86868B" }}>
              Kargo Firması
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(CARGO_NAMES).map(([key, name]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCompany(key)}
                  className="py-2.5 px-3 text-[10px] tracking-wide transition-all"
                  style={
                    company === key
                      ? { background: "#1D1D1F", color: "#c9a84c" }
                      : { background: "#F5F5F7", color: "#86868B" }
                  }
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Takip kodu */}
          <div className="mb-6">
            <label className="block text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: "#86868B" }}>
              Takip Kodu
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Kargo takip numaranızı girin"
              className="w-full border px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
              style={{ borderColor: "#e5e5e5", color: "#1D1D1F" }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-80"
            style={{ background: "#1D1D1F", color: "#c9a84c" }}
          >
            Kargo Takip Et →
          </button>
        </form>

        {/* Bilgi notu */}
        <div className="mt-8 p-5 text-center">
          <p className="text-xs leading-relaxed" style={{ color: "#86868B" }}>
            Sipariş numaranızı e-posta ile aldınız. Siparişiniz kargoya verildikten sonra
            takip kodunuz WhatsApp veya e-posta ile iletilecektir.
          </p>
          <a
            href="https://wa.me/905316893849"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-[10px] tracking-[0.2em] uppercase transition-opacity hover:opacity-70"
            style={{ color: "#c9a84c" }}
          >
            WhatsApp Destek →
          </a>
        </div>
      </div>
    </div>
  );
}
