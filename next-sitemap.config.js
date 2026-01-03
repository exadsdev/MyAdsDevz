/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://myad-dev.com",
  generateRobotsTxt: true, // ✅ ให้สร้าง robots.txt ด้วย
  sitemapSize: 5000, // แบ่งไฟล์อัตโนมัติถ้าเกิน 5000 URLs
  changefreq: "daily",
  priority: 0.7,
  exclude: [
    "/admin",
    "/private",
    "/api/*",
    "/_next/*",
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/private", "/api", "/_next"],
      },
    ],
    additionalSitemaps: [
      // ✅ คุณสามารถชี้ sitemap อื่น ๆ ที่สร้างแบบ dynamic ได้ เช่น /sitemap.xml จาก route
      "https://myad-dev.com/sitemap.xml",
    ],
  },
};
