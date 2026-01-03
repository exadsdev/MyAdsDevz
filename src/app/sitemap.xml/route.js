import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/postsStore";
import { getAllVideos } from "@/lib/videosStore";
import { getAllReviews } from "@/lib/reviewsStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

/* ===== Base URL & URL helpers (fix //) ===== */
const RAW_SITE = process.env.NEXT_PUBLIC_SITE_URL || "";
/** ตัด / ท้ายโดเมนออกเสมอ */
const SITE_BASE = RAW_SITE.replace(/\/+$/, "");

/** ทำ absolute URL โดยกัน // ซ้ำ */
function absUrl(path) {
  const cleanPath = `/${String(path || "").replace(/^\/+/, "")}`;
  return `${SITE_BASE}${cleanPath}`;
}

/* ===== Utilities ===== */
function isoDate(d) {
  if (!d) return new Date().toISOString();
  try {
    if (typeof d === "number") return new Date(d).toISOString();
    if (/^\d{4}-\d{2}-\d{2}$/.test(String(d))) return new Date(`${d}T00:00:00Z`).toISOString();
    const n = Number(d);
    if (!Number.isNaN(n)) return new Date(n).toISOString();
    return new Date(d).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function url(loc, { lastmod, changefreq, priority } = {}) {
  return `
  <url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${isoDate(lastmod)}</lastmod>` : ""}
    ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ""}
    ${typeof priority === "number" ? `<priority>${priority.toFixed(1)}</priority>` : ""}
  </url>`;
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

function sortByRankOrViews(items = []) {
  const arr = Array.isArray(items) ? [...items] : [];
  return arr.sort((a, b) => {
    const ra = Number.isFinite(+a?.rank) ? +a.rank : Infinity;
    const rb = Number.isFinite(+b?.rank) ? +b.rank : Infinity;
    if (ra !== rb) return ra - rb;

    const va = Number.isFinite(+a?.views) ? +a.views : -1;
    const vb = Number.isFinite(+b?.views) ? +b.views : -1;
    if (va !== vb) return vb - va;

    const ua = Number(a?.updatedAt || 0);
    const ub = Number(b?.updatedAt || 0);
    if (ua !== ub) return ub - ua;

    const da = String(a?.date || "");
    const db = String(b?.date || "");
    return db.localeCompare(da);
  });
}

function computePriority({ item, index, topViews = 0, base = 0.7 }) {
  if (Number.isFinite(+item?.rank)) {
    const r = Math.max(1, Math.min(50, +item.rank));
    const p = 1.0 - Math.min(0.7, (r - 1) * 0.04);
    return Math.max(0.3, +p.toFixed(2));
  }
  if (Number.isFinite(+item?.views) && topViews > 0) {
    const v = Math.max(0, Math.min(topViews, +item.views));
    const p = 0.6 + 0.4 * (v / topViews);
    return +p.toFixed(2);
  }
  const tier = Math.min(index, 10);
  const p = base - tier * 0.02;
  return Math.max(0.3, +p.toFixed(2));
}

/* ===== Main ===== */
export async function GET() {
  const [postsRaw, videosRaw, reviewsRaw] = await Promise.all([
    getAllPosts().catch(() => []),
    getAllVideos().catch(() => []),
    getAllReviews().catch(() => []),
  ]);

  const posts = sortByRankOrViews(postsRaw);
  const videos = sortByRankOrViews(videosRaw);
  const reviews = sortByRankOrViews(reviewsRaw);

  const topPostViews = Math.max(0, ...posts.map((x) => Number(x?.views || 0)));
  const topVideoViews = Math.max(0, ...videos.map((x) => Number(x?.views || 0)));
  const topReviewViews = Math.max(0, ...reviews.map((x) => Number(x?.views || 0)));

  // รวมแท็กบล็อกไว้สร้างหน้า tag/*
  const uniquePostTags = uniq(
    posts.flatMap((p) => (Array.isArray(p.tags) ? p.tags : []))
      .map((t) => String(t).trim())
      .filter(Boolean)
  );

  /* ===== Static pages (เพิ่มตามที่คุณแจ้ง) =====
   * - หน้าแรก
   * - บริการ
   * - บทความ
   * - Google Ads
   * - Facebook Ads
   * - คอร์สเรียนยิงAds
   * - Video
   * - FAQ
   * - search
   * - ติดต่อเรา
   *
   * เปลี่ยน path ได้ตาม routing จริงในโปรเจคคุณ
   */
  const STATIC_PAGES = [
    { path: "/", changefreq: "daily", priority: 1.0 },
    { path: "/services", changefreq: "monthly", priority: 0.5 },
    { path: "/blog", changefreq: "daily", priority: 0.9, lastmod: posts[0]?.updatedAt || posts[0]?.date },
    { path: "/google-ads", changefreq: "weekly", priority: 0.7 },
    { path: "/facebook-ads", changefreq: "weekly", priority: 0.7 },
    { path: "/courses", changefreq: "weekly", priority: 0.6 }, // คอร์สเรียนยิงAds
    { path: "/videos", changefreq: "daily", priority: 0.9, lastmod: videos[0]?.updatedAt || videos[0]?.date },
    { path: "/faq", changefreq: "monthly", priority: 0.5 },
    { path: "/search", changefreq: "weekly", priority: 0.5 },
    { path: "/contact", changefreq: "monthly", priority: 0.5 }, // ติดต่อเรา
    { path: "/reviews", changefreq: "weekly", priority: 0.8, lastmod: reviews[0]?.updatedAt || reviews[0]?.date },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
`;

  // Static pages
  for (const p of STATIC_PAGES) {
    xml += url(absUrl(p.path), {
      lastmod: p.lastmod,
      changefreq: p.changefreq,
      priority: p.priority,
    });
  }

  // Blog posts
  posts.forEach((p, i) => {
    const priority = computePriority({
      item: p,
      index: i,
      topViews: topPostViews,
      base: 0.8,
    });
    xml += url(absUrl(`/blog/${encodeURIComponent(p.slug)}`), {
      lastmod: p.updatedAt || p.date,
      changefreq: "weekly",
      priority,
    });
  });

  // Blog tag pages
  for (const t of uniquePostTags) {
    xml += url(absUrl(`/blog/tag/${encodeURIComponent(t)}`), {
      changefreq: "weekly",
      priority: 0.4,
      lastmod: posts.find((p) => Array.isArray(p.tags) && p.tags.includes(t))?.updatedAt,
    });
  }

  // Videos
  videos.forEach((v, i) => {
    const priority = computePriority({
      item: v,
      index: i,
      topViews: topVideoViews,
      base: 0.7,
    });
    xml += url(absUrl(`/videos/${encodeURIComponent(v.slug)}`), {
      lastmod: v.updatedAt || v.date,
      changefreq: "weekly",
      priority,
    });
  });

  // Reviews
  reviews.forEach((r, i) => {
    const priority = computePriority({
      item: r,
      index: i,
      topViews: topReviewViews,
      base: 0.6,
    });
    xml += url(absUrl(`/reviews/${encodeURIComponent(r.slug)}`), {
      lastmod: r.updatedAt || r.date,
      changefreq: "weekly",
      priority,
    });
  });

  xml += "\n</urlset>";

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store, must-revalidate",
    },
  });
}
