"use client";

import { useState } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAllProducts } from "@/lib/products";

export default function AktarPage() {
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);

  const handleImport = async () => {
    if (!db) { alert("Firebase yapılandırılmamış."); return; }
    if (!confirm("Tüm ürünler Firestore'a aktarılacak. Devam?")) return;
    setStatus("running");
    const products = getAllProducts();
    setTotal(products.length);
    try {
      for (let i = 0; i < products.length; i++) {
        const p = products[i];
        await setDoc(doc(collection(db, "products"), p.id), {
          ...p,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setProgress(i + 1);
      }
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const handleExport = async () => {
    if (!db) { alert("Firebase yapılandırılmamış."); return; }
    const { getDocs, query, orderBy } = await import("firebase/firestore");
    const snap = await getDocs(query(collection(db, "products"), orderBy("name")));
    const data = snap.docs.map(d => d.data());
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "products.json";
    a.click();
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-xl font-semibold mb-2" style={{ color: "#1D1D1F" }}>Veri Aktarımı</h1>
      <p className="text-sm mb-10" style={{ color: "#86868B" }}>
        products.json dosyasındaki 198 ürünü Firestore'a aktarın ya da Firestore'daki güncel ürünleri JSON olarak indirin.
      </p>

      <div className="space-y-4">
        {/* JSON → Firestore */}
        <div className="bg-white p-6 border" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <p className="text-sm font-medium mb-1" style={{ color: "#1D1D1F" }}>JSON → Firestore</p>
          <p className="text-xs mb-5" style={{ color: "#86868B" }}>Mevcut tüm ürünleri Firestore'a yükler. Varsa üzerine yazar.</p>

          {status === "running" && (
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1" style={{ color: "#86868B" }}>
                <span>Aktarılıyor...</span>
                <span>{progress} / {total}</span>
              </div>
              <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "#F5F5F7" }}>
                <div
                  className="h-full transition-all duration-300"
                  style={{ width: `${(progress / total) * 100}%`, background: "#c9a84c" }}
                />
              </div>
            </div>
          )}

          {status === "done" && <p className="text-xs text-emerald-600 mb-4">✓ {total} ürün başarıyla aktarıldı!</p>}
          {status === "error" && <p className="text-xs text-red-500 mb-4">Hata oluştu. Konsolu kontrol edin.</p>}

          <button
            onClick={handleImport}
            disabled={status === "running"}
            className="px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase disabled:opacity-40"
            style={{ background: "#1D1D1F", color: "#c9a84c" }}
          >
            {status === "running" ? "Aktarılıyor..." : "Firestore'a Aktar"}
          </button>
        </div>

        {/* Firestore → JSON */}
        <div className="bg-white p-6 border" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <p className="text-sm font-medium mb-1" style={{ color: "#1D1D1F" }}>Firestore → JSON</p>
          <p className="text-xs mb-5" style={{ color: "#86868B" }}>
            Firestore'daki güncel ürünleri products.json olarak indirin. İndirilen dosyayı <code className="bg-stone-100 px-1">data/</code> klasörüne koyup deploy edin.
          </p>
          <button
            onClick={handleExport}
            className="px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase border transition-colors hover:border-[#c9a84c]"
            style={{ borderColor: "#e5e5e5", color: "#1D1D1F" }}
          >
            JSON İndir
          </button>
        </div>
      </div>
    </div>
  );
}
