"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import { updateUserProfile } from "@/lib/userStore";
import { IslamicStar, IslamicDivider } from "@/app/components/IslamicOrnament";

export default function HesapPage() {
  const { user, profile, loading, signInWithGoogle } = useAuth();
  const [form, setForm]     = useState({ name: "", phone: "", address: "" });
  const [saved, setSaved]   = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        name:    profile.name    ?? "",
        phone:   profile.phone   ?? "",
        address: profile.address ?? "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await updateUserProfile(user.uid, form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) return null;

  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(180deg, #f9f3ea 0%, #faf5ec 100%)" }}
      >
        <div className="text-center px-6">
          <IslamicStar size={32} color="#c9a84c" opacity={0.7} className="mx-auto mb-6" />
          <h1 className="text-2xl font-light tracking-[0.3em] uppercase text-stone-800 mb-4">
            Hesabım
          </h1>
          <IslamicDivider color="#c9a84c" className="mb-6 opacity-40" />
          <p className="text-sm text-stone-400 mb-8">Devam etmek için Google ile giriş yapın.</p>
          <button
            onClick={signInWithGoogle}
            className="inline-flex items-center gap-3 px-8 py-4 text-xs tracking-[0.3em] uppercase text-white transition-colors"
            style={{ background: "#1a1208" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google ile Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-16"
      style={{ background: "linear-gradient(180deg, #f9f3ea 0%, #faf5ec 100%)" }}
    >
      <div className="absolute inset-0 opacity-[0.035] islamic-pattern pointer-events-none" style={{ zIndex: 0 }} />
      <div className="relative z-10 max-w-lg mx-auto px-6">
        <div className="text-center mb-12">
          <IslamicStar size={24} color="#c9a84c" opacity={0.8} className="mx-auto mb-4" />
          <h1 className="text-2xl font-light tracking-[0.3em] uppercase text-stone-800 mb-2">Hesabım</h1>
          <IslamicDivider color="#c9a84c" className="mt-4 opacity-40" />
        </div>

        <div className="space-y-5">
          {[
            { key: "name",    label: "Ad Soyad",        type: "text" },
            { key: "phone",   label: "Telefon",          type: "tel"  },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-[10px] tracking-[0.3em] uppercase text-stone-400 mb-2">{label}</label>
              <input
                type={type}
                value={form[key as keyof typeof form]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus:outline-none focus:border-[#c9a84c] transition-colors"
              />
            </div>
          ))}

          <div>
            <label className="block text-[10px] tracking-[0.3em] uppercase text-stone-400 mb-2">Kayıtlı Adres</label>
            <textarea
              rows={3}
              value={form.address}
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              placeholder="Mahalle, cadde, no, ilçe, şehir"
              className="w-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus:outline-none focus:border-[#c9a84c] transition-colors resize-none"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 text-white text-xs tracking-[0.3em] uppercase transition-colors"
            style={{ background: saved ? "#2d6a4f" : "#1a1208" }}
          >
            {saved ? "✓ Kaydedildi" : saving ? "Kaydediliyor..." : "Kaydet"}
          </button>

          <p className="text-[10px] text-stone-400 text-center tracking-wide">
            {user.email} · <button onClick={() => signInWithGoogle()} className="underline">Hesabı Değiştir</button>
          </p>
        </div>
      </div>
    </div>
  );
}
