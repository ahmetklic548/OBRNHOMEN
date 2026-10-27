"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-md bg-[#1a1208] px-5 py-2.5 text-[14px] font-semibold text-white"
    >
      📄 PDF olarak kaydet / Yazdır
    </button>
  );
}
