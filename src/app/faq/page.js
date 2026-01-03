import Link from "next/link";
import FAQLd from "../components/FAQLd";
import { SITE, BRAND } from "../seo.config";

export const dynamic = "force-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE;
const brandName = typeof BRAND === "string" ? BRAND : BRAND?.name || "MyAdsDev";
const PAGE_URL = `${SITE_URL}/faq`;
const OG_IMAGE = `${SITE_URL}/images/og-default.jpg`;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: `คำถามที่พบบ่อย (FAQ) | ${brandName}`,
  description:
    "รวมคำตอบที่ลูกค้าถามบ่อยเกี่ยวกับการยิงแอด การวัดผลโฆษณา วิธีเริ่มต้นใช้งาน เงื่อนไขการให้บริการ และรูปแบบการทำงานร่วมกับทีมโฆษณาออนไลน์",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: brandName,
    title: `คำถามที่พบบ่อย (FAQ) | ${brandName}`,
    description:
      "FAQ สำหรับบริการโฆษณาออนไลน์ ครอบคลุมคำถามยอดนิยมเรื่องงบโฆษณา ระยะเวลาเห็นผล การวัดผล และการยกเลิกบริการ",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${brandName} - FAQ`,
      },
    ],
    locale: "th_TH",
  },
};

export const faqs = [
  {
    q: "เริ่มต้นใช้งานต้องเตรียมอะไรบ้าง?",
    a: "ลิงก์เว็บไซต์/เพจ ข้อมูลธุรกิจ เป้าหมาย และสื่อโฆษณาที่มี (หากไม่มี เราช่วยจัดทำได้)",
  },
  {
    q: "ยิงแอด Facebook มีค่าบริการต่อเดือนเท่าไหร่?",
    a: "ค่าบริการยิงแอดโฆษณา Facebook แบบเหมาจ่ายรายเดือนเดือนละ 9,900 บาท ไม่มีค่าใช้จ่ายใดๆเพิ่มเติมทั้งสิ้น",
  },
  {
    q: "ยิงแอด Google มีค่าบริการต่อเดือนเท่าไร?",
    a: "ค่าบริการยิงแอดโฆษณา Google แบบเหมาจ่ายรายเดือนเดือนละ 12,900 บาท ไม่มีค่าใช้จ่ายใดๆเพิ่มเติมทั้งสิ้น",
  },
  {
    q: "ต้องใช้ระยะเวลาเท่าไรจึงจะเห็นผลลัพธ์?",
    a: "โดยทั่วไปจะเริ่มเห็นผลลัพธ์ภายใน 7-14 วัน ขึ้นอยู่กับประเภทของแคมเปญและงบประมาณที่ตั้งไว้",
  },
  {
    q: "สามารถปรับเปลี่ยนงบประมาณโฆษณาได้หรือไม่?",
    a: "ได้ คุณสามารถปรับเปลี่ยนงบประมาณโฆษณาได้ตามความต้องการและผลลัพธ์ที่ได้รับ",
  },
  {
    q: "มีรายงานผลการโฆษณาอย่างไร?",
    a: "เราจะส่งรายงานผลการโฆษณาเป็นรายสัปดาห์และรายเดือน พร้อมคำแนะนำในการปรับปรุงแคมเปญ",
  },
  {
    q: "สามารถยกเลิกบริการได้เมื่อไร?",
    a: "คุณสามารถยกเลิกบริการได้ทุกเมื่อโดยแจ้งล่วงหน้า 7 วันก่อนสิ้นสุดรอบบิล",
  },
];

export default function FaqPage() {
  return (
    <div className="container-fluid py-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/" className="text-decoration-none text-muted">
              หน้าแรก
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            คำถามที่พบบ่อย (FAQ)
          </li>
        </ol>
      </nav>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <article className="bg-white p-4 p-md-5 shadow-sm rounded">
            <h1 className="mb-4 fw-bold text-primary">
              คำถามที่พบบ่อย (FAQ)
            </h1>
            <p className="text-muted mb-5">
              รวมคำถามและคำตอบที่ลูกค้ามักสอบถามเกี่ยวกับการยิงแอด
              การเริ่มต้นใช้งาน งบประมาณโฆษณา ระยะเวลาเห็นผลลัพธ์
              และรูปแบบการทำงานร่วมกันกับทีม {brandName}
            </p>

            <FAQ items={faqs} />
          </article>
        </div>
      </div>
    </div>
  );
}

