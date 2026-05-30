import { notFound } from "next/navigation";
import { ReaderClient } from "@/components/reader-client";
import { SetupNotice } from "@/components/setup-notice";
import { getNovel, getScenes } from "@/lib/story-api";

type ReaderPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export default async function ReaderPage({ params }: ReaderPageProps) {
  const { slug } = await params;
  const [novelResult, scenesResult] = await Promise.all([
    getNovel(slug),
    getScenes(slug),
  ]);

  if (!novelResult.configured || !scenesResult.configured) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-28 sm:px-6">
        <SetupNotice message={novelResult.error ?? scenesResult.error} />
      </main>
    );
  }

  if (novelResult.error || scenesResult.error) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-28 sm:px-6">
        <SetupNotice
          title="故事 API 暂时不可用"
          message={novelResult.error ?? scenesResult.error}
        />
      </main>
    );
  }

  const novel = novelResult.data;
  const scenes = scenesResult.data ?? [];

  if (!novel || scenes.length === 0) {
    notFound();
  }

  return <ReaderClient novel={novel} scenes={scenes} />;
}
