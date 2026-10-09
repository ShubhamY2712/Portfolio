import { createClient } from "@/lib/supabase/server";
import { addCertification, deleteCertification } from "../actions";
import type { Certification } from "@/lib/content";

export default async function CertificationsAdmin() {
  const supabase = createClient();
  const { data } = await supabase.from("certifications").select("*").order("sort_order");
  const certs = (data ?? []) as Certification[];

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink mb-6">Certifications</h1>

      <form action={addCertification} className="space-y-2 mb-8 bg-surface border border-line rounded-lg p-4">
        <input name="text" placeholder="Certification name" required className="admin-input" />
        <input name="org" placeholder="Issuing organization" className="admin-input" />
        <input name="date" placeholder="Date (e.g. Expected October 2026)" className="admin-input" />
        <select name="status" className="admin-input">
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>
        <button className="bg-primary text-paper text-sm font-medium px-4 py-2 rounded-md hover:bg-accent-light">
          Add certification
        </button>
      </form>

      <ul className="space-y-2">
        {certs.map((c: Certification) => (
          <li
            key={c.id}
            className="flex items-start justify-between gap-4 bg-surface border border-line rounded-md px-3 py-3 text-sm"
          >
            <div>
              <p className="text-ink">
                {c.text} <span className="text-ink-soft">— {c.org}</span>
              </p>
              <p className="text-ink-soft text-xs mt-1">
                {c.date} &middot; {c.status === "done" ? "Done" : "In progress"}
              </p>
            </div>
            <form action={deleteCertification.bind(null, c.id)}>
              <button className="text-red-400 text-xs hover:underline whitespace-nowrap">Remove</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
