"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BrandCatalog } from "@/domain/entities/Phone";
import { countSeries, filterBySeries, seriesLabel } from "@/domain/services/phoneSeries";
import { NEW_BADGE_COUNT, searchPhones } from "@/domain/services/searchPhones";
import { BrandCard } from "./BrandCard";
import { Pagination } from "./Pagination";
import { PhoneCard } from "./PhoneCard";
import { SearchBar } from "./SearchBar";
import { SeriesFilter, type SeriesStatus } from "./SeriesFilter";

type Layout = "grid" | "list";

/** Jumlah HP per halaman (paging dilakukan di klien setelah semua data terkumpul). */
const PAGE_SIZE = 24;

type Props = {
  /** Halaman pertama tiap brand, dirender di server agar tampilan awal cepat. */
  catalogs: BrandCatalog[];
  /** Ambil seluruh HP brand (semua halaman API digabung) dari server. */
  loadAll: (brandId: string) => Promise<BrandCatalog | null>;
};

export function PhoneExplorer({ catalogs, loadAll }: Props) {
  const [activeId, setActiveId] = useState(catalogs[0]?.brand.id ?? "");
  const [query, setQuery] = useState("");
  const [layout, setLayout] = useState<Layout>("grid");
  const [series, setSeries] = useState<string | null>(null);
  // Seluruh HP per brand, diambil sekali saat brand pertama kali dibuka
  const [full, setFull] = useState<Record<string, BrandCatalog>>({});
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const requested = useRef(new Set<string>());
  const listTop = useRef<HTMLHeadingElement>(null);

  const fetchAll = useCallback(
    async (brandId: string) => {
      requested.current.add(brandId);
      setFailed(({ [brandId]: _, ...rest }) => rest);
      try {
        const res = await loadAll(brandId);
        if (!res) throw new Error("brand tidak ditemukan");
        setFull((prev) => ({ ...prev, [brandId]: res }));
      } catch (err) {
        console.warn("[phones] gagal memuat semua data:", err);
        requested.current.delete(brandId);
        setFailed((prev) => ({ ...prev, [brandId]: true }));
      }
    },
    [loadAll]
  );

  useEffect(() => {
    if (activeId && !requested.current.has(activeId)) fetchAll(activeId);
  }, [activeId, fetchAll]);

  const active = catalogs.find((c) => c.brand.id === activeId) ?? catalogs[0];
  const activeFull = active ? full[active.brand.id] : undefined;
  // Sebelum semua data siap, tampilkan halaman pertama dari server
  const basePhones = useMemo(() => activeFull?.phones ?? active?.phones ?? [], [activeFull, active]);
  const status: SeriesStatus = activeFull ? "ready" : failed[activeId] ? "error" : "loading";
  const searching = query.trim().length > 0;

  const seriesCounts = useMemo(
    () => (active && activeFull ? countSeries(active.brand.id, activeFull.phones) : []),
    [active, activeFull]
  );

  // Pencarian memakai data lengkap untuk brand yang sudah dimuat, halaman pertama untuk sisanya
  const results = useMemo(() => {
    if (searching) return searchPhones(catalogs.flatMap((c) => full[c.brand.id]?.phones ?? c.phones), query);
    return active ? filterBySeries(active.brand.id, basePhones, series) : [];
  }, [searching, catalogs, full, query, active, basePhones, series]);

  // Halaman otomatis kembali ke 1 saat brand, series, atau kata kunci berubah
  const pageKey = `${activeId}|${series}|${query}`;
  const [paging, setPaging] = useState({ key: pageKey, page: 1 });
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = paging.key === pageKey ? Math.min(paging.page, totalPages) : 1;
  const phones = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Badge "baru" mengikuti urutan asli API, bukan urutan setelah difilter
  const newPhones = useMemo(() => new Set(basePhones.slice(0, NEW_BADGE_COUNT)), [basePhones]);

  const goToPage = (next: number) => {
    setPaging({ key: pageKey, page: next });
    // Di HP pagination ada jauh di bawah: bawa pengguna kembali ke awal daftar
    listTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!active) return null;

  return (
    <div>
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 py-2 sm:mx-0 sm:grid sm:grid-cols-3  lg:grid-cols-6">
        {catalogs.map((c) => (
          <BrandCard
            key={c.brand.id}
            brand={c.brand}
            count={full[c.brand.id]?.phones.length ?? c.phones.length}
            active={c.brand.id === activeId && !searching}
            onSelect={() => { setActiveId(c.brand.id); setQuery(""); setSeries(null); }}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 ref={listTop} className="scroll-mt-20 text-lg font-bold break-words sm:text-xl">
          {searching
            ? `Hasil pencarian “${query}”`
            : `HP ${active.brand.name}${series ? ` · ${seriesLabel(active.brand.id, series)}` : ""}`}
          <span className="text-muted ml-2 text-sm font-medium">({results.length})</span>
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
        <SeriesFilter
          status={status}
          series={seriesCounts}
          total={basePhones.length}
          value={series}
          onChange={setSeries}
          onRetry={() => fetchAll(active.brand.id)}
        />
      )}

      {!searching && (activeFull ?? active).source === "fallback" && (
        <p className="mt-3 rounded-xl bg-amber-500/10 px-3 py-2 text-xs text-amber-600">
          API sedang tidak bisa diakses — menampilkan data contoh. Coba muat ulang nanti.
        </p>
      )}

      {phones.length === 0 ? (
        <div className="card text-muted mt-6 rounded-2xl p-6 text-center text-sm sm:p-10 sm:text-base">
          <div className="mb-2 text-3xl">🔍</div>
          {!searching && series ? "Tidak ada HP di series ini." : "Tidak ada HP yang cocok. Coba kata kunci lain."}
        </div>
      ) : (
        <>
          <div
            key={`${pageKey}-${layout}-${page}`}
            className={layout === "grid" ? "mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4" : "mt-5 flex flex-col gap-2"}
          >
            {phones.map((p, i) => (
              <PhoneCard
                key={p.id || `${p.brandName}-${p.name}`}
                phone={p}
                index={i}
                layout={layout}
                isNew={!searching && newPhones.has(p)}
              />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
        </>
      )}
    </div>
  );
}
