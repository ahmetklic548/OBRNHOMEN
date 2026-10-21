"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "./AuthProvider";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";

export default function AuthButton() {
  const { user, profile, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = user?.email === ADMIN_EMAIL;

  /* ── Not logged in (or still loading): hesap ikonu ── */
  if (loading || !user) {
    return (
      <Link href="/hesap" aria-label="Hesabım" className="text-stone-800 transition-opacity hover:opacity-60">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        </svg>
      </Link>
    );
  }

  /* ── Logged in ── */
  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(o => !o)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-full transition-all duration-200 hover:opacity-75"
        style={{ background: "#F5F5F7" }}
      >
        {user.photoURL ? (
          <Image src={user.photoURL} alt="" width={22} height={22} className="rounded-full" />
        ) : (
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold"
            style={{ background: "#1D1D1F", color: "#ffffff" }}
          >
            {(profile?.name ?? user.email ?? "?")[0].toUpperCase()}
          </span>
        )}
        <span className="hidden lg:inline text-[11px] font-medium max-w-[90px] truncate" style={{ color: "#1D1D1F" }}>
          {profile?.name?.split(" ")[0] ?? "Hesabım"}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: "#86868B" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          <div
            className="absolute right-0 top-12 z-50 w-44 rounded-2xl overflow-hidden py-1"
            style={{
              background: "#ffffff",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <Link
              href="/hesap"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-stone-50"
              style={{ color: "#1D1D1F" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              Hesabım
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-stone-50"
                style={{ color: "#c9a84c" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                Admin Panel
              </Link>
            )}
            <div className="mx-3 border-t my-1" style={{ borderColor: "rgba(0,0,0,0.06)" }} />
            <button
              onClick={() => { logout(); setMenuOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors hover:bg-stone-50"
              style={{ color: "#86868B" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Çıkış Yap
            </button>
          </div>
        </>
      )}
    </div>
  );
}
