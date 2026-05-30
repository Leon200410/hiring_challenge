import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 pt-16">
      <div className="max-w-md text-center">
        <p className="text-sm text-fern">404</p>
        <h1 className="mt-3 text-4xl font-semibold text-paper light:text-ink">
          这本书还没有出现在书架上
        </h1>
        <p className="mt-4 text-paper/65 light:text-ink/65">
          也许它还藏在午夜之后。先回到首页看看已经开放的故事。
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-lg bg-ember px-5 py-3 text-sm font-semibold text-ink transition hover:bg-[#efbd5e]"
        >
          回到首页
        </Link>
      </div>
    </main>
  );
}
