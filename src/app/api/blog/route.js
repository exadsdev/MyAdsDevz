// /src/app/api/blog/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { listArticles, createArticle } from "../../../lib/blogStore";
import { slugify, toArray, todayStr } from "../../../lib/text";

export async function GET() {
  const items = await listArticles();
  return NextResponse.json({ ok: true, items });
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const title = String(body.title || "").trim();
    if (!title) return NextResponse.json({ error: "title_required" }, { status: 400 });

    const slug = (body.slug ? slugify(body.slug) : slugify(title)) || "";
    if (!slug) return NextResponse.json({ error: "invalid_slug" }, { status: 400 });

    const item = {
      slug,
      title,
      date: String(body.date || todayStr()),
      excerpt: String(body.excerpt || ""),
      image: String(body.image || ""),
      tags: toArray(body.tags),
      keywords: toArray(body.keywords),
      author: String(body.author || "ทีมคอนเทนต์"),
      readingMinutes: Number(body.readingMinutes ?? 5),
      contentHtml: String(body.contentHtml || "<h2>หัวข้อย่อย</h2><p>เนื้อหาบทความ…</p>"),
    };

    const saved = await createArticle(item);
    return NextResponse.json({ ok: true, item: saved });
  } catch (e) {
    return NextResponse.json({ error: e.message || "error" }, { status: 400 });
  }
}
