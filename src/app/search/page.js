export const metadata = { title: "ค้นหา | AdsDev Marketing" };

export default function SearchPage({ searchParams }) {
  const q = searchParams?.q ?? "";
  return (
    <>
      <nav className="breadcrumb">หน้าแรก / ค้นหา</nav>
      <h1>ค้นหา</h1>
      <form>
        <input type="search" name="q" defaultValue={q} placeholder="พิมพ์คำที่ต้องการค้นหา..." />
      </form>
      <div className="section">
        {q ? (
          <p>ผลการค้นหาสำหรับ: <strong>{q}</strong> (ตัวอย่างหน้า search สำหรับ SearchAction)</p>
        ) : (
          <p>พิมพ์คำค้นหาในช่องด้านบน</p>
        )}
      </div>
    </>
  );
}
