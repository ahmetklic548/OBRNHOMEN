import { getAllProducts, getProductsByCategory } from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";
import type { MetadataRoute } from "next";
import { INTL_POSTS } from "@/lib/intlBlog";
import { LANDINGS, landingProducts } from "@/lib/seoContent";

const BASE_URL = "https://www.obrnhomen.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const productUrls = getAllProducts().map(({ slug }) => ({
    url: `${BASE_URL}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryUrls = CATEGORIES.filter((c) => getProductsByCategory(c.name).length).map(({ slug }) => ({
    url: `${BASE_URL}/koleksiyon/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const landingUrls = LANDINGS.filter((l) => landingProducts(l).length).map(({ slug }) => ({
    url: `${BASE_URL}/koleksiyon/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const blogSlugs = [
    "hac-umre-hediyesi-nasil-secilir",
    "tesbih-cesitleri-ve-anlami",
    "mevlut-hediyesi-fikirleri",
    "seccade-secerken-dikkat-edilmesi-gerekenler",
    "ihram-nedir-nasil-kullanilir",
    "namaz-ortusu-secim-rehberi",
    "ramazan-hediyesi-fikirleri",
    "toplu-hediyelik-siparis-rehberi",
    "dugun-nisanda-hediyelik-onerileri",
    "ceyizlik-tesbih-seti-nasil-hazirlanir",
    "misvak-nedir-faydalari",
    "din-kitabi-secimi-rehberi",
    "kurban-bayrami-hediyesi-fikirleri",
    "sunnet-dugunu-hediyelik-onerileri",
    "bebek-mevludu-hediyelik-fikirleri",
    "taziye-hediyesi-ne-verilir",
    "bayram-hediyesi-fikirleri",
  ];

  const blogUrls = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const intlBlogUrls = [
    { url: `${BASE_URL}/en/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${BASE_URL}/fr/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
    ...INTL_POSTS.map((p) => ({ url: `${BASE_URL}/${p.lang}/blog/${p.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1, alternates: { languages: { "tr-TR": BASE_URL, en: `${BASE_URL}/en` } } },
    { url: `${BASE_URL}/koleksiyon`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${BASE_URL}/toptan`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9, alternates: { languages: { "tr-TR": `${BASE_URL}/toptan`, en: `${BASE_URL}/en/wholesale`, fr: `${BASE_URL}/fr` } } },
    { url: `${BASE_URL}/en`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8, alternates: { languages: { "tr-TR": BASE_URL, en: `${BASE_URL}/en` } } },
    { url: `${BASE_URL}/en/wholesale`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8, alternates: { languages: { "tr-TR": `${BASE_URL}/toptan`, en: `${BASE_URL}/en/wholesale`, fr: `${BASE_URL}/fr` } } },
    { url: `${BASE_URL}/fr`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8, alternates: { languages: { "tr-TR": `${BASE_URL}/toptan`, en: `${BASE_URL}/en/wholesale`, fr: `${BASE_URL}/fr` } } },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/returns`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${BASE_URL}/payment`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${BASE_URL}/kargo-takip`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${BASE_URL}/mesafeli-satis-sozlesmesi`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${BASE_URL}/on-bilgilendirme`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${BASE_URL}/kvkk`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${BASE_URL}/gizlilik`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
    ...categoryUrls,
    ...landingUrls,
    ...blogUrls,
    ...intlBlogUrls,
    ...productUrls,
  ];
}
