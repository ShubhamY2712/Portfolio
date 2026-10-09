import { createClient } from "@/lib/supabase/server";
import { addAchievement, deleteAchievement } from "../actions";
import type { Achievement } from "@/lib/content";

export default async function AchievementsAdmin() {
  const supabase = createClient();
  const { data } = await supabase
    .from("achievements")
    .select("*")
    .order("sort_order");
  const achievements = (data ?? []) as Achievement[];

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink mb-6">Achievements</h1>

      <form action={addAchievement} className="space-y-2 mb-8 bg-surface border border-line rounded-lg p-4">
        <textarea
          name="text"
          placeholder="Achievement text"
          required
          rows={2}
          className="admin-input"
        />
        <input
          name="date"
          placeholder="Date (e.g. September 2025)"
          className="admin-input"
        />
        <button className="bg-primary text-paper text-sm font-medium px-4 py-2 rounded-md hover:bg-accent-light">
          Add achievement
        </button>
      </form>

      <ul className="space-y-2">
        {achievements.map((a: Achievement) => (
          <li
            key={a.id}
            className="flex items-start justify-between gap-4 bg-surface border border-line rounded-md px-3 py-3 text-sm"
          >
            <div>
              <p className="text-ink">{a.text}</p>
              <p className="text-ink-soft text-xs mt-1">{a.date}</p>
            </div>
            <form action={deleteAchievement.bind(null, a.id)}>
              <button className="text-red-400 text-xs hover:underline whitespace-nowrap">Remove</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
