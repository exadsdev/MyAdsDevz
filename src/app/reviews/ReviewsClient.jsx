"use client";

import { useEffect, useMemo, useState } from "react";
import "./reviews.css";

/* ---------- helpers ---------- */
function formatShortThai(dateStr = "") {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  if (!y || !m || !d) return dateStr;
  const yy = String(y).slice(-2);
  return `${d}/${m}/${yy}`;
}

/** สร้าง URL รูปให้ถูกเสมอ (รองรับ http/https, /uploads, uploads) */
function resolveImg(src, siteOrigin) {
  if (!src) return "";
  const s = String(src).trim();
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith("/")) return (siteOrigin || "") + s;
  return (siteOrigin || "") + "/" + s.replace(/^\/+/, "");
}

/** placeholder แบบ data URI (ไม่พึ่งไฟล์ใน public) */
const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'>
      <rect width='800' height='450' fill='#f0f2f5'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
            font-family='Arial, sans-serif' font-size='28' fill='#99a1aa'>
        ไม่มีรูปภาพ
      </text>
    </svg>`
  );

export default function ReviewsClient({ initialItems = [], internalLinks = [] }) {
  const [items, setItems] = useState(initialItems);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (initialItems?.length) return;
    fetch("/api/reviews", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d.items) ? d.items : []))
      .catch(() => {});
  }, [initialItems]);

  const google = useMemo(
    () => items.filter((x) => String(x.category || "").toLowerCase() === "google"),
    [items]
  );
  const facebook = useMemo(
    () => items.filter((x) => String(x.category || "").toLowerCase() === "facebook"),
    [items]
  );

  return (
    <main className="container-fluid py-4">
      <header className="mb-4">
        <h1 className="mb-1">⭐ รีวิวลูกค้า</h1>
        <p className="text-muted mb-0">
          รีวิวจากลูกค้า แยกหมวด Google / Facebook พร้อมลิงก์ภายในสู่บริการที่เกี่ยวข้อง
        </p>
      </header>

      <nav className="mb-4">
        <ul className="nav nav-pills flex-wrap gap-2">
          <li className="nav-item">
            <a className="btn btn-outline-secondary btn-sm" href="/reviews#google">ดูรีวิว Google</a>
          </li>
          <li className="nav-item">
            <a className="btn btn-outline-secondary btn-sm" href="/reviews#facebook">ดูรีวิว Facebook</a>
          </li>
          {internalLinks.map((l, i) => (
            <li className="nav-item" key={i}>
              <a className="btn btn-outline-primary btn-sm" href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Google */}
      <section id="google" className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2 className="h5 mb-0">Google</h2>
          <span className="badge text-bg-secondary">{google.length} รายการ</span>
        </div>
        <div className="row">
          {google.map((r, index) => {
            const src = resolveImg(r.thumbnail, origin);
            return (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={`${r.slug}-${index}`}>
                <article className="card h-100 shadow-sm review-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src || PLACEHOLDER}
                    onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
                    className="card-img-top review-thumb"
                    alt={r.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="card-body d-flex flex-column">
                    <h3 className="h6 fw-bold line-clamp-2" title={r.title}>
                      <a className="text-decoration-none" href={`/reviews/${r.slug}`}>{r.title}</a>
                    </h3>
                    <p className="text-muted small mb-2">
                      {formatShortThai(r.date)} {r.author ? `• ${r.author}` : ""}
                    </p>
                    {r.excerpt && <p className="card-text text-muted small line-clamp-4">{r.excerpt}</p>}
                    <div className="spacer" />
                    <div className="d-grid gap-2 mt-2">
                      <a href={`/reviews/${r.slug}`} className="btn btn-primary">อ่านต่อ</a>
                      <a href="/services/google-ads" className="btn btn-outline-primary">บริการที่เกี่ยวข้อง: Google Ads</a>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
          {!google.length && <div className="col-12 text-muted">— ยังไม่มีรีวิวหมวด Google —</div>}
        </div>
      </section>

      {/* Facebook */}
      <section id="facebook" className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2 className="h5 mb-0">Facebook</h2>
          <span className="badge text-bg-secondary">{facebook.length} รายการ</span>
        </div>
        <div className="row">
          {facebook.map((r, index) => {
            const src = resolveImg(r.thumbnail, origin);
            return (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={`${r.slug}-${index}`}>
                <article className="card h-100 shadow-sm review-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src || PLACEHOLDER}
                    onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
                    className="card-img-top review-thumb"
                    alt={r.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="card-body d-flex flex-column">
                    <h3 className="h6 fw-bold line-clamp-2" title={r.title}>
                      <a className="text-decoration-none" href={`/reviews/${r.slug}`}>{r.title}</a>
                    </h3>
                    <p className="text-muted small mb-2">
                      {formatShortThai(r.date)} {r.author ? `• ${r.author}` : ""}
                    </p>
                    {r.excerpt && <p className="card-text text-muted small line-clamp-4">{r.excerpt}</p>}
                    <div className="spacer" />
                    <div className="d-grid gap-2 mt-2">
                      <a href={`/reviews/${r.slug}`} className="btn btn-primary">อ่านต่อ</a>
                      <a href="/services/facebook-ads" className="btn btn-outline-primary">บริการที่เกี่ยวข้อง: Facebook Ads</a>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
          {!facebook.length && <div className="col-12 text-muted">— ยังไม่มีรีวิวหมวด Facebook —</div>}
        </div>
      </section>
    </main>
  );
}
