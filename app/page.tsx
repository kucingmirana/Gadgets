import { useCases } from "@/di/container";
import { PhoneExplorer } from "@/presentation/components/PhoneExplorer";
import { loadBrandPage } from "./actions";

export const revalidate = 3600;

// Route = controller tipis: panggil use case, serahkan hasil ke presentation.
export default async function Home() {
  const catalogs = await useCases.getFeaturedCatalogs.execute();

  return (
    <>
      <section className="py-6 sm:py-14">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-500">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" /> Update otomatis tiap jam
        </p>
        <h1 className="max-w-2xl text-[1.75rem] font-extrabold leading-tight tracking-tight sm:text-5xl">
          Temukan HP terbaru dari brand favoritmu
        </h1>
        <p className="text-muted mt-3 max-w-xl text-sm sm:text-base">Pilih brand, cari model, lalu ketuk untuk melihat spesifikasi lengkap.</p>
      </section>
      <PhoneExplorer catalogs={catalogs} loadPage={loadBrandPage} />
    </>
  );
}
