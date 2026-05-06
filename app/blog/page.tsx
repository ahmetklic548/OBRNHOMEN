import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Rehber | Hac Umre Hediyeliği, Tesbih & Seccade",
  description: "Hac ve umre hediyeliği nasıl seçilir? Tesbih çeşitleri, mevlüt hediye fikirleri ve seccade seçim rehberi. OBRNHOMEN uzman içerikleri.",
  keywords: ["hac umre hediyeliği rehberi", "tesbih çeşitleri", "mevlüt hediyesi", "seccade seçimi", "İslami hediyelik"],
  openGraph: {
    title: "Blog & Rehber | OBRNHOMEN",
    description: "Hac, umre, mevlüt ve İslami hediyelik ürünleri hakkında rehber içerikler.",
    url: "https://obrnhomen.com/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog & Rehber | OBRNHOMEN",
    description: "Hac, umre, mevlüt ve İslami hediyelik ürünleri hakkında rehber içerikler.",
  },
  alternates: { canonical: "https://obrnhomen.com/blog" },
};

const posts = [
  {
    slug: "hac-umre-hediyesi-nasil-secilir",
    title: "Hac ve Umre Hediyeliği Nasıl Seçilir?",
    excerpt: "Hac veya umreden dönen sevdiklerinize en anlamlı hediyeyi seçmek için bilmeniz gerekenler.",
    category: "Rehber",
    date: "2025-01-15",
    readTime: "4 dk",
  },
  {
    slug: "tesbih-cesitleri-ve-anlami",
    title: "Tesbih Çeşitleri ve Anlamları",
    excerpt: "İnci, akik, kuka ve ahşap tesbihler arasındaki farklar, her birinin özellikleri ve hangi durumda tercih edilmesi gerektiği.",
    category: "Bilgi",
    date: "2025-01-22",
    readTime: "5 dk",
  },
  {
    slug: "mevlut-hediyesi-fikirleri",
    title: "Mevlüt Hediyesi Fikirleri 2025",
    excerpt: "Mevlüt törenlerinde misafirlere verilecek en güzel hediyelik setleri ve toplu sipariş avantajları.",
    category: "Rehber",
    date: "2025-02-03",
    readTime: "3 dk",
  },
  {
    slug: "seccade-secerken-dikkat-edilmesi-gerekenler",
    title: "Seccade Seçerken Dikkat Edilmesi Gerekenler",
    excerpt: "Kadife, şipinger ve özel dokuma seccadeler arasında nasıl karar verirsiniz? Kalite kriterleri ve bakım önerileri.",
    category: "Bilgi",
    date: "2025-02-14",
    readTime: "4 dk",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen" style={{ background: "#ffffff" }}>
      {/* Header */}
      <div className="pt-36 pb-12 px-6 text-center" style={{ background: "#F5F5F7" }}>
        <p className="text-[10px] tracking-[0.5em] uppercase font-medium mb-3" style={{ color: "#86868B" }}>
          OBRNHOMEN
        </p>
        <h1
          className="font-semibold mb-3"
          style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", letterSpacing: "-0.022em", color: "#1D1D1F" }}
        >
          Blog & Rehber
        </h1>
        <p className="text-sm max-w-md mx-auto" style={{ color: "#86868B" }}>
          Hediyelik seçimi, İslami ürünler ve özel günler için rehber içerikler.
        </p>
      </div>

      {/* Posts */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="space-y-px">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-8 border-b transition-colors hover:bg-stone-50 px-4 -mx-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", animationDelay: `${i * 80}ms` }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="text-[9px] tracking-[0.3em] uppercase px-2 py-0.5"
                    style={{ background: "rgba(201,168,76,0.12)", color: "#c9a84c" }}
                  >
                    {post.category}
                  </span>
                  <span className="text-[10px]" style={{ color: "#86868B" }}>{post.readTime} okuma</span>
                </div>
                <h2 className="text-base font-medium mb-1 group-hover:text-[#c9a84c] transition-colors" style={{ color: "#1D1D1F" }}>
                  {post.title}
                </h2>
                <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "#86868B" }}>
                  {post.excerpt}
                </p>
              </div>
              <div className="flex-shrink-0 text-[10px] tracking-widest uppercase" style={{ color: "#86868B" }}>
                {new Date(post.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
