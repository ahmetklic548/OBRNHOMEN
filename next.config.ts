import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: { root: __dirname },
  // Eski (ad tabanlı) kategori adresleri → yeni slug adresleri
  async redirects() {
    const old: [string, string][] = [
      ["Hediyelik Setler", "hediyelik-setler"], ["Konsept Hediyelik", "hediyelik-setler"],
      ["Kuran & Dini Kitaplar", "kuran-i-kerim"], ["Din Kitabı", "yasin-dini-kitaplar"],
      ["Seccade", "seccade"], ["Tesbih & Zikirmatik", "tesbih"], ["Tesbih", "tesbih"],
      ["Namaz Elbisesi & Tesettür", "namaz-elbisesi-tesettur"], ["Eşarp & Örtü", "esarp-yazma-ortu"], ["Eşarp", "esarp-yazma-ortu"],
      ["İhram & Hac Umre", "ihram-hac-malzemeleri"], ["İhram", "ihram-hac-malzemeleri"],
      ["Misvak, Esans & Sürme", "misvak-esans-surme"], ["Misvak", "misvak-esans-surme"],
    ];
    return old
      // Büyük-küçük harf farkı tek farksa (Seccade → seccade) yönlendirme döngüye girer
      .filter(([name, slug]) => encodeURIComponent(name).toLowerCase() !== slug)
      .map(([name, slug]) => ({ source: `/koleksiyon/${encodeURIComponent(name)}`, destination: `/koleksiyon/${slug}`, permanent: true }));
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.dsmcdn.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
