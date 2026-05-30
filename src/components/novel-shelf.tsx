"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Novel } from "@/lib/types";

type NovelShelfProps = {
  novels: Novel[];
};

export function NovelShelf({ novels }: NovelShelfProps) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
      {novels.map((novel, index) => (
        <Link key={novel.id} href={`/novels/${novel.slug}`} className="group block">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: index * 0.05 }}
            className="flex flex-row gap-5 sm:flex-col sm:gap-0"
          >
            {/* Image Section */}
            <div className="relative w-28 shrink-0 overflow-hidden bg-ink/5 sm:mb-6 sm:w-full sm:aspect-4/5 aspect-[3/4] light:bg-paper/30">
              <Image
                src={novel.coverPath}
                alt={`${novel.title} 封面`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 112px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                priority={index < 3}
              />
            </div>

            {/* Text Section */}
            <div className="flex flex-col justify-center sm:justify-start">
              <div className="flex items-center gap-3 text-xs font-medium tracking-wider text-ember uppercase">
                <span>{novel.author}</span>
                <span className="h-px w-4 bg-ember/40"></span>
                <span className="text-paper/40 light:text-ink/40">
                  {novel.readingMinutes} MIN READ
                </span>
              </div>
              
              <h3 className="mt-3 text-xl font-semibold leading-snug tracking-tight text-paper transition-colors group-hover:text-white sm:text-2xl light:text-ink light:group-hover:text-black">
                {novel.title}
              </h3>
              
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-paper/60 sm:mt-3 sm:line-clamp-3 light:text-ink/60">
                {novel.summary}
              </p>
            </div>
          </motion.article>
        </Link>
      ))}
    </div>
  );
}
