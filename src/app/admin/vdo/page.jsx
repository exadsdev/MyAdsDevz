"use client";

import React, { useEffect, useMemo, useState, startTransition } from "react";

/**
 * Admin Videos (Bootstrap)
 * - Create / Edit / Delete videos
 * - Real-time transcript preview (HTML)
 * - Generate transcriptHtml from raw transcript text
 * - Auto-generate chapters from transcript timecodes (for Schema hasPart Clip)
 *
 * Requires API routes:
 * - GET  /api/admin/videos
 * - POST /api/admin/videos
 * - PUT  /api/admin/videos/[slug]
 * - DELETE /api/admin/videos/[slug]
 */

const emptyVideo = {
    slug: "",
    title: "",
    date: new Date().toISOString().slice(0, 10),
    excerpt: "",
    youtube: "",
    tags: [],
    author: "ทีมวิดีโอ",
    duration: "PT5M", // ISO8601 Duration
    thumbnail: "",
    contentHtml: "<p>สรุป/ไฮไลท์วิดีโอ…</p>",
    keywords: [],
    transcriptHtml: "",
    faqs: [],
    chapters: [],
    // optional for schema
    contentUrl: "",
    uploadDate: "", // ISO date-time (optional). If empty, page can fill from date.
};

function slugifyTH(input = "") {
    return String(input)
        .trim()
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

function safeArray(v) {
    return Array.isArray(v) ? v : [];
}

function csvToArray(s) {
    return String(s || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
}

function arrayToCsv(arr) {
    return safeArray(arr).join(", ");
}

/** ---- Transcript helpers ---- */

/** Accepts: HH:MM:SS, MM:SS, or SS  */
function timecodeToSeconds(tc = "") {
    const t = String(tc).trim();
    if (!t) return null;
    const parts = t.split(":").map((x) => Number(x));
    if (parts.some((n) => Number.isNaN(n))) return null;
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 1) return parts[0];
    return null;
}

function secondsToTimecode(sec = 0) {
    const s = Math.max(0, Math.floor(sec));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const r = s % 60;
    if (h > 0) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

/**
 * Parse raw transcript lines like:
 * 00:00 เปิดคลิป...
 * 00:12 วันนี้เราจะ...
 * or:
 * [00:12] วันนี้เราจะ...
 */
function parseTranscriptRaw(raw = "") {
    const lines = String(raw || "")
        .replace(/\r/g, "")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

    const items = [];
    for (const line of lines) {
        // match 00:00 or 00:00:00 optionally wrapped in []
        const m = line.match(/^\[?(\d{1,2}:\d{2}(?::\d{2})?)\]?\s*(.*)$/);
        if (m) {
            const tc = m[1];
            const text = (m[2] || "").trim();
            items.push({ tc, text });
        } else {
            items.push({ tc: "", text: line });
        }
    }
    return items;
}

/**
 * Build transcript HTML with Bootstrap-friendly markup
 * - With timecodes: <p class="mb-2"><span class="badge ...">00:00</span> text</p>
 * - Without: <p class="mb-2">text</p>
 */
function buildTranscriptHtmlFromRaw(raw = "") {
    const items = parseTranscriptRaw(raw);

    if (!items.length) return "";

    const html = items
        .map(({ tc, text }) => {
            const safeText = escapeHtml(text);
            if (tc) {
                const safeTc = escapeHtml(tc);
                return `<p class="mb-2"><span class="badge text-bg-secondary me-2">${safeTc}</span>${safeText}</p>`;
            }
            return `<p class="mb-2">${safeText}</p>`;
        })
        .join("");

    return `<div class="transcript">${html}</div>`;
}

/**
 * Auto chapters from transcript timecodes:
 * - Each line with timecode becomes a chapter
 * - Label is first 7-10 words (or until 60 chars)
 */
function buildChaptersFromRawTranscript(raw = "") {
    const items = parseTranscriptRaw(raw);
    const chapters = [];

    for (const it of items) {
        if (!it.tc) continue;
        const label = guessLabel(it.text);
        if (!label) continue;
        chapters.push({ t: it.tc, label });
    }

    // de-dup by timecode
    const seen = new Set();
    const dedup = [];
    for (const c of chapters) {
        const key = String(c.t).trim();
        if (!key || seen.has(key)) continue;
        seen.add(key);
        dedup.push({ t: key, label: c.label });
    }

    return dedup;
}

function guessLabel(text = "") {
    const s = String(text || "").trim();
    if (!s) return "";
    // take first ~60 chars, try to cut at word boundary
    const words = s.split(/\s+/).filter(Boolean);
    const take = words.slice(0, 10).join(" ");
    if (take.length <= 60) return take;
    return take.slice(0, 60).trim() + "…";
}

function escapeHtml(str = "") {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function cleanVideoForSave(v) {
    const out = { ...v };

    out.slug = slugifyTH(out.slug || out.title || "");
    out.title = String(out.title || "").trim();
    out.date = String(out.date || "").trim();
    out.excerpt = String(out.excerpt || "").trim();
    out.youtube = String(out.youtube || "").trim();
    out.thumbnail = String(out.thumbnail || "").trim();
    out.author = String(out.author || "").trim();
    out.duration = String(out.duration || "").trim() || "PT0M";
    out.contentHtml = String(out.contentHtml || "").trim();
    out.transcriptHtml = String(out.transcriptHtml || "").trim();
    out.contentUrl = String(out.contentUrl || "").trim();
    out.uploadDate = String(out.uploadDate || "").trim();

    out.tags = safeArray(out.tags).map((x) => String(x).trim()).filter(Boolean);
    out.keywords = safeArray(out.keywords).map((x) => String(x).trim()).filter(Boolean);

    out.faqs = safeArray(out.faqs)
        .map((x) => ({ q: String(x?.q || "").trim(), a: String(x?.a || "").trim() }))
        .filter((x) => x.q && x.a);

    out.chapters = safeArray(out.chapters)
        .map((x) => ({ t: String(x?.t || "").trim(), label: String(x?.label || "").trim() }))
        .filter((x) => x.t && x.label);

    return out;
}

export default function AdminVideosPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [mode, setMode] = useState("list"); // list | edit
    const [video, setVideo] = useState({ ...emptyVideo });

    const [rawTranscript, setRawTranscript] = useState("");
    const [autoBuildTranscriptHtml, setAutoBuildTranscriptHtml] = useState(true);
    const [autoBuildChapters, setAutoBuildChapters] = useState(true);

    const [q, setQ] = useState("");

    const keywordsText = useMemo(() => arrayToCsv(video.keywords), [video.keywords]);
    const tagsText = useMemo(() => arrayToCsv(video.tags), [video.tags]);

    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return items;
        return items.filter((x) => {
            const hay = `${x?.title || ""} ${x?.slug || ""} ${safeArray(x?.tags).join(" ")} ${safeArray(x?.keywords).join(" ")}`.toLowerCase();
            return hay.includes(s);
        });
    }, [items, q]);

    // live preview transcriptHtml:
    const previewTranscriptHtml = useMemo(() => {
        if (!autoBuildTranscriptHtml) return video.transcriptHtml || "";
        if (!rawTranscript.trim()) return video.transcriptHtml || "";
        return buildTranscriptHtmlFromRaw(rawTranscript);
    }, [autoBuildTranscriptHtml, rawTranscript, video.transcriptHtml]);

    // live preview chapters:
    const previewChapters = useMemo(() => {
        if (!autoBuildChapters) return safeArray(video.chapters);
        if (!rawTranscript.trim()) return safeArray(video.chapters);
        const gen = buildChaptersFromRawTranscript(rawTranscript);
        return gen.length ? gen : safeArray(video.chapters);
    }, [autoBuildChapters, rawTranscript, video.chapters]);

    async function loadAll() {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/videos", { cache: "no-store" });
            const json = await res.json();
            setItems(Array.isArray(json?.items) ? json.items : []);
        } catch (e) {
            console.error(e);
            setItems([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAll();
    }, []);

    function newVideo() {
        setMode("edit");
        setVideo({ ...emptyVideo });
        setRawTranscript("");
    }

    function editVideo(v) {
        setMode("edit");
        setVideo({
            ...emptyVideo,
            ...v,
            tags: safeArray(v?.tags),
            keywords: safeArray(v?.keywords),
            chapters: safeArray(v?.chapters),
            faqs: safeArray(v?.faqs),
        });
        // best-effort reverse: transcriptHtml -> raw is not reliable, so keep blank
        setRawTranscript("");
    }

    function backToList() {
        setMode("list");
        setVideo({ ...emptyVideo });
        setRawTranscript("");
    }

    function updateField(key, value) {
        setVideo((prev) => ({ ...prev, [key]: value }));
    }

    function addChapter() {
        setVideo((prev) => ({
            ...prev,
            chapters: [...safeArray(prev.chapters), { t: "00:00", label: "หัวข้อ" }],
        }));
    }

    function updateChapter(i, key, value) {
        setVideo((prev) => {
            const next = [...safeArray(prev.chapters)];
            next[i] = { ...next[i], [key]: value };
            return { ...prev, chapters: next };
        });
    }

    function removeChapter(i) {
        setVideo((prev) => {
            const next = [...safeArray(prev.chapters)];
            next.splice(i, 1);
            return { ...prev, chapters: next };
        });
    }

    function addFaq() {
        setVideo((prev) => ({
            ...prev,
            faqs: [...safeArray(prev.faqs), { q: "", a: "" }],
        }));
    }

    function updateFaq(i, key, value) {
        setVideo((prev) => {
            const next = [...safeArray(prev.faqs)];
            next[i] = { ...next[i], [key]: value };
            return { ...prev, faqs: next };
        });
    }

    function removeFaq(i) {
        setVideo((prev) => {
            const next = [...safeArray(prev.faqs)];
            next.splice(i, 1);
            return { ...prev, faqs: next };
        });
    }

    function applyGeneratedTranscriptAndChapters() {
        // apply live-generated results into video state
        startTransition(() => {
            setVideo((prev) => {
                const next = { ...prev };
                if (autoBuildTranscriptHtml && rawTranscript.trim()) {
                    next.transcriptHtml = buildTranscriptHtmlFromRaw(rawTranscript);
                }
                if (autoBuildChapters && rawTranscript.trim()) {
                    const gen = buildChaptersFromRawTranscript(rawTranscript);
                    if (gen.length) next.chapters = gen;
                }
                return next;
            });
        });
    }

    async function save() {
        // Auto apply before saving so JSON contains transcriptHtml + chapters
        applyGeneratedTranscriptAndChapters();

        const payload = cleanVideoForSave({
            ...video,
            transcriptHtml: autoBuildTranscriptHtml && rawTranscript.trim() ? buildTranscriptHtmlFromRaw(rawTranscript) : video.transcriptHtml,
            chapters: autoBuildChapters && rawTranscript.trim() ? buildChaptersFromRawTranscript(rawTranscript) : video.chapters,
        });

        if (!payload.slug || !payload.title) {
            alert("กรุณากรอก Title และ Slug (หรืออย่างน้อย Title เพื่อให้ระบบสร้าง slug)");
            return;
        }

        const exists = items.some((x) => x.slug === payload.slug);

        try {
            const res = await fetch(exists ? `/api/admin/videos/${encodeURIComponent(payload.slug)}` : "/api/admin/videos", {
                method: exists ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ video: payload }),
            });

            const json = await res.json();
            if (!res.ok) {
                alert(json?.error || "บันทึกไม่สำเร็จ");
                return;
            }

            await loadAll();
            alert("บันทึกเรียบร้อย");
            backToList();
        } catch (e) {
            console.error(e);
            alert("บันทึกไม่สำเร็จ (network/server error)");
        }
    }

    async function del(slug) {
        if (!confirm(`ลบวิดีโอ: ${slug} ?`)) return;

        try {
            const res = await fetch(`/api/admin/videos/${encodeURIComponent(slug)}`, {
                method: "DELETE",
            });
            const json = await res.json();
            if (!res.ok) {
                alert(json?.error || "ลบไม่สำเร็จ");
                return;
            }
            await loadAll();
            alert("ลบเรียบร้อย");
        } catch (e) {
            console.error(e);
            alert("ลบไม่สำเร็จ (network/server error)");
        }
    }

    return (
        <div className="container-fluid py-4" style={{ maxWidth: 1100 }}>
            <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
                <div>
                    <h1 className="h4 mb-1">Admin • Videos</h1>
                    <div className="text-secondary small">Transcript Preview + Auto Chapters (Schema Clip/hasPart)</div>
                </div>

                <div className="d-flex gap-2">
                    {mode === "list" ? (
                        <>
                            <button className="btn btn-primary" onClick={newVideo}>
                                + เพิ่มวิดีโอ
                            </button>
                            <button className="btn btn-outline-secondary" onClick={loadAll} disabled={loading}>
                                รีเฟรช
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="btn btn-outline-secondary" onClick={backToList}>
                                ← กลับ
                            </button>
                            <button className="btn btn-success" onClick={save}>
                                บันทึก
                            </button>
                        </>
                    )}
                </div>
            </div>

            <hr />

            {mode === "list" && (
                <>
                    <div className="row g-2 mb-3">
                        <div className="col-md-6">
                            <input
                                className="form-control"
                                placeholder="ค้นหา (title / slug / tags / keywords)"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6 d-flex align-items-center justify-content-md-end">
                            <div className="text-secondary small">
                                ทั้งหมด: <strong>{items.length}</strong> รายการ • แสดง: <strong>{filtered.length}</strong> รายการ
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="alert alert-info">กำลังโหลดข้อมูล…</div>
                    ) : filtered.length === 0 ? (
                        <div className="alert alert-warning">ยังไม่มีข้อมูลวิดีโอ</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped align-middle">
                                <thead>
                                    <tr>
                                        <th style={{ width: 160 }}>วันที่</th>
                                        <th>ชื่อ</th>
                                        <th style={{ width: 260 }}>Slug</th>
                                        <th style={{ width: 180 }} className="text-end">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered
                                        .slice()
                                        .sort((a, b) => String(b?.date || "").localeCompare(String(a?.date || "")))
                                        .map((v) => (
                                            <tr key={v.slug}>
                                                <td>{v.date || "-"}</td>
                                                <td>
                                                    <div className="fw-semibold">{v.title || "-"}</div>
                                                    <div className="text-secondary small text-truncate" style={{ maxWidth: 520 }}>
                                                        {v.excerpt || ""}
                                                    </div>
                                                </td>
                                                <td className="text-truncate">{v.slug}</td>
                                                <td className="text-end">
                                                    <div className="btn-group">
                                                        <button className="btn btn-sm btn-outline-primary" onClick={() => editVideo(v)}>
                                                            แก้ไข
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => del(v.slug)}>
                                                            ลบ
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {mode === "edit" && (
                <div className="row g-3">
                    <div className="col-lg-7">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h2 className="h5 mb-3">ข้อมูลวิดีโอ</h2>

                                <div className="row g-2">
                                    <div className="col-md-8">
                                        <label className="form-label">Title</label>
                                        <input
                                            className="form-control"
                                            value={video.title}
                                            onChange={(e) => updateField("title", e.target.value)}
                                            placeholder="ชื่อวิดีโอ"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">วันที่</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={video.date}
                                            onChange={(e) => updateField("date", e.target.value)}
                                        />
                                    </div>

                                    <div className="col-md-8">
                                        <label className="form-label">Slug</label>
                                        <div className="input-group">
                                            <input
                                                className="form-control"
                                                value={video.slug}
                                                onChange={(e) => updateField("slug", e.target.value)}
                                                placeholder="เช่น วิธีทำ-landing-page"
                                            />
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                onClick={() => updateField("slug", slugifyTH(video.slug || video.title))}
                                            >
                                                สร้างจาก Title
                                            </button>
                                        </div>
                                        <div className="form-text">Slug จะถูก normalize ตอนบันทึก (ตัดอักขระพิเศษ/เว้นวรรคเป็น -)</div>
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label">Author</label>
                                        <input
                                            className="form-control"
                                            value={video.author}
                                            onChange={(e) => updateField("author", e.target.value)}
                                            placeholder="ทีมวิดีโอ"
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label">Excerpt (คำอธิบายสั้น)</label>
                                        <textarea
                                            className="form-control"
                                            rows={2}
                                            value={video.excerpt}
                                            onChange={(e) => updateField("excerpt", e.target.value)}
                                            placeholder="สรุปสั้น ๆ สำหรับ SEO"
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">YouTube URL หรือ ID</label>
                                        <input
                                            className="form-control"
                                            value={video.youtube}
                                            onChange={(e) => updateField("youtube", e.target.value)}
                                            placeholder="https://www.youtube.com/watch?v=xxxxxxxxxxx หรือ xxxxxxxxxxx"
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Thumbnail URL</label>
                                        <input
                                            className="form-control"
                                            value={video.thumbnail}
                                            onChange={(e) => updateField("thumbnail", e.target.value)}
                                            placeholder="https://.../thumb.webp"
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label">Duration (ISO 8601)</label>
                                        <input
                                            className="form-control"
                                            value={video.duration}
                                            onChange={(e) => updateField("duration", e.target.value)}
                                            placeholder="PT5M30S"
                                        />
                                        <div className="form-text">ตัวอย่าง: PT5M30S, PT1H2M</div>
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label">UploadDate (ISO)</label>
                                        <input
                                            className="form-control"
                                            value={video.uploadDate}
                                            onChange={(e) => updateField("uploadDate", e.target.value)}
                                            placeholder="2025-12-21T08:00:00+07:00"
                                        />
                                        <div className="form-text">ถ้าว่าง ระบบหน้าเว็บสามารถ fallback จาก date ได้</div>
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label">contentUrl (ไฟล์วิดีโอจริง)</label>
                                        <input
                                            className="form-control"
                                            value={video.contentUrl}
                                            onChange={(e) => updateField("contentUrl", e.target.value)}
                                            placeholder="https://cdn.../video.mp4 (ถ้ามี)"
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label">Tags (คั่นด้วย ,)</label>
                                        <input
                                            className="form-control"
                                            value={tagsText}
                                            onChange={(e) => updateField("tags", csvToArray(e.target.value))}
                                            placeholder="เช่น ยิงแอด, google ads, facebook ads"
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label">Keywords (คั่นด้วย ,)</label>
                                        <textarea
                                            className="form-control"
                                            rows={2}
                                            value={keywordsText}
                                            onChange={(e) => updateField("keywords", csvToArray(e.target.value))}
                                            placeholder="คีย์เวิร์ด SEO สำหรับ VideoObject keywords"
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label">contentHtml (บทความ/รายละเอียดใต้คลิป)</label>
                                        <textarea
                                            className="form-control"
                                            rows={6}
                                            value={video.contentHtml}
                                            onChange={(e) => updateField("contentHtml", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <hr className="my-4" />

                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                    <h3 className="h5 mb-0">Transcript (Real-time Preview)</h3>
                                    <div className="d-flex gap-2 flex-wrap">
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={autoBuildTranscriptHtml}
                                                onChange={(e) => setAutoBuildTranscriptHtml(e.target.checked)}
                                                id="autoTranscriptHtml"
                                            />
                                            <label className="form-check-label" htmlFor="autoTranscriptHtml">
                                                Auto build transcriptHtml
                                            </label>
                                        </div>

                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={autoBuildChapters}
                                                onChange={(e) => setAutoBuildChapters(e.target.checked)}
                                                id="autoChapters"
                                            />
                                            <label className="form-check-label" htmlFor="autoChapters">
                                                Auto chapters from timecodes
                                            </label>
                                        </div>

                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            type="button"
                                            onClick={() => {
                                                const html = buildTranscriptHtmlFromRaw(rawTranscript);
                                                setVideo((prev) => ({ ...prev, transcriptHtml: html }));
                                                alert("สร้าง transcriptHtml ใส่ช่อง transcriptHtml แล้ว");
                                            }}
                                        >
                                            Generate transcriptHtml
                                        </button>

                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            type="button"
                                            onClick={() => {
                                                const ch = buildChaptersFromRawTranscript(rawTranscript);
                                                setVideo((prev) => ({ ...prev, chapters: ch }));
                                                alert(`สร้าง Chapters แล้ว (${ch.length} รายการ)`);
                                            }}
                                        >
                                            Generate chapters
                                        </button>
                                    </div>
                                </div>

                                <div className="row g-2 mt-2">
                                    <div className="col-12">
                                        <label className="form-label">
                                            Raw Transcript (แนะนำให้ใส่ timecode เช่น <code>00:00</code>)
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows={8}
                                            value={rawTranscript}
                                            onChange={(e) => setRawTranscript(e.target.value)}
                                            placeholder={`ตัวอย่าง:
00:00 เปิดคลิปและแนะนำหัวข้อ
00:15 ทำไมต้องใช้ Landing Page
01:10 สรุปและปิดท้าย`}
                                        />
                                        <div className="form-text">
                                            ระบบจะใช้ Raw นี้ทำ Preview และใช้สร้าง transcriptHtml/chapters สำหรับ Schema Clip (hasPart)
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label">transcriptHtml (เก็บลงไฟล์จริง)</label>
                                        <textarea
                                            className="form-control"
                                            rows={6}
                                            value={video.transcriptHtml}
                                            onChange={(e) => updateField("transcriptHtml", e.target.value)}
                                            placeholder="<div class='transcript'>...</div>"
                                        />
                                        <div className="form-text">
                                            ถ้าเปิด Auto build transcriptHtml ตอนบันทึก ระบบจะ override ด้วยค่าที่ generate จาก Raw Transcript
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-4" />

                                <h3 className="h5 mb-2">Chapters (สำหรับ Schema hasPart / Clip)</h3>
                                <div className="d-flex gap-2 mb-2 flex-wrap">
                                    <button className="btn btn-outline-secondary btn-sm" type="button" onClick={addChapter}>
                                        + เพิ่ม Chapter
                                    </button>
                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        type="button"
                                        onClick={() => {
                                            // sync previewChapters into video state
                                            setVideo((prev) => ({ ...prev, chapters: previewChapters }));
                                            alert("Sync preview chapters -> chapters แล้ว");
                                        }}
                                    >
                                        Sync preview chapters
                                    </button>
                                </div>

                                {safeArray(video.chapters).length === 0 ? (
                                    <div className="alert alert-warning mb-0">ยังไม่มี Chapters (แนะนำให้ generate จาก timecode)</div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-sm align-middle">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: 130 }}>Timecode</th>
                                                    <th>Label</th>
                                                    <th style={{ width: 110 }} className="text-end">
                                                        ลบ
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {safeArray(video.chapters).map((c, i) => (
                                                    <tr key={`${c.t}-${i}`}>
                                                        <td>
                                                            <input
                                                                className="form-control form-control-sm"
                                                                value={c.t || ""}
                                                                onChange={(e) => updateChapter(i, "t", e.target.value)}
                                                                placeholder="00:00"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control form-control-sm"
                                                                value={c.label || ""}
                                                                onChange={(e) => updateChapter(i, "label", e.target.value)}
                                                                placeholder="หัวข้อ"
                                                            />
                                                        </td>
                                                        <td className="text-end">
                                                            <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => removeChapter(i)}>
                                                                ลบ
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                <hr className="my-4" />

                                <h3 className="h5 mb-2">FAQ (optional)</h3>
                                <button className="btn btn-outline-secondary btn-sm mb-2" type="button" onClick={addFaq}>
                                    + เพิ่ม FAQ
                                </button>

                                {safeArray(video.faqs).length === 0 ? (
                                    <div className="alert alert-light mb-0">ยังไม่มี FAQ</div>
                                ) : (
                                    <div className="d-flex flex-column gap-2">
                                        {safeArray(video.faqs).map((f, i) => (
                                            <div className="border rounded p-2" key={i}>
                                                <div className="row g-2">
                                                    <div className="col-12">
                                                        <label className="form-label small mb-1">Q</label>
                                                        <input
                                                            className="form-control"
                                                            value={f.q || ""}
                                                            onChange={(e) => updateFaq(i, "q", e.target.value)}
                                                            placeholder="คำถาม"
                                                        />
                                                    </div>
                                                    <div className="col-12">
                                                        <label className="form-label small mb-1">A</label>
                                                        <textarea
                                                            className="form-control"
                                                            rows={3}
                                                            value={f.a || ""}
                                                            onChange={(e) => updateFaq(i, "a", e.target.value)}
                                                            placeholder="คำตอบ"
                                                        />
                                                    </div>
                                                    <div className="col-12 text-end">
                                                        <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => removeFaq(i)}>
                                                            ลบ FAQ
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="d-flex gap-2 mt-4">
                                    <button className="btn btn-success" onClick={save}>
                                        บันทึก
                                    </button>
                                    <button className="btn btn-outline-secondary" onClick={backToList}>
                                        ยกเลิก
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preview column */}
                    <div className="col-lg-5">
                        <div className="card shadow-sm mb-3">
                            <div className="card-body">
                                <h3 className="h5 mb-2">Preview: Transcript</h3>

                                <div className="alert alert-light mb-2">
                                    <div className="small text-secondary mb-1">โหมด Preview:</div>
                                    <div className="small">
                                        {autoBuildTranscriptHtml ? (
                                            <>
                                                ใช้ <strong>Raw Transcript</strong> → generate transcriptHtml แบบ real-time
                                            </>
                                        ) : (
                                            <>
                                                ใช้ <strong>transcriptHtml</strong> ที่เก็บอยู่ในฟอร์ม
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="border rounded p-2" style={{ minHeight: 180 }}>
                                    {previewTranscriptHtml ? (
                                        <div dangerouslySetInnerHTML={{ __html: previewTranscriptHtml }} />
                                    ) : (
                                        <div className="text-secondary">ยังไม่มี transcript</div>
                                    )}
                                </div>

                                <hr className="my-3" />

                                <h3 className="h6 mb-2">Preview: Chapters → Schema hasPart</h3>
                                <div className="border rounded p-2">
                                    {previewChapters.length ? (
                                        <ul className="mb-0">
                                            {previewChapters.map((c, i) => {
                                                const sec = timecodeToSeconds(c.t);
                                                return (
                                                    <li key={`${c.t}-${i}`}>
                                                        <span className="badge text-bg-secondary me-2">{c.t}</span>
                                                        {c.label}
                                                        {typeof sec === "number" ? (
                                                            <span className="text-secondary small ms-2">(startOffset: {sec}s)</span>
                                                        ) : null}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <div className="text-secondary">ยังไม่มี chapters</div>
                                    )}
                                </div>

                                <hr className="my-3" />

                                <h3 className="h6 mb-2">Tip: รูปแบบ Transcript ที่ดีที่สุด</h3>
                                <div className="small text-secondary">
                                    แนะนำให้มี timecode ทุกบรรทัดสำคัญ (00:00, 00:15, 01:10...) เพื่อให้ระบบสร้าง Chapters อัตโนมัติ
                                    และนำไปทำ <code>hasPart</code> (Clip) ได้ทันที
                                </div>
                            </div>
                        </div>

                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h3 className="h6 mb-2">Quick Actions</h3>
                                <div className="d-grid gap-2">
                                    <button
                                        className="btn btn-outline-dark"
                                        type="button"
                                        onClick={() => {
                                            // Fill slug from title instantly
                                            updateField("slug", slugifyTH(video.slug || video.title));
                                        }}
                                    >
                                        สร้าง/อัปเดต Slug จาก Title
                                    </button>

                                    <button
                                        className="btn btn-outline-dark"
                                        type="button"
                                        onClick={() => {
                                            // Save preview transcript to transcriptHtml without saving to server
                                            const html = previewTranscriptHtml || "";
                                            setVideo((prev) => ({ ...prev, transcriptHtml: html }));
                                            alert("คัดลอก Preview Transcript → transcriptHtml แล้ว");
                                        }}
                                    >
                                        คัดลอก Preview → transcriptHtml
                                    </button>

                                    <button
                                        className="btn btn-outline-dark"
                                        type="button"
                                        onClick={() => {
                                            setVideo((prev) => ({ ...prev, chapters: previewChapters }));
                                            alert("คัดลอก Preview Chapters → chapters แล้ว");
                                        }}
                                    >
                                        คัดลอก Preview → chapters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
