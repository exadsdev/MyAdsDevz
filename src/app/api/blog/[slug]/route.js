// src/app/api/blog/[slug]/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getBlog, updateBlog, removeBlog } from "@/lib/blogStore";
import { slugify } from "@/lib/slugify";
import { isAdmin } from "@/lib/auth";

/* ---------- utils ---------- */
function parseTokens(raw) {
  return String(raw || "")
    .split(/[\n\r,;|、]+|\s{2,}/g)
    .map((s) => s.trim())
    .filter(Boolean);
}
function uniq(arr) {
  const seen = new Set();
  const out = [];
  for (const v of arr) {
    const k = String(v).toLowerCase();
    if (!seen.has(k)) { seen.add(k); out.push(String(v)); }
  }
  return out;
}
function toArray(x) {
  if (Array.isArray(x)) return uniq(x.map((s) => String(s).trim()).filter(Boolean));
  return uniq(parseTokens(x));
}

/* ---------- handlers ---------- */
export async function GET(request, { params }) {
  // ✅ ต้อง await params ก่อนใช้ (Next.js 15 Webpack)
  const awaited = await params;
  const slug = Array.isArray(awaited?.slug) ? awaited.slug[0] : awaited?.slug;
  if (!slug) return NextResponse.json({ error: "missing_slug" }, { status: 400 });

  const item = await getBlog(slug);
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });

  if (item.status === "draft" && !isAdmin(request)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json(item, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(request, { params }) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const awaited = await params;
  const slug = Array.isArray(awaited?.slug) ? awaited.slug[0] : awaited?.slug;
  if (!slug) return NextResponse.json({ error: "missing_slug" }, { status: 400 });

  const patch = await request.json().catch(() => ({}));

  if (patch.slug) patch.slug = slugify(patch.slug);
  if (patch.tags !== undefined) patch.tags = toArray(patch.tags);
  if (patch.keywords !== undefined) patch.keywords = toArray(patch.keywords);
  if (patch.readingMinutes != null) patch.readingMinutes = Number(patch.readingMinutes);

  try {
    const item = await updateBlog(slug, patch);
    return NextResponse.json(item);
  } catch (e) {
    return NextResponse.json({ error: e?.message || "error" }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const awaited = await params;
  const slug = Array.isArray(awaited?.slug) ? awaited.slug[0] : awaited?.slug;
  if (!slug) return NextResponse.json({ error: "missing_slug" }, { status: 400 });

  try {
    await removeBlog(slug);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e?.message || "error" }, { status: 400 });
  }
}
