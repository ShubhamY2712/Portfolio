"use client";

import { motion } from "motion/react";
import { ArrowUpRight, BookOpen, FileText } from "lucide-react";
import type { ResearchPaper } from "@/lib/content";
import { TiltCard } from "@/components/Interactive";
import { Squiggle } from "@/components/Illustrations";

type Detail = { label: string; value: string; href?: string };

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Published research: the book cover as a tilting 3D "book", with the
 * publication details (date, series, volume, ISBN, DOI, BISAC) beside it.
 */
export default function ResearchSection({ paper, coverUrl }: { paper: ResearchPaper; coverUrl: string }) {
  // "Progress in Economics Research, Nova Publications" -> "Nova Publications" when the series is shown separately.
  const publisher: string | null =
    paper.publication && paper.series && paper.publication.startsWith(paper.series)
      ? paper.publication.slice(paper.series.length).replace(/^[\s,·-]+/, "") || paper.publication
      : paper.publication;

  const details: Detail[] = [
    paper.date ? { label: "Published", value: paper.date } : null,
    paper.series
      ? { label: "Series", value: paper.series + (paper.volume ? `, ${paper.volume}` : ""), href: paper.series_url || undefined }
      : null,
    publisher ? { label: "Publisher", value: publisher } : null,
    paper.isbn ? { label: "ISBN", value: paper.isbn } : null,
    paper.doi ? { label: "DOI", value: paper.doi.replace(/^https?:\/\/(dx\.)?doi\.org\//, ""), href: paper.doi } : null,
    paper.bisac ? { label: "BISAC", value: paper.bisac } : null,
  ].filter((d: Detail | null): d is Detail => d !== null);

  return (
    <div className="grid items-center gap-12 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
      {/* Book cover */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -60px 0px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative mx-auto w-full max-w-[220px] sm:max-w-[280px] md:max-w-[320px]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-[-12%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(255,197,61,0.28),transparent)] blur-2xl"
        />
        <TiltCard>
          <div className="relative">
            {/* page edges behind the cover */}
            <span aria-hidden="true" className="absolute inset-y-2 -right-2 w-3 rounded-r-sm bg-[repeating-linear-gradient(0deg,#e9e4d6_0_2px,#cfc8b6_2px_3px)]" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt={`Cover of ${paper.series || "the book"}${paper.volume ? ", " + paper.volume : ""}, where the paper “${paper.title}” is published`}
              width={320}
              height={511}
              loading="lazy"
              decoding="async"
              className="relative w-full rounded-l-sm rounded-r-md shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.06)]"
            />
            {/* spine highlight */}
            <span aria-hidden="true" className="absolute inset-y-0 left-0 w-3 rounded-l-sm bg-gradient-to-r from-black/35 to-transparent" />
          </div>
        </TiltCard>
      </motion.div>

      {/* Details */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -60px 0px" }}
        transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
      >
        <p className="eyebrow mb-2">Research</p>
        <Squiggle className="mb-5 h-3 w-24 text-accent" />
        <h2 id="research-title" className="sr-only">
          Published research
        </h2>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="badge-progress">
            <BookOpen size={12} aria-hidden="true" /> Published
          </span>
          <span className="badge-done">Co-authored</span>
        </div>
        <h3 className="font-display text-display-sm font-bold leading-tight text-ink sm:text-display-md">{paper.title}</h3>
        {paper.note && !/co-?author/i.test(paper.note) && <p className="mt-3 text-sm text-ink-soft">{paper.note}</p>}

        {details.length > 0 && (
          <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-line pt-6 sm:grid-cols-2">
            {details.map((d: Detail) => (
              <div key={d.label} className="min-w-0">
                <dt className="text-xs font-medium uppercase tracking-[0.14em] text-accent-light/80">{d.label}</dt>
                <dd className="mt-1 break-words text-ink">
                  {d.href ? (
                    <a
                      href={d.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 underline decoration-accent/40 underline-offset-4 hover:text-accent hover:decoration-accent"
                    >
                      {d.value}
                      <ArrowUpRight size={14} aria-hidden="true" className="shrink-0" />
                    </a>
                  ) : (
                    d.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {paper.doi && (
            <a href={paper.doi} target="_blank" rel="noopener noreferrer" className="btn-primary group">
              View publication
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          )}
          {paper.pdf_link && (
            <a href={paper.pdf_link} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <FileText size={16} aria-hidden="true" /> Read the paper (PDF)
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}
