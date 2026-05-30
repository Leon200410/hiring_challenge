import Image from "next/image";
import Link from "next/link";
import { ArrowDown, Sparkles } from "lucide-react";
import { NovelShelf } from "@/components/novel-shelf";
import { SetupNotice } from "@/components/setup-notice";
import { getNovels } from "@/lib/story-api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const novelsResult = await getNovels();
  const novels = novelsResult.data ?? [];
  const heroCover = novels[0]?.coverPath ?? "/covers/midnight-library.png";

  return (
    <main>
      <section className="relative flex min-h-[88svh] items-end overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:pb-20">
        <Image
          src={heroCover}
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,16,22,0.92)_0%,rgba(14,16,22,0.7)_42%,rgba(14,16,22,0.18)_100%)] light:bg-[linear-gradient(90deg,rgba(246,239,227,0.92)_0%,rgba(246,239,227,0.66)_44%,rgba(246,239,227,0.18)_100%)]" />
        <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-lg border border-ember/40 bg-ember/10 px-3 py-2 text-sm text-ember">
              <Sparkles aria-hidden="true" size={16} />
              PGC 互动叙事平台
            </div>
            <h1 className="mt-6 text-5xl font-semibold leading-tight text-paper sm:text-7xl light:text-ink">
              回声书页
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-9 text-paper/78 light:text-ink/76">
              每一次翻页，世界都会回应你。
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="#library"
                className="inline-flex items-center gap-2 rounded-lg bg-ember px-5 py-3 text-sm font-semibold text-ink transition hover:bg-[#efbd5e]"
              >
                浏览书架
                <ArrowDown aria-hidden="true" size={17} />
              </Link>
              {novels[0] ? (
                <Link
                  href={`/novels/${novels[0].slug}`}
                  className="inline-flex items-center rounded-lg border border-white/18 px-5 py-3 text-sm font-semibold text-paper transition hover:border-fern hover:text-fern light:border-ink/15 light:text-ink"
                >
                  查看精选作品
                </Link>
              ) : null}
            </div>
          </div>
          <div className="hidden text-right text-sm leading-7 text-paper/64 lg:block light:text-ink/62">
            <p>文字、语音、音乐、立绘与视频在同一个故事空间里交汇。</p>
            <p>创作者写下分支，读者进入回声。</p>
          </div>
        </div>
      </section>

      <section id="library" className="px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-fern">Featured Novel</p>
              <h2 className="mt-2 text-3xl font-semibold text-paper sm:text-4xl light:text-ink">
                今夜可读
              </h2>
            </div>
          </div>

          {novels.length > 0 ? (
            <NovelShelf novels={novels} />
          ) : (
            <SetupNotice message={novelsResult.error} />
          )}
        </div>
      </section>
    </main>
  );
}
