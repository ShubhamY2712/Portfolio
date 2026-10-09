"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";
import { ArrowRight, ArrowUpRight, FileDown } from "lucide-react";
import TypingLine from "@/components/TypingLine";
import { initials, shortName } from "@/lib/content";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

// Headline words rise from behind a mask.
const word: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.8, ease: EASE } },
};

/**
 * Signature entrance (plays once): photo glows in, the headline rises word by
 * word, then a hand-drawn amber underline sketches itself under the
 * highlighted words. "Reduce motion" shows everything in place, no movement.
 */
export default function HeroIntro({
  name,
  photoUrl,
  resumeUrl,
  intro,
  headline,
  highlight,
  phrases,
  currentlyText,
  currentlyHref,
}: {
  name: string;
  photoUrl?: string | null;
  resumeUrl?: string | null;
  intro: string;
  headline: string;
  highlight: string;
  phrases: string[];
  currentlyText?: string | null;
  currentlyHref?: string | null;
}) {
  const reduce: boolean | null = useReducedMotion();
  const headlineWords: string[] = headline.split(/\s+/).filter(Boolean);
  const first: string = shortName(name);

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* Ambient amber glow behind the hero. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-12rem] -z-10 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full md:left-[28%] bg-[radial-gradient(closest-side,rgba(255,197,61,0.16),rgba(255,197,61,0))]"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-content mx-auto grid items-center gap-10 px-5 pb-16 pt-12 sm:px-6 sm:pt-16 md:grid-cols-[auto_minmax(0,1fr)] md:gap-14 md:pb-24 md:pt-20 lg:gap-20"
      >
        {/* Left: greeting + photo */}
        <div className="flex flex-col items-center">
        {first && (
          <motion.p variants={fadeUp} className="mb-6 font-display text-base text-ink sm:text-lg">
            Hello! I&apos;m <span className="font-semibold text-accent">{first}</span>
          </motion.p>
        )}

        {/* Photo with glow */}
        <motion.div
          className="relative"
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            show: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: EASE } },
          }}
        >
          <div aria-hidden="true" className="absolute inset-[-30%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(255,197,61,0.45),rgba(255,197,61,0.08)_60%,transparent)] blur-2xl" />
          <div className="relative h-44 w-44 overflow-hidden rounded-full border border-accent/40 bg-gradient-to-b from-accent-soft to-surface shadow-glow sm:h-52 sm:w-52 md:h-64 md:w-64 lg:h-80 lg:w-80">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt={"Portrait of " + name}
                width={320}
                height={320}
                loading="eager"
                decoding="async"
                className="h-full w-full object-cover object-top"
              />
            ) : (
              <span
                role="img"
                aria-label={"Monogram for " + name}
                className="flex h-full w-full items-center justify-center font-display text-5xl font-semibold text-accent md:text-6xl"
              >
                {initials(name)}
              </span>
            )}
          </div>
        </motion.div>
        </div>

        {/* Right: headline, typing line, actions */}
        <div className="flex min-w-0 flex-col items-center text-center md:items-start md:text-left">
        {/* Headline */}
        <motion.p variants={fadeUp} className="mb-2 font-display text-xl text-ink sm:text-2xl md:text-3xl">
          {intro}
        </motion.p>
        <h1
          id="hero-title"
          className="font-display text-[2.6rem] font-bold leading-[1.05] tracking-tight text-ink sm:text-display-lg lg:text-display-xl"
        >
          <span className="sr-only">
            {intro} {headline} {highlight}
          </span>
          <span aria-hidden="true" className="block">
            <span className="flex flex-wrap justify-center gap-x-[0.25em] md:justify-start">
              {headlineWords.map((w: string, i: number) => (
                <span key={w + i} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em]">
                  <motion.span variants={word} className="inline-block">
                    {w}
                  </motion.span>
                </span>
              ))}
            </span>
            {highlight && (
              <span className="relative inline-block">
                <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em]">
                  <motion.span variants={word} className="inline-block text-accent">
                    {highlight}
                  </motion.span>
                </span>
                {/* Hand-drawn underline */}
                <svg
                  viewBox="0 0 300 24"
                  preserveAspectRatio="none"
                  className="absolute -bottom-2 left-0 h-[0.35em] w-full overflow-visible text-accent sm:-bottom-3"
                >
                  <motion.path
                    d="M4 16 C 60 6, 120 4, 180 9 S 270 14, 296 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.9, ease: "easeInOut" }}
                  />
                </svg>
              </span>
            )}
          </span>
        </h1>

        {phrases.length > 0 && (
          <motion.div variants={fadeUp} className="mt-10 w-full max-w-2xl">
            <TypingLine
              phrases={phrases}
              className="font-display text-2xl font-semibold text-ink sm:text-3xl"
            />
          </motion.div>
        )}

        {currentlyText && (
          <motion.p variants={fadeUp} className="mt-4 text-base text-ink-soft sm:text-lg">
            {currentlyHref ? (
              <Link href={currentlyHref} className="group inline-flex items-center gap-1.5 hover:text-ink">
                {currentlyText}
                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                  className="text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            ) : (
              currentlyText
            )}
          </motion.p>
        )}

        <motion.div variants={fadeUp} className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row md:justify-start">
          <Link href="#projects" className="btn-primary group w-full sm:w-auto">
            View projects
            <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          {resumeUrl && (
            <a href={resumeUrl} download target="_blank" rel="noopener noreferrer" className="btn-secondary w-full sm:w-auto">
              <FileDown size={16} aria-hidden="true" /> Download resume
            </a>
          )}
        </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
