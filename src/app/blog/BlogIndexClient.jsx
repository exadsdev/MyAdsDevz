"use client";

import { useEffect, useMemo, useState } from "react";
import "./blog.css";

/* ---------- config ---------- */
const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_ORIGIN ||
  "";
const BASE_PUBLIC_URL = SITE_ORIGIN ? SITE_ORIGIN.replace(/\/+$/, "") : "";

/* ---------- helpers ---------- */
function resolveThumbnailUrl(thumbnail) {
  if (!thumbnail) return "/default-thumb.jpg";
  const s = String(thumbnail).trim();

  // ถ้าเป็น URL เต็ม
  if (/^https?:\/\//i.test(s)) return s;

  // ถ้าเป็น path ภายใน
  if (BASE_PUBLIC_URL) {
    // ensure we don't duplicate '/public' — match post page behavior: SITE + thumbnail
    if (s.startsWith("/")) {
      return BASE_PUBLIC_URL + s;
    }
    return BASE_PUBLIC_URL + "/" + s.replace(/^\/+/, "");
  }

  // fallback ถ้าไม่ได้ตั้งค่า SITE_ORIGIN
  return s || "/default-thumb.jpg";
}

export default function BlogIndexClient() {
  const [posts, setPosts] = useState([]);
  const [tag, setTag] = useState("");

  useEffect(() => {
    fetch("/api/posts", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setPosts(Array.isArray(d.items) ? d.items : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const u = new URL(window.location.href);
    setTag(u.searchParams.get("tag") || "");
  }, []);

  const filtered = useMemo(() => {
    if (!tag) return posts;
    const q = tag.toLowerCase();
    return posts.filter(
      (p) =>
        Array.isArray(p.tags) &&
        p.tags.some((t) => String(t).toLowerCase() === q)
    );
  }, [posts, tag]);

  return (
    <main className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <h1 className="mb-0">📝 บทความทั้งหมด</h1>
        <div className="d-flex gap-2 align-items-center">
          {tag && (
            <span className="badge text-bg-secondary">
              กรองแท็ก: {tag}
            </span>
          )}
          {tag && (
            <a
              className="btn btn-sm btn-outline-secondary"
              href="/blog"
            >
              ล้างตัวกรอง
            </a>
          )}
        </div>
      </div>

      <div className="row">
        {filtered.map((p, index) => (
          <div
            className="col-md-4 mb-4"
            key={`${p.slug}-${index}`}
          >
            <div className="card h-100 shadow-sm post-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveThumbnailUrl(p.thumbnail)}
                className="card-img-top post-thumb"
                alt={p.title}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/default-thumb.jpg";
                }}
              />
              <div className="card-body d-flex flex-column">
                <h5
                  className="card-title line-clamp-2"
                  title={p.title}
                >
                  {p.title}
                </h5>
                {p.excerpt && (
                  <p className="card-text text-muted small line-clamp-4">
                    {p.excerpt}
                  </p>
                )}
                <div className="text-muted small">
                  {p.date}{" "}
                  {p.author ? `• ${p.author}` : ""}
                </div>
                <div className="spacer" />
                <a
                  href={`/blog/${p.slug}`}
                  className="btn btn-primary btn-lg w-100 mt-2"
                >
                  อ่านบทความ
                </a>
              </div>
            </div>
          </div>
        ))}

        {!filtered.length && (
          <div className="col-12 text-muted text-center mt-5">
            ยังไม่มีบทความ
          </div>
        )}
      </div>
    </main>
  );
}
