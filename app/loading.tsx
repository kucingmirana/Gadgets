export default function Loading() {
  return (
    <div className="py-6 sm:py-10">
      <div className="h-10 w-2/3 animate-pulse rounded-xl bg-slate-300/30" />
      <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-slate-300/30" />
        ))}
      </div>
    </div>
  );
}
