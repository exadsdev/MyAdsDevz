import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    const expected = process.env.GOOGLE_COURSE_PASSWORD;
    const expectedUsernameEnv = process.env.GOOGLE_COURSE_USERNAME;

    if (!expected) {
      return NextResponse.json({ ok: false, message: 'Server not configured' }, { status: 500 });
    }

    if (typeof username !== 'string' || username.trim() === '') {
      return NextResponse.json({ ok: false, message: 'กรุณากรอกชื่อผู้ใช้' }, { status: 400 });
    }

    // If an explicit username is provided in env, use it; otherwise fall back to 'User'+password pattern
    const expectedUsername = typeof expectedUsernameEnv === 'string' && expectedUsernameEnv.trim() !== ''
      ? expectedUsernameEnv
      : `User${expected}`;

    if (password === expected && username === expectedUsername) {
      const response = NextResponse.json({ ok: true, message: 'Enrolled', username });
      const maxAge = 60 * 60 * 24 * 30; // 30 days
      const safeUser = encodeURIComponent(username);
      response.headers.set('Set-Cookie', `google_course_auth=${safeUser}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`);
      return response;
    }
    return NextResponse.json({ ok: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ ok: false, message: 'Invalid request' }, { status: 400 });
  }
}

// Notes:
// - Set environment variable `GOOGLE_COURSE_PASSWORD` on the server (e.g., in Vercel or your .env.local).
// - The route sets an HttpOnly cookie `google_course_auth=1` on successful enrollment.
