"use client";
import { useState } from "react";
import { useCart } from "./CartContext";
import CartDrawer from "./CartDrawer";

export default function CartButton() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative flex items-center gap-1.5 text-stone-800 hover:opacity-60 transition-colors"
        aria-label="Sepeti aç"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full bg-black text-white text-[9px] flex items-center justify-center font-bold">
            {count}
          </span>
        )}
      </button>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
