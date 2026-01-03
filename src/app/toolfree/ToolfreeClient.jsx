"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { SITE } from "@/app/seo.config";

const site = process.env.NEXT_PUBLIC_SITE_URL || SITE;

// ตั้งโดเมนดาวน์โหลดให้ “ถูกต้องพร้อมโปรโตคอล”
const DOWNLOAD_HOST = (
  process.env.NEXT_PUBLIC_DOWNLOAD_HOST || "https://apipost.myad-dev.com"
).replace(/\/+$/, "");

const USE_LOCAL = false;

function buildCandidates(filename) {
  if (USE_LOCAL) {
    return [`/${filename}`];
  }
  return [`${DOWNLOAD_HOST}/${filename}`, `${DOWNLOAD_HOST}/${filename}`];
}

async function triggerDownload(urls) {
  const first = urls[0];
  if (!first) return false;
  window.location.assign(first);
  return true;
}

export default function ToolfreeClient() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [downloadType, setDownloadType] = useState(null);

  const files = useMemo(
    () => ({
      facebook: buildCandidates("facebook.zip"),
      google: buildCandidates("google.zip"),
    }),
    []
  );

  const openModal = (type) => {
    setDownloadType(type);
    setTimeLeft(30);
    setModalIsOpen(true);
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setDownloadType(null);
    document.body.classList.remove("modal-open");
  };

  useEffect(() => {
    if (!modalIsOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [modalIsOpen]);

  useEffect(() => {
    if (timeLeft !== 0 || !downloadType) return;
    const ok = triggerDownload(files[downloadType] || []);
    if (!ok) alert("ไม่พบ URL ดาวน์โหลด");
    closeModal();
  }, [timeLeft, downloadType, files]);

  return (
    <>
      {/* วิดีโอแนะนำการใช้งาน YouTube */}
      <section className="py-5">
        <div className="container-fluid text-center">
          <h2 className="h3 mb-4">แนะนำวิธีใช้งานเซล เพจ ฟรี</h2>
          <div className="ratio ratio-16x9 mx-auto" style={{ maxWidth: "800px" }}>
            <iframe
              src="https://www.youtube.com/embed/GnTiTy7t3pM?si=pg3M14scrk1dH0nL"
              title="แนะนำวิธีใช้งานเซลเพจ MyAd-Dev"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* HERO: เซลเพจใช้งานฟรี ไม่ต้องดาวน์โหลด */}
      <section className="py-5 bg-light border-bottom">
        <div className="container-fluid">
          <div className="row align-items-center gy-4">
            <div className="col-lg-6 text-lg-start text-center">
              <span className="badge bg-success-subtle text-success mb-2 px-3 py-2">
                ใช้งานฟรี • ไม่ต้องลงปลั๊กอิน ไม่ต้องติดตั้ง
              </span>
              <h1 className="h2 fw-bold mb-3">
                เซลเพจสำหรับยิงแอด Facebook & Google
                <br />
                <span className="text-primary">
                  ใช้งานฟรีบนระบบของเรา ไม่ต้องดาวน์โหลดไฟล์
                </span>
              </h1>
              <p className="text-muted mb-3">
                แค่มีแอดเคาท์โฆษณา ก็สามารถส่งลูกค้าเข้าเซลเพจได้ทันที
                เหมาะสำหรับธุรกิจที่ต้องการทดสอบตลาดก่อนทำเว็บจริง
                หน้าโหลดไว รองรับมือถือ และออกแบบมาเพื่อเน้น Conversion
                โดยเฉพาะ
              </p>

              <ul className="list-unstyled text-muted small mb-4">
                <li>• โครงสร้างหน้าเซลเพจออกแบบมาเพื่อรองรับแคมเปญโฆษณาและการวัดผล</li>
                <li>• รองรับทั้ง Facebook Ads และ Google Ads</li>
                <li>• ไม่ต้องยุ่งกับโฮสติ้งหรือโดเมน ใช้ลิงก์พร้อมยิงได้เลย</li>
              </ul>

              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-2">
                <a
                  href="https://landing-page.myad-dev.com/"
                  className="btn btn-primary btn-lg px-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  เริ่มใช้งานเซลเพจฟรี
                </a>
                <a
                  href="/services"
                  className="btn btn-outline-secondary btn-lg px-4"
                >
                  ให้ทีมงานช่วยวางแผนโฆษณา
                </a>
              </div>

              <p className="text-muted small mt-3">
                * เซลเพจนี้โฮสต์บนเซิร์ฟเวอร์ของ {site} สามารถเปลี่ยนข้อความ
                และลิงก์ติดต่อทีมงานได้ตามต้องการ
              </p>
            </div>

            <div className="col-lg-6 text-center">
              <div className="card shadow-sm border-0 mx-auto">
                <Image
                  src="/img/toolfre.webp"
                  alt="ตัวอย่างหน้าเซลเพจสำหรับยิงแอด Facebook และ Google"
                  width={900}
                  height={600}
                  className="img-fluid rounded-top"
                  priority
                />
                <div className="card-body">
                  <p className="card-text text-muted mb-0">
                    ตัวอย่างหน้าเซลเพจที่พร้อมให้คุณนำลิงก์ไปยิงแอดได้ทันที
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facebook Download */}
      <section className="text-center py-5">
        <div className="container-fluid">
          <h2 className="h4 mb-2">ดาวน์โหลดไฟล์ Landing Page สำหรับ Facebook Ads</h2>
          <p className="text-muted mb-4">
            สำหรับคนที่ต้องการนำไฟล์ไปแก้ไขต่อบนโฮสติ้งของตัวเอง
            (รองรับการอัปขึ้นโฮสทั่วไป / ใช้เป็นหน้ารองรับจากแคมเปญยิงแอด)
          </p>

          <div className="row row-cols-1 mx-auto row-cols-md-2 g-3">
            <div className="col mx-auto">
              <div className="card shadow-sm h-100">
                <Image
                  src="/images/ldfb.jpg"
                  width={500}
                  height={500}
                  alt="ตัวอย่าง Landing Page สำหรับ Facebook Ads"
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">
                    ไฟล์เทมเพลต Landing Page Facebook
                  </h5>
                  <p className="card-text text-muted">
                    โครงสร้างหน้าออกแบบให้เน้นลงทะเบียน / ทักแชต / แอดไลน์
                    เหมาะสำหรับแคมเปญ Conversion และแคมเปญข้อความ
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              className="btn btn-outline-primary btn-lg px-4"
              onClick={() => openModal("facebook")}
              aria-label="ดาวน์โหลดไฟล์ Landing Page สำหรับ Facebook Ads"
            >
              ดาวน์โหลดไฟล์ Facebook Landing Page
            </button>

            <div className="mt-2">
              <a
                href={files.facebook[0]}
                rel="noopener noreferrer"
                className="small text-decoration-underline"
              >
                ดาวน์โหลดตรง (ลิงก์สำรอง)
              </a>
            </div>
          </div>
        </div>
      </section>

      <hr className="my-0" />

      {/* Google Download */}
      <section className="text-center py-5">
        <div className="container-fluid">
          <h2 className="h4 mb-2">ดาวน์โหลดไฟล์ Landing Page สำหรับ Google Ads</h2>
          <p className="text-muted mb-4">
            เทมเพลตสำหรับสาย Search / Performance Max ที่ต้องการหน้าโหลดไว
            และสื่อสารจุดขายชัดเจน ใส่ฟอร์มเก็บลีดหรือลิงก์ไปยังไลน์ / แชตได้
          </p>

          <div className="row row-cols-1 mx-auto row-cols-md-2 g-3">
            <div className="col mx-auto">
              <div className="card shadow-sm h-100">
                <Image
                  src="/images/ldgg.jpg"
                  width={500}
                  height={500}
                  alt="ตัวอย่าง Landing Page สำหรับ Google Ads"
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">
                    ไฟล์เทมเพลต Landing Page Google
                  </h5>
                  <p className="card-text text-muted">
                    โฟกัสความเร็วในการโหลดหน้าและความชัดเจนของ Call-to-Action
                    ลดการเด้งออก ช่วยให้แคมเปญได้คุณภาพทราฟฟิกที่ดีกว่า
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              className="btn btn-outline-success btn-lg px-4 d-inline-flex align-items-center justify-content-center"
              onClick={() => openModal("google")}
              aria-label="ดาวน์โหลดไฟล์ Landing Page สำหรับ Google Ads"
            >
              <Image
                src="/images/ldgg.jpg"
                width={24}
                height={24}
                alt=""
                style={{ marginRight: 8 }}
                unoptimized
              />
              ดาวน์โหลดไฟล์ Google Landing Page
            </button>

            <div className="mt-2">
              <a
                href={files.google[0]}
                rel="noopener noreferrer"
                className="small text-decoration-underline"
              >
                ดาวน์โหลดตรง (ลิงก์สำรอง)
              </a>
            </div>
          </div>
        </div>
      </section>

      {modalIsOpen && (
        <div
          className="modal fade show"
          role="dialog"
          aria-modal="true"
          aria-labelledby="downloadModalTitle"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 id="downloadModalTitle" className="modal-title">
                  กำลังเตรียมไฟล์ดาวน์โหลด...
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="ปิดหน้าต่าง"
                  onClick={closeModal}
                />
              </div>
              <div className="modal-body text-center">
                <h2 className="display-6">โปรดรอ {timeLeft} วินาที</h2>
                <p className="text-muted mb-0">
                  ระบบจะเริ่มดาวน์โหลดไฟล์โดยอัตโนมัติ
                </p>
                {!USE_LOCAL && (
                  <p className="small text-muted mt-2">
                    ไฟล์จะถูกดึงจาก <code>{DOWNLOAD_HOST}</code>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
