"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function FinalCta() {
  return (
    <section className="relative z-10 border-t border-white/5 bg-page/50 px-4 py-24 sm:px-6 lg:py-32 light:border-ink/5 light:bg-paper/50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        className="mx-auto max-w-4xl text-center"
      >
        <h2 className="text-3xl font-semibold tracking-tight text-paper sm:text-5xl light:text-ink">
          准备好进入回声了吗？
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-paper/60 light:text-ink/60">
          加入创作者行列，或者作为读者，在这里找到属于你的那个故事世界。
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="#library"
            className="inline-flex h-12 items-center justify-center rounded-full bg-ember px-8 text-sm font-medium text-ink transition hover:scale-105 hover:bg-[#efbd5e]"
          >
            开始阅读
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
