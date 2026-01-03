// app/admin/posts/AdminPosts.jsx
"use client";

import React, { useEffect, useMemo, useState, startTransition } from "react";
import Nav from "./Nav";

/* ---------- config ---------- */
const BASE_PUBLIC_URL = "https://myad-dev.com/public";

/* ---------- helpers ---------- */
const emptyPost = {
  slug: "",
  title: "",
  date: new Date().toISOString().slice(0, 10),
  excerpt: "",
  tags: [],
  author: "ทีมบทความ",
  thumbnail: "", // เก็บเป็น path เช่น /blog/thumb1.jpg
  contentHtml: "<p>เนื้อหาบทความ…</p>",
  keywords: [],

  // ✅ เพิ่ม FAQ สำหรับบทความ (รองรับ SEO/Schema ฝั่งหน้า blog ได้)
  faqs: [
    // { q: "คำถาม?", a: "คำตอบ..." }
  ],
};

/** แปลงค่า thumbnail ที่เป็น full URL -> path */
function normalizeThumbnail(thumbnail) {
  if (!thumbnail) return "";
  if (thumbnail.startsWith(BASE_PUBLIC_URL)) {
    return thumbnail.slice(BASE_PUBLIC_URL.length) || "";
  }
  return thumbnail;
}

/** แปลงค่า thumbnail ใน state / JSON ให้กลายเป็น URL ที่ใช้แสดงได้จริง */
function resolveThumbnailUrl(thumbnail) {
  if (!thumbnail) return "/default-thumb.jpg";
  if (thumbnail.startsWith("http://") || thumbnail.startsWith("https://")) {
    return thumbnail;
  }
  return `${BASE_PUBLIC_URL}${thumbnail}`;
}

/** อัปโหลดไฟล์รูปไปยัง /api/admin/upload แล้วคืน URL หรือ path */
async function uploadImageFile(file) {
  if (!file) return null;
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body: fd,
  });
  if (!res.ok) throw new Error("อัปโหลดไม่สำเร็จ");
  const j = await res.json();
  // สมมติ API ส่งกลับมาเป็น path เช่น "/uploads/xxx.jpg"
  return j?.url || null;
}

export default function AdminPosts() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyPost);
  const [filter, setFilter] = useState("");
  const [saving, setSaving] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [originalSlug, setOriginalSlug] = useState("");

  // สำหรับอัปโหลด Thumbnail
  const [thumbTab, setThumbTab] = useState("url");
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbUploading, setThumbUploading] = useState(false);

  // ✅ ฟอร์มเพิ่ม FAQ
  const [faqQ, setFaqQ] = useState("");
  const [faqA, setFaqA] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/posts", { cache: "no-store" });
        const j = await res.json();
        if (!active) return;
        startTransition(() => setItems(j?.items || []));
      } catch {
        // ignore
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  async function reload() {
    const r = await fetch("/api/admin/posts", { cache: "no-store" });
    const j = await r.json();
    startTransition(() => setItems(j?.items || []));
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editMode && originalSlug) {
        await fetch(`/api/admin/posts?slug=${encodeURIComponent(originalSlug)}`, {
          method: "DELETE",
        });
      }

      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setSaving(false);
      if (res.ok) {
        setForm(emptyPost);
        setFaqQ("");
        setFaqA("");
        setEditMode(false);
        setOriginalSlug("");
        await reload();
        alert(editMode ? "แก้ไขแล้ว (ลบเดิมและบันทึกใหม่)" : "บันทึกแล้ว");
      } else {
        const j = await res.json().catch(() => ({}));
        alert(j?.error || j?.message || "ผิดพลาด");
      }
    } catch {
      setSaving(false);
      alert("ผิดพลาดระหว่างบันทึก");
    }
  };

  const onDelete = async (slug) => {
    if (!confirm(`ลบบทความ "${slug}"?`)) return;
    const res = await fetch(`/api/admin/posts?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      await reload();
      alert("ลบแล้ว");
      if (editMode && originalSlug === slug) {
        setForm(emptyPost);
        setFaqQ("");
        setFaqA("");
        setEditMode(false);
        setOriginalSlug("");
      }
    } else {
      alert("ลบไม่สำเร็จ");
    }
  };

  const onEdit = (post) => {
    setForm({
      slug: post.slug || "",
      title: post.title || "",
      date: post.date || new Date().toISOString().slice(0, 10),
      excerpt: post.excerpt || "",
      tags: Array.isArray(post.tags) ? post.tags : [],
      author: post.author || "ทีมบทความ",
      thumbnail: normalizeThumbnail(post.thumbnail || ""),
      contentHtml: post.contentHtml || "<p>เนื้อหาบทความ…</p>",
      keywords: Array.isArray(post.keywords) ? post.keywords : [],
      faqs: Array.isArray(post.faqs) ? post.faqs : [],
    });
    setFaqQ("");
    setFaqA("");
    setEditMode(true);
    setOriginalSlug(post.slug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    return items.filter(
      (v) =>
        (v.title || "").toLowerCase().includes(q) ||
        (v.slug || "").toLowerCase().includes(q) ||
        (Array.isArray(v.keywords) ? v.keywords.join(" ").toLowerCase() : "").includes(q)
    );
  }, [items, filter]);

  // ฟังก์ชันอัปโหลดรูป Thumbnail
  const handleUploadThumbnail = async () => {
    if (!thumbFile) return;
    setThumbUploading(true);
    try {
      const urlOrPath = await uploadImageFile(thumbFile);
      let thumbValue = urlOrPath || "";
      if (thumbValue.startsWith(BASE_PUBLIC_URL)) {
        thumbValue = thumbValue.slice(BASE_PUBLIC_URL.length);
      }
      setForm({ ...form, thumbnail: thumbValue });
      setThumbFile(null);
      setThumbTab("url");
      alert("อัปโหลดรูปเรียบร้อยแล้ว");
    } catch (e) {
      alert(e?.message || "อัปโหลดไม่สำเร็จ");
    } finally {
      setThumbUploading(false);
    }
  };

  // ✅ FAQ helpers
  const addFaq = () => {
    const q = String(faqQ || "").trim();
    const a = String(faqA || "").trim();
    if (!q || !a) return alert("กรอกคำถามและคำตอบให้ครบ");
    const next = [...(Array.isArray(form.faqs) ? form.faqs : []), { q, a }];
    setForm({ ...form, faqs: next });
    setFaqQ("");
    setFaqA("");
  };

  const removeFaq = (index) => {
    const arr = Array.isArray(form.faqs) ? [...form.faqs] : [];
    arr.splice(index, 1);
    setForm({ ...form, faqs: arr });
  };

  const moveFaq = (from, to) => {
    const arr = Array.isArray(form.faqs) ? [...form.faqs] : [];
    if (to < 0 || to >= arr.length) return;
    const [it] = arr.splice(from, 1);
    arr.splice(to, 0, it);
    setForm({ ...form, faqs: arr });
  };

  return (
    <div className="container-fluid py-4">
      {/* header */}
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
        <h1 className="h5 fw-bold mb-0">Admin — บทความ</h1>
        <Nav />
      </div>

      <div className="row g-4">
        {/* form */}
        <div className="col-12 col-lg-6">
          <form className="card p-3 border-0 shadow-sm" onSubmit={onSubmit}>
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="h6 fw-bold mb-3">{editMode ? "แก้ไขบทความ" : "สร้างบทความใหม่"}</h2>
              {editMode && (
                <span className="badge text-bg-warning">โหมดแก้ไข (จะลบของเดิมแล้วบันทึกใหม่)</span>
              )}
            </div>

            <label className="form-label">Slug</label>
            <input
              className="form-control mb-2"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value.trim() })}
              required
            />

            <label className="form-label">Title</label>
            <input
              className="form-control mb-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />

            <div className="row">
              <div className="col-6">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control mb-2"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div className="col-6">
                <label className="form-label">Author</label>
                <input
                  className="form-control mb-2"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                />
              </div>
            </div>

            <label className="form-label">Excerpt</label>
            <textarea
              className="form-control mb-2"
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            />

            {/* Thumbnail Input */}
            <label className="form-label mb-1">
              Thumbnail (เก็บ path เฉพาะหลัง <code>https://myad-dev.com</code>)
            </label>
            <div className="small text-muted mb-2">
              Base URL: <code>https://myad-dev.com</code>
            </div>

            <div className="btn-group mb-2" role="group">
              <button
                type="button"
                className={`btn btn-sm ${thumbTab === "url" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setThumbTab("url")}
              >
                ใส่ Path เอง
              </button>

              <button
                type="button"
                className={`btn btn-sm ${thumbTab === "upload" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setThumbTab("upload")}
              >
                อัปโหลด
              </button>
            </div>

            {thumbTab === "url" ? (
              <input
                className="form-control mb-3"
                placeholder="/blog/thumb1.jpg"
                value={form.thumbnail}
                onChange={(e) => setForm({ ...form, thumbnail: e.target.value.trim() })}
              />
            ) : (
              <div className="mb-3">
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => setThumbFile(e.target.files?.[0] || null)}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm mt-2"
                  disabled={!thumbFile || thumbUploading}
                  onClick={handleUploadThumbnail}
                >
                  {thumbUploading ? "กำลังอัปโหลด…" : "อัปโหลด"}
                </button>
              </div>
            )}

            {form.thumbnail && (
              <div className="mb-3 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveThumbnailUrl(form.thumbnail)}
                  alt="preview"
                  style={{ maxWidth: "100%", height: "auto", borderRadius: 8 }}
                />
                <div className="small text-muted mt-1">
                  URL จริง: <code>{resolveThumbnailUrl(form.thumbnail)}</code>
                </div>
              </div>
            )}

            <label className="form-label">Tags (คั่นด้วย ,)</label>
            <input
              className="form-control mb-3"
              value={form.tags.join(", ")}
              onChange={(e) =>
                setForm({
                  ...form,
                  tags: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                })
              }
            />

            <label className="form-label">Keywords (คั่นด้วย ,)</label>
            <input
              className="form-control mb-3"
              value={form.keywords.join(", ")}
              onChange={(e) =>
                setForm({
                  ...form,
                  keywords: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                })
              }
            />

            <label className="form-label">เนื้อหา (HTML)</label>
            <textarea
              className="form-control mb-3"
              rows={8}
              value={form.contentHtml}
              onChange={(e) => setForm({ ...form, contentHtml: e.target.value })}
            />

            {/* ✅ FAQ editor */}
            <div className="border rounded p-2 mb-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <label className="form-label mb-0 fw-semibold">FAQ (คำถามที่พบบ่อย)</label>
                <span className="badge text-bg-light">{Array.isArray(form.faqs) ? form.faqs.length : 0} ข้อ</span>
              </div>

              <div className="row g-2 mb-2">
                <div className="col-12">
                  <input
                    className="form-control"
                    placeholder="คำถาม (Q)"
                    value={faqQ}
                    onChange={(e) => setFaqQ(e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="คำตอบ (A) — ใส่เป็นข้อความ หรือ HTML ก็ได้"
                    value={faqA}
                    onChange={(e) => setFaqA(e.target.value)}
                  />
                </div>
                <div className="col-12 d-flex gap-2">
                  <button type="button" className="btn btn-outline-primary btn-sm" onClick={addFaq}>
                    + เพิ่ม FAQ
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      setFaqQ("");
                      setFaqA("");
                    }}
                  >
                    ล้างช่อง
                  </button>
                </div>
              </div>

              {Array.isArray(form.faqs) && form.faqs.length > 0 ? (
                <div className="list-group">
                  {form.faqs.map((f, i) => (
                    <div key={`${i}-${f?.q || "faq"}`} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start gap-2">
                        <div className="flex-grow-1">
                          <div className="fw-semibold">{f?.q}</div>
                          <div className="small text-muted mt-1" style={{ whiteSpace: "pre-wrap" }}>
                            {f?.a}
                          </div>
                        </div>

                        <div className="d-flex flex-column gap-1">
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => moveFaq(i, i - 1)}
                            disabled={i === 0}
                            title="เลื่อนขึ้น"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => moveFaq(i, i + 1)}
                            disabled={i === (form.faqs.length - 1)}
                            title="เลื่อนลง"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeFaq(i)}
                            title="ลบ"
                          >
                            ลบ
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted small">ยังไม่มี FAQ</div>
              )}
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-primary" disabled={saving} type="submit">
                {saving ? "กำลังบันทึก…" : editMode ? "บันทึกการแก้ไข" : "บันทึก"}
              </button>
              {editMode && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setForm(emptyPost);
                    setFaqQ("");
                    setFaqA("");
                    setEditMode(false);
                    setOriginalSlug("");
                  }}
                >
                  ยกเลิกแก้ไข
                </button>
              )}
            </div>
          </form>
        </div>

        {/* list */}
        <div className="col-12 col-lg-6">
          <div className="card p-3 border-0 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h2 className="h6 fw-bold mb-0">รายการบทความ</h2>
              <input
                className="form-control form-control-sm"
                style={{ maxWidth: 260 }}
                placeholder="ค้นหา… (title/slug/keywords)"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>

            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th style={{ width: 120 }}>รูป</th>
                    <th>Slug</th>
                    <th style={{ width: 220 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((v, idx) => (
                    <tr key={`${v.slug}-${idx}`}>
                      <td>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={resolveThumbnailUrl(v.thumbnail)}
                          alt=""
                          width={120}
                          height={68}
                          style={{ objectFit: "cover", borderRadius: 8 }}
                        />
                      </td>

                      <td className="small text-muted">{v.slug}</td>

                      <td className="text-end">
                        <a
                          className="btn btn-outline-secondary btn-sm me-2"
                          href={`/blog/${v.slug}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          ดู
                        </a>
                        <button className="btn btn-outline-primary btn-sm me-2" onClick={() => onEdit(v)}>
                          แก้ไข
                        </button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(v.slug)}>
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-muted small">
                        ยังไม่มีบทความ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
