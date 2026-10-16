import type { SeriesCount } from "@/domain/services/phoneSeries";

type Props = {
  series: SeriesCount[];
  total: number;
  value: string | null;
  onChange: (id: string | null) => void;
};

export function SeriesFilter({ series, total, value, onChange }: Props) {
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
