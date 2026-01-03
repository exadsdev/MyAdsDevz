// app/components/Secsions.jsx
import React from "react";
import Image from "next/image";

export default function Secsions() {
  return (
    <>
      <section className="container-fluid mt-4" aria-labelledby="services-title">
        <div className="text-center mt-3">
          <h2 id="services-title" className="h3">
            บริการรับจ้างทำการตลาดออนไลน์และดูแลโฆษณา
          </h2>
            <Image
                src="/images/dark.jpg"
                alt="ตัวอย่างงานโฆษณาออนไลน์ของทีม myads.dev"
                width={1200}
                height={675}
                sizes="(max-width: 768px) 100vw, 1200px"
                style={{ width: "100%", height: "auto" }}
                priority
              />
          <p className="text-muted">
            แพ็กเกจเริ่มต้นให้ทดลองและแพ็กเกจรายเดือนสำหรับ Google Ads / Meta(Facebook) Ads
          </p>
        </div>

        <div className="row row-cols-1 row-cols-md-3 mb-3 text-center mt-4">
          <div className="col">
            <article className="card mb-4 rounded-3 shadow-sm border-success h-100">
              <div className="card-header py-3 text-bg-success border-success">
                <h3 className="my-0 fw-normal h5">โปรโมชั่นทดลองยิง 7 วัน</h3>
              </div>
              <div className="card-body d-flex flex-column">
                <p className="card-title pricing-card-title display-6 mb-3">3,500฿</p>
                <ul className="list-unstyled mt-2 mb-4 text-start mx-auto" style={{ maxWidth: 320 }}>
                  <li>ผลลัพธ์ชัดเจน</li>
                  <li>ทำงานตามแผนและรายงานผลเป็นรอบ</li>
                  <li>ชำระเงินด้วยบัตรเครดิตได้</li>
                  <li>รายงานผลทุกวัน เวลา 10.00 น.</li>
                </ul>

              
                <a
                  href="https://lin.ee/UXiQ7IX"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="เริ่มต้นแพ็กเกจทดลองยิง 7 วัน ผ่าน LINE"
                  className="w-100 btn btn-lg btn-success mt-auto"
                >
                  Get started
                </a>
              </div>
            </article>
          </div>

          <div className="col">
            <article className="card mb-4 rounded-3 shadow-sm border-info h-100">
              <div className="card-header py-3 text-bg-info border-info">
                <h3 className="my-0 fw-normal h5">สัมผัสประสบการณ์ยิงใหม่ 15 วัน</h3>
              </div>
              <div className="card-body d-flex flex-column">
                <p className="card-title pricing-card-title display-6 mb-3">6,000฿</p>
                <ul className="list-unstyled mt-2 mb-4 text-start mx-auto" style={{ maxWidth: 320 }}>
                  <li>ผลลัพธ์ชัดเจน</li>
                  <li>ทำงานตามแผนและรายงานผลเป็นรอบ</li>
                  <li>ชำระเงินด้วยบัตรเครดิตได้</li>
                  <li>รายงานผลทุกวัน เวลา 10.00 น.</li>
                </ul>

                <a
                  href="https://lin.ee/UXiQ7IX"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="เริ่มต้นแพ็กเกจ 15 วัน ผ่าน LINE"
                  className="w-100 btn btn-lg btn-info mt-auto"
                >
                  Get started
                </a>
              </div>
            </article>
          </div>

          <div className="col">
            <article className="card mb-4 rounded-3 shadow-sm border-primary h-100">
              <div className="card-header py-3 text-bg-primary border-primary">
                <h3 className="my-0 fw-normal h5">บริการรับทำโฆษณา 1 เดือน</h3>
              </div>
              <div className="card-body d-flex flex-column">
                <p className="card-title pricing-card-title display-6 mb-3">9,900฿</p>
                <ul className="list-unstyled mt-2 mb-4 text-start mx-auto" style={{ maxWidth: 320 }}>
                  <li>เราดูแลทั้งหมดตลอด 30 วัน</li>
                  <li>เน้นการวัดผลและปรับปรุงต่อเนื่อง</li>
                  <li>รายงานผลทุกวัน เวลา 10.00 น.</li>
                  <li>ใช้บัตรของลูกค้าเองได้</li>
                </ul>

                <a
                  href="https://lin.ee/UXiQ7IX"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="เริ่มต้นแพ็กเกจรายเดือน ผ่าน LINE"
                  className="w-100 btn btn-lg btn-primary mt-auto"
                >
                  Get started
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="container-fluid" id="facebook" aria-labelledby="ads-intro-title">
        <div className="text-center">
          <h2 id="ads-intro-title" className="h3">
            บริการรับทำโฆษณาออนไลน์ — Facebook &amp; Google Ads
          </h2>

          <div className="ads-dark mt-3">
            <figure>
              <Image
                src="/images/review.jpg"
                alt="ตัวอย่างงานโฆษณาออนไลน์ของทีม myads.dev"
                width={1200}
                height={675}
                sizes="(max-width: 768px) 100vw, 1200px"
                style={{ width: "100%", height: "auto" }}
                priority
              />
              <figcaption className="text-muted small mt-1">
                ตัวอย่างแดชบอร์ดและผลลัพธ์จากการรันโฆษณา
              </figcaption>
            </figure>
          </div>
        </div>

        <article className="mt-4">
          <h3 className="h4">บริการรับทำโฆษณา Facebook Ads</h3>
          <p>
            ทำโฆษณาโดยทีมงานมืออาชีพ คิดกลยุทธ์ สร้างแคมเปญ และวัดผลละเอียด
            แพ็กเกจเพียงเดือนละ <strong>9,900 บาท</strong> ไม่มีค่าใช้จ่ายแอบแฝง มีรีวิวลูกค้าจริง
          </p>
          <p>
            Facebook ปรับอัลกอริทึมอย่างสม่ำเสมอ ส่งผลต่อการมองเห็นและประสิทธิภาพ
            เราจึงใช้โครงสร้างแคมเปญที่ยืดหยุ่น พร้อมทดสอบครีเอทีฟ/ออดิเอนซ์ต่อเนื่อง
          </p>
          <p>
            ปฏิบัติตามนโยบายความเป็นส่วนตัว และใช้การติดตามผลแบบ Conversion API/Enhanced Conversions เพื่อวัดผลอย่างแม่นยำ
          </p>

          <div className="imge mt-3">
            <Image
              src="/images/facebook001.jpg"
              width={1200}
              height={675}
              alt="ตัวอย่างครีเอทีฟ Facebook Ads"
              sizes="(max-width: 768px) 100vw, 1200px"
              style={{ width: "100%", height: "auto" }}
            />
          </div>

          <div className="text-center my-3">
            <h4 className="h6">ตัวอย่างที่แสดงเป็นเพียงบางส่วน</h4>
          </div>

          <h4 className="h5">ผลงาน Facebook (บางส่วน)</h4>
          <div className="image-gallery" role="list" aria-label="แกลเลอรีผลงาน Facebook">
            {[
              "h0102.webp","h0103.webp","h0104.webp","h0105.webp","h0106.webp","h0107.webp",
              "h0108.webp","h0109.webp","h0110.webp","h0111.webp","h0112.webp","h0113.webp",
            ].map((file) => (
              <figure className="gallery-item" role="listitem" key={file}>
                <Image
                  src={`/img/${file}`}
                  alt={`ผลงาน Facebook Ads: ${file.replace(".webp", "")}`}
                  width={900}
                  height={900}
                  sizes="(max-width: 768px) 100vw, 900px"
                  style={{ width: "100%", height: "auto" }}
                  loading="lazy"
                />
              </figure>
            ))}
          </div>
        </article>

        <hr className="my-4" />

        <article className="google" id="google" aria-labelledby="google-title">
          <h3 id="google-title" className="h4">บริการทำโฆษณา Google และ SEO</h3>
          <p>
            เพิ่มการมองเห็นผ่าน Search/Display/Video ด้วยโครงสร้างคำค้นที่ตอบโจทย์เจตนาค้นหา และหน้าลงแลนดิงที่โหลดไว
          </p>
          <p>
            เราจัดทำ Conversion Tracking, UTM และแดชบอร์ดสรุป เห็นแหล่งที่มา/ROAS ชัดเจน พร้อมแผนปรับปรุงจากข้อมูลจริง
          </p>

          <figure className="mt-3">
            <Image
              src="/images/reviews.jpg"
              width={1200}
              height={675}
              alt="ตัวอย่างผลลัพธ์จาก Google Ads/SEO"
              sizes="(max-width: 768px) 100vw, 1200px"
              style={{ width: "100%", height: "auto" }}
            />
          </figure>

          <div className="image-gallery mt-3" role="list" aria-label="แกลเลอรีผลงาน Google">
            {Array.from({ length: 20 }, (_, i) => i + 2).map((n) => (
              <figure className="gallery-item" role="listitem" key={n}>
                <Image
                  src={`/img-google/${n}.webp`}
                  alt={`ผลงาน Google Ads: ${n}`}
                  width={900}
                  height={900}
                  sizes="(max-width: 768px) 100vw, 900px"
                  style={{ width: "100%", height: "auto" }}
                  loading="lazy"
                />
              </figure>
            ))}
          </div>
        </article>
      </section>

      <hr className="my-4" />

      {/* SECTION: Reviews */}
      <section className="container-fluid" id="reviews" aria-labelledby="reviews-title">
        <h2 id="reviews-title" className="h4">รีวิวลูกค้าจริง</h2>
        <div className="image-gallery" role="list" aria-label="แกลเลอรีรีวิวลูกค้า">
          {[
            "1.webp","2.webp","3.webp","01.webp","02.webp","03.webp",
            "game-img-1.jpg","game-img-2.jpg","game-img-3.jpg","game-img-4.jpg","game-img-5.jpg","game-img-6.jpg",
          ].map((r) => (
            <figure className="gallery-item" role="listitem" key={r}>
              <Image
                src={`/review/${r}`}
                width={900}
                height={900}
                alt={`รีวิวลูกค้า ${r.replace(".webp", "")}`}
                sizes="(max-width: 768px) 100vw, 900px"
                style={{ width: "100%", height: "auto" }}
                loading="lazy"
              />
            </figure>
          ))}
        </div>
      </section>

      <hr className="my-4" />

      {/* SECTION: Contact */}
      <section className="container-fluid mt-4" id="contact" aria-labelledby="contact-title">
        <h2 id="contact-title" className="visually-hidden">ติดต่อทีมงาน</h2>
        <figure className="contact mt-3">
          <Image
            src="/images/contact.webp"
            width={1200}
            height={675}
            alt="ติดต่อเรา myads.dev"
            sizes="(max-width: 768px) 100vw, 1200px"
            style={{ width: "100%", height: "auto" }}
          />
        </figure>

        {/* external link styled as button */}
        <div className="text-center mt-2">
          <a
            href="https://lin.ee/Lj4tBMs"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="เพิ่มเพื่อน LINE เพื่อคุยกับทีมงาน"
            className="btn4"
          >
            🌈 ไลน์ ติดต่อเรา
          </a>
        </div>
      </section>
    </>
  );
}
