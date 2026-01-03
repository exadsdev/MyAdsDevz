// Server Component (SEO-ready, no network during build)
import ReviewsClient from "./ReviewsClient";
import { listReviews } from "@/lib/reviewsStore";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_ORIGIN ||
  "http://localhost:3000";

export const revalidate = 60;

async function getAllReviews() {
  try {
    const items = await listReviews();
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function buildDescription(items) {
  const total = items.length;
  const g = items.filter((x) => (x.category || "").toLowerCase() === "google").length;
  const f = items.filter((x) => (x.category || "").toLowerCase() === "facebook").length;
  return `รวมรีวิวลูกค้า ${total} รายการ แยกหมวด Google (${g}) / Facebook (${f}) พร้อมลิงก์ภายในไปยังบริการโฆษณา Google Ads และ Facebook Ads ของเรา`;
}

export async function generateMetadata() {
  const items = await getAllReviews();
  const title = "รีวิวลูกค้า (Google / Facebook) | myads.dev";
  const description = buildDescription(items);
  const url = `${SITE}/reviews`;
  const images = [
    { url: `${SITE}/images/og-reviews.jpg`, width: 1200, height: 630, alt: "รีวิวลูกค้า myads.dev" },
  ];

  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description, images },
    twitter: { card: "summary_large_image", title, description, images: images.map(i => i.url) },
  };
}

function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default async function ReviewsPage() {
  const items = await getAllReviews();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": SITE },
        { "@type": "ListItem", "position": 2, "name": "รีวิวลูกค้า", "item": `${SITE}/reviews` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "รีวิวลูกค้า (Google / Facebook)",
      "url": `${SITE}/reviews`,
      "description": buildDescription(items),
      "hasPart": {
        "@type": "ItemList",
        "itemListElement": items.slice(0, 30).map((r, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "url": `${SITE}/reviews/${encodeURIComponent(r.slug)}`,
          "name": r.title,
        })),
      },
    },
  ];

  const internalLinks = [
    { href: "/services/google-ads", label: "บริการทำโฆษณา Google Ads" },
    { href: "/services/facebook-ads", label: "บริการทำโฆษณา Facebook Ads" },
    { href: "/blog", label: "บทความการตลาดออนไลน์" },
    { href: "/faq", label: "คำถามที่พบบ่อย (FAQ)" },
    { href: "/contact", label: "ติดต่อเรา" },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <ReviewsClient initialItems={items} internalLinks={internalLinks} />
    </>
  );
}
