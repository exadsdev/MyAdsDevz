// src/app/robots.txt/route.js
export async function GET() {
  const body = [
    "User-Agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /api",
    "Disallow: /private",
    "Disallow: /_next/static/",
    "Disallow: /_next/image/",
    "",
    `Sitemap: https://myad-dev.com/sitemap.xml`,
  ].join("\n");

  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
