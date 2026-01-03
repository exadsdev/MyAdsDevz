import { NextResponse } from "next/server";
import { getAllVideos } from "@/lib/videosStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  const { slug } = params || {};
  if (!slug) return NextResponse.json({ ok:false, error:"Missing slug" }, { status:400 });

  const items = await getAllVideos();
  const idx = items.findIndex(v => (v.slug || "") === slug);
  if (idx === -1) return NextResponse.json({ ok:false, error:"Not found" }, { status:404 });

  // เตรียม prev/next ตามวันที่ (เรียงล่าสุดก่อนใน getAllVideos อยู่แล้ว)
  const item = items[idx];
  const prev = items[idx - 1] || null;
  const next = items[idx + 1] || null;

  return NextResponse.json({ ok:true, item, prev, next });
}
