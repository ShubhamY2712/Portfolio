import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import HeroIntro from "@/components/HeroIntro";
import FeaturedProject from "@/components/FeaturedProject";
import SectionHeading from "@/components/SectionHeading";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import RecognitionSection from "@/components/RecognitionSection";
import ResearchSection from "@/components/ResearchSection";
import { CursorSpotlight } from "@/components/Interactive";
import { createClient } from "@/lib/supabase/server";
import { safeHref, toStringArray } from "@/lib/content";
import type {
  Achievement,
  Certification,
  Profile,
  Project,
  ResearchPaper,
  Skill,
  Teardown,
} from "@/lib/content";

export const revalidate = 0;

const SECTION: string = "max-w-content mx-auto px-5 sm:px-6 py-14 sm:py-20";

// Bundled in /public; a photo uploaded in /admin takes priority.
const DEFAULT_PHOTO: string = "/shubham-yawalkar.jpg";
const DEFAULT_RESEARCH_COVER: string = "/research-cover.jpg";

// Used only until migration-004.sql has been run (or if a field is left empty).
const DEFAULT_PHRASES: string[] = [
  "an aspiring AI Product Manager",
  "a Full Stack Developer",
  "a co-author of published AI research",
];

// Used only until migration-003.sql has been run (or if the field is left empty).
const DEFAULT_CONTACT_LINE: string =
  "Open to AI Product Manager, Business Analyst and technical AI/ML internships and roles.";

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
  ] = await Promise.all([
    supabase.from("profile").select("*").eq("id", 1).single(),
    supabase.from("skills").select("*").order("sort_order"),
    supabase.from("projects").select("*").order("sort_order"),
    supabase.from("teardown").select("*").eq("id", 1).single(),
    supabase.from("achievements").select("*").order("sort_order"),
    supabase.from("certifications").select("*").order("sort_order"),
    supabase.from("research_paper").select("*").eq("id", 1).single(),
  ]);

  const profile = profileRes.data as Profile | null;
  const skills = (skillsRes.data ?? []) as Skill[];
  const projects = (projectsRes.data ?? []) as Project[];
  const teardown = teardownRes.data as Teardown | null;
  const achievements = (achievementsRes.data ?? []) as Achievement[];
  const certifications = (certificationsRes.data ?? []) as Certification[];
  const researchPaper = researchRes.data as ResearchPaper | null;

  const name: string = profile?.name || "";
  const phrases: string[] = toStringArray(profile?.typing_phrases);
  const contactLine: string = profile?.statement || DEFAULT_CONTACT_LINE;

  return (
    <>
      <CursorSpotlight />
      <Navbar name={name} resumeUrl={profile?.resume_url} />

      <main id="main">
        <HeroIntro
          name={name}
          photoUrl={profile?.photo_url || DEFAULT_PHOTO}
          resumeUrl={profile?.resume_url}
          intro={profile?.hero_intro || "I shape and build"}
          headline={profile?.hero_headline || "AI products,"}
          highlight={profile?.hero_highlight || "end to end."}
          phrases={phrases.length > 0 ? phrases : DEFAULT_PHRASES}
          currentlyText={profile?.currently_text}
          currentlyHref={safeHref(profile?.currently_url)}
        />

        {/* About */}
        {profile?.summary && (
          <section id="about" aria-labelledby="about-title" className={SECTION}>
            <AboutSection summary={profile.summary} />
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section id="skills" aria-labelledby="skills-title" className={SECTION}>
            <AnimatedSection>
              <SectionHeading id="skills-title" eyebrow="Skills" title="Product & technical toolkit" align="center" />
            </AnimatedSection>
            <SkillsSection skills={skills} />
          </section>
        )}

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
          <section id="research" aria-labelledby="research-title" className={SECTION}>
            <ResearchSection paper={researchPaper} coverUrl={researchPaper.cover_url || DEFAULT_RESEARCH_COVER} />
          </section>
        )}

        {/* Recognition: achievements + certifications */}
        {(achievements.length > 0 || certifications.length > 0) && (
          <section id="achievements" aria-labelledby="recognition-title" className={SECTION}>
            <RecognitionSection achievements={achievements} certifications={certifications} />
          </section>
        )}
      </main>

      <Footer
        name={name}
        email={profile?.email || ""}
        linkedin={profile?.linkedin}
        github={profile?.github}
        resumeUrl={profile?.resume_url}
        location={profile?.location}
        contactLine={contactLine}
      />
    </>
  );
}
