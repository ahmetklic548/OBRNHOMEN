"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "ahmet.klic548@gmail.com";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== ADMIN_EMAIL) {
        router.replace("/hesap");
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F5F5F7" }}>
        <p className="text-xs tracking-widest uppercase" style={{ color: "#86868B" }}>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F5F5F7" }}>
      <div className="fixed top-0 inset-x-0 z-40 border-b" style={{ background: "#1D1D1F", borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: "#c9a84c" }}>
              OBRNHOMEN Admin
            </span>
            <nav className="hidden md:flex items-center gap-5">
              {[
                { href: "/admin", label: "Genel Bakış" },
                { href: "/admin/urunler", label: "Ürünler" },
                { href: "/admin/urunler/yeni", label: "+ Yeni Ürün" },
              ].map(({ href, label }) => (
                <a key={href} href={href} className="text-[11px] tracking-wide transition-colors hover:text-white" style={{ color: "#86868B" }}>
                  {label}
                </a>
              ))}
            </nav>
          </div>
          <a href="/" className="text-[11px] tracking-wide" style={{ color: "#86868B" }}>
            ← Siteye Dön
          </a>
        </div>
      </div>
      <div className="pt-14">{children}</div>
    </div>
  );
}
