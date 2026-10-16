import Link from "next/link";
import type { PhoneDetail } from "@/domain/entities/Phone";

export function PhoneDetailView({ phone }: { phone: PhoneDetail }) {
  const highlights = [
    { icon: "📅", label: "Rilis", value: phone.releaseDate },
    { icon: "📐", label: "Dimensi", value: phone.dimension },
    { icon: "⚙️", label: "OS", value: phone.os },
    { icon: "💾", label: "Penyimpanan", value: phone.storage },
  ].filter((h) => h.value);

  return (
    <div className="fade-up py-5 sm:py-8">
      <Link href="/" className="text-muted mb-4 inline-flex min-h-10 items-center gap-1 text-sm hover:text-[var(--ink)] sm:mb-6">
        ← Kembali ke daftar
      </Link>

      <div className="grid gap-6 md:grid-cols-[320px_1fr]">
        <div className="md:sticky md:top-20 md:self-start">
          <div className="card mx-auto grid aspect-square max-h-[55vh] w-full max-w-sm place-items-center rounded-3xl md:aspect-[4/5] md:max-h-none md:max-w-none bg-gradient-to-b from-slate-100 to-slate-200 p-6 dark:from-slate-800 dark:to-slate-900">
            {phone.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={phone.thumbnailUrl} alt={phone.name} className="max-h-full object-contain" />
            ) : (
              <span className="text-6xl" aria-hidden>📱</span>
            )}
          </div>
          {phone.galleryUrls.length > 1 && (
            <div className="no-scrollbar -mx-4 mt-3 flex snap-x gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
              {phone.galleryUrls.slice(0, 6).map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} src={src} alt="" loading="lazy" className="card h-16 w-16 shrink-0 snap-start rounded-xl object-contain p-1" />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="text-muted text-sm font-semibold uppercase tracking-wide">{phone.brandName}</div>
          <h1 className="text-2xl font-extrabold tracking-tight break-words sm:text-4xl">{phone.name}</h1>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:gap-3">
            {highlights.map((h) => (
              <div key={h.label} className="card min-w-0 rounded-2xl p-3 sm:p-4">
                <div className="text-lg" aria-hidden>{h.icon}</div>
                <div className="text-muted mt-1 text-xs">{h.label}</div>
                <div className="text-sm font-semibold break-words">{h.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            {phone.specGroups.map((group, i) => (
              <details key={group.title} open={i < 3} className="card group rounded-2xl">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-bold [&::-webkit-details-marker]:hidden">
                  {group.title}
                  <span className="text-muted transition group-open:rotate-180" aria-hidden>⌄</span>
                </summary>
                <dl className="border-t border-[var(--line)] px-4 py-2">
                  {group.items.map((s, j) => (
                    <div key={`${s.label}-${j}`} className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 py-2 text-sm sm:grid-cols-[150px_minmax(0,1fr)]">
                      <dt className="text-muted break-words">{s.label}</dt>
                      <dd className="break-words">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
