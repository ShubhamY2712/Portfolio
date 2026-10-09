import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { removeProjectCover, updateProject, updateProjectEmbeds, uploadProjectCover, uploadProjectPrd } from "../../actions";
import { toStringArray } from "@/lib/content";
import type { Project } from "@/lib/content";

export default async function EditProject({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data } = await supabase.from("projects").select("*").eq("slug", params.slug).single();
  const p = data as Project | null;

  if (!p) return <p className="text-sm text-ink-soft">Project not found.</p>;

  const updateWithSlug = updateProject.bind(null, params.slug);
  const updateEmbedsWithSlug = updateProjectEmbeds.bind(null, params.slug);
  const uploadPrdWithSlug = uploadProjectPrd.bind(null, params.slug);
  const uploadCoverWithSlug = uploadProjectCover.bind(null, params.slug);
  const removeCoverWithSlug = removeProjectCover.bind(null, params.slug);
  // If migration-002.sql hasn't been run, these keys are missing entirely.
  const embedsReady: boolean = "figma_url" in p;

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">Edit: {p.name}</h1>
        <Link href={`/${p.slug}`} target="_blank" className="text-sm text-primary hover:underline">
          View case study &rarr;
        </Link>
      </div>

      <form action={updateWithSlug} className="card space-y-4 p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Details</h2>
        <Field label="Name" name="name" defaultValue={p.name} />
        <Field label="Tag / one-line description" name="tag" defaultValue={p.tag} />
        <Field label="Role" name="role" defaultValue={p.role} />
        <Field label="Dates" name="dates" defaultValue={p.dates} hint='Include "Present" to show an "In progress" badge.' />
        <Field label="Tech (comma-separated)" name="tech" defaultValue={toStringArray(p.tech).join(", ")} />
        <Field label="Hook (one-line, shown on homepage card)" name="hook" defaultValue={p.hook} />
        <TextArea label="Summary" name="summary" defaultValue={p.summary} rows={3} />
        <TextArea
          label="Bullets (one per line)"
          name="bullets"
          defaultValue={toStringArray(p.bullets).join("\n")}
          rows={6}
          mono
        />
        <Field label="GitHub link" name="github_link" defaultValue={p.github_link} type="url" />
        <SaveButton />
      </form>

      <form action={updateEmbedsWithSlug} className="card space-y-4 p-5 sm:p-6">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">Case-study embeds</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Optional. Each one appears on the case-study page only when a URL is set. Leave blank to hide it.
          </p>
        </div>
        {!embedsReady && (
          <p className="rounded-md border border-accent/40 bg-accent-soft px-3 py-2 text-sm text-ink">
            Run <code>supabase/migration-002.sql</code> in the Supabase SQL Editor first, or these fields won&apos;t save.
          </p>
        )}
        <Field
          label="Figma mockup URL"
          name="figma_url"
          defaultValue={p.figma_url}
          type="url"
          hint="A figma.com file, design or prototype link (set sharing to “Anyone with the link”)."
        />
        <Field
          label="Loom video URL"
          name="loom_url"
          defaultValue={p.loom_url}
          type="url"
          hint="A loom.com/share/… link."
        />
        <Field
          label="Eval sheet URL"
          name="eval_sheet_url"
          defaultValue={p.eval_sheet_url}
          type="url"
          hint="Shown as a link button (e.g. a Google Sheet)."
        />
        <SaveButton label="Save embeds" />
      </form>

      <section className="card space-y-4 p-5 sm:p-6">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">Cover image</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Shown large in &ldquo;Featured projects&rdquo; and at the top of the case study. A 16:10 screenshot or mockup works best.
          </p>
        </div>
        {!embedsReady && (
          <p className="rounded-md border border-accent/40 bg-accent-soft px-3 py-2 text-sm text-ink">
            Run <code>supabase/migration-002.sql</code> first, or the cover won&apos;t save.
          </p>
        )}
        {p.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.cover_url}
            alt={p.cover_alt || "Current cover image for " + (p.name || p.slug)}
            className="aspect-[16/10] w-full rounded-lg border border-line object-cover"
          />
        )}
        <form action={uploadCoverWithSlug} className="space-y-3">
          <div>
            <label htmlFor="cover" className="mb-1 block text-sm text-ink-soft">
              Image file
            </label>
            <input id="cover" type="file" name="cover" accept="image/*" className="file-input" />
          </div>
          <Field
            label="Alt text (describe the image for screen readers)"
            name="cover_alt"
            defaultValue={p.cover_alt}
            hint="e.g. “InvAI dashboard showing inventory levels and purchase orders”."
          />
          <SaveButton label="Save cover" />
        </form>
        {p.cover_url && (
          <form action={removeCoverWithSlug}>
            <button className="text-xs text-red-400 hover:underline">Remove cover from the site</button>
          </form>
        )}
      </section>

      <form action={uploadPrdWithSlug} className="card p-5 sm:p-6">
        <label htmlFor="prd" className="mb-1 block text-sm text-ink-soft">
          AI PRD (PDF)
        </label>
        {p.prd_link && (
          <a href={p.prd_link} target="_blank" rel="noopener noreferrer" className="mb-2 block text-sm text-primary underline">
            Current PRD
          </a>
        )}
        <input id="prd" type="file" name="prd" accept="application/pdf" className="file-input mb-3" />
        <SaveButton label="Upload PRD" />
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  type?: "text" | "url";
  hint?: string;
}) {
  const hintId: string = name + "-hint";
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm text-ink-soft">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue || ""}
        aria-describedby={hint ? hintId : undefined}
        className="admin-input"
      />
      {hint && (
        <p id={hintId} className="mt-1 text-xs text-ink-soft">
          {hint}
        </p>
      )}
    </div>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  rows = 4,
  mono = false,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
  mono?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm text-ink-soft">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue || ""}
        rows={rows}
        className={"admin-input" + (mono ? " font-mono text-xs" : "")}
      />
    </div>
  );
}

function SaveButton({ label = "Save" }: { label?: string }) {
  return (
    <button type="submit" className="btn-primary px-4 py-2">
      {label}
    </button>
  );
}
