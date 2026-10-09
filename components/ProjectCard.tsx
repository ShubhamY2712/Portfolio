import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function ProjectCard({
  slug,
  name,
  tag,
  hook,
  tech,
  role,
  dates,
}: {
  slug: string;
  name: string;
  tag: string;
  hook: string;
  tech: string[];
  role?: string | null;
  dates?: string | null;
}) {
  // "Present" in the dates means the project is still being built.
  const inProgress: boolean = /present/i.test(dates || "");

  return (
    <Link
      href={`/${slug}`}
      aria-label={`${name} — read case study`}
      className="card-interactive group relative flex h-full flex-col overflow-hidden p-6 sm:p-7"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100"
      />
      <div className="mb-4 flex items-start justify-between gap-3">
        <p className="eyebrow leading-snug">{tag}</p>
        {inProgress && (
          <span className="badge-progress">
            In progress
          </span>
        )}
      </div>

      <h3 className="mb-2 font-display text-2xl font-semibold text-ink">{name}</h3>
      {(role || dates) && (
        <p className="mb-4 text-xs text-ink-soft">
          {role}
          {role && dates ? " · " : ""}
          {dates}
        </p>
      )}
      <p className="mb-6 flex-grow leading-relaxed text-ink-soft">{hook}</p>

      {tech.length > 0 && (
        <ul className="mb-6 flex flex-wrap gap-1.5" aria-label="Tech stack">
          {tech.slice(0, 5).map((t: string) => (
            <li key={t} className="tag">
              {t}
            </li>
          ))}
          {tech.length > 5 && <li className="tag">+{tech.length - 5}</li>}
        </ul>
      )}

      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
        Read case study
        <ArrowUpRight
          size={16}
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
