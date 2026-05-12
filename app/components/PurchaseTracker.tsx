"use client";
import { useEffect } from "react";
import { trackPurchase } from "@/lib/analytics";

export default function PurchaseTracker() {
  useEffect(() => {
    try {
      const raw = localStorage.getItem("obrnhomen-cart");
      const pendingTotal = localStorage.getItem("obrnhomen-pending-total");
      if (!raw) return;

      const items: { slug: string; name: string; price: number; qty: number }[] = JSON.parse(raw);
      if (!items.length) return;

      const total = pendingTotal
        ? Number(pendingTotal)
        : items.reduce((s, i) => s + i.price * i.qty, 0);

      const transactionId = `obr-${Date.now()}`;
      trackPurchase(transactionId, total, items);

      localStorage.removeItem("obrnhomen-cart");
      localStorage.removeItem("obrnhomen-pending-total");
    } catch {}
  }, []);

  return null;
}
