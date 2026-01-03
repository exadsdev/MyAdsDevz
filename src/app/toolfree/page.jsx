import JsonLd from "@/app/components/JsonLd";
import FAQ from "@/app/components/FAQ";
import { SITE, BRAND, LOGO_URL } from "@/app/seo.config";
import ToolfreeClient from "./ToolfreeClient";

const site = process.env.NEXT_PUBLIC_SITE_URL || SITE;
const brandName = typeof BRAND === "string" ? BRAND : BRAND?.name || "MyAdsDev";

export const metadata = {
  metadataBase: new URL(site),
  title: "ดาวน์โหลดเครื่องมือทำการตลาดฟรี | Facebook & Google | myads.dev",
  description:
    "ดาวน์โหลด Landing Page ฟรี สำหรับโฆษณา Facebook และ Google พร้อมใช้งานทันที ไม่มีค่าใช้จ่าย ช่วยเพิ่มประสิทธิภาพการยิงแอด",
  alternates: { canonical: `${site}/toolfree` },
  openGraph: {
    type: "website",
    url: `${site}/toolfree`,
    title: "ดาวน์โหลดเครื่องมือทำการตลาดฟรี - Facebook & Google",
    description:
      "ดาวน์โหลด Landing Page พร้อมใช้งานฟรี สำหรับ Facebook และ Google",
    images: [
      {
        url: `${site}/images/ldfb.jpg`,
        width: 1200,
        height: 630,
        alt: "ดาวน์โหลดเครื่องมือทำการตลาดฟรี",
      },
    ],
    siteName: BRAND,
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    title: "ดาวน์โหลดเครื่องมือทำการตลาดฟรี - Facebook & Google",
    description:
      "ดาวน์โหลด Landing Page พร้อมใช้งานฟรี สำหรับ Facebook และ Google",
    images: [`${site}/images/ldfb.jpg`],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export default function ToolfreePage() {
  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "ดาวน์โหลดเครื่องมือทำการตลาดฟรี - Facebook และ Google",
    url: `${site}/toolfree`,
    description:
      "ดาวน์โหลดฟรี! เครื่องมือ Landing Page สำหรับโฆษณา Facebook และ Google ดาวน์โหลดทันทีไม่มีค่าใช้จ่าย",
    publisher: {
      "@type": "Organization",
      name: brandName,
      url: site,
      logo: { "@type": "ImageObject", url: LOGO_URL },
    },
    image: `${site}/images/ldfb.jpg`,
    inLanguage: "th-TH",
  };

  const faqItems = [
    {
      q: "เครื่องมือเหล่านี้มีค่าใช้จ่ายหรือไม่?",
      a: "ไม่มีค่าใช้จ่าย เครื่องมือ Landing Page และไฟล์ประกอบการตลาดในหน้านี้แจกฟรีเพื่อช่วยสนับสนุนธุรกิจออนไลน์",
    },
    {
      q: "สามารถนำ Landing Page ไปปรับแต่งเองได้ไหม?",
      a: "ได้ ไฟล์ที่แจกอยู่ในรูปแบบที่สามารถแก้ไขและปรับแต่งข้อมูลสินค้าหรือบริการของตนเองได้ทันที",
    },
    {
      q: "ทำไมถึงต้องใช้ Landing Page แยกสำหรับการยิงแอด?",
      a: "การใช้ Landing Page เฉพาะช่วยให้เนื้อหามีความโฟกัส ตรงประเด็น และช่วยเพิ่มอัตราการเปลี่ยนเป็นยอดขาย (Conversion Rate) ได้ดีกว่าหน้าโฮมเพจทั่วไป",
    },
  ];

  return (
    <>
      <JsonLd data={webPageLd} />

      <div className="container-fluid py-5">
        <div className="text-center mb-5">
          <h1 className="fw-bold h2 mb-3">ดาวน์โหลดเครื่องมือทำการตลาดฟรี</h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: "800px" }}>
            Landing Page คุณภาพสำหรับการยิงแอด <strong>Facebook</strong> และ{" "}
            <strong>Google</strong> ออกแบบมาเพื่อเน้นผลลัพธ์และวัดผลง่าย พร้อมใช้งานทันที
          </p>
        </div>

        <section className="mb-5">
          <h2 className="h4 fw-bold mb-4">รายการเครื่องมือและเทมเพลตพร้อมดาวน์โหลด</h2>
          <ToolfreeClient />
        </section>

        <section className="mt-5 pt-4">
          <h2 className="h4 fw-bold mb-4">ความสำคัญของเครื่องมือและการวางระบบโฆษณา</h2>
          <p className="text-muted">
            การมีเครื่องมือที่เหมาะสมช่วยลดเวลาในการลองผิดลองถูก Landing Page ที่แจกฟรีนี้ได้ผ่านการทดสอบโครงสร้างเบื้องต้นว่าสามารถใช้งานร่วมกับ Google Ads และ Facebook Ads ได้อย่างมีประสิทธิภาพ ช่วยให้การตั้งค่า Conversion Tracking ทำได้ง่ายขึ้น
          </p>
        </section>

        <FAQ items={faqItems} />
      </div>
    </>
  );
}

