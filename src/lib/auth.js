// src/lib/auth.js
import { Buffer } from "node:buffer";

function parseBasicAuth(headerVal = "") {
  // header: "Basic base64(user:pass)"
  const m = /^Basic\s+(.+)$/i.exec(headerVal || "");
  if (!m) return null;
  try {
    const [u, p] = Buffer.from(m[1], "base64").toString("utf8").split(":");
    return { user: u, pass: p };
  } catch {
    return null;
  }
}

export function isAdmin(request) {
  const ADMIN_USER = process.env.ADMIN_USER || "admin";
  const ADMIN_PASS = process.env.ADMIN_PASS || "1122";
  const AUTH_SECRET = process.env.AUTH_SECRET || "";

  const auth = request.headers.get("authorization") || "";

  // 1) Bearer <AUTH_SECRET>
  const mBearer = /^Bearer\s+(.+)$/i.exec(auth);
  if (mBearer && AUTH_SECRET && mBearer[1] === AUTH_SECRET) return true;

  // 2) Basic auth
  const basic = parseBasicAuth(auth);
  if (basic && basic.user === ADMIN_USER && basic.pass === ADMIN_PASS) return true;

  // 3) Cookie admin=1 (เช่น set หลัง login แบบง่าย ๆ)
  const cookie = request.headers.get("cookie") || "";
  if (/\badmin=1\b/.test(cookie)) return true;

  return false;
}
