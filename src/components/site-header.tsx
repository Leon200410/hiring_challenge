import Link from "next/link";
import { BookOpen, Library } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-page/70 backdrop-blur-xl light:border-ink/10 light:bg-paper/80">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-paper transition hover:text-ember light:text-ink"
        >
          <span className="inline-flex size-9 items-center justify-center rounded-lg bg-ember text-ink">
            <Library aria-hidden="true" size={18} />
          </span>
          回声书局
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/#library"
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm text-paper/76 transition hover:bg-white/10 hover:text-paper sm:inline-flex light:text-ink/70 light:hover:bg-ink/8 light:hover:text-ink"
          >
            <BookOpen aria-hidden="true" size={16} />
            书架
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
