import type { Brand } from "@/domain/entities/Brand";

type Props = { brand: Brand; count: number; active: boolean; onSelect: () => void };

export function BrandCard({ brand, count, active, onSelect }: Props) {
  return (
    <button
      onClick={onSelect}
      aria-pressed={active}
      className={`card min-w-[140px] shrink-0 snap-start rounded-2xl p-3 text-left sm:min-w-0 sm:p-4 transition hover:-translate-y-0.5 hover:shadow-lg ${
        active ? "shadow-lg ring-2" : ""
      }`}
      style={active ? ({ "--tw-ring-color": brand.accentColor } as React.CSSProperties) : undefined}
    >
      <span
        className="mb-3 grid h-10 w-10 place-items-center rounded-xl text-lg font-extrabold text-white"
        style={{ background: brand.accentColor }}
      >
        {brand.name[0].toUpperCase()}
      </span>
      <div className="font-bold">{brand.name}</div>
      <div className="text-muted text-xs">{brand.tagline}</div>
      <div className="text-muted mt-2 text-[11px] font-medium">{count} model terbaru</div>
    </button>
  );
}
