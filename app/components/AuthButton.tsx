"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function AuthButton() {
  const { user, profile, loading, signInWithGoogle, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) return <div className="w-24 h-8 rounded-full animate-pulse" style={{ background: "#F5F5F7" }} />;

  /* ── Not logged in ── */
  if (!user) {
    return (
      <button
        onClick={signInWithGoogle}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-medium tracking-wide transition-all duration-200 hover:opacity-75"
        style={{
          background: "#1D1D1F",
          color: "#ffffff",
          letterSpacing: "0.04em",
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span className="hidden sm:inline">Giriş / Üye Ol</span>
        <span className="sm:hidden">Giriş</span>
      </button>
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
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.photoURL} alt="" width={22} height={22} className="rounded-full" />
        ) : (
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold"
            style={{ background: "#1D1D1F", color: "#ffffff" }}
          >
            {(profile?.name ?? user.email ?? "?")[0].toUpperCase()}
          </span>
        )}
        <span className="hidden md:inline text-[11px] font-medium max-w-[90px] truncate" style={{ color: "#1D1D1F" }}>
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
