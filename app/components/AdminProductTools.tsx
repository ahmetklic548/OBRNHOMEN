"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { hideProduct, unhideProduct, useHiddenSlugs } from "@/lib/hidden";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";

export function useIsAdmin() {
  const { user } = useAuth();
  return !!ADMIN_EMAIL && user?.email === ADMIN_EMAIL;
}

/**
 * Sadece admin hesabına görünen ürün araçları: tek tıkla "Sil" (siteden kaldır) / "Geri al".
 * compact: ürün kartının köşesinde küçük düğme; aksi halde ürün sayfasında şerit.
 */
export default function AdminProductTools({ slug, name, compact = false }: { slug: string; name: string; compact?: boolean }) {
  const isAdmin = useIsAdmin();
  const hidden = useHiddenSlugs();
  const [busy, setBusy] = useState(false);
  if (!isAdmin) return null;
  const isHidden = hidden.has(slug);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isHidden && !window.confirm(`"${name}" siteden kaldırılsın mı?\n\nİstediğin zaman Admin → Gizlenen Ürünler'den geri alabilirsin.`)) return;
    setBusy(true);
    try {
      if (isHidden) await unhideProduct(slug);
      else await hideProduct(slug);
    } catch (err) {
      window.alert("İşlem yapılamadı. Admin hesabıyla giriş yaptığından emin ol.\n" + (err instanceof Error ? err.message : ""));
    } finally {
      setBusy(false);
    }
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className="absolute left-2 top-2 z-10 rounded-md bg-red-600 px-2.5 py-1 text-[12px] font-semibold text-white shadow hover:bg-red-700 disabled:opacity-60"
        title="Sadece sen görüyorsun (admin)"
      >
        {busy ? "…" : isHidden ? "Geri al" : "Sil"}
      </button>
    );
  }

  return (
    <div className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[14px]">
      <span className="text-red-800">
        <strong>Admin:</strong> {isHidden ? "Bu ürün sitede gizli." : "Bu ürün sitede görünüyor."}
      </span>
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className={`rounded-md px-4 py-2 font-semibold text-white disabled:opacity-60 ${isHidden ? "bg-stone-800 hover:bg-black" : "bg-red-600 hover:bg-red-700"}`}
      >
        {busy ? "…" : isHidden ? "Siteye geri al" : "Siteden kaldır"}
      </button>
    </div>
  );
}
