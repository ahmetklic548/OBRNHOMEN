"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

interface FProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  stock: number;
  images: string[];
}

export default function AdminUrunler() {
  const [products, setProducts] = useState<FProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    if (!db) { setLoading(false); return; }
    setLoading(true);
    const snap = await getDocs(query(collection(db, "products"), orderBy("name")));
    setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as FProduct)));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!db || !confirm(`"${name}" silinsin mi?`)) return;
    setDeleting(id);
    await deleteDoc(doc(db, "products", id));
    setProducts(p => p.filter(x => x.id !== id));
    setDeleting(null);
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold" style={{ color: "#1D1D1F" }}>
          Ürünler <span className="text-sm font-normal ml-2" style={{ color: "#86868B" }}>({products.length})</span>
        </h1>
        <Link
          href="/admin/urunler/yeni"
          className="px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase"
          style={{ background: "#1D1D1F", color: "#c9a84c" }}
        >
          + Yeni Ürün
        </Link>
      </div>

      <input
        type="text"
        placeholder="Ürün veya kategori ara..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full border px-4 py-2.5 text-sm mb-6 focus:outline-none focus:border-[#c9a84c]"
        style={{ borderColor: "#e5e5e5" }}
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 bg-white animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-center py-16" style={{ color: "#86868B" }}>
          {products.length === 0 ? "Henüz Firestore'da ürün yok. JSON'dan aktar." : "Sonuç bulunamadı."}
        </p>
      ) : (
        <div className="bg-white border overflow-hidden" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left" style={{ borderColor: "rgba(0,0,0,0.06)", background: "#F5F5F7" }}>
                <th className="px-4 py-3 text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: "#86868B" }}>Ürün</th>
                <th className="px-4 py-3 text-[10px] tracking-[0.2em] uppercase font-medium hidden md:table-cell" style={{ color: "#86868B" }}>Kategori</th>
                <th className="px-4 py-3 text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: "#86868B" }}>Fiyat</th>
                <th className="px-4 py-3 text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: "#86868B" }}>Stok</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-stone-50 transition-colors" style={{ borderColor: "rgba(0,0,0,0.04)" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] && (
                        <img src={p.images[0]} alt="" className="w-10 h-10 object-cover flex-shrink-0" />
                      )}
                      <span className="font-medium line-clamp-1" style={{ color: "#1D1D1F" }}>{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs" style={{ color: "#86868B" }}>{p.category}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#1D1D1F" }}>{p.price?.toLocaleString("tr-TR")} ₺</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{
                      background: p.inStock ? "#f0fdf4" : "#fef2f2",
                      color: p.inStock ? "#16a34a" : "#dc2626",
                    }}>
                      {p.inStock ? `${p.stock} adet` : "Tükendi"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <Link href={`/admin/urunler/${p.id}`} className="text-[10px] tracking-wide underline" style={{ color: "#86868B" }}>
                        Düzenle
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        disabled={deleting === p.id}
                        className="text-[10px] tracking-wide underline transition-colors hover:text-red-500"
                        style={{ color: "#86868B" }}
                      >
                        {deleting === p.id ? "..." : "Sil"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
