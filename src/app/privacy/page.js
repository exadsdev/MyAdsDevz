// app/privacy/page.jsx

import { SITE, BRAND, LOGO_URL } from "../seo.config";
import Link from "next/link";
import Image from "next/image";
import JsonLd from "@/app/components/JsonLd";
import FAQ from "@/app/components/FAQ";

const brandName = typeof BRAND === "string" ? BRAND : BRAND?.name || "MyAdsDev";
const PAGE_URL = `${SITE}/privacy`;
const OG_IMAGE = `${SITE}/images/privacy-hero.jpg`;

export const metadata = {
  metadataBase: new URL(SITE),
  title: `นโยบายความเป็นส่วนตัว | ${brandName}`,
  description:
    "รายละเอียดนโยบายความเป็นส่วนตัว การเก็บรวบรวมข้อมูล การใช้คุกกี้ การใช้ข้อมูลประกอบโฆษณา และมาตรการรักษาความปลอดภัยของผู้ใช้งาน",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: brandName,
    title: `นโยบายความเป็นส่วนตัว | ${brandName}`,
    description:
      "นโยบายความเป็นส่วนตัวของเว็บไซต์ บริการรับทำโฆษณาออนไลน์ การเก็บรวบรวมและใช้ข้อมูลส่วนบุคคล การใช้คุกกี้ และสิทธิ์ของเจ้าของข้อมูล",
    images: [
      { url: OG_IMAGE, width: 1200, height: 630, alt: `${brandName} Privacy Policy` },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `นโยบายความเป็นส่วนตัว | ${brandName}`,
    description:
      "รายละเอียดนโยบายความเป็นส่วนตัว การเก็บรวบรวมข้อมูล การใช้คุกกี้ การใช้ข้อมูลประกอบโฆษณา และมาตรการรักษาความปลอดภัยของผู้ใช้งาน",
    images: [OG_IMAGE],
  },
};

export default function PrivacyPage() {
  const updatedDate = new Date().toLocaleDateString("th-TH");

  const pageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `นโยบายความเป็นส่วนตัว | ${brandName}`,
    url: PAGE_URL,
    description:
      "นโยบายความเป็นส่วนตัวของเว็บไซต์ บริการรับทำโฆษณาออนไลน์ การเก็บรวบรวมและใช้ข้อมูลส่วนบุคคล การใช้คุกกี้ และสิทธิ์ของเจ้าของข้อมูล",
    publisher: {
      "@type": "Organization",
      name: brandName,
      legalName: "GOWNUM KOSANA LIMITED PARTNERSHIP",
      url: SITE,
      logo: LOGO_URL ? { "@type": "ImageObject", url: LOGO_URL } : undefined,
      address: {
        "@type": "PostalAddress",
        streetAddress: "130 Ratsadon Uthit Road",
        addressLocality: "Mueang Rayong District",
        addressRegion: "Rayong",
        postalCode: "21000",
        addressCountry: "TH",
      },
      sameAs: [
        "https://maps.app.goo.gl/E3PrCnVSWAdCkvvs8",
        "https://lin.ee/OuyclyD",
        "https://www.youtube.com/@myadsdev",
        "https://t.me/AdsDev",
      ],
    },
  };

  const faqItems = [
    {
      q: "ข้อมูลส่วนบุคคลที่เก็บรวบรวมมีอะไรบ้าง?",
      a: "เรารวบรวมข้อมูลระบุตัวตน เช่น ชื่อ-สกุล, ข้อมูลติดต่อ, ข้อมูลทางเทคนิค เช่น IP address, เบราว์เซอร์, คุกกี้ เพื่อวิเคราะห์การใช้งาน",
    },
    {
      q: "ข้อมูลของฉันจะถูกใช้เพื่ออะไร?",
      a: "ข้อมูลใช้เพื่อปรับปรุงประสบการณ์ผู้ใช้, การวิเคราะห์การใช้งาน, การให้บริการโฆษณาที่ตรงกับความสนใจ, และการรักษาความปลอดภัยของระบบ",
    },
    {
      q: "ฉันสามารถขอให้ลบข้อมูลส่วนบุคคลได้หรือไม่?",
      a: "ใช่ คุณสามารถติดต่อทีมงานผ่านช่องทางที่ระบุเพื่อขอเข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลของคุณ",
    },
  ];

  return (
    <div className="container-fluid py-5">
      <JsonLd data={pageLd} />

      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/" className="text-decoration-none text-muted">
              หน้าแรก
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            นโยบายความเป็นส่วนตัว
          </li>
        </ol>
      </nav>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <article className="bg-white p-4 p-md-5 shadow-sm rounded">
            <h1 className="mb-4 text-primary fw-bold">
              นโยบายความเป็นส่วนตัว (Privacy Policy)
            </h1>
            <p className="text-muted border-bottom pb-3">อัปเดตล่าสุด: {updatedDate}</p>

            {/* ✅ เพิ่มข้อมูลบริษัท + รูปทะเบียนพาณิชย์ */}
            <div className="alert alert-light border mt-4">
              <h2 className="h5 fw-bold mb-3">ข้อมูลผู้ให้บริการเว็บไซต์</h2>

              <div className="row g-3 align-items-start">
                <div className="col-12 col-md-8">
                  <ul className="list-unstyled mb-0">
                    <li className="mb-1">
                      <strong>ชื่อธุรกิจ (TH):</strong> ห้างหุ้นส่วนจำกัด ก้าวนำ โฆษณา
                    </li>
                    <li className="mb-1">
                      <strong>Legal name (EN):</strong> GOWNUM KOSANA LIMITED PARTNERSHIP
                    </li>
                    <li className="mb-1">
                      <strong>เลขทะเบียน:</strong> 0213548002976
                    </li>
                    <li className="mb-1">
                      <strong>ที่อยู่ (TH):</strong> 130 ถนนราษฎร์อุทิศ ตำบลเชิงเนิน อำเภอเมืองระยอง จ.ระยอง 21000
                    </li>
                    <li className="mb-0">
                      <strong>Address (EN):</strong> 130 Ratsadon Uthit Road, Choeng Noen Subdistrict, Mueang Rayong District, Rayong 21000, Thailand
                    </li>
                  </ul>

                  <div className="mt-3 d-flex flex-wrap gap-3">
                    <a
                      href="https://maps.app.goo.gl/E3PrCnVSWAdCkvvs8"
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-decoration-none"
                    >
                      เปิดดูแผนที่บน Google Maps
                    </a>

                    <a
                      href="./public/GOW.jpg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      ดูรูปทะเบียนพาณิชย์ (ไฟล์เต็ม)
                    </a>
                  </div>
                </div>

                {/* Thumbnail รูปทะเบียนพาณิชย์ (เล็ก) */}
                <div className="col-12 col-md-4">
                  <a
                    href="/gow.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="ดูรูปทะเบียนพาณิชย์"
                    className="d-inline-block"
                  >
                    <Image
                      src="/gow.jpg"
                      alt="ทะเบียนพาณิชย์ ห้างหุ้นส่วนจำกัด ก้าวนำ โฆษณา"
                      width={260}
                      height={360}
                      className="img-thumbnail"
                      priority={false}
                    />
                  </a>
                  <p className="small text-muted mt-2 mb-0">คลิกเพื่อดูรูปเต็ม</p>
                </div>
              </div>
            </div>

            <div className="content-body mt-4">
              <section className="mb-4">
                <h2 className="fw-bold">1. บทนำ</h2>
                <p>
                  <strong>{brandName}</strong> (ต่อไปนี้จะเรียกว่า “เรา”) ให้ความสำคัญกับความเป็นส่วนตัวและความปลอดภัยของข้อมูลผู้ใช้งาน
                  นโยบายนี้อธิบายถึงวิธีการที่เราเก็บรวบรวม ใช้ และดูแลรักษาข้อมูลส่วนบุคคลของคุณเมื่อเข้าชมเว็บไซต์ {SITE} หรือใช้บริการของเรา
                  ทั้งการรับทำโฆษณา คอร์สเรียน และเครื่องมือต่าง ๆ
                </p>
              </section>

              <section className="mb-4">
                <h2 className="fw-bold">2. ข้อมูลที่เราเก็บรวบรวม</h2>
                <p>เราอาจเก็บรวบรวมข้อมูลประเภทต่าง ๆ ดังนี้:</p>
                <ul>
                  <li>
                    <strong>ข้อมูลระบุตัวตน:</strong> เช่น ชื่อ, นามสกุล (เมื่อมีการติดต่อหรือสมัครสมาชิก)
                  </li>
                  <li>
                    <strong>ข้อมูลการติดต่อ:</strong> เช่น อีเมล, เบอร์โทรศัพท์, LINE ID
                  </li>
                  <li>
                    <strong>ข้อมูลทางเทคนิค:</strong> เช่น หมายเลข IP Address, ชนิดของเบราว์เซอร์, การตั้งค่าเขตเวลา, และข้อมูลคุกกี้ (Cookies)
                    เพื่อการวิเคราะห์การใช้งานเว็บไซต์
                  </li>
                </ul>
              </section>

              <section className="mb-4">
                <h2 className="fw-bold">3. การใช้ข้อมูล (Cookies &amp; Tracking)</h2>
                <p>
                  เว็บไซต์ของเรามีการใช้งานเทคโนโลยีการติดตาม เช่น Google Analytics, Google Ads Conversion Tracking และ Facebook Pixel
                  เพื่อวัตถุประสงค์ในการ:
                </p>
                <ul>
                  <li>วิเคราะห์พฤติกรรมการใช้งานเพื่อปรับปรุงประสบการณ์ผู้ใช้</li>
                  <li>นำเสนอโฆษณาที่เกี่ยวข้องกับความสนใจของคุณ (Retargeting)</li>
                  <li>วัดผลความสำเร็จของแคมเปญโฆษณา</li>
                </ul>
              </section>

              <section className="mb-4">
                <h2 className="fw-bold">4. การรักษาความปลอดภัยของข้อมูล</h2>
                <p>
                  เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อป้องกันไม่ให้ข้อมูลส่วนบุคคลของคุณสูญหาย, ถูกเข้าถึง, ใช้, เปลี่ยนแปลง
                  หรือเปิดเผยโดยไม่ได้รับอนุญาต ข้อมูลของคุณจะถูกเก็บรักษาเป็นความลับและจะไม่มีการขายข้อมูลให้บุคคลที่สาม
                </p>
              </section>

              <section className="mb-4">
                <h2 className="fw-bold">5. สิทธิ์ของคุณ</h2>
                <p>
                  คุณมีสิทธิ์ในการขอเข้าถึง, แก้ไข หรือ ลบข้อมูลส่วนบุคคลของคุณที่เราเก็บรักษาไว้
                  หากต้องการดำเนินการดังกล่าว โปรดติดต่อเราผ่านช่องทางที่ระบุไว้ด้านล่าง
                </p>
              </section>

              <section className="mb-4">
                <h2 className="fw-bold">6. ติดต่อเรา</h2>
                <p>หากคุณมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ สามารถติดต่อเราได้ที่:</p>
                <ul className="list-unstyled bg-light p-3 rounded">
                  <li><strong>เว็บไซต์:</strong> {SITE}</li>
                  <li><strong>ทีมงาน:</strong> {brandName}</li>
                  <li>
                    <strong>ช่องทางติดต่อหลัก:</strong>{" "}
                    <Link href="/contact" className="text-primary text-decoration-none">
                      หน้าติดต่อเรา
                    </Link>{" "}
                    หรือ LINE Official
                  </li>
                </ul>
              </section>
            </div>

            <FAQ items={faqItems} />
          </article>
        </div>
      </div>
    </div>
  );
}
