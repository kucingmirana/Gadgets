"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import type { BrandCatalog } from "@/domain/entities/Phone";
import { countSeries, filterBySeries, seriesLabel } from "@/domain/services/phoneSeries";
import { NEW_BADGE_COUNT, searchPhones } from "@/domain/services/searchPhones";
import { BrandCard } from "./BrandCard";
import { Pagination } from "./Pagination";
import { PhoneCard } from "./PhoneCard";
import { SearchBar } from "./SearchBar";
import { SeriesFilter } from "./SeriesFilter";

type Layout = "grid" | "list";

type Props = {
  catalogs: BrandCatalog[];
  /** Ambil satu halaman HP brand dari server. */
  loadPage: (brandId: string, page: number) => Promise<BrandCatalog | null>;
};

export function PhoneExplorer({ catalogs, loadPage }: Props) {
  const [activeId, setActiveId] = useState(catalogs[0]?.brand.id ?? "");
  const [query, setQuery] = useState("");
  const [layout, setLayout] = useState<Layout>("grid");
  const [series, setSeries] = useState<string | null>(null);
  // Halaman yang sedang tampil per brand (diambil dari API saat pindah halaman)
  const [loaded, setLoaded] = useState<Record<string, BrandCatalog>>({});
  const [loading, startLoading] = useTransition();
  const listTop = useRef<HTMLHeadingElement>(null);

  const current = useMemo(() => catalogs.map((c) => loaded[c.brand.id] ?? c), [catalogs, loaded]);
  const active = current.find((c) => c.brand.id === activeId) ?? current[0];
  const searching = query.trim().length > 0;

  // Series dihitung dari halaman yang sedang tampil; series terpilih tetap ditampilkan walau kosong
  const seriesCounts = useMemo(() => {
    if (!active) return [];
    const counts = countSeries(active.brand.id, active.phones);
    if (series && !counts.some((s) => s.id === series))
      counts.push({ id: series, label: seriesLabel(active.brand.id, series), count: 0 });
    return counts;
  }, [active, series]);

  // Saat mencari, hasil diambil dari halaman yang sedang tampil di semua brand (filter series diabaikan)
  const phones = useMemo(
    () =>
      searching
        ? searchPhones(current.flatMap((c) => c.phones), query)
        : active
          ? filterBySeries(active.brand.id, active.phones, series)
          : [],
    [searching, current, query, active, series]
  );
  // Badge "baru" mengikuti urutan asli API, bukan urutan setelah difilter
  const newPhones = useMemo(
    () => new Set(active && active.page === 1 ? active.phones.slice(0, NEW_BADGE_COUNT) : []),
    [active]
  );

  const goToPage = (page: number) =>
    startLoading(async () => {
      try {
        const next = await loadPage(active.brand.id, page);
        if (next) {
          setLoaded((prev) => ({ ...prev, [next.brand.id]: next }));
          // Di HP pagination ada jauh di bawah: bawa pengguna kembali ke awal daftar
          listTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } catch (err) {
        console.warn("[phones] gagal memuat halaman:", err);
      }
    });

  if (!active) return null;

  return (
    <div>
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 py-2 sm:mx-0 sm:grid sm:grid-cols-3 lg:grid-cols-6">
        {catalogs.map((c) => (
          <BrandCard
            key={c.brand.id}
            brand={c.brand}
            count={c.phones.length}
            active={c.brand.id === activeId && !searching}
            onSelect={() => { setActiveId(c.brand.id); setQuery(""); setSeries(null); }}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 ref={listTop} className="scroll-mt-20 text-lg font-bold break-words sm:text-xl">
          {searching
            ? `Hasil pencarian “${query}”`
            : `HP terbaru ${active.brand.name}${series ? ` · ${seriesLabel(active.brand.id, series)}` : ""}`}
          <span className="text-muted ml-2 text-sm font-medium">({phones.length})</span>
        </h2>
        <div className="flex gap-2">
          <SearchBar value={query} onChange={setQuery} />
          <div className="card flex shrink-0 rounded-xl p-1" role="group" aria-label="Tampilan">
            {(["grid", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setLayout(v)}
                aria-pressed={layout === v}
                className={`min-h-8 rounded-lg px-3 text-xs font-semibold capitalize ${layout === v ? "bg-indigo-500 text-white" : "text-muted"}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!searching && (
        <SeriesFilter series={seriesCounts} total={active.phones.length} value={series} onChange={setSeries} />
      )}

      {!searching && active.source === "fallback" && (
        <p className="mt-3 rounded-xl bg-amber-500/10 px-3 py-2 text-xs text-amber-600">
          API sedang tidak bisa diakses — menampilkan data contoh. Coba muat ulang nanti.
        </p>
      )}

      {phones.length === 0 ? (
        <>
          <div className="card text-muted mt-6 rounded-2xl p-6 text-center text-sm sm:p-10 sm:text-base">
            <div className="mb-2 text-3xl">🔍</div>
            {!searching && series
              ? "Tidak ada HP series ini di halaman ini. Coba halaman lain atau pilih series lain."
              : "Tidak ada HP yang cocok. Coba kata kunci lain."}
          </div>
          {!searching && series && (
            <Pagination page={active.page} totalPages={active.totalPages} disabled={loading} onChange={goToPage} />
          )}
        </>
      ) : (
        <>
          <div
            key={`${activeId}-${layout}-${query}-${series}-${active.page}`}
            aria-busy={loading}
            className={`${layout === "grid" ? "mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4" : "mt-5 flex flex-col gap-2"} ${
              loading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            {phones.map((p, i) => (
              <PhoneCard
                key={`${p.brandName}-${p.name}`}
                phone={p}
                index={i}
                layout={layout}
                isNew={!searching && newPhones.has(p)}
              />
            ))}
          </div>
          {!searching && (
            <Pagination page={active.page} totalPages={active.totalPages} disabled={loading} onChange={goToPage} />
          )}
        </>
      )}
    </div>
  );
}
