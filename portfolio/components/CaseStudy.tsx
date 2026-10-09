import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Github, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import EmbedSlots from "@/components/EmbedSlots";
import { createClient } from "@/lib/supabase/server";
import { safeUrl } from "@/lib/content";
import type { Profile } from "@/lib/content";

export default async function CaseStudy({
  name,
  tag,
  role,
  dates,
  tech,
  summary,
  bullets,
  prdLink,
  githubLink,
  figmaUrl,
  loomUrl,
  evalSheetUrl,
  coverUrl,
  coverAlt,
}: {
  name: string;
  tag: string;
  role: string;
  dates: string;
  tech: string[];
  summary: string;
  bullets: string[];
  prdLink?: string | null;
  githubLink?: string | null;
  figmaUrl?: string | null;
  loomUrl?: string | null;
  evalSheetUrl?: string | null;
  coverUrl?: string | null;
  coverAlt?: string | null;
}) {
  const supabase = createClient();
  const { data } = await supabase.from("profile").select("*").eq("id", 1).single();
  const profile = data as Profile | null;

  const inProgress: boolean = /present/i.test(dates);
  const hasArtifacts: boolean = Boolean(safeUrl(figmaUrl) || safeUrl(loomUrl) || safeUrl(evalSheetUrl));
  const hasLinks: boolean = Boolean(prdLink || githubLink);

  return (
    <>
      <Navbar name={profile?.name || ""} resumeUrl={profile?.resume_url} />
      <main id="main">
        <article className="max-w-content mx-auto px-5 pb-10 pt-10 sm:px-6 sm:pt-14">
          <Link
            href="/#projects"
            className="mb-10 inline-flex min-h-11 items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft size={14} aria-hidden="true" /> Back to projects
          </Link>

          <AnimatedSection ariaLabelledby="case-title" className="mb-12 border-b border-line pb-12 sm:mb-16 sm:pb-16">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <p className="eyebrow">{tag}</p>
              {inProgress && (
                <span className="badge-progress">In progress</span>
              )}
            </div>
            <h1 id="case-title" className="mb-6 font-display text-display-md font-bold text-ink sm:text-display-lg">
              {name}
            </h1>
            {summary && <p className="max-w-prose text-lg leading-relaxed text-ink sm:text-xl">{summary}</p>}

            <dl className="mt-10 grid gap-6 sm:grid-cols-3">
              {role && <Meta label="Role">{role}</Meta>}
              {dates && <Meta label="Timeline">{dates}</Meta>}
              {tech.length > 0 && (
                <div>
                  <dt className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-soft">Stack</dt>
                  <dd>
                    <ul className="flex flex-wrap gap-1.5">
                      {tech.map((t: string) => (
                        <li key={t} className="tag">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
            </dl>
          </AnimatedSection>

          {coverUrl && (
            <AnimatedSection className="mb-12 sm:mb-16">
              <div className="overflow-hidden rounded-2xl border border-line shadow-[0_0_80px_-24px_rgba(255,197,61,0.4)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverUrl}
                  alt={coverAlt || name + " product preview"}
                  decoding="async"
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>
            </AnimatedSection>
          )}

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16">
            <div className="min-w-0 space-y-14">
              {bullets.length > 0 && (
                <AnimatedSection ariaLabelledby="approach-title">
                  <h2 id="approach-title" className="mb-6 font-display text-display-sm font-bold text-ink">
                    Approach &amp; decisions
                  </h2>
                  <ol className="space-y-6">
                    {bullets.map((b: string, i: number) => (
                      <li key={i} className="flex gap-4">
                        <span
                          aria-hidden="true"
                          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent-soft font-display text-sm font-semibold text-accent"
                        >
                          {i + 1}
                        </span>
                        <p className="max-w-prose leading-relaxed text-ink-soft">{b}</p>
                      </li>
                    ))}
                  </ol>
                </AnimatedSection>
              )}

              {hasArtifacts && (
                <AnimatedSection ariaLabelledby="artifacts-title">
                  <h2 id="artifacts-title" className="mb-6 font-display text-display-sm font-bold text-ink">
                    Artifacts
                  </h2>
                  <EmbedSlots projectName={name} figmaUrl={figmaUrl} loomUrl={loomUrl} evalSheetUrl={evalSheetUrl} />
                </AnimatedSection>
              )}
            </div>

            {hasLinks && (
              <aside aria-label="Project links" className="lg:sticky lg:top-24 lg:self-start">
                <div className="card p-5">
                  <p className="mb-4 text-xs font-medium uppercase tracking-wide text-ink-soft">Documents &amp; code</p>
                  <div className="flex flex-col gap-2">
                    {prdLink && (
                      <a href={prdLink} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full justify-start">
                        <FileText size={16} aria-hidden="true" /> View AI PRD
                      </a>
                    )}
                    {githubLink && (
                      <a href={githubLink} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full justify-start">
                        <Github size={16} aria-hidden="true" /> View code on GitHub
                      </a>
                    )}
                  </div>
                </div>
              </aside>
            )}
          </div>
        </article>
      </main>
      <Footer
        name={profile?.name || ""}
        email={profile?.email || ""}
        linkedin={profile?.linkedin}
        github={profile?.github}
        resumeUrl={profile?.resume_url}
      />
    </>
  );
}

function Meta({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</dt>
      <dd className="text-ink">{children}</dd>
    </div>
  );
}
