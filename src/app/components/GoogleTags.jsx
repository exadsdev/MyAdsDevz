"use client";

import Script from "next/script";

export default function GoogleTags() {
  const GA4 = process.env.NEXT_PUBLIC_GA4_ID;
  const ADS = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const GTM = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <>
      {/* --- Google Tag (gtag.js) for GA4 & Google Ads --- */}
      {(GA4 || ADS) && (
        <>
          <Script
            id="gtag-lib"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4 || ADS}`}
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              ${GA4 ? `gtag('config', '${GA4}', { send_page_view: true });` : ""}
              ${ADS ? `gtag('config', '${ADS}');` : ""}
              // Minimal Consent Mode v2 defaults (adjust to your policy/UX)
              gtag('consent', 'default', {
                'ad_storage': 'granted',
                'analytics_storage': 'granted',
                'ad_personalization': 'granted',
                'ad_user_data': 'granted'
              });
            `}
          </Script>
        </>
      )}

      {/* --- Google Tag Manager (Optional) --- */}
      {GTM && (
        <>
          <Script id="gtm-init" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM}');
            `}
          </Script>

          {/* GTM noscript for <body> (inserted by RootLayout) */}
        </>
      )}
    </>
  );
}

/**
 * Helper functions (optional) you can import and call anywhere on client side.
 * Example:
 * import { gaEvent, adsConversion } from "./GoogleTags";
 * gaEvent('video_play', { category:'Hero', label:'Intro' })
 * adsConversion(); // or adsConversion({ value: 1990, currency: 'THB' })
 */
export function gaEvent(action, params = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", action, params);
}

export function adsConversion({
  send_to = `${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}/${process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL || ""}`,
  value,
  currency = "THB",
  transaction_id
} = {}) {
  if (typeof window === "undefined") return;
  const payload = { send_to };
  if (value != null) payload.value = value;
  if (currency) payload.currency = currency;
  if (transaction_id) payload.transaction_id = transaction_id;
  window.gtag?.("event", "conversion", payload);
}
