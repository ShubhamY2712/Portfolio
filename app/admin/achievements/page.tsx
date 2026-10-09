import { createClient } from "@/lib/supabase/server";
import { addAchievement, deleteAchievement, updateAchievement } from "../actions";
import { ACHIEVEMENT_ICONS } from "@/lib/content";
import type { Achievement } from "@/lib/content";

export default async function AchievementsAdmin() {
  const supabase = createClient();
  const { data } = await supabase.from("achievements").select("*").order("sort_order");
  const achievements = (data ?? []) as Achievement[];
  // Card fields exist only after supabase/migration-004.sql.
  const cardsReady: boolean = achievements.length === 0 || "title" in achievements[0];

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">Achievements</h1>
      <p className="text-sm text-ink-soft mb-6">
        Each one shows as an award card: a short title, a one-line detail, the date and an icon. The trophy icon makes it
        the large featured card.
      </p>

      {!cardsReady && (
        <p className="mb-6 rounded-md border border-accent/40 bg-accent-soft px-3 py-2 text-sm text-ink">
          Run <code>supabase/migration-004.sql</code> and <code>migration-005.sql</code> in the Supabase SQL Editor to enable card titles, icons and issuer.
        </p>
      )}

      <form action={addAchievement} className="card mb-10 space-y-3 p-5">
        <h2 className="font-display text-lg font-semibold text-ink">Add an achievement</h2>
        <CardFields idPrefix="new" />
        <button className="bg-primary text-paper text-sm font-semibold px-4 py-2 rounded-md hover:bg-accent-light">
          Add achievement
        </button>
      </form>

      <ul className="space-y-6">
        {achievements.map((a: Achievement) => (
          <li key={a.id} className="card p-5">
            <form action={updateAchievement.bind(null, a.id)} className="space-y-3">
              <CardFields idPrefix={a.id} value={a} />
              <button className="bg-primary text-paper text-sm font-semibold px-4 py-2 rounded-md hover:bg-accent-light">
                Save
              </button>
            </form>
            <form action={deleteAchievement.bind(null, a.id)} className="mt-3 border-t border-line pt-3">
              <button className="text-red-400 text-xs hover:underline">Remove</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CardFields({ idPrefix, value }: { idPrefix: string; value?: Achievement }) {
  const id = (field: string): string => `${idPrefix}-${field}`;
  return (
    <>
      <div>
        <label htmlFor={id("title")} className="mb-1 block text-sm text-ink-soft">Title</label>
        <input
          id={id("title")}
          name="title"
          required
          placeholder="e.g. Best Social Impact Award"
          defaultValue={value?.title || ""}
          className="admin-input"
        />
      </div>
      <div>
        <label htmlFor={id("issuer")} className="mb-1 block text-sm text-ink-soft">Issued by (optional)</label>
        <input
          id={id("issuer")}
          name="issuer"
          placeholder="e.g. National Service Scheme (NSS)"
          defaultValue={value?.issuer || ""}
          className="admin-input"
        />
      </div>
      <div>
        <label htmlFor={id("detail")} className="mb-1 block text-sm text-ink-soft">Detail (one line)</label>
        <textarea id={id("detail")} name="detail" rows={2} defaultValue={value?.detail || value?.text || ""} className="admin-input" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={id("date")} className="mb-1 block text-sm text-ink-soft">Date</label>
          <input id={id("date")} name="date" placeholder="e.g. 2025" defaultValue={value?.date || ""} className="admin-input" />
        </div>
        <div>
          <label htmlFor={id("icon")} className="mb-1 block text-sm text-ink-soft">Icon</label>
          <select id={id("icon")} name="icon" defaultValue={value?.icon || "award"} className="admin-input">
            {ACHIEVEMENT_ICONS.map((icon: string) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
