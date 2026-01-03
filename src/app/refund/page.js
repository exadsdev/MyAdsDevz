import { SITE, BRAND } from "../seo.config";
import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import FAQ from "@/app/components/FAQ";

export const metadata = {
  title: `นโยบายการคืนเงินและการรับประกัน | ${BRAND}`,
  description: "รายละเอียดเงื่อนไขการคืนเงิน การรับประกันบัญชีโฆษณา และสินค้าดิจิทัล",
  alternates: { canonical: `${SITE}/refund` },
};

export default function RefundPage() {
  // JSON‑LD for WebPage with Organization publisher
  const pageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `นโยบายการคืนเงินและการรับประกัน | ${BRAND}`,
    "url": `${SITE}/refund`,
    "description": "รายละเอียดเงื่อนไขการคืนเงิน การรับประกันบัญชีโฆษณา และสินค้าดิจิทัล",
    "publisher": {
      "@type": "Organization",
      "name": typeof BRAND === "string" ? BRAND : BRAND?.name || "MyAdsDev",
      "url": SITE,
    },
  };

  const faqItems = [
    {
      q: "ขอคืนเงินได้ภายในกี่วันหลังชำระเงิน?",
      a: "หากยังไม่ได้เริ่มดำเนินการใด ๆ สามารถขอคืนเงินเต็มจำนวนได้ภายใน 24 ชั่วโมงหลังชำระเงิน",
    },
    {
      q: "สินค้าดิจิทัลหรือคอร์สเรียนคืนเงินได้หรือไม่?",
      a: "สินค้าดิจิทัลและคอร์สเรียนที่ได้ทำการดาวน์โหลดหรือเข้าถึงแล้วไม่สามารถคืนเงินได้ ยกเว้นกรณีไฟล์มีปัญหา",
    },
    {
      q: "ขั้นตอนการเคลมบัญชีโฆษณาคืออะไร?",
      a: "ติดต่อทีมงานผ่าน LINE Official พร้อมแนบหลักฐานการโอนเงิน ทีมงานจะตรวจสอบและให้บัญชีใหม่ภายใน 24 ชม. (หากเป็นกรณี Login ไม่ได้หรือ Pre‑ban)",
    },
  ];

  return (
    <div className="container-fluid py-5">
      {/* Inject JSON‑LD */}
      <JsonLd data={pageLd} />

      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/" className="text-decoration-none text-muted">หน้าแรก</Link></li>
          <li className="breadcrumb-item active" aria-current="page">นโยบายการคืนเงิน/ประกัน</li>
        </ol>
      </nav>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <article className="bg-white p-4 p-md-5 shadow-sm rounded">
            <h1 className="mb-4 text-primary fw-bold">นโยบายการคืนเงินและการรับประกัน</h1>

            <div className="content-body mt-4">
              {/* Section 1 – Refund Policy */}
              <section className="mb-5">
                <h2 className="fw-bold text-dark border-start border-4 border-primary ps-3 mb-3">1. นโยบายการคืนเงิน (Refund Policy)</h2>
                <h5 className="fw-bold mt-3">บริการทำโฆษณา</h5>
                <ul>
                  <li>หากเรายังไม่ได้เริ่มดำเนินการใดๆ ท่านสามารถขอคืนเงินได้เต็มจำนวนภายใน 24 ชั่วโมงหลังชำระเงิน</li>
                  <li>หากเริ่มดำเนินการติดตั้งหรือยิงแอดไปแล้ว ขอสงวนสิทธิ์ในการไม่คืนเงินทุกกรณี</li>
                </ul>
                <h5 className="fw-bold mt-3">คอร์สเรียนออนไลน์ / สินค้าดิจิทัล</h5>
                <ul>
                  <li>เนื่องจากเป็นสินค้าที่สามารถคัดลอกได้ <strong>สินค้าประเภทคอร์สเรียนและไฟล์ดาวน์โหลด ซื้อแล้วไม่รับคืนเงิน</strong></li>
                  <li>หากไฟล์มีปัญหา หรือดูไม่ได้ ทางเรายินดีแก้ไขให้จนกว่าจะใช้งานได้</li>
                </ul>
              </section>

              {/* Section 2 – Warranty Policy */}
              <section className="mb-5">
                <h2 className="fw-bold text-dark border-start border-4 border-success ps-3 mb-3">2. นโยบายการรับประกัน (Warranty Policy)</h2>
                <p>สำหรับบริการจำหน่ายบัญชีโฆษณา (Ad Accounts) เรามีการรับประกันดังนี้:</p>
                <div className="card bg-light border-0 mb-3">
                  <div className="card-body">
                    <h5 className="card-title fw-bold">เงื่อนไขการเคลมบัญชี</h5>
                    <ul>
                      <li>รับประกันกรณี <strong>Login ไม่ได้</strong> หรือ <strong>บัญชีแดงก่อนยิง (Pre‑ban)</strong> ภายใน 24 ชม. หลังส่งมอบ</li>
                      <li>หากยิงแอดไปแล้ว หรือมีการเติมเงินเข้าบัญชีแล้ว ถือว่าสิ้นสุดการรับประกัน</li>
                      <li>กรณีทำผิดกฎร้ายแรงของแพลตฟอร์มด้วยตนเอง จะไม่อยู่ในเงื่อนไขการรับประกัน</li>
                    </ul>
                  </div>
                </div>
                <p className="small text-muted">* การเคลมจะเป็นการเปลี่ยนบัญชีใหม่ให้ทดแทน ไม่ใช่การคืนเงิน</p>
              </section>

              {/* Section 3 – ขั้นตอนการขอคืนเงิน/เคลม */}
              <section className="mb-4">
                <h2 className="fw-bold">3. ขั้นตอนการขอคืนเงิน/เคลมประกัน</h2>
                <p>โปรดติดต่อทีมงานผ่านทาง LINE Official พร้อมแนบหลักฐานการโอนเงินและรายละเอียดปัญหา ทีมงานจะดำเนินการตรวจสอบภายใน 1‑3 วันทำการ</p>
                <div className="mt-3">
                  <a href="https://lin.ee/OuyclyD" className="btn btn-success rounded-pill px-4">ติดต่อแจ้งปัญหา</a>
                </div>
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