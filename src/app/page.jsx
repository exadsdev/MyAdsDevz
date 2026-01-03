import Image from "next/image";
import Link from "next/link";
import JsonLd from "./components/JsonLd";
import Secsions from "./components/Secsions";
import { SITE, BRAND, LOGO_URL, YOUTUBE_VIDEO_URL } from "./seo.config";
import Rbvdo from "./components/Rbvdo";
import FAQ from "./components/FAQ";
import { faqs } from "./faq/page";

export const dynamic = "force-static";

const HERO_IMAGE = `${SITE}/images/og-default.jpg`;

export const metadata = {
  metadataBase: new URL(SITE),
  title: `${BRAND} | ทำโฆษณาออนไลน์ Google & Facebook Ads`,
  description: `${BRAND} วางกลยุทธ์โฆษณาออนไลน์ ตั้งค่า Conversion Tracking วัดผล และปรับปรุงแคมเปญแบบเป็นระบบ (Google Ads / Meta Ads)`,
  alternates: { canonical: SITE },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: BRAND,
    title: `${BRAND} | ทำโฆษณาออนไลน์ Google & Facebook Ads`,
    description: `${BRAND} วางกลยุทธ์ ตั้งค่า Conversion Tracking วัดผล และปรับปรุงแคมเปญแบบเป็นระบบ`,
    images: [
      {
        url: HERO_IMAGE, // ใช้รูปเดียวกับ hero
        width: 1200,
        height: 630,
        alt: `${BRAND} - โฆษณาออนไลน์ (Google Ads / Meta Ads)`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND} | ทำโฆษณาออนไลน์ Google & Facebook Ads`,
    description: `${BRAND} วางกลยุทธ์ ตั้งค่า Conversion Tracking วัดผล และปรับปรุงแคมเปญแบบเป็นระบบ`,
    images: [HERO_IMAGE],
  },
  // ให้ Google แสดงรูปตัวอย่างใหญ่ได้
  robots: {
    index: true,
    follow: true,
    maxImagePreview: "large",
    googleBot: {
      index: true,
      follow: true,
      maxImagePreview: "large",
    },
  },
};

// === JSON-LD: WebSite ===
const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: BRAND,
  url: SITE,
  publisher: {
    "@type": "Organization",
    name: BRAND,
    logo: { "@type": "ImageObject", url: LOGO_URL },
  },
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

// === JSON-LD: Organization ===
const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: BRAND,
  url: SITE,
  logo: { "@type": "ImageObject", url: LOGO_URL },
  image: [HERO_IMAGE],
};

// === JSON-LD: WebPage ===
const webPageLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  url: SITE,
  name: `${BRAND} | ทำโฆษณาออนไลน์ Google & Facebook Ads`,
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: HERO_IMAGE,
    width: 1200,
    height: 630,
  },
  // เพิ่ม image ให้ตรงกับ hero (ช่วยให้ Google เข้าใจรูปหลักของหน้า)
  image: [HERO_IMAGE],
  isPartOf: { "@type": "WebSite", url: SITE, name: BRAND },
};

// === JSON-LD: Breadcrumb ===
const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "หน้าแรก", item: SITE },
  ],
};

// === JSON-LD: Services (แทน Product สำหรับบริการ) ===
const servicesLd = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Google Ads (เชิงระบบ)",
    description:
      "บริการดูแล Google Ads แบบเป็นระบบ ตั้งค่า Conversion Tracking วัดผล และปรับปรุงโครงสร้างแคมเปญจากข้อมูลจริง",
    provider: { "@type": "Organization", name: BRAND, url: SITE },
    areaServed: "TH",
    image: [HERO_IMAGE],
    url: `${SITE}/services/google-ads`,
    priceRange: "฿฿",
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Meta/Facebook Ads (เชิงระบบ)",
    description:
      "บริการดูแล Meta/Facebook Ads วางกลยุทธ์ ทดสอบครีเอทีฟ และตั้งค่า Tracking เพื่อให้ผลลัพธ์วัดได้และปรับปรุงได้",
    provider: { "@type": "Organization", name: BRAND, url: SITE },
    areaServed: "TH",
    image: [HERO_IMAGE],
    url: `${SITE}/services/facebook-ads`,
    priceRange: "฿฿",
  },
];

// === JSON-LD: Product (ใช้รูปของเว็บคุณเอง + ลิงก์บริการ) ===
const productLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "บริการทำโฆษณาออนไลน์ (Google Ads / Meta Ads)",
  image: [HERO_IMAGE], // ให้ Google ใช้รูปนี้เวลาแสดง Rich Result
  description:
    "บริการดูแลโฆษณาออนไลน์แบบเน้นโครงสร้าง การวัดผล และการปรับปรุงต่อเนื่อง ครอบคลุม Google Ads และ Meta/Facebook Ads",
  provider: { "@type": "Organization", name: BRAND, url: SITE },
  url: `${SITE}/services`,
};

// === JSON-LD: ImageObject ของรูปฮีโร่ ===
const heroImageLd = {
  "@context": "https://schema.org",
  "@type": "ImageObject",
  contentUrl: HERO_IMAGE,
  url: HERO_IMAGE,
  width: 1200,
  height: 630,
  caption: `${BRAND} - ตัวอย่างผลงานการทำโฆษณาและแดชบอร์ดสรุปผล`,
};

// === JSON-LD: VideoObject (วิดีโอหลักบนหน้าแรก) ===
const VIDEO = {
  title: "ตัวอย่างการทำ Google Ads แบบวัดผลได้ | วิเคราะห์แคมเปญ 2025",
  description:
    "วิดีโอตัวอย่างการทำ Google Ads แบบวัดผลได้ ปี 2025: โครงสร้างแคมเปญ การตั้งค่า Conversion Tracking การอ่านผล และแนวทางปรับปรุงจากข้อมูลจริง.",
  pageUrl: `${SITE}/`,
  // แนะนำให้อัปไฟล์ thumbnail จริงใน /public/images แล้วแก้ path ให้ตรง
  thumbnailUrl: `${SITE}/images/video-main-thumbnail.jpg`,
  // ลิงก์ embed ของ YouTube (ใช้ค่าจาก config)
  embedUrl: YOUTUBE_VIDEO_URL,
  // ถ้ามีไฟล์วิดีโอบนเว็บตัวเองให้ใส่ URL จริง ไม่มีก็ตัด field นี้ทิ้งได้
  contentUrl: `${SITE}/videos/main-demo-google-ads-2025.mp4`,
  uploadDate: "2025-12-01T10:00:00+07:00", // แก้เป็นวันที่อัปจริง
  durationISO: "PT12M30S", // แก้เป็นความยาวจริง เช่น PT8M15S
};

function getVideoJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: VIDEO.title,
    description: VIDEO.description,
    thumbnailUrl: [VIDEO.thumbnailUrl],
    uploadDate: VIDEO.uploadDate,
    duration: VIDEO.durationISO,
    ...(VIDEO.contentUrl && { contentUrl: VIDEO.contentUrl }),
    embedUrl: VIDEO.embedUrl,
    publisher: {
      "@type": "Organization",
      name: BRAND,
      logo: {
        "@type": "ImageObject",
        url: LOGO_URL,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": VIDEO.pageUrl,
    },
  };
}

export default function HomePage() {
  return (
    <>
      <nav className="container" aria-label="เมนูหลัก">
        <ul className="nav">
          <li>
            <Link href="/" prefetch>
              หน้าแรก
            </Link>
          </li>
          <li>
            <Link href="/reviews" prefetch>
              รีวิวลูกค้า
            </Link>
          </li>
          <li>
            <Link href="/services" prefetch>
              บริการ
            </Link>
          </li>
          <li>
            <Link href="/blog" prefetch>
              บทความ
            </Link>
          </li>
          <li>
            <Link href="/services/google-ads" prefetch>
              Google Ads
            </Link>
          </li>
          <li>
            <Link href="/services/facebook-ads" prefetch>
              Facebook Ads
            </Link>
          </li>
          <li>
            <Link href="/course" prefetch>
              คอร์สเรียนยิงAds
            </Link>
          </li>
          <li>
            <Link href="/videos" prefetch>
              Video
            </Link>
          </li>
          <li>
            <Link href="/faq" prefetch>
              FAQ
            </Link>
          </li>
          <li>
            <Link href="/search" prefetch>
              search
            </Link>
          </li>
          <li>
            <Link href="/contact" prefetch>
              ติดต่อเรา
            </Link>
          </li>
        </ul>
      </nav>

      <header className="hero container-fluid" aria-labelledby="hero-title">
        <div className="hero__text">
          <h1 id="hero-title" className="mb-2">
            <strong>รับทำโฆษณาออนไลน์</strong> แบบวัดผลได้ <br />
            ครอบคลุม Google Ads และ Meta/Facebook Ads
          </h1>
          <p className="text-muted">
            เริ่มโฆษณาก่อน ชำระเงินทีหลัง ผู้เชี่ยวชาญสายแคมเปญและคอนเวอร์ชัน
            วิเคราะห์คำค้น/ออดิเอนซ์ วางโครงสร้างคอนเทนต์เพื่อ SEO และเสริมความน่าเชื่อถือด้วย
            Structured Data
          </p>

          <div className="btn-row">
            <Link
              className="btn primary btn--block-sm"
              href="/services/google-ads"
              prefetch
            >
              เริ่มที่ Google Ads
            </Link>
            <Link
              className="btn btn--ghost btn--block-sm"
              href="/services/facebook-ads"
              prefetch
            >
              ดูบริการ Facebook Ads
            </Link>
          </div>

          <ul className="meta" aria-label="จุดเด่นบริการ">
            <li>ขึ้นแอดโฆษณา ชำระเงินภายหลัง</li>
            <li>
              <strong>ดูแลแคมเปญ</strong> Google Ads
            </li>
            <li>
              <strong>ดูแลแคมเปญ</strong> Meta/Facebook Ads
            </li>
          </ul>
        </div>

        <div className="hero__media">
          <Image
            src="/reviwe.jpg"
            alt="ภาพตัวอย่างสินค้า MyAdsDev"
            width={800}
            height={450}
            sizes="(max-width: 767px) 100vw, (max-width: 1199px) 90vw, 1200px"
            priority
            className="hero__img img-fluid rounded shadow-sm mb-4"
          />
        </div>
      </header>

      {/* PACKAGES */}
      <section className="section container-fluid" aria-labelledby="pkg-title">
        <h2 id="pkg-title" className="mb-3">
          แพ็กเกจยอดนิยมสำหรับโฆษณาออนไลน์{" "}
          <strong>ดูแลแคมเปญแบบเป็นระบบ</strong>
        </h2>

        <div className="cards-grid">
          <article
            className="card"
            itemScope
            itemType="https://schema.org/Service"
          >
            <header>
              <h3 itemProp="name">🌎 Google Ads</h3>
            </header>
            <p itemProp="description">
              ค้นหาตรงกลุ่ม เน้นคุณภาพทราฟฟิกและ Conversion Tracking
            </p>
            <p className="price">ราคา: 12,900 บาท/เดือน</p>
            <Link
              className="btn w-100"
              href="/services/google-ads"
              prefetch
            >
              ✔ รายละเอียด
            </Link>
          </article>

          <article
            className="card"
            itemScope
            itemType="https://schema.org/Service"
          >
            <header>
              <h3 itemProp="name">☑ Meta/Facebook Ads</h3>
            </header>
            <p itemProp="description">
              ครีเอทีฟ + Conversion API ปรับแต่งต่อเนื่อง
            </p>
            <p className="price">ราคา: 9,900 บาท/เดือน</p>
            <Link
              className="btn w-100"
              href="/services/facebook-ads"
              prefetch
            >
              💥 รายละเอียด
            </Link>
          </article>

          <article className="card">
            <header>
              <h3>✔ SEO + Content</h3>
            </header>
            <p>
              วางโครงสร้างคอนเทนต์ สร้าง FAQ/Service Page/Internal Linking
            </p>
            <Link className="btn w-100" href="/faq" prefetch>
              👂 ดู FAQ
            </Link>
          </article>

          <article className="card">
            <header>
              <h3>🟢 คอร์สเรียนโฆษณาออนไลน์</h3>
            </header>
            <p>คอร์ส Google Ads และ Meta/Facebook Ads (เชิงระบบ)</p>
            <Link className="btn w-100" href="/course" prefetch>
              👀 ดูคอร์สเรียน
            </Link>
          </article>

          <article className="card">
            <header>
              <h3>▶ วิดีโอความรู้โฆษณาออนไลน์</h3>
            </header>
            <p>ฟรีความรู้การทำโฆษณา Google/Facebook</p>
            <Link className="btn w-100" href="/videos" prefetch>
              ▶ ดู Video สอนฟรี
            </Link>
          </article>
        </div>
      </section>

      {/* TRUST */}
      <section className="container-fluid" aria-label="จุดเด่นและความน่าเชื่อถือ">
        <div className="badges-grid">
          <div className="card card--pad">
            <strong>แผนงานชัดเจน</strong>
            <p className="text-muted">Roadmap รายเดือน + KPI</p>
          </div>
          <div className="card card--pad">
            <strong>โปร่งใสตรวจสอบได้</strong>
            <p className="text-muted">รายงานผล/Insight ใช้ได้จริง</p>
          </div>
          <div className="card card--pad">
            <strong>โครงสร้างแคมเปญคุณภาพ</strong>
            <p className="text-muted">
              Search/Discovery/Remarketing ครบ
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-fluid" aria-label="ติดต่อทีมงาน">
        <div className="cta">
          <div>
            <h2 className="h4">เริ่มต้นวางแผนโฆษณาให้ธุรกิจของคุณ</h2>
            <p className="text-muted">
              คุยเป้าหมาย งบ และกลยุทธ์ที่เหมาะสม
            </p>
          </div>
          <div className="btn-row">
            <Link className="btn primary btn--block-sm" href="/contact" prefetch>
              ติดต่อเรา
            </Link>
            <Link className="btn btn--ghost btn--block-sm" href="/services" prefetch>
              ดูบริการทั้งหมด
            </Link>
          </div>
        </div>
      </section>

      {/* การ์ดตัวอย่างสินค้า/บริการ (รูปที่จะให้ Google เห็นชัด ๆ บนหน้า) */}
      <div className="text-center">
        <Link href="/services">
          <div className="card mb-3 m-5 p-3 mx-auto" style={{ maxWidth: 1200 }}>
            <Image
              src="/images/og-default.jpg"
              className="card-img-top"
              width={1200}
              height={630}
              priority
              alt="บริการรับทำโฆษณาออนไลน์ (Google Ads / Meta Ads)"
            />
            <div className="card-body">
              <h5 className="card-title">บริการรับจ้างทำการตลาดออนไลน์</h5>
              <p className="card-text">
                บริการรับทำโฆษณา Google Ads และ Meta/Facebook Ads พร้อมวัดผลและรายงาน
              </p>
              <p className="card-text">
                <small className="text-body-secondary">10/10/2025</small>
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* วิดีโอบนหน้าแรก (ให้แน่ใจว่าใน Rbvdo ใช้วิดีโอตัวเดียวกับ VIDEO.embedUrl) */}
      <Rbvdo />

      <Secsions />

      <section className="container-fluid my-5 pt-5 border-top">
        <FAQ items={faqs} />
      </section>

      {/* JSON-LD ทั้งหมด */}
      <JsonLd json={websiteLd} />
      <JsonLd json={orgLd} />
      <JsonLd json={webPageLd} />
      <JsonLd json={breadcrumbLd} />
      {servicesLd.map((s, i) => (
        <JsonLd key={`svc-${i}`} json={s} />
      ))}
      <JsonLd json={productLd} />
      <JsonLd json={heroImageLd} />
      {/* VideoObject */}
      <JsonLd json={getVideoJsonLd()} />
    </>
  );
}
