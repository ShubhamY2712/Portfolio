"use client";

import { motion } from "motion/react";
import { Award, BadgeCheck, BookOpen, Feather, GraduationCap, Star, Trophy, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Achievement, Certification } from "@/lib/content";
import { LaurelMedal, Squiggle } from "@/components/Illustrations";

const ICONS: Record<string, LucideIcon> = {
  trophy: Trophy,
  users: Users,
  book: BookOpen,
  feather: Feather,
  award: Award,
  star: Star,
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Card title/detail, with a fallback for rows saved before migration-004. */
function cardText(a: Achievement): { title: string; detail: string } {
  if (a.title) return { title: a.title, detail: a.detail || "" };
  const text: string = a.text || "";
  const comma: number = text.indexOf(",");
  return comma > 0 ? { title: text.slice(0, comma), detail: text.slice(comma + 1).trim() } : { title: text, detail: "" };
}

function orgInitials(org: string | null): string {
  const first: string = (org || "").trim().split(/\s+/)[0] || "";
  // Keep short acronyms as-is (e.g. "AWS").
  if (/^[A-Z]{2,4}$/.test(first)) return first;
  const words: string[] = (org || "").replace(/[^A-Za-z0-9 .]/g, " ").split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map((w: string) => w[0]?.toUpperCase() ?? "").join("") || "C";
}

export default function RecognitionSection({
  achievements,
  certifications,
}: {
  achievements: Achievement[];
  certifications: Certification[];
}) {
  return (
    <div>
      {/* Heading */}
      <div className="mb-14 flex flex-col items-center text-center">
        <LaurelMedal className="mb-4 h-20 w-28" />
        <h2 id="recognition-title" className="font-display text-display-sm font-bold text-ink sm:text-display-md">
          Recognition
        </h2>
        <Squiggle className="mt-3 h-3 w-28 text-accent" />
      </div>

      {/* Achievements: award cards */}
      {achievements.length > 0 && (
        <div className="mb-16">
          <h3 className="mb-6 flex items-center gap-2 font-display text-lg font-semibold text-ink">
            <Trophy size={18} aria-hidden="true" className="text-accent" /> Achievements
          </h3>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((a: Achievement, i: number) => {
              const { title, detail } = cardText(a);
              const Icon: LucideIcon = ICONS[a.icon || ""] ?? Award;
              const featured: boolean = a.icon === "trophy";
              return (
                <motion.li
                  key={a.id}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -60px 0px" }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                  className={featured ? "sm:col-span-2 lg:col-span-3" : ""}
                >
                  <article
                    className={
                      "card-glow card-glow-hover group relative flex h-full gap-5 p-6 sm:p-7 " +
                      (featured ? "flex-col sm:flex-row sm:items-center sm:gap-8 sm:p-9" : "flex-col")
                    }
                  >
                    {/* Medallion */}
                    <span
                      aria-hidden="true"
                      className={
                        "relative flex shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent-soft text-accent shadow-[0_0_40px_rgba(255,197,61,0.25)] transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-105 " +
                        (featured ? "h-20 w-20 sm:h-24 sm:w-24" : "h-14 w-14")
                      }
                    >
                      <span className="absolute inset-1 rounded-full border border-dashed border-accent/30" />
                      <Icon size={featured ? 36 : 24} strokeWidth={1.6} />
                    </span>
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        {featured && (
                          <span className="rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-paper">
                            Winner
                          </span>
                        )}
                        {a.date && (
                          <span className="rounded-full border border-line px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-accent-light/80">
                            {a.date}
                          </span>
                        )}
                      </div>
                      <h4
                        className={
                          "font-display font-semibold text-ink " + (featured ? "text-2xl sm:text-3xl" : "text-xl")
                        }
                      >
                        {title}
                      </h4>
                      {a.issuer && (
                        <p className="mt-1 text-sm font-medium text-accent-light/80">Issued by {a.issuer}</p>
                      )}
                      {detail && <p className="mt-2 max-w-prose leading-relaxed text-ink-soft">{detail}</p>}
                    </div>
                  </article>
                </motion.li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Certifications: certificate tiles */}
      {certifications.length > 0 && (
        <div>
          <h3 className="mb-6 flex items-center gap-2 font-display text-lg font-semibold text-ink">
            <GraduationCap size={18} aria-hidden="true" className="text-accent" /> Certifications
          </h3>
          <ul className="grid gap-4 sm:grid-cols-2">
            {certifications.map((c: Certification, i: number) => {
              const done: boolean = c.status === "done";
              return (
                <motion.li
                  key={c.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -60px 0px" }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                >
                  <article
                    className={
                      "group relative flex h-full items-start gap-4 overflow-hidden rounded-2xl p-5 transition duration-300 motion-safe:hover:-translate-y-1 " +
                      (done
                        ? "border border-accent/30 bg-surface hover:shadow-card-hover"
                        : "border border-dashed border-line bg-surface/50 hover:border-accent/40")
                    }
                  >
                    {/* certificate corner ornament */}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 80 80"
                      className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 text-accent/10 transition-colors duration-300 group-hover:text-accent/20"
                    >
                      <circle cx="40" cy="40" r="30" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="4 5" />
                      <circle cx="40" cy="40" r="18" fill="currentColor" />
                    </svg>

                    <span
                      aria-hidden="true"
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line bg-paper font-display text-sm font-bold text-accent"
                    >
                      {orgInitials(c.org)}
                    </span>
                    <div className="relative min-w-0 flex-1">
                      <h4 className="font-display font-semibold leading-snug text-ink">{c.text}</h4>
                      <p className="mt-1 text-sm text-ink-soft">
                        {c.org}
                        {c.org && c.date ? " · " : ""}
                        {c.date}
                      </p>
                      <span className={"mt-3 " + (done ? "badge-done" : "badge-progress")}>
                        {done ? (
                          <BadgeCheck size={13} aria-hidden="true" className="text-accent" />
                        ) : (
                          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent motion-safe:animate-pulse" />
                        )}
                        {done ? "Completed" : "In progress"}
                      </span>
                    </div>
                  </article>
                </motion.li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
