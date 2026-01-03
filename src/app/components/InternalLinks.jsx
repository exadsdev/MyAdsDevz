import Link from "next/link";

export default function InternalLinks() {
  return (
    <section className="card shadow-sm mt-4">
      <div className="card-body">
        <h3 className="h5 fw-bold mb-3">ลิงก์ภายในที่เกี่ยวข้อง</h3>
        <div className="row g-2">
          <div className="col-6 col-md-3">
            <ul className="list-unstyled mb-0">
              <li><Link href="/" className="link-primary">หน้าแรก</Link></li>
              <li><Link href="/services" className="link-primary">บริการของเรา</Link></li>
              <li><Link href="/about" className="link-primary">เกี่ยวกับเรา</Link></li>
              <li><Link href="/contact" className="link-primary">ติดต่อเรา</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <ul className="list-unstyled mb-0">
              <li><Link href="/blog" className="link-primary">บล็อก</Link></li>
              <li><Link href="/blog/tag/seo" className="link-primary">#seo</Link></li>
              <li><Link href="/blog/tag/google-ads" className="link-primary">#google-ads</Link></li>
              <li><Link href="/blog/tag/analytics" className="link-primary">#analytics</Link></li>
            </ul>
          </div>
          <div className="col-12 col-md-6">
            <div className="small text-muted">
              เคล็ดลับ: อ่านบทความในบล็อก และต่อด้วยหน้า <Link href="/services" className="link-primary">บริการ SEO</Link> 
              เพื่อดูแนวทางที่นำไปใช้ได้จริง พร้อมตัวอย่างงาน <Link href="/faq" className="link-primary">FAQ</Link> 
              และ <Link href="/contact" className="link-primary">ขอใบเสนอราคา</Link>.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
