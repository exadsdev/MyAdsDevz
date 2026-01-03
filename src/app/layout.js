import "./globals.css";
import "./home.css";
import "./body.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import Script from "next/script";
import JsonLd from "./components/JsonLd";
import GoogleTags from "./components/GoogleTags";

import { SITE, BRAND, DEFAULT_OG, KEYWORDS, LOGO_URL, CONTACT_PHONE, CONTACT_EMAIL, SAME_AS_URLS } from "./seo.config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE;

// Ensure full URLs for images
const OG_IMAGE = DEFAULT_OG.startsWith("http") ? DEFAULT_OG : `${SITE_URL}${DEFAULT_OG}`;
const LOGO_FULL = LOGO_URL.startsWith("http") ? LOGO_URL : `${SITE_URL}${LOGO_URL}`;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  title: {
    default: `${BRAND} | บริการโฆษณาออนไลน์ครบวงจร`,
    template: `%s | ${BRAND}`,
  },
  applicationName: BRAND,
  publisher: BRAND,
  creator: BRAND,
  description: `${BRAND} บริการโฆษณาออนไลน์ครบวงจรสำหรับ Google Ads และ Facebook/Meta Ads เน้นโครงสร้างแคมเปญ การวัดผล และรายงานที่ตรวจสอบได้`,
  keywords: KEYWORDS,
  alternates: { canonical: SITE_URL },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: BRAND,
    title: `${BRAND} | บริการโฆษณาออนไลน์ครบวงจร`,
    description: "บริการโฆษณาออนไลน์ Google Ads และ Facebook/Meta Ads พร้อมโครงสร้างการวัดผลและรายงานที่ชัดเจน",
    images: [
      {
        url: OG_IMAGE,
        secureUrl: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${BRAND} - บริการโฆษณาออนไลน์`,
        type: "image/jpeg",
      },
    ],
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    site: "@myadsdev",
    creator: "@myadsdev",
    title: `${BRAND} | บริการโฆษณาออนไลน์`,
    description: "บริการทำโฆษณาออนไลน์ครบวงจร Google & Facebook Ads",
    images: [OG_IMAGE],
  },
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "" },
  category: "Marketing",
};

// JSON‑LD definitions
const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: BRAND,
  alternateName: ["My Ads Dev", "มายแอดเดฟ", "MyAds Dev"],
  url: SITE_URL,
  description: "บริการโฆษณาออนไลน์ครบวงจรสำหรับ Google Ads และ Facebook/Meta Ads พร้อมแนวทางการวัดผลและรายงาน",
  inLanguage: "th-TH",
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: BRAND,
  alternateName: ["My Ads Dev", "มายแอดเดฟ"],
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    "@id": `${SITE_URL}/#logo`,
    url: LOGO_FULL,
    contentUrl: LOGO_FULL,
    width: 512,
    height: 512,
    caption: BRAND,
  },
  image: { "@type": "ImageObject", url: OG_IMAGE, width: 1200, height: 630 },
  description: "บริการโฆษณาออนไลน์ครบวงจรสำหรับ Google Ads และ Facebook/Meta Ads พร้อมแนวทางการวัดผลและรายงาน",
  sameAs: [
    "https://www.facebook.com/myadsdev",
    "https://line.me/ti/p/@myadsdev",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    url: `${SITE_URL}/contact`,
    availableLanguage: ["Thai", "English"],
  },
};

const siteNavigationLd = {
  "@context": "https://schema.org",
  "@type": "SiteNavigationElement",
  "@id": `${SITE_URL}/#navigation`,
  name: "Main Navigation",
  hasPart: [
    { "@type": "SiteNavigationElement", name: "หน้าแรก", url: SITE_URL },
    { "@type": "SiteNavigationElement", name: "บริการ", url: `${SITE_URL}/services` },
    { "@type": "SiteNavigationElement", name: "Google Ads", url: `${SITE_URL}/services/google-ads` },
    { "@type": "SiteNavigationElement", name: "Facebook Ads", url: `${SITE_URL}/services/facebook-ads` },
    { "@type": "SiteNavigationElement", name: "รีวิวลูกค้า", url: `${SITE_URL}/reviews` },
    { "@type": "SiteNavigationElement", name: "บทความ", url: `${SITE_URL}/blog` },
    { "@type": "SiteNavigationElement", name: "วิดีโอ", url: `${SITE_URL}/videos` },
    { "@type": "SiteNavigationElement", name: "คอร์สเรียน", url: `${SITE_URL}/course` },
    { "@type": "SiteNavigationElement", name: "คำถามที่พบบ่อย", url: `${SITE_URL}/faq` },
    { "@type": "SiteNavigationElement", name: "ติดต่อเรา", url: `${SITE_URL}/contact` },
  ],
};

const mainImageLd = {
  "@context": "https://schema.org",
  "@type": "ImageObject",
  "@id": `${SITE_URL}/#primaryimage`,
  url: OG_IMAGE,
  contentUrl: OG_IMAGE,
  width: 1200,
  height: 630,
  caption: `${BRAND} - บริการโฆษณาออนไลน์ครบวงจร`,
};

export default function RootLayout({ children }) {
  const GTM = process.env.NEXT_PUBLIC_GTM_ID;
  return (
    <html lang="th">
      <body>
        {GTM && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <JsonLd json={websiteLd} />
        <JsonLd json={organizationLd} />
        <JsonLd json={siteNavigationLd} />
        <JsonLd json={mainImageLd} />
        <GoogleTags />
        {/* Critical CSS already imported via globals.css */}
        <link rel="stylesheet" href="/home.css" media="print" />
        <link rel="stylesheet" href="/body.css" media="print" />
        <main className="container">
          <Header />
          {children}
        </main>
        <Footer />
        <Script async src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" />
      </body>
    </html>
  );
}