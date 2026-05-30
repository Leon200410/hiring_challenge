"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import type { Novel } from "@/lib/types";

type NovelShelfProps = {
  novels: Novel[];
};

export function NovelShelf({ novels }: NovelShelfProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {novels.map((novel, index) => (
        <Link key={novel.id} href={`/novels/${novel.slug}`} className="group block">
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            whileHover={{ y: -4 }}
            className="grid min-h-72 overflow-hidden rounded-lg border border-white/12 bg-white/[0.06] shadow-2xl shadow-black/20 backdrop-blur md:grid-cols-[15rem_1fr] light:border-ink/10 light:bg-white/60"
          >
            <div className="relative min-h-72 overflow-hidden bg-ink">
              <Image
                src={novel.coverPath}
                alt={`${novel.title} 封面`}
                fill
                sizes="(min-width: 768px) 240px, 100vw"
                className="object-cover transition duration-700 group-hover:scale-105"
                priority={index === 0}
              />
            </div>
            <div className="flex flex-col justify-between p-5">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-ember">{novel.author}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-paper light:text-ink">
                      {novel.title}
                    </h3>
                  </div>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-paper/45 transition group-hover:text-ember light:text-ink/45"
                    size={20}
                  />
                </div>
                <p className="mt-4 line-clamp-5 text-sm leading-7 text-paper/68 light:text-ink/70">
                  {novel.summary}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm text-paper/58 light:text-ink/60">
                <Clock aria-hidden="true" size={16} />
                约 {novel.readingMinutes} 分钟
              </div>
            </div>
          </motion.article>
        </Link>
      ))}
    </div>
  );
}
