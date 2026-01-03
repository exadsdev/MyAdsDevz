"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BRAND } from "../seo.config";

export default function Header() {
  const [open, setOpen] = useState(false);

  // ปิดเมนูเมื่อขยายจอเป็นเดสก์ท็อป
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (

     <>

    <header className="header">
      <div className="container-fluid navWrap">
        <Link href="/" className="brand" aria-label={BRAND}>
          <Image src="/images/logo.png" alt={BRAND} width={40} height={40} priority />
          <span>{BRAND}</span>
        </Link>

   
        <nav className="navLinks" aria-label="หลัก">
          <Link href="/reviews">รีวิว</Link>
          <Link href="/blog">บทความ</Link>
          <Link className="nav-link dropdown-toggle" href="Services" role="button" data-bs-toggle="dropdown" aria-expanded="false">  บริการ  </Link>
          <ul className="dropdown-menu">
            <li><Link className="dropdown-item" href="/services">บริการ</Link></li>
            <li><Link className="dropdown-item" href="/services/google-ads">Google Ads</Link></li>
            <li><Link className="dropdown-item" href="/services/facebook-ads">Facebook Ads</Link></li>
          </ul>

             <Link href="/videos">videos</Link>
          <Link href="/course">คอร์สเรียนยิงAds</Link>
                 <Link href="/toolfree">เครื่องมือฟรี</Link>
          <Link href="/contact" className="btn4">ติดต่อเรา</Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="navToggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(v => !v)}
        >
          {open ? "ปิดเมนู ✕" : "เมนู ☰"}
        </button>
      </div>

 
      {open && (
        <div className="drawer" role="dialog" aria-modal="true" id="mobile-menu">
          <div className="drawerHeader container-fluid">
            <strong>เมนู</strong>
            <button className="navToggle" onClick={() => setOpen(false)} aria-label="ปิดเมนู">✕</button>
          </div>
          <div className="drawerLinks container-fluid" onClick={() => setOpen(false)}>
          <Link href="/">หน้าแรก</Link>
       
       
          <Link className="nav-link dropdown-toggle" href="Services" role="button" data-bs-toggle="dropdown" aria-expanded="false">
           บริการ
          </Link>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="/reviews">reviews</a></li>
            <li><a className="dropdown-item" href="/services">บริการ</a></li>
            <li><a className="dropdown-item" href="/services/google-ads">Google Ads</a></li>
            <li><a className="dropdown-item" href="/services/facebook-ads">Facebook Ads</a></li>
          </ul>
          <Link href="/videos">videos</Link>
          <Link href="/course">คอร์สเรียนยิงAds</Link>
          <Link href="/toolfree">ดาวน์โหลดเครื่องมือฟรี</Link>
            <a href="/contact" className="btn4">ติดต่อเรา</a>
          </div>
        </div>
      )}



    </header>

 <div
        className="line"
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          zIndex: 50,
          filter: "drop-shadow(0 6px 16px rgba(0,0,0,.25))",
        }}
      >
        <a
          href="https://lin.ee/vjeDuCZ"
          aria-label="แชท LINE myads.dev"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image src="/images/line.png" alt="LINE" width={56} height={56} priority />
        </a>
      </div>
   
    
    </>
  );
}
