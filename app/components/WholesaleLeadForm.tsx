"use client";

import { useState } from "react";
import { WHATSAPP_URL } from "@/lib/storeNav";

type Dil = "en" | "fr";

const T = {
  en: {
    ad: "Your name *", firma: "Company / shop name", ulke: "Country *", eposta: "E-mail (catalogues are sent here) *",
    whatsapp: "WhatsApp number", tur: "Type of business", mesaj: "What are you looking for? (optional)",
    turler: ["Shop / store", "Online store", "Hajj & Umrah agency", "Mosque / association", "Company gifts", "Other"],
    gonder: "Send me the catalogues", gonderiliyor: "Sending…",
    ok: "Done! The catalogues are on their way to your inbox (check spam too). Send us the codes you like on WhatsApp for prices within 24 hours.",
    wa: "Message us on WhatsApp", not: "We only use your details to reply to your request.",
    hata: "Something went wrong. Please contact us on WhatsApp.",
  },
  fr: {
    ad: "Votre nom *", firma: "Société / boutique", ulke: "Pays *", eposta: "E-mail (les catalogues sont envoyés ici) *",
    whatsapp: "Numéro WhatsApp", tur: "Type d'activité", mesaj: "Que recherchez-vous ? (facultatif)",
    turler: ["Boutique", "Boutique en ligne", "Agence Hajj & Omra", "Mosquée / association", "Cadeaux d'entreprise", "Autre"],
    gonder: "Recevoir les catalogues", gonderiliyor: "Envoi…",
    ok: "C'est fait ! Les catalogues arrivent dans votre boîte mail (vérifiez aussi les spams). Envoyez-nous les codes choisis sur WhatsApp pour un devis sous 24 heures.",
    wa: "Écrire sur WhatsApp", not: "Vos données servent uniquement à répondre à votre demande.",
    hata: "Une erreur est survenue. Contactez-nous sur WhatsApp.",
  },
};

const inp = "w-full rounded-md border border-stone-300 bg-white px-3.5 py-3 text-[16px] focus:border-black focus:outline-none";

export default function WholesaleLeadForm({ dil }: { dil: Dil }) {
  const t = T[dil];
  const [f, setF] = useState({ ad: "", firma: "", ulke: "", eposta: "", whatsapp: "", tur: "", mesaj: "", website: "" });
  const [durum, setDurum] = useState<"bos" | "gonderiliyor" | "ok" | "hata">("bos");
  const [hata, setHata] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const gonder = async (e: React.FormEvent) => {
    e.preventDefault();
    setDurum("gonderiliyor");
    setHata("");
    try {
      const r = await fetch("/api/wholesale-lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, dil }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || t.hata);
      setDurum("ok");
    } catch (err) {
      setHata((err as Error).message || t.hata);
      setDurum("hata");
    }
  };

  if (durum === "ok") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-[15px] leading-relaxed text-emerald-900">
        <p>{t.ok}</p>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block rounded-md bg-[#25D366] px-5 py-3 font-semibold text-white">{t.wa}</a>
      </div>
    );
  }

  return (
    <form onSubmit={gonder} className="grid gap-4 sm:grid-cols-2">
      <label className="text-[14px] text-stone-700">{t.ad}<input required className={inp + " mt-1"} value={f.ad} onChange={set("ad")} autoComplete="name" /></label>
      <label className="text-[14px] text-stone-700">{t.firma}<input className={inp + " mt-1"} value={f.firma} onChange={set("firma")} autoComplete="organization" /></label>
      <label className="text-[14px] text-stone-700">{t.ulke}<input required className={inp + " mt-1"} value={f.ulke} onChange={set("ulke")} autoComplete="country-name" /></label>
      <label className="text-[14px] text-stone-700">{t.eposta}<input required type="email" className={inp + " mt-1"} value={f.eposta} onChange={set("eposta")} autoComplete="email" /></label>
      <label className="text-[14px] text-stone-700">{t.whatsapp}<input type="tel" className={inp + " mt-1"} value={f.whatsapp} onChange={set("whatsapp")} autoComplete="tel" placeholder="+33 …" /></label>
      <label className="text-[14px] text-stone-700">{t.tur}
        <select className={inp + " mt-1"} value={f.tur} onChange={set("tur")}>
          <option value="">—</option>
          {t.turler.map((x) => <option key={x}>{x}</option>)}
        </select>
      </label>
      <label className="text-[14px] text-stone-700 sm:col-span-2">{t.mesaj}<textarea rows={3} className={inp + " mt-1"} value={f.mesaj} onChange={set("mesaj")} /></label>
      {/* bal tuzağı: insanlar görmez */}
      <input tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} className="hidden" aria-hidden="true" />
      <div className="sm:col-span-2">
        {hata && <p className="mb-3 text-[14px] text-red-700">{hata}</p>}
        <button disabled={durum === "gonderiliyor"} className="w-full rounded-md bg-black px-6 py-4 text-[16px] font-semibold text-white hover:opacity-85 disabled:opacity-60 sm:w-auto">
          {durum === "gonderiliyor" ? t.gonderiliyor : t.gonder}
        </button>
        <p className="mt-2 text-[12.5px] text-stone-500">{t.not}</p>
      </div>
    </form>
  );
}
