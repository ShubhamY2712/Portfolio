"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";
import { Award, BookOpen, Rocket, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { parseHighlights } from "@/lib/content";
import type { RichPart } from "@/lib/content";
import { CountUp } from "@/components/Interactive";
import { IdeaToCode, Squiggle } from "@/components/Illustrations";

type Stat = { icon: LucideIcon; value?: number; suffix?: string; text?: string; label: string };

// Facts only (from your projects, paper, NSS role and HackVerse award).
const STATS: Stat[] = [
  { icon: Rocket, value: 2, label: "AI products in progress" },
  { icon: BookOpen, value: 1, label: "co-authored published paper" },
  { icon: Users, value: 200, label: "NSS volunteers led" },
  { icon: Award, text: "Winner", label: "Best Social Impact Award, HackVerse" },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const paragraph: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/**
 * About: story on the left with amber "marker" highlights that sweep in
 * as each paragraph scrolls into view; quick facts with count-up numbers
 * and an idea-to-code illustration on the right.
 */
export default function AboutSection({ summary }: { summary: string }) {
  const reduce: boolean | null = useReducedMotion();
  const paragraphs: string[] = summary
    .split(/\n\s*\n/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
      <div>
        <p className="eyebrow mb-2">About</p>
        <Squiggle className="mb-5 h-3 w-24 text-accent" />
        <h2 id="about-title" className="mb-8 font-display text-display-sm font-bold text-ink sm:text-display-md">
          A little about <span className="text-accent">me</span>
        </h2>
        <div className="space-y-6">
          {paragraphs.map((p: string, i: number) => (
            <motion.p
              key={i}
              variants={paragraph}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "0px 0px -80px 0px" }}
              className={
                "leading-relaxed text-ink-soft " + (i === 0 ? "text-xl text-ink/90 sm:text-2xl" : "text-lg")
              }
            >
              {parseHighlights(p).map((part: RichPart, j: number) =>
                part.highlight ? (
                  <motion.mark
                    key={j}
                    className="rounded-sm bg-no-repeat px-0.5 font-medium text-ink"
                    style={{
                      backgroundColor: "transparent",
                      backgroundImage: "linear-gradient(transparent 58%, rgba(255,197,61,0.38) 58%)",
                    }}
                    initial={{ backgroundSize: reduce ? "100% 100%" : "0% 100%" }}
                    whileInView={{ backgroundSize: "100% 100%" }}
                    viewport={{ once: true, margin: "0px 0px -80px 0px" }}
                    transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.35 + j * 0.06, ease: EASE }}
                  >
                    {part.text}
                  </motion.mark>
                ) : (
                  <span key={j}>{part.text}</span>
                )
              )}
            </motion.p>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="card-glow hidden p-6 sm:block">
          <IdeaToCode className="h-auto w-full" />
          <p className="mt-2 text-center text-xs uppercase tracking-[0.16em] text-ink-soft">From idea to code</p>
        </div>
        <ul className="grid grid-cols-2 gap-4">
          {STATS.map((s: Stat, i: number) => {
            const Icon: LucideIcon = s.icon;
            return (
              <motion.li
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -60px 0px" }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
                className="card group p-5 transition-colors duration-300 hover:border-accent/40"
              >
                <Icon
                  size={20}
                  aria-hidden="true"
                  className="mb-3 text-accent transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
                />
                <p className="font-display text-3xl font-bold text-ink">
                  {typeof s.value === "number" ? <CountUp value={s.value} suffix={s.suffix} /> : s.text}
                </p>
                <p className="mt-1 text-sm leading-snug text-ink-soft">{s.label}</p>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
