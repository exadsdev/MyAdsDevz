// src/app/api/admin/login/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"; // ตั้งเองใน .env ได้

  if (!password || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: "invalid_password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  // ตั้งคุกกี้ admin=1 (7 วัน)
  res.cookies.set({
    name: "admin",
    value: "1",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
