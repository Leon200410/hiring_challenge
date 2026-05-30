import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { NovelShelf } from "@/components/novel-shelf";
import { NovelShelfSkeleton } from "@/components/novel-shelf-skeleton";
import { SetupNotice } from "@/components/setup-notice";
import { getNovels } from "@/lib/story-api";
import { HeroContent } from "@/components/hero-content";
import { SupportSection } from "@/components/support-section";
import { FinalCta } from "@/components/final-cta";

export const dynamic = "force-dynamic";

async function HeroNovelButton() {
  const novelsResult = await getNovels();
  const novel = novelsResult.data?.[0];
  
  if (!novel) return null;
  
  return (
    <Link
      href={`/novels/${novel.slug}`}
      className="inline-flex h-14 items-center rounded-full border border-white/20 px-8 text-base font-medium text-paper transition hover:border-white/40 hover:bg-white/5 light:border-ink/20 light:text-ink light:hover:border-ink/40 light:hover:bg-ink/5"
    >
      今夜精选
    </Link>
  );
}

async function LibraryData() {
  const novelsResult = await getNovels();
  const novels = novelsResult.data ?? [];
  
  if (novels.length > 0) {
    return <NovelShelf novels={novels} />;
  }
  return <SetupNotice message={novelsResult.error} />;
}

export default function Home() {
  const heroCover = "/covers/lending_bg.png";

  return (
    <main className="bg-page light:bg-paper">
      {/* HERO SECTION */}
      <section className="relative flex h-[100svh] w-full items-end justify-center overflow-hidden">
        {/* Full Bleed Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroCover}
            alt="回声书页背景"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-page via-page/60 to-page/10 light:from-paper light:via-paper/70 light:to-paper/20" />
        </div>

        {/* Hero Content (Client Component for Motion) */}
        <HeroContent 
          secondaryAction={
            <Suspense fallback={<div className="h-14 w-32 animate-pulse rounded-full bg-white/10 light:bg-black/5" />}>
              <HeroNovelButton />
            </Suspense>
          } 
        />
      </section>

      {/* SUPPORT / THESIS SECTION */}
      <SupportSection />

      {/* LIBRARY SECTION */}
      <section id="library" className="relative z-10 px-4 py-24 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-semibold tracking-tight text-paper sm:text-5xl light:text-ink">
                今夜可读
              </h2>
              <p className="mt-4 text-lg text-paper/60 light:text-ink/60">
                深入体验精心制作的互动叙事作品。每一次选择，都在重塑故事的走向。
              </p>
            </div>
          </div>

          <Suspense fallback={<NovelShelfSkeleton />}>
            <LibraryData />
          </Suspense>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <FinalCta />
    </main>
  );
}
