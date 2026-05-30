export function NovelShelfSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-row gap-5 sm:flex-col sm:gap-0 animate-pulse">
          <div className="relative w-28 shrink-0 overflow-hidden rounded-sm bg-white/5 sm:mb-6 sm:w-full sm:aspect-4/5 aspect-[3/4] light:bg-black/5" />
          <div className="flex flex-col justify-center sm:justify-start flex-1">
            <div className="flex items-center gap-3">
              <div className="h-4 w-16 rounded bg-white/5 light:bg-black/5" />
              <div className="h-px w-4 bg-white/5 light:bg-black/5" />
              <div className="h-4 w-24 rounded bg-white/5 light:bg-black/5" />
            </div>
            <div className="mt-4 h-6 sm:h-8 w-3/4 rounded bg-white/5 light:bg-black/5" />
            <div className="mt-3 sm:mt-4 space-y-2">
              <div className="h-4 w-full rounded bg-white/5 light:bg-black/5" />
              <div className="h-4 w-full rounded bg-white/5 light:bg-black/5" />
              <div className="hidden sm:block h-4 w-2/3 rounded bg-white/5 light:bg-black/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
