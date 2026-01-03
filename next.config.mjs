// next.config.mjs
const isProd = process.env.NODE_ENV === 'production';

// หากโปรดักชันรันใต้ซับพาธ เช่น https://domain.com/tool
// ให้ตั้งค่า NEXT_PUBLIC_BASE_PATH=/tool ก่อน build/deploy
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ถ้าใช้ Static Export ให้เปิดบรรทัดนี้
  // output: 'export',

  // ถ้ารันใต้ซับพาธ ให้ใช้ basePath/assetPrefix
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,

  // ทำให้รูปแสดงได้แม้ไม่มี image optimizer ฝั่งเซิร์ฟเวอร์
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
