import { ArrowRight, BookText, Clock, PenLine } from "lucide-react";

export default function NovelLoading() {
  return (
    <main className="px-4 pb-20 pt-28 sm:px-6">
      <section className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[24rem_1fr] lg:items-start animate-pulse">
        {/* Cover Skeleton */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-white/5 light:bg-black/5" />
        
        {/* Content Skeleton */}
        <div className="pt-2">
          {/* Tag */}
          <div className="inline-flex h-9 w-28 rounded-lg bg-white/5 light:bg-black/5" />
          
          {/* Title */}
          <div className="mt-6 h-14 w-3/4 rounded-lg bg-white/5 light:bg-black/5" />
          
          {/* Metadata */}
          <div className="mt-5 flex flex-wrap gap-3">
            <div className="h-9 w-24 rounded-lg bg-white/5 light:bg-black/5" />
            <div className="h-9 w-32 rounded-lg bg-white/5 light:bg-black/5" />
            <div className="h-9 w-24 rounded-lg bg-white/5 light:bg-black/5" />
          </div>

          {/* Summary */}
          <div className="mt-10 max-w-3xl border-l border-ember/20 pl-6">
            <div className="h-7 w-20 rounded-lg bg-white/5 light:bg-black/5" />
            <div className="mt-4 space-y-3">
              <div className="h-4 w-full rounded bg-white/5 light:bg-black/5" />
              <div className="h-4 w-full rounded bg-white/5 light:bg-black/5" />
              <div className="h-4 w-4/5 rounded bg-white/5 light:bg-black/5" />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap gap-3">
            <div className="h-12 w-36 rounded-lg bg-white/5 light:bg-black/5" />
            <div className="h-12 w-32 rounded-lg bg-white/5 light:bg-black/5" />
          </div>
        </div>
      </section>
    </main>
  );
}
