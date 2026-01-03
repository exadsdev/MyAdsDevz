import { notFound } from "next/navigation";
import PostDetailClient from "./PostDetailClient";
import { getPostBySlug } from "@/lib/postsStore";
import JsonLd from "@/app/components/JsonLd";
import { SITE, BRAND, LOGO_URL } from "@/app/seo.config";
import "bootstrap/dist/css/bootstrap.min.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE;

/** make meta description from excerpt/title (150–160 chars) */
function buildDescription(v) {
  const raw = (v?.excerpt || v?.title || "").trim().replace(/\s+/g, " ");
  const max = 160;
  return raw.length > max ? raw.slice(0, max - 1) + "…" : raw;
}

function canonicalFor(slug) {
  return `${SITE_URL}/blog/${encodeURIComponent(slug)}`;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const v = await getPostBySlug(slug);

  if (!v) {
    return {
      title: `ไม่พบบทความ | ${BRAND}`,
      description: "เนื้อหาที่คุณค้นหาอาจถูกลบหรือย้ายที่แล้ว",
      robots: { index: false, follow: false },
    };
  }

  const title = v.title ? `${v.title} | ${BRAND}` : `บทความ | ${BRAND}`;
  const description = buildDescription(v);
  const url = canonicalFor(v.slug);
  const ogImage = v.thumbnail?.startsWith("http")
    ? v.thumbnail
    : `${SITE_URL}${v.thumbnail || "/images/og-default.jpg"}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    // สำคัญ: ให้ Google แสดง thumbnail ใหญ่
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: BRAND, // สำคัญ: Google ใช้แสดง Site Name
      type: "article",
      article: {
        publishedTime: v.createdAt || v.date,
        modifiedTime: v.updatedAt || v.date,
        authors: [v.author || BRAND],
        tags: v.tags || [],
      },
      images: [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: v.title || "บทความ",
      }],
      locale: "th_TH",
    },
    twitter: {
      card: "summary_large_image",
      site: "@myadsdev",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PostDetailPage({ params }) {
  const { slug } = await params;
  const item = await getPostBySlug(slug);
  if (!item) return notFound();

  const v = item;
  const url = canonicalFor(v.slug);
  const thumbnailUrl = v.thumbnail?.startsWith("http")
    ? v.thumbnail
    : `${SITE_URL}${v.thumbnail || "/images/og-default.jpg"}`;

  // === JSON-LD: BreadcrumbList ===
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "หน้าแรก", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "บทความ", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: v.title || "บทความ", item: url },
    ],
  };

  // === JSON-LD: Article (สำคัญมากสำหรับ Google News/Discover) ===
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: v.title || "บทความ",
    description: v.excerpt || v.title || "",
    image: [thumbnailUrl],
    datePublished: v.createdAt || v.date || new Date().toISOString(),
    dateModified: v.updatedAt || v.date || new Date().toISOString(),
    author: {
      "@type": "Person",
      name: v.author || "ทีมเขียนบทความ",
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: BRAND,
      logo: {
        "@type": "ImageObject",
        url: LOGO_URL.startsWith("http") ? LOGO_URL : `${SITE_URL}${LOGO_URL}`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: (v.tags || []).join(", "),
  };

  // === JSON-LD: WebPage ===
  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    name: v.title || "บทความ",
    url: url,
    description: v.excerpt || v.title || "",
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: thumbnailUrl,
      width: 1200,
      height: 630,
    },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: BRAND },
  };

  return (
    <>
      {/* JSON-LD สำหรับ SEO */}
      <JsonLd json={breadcrumbLd} />
      <JsonLd json={articleLd} />
      <JsonLd json={webPageLd} />

      <PostDetailClient post={item} />
    </>
  );
}

