"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.classList.toggle("light", !next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  }

  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? "切换到浅色模式" : "切换到暗色模式"}
      className="inline-flex size-10 items-center justify-center rounded-lg border border-white/15 bg-white/8 text-paper shadow-sm backdrop-blur transition hover:border-ember/70 hover:text-ember light:border-ink/15 light:bg-white/70 light:text-ink"
    >
      <Icon aria-hidden="true" size={18} />
      <span className="sr-only">{isDark ? "切换到浅色模式" : "切换到暗色模式"}</span>
    </button>
  );
}
