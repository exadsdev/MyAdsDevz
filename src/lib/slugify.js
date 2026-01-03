/** slugify รองรับไทยเบื้องต้น */
export function slugify(input = "") {
  const s = String(input || "")
    .trim()
    // แทนที่ช่องว่างด้วย -
    .replace(/\s+/g, "-")
    // ลบอักขระที่ไม่ใช่ตัวอักษร/ตัวเลข/ขีดกลาง/ขีดล่าง (อนุญาตอักษรไทย)
    .replace(/[^a-zA-Z0-9\u0E00-\u0E7F\-_]/g, "")
    // ลดซ้ำของขีด
    .replace(/-+/g, "-")
    // ตัดขีดหัวท้าย
    .replace(/^-+|-+$/g, "");
  return s || "untitled";
}

export default slugify;
