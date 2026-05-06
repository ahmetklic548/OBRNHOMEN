"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAllProducts } from "@/lib/products";
import Link from "next/link";

export default function AdminDashboard() {
  const [firestoreCount, setFirestoreCount] = useState<number | null>(null);
  const jsonCount = getAllProducts().length;
  const inStock = getAllProducts().filter(p => p.inStock).length;

  useEffect(() => {
    getDocs(query(collection(db, "products"), orderBy("name")))
      .then(snap => setFirestoreCount(snap.size))
      .catch(() => setFirestoreCount(0));
  }, []);

  const stats = [
    { label: "JSON Ürün Sayısı", value: jsonCount },
    { label: "Stokta Var", value: inStock },
    { label: "Tükendi", value: jsonCount - inStock },
    { label: "Firestore Ürünleri", value: firestoreCount ?? "—" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-xl font-semibold mb-8" style={{ color: "#1D1D1F" }}>Genel Bakış</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map(s => (
          <div key={s.label} className="bg-white p-6 border" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: "#86868B" }}>{s.label}</p>
            <p className="text-3xl font-light" style={{ color: "#1D1D1F" }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/admin/urunler"
          className="px-6 py-3 text-xs tracking-[0.2em] uppercase text-center transition-opacity hover:opacity-80"
          style={{ background: "#1D1D1F", color: "#c9a84c" }}
        >
          Ürünleri Yönet
        </Link>
        <Link
          href="/admin/urunler/yeni"
          className="px-6 py-3 text-xs tracking-[0.2em] uppercase text-center border transition-colors hover:border-[#c9a84c]"
          style={{ borderColor: "#e5e5e5", color: "#1D1D1F" }}
        >
          + Yeni Ürün Ekle
        </Link>
        <Link
          href="/admin/aktar"
          className="px-6 py-3 text-xs tracking-[0.2em] uppercase text-center border transition-colors hover:border-[#c9a84c]"
          style={{ borderColor: "#e5e5e5", color: "#1D1D1F" }}
        >
          JSON → Firestore Aktar
        </Link>
      </div>
    </div>
  );
}
