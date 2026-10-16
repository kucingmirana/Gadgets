import Link from "next/link";
import { hasDetailPage, type PhoneSummary } from "@/domain/entities/Phone";

type Props = { phone: PhoneSummary; isNew: boolean; layout: "grid" | "list"; index: number };

export function PhoneCard({ phone, isNew, layout, index }: Props) {
  const list = layout === "list";
  const linkable = hasDetailPage(phone);

  const body = (
    <>
      <div
        className={`grid shrink-0 place-items-center rounded-xl bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 ${
          list ? "h-16 w-16" : "aspect-[4/5] w-full"
        }`}
      >
        {phone.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={phone.imageUrl}
            alt={phone.name}
            loading="lazy"
            className={`object-contain transition duration-300 group-hover:scale-105 ${list ? "h-14" : "h-4/5"}`}
          />
        ) : (
          <span className={list ? "text-2xl" : "text-5xl"} aria-hidden>📱</span>
        )}
      </div>
      <div className={list ? "min-w-0 flex-1" : "mt-2.5 min-w-0 sm:mt-3"}>
        <div className="text-muted text-[11px] font-semibold uppercase tracking-wide">{phone.brandName}</div>
        <div className="text-sm font-semibold leading-snug break-words sm:text-base">{phone.name}</div>
        {isNew && (
          <span className="mt-1 inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
            BARU
          </span>
        )}
      </div>
      {list && linkable && <span className="text-muted" aria-hidden>›</span>}
    </>
  );

  const className = `card group fade-up rounded-2xl p-2.5 transition sm:p-3 ${list ? "flex items-center gap-3" : "flex flex-col"} ${
    linkable ? "hover:-translate-y-0.5 hover:shadow-lg" : ""
  }`;
  const style = { animationDelay: `${Math.min(index, 12) * 30}ms` };

  return linkable ? (
    <Link href={`/phone/${phone.id}`} className={className} style={style}>{body}</Link>
  ) : (
    <div className={className} style={style}>{body}</div>
  );
}
