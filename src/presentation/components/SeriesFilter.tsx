import type { SeriesCount } from "@/domain/services/phoneSeries";

/** Filter series baru bisa dipakai setelah seluruh data brand selesai dimuat. */
export type SeriesStatus = "loading" | "ready" | "error";

type Props = {
  status: SeriesStatus;
  series: SeriesCount[];
  total: number;
  value: string | null;
  onChange: (id: string | null) => void;
  onRetry: () => void;
};

export function SeriesFilter({ status, series, total, value, onChange, onRetry }: Props) {
  if (status === "loading") {
    return (
      <div className="mt-4 flex items-center gap-2 py-1" role="status">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" aria-hidden />
        <span className="text-muted text-xs font-medium">Mengambil semua data untuk filter series…</span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mt-4 flex flex-wrap items-center gap-2 py-1 text-xs">
        <span className="text-muted">Gagal mengambil semua data — filter series belum tersedia.</span>
        <button onClick={onRetry} className="min-h-8 rounded-full bg-indigo-500 px-3 font-semibold text-white">
          Coba lagi
        </button>
      </div>
    );
  }

  if (series.length === 0) return null;

  const chip = (id: string | null, label: string, count: number) => {
    const active = value === id;
    return (
      <button
        key={id ?? "all"}
        onClick={() => onChange(id)}
        aria-pressed={active}
        className={`card min-h-8 shrink-0 snap-start rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
          active ? "bg-indigo-500 text-white" : "text-muted hover:-translate-y-0.5"
        }`}
      >
        {label}
        <span className={`ml-1.5 ${active ? "text-white/80" : "opacity-70"}`}>{count}</span>
      </button>
    );
  };

  return (
    <div
      className="no-scrollbar -mx-4 mt-4 flex snap-x gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:px-0"
      role="group"
      aria-label="Filter series"
    >
      {chip(null, "Semua", total)}
      {series.map((s) => chip(s.id, s.label, s.count))}
    </div>
  );
}
