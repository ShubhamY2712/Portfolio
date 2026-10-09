import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/content";

export default async function ProjectsAdmin() {
  const supabase = createClient();
  const { data } = await supabase.from("projects").select("*").order("sort_order");
  const projects = (data ?? []) as Project[];

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-semibold text-ink mb-6">Projects</h1>
      <ul className="space-y-2">
        {projects.map((p: Project) => (
          <li key={p.id}>
            <Link
              href={`/admin/projects/${p.slug}`}
              className="block bg-surface border border-line rounded-md px-4 py-3 text-sm hover:border-primary transition-colors"
            >
              <span className="font-medium text-ink">{p.name}</span>
              <span className="text-ink-soft"> — {p.tag}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
