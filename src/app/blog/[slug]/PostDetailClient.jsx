"use client";

import React, { useEffect, useMemo, useState } from "react";

/* ---------- config ---------- */
const BASE_PUBLIC_URL = "https://myad-dev.com/public";

/* ---------- helpers ---------- */
function resolveThumbnailUrl(thumbnail) {
  if (!thumbnail) return "/default-thumb.jpg";
  if (thumbnail.startsWith("http://") || thumbnail.startsWith("https://")) {
    return thumbnail;
  }
  return `${BASE_PUBLIC_URL}${thumbnail}`;
}

export default function PostDetailClient({ post }) {
  if (!post || typeof post !== "object") {
    return (
      <main className="container-fluid py-5 text-center">
        <p className="text-muted">ไม่พบบทความ</p>
        <a href="/blog" className="btn btn-outline-primary mt-3">
          ← กลับไปหน้าบทความ
        </a>
      </main>
    );
  }

  const p = post;
  const thumbUrl = p?.thumbnail ? resolveThumbnailUrl(p.thumbnail) : null;

  return (
    <main className="container-fluid py-4">
      <nav className="mb-3">
        <a href="/blog" className="text-decoration-none">
          ← กลับไปหน้าบทความทั้งหมด
        </a>
      </nav>

      <article className="row g-4">
        <div className="col-12 col-lg-8">
          <h1 className="h3 mb-2">{p?.title || "ไม่มีชื่อบทความ"}</h1>
          <div className="text-muted small mb-3">
            {p?.date || ""} • {p?.author || "ทีมบทความ"}
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          {thumbUrl && (
            <img
              src={thumbUrl}
              alt={p.title}
              className="img-fluid rounded mb-3"
              style={{ width: "100%", height: "auto" }}
            />
          )}

          {p?.excerpt && <p className="text-muted">{p.excerpt}</p>}

          {p?.contentHtml && (
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: p.contentHtml }}
            />
          )}

          <div className="mt-3 d-flex flex-wrap gap-2">
            {(Array.isArray(p.tags) ? p.tags : []).map((t, i) => (
              <a
                key={`tag-${t}-${i}`}
                className="badge text-bg-light text-decoration-none"
                href={`/blog?tag=${encodeURIComponent(t)}`}
              >
                #{t}
              </a>
            ))}
            {(Array.isArray(p.keywords) ? p.keywords.slice(0, 6) : []).map(
              (k, i) => (
                <span
                  key={`kw-${k}-${i}`}
                  className="badge text-bg-secondary"
                >
                  {k}
                </span>
              )
            )}
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h2 className="h6">บทความอื่น ๆ</h2>
              <RelatedPosts currentSlug={p.slug} tags={p.tags} />
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}

/** Related posts by overlapping tags (client fetch) */
function RelatedPosts({ currentSlug, tags = [] }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/posts", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d.items) ? d.items : []))
      .catch(() => {});
  }, []);

  const list = useMemo(() => {
    const set = new Set((tags || []).map((t) => String(t).toLowerCase()));
    const scored = items
      .filter((x) => x.slug !== currentSlug)
      .map((x) => {
        const overlap = (x.tags || []).reduce(
          (acc, t) => acc + (set.has(String(t).toLowerCase()) ? 1 : 0),
          0
        );
        return { v: x, score: overlap };
      })
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const da = new Date(a.v.date || a.v.createdAt || 0).getTime();
        const db = new Date(b.v.date || b.v.createdAt || 0).getTime();
        return db - da;
      })
      .slice(0, 6)
      .map((x) => x.v);
    return scored;
  }, [items, currentSlug, tags]);

  if (!list.length) return <div className="text-muted small">—</div>;

  return (
    <ul className="list-unstyled m-0">
      {list.map((v, idx) => (
        <li
          key={`${v.slug}-${idx}`}
          className="d-flex align-items-center mb-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolveThumbnailUrl(v.thumbnail)}
            alt=""
            width={72}
            height={40}
            style={{ objectFit: "cover", borderRadius: 6, marginRight: 8 }}
          />
          <div className="flex-grow-1">
            <a
              className="text-decoration-none"
              href={`/blog/${v.slug}`}
            >
              {v.title}
            </a>
            <div className="text-muted small">{v.date}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
