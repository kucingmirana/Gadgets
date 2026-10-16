type Props = { value: string; onChange: (v: string) => void };

export function SearchBar({ value, onChange }: Props) {
  return (
    <label className="card flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-2 sm:w-72 sm:flex-none">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        placeholder="Cari model HP…"
        aria-label="Cari handphone"
        className="w-full min-w-0 bg-transparent text-base outline-none placeholder:text-[var(--muted)] sm:text-sm [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button onClick={() => onChange("")} className="text-muted -mr-1 grid h-7 w-7 shrink-0 place-items-center text-xs" aria-label="Hapus pencarian">✕</button>
      )}
    </label>
  );
}
