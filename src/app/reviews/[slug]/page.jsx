import { notFound } from "next/navigation";
import ReviewDetailClient from "./ReviewDetailClient";
import { getReviewBySlug, getAllReviews } from "@/lib/reviewsStore";
import "bootstrap/dist/css/bootstrap.min.css";

export const revalidate = 60;

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_ORIGIN ||
  "http://localhost:3000";

/** meta description 160 chars */
function buildDescription(v) {
  const raw = (v?.excerpt || v?.title || "").trim().replace(/\s+/g, " ");
  const max = 160;
  return raw.length > max ? raw.slice(0, max - 1) + "…" : raw;
}
function canonicalFor(slug) {
  return `${SITE}/reviews/${encodeURIComponent(slug)}`;
}

function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export async function generateStaticParams() {
  try {
    const items = await getAllReviews();
    return (Array.isArray(items) ? items : [])
      .map((x) => x?.slug)
      .filter(Boolean)
      .map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = params || {};
  const v = await getReviewBySlug(slug);

  if (!v) {
    const url = canonicalFor(slug || "");
    return {
      title: "ไม่พบรีวิว | Reviews",
      description: "เนื้อหาที่คุณค้นหาอาจถูกลบหรือย้ายที่แล้ว",
      alternates: { canonical: url },
      robots: { index: false, follow: false },
    };
  }

  const title = v.title ? `${v.title} | Reviews` : "Reviews";
  const description = buildDescription(v);
  const url = canonicalFor(v.slug);
  const ogImage = v.thumbnail || `${SITE}/images/og-review.jpg`;

  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", images: [{ url: ogImage }] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default async function ReviewDetailPage({ params }) {
  const { slug } = params || {};
  const item = await getReviewBySlug(slug);
  if (!item) return notFound();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": SITE },
        { "@type": "ListItem", "position": 2, "name": "รีวิวลูกค้า", "item": `${SITE}/reviews` },
        { "@type": "ListItem", "position": 3, "name": item.title || "รีวิว", "item": canonicalFor(slug) }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Review",
      "name": item.title || "รีวิวลูกค้า",
      "datePublished": item.date,
      "author": item.author ? { "@type": "Person", "name": item.author } : undefined,
      "reviewBody": item.excerpt || item.title,
      "url": canonicalFor(slug),
      "image": item.thumbnail ? [item.thumbnail] : undefined,
      "about": String(item.category || "").toUpperCase(),
      "publisher": { "@type": "Organization", "name": "myads.dev", "url": SITE }
    }
  ];

  const internalLinks = [
    { href: "/reviews#google", label: "ดูรีวิวหมวด Google" },
    { href: "/reviews#facebook", label: "ดูรีวิวหมวด Facebook" },
    { href: "/services/google-ads", label: "บริการทำโฆษณา Google Ads" },
    { href: "/services/facebook-ads", label: "บริการทำโฆษณา Facebook Ads" },
    { href: "/blog", label: "บทความการตลาดออนไลน์" },
    { href: "/faq", label: "คำถามที่พบบ่อย (FAQ)" },
    { href: "/contact", label: "ติดต่อเรา" },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <ReviewDetailClient review={item} internalLinks={internalLinks} />
    </>
  );
}
