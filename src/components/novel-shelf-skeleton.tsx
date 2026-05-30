export function NovelShelfSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col animate-pulse">
          <div className="relative mb-6 aspect-[4/5] w-full overflow-hidden rounded-sm bg-white/5 light:bg-black/5" />
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <div className="h-4 w-16 rounded bg-white/5 light:bg-black/5" />
              <div className="h-px w-4 bg-white/5 light:bg-black/5" />
              <div className="h-4 w-24 rounded bg-white/5 light:bg-black/5" />
            </div>
            <div className="mt-4 h-8 w-3/4 rounded bg-white/5 light:bg-black/5" />
            <div className="mt-4 space-y-2">
              <div className="h-4 w-full rounded bg-white/5 light:bg-black/5" />
              <div className="h-4 w-full rounded bg-white/5 light:bg-black/5" />
              <div className="h-4 w-2/3 rounded bg-white/5 light:bg-black/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
