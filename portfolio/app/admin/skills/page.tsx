import { createClient } from "@/lib/supabase/server";
import { addSkill, deleteSkill } from "../actions";
import type { Skill } from "@/lib/content";

export default async function SkillsAdmin() {
  const supabase = createClient();
  const { data } = await supabase.from("skills").select("*").order("sort_order");
  const skills = (data ?? []) as Skill[];

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-semibold text-ink mb-6">Skills</h1>

      <form action={addSkill} className="flex gap-2 mb-6">
        <input
          name="label"
          placeholder="New skill"
          required
          className="admin-input flex-1"
        />
        <button className="bg-primary text-paper text-sm font-medium px-4 py-2 rounded-md hover:bg-accent-light">
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {skills.map((s: Skill) => (
          <li
            key={s.id}
            className="flex items-center justify-between bg-surface border border-line rounded-md px-3 py-2 text-sm"
          >
            {s.label}
            <form action={deleteSkill.bind(null, s.id)}>
              <button className="text-red-400 text-xs hover:underline">Remove</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
