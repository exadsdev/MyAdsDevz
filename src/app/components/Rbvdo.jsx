"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import "./latest-content.css";

export default function LatestContentSections() {
  const [videos, setVideos] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reviews, setReviews] = useState([]);

  // โหลดข้อมูล
  useEffect(() => {
    fetch("/api/videos").then(r => r.json()).then(d => setVideos(d.items || []));
    fetch("/api/posts").then(r => r.json()).then(d => setPosts(d.items || []));
    fetch("/api/reviews").then(r => r.json()).then(d => setReviews(d.items || []));
  }, []);

  const latestVideos = useMemo(() => videos.slice(0, 3), [videos]);
  const latestPosts = useMemo(() => posts.slice(0, 3), [posts]);
  const latestReviews = useMemo(() => reviews.slice(0, 3), [reviews]);

  return (
    <section className="latest-wrapper">

      {/* วิดีโอ */}
      <div className="latest-block">
        <div className="latest-head">
          <h3>🎞️ วิดีโอล่าสุด</h3>
          <Link href="/videos">ดูทั้งหมด →</Link>
        </div>

        <div className="latest-horizontal">
          {latestVideos.map((v, i) => (
            <article className="latest-card" key={i}>
              <img src={v.thumbnail} className="latest-img" alt="" />
              <h4 className="latest-title">{v.title}</h4>
              <p className="latest-text">{v.excerpt}</p>
              <a href={`/videos/${v.slug}`} className="latest-btn">ดูวิดีโอ</a>
            </article>
          ))}
        </div>
      </div>

      {/* รีวิว */}
      <div className="latest-block">
        <div className="latest-head">
          <h3>⭐ รีวิวล่าสุด</h3>
          <Link href="/reviews">ดูทั้งหมด →</Link>
        </div>
        <hr />

        <div className="latest-horizontal">
          {latestReviews.map((r, i) => (
            <article className="latest-card" key={i}>
              <img src={r.thumbnail} className="latest-img" alt="" />
              <h4 className="latest-title">{r.title}</h4>
              <p className="latest-text">{r.excerpt}</p>
              <a href={`/reviews/${r.slug}`} className="latest-btn">อ่านรีวิว</a>
            </article>
          ))}
        </div>
      </div>

      {/* บล็อก */}
      <div className="latest-block">
        <div className="latest-head">
          <h3>📝 บทความล่าสุด</h3>
          <Link href="/blog">ดูทั้งหมด →</Link>
        </div>

        <div className="latest-horizontal">
          {latestPosts.map((p, i) => (
            <article className="latest-card" key={i}>
              <img src={p.thumbnail} className="latest-img" alt="" />
              <h4 className="latest-title">{p.title}</h4>
              <p className="latest-text">{p.excerpt}</p>
              <a href={`/blog/${p.slug}`} className="latest-btn">อ่านบทความ</a>
            </article>
          ))}
        </div>
      </div>

    </section>
  );
}
