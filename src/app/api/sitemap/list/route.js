import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;

/** คืนค่ารายการหน้า “ทั่วไป” ที่อยากให้ index (ไม่รวมวิดีโอ)
 *  รูปแบบยืดหยุ่น: string หรือ object {loc,lastmod,changefreq,priority}
 *  ถ้าคุณมี DB จริง ให้ query แล้ว shape ให้ตรงนี้
 */
export async function GET() {
  const now = new Date().toISOString();
  const pages = [
    { loc: "/services", lastmod: now, changefreq: "weekly", priority: 0.8 },
    { loc: "/portfolio", lastmod: now, changefreq: "weekly", priority: 0.8 },
    { loc: "/blog", lastmod: now, changefreq: "daily",  priority: 0.7 },
    // อย่าลืมใส่หน้า content สำคัญอื่น ๆ
  ];

  return NextResponse.json(
    { items: pages, page: 1, hasMore: false },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=3600" } }
  );
}
