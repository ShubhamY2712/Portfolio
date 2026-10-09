import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import HeroIntro from "@/components/HeroIntro";
import HighlightCard from "@/components/HighlightCard";
import FeaturedProject from "@/components/FeaturedProject";
import SectionHeading from "@/components/SectionHeading";
import { createClient } from "@/lib/supabase/server";
import { safeHref, toStringArray } from "@/lib/content";
import type {
  Achievement,
  Certification,
  Highlight,
  Profile,
  Project,
  ResearchPaper,
  Skill,
  Teardown,
} from "@/lib/content";

export const revalidate = 0;

const SECTION: string = "max-w-content mx-auto px-5 sm:px-6 py-14 sm:py-20";

// Used only until migration-002.sql has been run (or if a field is left empty).
const DEFAULT_STATEMENT: string =
  "I'm currently looking for AI Product Manager and Business Analyst internships and roles.";

export default async function Home() {
  const supabase = createClient();

  const [
    profileRes,
    skillsRes,
    projectsRes,
    teardownRes,
    achievementsRes,
    certificationsRes,
    researchRes,
    highlightsRes,
  ] = await Promise.all([
    supabase.from("profile").select("*").eq("id", 1).single(),
    supabase.from("skills").select("*").order("sort_order"),
    supabase.from("projects").select("*").order("sort_order"),
    supabase.from("teardown").select("*").eq("id", 1).single(),
    supabase.from("achievements").select("*").order("sort_order"),
    supabase.from("certifications").select("*").order("sort_order"),
    supabase.from("research_paper").select("*").eq("id", 1).single(),
    supabase.from("highlights").select("*").order("sort_order"),
  ]);

  const profile = profileRes.data as Profile | null;
  const skills = (skillsRes.data ?? []) as Skill[];
  const projects = (projectsRes.data ?? []) as Project[];
  const teardown = teardownRes.data as Teardown | null;
  const achievements = (achievementsRes.data ?? []) as Achievement[];
  const certifications = (certificationsRes.data ?? []) as Certification[];
  const researchPaper = researchRes.data as ResearchPaper | null;
  // Empty until migration-002.sql creates the table; the section then hides.
  const highlights = (highlightsRes.error ? [] : highlightsRes.data ?? []) as Highlight[];

  const name: string = profile?.name || "";
  const phrases: string[] = toStringArray(profile?.typing_phrases);
  const statement: string = profile?.statement || DEFAULT_STATEMENT;
  // Show the admin note only if it adds something beyond "co-authored".
  const researchNote: string | null =
    researchPaper?.note && !/co-?author/i.test(researchPaper.note) ? researchPaper.note : null;

  return (
    <>
      <Navbar name={name} resumeUrl={profile?.resume_url} />

      <main id="main">
        <HeroIntro
          name={name}
          photoUrl={profile?.photo_url}
          resumeUrl={profile?.resume_url}
          intro={profile?.hero_intro || "I design and build"}
          headline={profile?.hero_headline || "AI products,"}
          highlight={profile?.hero_highlight || "end to end."}
          phrases={phrases.length > 0 ? phrases : profile?.tagline ? [profile.tagline] : []}
          currentlyText={profile?.currently_text}
          currentlyHref={safeHref(profile?.currently_url)}
        />

        {/* About + skills */}
        <AnimatedSection id="about" ariaLabelledby="about-title" className={SECTION}>
          <SectionHeading id="about-title" eyebrow="About" title="A little about me" align="center" />
          {profile?.summary && (
            <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-ink-soft sm:text-xl">
              {profile.summary}
            </p>
          )}
          {skills.length > 0 && (
            <div id="skills" className="mx-auto mt-12 max-w-3xl">
              <h3 className="sr-only">Skills and tools</h3>
              <ul className="flex flex-wrap justify-center gap-2">
                {skills.map((skill: Skill) => (
                  <li key={skill.id} className="chip">
                    {skill.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </AnimatedSection>

        {/* What I'm working on */}
        {highlights.length > 0 && (
          <AnimatedSection id="work" ariaLabelledby="work-title" className={SECTION}>
            <SectionHeading id="work-title" eyebrow="Experience" title="What I'm working on" align="center" />
            <ul className="mx-auto max-w-4xl space-y-5 sm:space-y-6">
              {highlights.map((h: Highlight) => (
                <li key={h.id}>
                  <HighlightCard
                    title={h.title}
                    subtitle={h.subtitle}
                    description={h.description}
                    link={h.link}
                    icon={h.icon}
                  />
                </li>
              ))}
            </ul>
          </AnimatedSection>
        )}

        {/* Statement banner */}
        <AnimatedSection ariaLabelledby="statement" className="relative isolate overflow-hidden py-16 sm:py-24">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_50%,rgba(255,197,61,0.10),transparent)]"
          />
          <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-line to-transparent" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-line to-transparent" />
          <p
            id="statement"
            className="max-w-content mx-auto px-5 text-center font-display text-2xl font-semibold leading-snug text-ink sm:px-6 sm:text-3xl md:text-4xl"
          >
            {statement}
          </p>
          <div className="mt-8 flex justify-center px-5">
            <Link href="#contact" className="btn-primary">
              Let&apos;s connect
            </Link>
          </div>
        </AnimatedSection>

        {/* Featured projects */}
        {projects.length > 0 && (
          <section id="projects" aria-labelledby="projects-title" className={SECTION}>
            <AnimatedSection>
              <SectionHeading id="projects-title" eyebrow="Selected work" title="Featured projects" align="center" />
            </AnimatedSection>
            <div className="space-y-20 sm:space-y-28">
              {projects.map((p: Project, i: number) => (
                <AnimatedSection key={p.slug}>
                  <FeaturedProject
                    slug={p.slug}
                    name={p.name || p.slug}
                    tag={p.tag || ""}
                    summary={p.summary || p.hook || ""}
                    tech={toStringArray(p.tech)}
                    dates={p.dates}
                    coverUrl={p.cover_url}
                    coverAlt={p.cover_alt}
                    reverse={i % 2 === 1}
                  />
                </AnimatedSection>
              ))}
            </div>
          </section>
        )}

        {/* Product thinking */}
        <AnimatedSection ariaLabelledby="thinking-title" className={SECTION}>
          <SectionHeading id="thinking-title" eyebrow="Product thinking" title="Product teardown" />
          <Link
            href="/teardown"
            className="card-glow card-glow-hover group flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
          >
            <div>
              {(teardown?.placeholder ?? true) ? (
                <>
                  <span className="badge-progress mb-3">In progress</span>
                  <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">Coming soon</h3>
                  <p className="mt-2 max-w-prose text-sm text-ink-soft">A product teardown is being written.</p>
                </>
              ) : (
                <>
                  <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">{teardown?.product_name}</h3>
                  {teardown?.summary && (
                    <p className="mt-2 line-clamp-3 max-w-prose text-sm leading-relaxed text-ink-soft">{teardown.summary}</p>
                  )}
                </>
              )}
            </div>
            <ArrowUpRight
              size={22}
              aria-hidden="true"
              className="shrink-0 text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </AnimatedSection>

        {/* Research */}
        {researchPaper?.title && (
          <AnimatedSection id="research" ariaLabelledby="research-title" className={SECTION}>
            <SectionHeading id="research-title" eyebrow="Research" title="Published work" />
            <article className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:p-8">
              <span
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent-soft text-accent"
              >
                <FileText size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <span className="badge-done mb-3">Co-authored</span>
                <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">{researchPaper.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">
                  {researchPaper.publication}
                  {researchPaper.publication && researchPaper.date ? " · " : ""}
                  {researchPaper.date}
                </p>
                {researchNote && <p className="mt-2 text-xs text-ink-soft">{researchNote}</p>}
                {researchPaper.pdf_link && (
                  <a
                    href={researchPaper.pdf_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                  >
                    Read the paper (PDF) <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                )}
              </div>
            </article>
          </AnimatedSection>
        )}

        {/* Achievements + certifications */}
        <AnimatedSection id="achievements" ariaLabelledby="achievements-title" className={SECTION}>
          <SectionHeading id="achievements-title" eyebrow="Recognition" title="Achievements & certifications" />
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <h3 className="mb-6 font-display text-lg font-semibold text-ink">Achievements</h3>
              <ol className="relative space-y-7 border-l border-line pl-6">
                {achievements.map((a: Achievement) => (
                  <li key={a.id} className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_12px_rgba(255,197,61,0.7)]"
                    />
                    {a.date && <p className="mb-1 text-xs font-medium uppercase tracking-wide text-accent-light/80">{a.date}</p>}
                    <p className="leading-relaxed text-ink/90">{a.text}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="mb-6 font-display text-lg font-semibold text-ink">Certifications</h3>
              <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
                {certifications.map((c: Certification) => {
                  const done: boolean = c.status === "done";
                  return (
                    <li key={c.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:p-5">
                      <div className="min-w-0">
                        <p className="text-ink">{c.text}</p>
                        <p className="mt-0.5 text-sm text-ink-soft">
                          {c.org}
                          {c.org && c.date ? " · " : ""}
                          {c.date}
                        </p>
                      </div>
                      <span className={done ? "badge-done" : "badge-progress"}>
                        <span aria-hidden="true" className={"h-1.5 w-1.5 rounded-full " + (done ? "bg-ink-soft" : "bg-accent")} />
                        {done ? "Completed" : "In progress"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </AnimatedSection>
      </main>

      <Footer
        name={name}
        email={profile?.email || ""}
        linkedin={profile?.linkedin}
        github={profile?.github}
        resumeUrl={profile?.resume_url}
      />
    </>
  );
}
