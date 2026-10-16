import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <div className="text-5xl">📵</div>
      <h1 className="mt-4 text-2xl font-bold">HP tidak ditemukan</h1>
      <p className="text-muted mt-2">Data mungkin belum tersedia atau API sedang gangguan.</p>
      <Link href="/" className="mt-6 inline-block rounded-xl bg-indigo-500 px-5 py-2.5 font-semibold text-white">
        Kembali ke beranda
      </Link>
    </div>
  );
}
