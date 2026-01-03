// app/videos/VideosIndexClient.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import "./videos.css";

export const dynamic = "force-static";

/** ✅ helper: ตรวจว่ามีรูปจริงไหม */
function hasThumb(v) {
  const t = String(v?.thumbnail || "").trim();
  return !!t;
}

/** ✅ helper: fallback รูป (ถ้าไม่มี thumbnail ให้ใช้ภาพ default ของเว็บ) */
function fallbackThumb() {
  return "/default-thumb.jpg";
}

export default function VideosIndexClient() {
  const [videos, setVideos] = useState([]);
  const [tag, setTag] = useState("");

  // โหลดวิดีโอทั้งหมด
  useEffect(() => {
    fetch("/api/videos", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setVideos(Array.isArray(d.items) ? d.items : []))
      .catch(() => { });
  }, []);

  // ตรวจ query ?tag= สำหรับกรอง
  useEffect(() => {
    const u = new URL(window.location.href);
    setTag(u.searchParams.get("tag") || "");
  }, []);

  // กรองตามแท็ก
  const filtered = useMemo(() => {
    if (!tag) return videos;
    const q = tag.toLowerCase();
    return videos.filter(
      (v) =>
        Array.isArray(v.tags) &&
        v.tags.some((t) => String(t).toLowerCase() === q)
    );
  }, [videos, tag]);

  return (
    <main className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <h1 className="mb-0">วิดีโอความรู้โฆษณาออนไลน์</h1>
        <div className="d-flex gap-2 align-items-center">
          {tag && <span className="badge text-bg-secondary">กรองแท็ก: {tag}</span>}
          {tag && (
            <a className="btn btn-sm btn-outline-secondary" href="/videos">
              ล้างตัวกรอง
            </a>
          )}
        </div>
      </div>

      {/* วิดีโอทั้งหมด */}
      <div className="row">
        {filtered.map((v, index) => {
          const showThumb = hasThumb(v);
          const thumbSrc = showThumb ? String(v.thumbnail).trim() : fallbackThumb();

          return (
            <div className="col-md-4 mb-4" key={`${v.slug}-${index}`}>
              <div className="card h-100 shadow-sm video-card">
                {/* ✅ Thumbnail: ไม่บังคับ
                    - ถ้ามีรูป: แสดงรูป
                    - ถ้าไม่มีรูป: แสดง placeholder (ไม่ทำให้พัง) */}
                {showThumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbSrc}
                    className="card-img-top video-thumb"
                    alt={v.title || "video"}
                    loading="lazy"
                    onError={(e) => {
                      // ถ้าลิงก์รูปพัง ให้ fallback
                      e.currentTarget.src = fallbackThumb();
                    }}
                  />
                ) : (
                  <div
                    className="card-img-top video-thumb d-flex align-items-center justify-content-center bg-light"
                    style={{ minHeight: 180 }}
                    aria-label="no thumbnail"
                  >
                    <div className="text-muted small text-center px-3">
                      ไม่มีรูป Thumbnail
                    </div>
                  </div>
                )}

                <div className="card-body d-flex flex-column">
                  {/* Title */}
                  <h5 className="card-title line-clamp-2" title={v.title || ""}>
                    {v.title || "ไม่มีชื่อวิดีโอ"}
                  </h5>

                  {/* Description แสดงแค่ 3–4 บรรทัด */}
                  {v.excerpt && (
                    <p className="card-text text-muted small line-clamp-3">
                      {v.excerpt}
                    </p>
                  )}

                  {/* Spacer ดันปุ่มลงล่าง */}
                  <div className="spacer" />

                  {/* ปุ่ม “ดูวิดีโอ” ขนาดใหญ่ */}
                  <a
                    href={`/videos/${v.slug}`}
                    className="btn btn-primary btn-lg w-100 mt-2"
                  >
                    ดูวิดีโอ
                  </a>
                </div>
              </div>
            </div>
          );
        })}

        {!filtered.length && (
          <div className="col-12 text-muted text-center mt-5">
            ยังไม่มีวิดีโอ
          </div>
        )}
      </div>
    </main>
  );
}
