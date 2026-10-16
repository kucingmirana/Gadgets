type Props = { page: number; totalPages: number; disabled?: boolean; onChange: (page: number) => void };

/** Nomor halaman yang ditampilkan: awal, akhir, dan tetangga halaman aktif; "…" untuk celah. */
function visiblePages(page: number, total: number, siblings = 1): (number | "gap")[] {
  const keep = new Set([1, total]);
  for (let n = page - siblings; n <= page + siblings; n++) if (n >= 1 && n <= total) keep.add(n);
  const sorted = [...keep].sort((a, b) => a - b);
  return sorted.flatMap((n, i) => {
    const prev = sorted[i - 1];
    if (prev === undefined || n - prev === 1) return [n];
    return n - prev === 2 ? [n - 1, n] : ["gap" as const, n];
  });
}

export function Pagination({ page, totalPages, disabled = false, onChange }: Props) {
  if (totalPages <= 1) return null;

  const btn = "card grid h-9 min-w-9 place-items-center rounded-xl px-2 text-sm sm:h-10 sm:min-w-10 sm:px-3 font-semibold transition disabled:opacity-40";

  return (
    <nav className="mt-6 flex flex-wrap items-center justify-center gap-1 sm:gap-2" aria-label="Halaman">
      <button className={btn} onClick={() => onChange(page - 1)} disabled={disabled || page <= 1} aria-label="Halaman sebelumnya">
        ‹
      </button>
      {visiblePages(page, totalPages).map((n, i) =>
        n === "gap" ? (
          <span key={`gap-${i}`} className="text-muted px-1 text-sm" aria-hidden>
            …
          </span>
        ) : (
          <button
            key={n}
            onClick={() => onChange(n)}
            disabled={disabled}
            aria-current={n === page ? "page" : undefined}
            aria-label={`Halaman ${n}`}
            className={`${btn} ${n === page ? "bg-indigo-500 text-white" : "text-muted"}`}
          >
            {n}
          </button>
        )
      )}
      <button className={btn} onClick={() => onChange(page + 1)} disabled={disabled || page >= totalPages} aria-label="Halaman berikutnya">
        ›
      </button>
    </nav>
  );
}
