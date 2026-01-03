import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import FAQ from "@/app/components/FAQ";
import { SITE, BRAND, LOGO_URL } from "@/app/seo.config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE;
const CANON = `${SITE_URL}/services/google-ads`;
const OG_IMAGE = `${SITE_URL}/images/og-default.jpg`;

export const dynamic = "force-static";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: `โฆษณา Google Ads: โครงสร้าง การวัดผล และแนวทางปรับปรุง | ${BRAND}`,
  description:
    "อธิบาย Google Ads แบบเป็นระบบ: โครงสร้างแคมเปญ การตั้งค่า Conversion การเลือกคีย์เวิร์ด การอ่านรายงาน และแนวทางปรับปรุงประสิทธิภาพ",
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
    type: "website",
    url: CANON,
    siteName: BRAND,
    title: `โฆษณา Google Ads: โครงสร้าง การวัดผล และแนวทางปรับปรุง | ${BRAND}`,
    description:
      "อธิบาย Google Ads แบบเป็นระบบ: โครงสร้างแคมเปญ การตั้งค่า Conversion การอ่านรายงาน และแนวทางปรับปรุงประสิทธิภาพ",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${BRAND} - Google Ads`,
      },
    ],
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    site: "@myadsdev",
    title: `โฆษณา Google Ads: โครงสร้าง การวัดผล และแนวทางปรับปรุง | ${BRAND}`,
    description:
      "อธิบาย Google Ads แบบเป็นระบบ: โครงสร้างแคมเปญ การตั้งค่า Conversion การอ่านรายงาน และแนวทางปรับปรุงประสิทธิภาพ",
    images: [OG_IMAGE],
  },
};

export default function GoogleAdsServicePage() {
  const LOGO_FULL = LOGO_URL.startsWith("http") ? LOGO_URL : `${SITE_URL}${LOGO_URL}`;

  // === JSON-LD: BreadcrumbList ===
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "หน้าแรก", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "บริการ", item: `${SITE_URL}/services` },
      { "@type": "ListItem", position: 3, name: "Google Ads", item: CANON },
    ],
  };

  // === JSON-LD: Service schema (เน้นข้อมูลที่ตรวจสอบได้) ===
  const productLd = {
    "@context": "https://schema.org/",
    "@type": "Service",
    name: "Google Ads",
    description:
      "แนวทางการวางโครงสร้างแคมเปญ Google Ads การตั้งค่า Conversion และการอ่านรายงานเพื่อปรับปรุงประสิทธิภาพ",
    image: OG_IMAGE,
    provider: { "@type": "Organization", name: BRAND, url: SITE_URL },
    areaServed: "TH",
    url: CANON,
  };

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Google Ads",
    provider: { "@type": "Organization", name: BRAND, url: SITE_URL },
    areaServed: "TH",
    url: CANON,
  };

  const faqItems = [
    {
      q: "Google Ads เหมาะกับเป้าหมายแบบไหน?",
      a: "เหมาะกับเป้าหมายที่วัดผลได้ เช่น ยอดขาย ลีด การติดต่อ หรือทราฟฟิกคุณภาพ โดยเลือกประเภทแคมเปญให้สอดคล้องกับเส้นทางผู้ใช้",
    },
    {
      q: "ต้องติดตั้งอะไรเพื่อวัดผลให้ถูกต้อง?",
      a: "โดยทั่วไปต้องตั้งค่า Conversion (เช่น ฟอร์ม/โทร/สั่งซื้อ) และเชื่อมเครื่องมือวิเคราะห์ เช่น Google Analytics และ Tag Manager เพื่อยืนยันการนับผลลัพธ์",
    },
    {
      q: "อะไรคือสาเหตุยอดฮิตที่ทำให้ค่าโฆษณาแพง?",
      a: "มักมาจากคีย์เวิร์ดกว้างเกินไป โครงสร้างแคมเปญไม่ชัด การจับคู่คีย์เวิร์ดไม่เหมาะสม และหน้า Landing ไม่ตอบโจทย์ ทำให้ Quality Score ต่ำ",
    },
  ];

  return (
    <>
      {/* JSON-LD สำหรับ SEO */}
      <JsonLd json={breadcrumbLd} />
      <JsonLd json={productLd} />
      <JsonLd json={serviceLd} />

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
            <li className="breadcrumb-item active" aria-current="page">Google Ads</li>
          </ol>
        </nav>

        <div className="text-center mb-4">
          <h1 className="fw-bold">Google Ads: โครงสร้าง การวัดผล และแนวทางปรับปรุง</h1>
          <div className="hero__media mt-4">
            <Image
              src="/images/review.jpg"
              alt="ตัวอย่างผลงานการทำโฆษณาและแดชบอร์ดสรุปผล"
              width={1200}
              height={630}
              sizes="(max-width: 767px) 100vw, (max-width: 1199px) 90vw, 1200px"
              priority
              className="img-fluid rounded shadow-sm"
            />
          </div>
        </div>

        <section className="mb-5">
          <h2 className="h4 text-primary">Google Ads คืออะไร และทำงานอย่างไร</h2>
          <p>
            Google Ads (เดิมชื่อ Google AdWords) เป็นแพลตฟอร์มโฆษณาของ Google ที่ช่วยให้ธุรกิจเข้าถึงผู้ใช้ผ่านการค้นหา (Search) เครือข่ายแสดงผล และรูปแบบแคมเปญอื่น ๆ
            โดยตั้งค่ากลุ่มเป้าหมาย งบประมาณ การแสดงผล และเหตุการณ์ที่ต้องการนับเป็นผลลัพธ์ (Conversion) ได้อย่างเป็นระบบ
          </p>
        </section>

        <section className="mb-5">
          <h2 className="h4 text-primary">ปัญหาที่พบบ่อยในการทำโฆษณาบน Google และวิธีการแก้ไข</h2>
          <p>
            <strong>งบประมาณไม่พอ</strong> <br />
            ปัญหา: งบประมาณที่ตั้งไว้ไม่เพียงพอในการแข่งขันกับคู่แข่งในตลาดเดียวกัน
          </p>
          <ul>
            <li>
              <strong>ปรับปรุงการตั้งค่า CPC:</strong> ลองลดราคาต่อคลิก (CPC)
              หรือลองใช้รูปแบบการชำระเงินที่เหมาะสมกับงบประมาณ
            </li>
            <li>
              <strong>การเลือกคำค้นหาที่เหมาะสม:</strong> ใช้คำค้นหาที่มีการแข่งขันต่ำลง
              แต่ยังคงตรงกับกลุ่มเป้าหมาย
            </li>
            <li>
              <strong>การสร้างโฆษณาที่มีคุณภาพ:</strong> พัฒนาโฆษณาที่มีความน่าสนใจและเกี่ยวข้องกับคำค้นหาของผู้ใช้
            </li>
          </ul>

          <div className="my-4">
            <Image
              src="/images/reviews.jpg"
              alt="ตัวอย่างผลงานการทำโฆษณาและแดชบอร์ดสรุปผล"
              width={1200}
              height={630}
              sizes="(max-width: 767px) 100vw, (max-width: 1199px) 90vw, 1200px"
              className="img-fluid rounded shadow-sm"
            />
          </div>
        </section>

        <section className="mb-5">
          <h2 className="h4 text-primary">การคลิกที่ไม่เกี่ยวข้อง</h2>
          <p>
            ผู้ใช้คลิกที่โฆษณาแต่ไม่ทำการซื้อหรือไม่ดำเนินการตามที่คาดหวัง
          </p>
          <ul>
            <li>
              <strong>การปรับปรุงหน้าเว็บปลายทาง:</strong> ทำให้หน้าเว็บของคุณตอบสนองได้ดีและมีข้อมูลที่ครบถ้วนเพื่อให้ลูกค้าสามารถทำการตัดสินใจได้ง่าย
            </li>
            <li>
              <strong>การใช้กลุ่มเป้าหมายที่เจาะจง:</strong> ใช้การตั้งค่ากลุ่มเป้าหมายที่เจาะจงมากขึ้นเพื่อให้โฆษณาของคุณแสดงต่อผู้ใช้ที่มีความสนใจจริง
            </li>
          </ul>
        </section>

        <section className="mb-5">
          <h2 className="h4 text-primary">การวิเคราะห์และการติดตามผล</h2>
          <p>
            ปัญหา: ขาดข้อมูลที่เพียงพอในการวิเคราะห์ผลลัพธ์ของการโฆษณา
          </p>
          <ul>
            <li>
              ใช้{" "}
              <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer">Google Analytics</a> เพื่อติดตามการทำงานของโฆษณาและการเข้าชมเว็บไซต์
            </li>
            <li>
              ตรวจสอบรายงานจาก Google Ads อย่างสม่ำเสมอเพื่อปรับปรุงกลยุทธ์และประสิทธิภาพของโฆษณา
            </li>
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
