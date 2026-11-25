import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { IntlBlogPost } from "@/app/components/IntlBlog";
import { getPost, postsByLang } from "@/lib/intlBlog";

export async function generateStaticParams() {
  return postsByLang("en").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost("en", slug);
  if (!post) return {};
  const url = `https://www.obrnhomen.com/en/blog/${slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: { title: post.title, description: post.excerpt, url, type: "article", publishedTime: post.date, authors: ["OBRNHOMEN"] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getPost("en", slug)) notFound();
  return <IntlBlogPost lang="en" slug={slug} />;
}
