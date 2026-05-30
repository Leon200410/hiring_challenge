import { Loader2 } from "lucide-react";

export default function ReaderLoading() {
  return (
    <main className="flex h-[100svh] w-full items-center justify-center bg-page light:bg-paper">
      <div className="flex flex-col items-center gap-4 text-paper/40 light:text-ink/40">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-sm font-medium tracking-widest">加载故事中...</span>
      </div>
    </main>
  );
}
