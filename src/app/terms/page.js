import { SITE, BRAND, LOGO_URL } from "../seo.config";
import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import FAQ from "@/app/components/FAQ";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE;
const PAGE_URL = `${SITE_URL}/terms`;
const brandName = typeof BRAND === "string" ? BRAND : BRAND?.name || "MyAdsDev";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: `ข้อตกลงและเงื่อนไขการใช้บริการ | ${brandName}`,
  description: "รายละเอียดเงื่อนไขและข้อตกลงในการใช้บริการโฆษณาออนไลน์ การซื้อคอร์สเรียน และการใช้งานเว็บไซต์",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: brandName,
    title: `ข้อตกลงและเงื่อนไขการใช้บริการ | ${brandName}`,
    description: "เงื่อนไขการให้บริการรับทำโฆษณาออนไลน์ และการใช้งานระบบต่างๆ ของเรา",
    images: [{ url: `${SITE_URL}/images/og-default.jpg`, width: 1200, height: 630, alt: `${brandName} Terms` }],
  },
};

export default function TermsPage() {
  const pageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `ข้อตกลงและเงื่อนไขการใช้บริการ | ${brandName}`,
    "url": PAGE_URL,
    "description": "รายละเอียดเงื่อนไขและข้อตกลงในการใช้บริการโฆษณาออนไลน์",
    "publisher": {
      "@type": "Organization",
      "name": brandName,
      "url": SITE_URL,
      "logo": LOGO_URL ? { "@type": "ImageObject", "url": LOGO_URL } : undefined,
    },
  };

  const faqItems = [
    {
      q: "การเริ่มงานต้องมัดจำหรือไม่?",
      a: "โดยปกติจะต้องชำระค่าบริการเต็มจำนวนก่อนเริ่มดำเนินการ หรือเป็นไปตามเงื่อนไขที่ระบุในใบเสนอราคา",
    },
    {
      q: "หากบัญชีโฆษณาถูกระงับจะจัดการอย่างไร?",
      a: "เราจะใช้ความเชี่ยวชาญในการตรวจสอบและหาสาเหตุ หากเป็นความผิดพลาดเชิงเทคนิคจากทางเรา เรายินดีช่วยเหลือแก้ไขตามนโยบายการรับประกัน",
    },
    {
      q: "สามารถยกเลิกบริการระหว่างทางได้หรือไม่?",
      a: "ได้ แต่การคืนเงินจะเป็นไปตามสัดส่วนงานที่ยังไม่ได้ดำเนินการ และต้องแจ้งล่วงหน้าตามที่ระบุในข้อตกลง",
    },
  ];

  return (
    <div className="container-fluid py-5">
      {/* JSON‑LD */}
      <JsonLd data={pageLd} />

      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/" className="text-decoration-none text-muted">หน้าแรก</Link></li>
          <li className="breadcrumb-item active" aria-current="page">ข้อตกลงการใช้บริการ</li>
        </ol>
      </nav>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <article className="bg-white p-4 p-md-5 shadow-sm rounded">
            <h1 className="mb-4 text-primary fw-bold">ข้อตกลงและเงื่อนไขการใช้บริการ</h1>
            <p className="text-muted border-bottom pb-3">อัปเดตล่าสุด: {new Date().toLocaleDateString('th-TH')}</p>

            <div className="content-body mt-4">
              <section className="mb-5">
                <h2 className="fw-bold h4">1. การยอมรับข้อตกลง</h2>
                <p>
                  การเข้าใช้งานเว็บไซต์ {SITE_URL} และการรับบริการใดๆ จาก <strong>{brandName}</strong>
                  ถือว่าท่านได้รับทราบและยอมรับข้อตกลงและเงื่อนไขการใช้งานเหล่านี้โดยสมบูรณ์
                </p>
              </section>

              <section className="mb-5">
                <h2 className="fw-bold h4">2. ขอบเขตและรูปแบบการให้บริการ</h2>
                <p>เราให้บริการด้านการตลาดดิจิทัลและเครื่องมือส่งเสริมการขาย ดังนี้:</p>
                <ul>
                  <li>การวางแผนและจัดการโฆษณา Google Ads และ Facebook Ads</li>
                  <li>คอร์สเรียนออนไลน์เกี่ยวกับการทำการตลาดและการยิงแอด</li>
                  <li>บริการสนับสนุนด้านเทคนิคและการวัดผล (Conversion Tracking)</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="fw-bold h4">3. การโอนเงินและค่าธรรมเนียม</h2>
                <p>
                  ค่าบริการทั้งหมดต้องถูกชำระผ่านช่องทางที่กำหนดเท่านั้น การเริ่มงานจะเกิดขึ้นหลังจากได้รับการยืนยันการชำระเงินเรียบร้อยแล้ว
                  ในกรณีที่มีค่าธรรมเนียมเพิ่มเติมจากแพลตฟอร์มโฆษณา ผู้ใช้บริการเป็นผู้รับผิดชอบค่าใช้จ่ายนั้นตามจริง
                </p>
              </section>

              <section className="mb-5">
                <h2 className="fw-bold h4">4. ข้อจำกัดความรับผิดชอบ</h2>
                <div className="alert alert-warning">
                  <h3 className="h6 fw-bold mb-2">โปรดทราบ:</h3>
                  <p className="mb-0 small">
                    ผลลัพธ์ของโฆษณาขึ้นอยู่กับปัจจัยภายนอกหลายประการ (อัลกอริทึม, คู่แข่ง, สภาพตลาด)
                    เราไม่สามารถรับประกันยอดขายหรือกำไรที่แน่นอนได้ 100% แต่เราจะดำเนินการให้ดีที่สุดตามกลยุทธ์ที่วางไว้
                  </p>
                </div>
              </section>

              <section className="mb-5">
                <h2 className="fw-bold h4">5. การสงวนสิทธิ์และการเปลี่ยนแปลง</h2>
                <p>
                  เราขอสงวนสิทธิ์ในการปรับปรุงหรือแก้ไขข้อตกลงนี้ได้ตลอดเวลาโดยไม่จำเป็นต้องแจ้งให้ทราบล่วงหน้า
                  การใช้งานอย่างต่อเนื่องหลังการเปลี่ยนแปลงถือว่าท่านยอมรับข้อตกลงใหม่นั้น
                </p>
              </section>
            </div>

            {/* FAQ Section */}
            <FAQ items={faqItems} />
          </article>
        </div>
      </div>
    </div>
  );
}
