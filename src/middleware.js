import { NextResponse } from "next/server";
import { TOKEN_COOKIE, verifyToken } from "@/lib/simpleAuth";

export const config = {
  matcher: ["/admin/:path*"],
};

export async function middleware(request) {
  const url = new URL(request.url);
  const cookie = getCookie(request.headers.get("cookie") || "", TOKEN_COOKIE);
  const SECRET = process.env.AUTH_SECRET || "change_me_now";

  if (!cookie) {
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(url.pathname + url.search)}`, url.origin));
  }

  const ok = await verifyToken(cookie, SECRET);
  if (!ok) {
    const res = NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(url.pathname + url.search)}`, url.origin));
    res.headers.append("Set-Cookie", `${TOKEN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`);
    return res;
  }

  return NextResponse.next();
}

function getCookie(cookieHeader, name) {
  const m = cookieHeader.match(new RegExp(`(?:^|;)\\s*${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : "";
}
