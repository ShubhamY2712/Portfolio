import { createClient } from "@/lib/supabase/server";
import { addSkill, deleteSkill, setSkillCategory } from "../actions";
import type { Skill } from "@/lib/content";

const LABELS: Record<string, string> = { product: "Product & business", technical: "Technical" };

export default async function SkillsAdmin() {
  const supabase = createClient();
  const { data } = await supabase.from("skills").select("*").order("sort_order");
  const skills = (data ?? []) as Skill[];
  // The category column exists only after supabase/migration-003.sql.
  const categoriesReady: boolean = skills.length === 0 || "category" in skills[0];

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">Skills</h1>
      <p className="text-sm text-ink-soft mb-6">Shown on the homepage in two groups: Product &amp; business, and Technical.</p>

      {!categoriesReady && (
        <p className="mb-6 rounded-md border border-accent/40 bg-accent-soft px-3 py-2 text-sm text-ink">
          Run <code>supabase/migration-003.sql</code> in the Supabase SQL Editor to enable skill groups.
        </p>
      )}

      <form action={addSkill} className="mb-8 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="new-skill" className="sr-only">New skill</label>
        <input id="new-skill" name="label" placeholder="New skill" required className="admin-input sm:flex-1" />
        <label htmlFor="new-skill-category" className="sr-only">Group</label>
        <select id="new-skill-category" name="category" defaultValue="technical" className="admin-input sm:w-48">
          <option value="product">{LABELS.product}</option>
          <option value="technical">{LABELS.technical}</option>
        </select>
        <button className="bg-primary text-paper text-sm font-semibold px-4 py-2 rounded-md hover:bg-accent-light">
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {skills.map((s: Skill) => (
          <li
            key={s.id}
            className="flex flex-wrap items-center justify-between gap-3 bg-surface border border-line rounded-md px-3 py-2 text-sm"
          >
            <span className="text-ink">{s.label}</span>
            <div className="flex items-center gap-3">
              <form action={setSkillCategory.bind(null, s.id)} className="flex items-center gap-2">
                <label htmlFor={"cat-" + s.id} className="sr-only">Group for {s.label}</label>
                <select
                  id={"cat-" + s.id}
                  name="category"
                  defaultValue={s.category === "product" ? "product" : "technical"}
                  className="rounded-md border border-line bg-paper px-2 py-1 text-xs text-ink"
                >
                  <option value="product">{LABELS.product}</option>
                  <option value="technical">{LABELS.technical}</option>
                </select>
                <button className="text-xs text-accent hover:underline">Save</button>
              </form>
              <form action={deleteSkill.bind(null, s.id)}>
                <button className="text-red-400 text-xs hover:underline">Remove</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
