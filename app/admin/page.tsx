import { createClient } from "@/lib/supabase/server";
import { toStringArray } from "@/lib/content";
import type { Profile, ResearchPaper, Teardown } from "@/lib/content";
import {
  updateProfile,
  updateHomepageText,
  updateResearchDetails,
  uploadResearchCover,
  updateProfilePhoto,
  updateResume,
  updateResearchPaper,
  uploadResearchPaperPdf,
  updateTeardown,
} from "./actions";

export default async function AdminDashboard() {
  const supabase = createClient();
  const [profileRes, paperRes, teardownRes] = await Promise.all([
    supabase.from("profile").select("*").eq("id", 1).single(),
    supabase.from("research_paper").select("*").eq("id", 1).single(),
    supabase.from("teardown").select("*").eq("id", 1).single(),
  ]);
  const profile = profileRes.data as Profile | null;
  const paper = paperRes.data as ResearchPaper | null;
  const teardown = teardownRes.data as Teardown | null;
  // Hero fields exist only after supabase/migration-002.sql has been run.
  const heroReady: boolean = profile !== null && "hero_headline" in profile;

  return (
    <div className="space-y-10 max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink">Dashboard</h1>

      {/* Profile */}
      <section className="card p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-ink mb-4">Profile</h2>
        <form action={updateProfile} className="space-y-3">
          <Field label="Name" name="name" defaultValue={profile?.name} />
          <Field label="Tagline" name="tagline" defaultValue={profile?.tagline} />
          <Field label="Email" name="email" defaultValue={profile?.email} />
          <Field label="Phone" name="phone" defaultValue={profile?.phone} />
          <Field label="Location" name="location" defaultValue={profile?.location} />
          <Field label="LinkedIn URL" name="linkedin" defaultValue={profile?.linkedin} />
          <Field label="GitHub URL" name="github" defaultValue={profile?.github} />
          <TextArea label="About text (blank line = new paragraph, wrap words in [brackets] to highlight them)" name="summary" defaultValue={profile?.summary} />
          <SaveButton />
        </form>
      </section>

      {/* Homepage hero + banner */}
      <section className="card p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-ink mb-1">Homepage</h2>
        <p className="text-sm text-ink-soft mb-4">The hero headline, typing line and the line under &ldquo;Let&rsquo;s talk&rdquo;.</p>
        {!heroReady && (
          <p className="mb-4 rounded-md border border-accent/40 bg-accent-soft px-3 py-2 text-sm text-ink">
            Run <code>supabase/migration-002.sql</code> in the Supabase SQL Editor first, or these fields won&apos;t save.
          </p>
        )}
        <form action={updateHomepageText} className="space-y-3">
          <Field label="Small line above the headline" name="hero_intro" defaultValue={profile?.hero_intro} />
          <Field label="Headline" name="hero_headline" defaultValue={profile?.hero_headline} />
          <Field label="Highlighted words (amber, underlined)" name="hero_highlight" defaultValue={profile?.hero_highlight} />
          <TextArea
            label="Typing line phrases (one per line, shown after “I'm”)"
            name="typing_phrases"
            defaultValue={toStringArray(profile?.typing_phrases).join("\n")}
          />
          <Field label="“Currently” line" name="currently_text" defaultValue={profile?.currently_text} />
          <Field label="“Currently” link (e.g. /invai or a full URL)" name="currently_url" defaultValue={profile?.currently_url} />
          <TextArea label="Contact line (shown under “Let’s talk”)" name="statement" defaultValue={profile?.statement} />
          <SaveButton />
        </form>
      </section>

      {/* Photo + Resume uploads */}
      <section className="card p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-ink mb-4">Files</h2>
        <form action={updateProfilePhoto} className="mb-6">
          <label htmlFor="photo-upload" className="block text-sm text-ink-soft mb-1">Photo</label>
          <p className="text-xs text-ink-soft mb-2">Square works best. It is shown in a circle with a glow behind it.</p>
          {profile?.photo_url && (
            <img src={profile.photo_url} alt={"Current profile photo of " + (profile.name || "site owner")} className="w-16 h-16 rounded-full object-cover mb-2" />
          )}
          <input id="photo-upload" type="file" name="photo" accept="image/*" className="file-input mb-3" />
          <SaveButton label="Upload photo" />
        </form>
        <form action={updateResume}>
          <label htmlFor="resume-upload" className="block text-sm text-ink-soft mb-1">Resume (PDF)</label>
          {profile?.resume_url && (
            <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline block mb-2">
              Current resume
            </a>
          )}
          <input id="resume-upload" type="file" name="resume" accept="application/pdf" className="file-input mb-3" />
          <SaveButton label="Upload resume" />
        </form>
      </section>

      {/* Research paper */}
      <section className="card p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-ink mb-4">Research Paper</h2>
        <form action={updateResearchPaper} className="space-y-3 mb-4">
          <Field label="Title" name="title" defaultValue={paper?.title} />
          <Field label="Publication" name="publication" defaultValue={paper?.publication} />
          <Field label="Date" name="date" defaultValue={paper?.date} />
          <Field label="Note" name="note" defaultValue={paper?.note} />
          <SaveButton />
        </form>
        <form action={uploadResearchPaperPdf}>
          <label htmlFor="paper-upload" className="block text-sm text-ink-soft mb-1">PDF</label>
          {paper?.pdf_link && (
            <a href={paper.pdf_link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline block mb-2">
              Current PDF
            </a>
          )}
          <input id="paper-upload" type="file" name="pdf" accept="application/pdf" className="file-input mb-3" />
          <SaveButton label="Upload PDF" />
        </form>

        <div className="mt-6 border-t border-line pt-6">
          <h3 className="font-display text-base font-semibold text-ink mb-1">Publication details</h3>
          <p className="text-xs text-ink-soft mb-4">Shown next to the book cover. Needs <code>migration-005.sql</code>.</p>
          <form action={updateResearchDetails} className="space-y-3 mb-6">
            <Field label="Series" name="series" defaultValue={paper?.series} />
            <Field label="Series link" name="series_url" defaultValue={paper?.series_url} />
            <Field label="Volume" name="volume" defaultValue={paper?.volume} />
            <Field label="ISBN" name="isbn" defaultValue={paper?.isbn} />
            <Field label="DOI link (https://doi.org/…)" name="doi" defaultValue={paper?.doi} />
            <Field label="BISAC" name="bisac" defaultValue={paper?.bisac} />
            <SaveButton label="Save details" />
          </form>
          <form action={uploadResearchCover}>
            <label htmlFor="research-cover-upload" className="block text-sm text-ink-soft mb-1">Book cover image (optional)</label>
            <p className="text-xs text-ink-soft mb-2">The cover you sent is already built into the site; upload only to replace it.</p>
            {paper?.cover_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={paper.cover_url} alt="Current book cover" className="mb-2 h-32 w-auto rounded" />
            )}
            <input id="research-cover-upload" type="file" name="cover" accept="image/*" className="file-input mb-3" />
            <SaveButton label="Upload cover" />
          </form>
        </div>
      </section>

      {/* Teardown */}
      <section className="card p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-ink mb-4">Product Teardown</h2>
        <form action={updateTeardown} className="space-y-3">
          <Field label="Product name" name="product_name" defaultValue={teardown?.product_name} />
          <TextArea label="Teardown summary" name="summary" defaultValue={teardown?.summary} />
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input type="checkbox" name="placeholder" defaultChecked={teardown?.placeholder ?? true} />
            Still a placeholder (uncheck once it's really written)
          </label>
          <SaveButton />
        </form>
      </section>
    </div>
  );
}

function Field({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string | null }) {
  const id: string = "f-" + name + "-" + label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-ink-soft mb-1">{label}</label>
      <input
        id={id}
        name={name}
        defaultValue={defaultValue || ""}
        className="admin-input"
      />
    </div>
  );
}

function TextArea({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string | null }) {
  const id: string = "t-" + name + "-" + label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-ink-soft mb-1">{label}</label>
      <textarea
        id={id}
        name={name}
        defaultValue={defaultValue || ""}
        rows={name === "summary" ? 9 : 4}
        className="admin-input"
      />
    </div>
  );
}

function SaveButton({ label = "Save" }: { label?: string }) {
  return (
    <button
      type="submit"
      className="bg-primary text-paper text-sm font-medium px-4 py-2 rounded-md hover:bg-accent-light transition-colors"
    >
      {label}
    </button>
  );
}
