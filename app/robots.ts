import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/checkout", "/hesap", "/odeme", "/api/"],
    },
    sitemap: "https://www.obrnhomen.com/sitemap.xml",
  };
}
