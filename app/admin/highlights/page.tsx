import { createClient } from "@/lib/supabase/server";
import { addHighlight, deleteHighlight, updateHighlight } from "../actions";
import { HIGHLIGHT_ICONS } from "@/lib/content";
import type { Highlight } from "@/lib/content";

export default async function HighlightsAdmin() {
  const supabase = createClient();
  const { data, error } = await supabase.from("highlights").select("*").order("sort_order");
  const highlights = (data ?? []) as Highlight[];

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">What I&apos;m working on</h1>
      <p className="text-sm text-ink-soft mb-6">The glowing cards on the homepage. Lower sort order shows first.</p>

      {error && (
        <p className="mb-6 rounded-md border border-accent/40 bg-accent-soft px-3 py-2 text-sm text-ink">
          Run <code>supabase/migration-002.sql</code> in the Supabase SQL Editor to create this table.
        </p>
      )}

      <form action={addHighlight} className="card mb-10 space-y-3 p-5">
        <h2 className="font-display text-lg font-semibold text-ink">Add a card</h2>
        <HighlightFields idPrefix="new" />
        <button className="bg-primary text-paper text-sm font-semibold px-4 py-2 rounded-md hover:bg-accent-light">
          Add card
        </button>
      </form>

      <ul className="space-y-6">
        {highlights.map((h: Highlight) => (
          <li key={h.id} className="card p-5">
            <form action={updateHighlight.bind(null, h.id)} className="space-y-3">
              <HighlightFields idPrefix={h.id} value={h} />
              <button className="bg-primary text-paper text-sm font-semibold px-4 py-2 rounded-md hover:bg-accent-light">
                Save
              </button>
            </form>
            <form action={deleteHighlight.bind(null, h.id)} className="mt-3 border-t border-line pt-3">
              <button className="text-red-400 text-xs hover:underline">Remove this card</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HighlightFields({ idPrefix, value }: { idPrefix: string; value?: Highlight }) {
  const id = (field: string): string => `${idPrefix}-${field}`;
  return (
    <>
      <div>
        <label htmlFor={id("title")} className="mb-1 block text-sm text-ink-soft">Title</label>
        <input id={id("title")} name="title" required defaultValue={value?.title || ""} className="admin-input" />
      </div>
      <div>
        <label htmlFor={id("subtitle")} className="mb-1 block text-sm text-ink-soft">Role · dates</label>
        <input id={id("subtitle")} name="subtitle" defaultValue={value?.subtitle || ""} className="admin-input" />
      </div>
      <div>
        <label htmlFor={id("description")} className="mb-1 block text-sm text-ink-soft">Description</label>
        <textarea id={id("description")} name="description" rows={3} defaultValue={value?.description || ""} className="admin-input" />
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_140px_100px]">
        <div>
          <label htmlFor={id("link")} className="mb-1 block text-sm text-ink-soft">Link (optional)</label>
          <input id={id("link")} name="link" placeholder="/invai or https://…" defaultValue={value?.link || ""} className="admin-input" />
        </div>
        <div>
          <label htmlFor={id("icon")} className="mb-1 block text-sm text-ink-soft">Icon</label>
          <select id={id("icon")} name="icon" defaultValue={value?.icon || "spark"} className="admin-input">
            {HIGHLIGHT_ICONS.map((icon: string) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={id("sort_order")} className="mb-1 block text-sm text-ink-soft">Order</label>
          <input
            id={id("sort_order")}
            name="sort_order"
            type="number"
            defaultValue={value?.sort_order ?? 0}
            className="admin-input"
          />
        </div>
      </div>
    </>
  );
}
