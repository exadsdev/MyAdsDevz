import { NextResponse } from "next/server";
import { getReviewBySlug } from "@/lib/reviewsStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_req, { params }) {
  const { slug } = params || {};
  if (!slug) return NextResponse.json({ ok:false, error:"Missing slug" }, { status:400 });
  const item = await getReviewBySlug(slug);
  if (!item) return NextResponse.json({ ok:false, error:"Not found" }, { status:404 });
  return NextResponse.json({ ok:true, item });
}
