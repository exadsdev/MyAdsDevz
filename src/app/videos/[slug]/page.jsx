import { notFound } from "next/navigation";
import VideoDetailClient from "./VideoDetailClient";
import { getVideoBySlug } from "@/lib/videosStore";
import JsonLd from "@/app/components/JsonLd";
import { SITE, BRAND, LOGO_URL } from "@/app/seo.config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE;

/** helper: สร้างคำอธิบาย 150–160 ตัวอักษรจาก excerpt/title */
function buildDescription(v) {
  const raw = (v?.excerpt || v?.title || "").trim().replace(/\s+/g, " ");
  const max = 160;
  return raw.length > max ? raw.slice(0, max - 1) + "…" : raw;
}

/** canonical URL */
function canonicalFor(slug) {
  return `${SITE_URL}/videos/${encodeURIComponent(slug)}`;
}

/** helper: ดึง YouTube ID จาก URL */
function extractYoutubeId(input = "") {
  const s = String(input).trim();
  if (!s) return "";
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
      const parts = u.pathname.split("/");
      const last = parts[parts.length - 1];
      if (/^[a-zA-Z0-9_-]{11}$/.test(last)) return last;
    }
    if (u.hostname === "youtu.be") {
      const last = u.pathname.replace("/", "");
      if (/^[a-zA-Z0-9_-]{11}$/.test(last)) return last;
    }
  } catch { }
  return "";
}

/** helper: แปลง duration string เป็น ISO 8601 */
function durationToISO(duration) {
  if (!duration) return "PT5M"; // default 5 นาที
  // ถ้าเป็น format "12:30" หรือ "1:30:00"
  const parts = duration.split(":").map(Number);
  if (parts.length === 2) {
    return `PT${parts[0]}M${parts[1]}S`;
  }
  if (parts.length === 3) {
    return `PT${parts[0]}H${parts[1]}M${parts[2]}S`;
  }
  return "PT5M";
}

/* =========================
   SEO: generateMetadata
   ========================= */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const v = await getVideoBySlug(slug);

  if (!v) {
    return {
      title: "ไม่พบวิดีโอ | Videos",
      description: "เนื้อหาที่คุณค้นหาอาจถูกลบหรือย้ายที่แล้ว",
      robots: { index: false, follow: false },
    };
  }

  const title = v.title ? `${v.title} | ${BRAND}` : `Video | ${BRAND}`;
  const description = buildDescription(v);
  const url = canonicalFor(v.slug);
  const ogImage = v.thumbnail?.startsWith("http")
    ? v.thumbnail
    : `${SITE_URL}${v.thumbnail || "/images/og-default.jpg"}`;

  const ytId = extractYoutubeId(v.youtube || "");
  const embedUrl = ytId ? `https://www.youtube.com/embed/${ytId}` : null;

  return {
    title,
    description,
    alternates: { canonical: url },
    // สำคัญมาก: ให้ Google แสดง thumbnail ใหญ่
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
      type: "video.other",
      videos: embedUrl ? [{
        url: embedUrl,
        secureUrl: embedUrl,
        type: "text/html",
        width: 1280,
        height: 720,
      }] : undefined,
      images: [{
        url: ogImage,
        width: 1280,
        height: 720,
        alt: v.title || "Video",
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

/* =========================
   Page (Server Component)
   ========================= */
export default async function VideoDetailPage({ params }) {
  const { slug } = await params;
  const item = await getVideoBySlug(slug);
  if (!item) return notFound();

  const v = item;
  const url = canonicalFor(v.slug);
  const ytId = extractYoutubeId(v.youtube || "");
  const embedUrl = ytId ? `https://www.youtube.com/embed/${ytId}` : null;
  const thumbnailUrl = v.thumbnail?.startsWith("http")
    ? v.thumbnail
    : `${SITE_URL}${v.thumbnail || "/images/og-default.jpg"}`;

  // === JSON-LD: BreadcrumbList ===
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "หน้าแรก", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "วิดีโอ", item: `${SITE_URL}/videos` },
      { "@type": "ListItem", position: 3, name: v.title || "Video", item: url },
    ],
  };

  // === JSON-LD: VideoObject (สำคัญมากสำหรับ Google Video Search) ===
  const videoLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${url}#video`,
    name: v.title || "Video",
    description: v.excerpt || v.title || "วิดีโอจาก MyAdsDev",
    thumbnailUrl: [thumbnailUrl],
    uploadDate: v.createdAt || v.date || new Date().toISOString(),
    duration: durationToISO(v.duration),
    contentUrl: embedUrl || url,
    embedUrl: embedUrl || undefined,
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: { "@type": "WatchAction" },
      userInteractionCount: v.views || 0
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
  };

  // === JSON-LD: WebPage ===
  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "VideoGallery",
    "@id": url,
    name: v.title || "Video",
    url: url,
    description: v.excerpt || v.title || "",
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: thumbnailUrl,
      width: 1280,
      height: 720,
    },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: BRAND },
  };

  return (
    <>
      {/* JSON-LD สำหรับ SEO */}
      <JsonLd json={breadcrumbLd} />
      <JsonLd json={videoLd} />
      <JsonLd json={webPageLd} />

      <VideoDetailClient video={item} prev={null} next={null} />
    </>
  );
}
