import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import FAQ from "@/app/components/FAQ";
import { SITE, BRAND, LOGO_URL } from "@/app/seo.config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE;
const CANON = `${SITE_URL}/services/facebook-ads`;
const OG_IMAGE = `${SITE_URL}/images/og-default.jpg`;

export const dynamic = "force-static";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: `Facebook/Meta Ads: กลุ่มเป้าหมาย ครีเอทีฟ และการวัดผล | ${BRAND}`,
  description:
    "อธิบายการทำ Facebook/Meta Ads แบบเป็นระบบ: การกำหนดกลุ่มเป้าหมาย การทดสอบครีเอทีฟ การตั้งค่า Pixel/Conversion API และการอ่านผลลัพธ์",
  alternates: { canonical: CANON },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: `Facebook/Meta Ads: กลุ่มเป้าหมาย ครีเอทีฟ และการวัดผล | ${BRAND}`,
    description:
      "อธิบายการทำ Facebook/Meta Ads แบบเป็นระบบ: กลุ่มเป้าหมาย ครีเอทีฟ และการวัดผลเพื่อปรับปรุงประสิทธิภาพ",
    url: CANON,
    siteName: BRAND,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Facebook/Meta Ads" }],
    type: "website",
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    site: "@myadsdev",
    title: `Facebook/Meta Ads: กลุ่มเป้าหมาย ครีเอทีฟ และการวัดผล | ${BRAND}`,
    description: "อธิบายการทำ Facebook/Meta Ads แบบเป็นระบบ: กลุ่มเป้าหมาย ครีเอทีฟ และการวัดผล",
    images: [OG_IMAGE],
  },
  icons: { icon: "/favicon.ico" },
};

export default function FacebookPage() {
  const LOGO_FULL = LOGO_URL.startsWith("http") ? LOGO_URL : `${SITE_URL}${LOGO_URL}`;

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Facebook/Meta Ads",
    serviceType: "Facebook Ads Management",
    provider: {
      "@type": "Organization",
      name: BRAND,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: LOGO_FULL },
    },
    areaServed: "TH",
    url: CANON,
    description:
      "แนวทางการทำ Facebook/Meta Ads แบบเป็นระบบ: กลุ่มเป้าหมาย ครีเอทีฟ และการวัดผลเพื่อปรับปรุงประสิทธิภาพ",
    image: OG_IMAGE,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "หน้าแรก", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "บริการ", item: `${SITE_URL}/services` },
      { "@type": "ListItem", position: 3, name: "Facebook Ads", item: CANON },
    ],
  };

  const productLd = {
    "@context": "https://schema.org/",
    "@type": "Service",
    name: "Facebook/Meta Ads",
    description:
      "แนวทางการทำ Facebook/Meta Ads แบบเป็นระบบ: กลุ่มเป้าหมาย ครีเอทีฟ และการวัดผลเพื่อปรับปรุงประสิทธิภาพ",
    image: OG_IMAGE,
    provider: { "@type": "Organization", name: BRAND, url: SITE_URL },
    areaServed: "TH",
    url: CANON,
  };

  const faqItems = [
    {
      q: "ควรเริ่มจากแคมเปญแบบไหน?",
      a: "เริ่มจากเป้าหมายที่ชัดเจน (เช่น ยอดขาย/ลีด/ข้อความ) แล้วเลือก Objective ที่สอดคล้อง พร้อมกำหนดเหตุการณ์ Conversion ที่ต้องการวัดผล",
    },
    {
      q: "ทำไมค่าโฆษณาแกว่งและผลไม่คงที่?",
      a: "สาเหตุที่พบบ่อยคือกลุ่มเป้าหมายกว้างเกินไป จำนวนครีเอทีฟไม่พอสำหรับการทดสอบ หรือสัญญาณการวัดผลไม่ครบ (Pixel/CAPI) ทำให้ระบบเรียนรู้ไม่ต่อเนื่อง",
    },
    {
      q: "ต้องติดตั้ง Pixel หรือ Conversion API ไหม?",
      a: "แนะนำอย่างยิ่ง โดยเฉพาะถ้าต้องการวัดผลยอดขาย/ลีด เพื่อให้สัญญาณการวัดผลครบถ้วนและช่วยปรับประสิทธิภาพการส่งโฆษณา",
    },
  ];

  return (
    <>
      {/* JSON-LD สำหรับ SEO */}
      <JsonLd json={serviceLd} />
      <JsonLd json={breadcrumbLd} />
      <JsonLd json={productLd} />

      <div className="container-fluid py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/" className="text-decoration-none">หน้าแรก</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/services" className="text-decoration-none">บริการ</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">Facebook Ads</li>
          </ol>
        </nav>

        <div className="text-center mb-4">
          <h1 className="fw-bold">Facebook/Meta Ads: กลุ่มเป้าหมาย ครีเอทีฟ และการวัดผล</h1>
          <div className="hero__media mt-4">
            <Image
              src="/images/review-fb.jpg"
              width={1200}
              height={675}
              alt="รับทำโฆษณา Facebook/Meta Ads"
              className="img-fluid rounded shadow-sm mx-auto d-block"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
          </div>
        </div>

        <section className="mb-5">
          <h2 className="h4 text-primary">ภาพรวมการทำ Facebook/Meta Ads</h2>
          <p className="text-muted">
            หน้านี้สรุปแนวคิดสำคัญของการทำโฆษณาในเครือข่าย Meta (Facebook/Instagram) ตั้งแต่การกำหนดกลุ่มเป้าหมาย การทดสอบครีเอทีฟ ไปจนถึงการติดตั้งสัญญาณวัดผล (Pixel/CAPI)
            เพื่อให้การปรับปรุงแคมเปญอ้างอิงข้อมูลจริง
          </p>
        </section>

        <div className="mb-4">
          <Image
            src="/images/img22.jpg"
            width={1200}
            height={675}
            alt="ภาพประกอบการทำโฆษณา Facebook/Meta Ads"
            className="img-fluid rounded shadow-sm mx-auto d-block"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </div>

        <section className="mb-5">
          <h2 className="h4 text-primary">การกำหนดกลุ่มเป้าหมาย (Target Audience)</h2>
          <p>
            การกำหนดกลุ่มเป้าหมายที่ถูกต้องช่วยให้โฆษณาเข้าถึงผู้ใช้ที่เหมาะสม
          </p>
          <ul>
            <li>ใช้ข้อมูลจาก Facebook Audience Insights</li>
            <li>สร้าง Customer Personas</li>
            <li>ใช้ Custom Audiences และ Lookalike Audiences</li>
            <li>ทดสอบ A/B เพื่อหากลุ่มเป้าหมายที่ดีที่สุด</li>
          </ul>
        </section>

        <section className="mb-5">
          <h2 className="h4 text-primary">การจัดการค่าใช้จ่ายโฆษณา</h2>
          <ul>
            <li>สร้างโฆษณาที่น่าสนใจและสื่อสารชัดเจน</li>
            <li>เลือกวิธี Bid ที่เหมาะสม (CPC, CPM)</li>
            <li>ใช้ Automatic Bidding</li>
            <li>วิเคราะห์ CTR, CPC, และ ROI</li>
          </ul>
        </section>

        <div className="mb-4">
          <Image
            src="/images/facebook_ads.webp"
            width={1200}
            height={675}
            alt="ภาพประกอบการวัดผลโฆษณา Facebook/Meta Ads"
            className="img-fluid rounded shadow-sm mx-auto d-block"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </div>

        <section className="mb-5">
          <h2 className="h4 text-primary">การวัดผลลัพธ์</h2>
          <ul>
            <li>ติดตั้ง Facebook Pixel</li>
            <li>ตั้งค่า Conversion Tracking</li>
            <li>วิเคราะห์ Conversion Rate, CAC, LTV</li>
            <li>ออกแบบ Responsive สำหรับทุกอุปกรณ์</li>
          </ul>
        </section>

        <FAQ items={faqItems} />

        <div className="text-center mt-5">
          <Link href="/contact" className="btn btn-outline-primary btn-lg me-3">
            ติดต่อเพื่อขอคำแนะนำเบื้องต้น
          </Link>
          <Link href="/services" className="btn btn-outline-secondary btn-lg">
            ดูบริการทั้งหมด
          </Link>
        </div>
      </div>
    </>
  );
}
