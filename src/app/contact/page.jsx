// app/contact/page.jsx

import { SITE, BRAND } from "../seo.config";
import Link from "next/link";
import JsonLd from "../components/JsonLd";
import FAQ from "../components/FAQ";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE;
const PAGE_URL = `${SITE_URL}/contact`;
const OG_IMAGE = `${SITE_URL}/images/og-default.jpg`;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: `ติดต่อเรา | ${BRAND}`,
  description: `ติดต่อทีมงาน ${BRAND} เพื่อพูดคุยเป้าหมายธุรกิจ วางแผนโฆษณาออนไลน์ (Google Ads และ Facebook/Meta Ads) และแนวทางการวัดผล`,
  alternates: { canonical: PAGE_URL },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: BRAND,
    title: `ติดต่อเรา | ${BRAND}`,
    description: `ติดต่อทีมงาน ${BRAND} เพื่อเริ่มต้นวางแผนการตลาดและโฆษณาออนไลน์`,
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
    locale: "th_TH",
  },
};

export default function ContactPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "หน้าแรก", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "ติดต่อเรา", item: PAGE_URL },
    ],
  };

  const contactPageLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": PAGE_URL,
    name: `ติดต่อเรา | ${BRAND}`,
    url: PAGE_URL,
    mainEntity: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: BRAND,
      legalName: "GOWNUM KOSANA LIMITED PARTNERSHIP",
      email: "contact@myad-dev.com",
      url: SITE_URL,
      address: {
        "@type": "PostalAddress",
        streetAddress: "130 Ratsadon Uthit Road",
        addressLocality: "Mueang Rayong District",
        addressRegion: "Rayong",
        postalCode: "21000",
        addressCountry: "TH",
      },
    },
  };

  const faqItems = [
    {
      q: "ควรเตรียมข้อมูลอะไรบ้างก่อนติดต่อ?",
      a: "แนะนำให้เตรียมลิงก์เว็บไซต์/เพจ ประเภทสินค้า/บริการ กลุ่มลูกค้าเป้าหมาย งบประมาณ และเป้าหมายที่ต้องการวัดผล",
    },
    {
      q: "ใช้เวลาตอบกลับนานแค่ไหน?",
      a: "โดยทั่วไปทีมงานจะตอบกลับภายในวันทำการเดียวกัน",
    },
  ];

  return (
    <>
      <JsonLd json={breadcrumbLd} />
      <JsonLd json={contactPageLd} />

      <div className="container py-5">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">หน้าแรก</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              ติดต่อเรา
            </li>
          </ol>
        </nav>

        <article className="bg-white p-4 p-md-5 shadow-sm rounded">
          <h1 className="mb-4 fw-bold text-primary">ติดต่อเรา</h1>

          <div className="mb-4">
            <h2 className="h5 mb-3">ข้อมูลบริษัท</h2>
            <ul className="list-unstyled">
              <li><strong>ชื่อธุรกิจ (TH):</strong> ห้างหุ้นส่วนจำกัด ก้าวนำ โฆษณา</li>
              <li><strong>Legal name (EN):</strong> GOWNUM KOSANA LIMITED PARTNERSHIP</li>
              <li><strong>เลขทะเบียน:</strong> 0213548002976</li>
              <li><strong>ที่อยู่:</strong> 130 ถนนราษฎร์อุทิศ ตำบลเชิงเนิน อำเภอเมืองระยอง จ.ระยอง 21000</li>
            </ul>
          </div>

         {/* === Google Map === */}
<div className="mb-4">
  <h2 className="h5 mb-3">แผนที่บริษัท</h2>

  <div
    className="ratio ratio-16x9 rounded overflow-hidden border"
    style={{ maxHeight: "280px" }}
  >
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3892.403517962247!2d101.26471893488771!3d12.687065099999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3102fbea1662717b%3A0x884c384cdd471acf!2z4Lir4LmJ4Liy4LiH4Lir4Li44LmJ4LiZ4Liq4LmI4Lin4LiZ4LiI4Liz4LiB4Lix4LiUIOC4geC5ieC4suC4p-C4meC4s-C5guC4huC4qeC4k-C4sg!5e0!3m2!1sth!2sth!4v1767056376164!5m2!1sth!2sth"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      style={{ border: 0 }}
      aria-label="แผนที่ ห้างหุ้นส่วนจำกัด ก้าวนำ โฆษณา"
    />
  </div>

  <p className="small text-muted mt-2">
    <a
      href="https://maps.app.goo.gl/E3PrCnVSWAdCkvvs8"
      target="_blank"
      rel="noopener noreferrer"
    >
      เปิดดูแผนที่บน Google Maps
    </a>
  </p>
</div>

          <div className="mb-4">
            <h2 className="h5 mb-3">ช่องทางติดต่อ</h2>
            <ul className="list-unstyled">
              <li><strong>อีเมล:</strong> contact@myad-dev.com</li>
              <li><strong>เว็บไซต์:</strong> {SITE_URL}</li>
            </ul>
          </div>

          <div className="d-flex gap-3 flex-wrap">
            <a
              href="https://lin.ee/vjeDuCZ"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success btn-lg"
            >
              ติดต่อผ่าน LINE
            </a>
            <Link href="/" className="btn btn-outline-primary btn-lg">
              กลับหน้าแรก
            </Link>
          </div>

          <FAQ items={faqItems} />
        </article>
      </div>
    </>
  );
}
