"use client";

import { motion, type Variants } from "framer-motion";

const textVariants: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function SupportSection() {
  return (
    <section className="relative z-10 flex min-h-[60svh] items-center justify-center px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.3 }}
          className="text-2xl leading-relaxed text-paper/90 sm:text-4xl sm:leading-snug light:text-ink/90"
        >
          <motion.p variants={textVariants} className="mb-6">
            这不是一本普通的书。
          </motion.p>
          <motion.p variants={textVariants} className="mb-6">
            <span className="text-ember">文字</span>勾勒轮廓，
            <span className="text-fern">声音</span>赋予情感，
            <span className="text-wine">画面</span>定格瞬间。
          </motion.p>
          <motion.p variants={textVariants}>
            创作者写下无数分支，而你，将在这个沉浸的故事空间里，找到属于自己的结局。
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
