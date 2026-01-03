"use client";

/* ---------- config ---------- */
const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_ORIGIN ||
  "";
const BASE_PUBLIC_URL = SITE_ORIGIN
  ? SITE_ORIGIN.replace(/\/+$/, "") + "/public"
  : "";

/* ---------- helpers ---------- */
function formatShortThai(dateStr = "") {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  if (!y || !m || !d) return dateStr;
  const yy = String(y).slice(-2);
  return `${d}/${m}/${yy}`;
}

function resolveImg(src) {
  if (!src) return PLACEHOLDER;
  const s = String(src).trim();

  // ถ้าเป็น URL เต็มแล้ว
  if (/^https?:\/\//i.test(s)) return s;

  // ถ้าเริ่มด้วย / ให้ถือว่าเป็น path ใต้ /public
  if (BASE_PUBLIC_URL) {
    if (s.startsWith("/")) {
      return BASE_PUBLIC_URL + s;
    }
    return BASE_PUBLIC_URL + "/" + s.replace(/^\/+/, "");
  }

  // fallback กรณีไม่ได้ตั้งค่า SITE_ORIGIN
  return s;
}

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 630'>
      <rect width='1200' height='630' fill='#f0f2f5'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
            font-family='Arial, sans-serif' font-size='36' fill='#99a1aa'>
        ไม่มีรูปภาพ
      </text>
    </svg>`
  );

export default function ReviewDetailClient({ review, internalLinks = [] }) {
  if (!review || typeof review !== "object") {
    return (
      <main className="container-fluid py-5 text-center">
        <p className="text-muted">ไม่พบรีวิว</p>
        <a
          href="/reviews"
          className="btn btn-outline-primary mt-3"
        >
          ← กลับไปหน้ารีวิว
        </a>
      </main>
    );
  }

  const r = review;

  return (
    <main className="container-fluid py-4">
      <nav className="mb-3">
        <a
          href="/reviews"
          className="text-decoration-none"
        >
          ← กลับไปหน้ารีวิวทั้งหมด
        </a>
      </nav>

      <article className="row g-4">
        <div className="col-12 col-lg-8">
          <h1 className="h3 mb-2">
            {r?.title || "ไม่มีชื่อรีวิว"}
          </h1>
          <div className="text-muted small mb-3">
            {formatShortThai(r?.date || "")} •{" "}
            {r?.author || "ทีมรีวิว"} •{" "}
            {String(r?.category || "").toUpperCase()}
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={r?.thumbnail ? resolveImg(r.thumbnail) : PLACEHOLDER}
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER;
            }}
            alt={r.title || "รีวิวลูกค้า"}
            className="img-fluid rounded mb-3"
            style={{ width: "100%", height: "auto" }}
            referrerPolicy="no-referrer"
          />

          {r?.excerpt && (
            <p className="text-muted">{r.excerpt}</p>
          )}

          {r?.contentHtml && (
            <div
              className="content"
              dangerouslySetInnerHTML={{
                __html: r.contentHtml,
              }}
            />
          )}

          <div className="mt-4">
            <h2 className="h6">ลิงก์ภายในที่เกี่ยวข้อง</h2>
            <ul className="list-inline m-0">
              {internalLinks.map((l, i) => (
                <li
                  className="list-inline-item mb-2"
                  key={i}
                >
                  <a
                    className="btn btn-light btn-sm"
                    href={l.href}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h2 className="h6">ข้อมูล</h2>
              <ul className="list-unstyled small m-0">
                <li>
                  <strong>หมวด:</strong>{" "}
                  {String(r.category || "").toUpperCase()}
                </li>
                <li>
                  <strong>วันที่:</strong>{" "}
                  {formatShortThai(r.date)}
                </li>
                {r.author && (
                  <li>
                    <strong>ผู้เขียน:</strong> {r.author}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
