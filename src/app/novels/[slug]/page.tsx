import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookText, Clock, PenLine } from "lucide-react";
import { SetupNotice } from "@/components/setup-notice";
import { getNovel, getScenes } from "@/lib/story-api";

type NovelPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export default async function NovelPage({ params }: NovelPageProps) {
  const { slug } = await params;
  const [novelResult, scenesResult] = await Promise.all([
    getNovel(slug),
    getScenes(slug),
  ]);

  if (!novelResult.configured || novelResult.error) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-28 sm:px-6">
        <SetupNotice message={novelResult.error} />
      </main>
    );
  }

  const novel = novelResult.data;

  if (!novel) {
    notFound();
  }

  const sceneCount = scenesResult.data?.length ?? 0;

  return (
    <main className="px-4 pb-20 pt-24 sm:px-6 lg:pt-32">
      <section className="mx-auto grid max-w-6xl gap-8 sm:gap-12 lg:grid-cols-[24rem_1fr] lg:items-start">
        <div className="relative w-48 aspect-[3/4] sm:w-64 lg:w-full overflow-hidden rounded-lg border border-white/12 bg-ink shadow-2xl shadow-black/30 light:border-ink/10">
          <Image
            src={novel.coverPath}
            alt={`${novel.title} 封面`}
            fill
            sizes="(min-width: 1024px) 384px, 100vw"
            priority
            className="object-cover"
          />
        </div>

        <div className="pt-2">
          <p className="inline-flex items-center gap-2 rounded-lg border border-fern/45 bg-fern/10 px-3 py-2 text-sm text-fern">
            <BookText aria-hidden="true" size={16} />
            互动短篇
          </p>
          <h1 className="mt-6 text-5xl font-semibold leading-tight text-paper light:text-ink">
            {novel.title}
          </h1>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-paper/65 light:text-ink/65">
            <span className="inline-flex items-center gap-2 rounded-lg bg-white/8 px-3 py-2 light:bg-white/70">
              <PenLine aria-hidden="true" size={15} />
              {novel.author}
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg bg-white/8 px-3 py-2 light:bg-white/70">
              <Clock aria-hidden="true" size={15} />
              约 {novel.readingMinutes} 分钟
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg bg-white/8 px-3 py-2 light:bg-white/70">
              {sceneCount || "?"} 个场景
            </span>
          </div>

          <div className="mt-10 max-w-3xl border-l border-ember/50 pl-6">
            <h2 className="text-xl font-semibold text-paper light:text-ink">作品简介</h2>
            <p className="mt-4 whitespace-pre-line text-lg leading-9 text-paper/74 light:text-ink/72">
              {novel.summary}
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`/reader/${novel.slug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-ember px-5 py-3 text-sm font-semibold text-ink transition hover:bg-[#efbd5e]"
            >
              开始阅读
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link
              href="/#library"
              className="inline-flex items-center rounded-lg border border-white/18 px-5 py-3 text-sm font-semibold text-paper transition hover:border-fern hover:text-fern light:border-ink/15 light:text-ink"
            >
              返回书架
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
