// Utility helpers used across API/routes

/** turn any string into a URL-safe slug */
export function slugify(input = "") {
  return String(input)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9ก-๙\s-]/g, "") // keep thai, latin, digits, spaces, hyphen
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** today as YYYY-MM-DD (local) */
export function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

/** ensure array */
export function toArray(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  return [v];
}
