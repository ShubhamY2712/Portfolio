import { createClient } from "@/lib/supabase/server";
import { addSkill, deleteSkill, setSkillCategory } from "../actions";
import { SKILL_GROUPS, skillGroupOf } from "@/lib/content";
import type { Skill } from "@/lib/content";

type Group = (typeof SKILL_GROUPS)[number];

export default async function SkillsAdmin() {
  const supabase = createClient();
  const { data } = await supabase.from("skills").select("*").order("sort_order");
  const skills = (data ?? []) as Skill[];
  // The category column exists only after supabase/migration-003.sql.
  const categoriesReady: boolean = skills.length === 0 || "category" in skills[0];

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">Skills</h1>
      <p className="text-sm text-ink-soft mb-6">Shown on the homepage grouped into cards. Pick the group for each skill.</p>

      {!categoriesReady && (
        <p className="mb-6 rounded-md border border-accent/40 bg-accent-soft px-3 py-2 text-sm text-ink">
          Run <code>supabase/migration-004.sql</code> in the Supabase SQL Editor to enable skill groups.
        </p>
      )}

      <form action={addSkill} className="mb-8 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="new-skill" className="sr-only">New skill</label>
        <input id="new-skill" name="label" placeholder="New skill" required className="admin-input sm:flex-1" />
        <label htmlFor="new-skill-category" className="sr-only">Group</label>
        <select id="new-skill-category" name="category" defaultValue="languages" className="admin-input sm:w-48">
          {SKILL_GROUPS.map((g: Group) => (
            <option key={g.key} value={g.key}>
              {g.label}
            </option>
          ))}
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
                  defaultValue={skillGroupOf(s.category)}
                  className="rounded-md border border-line bg-paper px-2 py-1 text-xs text-ink"
                >
                  {SKILL_GROUPS.map((g: Group) => (
                    <option key={g.key} value={g.key}>
                      {g.label}
                    </option>
                  ))}
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
