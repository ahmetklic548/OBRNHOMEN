import Link from "next/link";
import { INTL_UI, getPost, postsByLang, type IntlLang } from "@/lib/intlBlog";
import { WHATSAPP_URL } from "@/lib/storeNav";

const SITE = "https://www.obrnhomen.com";

function renderContent(content: string) {
  return content.trim().split("\n").map((line, i) => {
    if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-semibold mt-8 mb-3" style={{ color: "#1D1D1F" }}>{line.slice(3)}</h2>;
    if (/^\*\*(.+?)\*\*/.test(line) || line.includes("**")) {
      const parts = line.replace(/^- /, "").split(/\*\*(.*?)\*\*/);
      const isLi = line.startsWith("- ");
      const inner = parts.map((p, j) => (j % 2 === 1 ? <strong key={j}>{p}</strong> : p));
      return isLi
        ? <li key={i} className="text-sm leading-relaxed mb-1.5 ml-4 list-disc" style={{ color: "#555" }}>{inner}</li>
        : <p key={i} className="text-sm leading-relaxed mb-3" style={{ color: "#444" }}>{inner}</p>;
    }
    if (line.startsWith("- ") || /^\d+\. /.test(line)) return <li key={i} className="text-sm leading-relaxed mb-1.5 ml-4 list-disc" style={{ color: "#555" }}>{line.replace(/^(- |\d+\. )/, "")}</li>;
    if (line.trim() === "") return <div key={i} className="h-3" />;
    return <p key={i} className="text-sm leading-relaxed mb-3" style={{ color: "#555" }}>{line}</p>;
  });
}

export function IntlBlogIndex({ lang }: { lang: IntlLang }) {
  const ui = INTL_UI[lang];
  const posts = postsByLang(lang);
  return (
    <div className="min-h-screen" lang={lang} style={{ background: "#ffffff" }}>
      <div className="pt-10 pb-12 px-6" style={{ background: "#F5F5F7" }}>
        <div className="max-w-2xl mx-auto">
          <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase mb-6" style={{ color: "#86868B" }}>
            <Link href={ui.homeHref}>{ui.home}</Link><span>/</span><span style={{ color: "#1D1D1F" }}>{ui.blog}</span>
          </nav>
          <h1 className="font-semibold leading-tight" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", color: "#1D1D1F" }}>{ui.blogH1}</h1>
          <p className="mt-3 text-sm" style={{ color: "#555" }}>{ui.blogSub}</p>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        {posts.map((p) => (
          <article key={p.slug}>
            <Link href={`/${lang}/blog/${p.slug}`} className="block hover:opacity-80">
              <h2 className="text-lg font-semibold" style={{ color: "#1D1D1F" }}>{p.title}</h2>
              <p className="mt-1 text-sm" style={{ color: "#555" }}>{p.excerpt}</p>
              <span className="mt-1 block text-[11px]" style={{ color: "#86868B" }}>{p.readTime} {ui.read}</span>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export function IntlBlogPost({ lang, slug }: { lang: IntlLang; slug: string }) {
  const ui = INTL_UI[lang];
  const post = getPost(lang, slug);
  if (!post) return null;
  const url = `${SITE}/${lang}/blog/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    inLanguage: lang,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "OBRNHOMEN", url: SITE },
    publisher: { "@type": "Organization", name: "OBRNHOMEN", logo: { "@type": "ImageObject", url: `${SITE}/icons/icon.svg` } },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
  const wa = `${WHATSAPP_URL}?text=${encodeURIComponent(ui.waText)}`;
  return (
    <div className="min-h-screen" lang={lang} style={{ background: "#ffffff" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="pt-10 pb-12 px-6" style={{ background: "#F5F5F7" }}>
        <div className="max-w-2xl mx-auto">
          <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase mb-6" style={{ color: "#86868B" }}>
            <Link href={ui.homeHref}>{ui.home}</Link><span>/</span>
            <Link href={`/${lang}/blog`}>{ui.blog}</Link>
          </nav>
          <p className="text-[10px] mb-3" style={{ color: "#86868B" }}>{post.readTime} {ui.read}</p>
          <h1 className="font-semibold leading-tight" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", letterSpacing: "-0.02em", color: "#1D1D1F" }}>{post.title}</h1>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-6 py-14">
        <div>{renderContent(post.content)}</div>
        <div className="mt-16 p-8 text-center border" style={{ borderColor: "rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.04)" }}>
          <p className="text-sm mb-5" style={{ color: "#555" }}>{ui.cta}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={ui.wholesaleHref} className="inline-block px-8 py-3 text-xs tracking-[0.2em] uppercase" style={{ background: "#1D1D1F", color: "#c9a84c" }}>{ui.ctaBtn}</Link>
            <a href={wa} className="inline-block px-8 py-3 text-xs tracking-[0.2em] uppercase border" style={{ borderColor: "#1D1D1F", color: "#1D1D1F" }}>WhatsApp</a>
          </div>
        </div>
        <div className="mt-8">
          <Link href={`/${lang}/blog`} className="text-xs tracking-widest uppercase" style={{ color: "#86868B" }}>{ui.all}</Link>
        </div>
      </div>
    </div>
  );
}
