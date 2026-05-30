"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Home,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Novel, Scene } from "@/lib/types";

type ReaderClientProps = {
  novel: Novel;
  scenes: Scene[];
};

export function ReaderClient({ novel, scenes }: ReaderClientProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isEnding = pageIndex >= scenes.length;
  const scene = scenes[pageIndex];

  const progress = useMemo(() => {
    if (scenes.length === 0) {
      return 0;
    }
    return Math.round((Math.min(pageIndex + 1, scenes.length) / scenes.length) * 100);
  }, [pageIndex, scenes.length]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") {
        goNext();
      }
      if (event.key === "ArrowLeft") {
        goPrev();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  useEffect(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, [pageIndex]);

  function goNext() {
    setDirection(1);
    setPageIndex((current) => Math.min(current + 1, scenes.length));
  }

  function goPrev() {
    setDirection(-1);
    setPageIndex((current) => Math.max(current - 1, 0));
  }

  function restart() {
    setDirection(-1);
    setPageIndex(0);
  }

  function toggleSpeech() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!scene) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(`${scene.title}。${scene.body}`);
    utterance.lang = "zh-CN";
    utterance.rate = 0.92;
    utterance.pitch = 0.96;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }

  const variants = {
    enter: (pageDirection: number) => ({
      opacity: 0,
      x: pageDirection > 0 ? 40 : -40,
      filter: "blur(8px)",
    }),
    center: { opacity: 1, x: 0, filter: "blur(0px)" },
    exit: (pageDirection: number) => ({
      opacity: 0,
      x: pageDirection > 0 ? -40 : 40,
      filter: "blur(8px)",
    }),
  };

  return (
    <main className="min-h-screen px-4 pb-10 pt-24 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100svh-8rem)] max-w-4xl flex-col">
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between gap-4 text-sm text-paper/62 light:text-ink/62">
            <Link
              href={`/novels/${novel.slug}`}
              className="inline-flex items-center gap-2 rounded-lg px-2 py-2 transition hover:bg-white/10 hover:text-paper light:hover:bg-ink/8 light:hover:text-ink"
            >
              <ChevronLeft aria-hidden="true" size={17} />
              {novel.title}
            </Link>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/12 light:bg-ink/10">
            <motion.div
              className="h-full rounded-full bg-ember"
              initial={false}
              animate={{ width: `${isEnding ? 100 : progress}%` }}
              transition={{ duration: 0.35 }}
            />
          </div>
        </div>

        <section className="relative flex flex-1 items-center">
          <AnimatePresence mode="wait" custom={direction}>
            {isEnding ? (
              <motion.div
                key="ending"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="w-full rounded-lg border border-ember/25 bg-white/[0.07] p-8 text-center shadow-2xl shadow-black/20 backdrop-blur light:bg-white/72"
              >
                <BookOpen className="mx-auto text-ember" aria-hidden="true" size={34} />
                <p className="mt-6 text-sm text-fern">The End</p>
                <h1 className="mt-3 text-4xl font-semibold text-paper light:text-ink">
                  雨还在下，故事已经开始回响。
                </h1>
                <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-paper/68 light:text-ink/68">
                  你合上书页，仍能听见午夜图书馆在远处轻轻翻动。
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={restart}
                    className="inline-flex items-center gap-2 rounded-lg bg-ember px-5 py-3 text-sm font-semibold text-ink transition hover:bg-[#efbd5e]"
                  >
                    <RotateCcw aria-hidden="true" size={17} />
                    再读一次
                  </button>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/18 px-5 py-3 text-sm font-semibold text-paper transition hover:border-fern hover:text-fern light:border-ink/15 light:text-ink"
                  >
                    <Home aria-hidden="true" size={17} />
                    回到首页
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.article
                key={scene.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="w-full"
              >
                <p className="text-sm font-medium text-fern">
                  {String(scene.position).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}
                </p>
                <h1 className="mt-4 text-4xl font-semibold text-paper sm:text-5xl light:text-ink">
                  {scene.title.trim()}
                </h1>
                <div className="reader-text mt-8 whitespace-pre-line text-xl leading-10 text-paper/78 sm:text-2xl sm:leading-[3.2rem] light:text-ink/74">
                  {scene.body.trim()}
                </div>
              </motion.article>
            )}
          </AnimatePresence>
        </section>

        <div className="mt-10 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={pageIndex === 0}
            className="inline-flex h-12 min-w-12 items-center justify-center rounded-lg border border-white/16 px-4 text-paper transition hover:border-fern hover:text-fern disabled:cursor-not-allowed disabled:opacity-35 light:border-ink/14 light:text-ink"
            title="上一页"
          >
            <ChevronLeft aria-hidden="true" size={20} />
            <span className="sr-only">上一页</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSpeech}
              disabled={isEnding}
              className="inline-flex size-12 items-center justify-center rounded-lg border border-white/16 text-paper transition hover:border-ember hover:text-ember disabled:cursor-not-allowed disabled:opacity-35 light:border-ink/14 light:text-ink"
              title={isSpeaking ? "停止朗读" : "朗读当前场景"}
            >
              {isSpeaking ? (
                <VolumeX aria-hidden="true" size={19} />
              ) : (
                <Volume2 aria-hidden="true" size={19} />
              )}
              <span className="sr-only">{isSpeaking ? "停止朗读" : "朗读当前场景"}</span>
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={isEnding}
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-ember px-5 text-sm font-semibold text-ink transition hover:bg-[#efbd5e] disabled:cursor-not-allowed disabled:opacity-45"
            >
              下一页
              <ChevronRight aria-hidden="true" size={18} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
