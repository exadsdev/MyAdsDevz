import Link from "next/link";
import { getAllPosts } from "@/lib/postsStore";
import JsonLd from "@/app/components/JsonLd";
import FAQ from "@/app/components/FAQ";

export const revalidate = 0;
export const dynamic = "force-dynamic";

/* ---------- Data (อ่านจากไฟล์โดยตรง) ---------- */
async function getAll() {
  const items = await getAllPosts();
  const arr = Array.isArray(items) ? items : [];
  // เรียงใหม่→เก่า โดยอิงวันที่เป็นสตริง YYYY-MM-DD
  arr.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  return arr;
}

/* ---------- SEO Metadata ---------- */
export async function generateMetadata({ params }) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag || "");
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const title = `แท็ก #${tag} | บทความการตลาดออนไลน์`;
  const desc = `รวมบทความเทคนิค กลยุทธ์ และแนวทางการทำโฆษณาที่เกี่ยวข้องกับ #${tag}`;
  const url = `${origin}/blog/tag/${encodeURIComponent(tag)}`;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: desc,
      url,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description: desc,
    },
  };
}

/* ---------- Page ---------- */
export default async function TagPage({ params }) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag || "");
  const all = await getAll();
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = `${origin}/blog/tag/${encodeURIComponent(tag)}`;

  // เทียบแบบ case-insensitive และ trim ช่องว่าง
  const items = all.filter((a) =>
    (a.tags || []).some(
      (t) => String(t).trim().toLowerCase() === tag.trim().toLowerCase()
    )
  );

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "หน้าแรก", item: origin },
      { "@type": "ListItem", position: 2, name: "บล็อก", item: `${origin}/blog` },
      { "@type": "ListItem", position: 3, name: `#${tag}`, item: url },
    ],
  };

  const faqItems = [
    {
      q: `แท็ก #${tag} เกี่ยวข้องกับเนื้อหาอะไร?`,
      a: `บทความในกลุ่มนี้จะเน้นเรื่อง ${tag} เป็นหลัก โดยครอบคลุมทั้งเทคนิคการตั้งค่า กลยุทธ์การตลาด และแนวทางการวัดผลที่เกี่ยวข้อง`,
    },
    {
      q: "บทความมีการอัปเดตบ่อยแค่ไหน?",
      a: "เรามีการอัปเดตบทความใหม่ๆ เป็นประจำตามการเปลี่ยนแปลงของแพลตฟอร์มโฆษณาเพื่อให้เนื้อหามีความทันสมัยอยู่เสมอ",
    },
  ];

  return (
    <main className="container-fluid py-5">
      {/* JSON-LD */}
      <JsonLd data={breadcrumbLd} />

      {/* breadcrumbs */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/" className="text-decoration-none text-muted">หน้าแรก</Link></li>
          <li className="breadcrumb-item"><Link href="/blog" className="text-decoration-none text-muted">บล็อก</Link></li>
          <li className="breadcrumb-item active" aria-current="page">#{tag}</li>
        </ol>
      </nav>

      <header className="mb-5">
        <h1 className="fw-bold mb-2">บทความภายใต้แท็ก: #{tag}</h1>
        <p className="text-muted lead">
          พบ {items.length} บทความที่พร้อมให้ความรู้และแนวทางเกี่ยวกับ {tag}
        </p>
      </header>

      <div className="row">
        {items.map((a, idx) => (
          <div key={`${a.slug}-${idx}`} className="col-md-6 col-lg-4 mb-4">
            <article className="card shadow-sm h-100 border-0 overflow-hidden">
              {a.thumbnail && (
                <Link href={`/blog/${a.slug}`}>
                  <img
                    src={a.thumbnail}
                    className="card-img-top"
                    alt={a.title}
                    style={{ aspectRatio: "16 / 9", objectFit: "cover" }}
                    loading="lazy"
                  />
                </Link>
              )}

              <div className="card-body d-flex flex-column p-4">
                <h2 className="h5 fw-bold mb-3">
                  <Link
                    href={`/blog/${a.slug}`}
                    className="link-dark text-decoration-none"
                  >
                    {a.title}
                  </Link>
                </h2>

                <p className="text-muted small mb-3">
                  {a.date}{a.author ? ` • ${a.author}` : ""}
                </p>

                <p
                  className="card-text text-muted mb-4"
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    WebkitLineClamp: 3,
                    minHeight: "4.5em",
                  }}
                  title={a.excerpt || ""}
                >
                  {a.excerpt || ""}
                </p>

                <div className="mt-auto">
                  <Link href={`/blog/${a.slug}`} className="btn btn-outline-primary w-100">
                    อ่านต่อเพิ่มเติม
                  </Link>
                </div>
              </div>
            </article>
          </div>
        ))}

        {items.length === 0 && (
          <div className="col-12 text-center py-5 bg-light rounded">
            ยังไม่มีบทความในแท็กนี้ในระบบ
          </div>
        )}
      </div>

      <div className="mt-5 pt-4">
        <FAQ items={faqItems} />
      </div>
    </main>
  );
}

