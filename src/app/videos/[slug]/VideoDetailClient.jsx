// app/videos/[slug]/VideoDetailClient.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import VideoLd from "@/app/components/VideoLd";
import BreadcrumbLd from "@/app/components/BreadcrumbLd";
import FAQLd from "@/app/components/FAQLd";

/** helper: ดึง YouTube ID จาก URL/ID */
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

/** ✅ helper: แปลง thumbnail ให้เป็น URL ที่ใช้ได้จริง */
function resolveThumbUrl(thumb, baseUrl) {
  const t = String(thumb || "").trim();
  if (!t) return "";
  if (t.startsWith("http://") || t.startsWith("https://")) return t;
  if (t.startsWith("//")) return "https:" + t;
  if (!baseUrl) return t;
  if (t.startsWith("/")) return baseUrl + t;
  return baseUrl + "/" + t;
}

/** ✅ helper: baseUrl สำหรับ client-side (ไม่พึ่ง env เพื่อกัน undefined) */
function getBaseUrl() {
  if (typeof window === "undefined") return "";
  return window.location.origin || "";
}

/** ✅ helper: แปลง duration ให้เป็น seconds เพื่อใช้ sort/related ได้ (รองรับ PT#H#M#S) */
function isoDurationToSeconds(d = "") {
  const s = String(d || "").trim();
  if (!s) return 0;
  const m = s.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return 0;
  const h = Number(m[1] || 0);
  const mm = Number(m[2] || 0);
  const ss = Number(m[3] || 0);
  return h * 3600 + mm * 60 + ss;
}

/** ✅ Related list (client) — แก้ bug: createdAt อาจไม่มี */
function RelatedList({ currentSlug, tags = [], baseUrl }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let alive = true;
    fetch("/api/videos", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        setItems(Array.isArray(d.items) ? d.items : []);
      })
      .catch(() => { });
    return () => {
      alive = false;
    };
  }, []);

  const list = useMemo(() => {
    const set = new Set((tags || []).map((t) => String(t).toLowerCase()));
    const scored = items
      .filter((x) => x && x.slug && x.slug !== currentSlug)
      .map((x) => {
        const overlap = (Array.isArray(x.tags) ? x.tags : []).reduce(
          (acc, t) => acc + (set.has(String(t).toLowerCase()) ? 1 : 0),
          0
        );

        // ✅ createdAt ไม่ชัวร์ → ใช้ date (YYYY-MM-DD) แทน + fallback
        const dateScore = Number(String(x.date || "").replaceAll("-", "")) || 0;

        // ✅ ถ้าคะแนน overlap เท่ากัน ให้ใช้ date ใหม่กว่า
        return { v: x, score: overlap, dateScore };
      })
      .sort((a, b) => b.score - a.score || b.dateScore - a.dateScore)
      .slice(0, 6)
      .map((x) => x.v);

    return scored;
  }, [items, currentSlug, tags]);

  if (!list.length) return <div className="text-muted small">—</div>;

  return (
    <ul className="list-unstyled m-0">
      {list.map((v) => {
        const thumb = resolveThumbUrl(v.thumbnail, baseUrl);
        return (
          <li key={v.slug} className="d-flex align-items-center mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumb || "/default-thumb.jpg"}
              alt={v.title || ""}
              width={72}
              height={40}
              style={{ objectFit: "cover", borderRadius: 6, marginRight: 8 }}
              loading="lazy"
              decoding="async"
            />
            <div className="flex-grow-1">
              <a className="text-decoration-none" href={`/videos/${v.slug}`}>
                {v.title}
              </a>
              <div className="text-muted small">{v.date}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function VideoDetailClient({ video, prev, next }) {
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(process.env.NEXT_PUBLIC_SITE_URL || getBaseUrl() || "");
  }, []);

  if (!video || typeof video !== "object") {
    return (
      <main className="container-fluid py-5 text-center">
        <p className="text-muted">ไม่พบข้อมูลวิดีโอ</p>
        <a href="/videos" className="btn btn-outline-primary mt-3">
          ← กลับไปหน้าวิดีโอทั้งหมด
        </a>
      </main>
    );
  }

  const v = video;

  const ytId = useMemo(() => extractYoutubeId(v?.youtube || ""), [v?.youtube]);
  const relatedKeywords = (Array.isArray(v?.keywords) ? v.keywords : []).slice(0, 6);

  // SEO variables (client-safe)
  const pageTitle = v?.title || "วิดีโอ";
  const pageDescription = v?.excerpt || v?.title || "วิดีโอจากเว็บไซต์ของเรา";
  const pageUrl = baseUrl ? `${baseUrl}/videos/${v?.slug}` : "";
  const thumbnailUrl = resolveThumbUrl(v?.thumbnail, baseUrl);

  // ✅ preconnect youtube for speed (optional)
  const preconnects = [
    "https://www.youtube.com",
    "https://i.ytimg.com",
    "https://img.youtube.com",
    "https://www.google.com",
  ];

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />

        {/* ✅ Open Graph / Twitter เพิ่มเพื่อแชร์ดีขึ้น */}
        {pageUrl ? <link rel="canonical" href={pageUrl} /> : null}
        <meta property="og:type" content="video.other" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        {pageUrl ? <meta property="og:url" content={pageUrl} /> : null}
        {thumbnailUrl ? <meta property="og:image" content={thumbnailUrl} /> : null}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        {thumbnailUrl ? <meta name="twitter:image" content={thumbnailUrl} /> : null}

        {/* ✅ preconnect */}
        {preconnects.map((href) => (
          <link key={href} rel="preconnect" href={href} />
        ))}

        {/* ✅ JSON-LD (วางใน Head ได้) */}
        <VideoLd video={v} />
        <BreadcrumbLd
          items={[
            { name: "หน้าแรก", url: baseUrl || "/" },
            { name: "วิดีโอ", url: baseUrl ? `${baseUrl}/videos` : "/videos" },
            { name: v.title || "วิดีโอ", url: pageUrl || `/videos/${v?.slug}` },
          ]}
        />
        <FAQLd faqs={Array.isArray(v.faqs) ? v.faqs : []} />

        {/* ✅ เพิ่ม keyword meta (ไม่จำเป็นต่อ ranking มาก แต่ช่วยให้ครบ) */}
        {relatedKeywords.length ? (
          <meta name="keywords" content={relatedKeywords.join(", ")} />
        ) : null}

        {/* ✅ duration เป็น ISO แต่บางที่อยากใช้ seconds: แปลงไว้ได้ถ้าคุณใช้ component VideoLd รองรับ */}
        {v?.duration ? (
          <meta name="duration" content={String(isoDurationToSeconds(v.duration) || "")} />
        ) : null}
      </Head>

      <main className="container-fluid py-4">
        {/* breadcrumbs / internal links */}
        <nav className="mb-3">
          <div className="d-flex justify-content-around">
            <a href="/" className="btn btn-outline-primary">
              ← ไปยังหน้าหลัก
            </a>

            <a href="/videos" className="btn btn-outline-secondary">
              ดูวิดีโอทั้งหมด
            </a>
          </div>
        </nav>

        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <h1 className="h4 mb-2">{v?.title || "ไม่มีชื่อวิดีโอ"}</h1>
            <div className="text-muted small mb-3">
              {v?.date || ""} • {v?.author || "ทีมวิดีโอ"}{" "}
              {v?.duration ? `• ${v.duration}` : ""}
            </div>

            {/* Player ใหญ่ */}
            <div className="ratio ratio-16x9 mb-3">
              {ytId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}`}
                  title={v?.title || "YouTube Video"}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumbnailUrl || "/default-thumb.jpg"}
                  alt={v?.title || ""}
                  className="w-100 rounded"
                  loading="lazy"
                  decoding="async"
                />
              )}
            </div>

            {/* เนื้อหา/ไฮไลท์ */}
            {v?.excerpt ? <p className="text-muted">{v.excerpt}</p> : null}
            {v?.contentHtml ? (
              <div
                className="content"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{ __html: v.contentHtml }}
              />
            ) : null}

            {/* ✅ Transcript (เพื่อ SEO/AI) */}
            {v?.transcriptHtml ? (
              <section className="mt-4">
                <h2 className="h6 fw-bold">สคริปต์/ถอดเสียง (Transcript)</h2>
                <div
                  className="border rounded p-3 small"
                  suppressHydrationWarning
                  dangerouslySetInnerHTML={{ __html: v.transcriptHtml }}
                />
              </section>
            ) : null}

            {/* ✅ FAQ (แสดงบนหน้าเพื่อเสริม E-E-A-T + รองรับ AI Overview) */}
            {Array.isArray(v?.faqs) && v.faqs.filter((x) => x?.q && x?.a).length ? (
              <section className="mt-4">
                <h2 className="h6 fw-bold">คำถามที่พบบ่อย</h2>
                <div className="accordion" id="faqAccordion">
                  {v.faqs
                    .filter((x) => x?.q && x?.a)
                    .slice(0, 12)
                    .map((x, i) => (
                      <div className="accordion-item" key={`faq-${i}`}>
                        <h3 className="accordion-header" id={`faq-h-${i}`}>
                          <button
                            className={`accordion-button ${i === 0 ? "" : "collapsed"}`}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#faq-c-${i}`}
                            aria-expanded={i === 0 ? "true" : "false"}
                            aria-controls={`faq-c-${i}`}
                          >
                            {x.q}
                          </button>
                        </h3>
                        <div
                          id={`faq-c-${i}`}
                          className={`accordion-collapse collapse ${i === 0 ? "show" : ""}`}
                          aria-labelledby={`faq-h-${i}`}
                          data-bs-parent="#faqAccordion"
                        >
                          <div className="accordion-body">{x.a}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            ) : null}

            {/* แท็ก & คีย์เวิร์ด */}
            <div className="mt-3 d-flex flex-wrap gap-2" suppressHydrationWarning>
              {(Array.isArray(v.tags) ? v.tags : []).map((t, i) => (
                <a
                  key={`tag-${t}-${i}`}
                  className="badge text-bg-light text-decoration-none"
                  href={`/videos?tag=${encodeURIComponent(t)}`}
                >
                  #{t}
                </a>
              ))}

              {relatedKeywords.length > 0 ? (
                <>
                  <span className="text-muted small ms-2">คีย์เวิร์ด:</span>
                  {relatedKeywords.map((k, i) => (
                    <a
                      key={`kw-${k}-${i}`}
                      className="badge text-bg-secondary text-decoration-none"
                      href={`/videos?tag=${encodeURIComponent(k)}`}
                    >
                      {k}
                    </a>
                  ))}
                </>
              ) : null}
            </div>

            {/* Prev / Next */}
            <div className="d-flex justify-content-between mt-4">
              <div>
                {prev ? (
                  <a className="btn btn-outline-secondary" href={`/videos/${prev.slug}`}>
                    ← {prev.title}
                  </a>
                ) : null}
              </div>
              <div>
                {next ? (
                  <a className="btn btn-outline-secondary" href={`/videos/${next.slug}`}>
                    {next.title} →
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          {/* Sidebar: วิดีโอที่เกี่ยวข้อง */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h2 className="h6">วิดีโอที่เกี่ยวข้อง</h2>
                <RelatedList
                  currentSlug={v?.slug || ""}
                  tags={v?.tags || []}
                  baseUrl={baseUrl}
                />
              </div>
            </div>

            {/* ✅ Sticky CTA (ออปชัน) */}
            <div className="card border-0 shadow-sm mt-3">
              <div className="card-body">
                <div className="fw-bold mb-1">สนใจบริการ MyAdsDev</div>
                <div className="text-muted small mb-2">
                  ดูตัวอย่างงานจริง + เทคนิคทำวิดีโอให้ติด SEO
                </div>
                <a className="btn btn-primary w-100" href="https://www.myad-dev.com/">
                  ไปหน้าเว็บไซต์หลัก
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
