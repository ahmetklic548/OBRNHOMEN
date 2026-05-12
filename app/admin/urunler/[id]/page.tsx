"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

const EMPTY = {
  name: "", slug: "", category: "", brand: "OBRNHOMEN",
  price: 0, stock: 0, inStock: true,
  color: "", size: "", metaDescription: "",
  images: [""], features: [""],
  currency: "TRY", quantity: 1,
};

type Form = typeof EMPTY;

export default function UrunForm() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === "yeni";

  const [form, setForm] = useState<Form>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isNew || !db) { setLoading(false); return; }
    getDoc(doc(db, "products", id)).then(snap => {
      if (snap.exists()) setForm({ ...EMPTY, ...snap.data() } as Form);
      setLoading(false);
    });
  }, [id, isNew]);

  const set = (key: keyof Form, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setSaving(true);
    const data = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images.filter(Boolean),
      features: form.features.filter(Boolean),
      updatedAt: new Date().toISOString(),
    };
    if (isNew) {
      await addDoc(collection(db, "products"), { ...data, createdAt: new Date().toISOString() });
    } else {
      await setDoc(doc(db, "products", id), data, { merge: true });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); router.push("/admin/urunler"); }, 1500);
  };

  const field = (label: string, key: keyof Form, type = "text") => (
    <div>
      <label className="block text-[10px] tracking-[0.25em] uppercase mb-1.5" style={{ color: "#86868B" }}>{label}</label>
      <input
        type={type}
        value={form[key] as string}
        onChange={e => set(key, e.target.value)}
        className="w-full border px-3 py-2.5 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
        style={{ borderColor: "#e5e5e5" }}
      />
    </div>
  );

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-xs tracking-widest uppercase" style={{ color: "#86868B" }}>Yükleniyor...</p></div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold" style={{ color: "#1D1D1F" }}>
          {isNew ? "Yeni Ürün" : "Ürünü Düzenle"}
        </h1>
        <button onClick={() => router.back()} className="text-xs" style={{ color: "#86868B" }}>← Geri</button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Temel Bilgiler */}
        <div className="bg-white p-6 border space-y-4" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <p className="text-[10px] tracking-[0.3em] uppercase font-medium mb-4" style={{ color: "#86868B" }}>Temel Bilgiler</p>
          {field("Ürün Adı", "name")}
          {field("Slug (URL)", "slug")}
          <div className="grid grid-cols-2 gap-4">
            {field("Kategori", "category")}
            {field("Marka", "brand")}
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase mb-1.5" style={{ color: "#86868B" }}>Meta Açıklama</label>
            <textarea
              rows={3}
              value={form.metaDescription}
              onChange={e => set("metaDescription", e.target.value)}
              className="w-full border px-3 py-2.5 text-sm focus:outline-none focus:border-[#c9a84c] resize-none"
              style={{ borderColor: "#e5e5e5" }}
            />
          </div>
        </div>

        {/* Fiyat & Stok */}
        <div className="bg-white p-6 border space-y-4" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <p className="text-[10px] tracking-[0.3em] uppercase font-medium mb-4" style={{ color: "#86868B" }}>Fiyat & Stok</p>
          <div className="grid grid-cols-2 gap-4">
            {field("Fiyat (₺)", "price", "number")}
            {field("Stok Adedi", "stock", "number")}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="inStock"
              checked={form.inStock}
              onChange={e => set("inStock", e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="inStock" className="text-sm" style={{ color: "#1D1D1F" }}>Stokta var</label>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {field("Renk", "color")}
            {field("Boyut", "size")}
            {field("Paket Adedi", "quantity", "number")}
          </div>
        </div>

        {/* Görseller */}
        <div className="bg-white p-6 border" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <p className="text-[10px] tracking-[0.3em] uppercase font-medium mb-4" style={{ color: "#86868B" }}>Görsel URL'leri</p>
          <div className="space-y-2">
            {form.images.map((img, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="url"
                  value={img}
                  onChange={e => {
                    const imgs = [...form.images];
                    imgs[i] = e.target.value;
                    set("images", imgs);
                  }}
                  placeholder={`Görsel ${i + 1} URL`}
                  className="flex-1 border px-3 py-2 text-sm focus:outline-none focus:border-[#c9a84c]"
                  style={{ borderColor: "#e5e5e5" }}
                />
                {form.images.length > 1 && (
                  <button type="button" onClick={() => set("images", form.images.filter((_, j) => j !== i))}
                    className="px-3 text-xs" style={{ color: "#dc2626" }}>✕</button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => set("images", [...form.images, ""])}
              className="text-[10px] tracking-wide underline" style={{ color: "#86868B" }}>
              + Görsel Ekle
            </button>
          </div>
        </div>

        {/* Özellikler */}
        <div className="bg-white p-6 border" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <p className="text-[10px] tracking-[0.3em] uppercase font-medium mb-4" style={{ color: "#86868B" }}>Ürün Özellikleri</p>
          <div className="space-y-2">
            {form.features.map((f, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={f}
                  onChange={e => {
                    const feats = [...form.features];
                    feats[i] = e.target.value;
                    set("features", feats);
                  }}
                  placeholder={`Özellik ${i + 1}`}
                  className="flex-1 border px-3 py-2 text-sm focus:outline-none focus:border-[#c9a84c]"
                  style={{ borderColor: "#e5e5e5" }}
                />
                {form.features.length > 1 && (
                  <button type="button" onClick={() => set("features", form.features.filter((_, j) => j !== i))}
                    className="px-3 text-xs" style={{ color: "#dc2626" }}>✕</button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => set("features", [...form.features, ""])}
              className="text-[10px] tracking-wide underline" style={{ color: "#86868B" }}>
              + Özellik Ekle
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{ background: saved ? "#16a34a" : "#1D1D1F", color: "#c9a84c" }}
        >
          {saving ? "Kaydediliyor..." : saved ? "✓ Kaydedildi" : isNew ? "Ürün Ekle" : "Değişiklikleri Kaydet"}
        </button>
      </form>
    </div>
  );
}
