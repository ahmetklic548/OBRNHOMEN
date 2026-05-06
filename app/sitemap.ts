import { getAllSlugs, getAllCategories } from "@/lib/products";
import type { MetadataRoute } from "next";

const BASE_URL = "https://obrnhomen.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const productUrls = getAllSlugs().map((slug) => ({
    url: `${BASE_URL}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryUrls = getAllCategories().map((cat) => ({
    url: `${BASE_URL}/koleksiyon/${encodeURIComponent(cat)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const blogSlugs = [
    "hac-umre-hediyesi-nasil-secilir",
    "tesbih-cesitleri-ve-anlami",
    "mevlut-hediyesi-fikirleri",
    "seccade-secerken-dikkat-edilmesi-gerekenler",
  ];

  const blogUrls = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${BASE_URL}/koleksiyon`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/returns`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${BASE_URL}/payment`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${BASE_URL}/kargo-takip`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    ...categoryUrls,
    ...blogUrls,
    ...productUrls,
  ];
}
