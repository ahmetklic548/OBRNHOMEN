import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

const posts: Record<string, {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  content: string;
}> = {
  "hac-umre-hediyesi-nasil-secilir": {
    title: "Hac ve Umre Hediyeliği Nasıl Seçilir?",
    excerpt: "Hac veya umreden dönen sevdiklerinize en anlamlı hediyeyi seçmek için bilmeniz gerekenler.",
    category: "Rehber",
    date: "2025-01-15",
    readTime: "4 dk",
    content: `
Hac ve umre, Müslümanlar için son derece özel ve manevi bir yolculuktur. Bu kutlu seferden dönen sevdiklerinize verilecek hediye de o manevi atmosferi taşımalıdır.

## Hediyelikte Dikkat Edilmesi Gerekenler

Hac veya umre hediyeliği seçerken şu noktalara dikkat etmek faydalıdır:

**Kullanışlılık:** Günlük hayatta kullanılabilecek ürünler her zaman daha değerlidir. Tesbih, seccade ve namaz örtüleri bu kategorinin en güzel örnekleridir.

**Kalite:** Kutsal bir yolculuğun anısına verilen hediye, kalitesiyle de öne çıkmalıdır. Ucuz ve kolayca bozulan ürünler yerine uzun ömürlü seçenekler tercih edin.

**Anlamlılık:** Kuran-ı Kerim, Delailü'l Hayrat gibi dini kitaplar manevi değer taşır ve yıllarca saklanır.

## En Popüler Hac Umre Hediyelikleri

1. **Tesbih Setleri** — İnci, akik veya kuka tesbihler hem kullanışlı hem de şık hediyelerdir.
2. **Seccade** — Kişiye özel boyut ve desende kaliteli seccadeler her zaman makbuldür.
3. **Hediyelik Setler** — Tesbih, misvak ve örtüden oluşan kombine setler pratik bir seçimdir.
4. **Kuran-ı Kerim** — Özellikle mealli ve Türkçe okunuşlu baskılar çok tercih edilmektedir.
5. **Misvak** — Sünnet olan bu ağız bakımı ürünü küçük ama anlamlı bir hediyedir.

## Toplu Hediyelik Siparişi

Hac veya umre kafilesinden dönen biri için tüm gruba hediye almak istiyorsanız toplu sipariş seçeneği hem ekonomik hem de pratiktir. OBRNHOMEN olarak toplu siparişlerinizde özel fiyat sunmaktayız.
    `,
  },
  "tesbih-cesitleri-ve-anlami": {
    title: "Tesbih Çeşitleri ve Anlamları",
    excerpt: "İnci, akik, kuka ve ahşap tesbihler arasındaki farklar, her birinin özellikleri ve hangi durumda tercih edilmesi gerektiği.",
    category: "Bilgi",
    date: "2025-01-22",
    readTime: "5 dk",
    content: `
Tesbih, İslam geleneğinde Allah'ı zikretmek için kullanılan ve yüzyıllardır el sanatının güzel bir ürünü olan manevi bir araçtır. Farklı taşlar ve materyallerden yapılan tesbihler, hem kullanım amaçları hem de estetik özellikleri bakımından birbirinden ayrılır.

## İnci Tesbih

İnci tesbihler, zarifliği ve inceliğiyle öne çıkar. Genellikle 33 ya da 99 taneli olan inci tesbihler özellikle hanımlar arasında çok tercih edilir. Doğal inci tesbihler hem manevi hem de maddi değer taşır.

## Akik Tesbih

Hz. Peygamber'in (s.a.v.) akik taşını sevdiğine dair rivayetler nedeniyle akik tesbihler ayrı bir öneme sahiptir. Kırmızı, sarı ve beyaz renk seçenekleriyle dikkat çeken akik tesbihler sağlam yapısıyla uzun yıllar kullanılabilir.

## Kuka Tesbih

Kuka, Afrika'da yetişen bir ağacın tohumundan yapılır. Hafifliği ve doğal görünümüyle öne çıkan kuka tesbihler hac ve umre hediyeliği olarak da sıkça tercih edilir.

## Ahşap Tesbih

Öd ağacı, gül ağacı ve sandal ağacından yapılan tesbihler doğal kokusuyla kullanıcısına huzur verir. Özellikle öd ağacından yapılanlar Orta Doğu'da çok rağbet görür.

## Hangi Tesbihi Seçmeliyim?

- **Günlük kullanım için:** Hafif ve dayanıklı kuka veya ahşap tesbih
- **Hediye için:** Kutulu inci veya akik tesbih seti
- **Hac umre hatırası için:** Kuka veya özel baskılı tesbih
    `,
  },
  "mevlut-hediyesi-fikirleri": {
    title: "Mevlüt Hediyesi Fikirleri 2025",
    excerpt: "Mevlüt törenlerinde misafirlere verilecek en güzel hediyelik setleri ve toplu sipariş avantajları.",
    category: "Rehber",
    date: "2025-02-03",
    readTime: "3 dk",
    content: `
Mevlüt törenleri, doğum, ölüm yıl dönümü veya özel günlerde düzenlenen ve misafirlere şükran ifadesi olarak hediyelik dağıtılan anlamlı organizasyonlardır. Doğru hediyeyi seçmek hem misafirlerinizi mutlu eder hem de töreninizin hatırasını yaşatır.

## Mevlüt Hediyelerinde Öne Çıkan Ürünler

**Tesbih + Örtü Seti:** En klasik mevlüt hediyesidir. Kadife kese içinde sunulan tesbih ve namaz örtüsü kombinasyonu her yaştan misafir tarafından beğenilir.

**Misvak Seti:** Sünnete uygun bu hediye, küçük ama anlamlı bir tercih olarak öne çıkar.

**Kuran-ı Kerim:** Cep boy veya çanta boy Kuran-ı Kerim, uzun yıllar kullanılacak kalıcı bir hediyedir.

**Zikirmatik:** Modern ve pratik, her yaşa hitap eden popüler bir mevlüt hediyesidir.

## Toplu Sipariş Avantajları

50 adet ve üzeri siparişlerde özel fiyat ve ücretsiz kargo avantajından yararlanabilirsiniz. Mevlüt organizasyonunuzun tarihini ve ürün tercihlerinizi WhatsApp üzerinden iletmeniz yeterlidir.
    `,
  },
  "seccade-secerken-dikkat-edilmesi-gerekenler": {
    title: "Seccade Seçerken Dikkat Edilmesi Gerekenler",
    excerpt: "Kadife, şipinger ve özel dokuma seccadeler arasında nasıl karar verirsiniz? Kalite kriterleri ve bakım önerileri.",
    category: "Bilgi",
    date: "2025-02-14",
    readTime: "4 dk",
    content: `
Seccade, her Müslümanın günde en az beş kez kullandığı ve bu nedenle kalitesine özellikle dikkat edilmesi gereken bir ibadet aracıdır. Piyasada onlarca farklı model ve materyal bulunmakla birlikte, doğru seccadeyi seçmek biraz bilgi gerektirir.

## Seccade Materyalleri

**Kadife Seccade:** Yumuşak dokusu ve lüks görünümüyle kadife seccadeler hem ev kullanımı hem de hediye için idealdir. Kalın yapısı sayesinde zeminden gelen soğuğu yalıtır.

**Şipinger Seccade:** Hafifliği ve kolay taşınabilirliğiyle şipinger seccadeler yolculuklar ve dışarı çıkmalar için tercih edilir.

**Özel Dokuma (İpek Karışımlı):** Daha özenli bir seçim arıyorsanız ipek karışımlı veya özel el dokuma seccadeler uzun ömürlü ve estetik bir tercihtir.

## Boyut Rehberi

- **Standart:** 70x110 cm — tek kişilik günlük kullanım
- **Büyük boy:** 80x120 cm — rahat namaz kılmak isteyenler için
- **Çocuk:** 50x80 cm — çocuklara özel küçük boy

## Bakım Önerileri

- Yıkamadan önce etiketi kontrol edin; kadife seccadeler genellikle kuru temizleme gerektirir
- Doğrudan güneş ışığına maruz bırakmayın, renkler solar
- Katlamak yerine rulo yaparak saklayın, bu şekil bozulmasını önler
    `,
  },
};

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://obrnhomen.com/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
      authors: ["OBRNHOMEN"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
    alternates: { canonical: `https://obrnhomen.com/blog/${slug}` },
  };
}

function renderContent(content: string) {
  return content.trim().split("\n").map((line, i) => {
    if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-semibold mt-8 mb-3" style={{ color: "#1D1D1F" }}>{line.slice(3)}</h2>;
    if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-semibold mb-1" style={{ color: "#1D1D1F" }}>{line.slice(2, -2)}</p>;
    if (line.match(/^\*\*(.+?)\*\*/)) {
      const parts = line.split(/\*\*(.*?)\*\*/);
      return <p key={i} className="text-sm leading-relaxed mb-3" style={{ color: "#444" }}>{parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}</p>;
    }
    if (line.startsWith("- ") || line.match(/^\d+\. /)) return <li key={i} className="text-sm leading-relaxed mb-1.5 ml-4 list-disc" style={{ color: "#555" }}>{line.replace(/^[-\d.]+\s/, "")}</li>;
    if (line.trim() === "") return <div key={i} className="h-3" />;
    return <p key={i} className="text-sm leading-relaxed mb-3" style={{ color: "#555" }}>{line}</p>;
  });
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "OBRNHOMEN", url: "https://obrnhomen.com" },
    publisher: {
      "@type": "Organization",
      name: "OBRNHOMEN",
      logo: { "@type": "ImageObject", url: "https://obrnhomen.com/icons/icon.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://obrnhomen.com/blog/${slug}` },
  };

  return (
    <div className="min-h-screen" style={{ background: "#ffffff" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Header */}
      <div className="pt-36 pb-12 px-6" style={{ background: "#F5F5F7" }}>
        <div className="max-w-2xl mx-auto">
          <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase mb-6" style={{ color: "#86868B" }}>
            <Link href="/" className="hover:text-black transition-colors">Anasayfa</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-black transition-colors">Blog</Link>
            <span>/</span>
            <span style={{ color: "#1D1D1F" }} className="line-clamp-1">{post.title}</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-[9px] tracking-[0.3em] uppercase px-2 py-0.5" style={{ background: "rgba(201,168,76,0.12)", color: "#c9a84c" }}>
              {post.category}
            </span>
            <span className="text-[10px]" style={{ color: "#86868B" }}>{post.readTime} okuma</span>
            <span className="text-[10px]" style={{ color: "#86868B" }}>
              {new Date(post.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>

          <h1 className="font-semibold leading-tight" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", letterSpacing: "-0.02em", color: "#1D1D1F" }}>
            {post.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-14">
        <div className="prose-content">
          {renderContent(post.content)}
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 text-center border" style={{ borderColor: "rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.04)" }}>
          <p className="text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: "#c9a84c" }}>OBRNHOMEN</p>
          <p className="text-sm mb-5" style={{ color: "#86868B" }}>
            El işçiliğiyle hazırlanan tesbih, seccade ve hediyelik ürünleri keşfedin.
          </p>
          <Link
            href="/koleksiyon"
            className="inline-block px-8 py-3 text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-80"
            style={{ background: "#1D1D1F", color: "#c9a84c" }}
          >
            Koleksiyonu Gör
          </Link>
        </div>

        <div className="mt-8">
          <Link href="/blog" className="text-xs tracking-widest uppercase transition-colors hover:text-black" style={{ color: "#86868B" }}>
            ← Tüm Yazılar
          </Link>
        </div>
      </div>
    </div>
  );
}
