import type { Metadata } from "next";
import { IntlBlogIndex } from "@/app/components/IntlBlog";
import { INTL_UI } from "@/lib/intlBlog";

const ui = INTL_UI["en"];
export const metadata: Metadata = {
  title: { absolute: ui.blogTitle },
  description: ui.blogDesc,
  alternates: { canonical: "https://www.obrnhomen.com/en/blog" },
  openGraph: { title: ui.blogTitle, description: ui.blogDesc, url: "https://www.obrnhomen.com/en/blog", type: "website", locale: "en_US" },
};

export default function Page() {
  return <IntlBlogIndex lang="en" />;
}
