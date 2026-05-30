"use client";

import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function HeroContent({ secondaryAction }: { secondaryAction?: React.ReactNode }) {
  return (
    <div className="relative z-10 w-full max-w-6xl px-4 pb-20 sm:px-6 md:pb-32">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-4xl"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-6xl font-semibold tracking-tight text-paper sm:text-8xl lg:text-[7.5rem] light:text-ink"
        >
          回声书局
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="mt-8 max-w-2xl text-xl leading-relaxed text-paper/80 sm:text-2xl light:text-ink/80"
        >
          每一次翻页，世界都会回应你。文字、声音与画面在这里交织，由你决定故事的去向。
        </motion.p>
        
        <motion.div 
          variants={itemVariants}
          className="mt-12 flex flex-wrap items-center gap-5"
        >
          <Link
            href="#library"
            className="inline-flex h-14 items-center gap-2 rounded-full bg-paper px-8 text-base font-medium text-ink transition hover:scale-105 hover:bg-white light:bg-ink light:text-paper light:hover:bg-black"
          >
            浏览书架
            <ArrowDown aria-hidden="true" size={18} className="opacity-70" />
          </Link>
          {secondaryAction}
        </motion.div>
      </motion.div>
    </div>
  );
}
