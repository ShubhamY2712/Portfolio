import type { Metadata } from "next";
import CaseStudy from "@/components/CaseStudy";
import { createClient } from "@/lib/supabase/server";
import { toStringArray } from "@/lib/content";
import type { Project } from "@/lib/content";

export const revalidate = 0;

const SLUG: string = "creditsaathi";

async function getProject(): Promise<Project | null> {
  const supabase = createClient();
  const { data } = await supabase.from("projects").select("*").eq("slug", SLUG).single();
  return data as Project | null;
}

export async function generateMetadata(): Promise<Metadata> {
  const p: Project | null = await getProject();
  return {
    title: (p?.name || "CreditSaathi") + " — case study",
    description: p?.summary || p?.hook || undefined,
  };
}

export default async function CreditSaathiPage() {
  const p: Project | null = await getProject();

  if (!p) return <p className="p-10 text-sm text-ink-soft">Project not found.</p>;

  return (
    <CaseStudy
      name={p.name || "CreditSaathi"}
      tag={p.tag || ""}
      role={p.role || ""}
      dates={p.dates || ""}
      tech={toStringArray(p.tech)}
      summary={p.summary || ""}
      bullets={toStringArray(p.bullets)}
      prdLink={p.prd_link}
      githubLink={p.github_link}
      figmaUrl={p.figma_url}
      loomUrl={p.loom_url}
      evalSheetUrl={p.eval_sheet_url}
      coverUrl={p.cover_url}
      coverAlt={p.cover_alt}
    />
  );
}
