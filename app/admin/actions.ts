"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ACHIEVEMENT_ICONS, formText, formUrl, HIGHLIGHT_ICONS, SKILL_CATEGORIES } from "@/lib/content";

// ---------- Profile ----------
export async function updateProfile(formData: FormData): Promise<void> {
  const supabase = createClient();
  await supabase
    .from("profile")
    .update({
      name: formData.get("name"),
      tagline: formData.get("tagline"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      location: formData.get("location"),
      linkedin: formData.get("linkedin"),
      github: formData.get("github"),
      summary: formData.get("summary"),
    })
    .eq("id", 1);
  revalidatePath("/");
  revalidatePath("/admin");
}

// Hero + homepage text (requires supabase/migration-002.sql).
export async function updateHomepageText(formData: FormData): Promise<void> {
  const supabase = createClient();
  const phrasesRaw: string = String(formData.get("typing_phrases") ?? "");
  const currentlyUrl: string | null = formText(formData, "currently_url");
  await supabase
    .from("profile")
    .update({
      hero_intro: formText(formData, "hero_intro"),
      hero_headline: formText(formData, "hero_headline"),
      hero_highlight: formText(formData, "hero_highlight"),
      typing_phrases: phrasesRaw
        .split("\n")
        .map((p: string) => p.trim())
        .filter(Boolean),
      currently_text: formText(formData, "currently_text"),
      // Internal paths ("/invai") or full http(s) URLs only.
      currently_url:
        currentlyUrl && (currentlyUrl.startsWith("/") || formUrl(formData, "currently_url")) ? currentlyUrl : null,
      statement: formText(formData, "statement"),
    })
    .eq("id", 1);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function uploadFile(file: File, folder: string): Promise<string> {
  const supabase = createClient();
  const fileName = `${folder}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from("portfolio-assets").upload(fileName, file, {
    upsert: true,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from("portfolio-assets").getPublicUrl(fileName);
  return data.publicUrl;
}

export async function updateProfilePhoto(formData: FormData): Promise<void> {
  const file = formData.get("photo") as File;
  if (!file || file.size === 0) return;
  const url = await uploadFile(file, "photo");
  const supabase = createClient();
  await supabase.from("profile").update({ photo_url: url }).eq("id", 1);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateResume(formData: FormData): Promise<void> {
  const file = formData.get("resume") as File;
  if (!file || file.size === 0) return;
  const url = await uploadFile(file, "resume");
  const supabase = createClient();
  await supabase.from("profile").update({ resume_url: url }).eq("id", 1);
  revalidatePath("/");
  revalidatePath("/admin");
}

// ---------- Skills ----------
export async function addSkill(formData: FormData): Promise<void> {
  const supabase = createClient();
  await supabase.from("skills").insert({ label: formData.get("label"), category: skillCategory(formData) });
  revalidatePath("/");
  revalidatePath("/admin/skills");
}

function skillCategory(formData: FormData): string {
  const value: string = formText(formData, "category") || "tools";
  return SKILL_CATEGORIES.includes(value) ? value : "tools";
}

// Requires supabase/migration-003.sql / 004.sql (skills.category).
export async function setSkillCategory(id: string, formData: FormData): Promise<void> {
  const supabase = createClient();
  await supabase.from("skills").update({ category: skillCategory(formData) }).eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/skills");
}

export async function deleteSkill(id: string): Promise<void> {
  const supabase = createClient();
  await supabase.from("skills").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/skills");
}

// ---------- Achievements ----------
export async function addAchievement(formData: FormData): Promise<void> {
  const supabase = createClient();
  await supabase.from("achievements").insert({
    text: formText(formData, "text") || formText(formData, "title"),
    date: formText(formData, "date"),
    title: formText(formData, "title"),
    detail: formText(formData, "detail"),
    icon: achievementIcon(formData),
  });
  revalidatePath("/");
  revalidatePath("/admin/achievements");
}

function achievementIcon(formData: FormData): string {
  const icon: string = formText(formData, "icon") || "award";
  return (ACHIEVEMENT_ICONS as readonly string[]).includes(icon) ? icon : "award";
}

// Card fields (requires supabase/migration-004.sql).
export async function updateAchievement(id: string, formData: FormData): Promise<void> {
  const supabase = createClient();
  await supabase
    .from("achievements")
    .update({
      title: formText(formData, "title"),
      detail: formText(formData, "detail"),
      date: formText(formData, "date"),
      icon: achievementIcon(formData),
    })
    .eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/achievements");
}

export async function deleteAchievement(id: string): Promise<void> {
  const supabase = createClient();
  await supabase.from("achievements").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/achievements");
}

// ---------- Certifications ----------
export async function addCertification(formData: FormData): Promise<void> {
  const supabase = createClient();
  await supabase.from("certifications").insert({
    text: formData.get("text"),
    org: formData.get("org"),
    date: formData.get("date"),
    status: formData.get("status"),
  });
  revalidatePath("/");
  revalidatePath("/admin/certifications");
}

export async function deleteCertification(id: string): Promise<void> {
  const supabase = createClient();
  await supabase.from("certifications").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/certifications");
}

// ---------- Projects ----------
export async function updateProject(slug: string, formData: FormData): Promise<void> {
  const supabase = createClient();
  const bulletsRaw: string = String(formData.get("bullets") ?? "");
  const techRaw: string = String(formData.get("tech") ?? "");
  await supabase
    .from("projects")
    .update({
      name: formData.get("name"),
      tag: formData.get("tag"),
      role: formData.get("role"),
      dates: formData.get("dates"),
      hook: formData.get("hook"),
      summary: formData.get("summary"),
      github_link: formData.get("github_link"),
      // prd_link is NOT set here: it is managed by uploadProjectPrd, and this
      // form has no prd_link field (setting it here used to wipe the PRD).
      // Store real arrays in the jsonb columns (not JSON strings).
      bullets: bulletsRaw
        .split("\n")
        .map((b: string) => b.trim())
        .filter(Boolean),
      tech: techRaw
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean),
    })
    .eq("slug", slug);
  revalidatePath("/");
  revalidatePath(`/${slug}`);
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${slug}`);
}

// Optional case-study embeds (requires supabase/migration-002.sql).
// Empty or invalid URLs are saved as null, which hides that slot.
export async function updateProjectEmbeds(slug: string, formData: FormData): Promise<void> {
  const supabase = createClient();
  await supabase
    .from("projects")
    .update({
      figma_url: formUrl(formData, "figma_url"),
      loom_url: formUrl(formData, "loom_url"),
      eval_sheet_url: formUrl(formData, "eval_sheet_url"),
    })
    .eq("slug", slug);
  revalidatePath(`/${slug}`);
  revalidatePath(`/admin/projects/${slug}`);
}

export async function uploadProjectPrd(slug: string, formData: FormData): Promise<void> {
  const file = formData.get("prd") as File;
  if (!file || file.size === 0) return;
  const url = await uploadFile(file, `prd-${slug}`);
  const supabase = createClient();
  await supabase.from("projects").update({ prd_link: url }).eq("slug", slug);
  revalidatePath("/");
  revalidatePath(`/${slug}`);
}

export async function uploadProjectCover(slug: string, formData: FormData): Promise<void> {
  const file = formData.get("cover") as File | null;
  const supabase = createClient();
  const alt: string | null = formText(formData, "cover_alt");
  if (file && file.size > 0) {
    const url: string = await uploadFile(file, `cover-${slug}`);
    await supabase.from("projects").update({ cover_url: url, cover_alt: alt }).eq("slug", slug);
  } else {
    // No new file: just update the alt text.
    await supabase.from("projects").update({ cover_alt: alt }).eq("slug", slug);
  }
  revalidatePath("/");
  revalidatePath(`/${slug}`);
  revalidatePath(`/admin/projects/${slug}`);
}

export async function removeProjectCover(slug: string): Promise<void> {
  const supabase = createClient();
  // Clears the link only; the file stays in Storage.
  await supabase.from("projects").update({ cover_url: null }).eq("slug", slug);
  revalidatePath("/");
  revalidatePath(`/${slug}`);
  revalidatePath(`/admin/projects/${slug}`);
}

// ---------- Highlights ("What I'm working on" cards) ----------
function highlightIcon(formData: FormData): string {
  const icon: string = formText(formData, "icon") || "spark";
  return (HIGHLIGHT_ICONS as readonly string[]).includes(icon) ? icon : "spark";
}

function highlightLink(formData: FormData): string | null {
  const link: string | null = formText(formData, "link");
  if (!link) return null;
  return link.startsWith("/") || formUrl(formData, "link") ? link : null;
}

export async function addHighlight(formData: FormData): Promise<void> {
  const supabase = createClient();
  const order: number = Number(formData.get("sort_order")) || 0;
  await supabase.from("highlights").insert({
    title: formText(formData, "title") || "Untitled",
    subtitle: formText(formData, "subtitle"),
    description: formText(formData, "description"),
    link: highlightLink(formData),
    icon: highlightIcon(formData),
    sort_order: order,
  });
  revalidatePath("/");
  revalidatePath("/admin/highlights");
}

export async function updateHighlight(id: string, formData: FormData): Promise<void> {
  const supabase = createClient();
  const order: number = Number(formData.get("sort_order")) || 0;
  await supabase
    .from("highlights")
    .update({
      title: formText(formData, "title") || "Untitled",
      subtitle: formText(formData, "subtitle"),
      description: formText(formData, "description"),
      link: highlightLink(formData),
      icon: highlightIcon(formData),
      sort_order: order,
    })
    .eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/highlights");
}

export async function deleteHighlight(id: string): Promise<void> {
  const supabase = createClient();
  await supabase.from("highlights").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/highlights");
}

// ---------- Research paper ----------
export async function updateResearchPaper(formData: FormData): Promise<void> {
  const supabase = createClient();
  await supabase
    .from("research_paper")
    .update({
      title: formData.get("title"),
      publication: formData.get("publication"),
      date: formData.get("date"),
      note: formData.get("note"),
    })
    .eq("id", 1);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function uploadResearchPaperPdf(formData: FormData): Promise<void> {
  const file = formData.get("pdf") as File;
  if (!file || file.size === 0) return;
  const url = await uploadFile(file, "research-paper");
  const supabase = createClient();
  await supabase.from("research_paper").update({ pdf_link: url }).eq("id", 1);
  revalidatePath("/");
  revalidatePath("/admin");
}

// ---------- Teardown ----------
export async function updateTeardown(formData: FormData): Promise<void> {
  const supabase = createClient();
  await supabase
    .from("teardown")
    .update({
      product_name: formData.get("product_name"),
      summary: formData.get("summary"),
      placeholder: formData.get("placeholder") === "on",
    })
    .eq("id", 1);
  revalidatePath("/");
  revalidatePath("/teardown");
  revalidatePath("/admin");
}

// ---------- Auth ----------
export async function logout(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
