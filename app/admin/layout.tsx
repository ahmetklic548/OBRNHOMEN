"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";

const ADMIN_LINKS = [
  { href: "/admin", label: "Genel Bakış" },
  { href: "/admin/siparisler", label: "Siparişler" },
  { href: "/admin/gizlenen", label: "Gizlenen Ürünler" },
  { href: "/admin/benzer", label: "Benzer Ürünler" },
  { href: "/admin/trendyol", label: "Trendyol" },
  { href: "/admin/urunler", label: "Ürünler (eski)" },
  { href: "/admin/sosyal-medya", label: "Sosyal Medya" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user || user.email !== ADMIN_EMAIL) {
      router.replace("/hesap");
    }
  }, [user, loading, router]);

  if (loading || !user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F5F5F7" }}>
        <p className="text-xs tracking-widest uppercase" style={{ color: "#86868B" }}>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F5F5F7" }}>
      {/* Admin menüsü — site başlığının altında akışta durur (önceden sabitti, site başlığının altında
          kalıp örtülüyordu ve telefonda gizliydi) */}
      <div className="border-b" style={{ background: "#1D1D1F", borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="mx-auto flex max-w-6xl items-center gap-4 overflow-x-auto px-4 py-2.5 md:px-6">
          <span className="shrink-0 text-[12px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#c9a84c" }}>
            Admin
          </span>
          <nav className="flex items-center gap-1.5">
            {ADMIN_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="shrink-0 rounded-md px-3 py-1.5 text-[14px] transition-colors"
                  style={active ? { background: "#c9a84c", color: "#1D1D1F", fontWeight: 600 } : { color: "#e5e5e5" }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
