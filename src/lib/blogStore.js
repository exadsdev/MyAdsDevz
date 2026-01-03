// Simple JSON-file backed blog store.
// File: /data/blog.json  (auto-created if not exists)

import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { slugify, todayStr, toArray } from "./text";

const DATA_DIR = path.join(process.cwd(), "data");
const BLOG_PATH = path.join(DATA_DIR, "blog.json");

async function ensureDataFile() {
  try {
    await stat(DATA_DIR);
  } catch {
    await mkdir(DATA_DIR, { recursive: true });
  }
  try {
    await stat(BLOG_PATH);
  } catch {
    const init = { items: [] };
    await writeFile(BLOG_PATH, JSON.stringify(init, null, 2), "utf8");
  }
}

async function loadAll() {
  await ensureDataFile();
  const buf = await readFile(BLOG_PATH, "utf8");
  const j = JSON.parse(buf || "{}");
  const items = Array.isArray(j.items) ? j.items : [];
  return items;
}

async function saveAll(items) {
  await ensureDataFile();
  const j = { items: toArray(items) };
  await writeFile(BLOG_PATH, JSON.stringify(j, null, 2), "utf8");
}

/** ===== Public APIs (named exports) ===== */

/** list all articles (sorted desc by date) */
export async function listArticles() {
  const items = await loadAll();
  return items
    .slice()
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
}

/** get one article by slug */
export async function getBlog(slug) {
  if (!slug) return null;
  const items = await loadAll();
  return items.find((x) => x.slug === slug) || null;
}

/** create a new article; auto slug if missing; returns created item */
export async function createArticle(payload = {}) {
  const items = await loadAll();
  const title = payload.title?.trim() || "บทความใหม่";
  const slug =
    (payload.slug && slugify(payload.slug)) ||
    slugify(title) ||
    `post-${Date.now()}`;

  if (items.some((x) => x.slug === slug)) {
    // append short suffix to avoid conflict
    const unique = `${slug}-${Date.now().toString(36).slice(-4)}`;
    payload.slug = unique;
  } else {
    payload.slug = slug;
  }

  const item = {
    slug: payload.slug,
    title,
    date: payload.date || todayStr(),
    excerpt: payload.excerpt || "",
    tags: toArray(payload.tags || []),
    author: payload.author || "",
    authorUrl: payload.authorUrl || "",
    thumbnail: payload.thumbnail || "",
    coverUrl: payload.coverUrl || "",
    imageAlt: payload.imageAlt || "",
    imageCaption: payload.imageCaption || "",
    imageWidth: payload.imageWidth || "",
    imageHeight: payload.imageHeight || "",
    inLanguage: payload.inLanguage || "th-TH",
    contentHtml: payload.contentHtml || "<p>...</p>",
  };

  items.push(item);
  await saveAll(items);
  return item;
}

/** update existing article by slug; returns updated item or null */
export async function updateBlog(slug, patch = {}) {
  if (!slug) return null;
  const items = await loadAll();
  const idx = items.findIndex((x) => x.slug === slug);
  if (idx === -1) return null;

  // if slug is being changed, normalize & ensure uniqueness
  let newSlug = items[idx].slug;
  if (patch.slug && patch.slug !== slug) {
    const candidate = slugify(patch.slug);
    newSlug =
      items.some((x) => x.slug === candidate && x.slug !== slug)
        ? `${candidate}-${Date.now().toString(36).slice(-4)}`
        : candidate;
  }

  const updated = {
    ...items[idx],
    ...patch,
    slug: newSlug,
  };

  items[idx] = updated;
  await saveAll(items);
  return updated;
}

/** remove by slug; returns true if removed */
export async function removeBlog(slug) {
  if (!slug) return false;
  const items = await loadAll();
  const next = items.filter((x) => x.slug !== slug);
  const removed = next.length !== items.length;
  if (removed) await saveAll(next);
  return removed;
}
