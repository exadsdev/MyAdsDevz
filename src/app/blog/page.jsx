// src/app/blog/page.jsx
import JsonLd from "@/app/components/JsonLd";
import { SITE, BRAND, LOGO_URL } from "@/app/seo.config";
import BlogIndexClient from "./BlogIndexClient";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export const metadata = {
  metadataBase: new URL(SITE),
  title: `บทความทั้งหมด | ${BRAND}`,
  description:
    "รวมบทความสอนทำการตลาดออนไลน์ SEO, Google Ads, Facebook Ads, เทคนิคการทำคอนเทนต์ และคู่มือการใช้งานต่าง ๆ",
  alternates: { canonical: `${SITE}/blog` },
  openGraph: {
    type: "website",
    url: `${SITE}/blog`,
    siteName: BRAND,
    title: `บทความทั้งหมด | ${BRAND}`,
    description:
      "รวมบทความสอนทำการตลาดออนไลน์ SEO, Google Ads, Facebook Ads, เทคนิคการทำคอนเทนต์",
    images: [
      {
        url: `${SITE}/og-blog.jpg`,
        width: 1200,
        height: 630,
        alt: `${BRAND} - บทความการตลาดออนไลน์`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `บทความทั้งหมด | ${BRAND}`,
    description:
      "รวมบทความสอนทำการตลาดออนไลน์ SEO, Google Ads, Facebook Ads, เทคนิคการทำคอนเทนต์",
    images: [`${SITE}/og-blog.jpg`],
  },
};

function buildJsonLd() {
  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `บทความทั้งหมด | ${BRAND}`,
    url: `${SITE}/blog`,
    description:
      "รวมบทความสอนทำการตลาดออนไลน์ SEO, Google Ads, Facebook Ads, เทคนิคการทำคอนเทนต์ และคู่มือการใช้งานต่าง ๆ",
    isPartOf: { "@type": "WebSite", name: BRAND, url: SITE },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "หน้าแรก", item: SITE },
        { "@type": "ListItem", position: 2, name: "บทความ", item: `${SITE}/blog` },
      ],
    },
    publisher: {
      "@type": "Organization",
      name: BRAND,
      logo: { "@type": "ImageObject", url: LOGO_URL },
    },
  };
  return webPage;
}

export default function BlogIndexPage() {
  const json = buildJsonLd();
  return (
    <>
      <JsonLd data={json} />
      <BlogIndexClient />
    </>
  );
}
