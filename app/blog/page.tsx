import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Rehber | Hac Umre Hediyeliği, Tesbih & Seccade",
  description: "Hac ve umre hediyeliği nasıl seçilir? Tesbih çeşitleri, mevlüt hediye fikirleri ve seccade seçim rehberi. OBRNHOMEN uzman içerikleri.",
  keywords: ["hac umre hediyeliği rehberi", "tesbih çeşitleri", "mevlüt hediyesi", "seccade seçimi", "İslami hediyelik", "ihram nedir", "namaz örtüsü seçimi", "ramazan hediyesi", "toplu hediyelik", "düğün hediyesi dini", "çeyizlik tesbih", "misvak faydaları", "din kitabı seçimi"],
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
  {
    slug: "ihram-nedir-nasil-kullanilir",
    title: "İhram Nedir, Nasıl Kullanılır?",
    excerpt: "Hac ve umre ibadetinin sembolü olan ihramın özellikleri, nasıl giyildiği ve dikkat edilmesi gereken noktalar.",
    category: "Rehber",
    date: "2025-03-05",
    readTime: "4 dk",
  },
  {
    slug: "namaz-ortusu-secim-rehberi",
    title: "Namaz Örtüsü (Eşarp) Seçim Rehberi",
    excerpt: "Pamuklu, vual ve saten namaz örtüleri arasındaki farklar; doğru seçim için dikkat edilmesi gereken kriterler.",
    category: "Rehber",
    date: "2025-03-12",
    readTime: "4 dk",
  },
  {
    slug: "ramazan-hediyesi-fikirleri",
    title: "Ramazan Hediyesi Fikirleri 2025",
    excerpt: "Ramazan ayında sevdiklerinize verebileceğiniz en anlamlı hediyeler: tesbih setleri, seccade, Kuran ve kombine hediyelik setler.",
    category: "Rehber",
    date: "2025-03-20",
    readTime: "3 dk",
  },
  {
    slug: "toplu-hediyelik-siparis-rehberi",
    title: "Toplu Hediyelik Sipariş Rehberi",
    excerpt: "Mevlüt, düğün, hac organizasyonu ve kurumsal etkinlikler için toplu hediyelik siparişinde nelere dikkat edilmeli?",
    category: "Rehber",
    date: "2025-04-01",
    readTime: "3 dk",
  },
  {
    slug: "dugun-nisanda-hediyelik-onerileri",
    title: "Düğün ve Nişan Hediyeliği Önerileri",
    excerpt: "Düğün ve nişan törenlerinde davetlilere verilecek en anlamlı dini hediyelikler: tesbih, seccade ve kombine setler.",
    category: "Rehber",
    date: "2025-04-10",
    readTime: "3 dk",
  },
  {
    slug: "ceyizlik-tesbih-seti-nasil-hazirlanir",
    title: "Çeyizlik Tesbih Seti Nasıl Hazırlanır?",
    excerpt: "Türk geleneğinde çeyiz sandığının vazgeçilmezi: çeyizlik tesbih ve seccade setleri nasıl hazırlanır, nelere dikkat edilmeli?",
    category: "Bilgi",
    date: "2025-04-18",
    readTime: "4 dk",
  },
  {
    slug: "misvak-nedir-faydalari",
    title: "Misvak Nedir? Faydaları ve Kullanımı",
    excerpt: "Sünnetin yaşayan sembolü misvak hakkında her şey: nedir, faydaları nelerdir, nasıl kullanılır?",
    category: "Bilgi",
    date: "2025-04-25",
    readTime: "4 dk",
  },
  {
    slug: "din-kitabi-secimi-rehberi",
    title: "Din Kitabı Seçimi: Nelere Dikkat Edilmeli?",
    excerpt: "Kuran-ı Kerim, Delailü'l Hayrat ve ilmihal gibi dini kitapları seçerken dikkat edilmesi gereken kriterler ve hediye önerileri.",
    category: "Bilgi",
    date: "2025-05-02",
    readTime: "4 dk",
  },
  {
    slug: "kurban-bayrami-hediyesi-fikirleri",
    title: "Kurban Bayramı Hediyesi Fikirleri 2025",
    excerpt: "Kurban Bayramı'nda sevdiklerinize verebileceğiniz en anlamlı hediyelikler: tesbih setleri, seccade, namaz örtüsü ve kombine hediye fikirleri.",
    category: "Rehber",
    date: "2025-05-10",
    readTime: "4 dk",
  },
  {
    slug: "sunnet-dugunu-hediyelik-onerileri",
    title: "Sünnet Düğünü Hediyelik Önerileri",
    excerpt: "Sünnet töreninde çocuğa verilecek en anlamlı dini hediyelikler ve toplu davetliye dağıtılacak hediyelik seçenekleri.",
    category: "Rehber",
    date: "2025-05-17",
    readTime: "3 dk",
  },
  {
    slug: "bebek-mevludu-hediyelik-fikirleri",
    title: "Bebek Mevlüdü Hediyelik Fikirleri",
    excerpt: "Yeni doğan bebeğin mevlüdünde misafirlere verilecek en güzel hediyelikler ve bebek için anlamlı dini armağanlar.",
    category: "Rehber",
    date: "2025-05-24",
    readTime: "3 dk",
  },
  {
    slug: "taziye-hediyesi-ne-verilir",
    title: "Taziye Hediyesi Ne Verilir?",
    excerpt: "Vefat eden kişinin ailesine yapılacak ziyarette ne götürülür? Taziye ziyaretinde anlamlı hediye seçenekleri ve dikkat edilmesi gerekenler.",
    category: "Rehber",
    date: "2025-05-31",
    readTime: "4 dk",
  },
  {
    slug: "bayram-hediyesi-fikirleri",
    title: "Bayram Hediyesi Fikirleri: Ramazan ve Kurban",
    excerpt: "Ramazan ve Kurban Bayramı'nda sevdiklerinizi mutlu edecek dini ve anlamlı hediye fikirleri; her bütçeye uygun seçenekler.",
    category: "Rehber",
    date: "2025-06-07",
    readTime: "3 dk",
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
