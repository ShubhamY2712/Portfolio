import Link from "next/link";
import { ArrowRight, Award, BookOpen, LineChart, Rocket, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { safeHref } from "@/lib/content";

const ICONS: Record<string, LucideIcon> = {
  rocket: Rocket,
  chart: LineChart,
  book: BookOpen,
  users: Users,
  award: Award,
  spark: Sparkles,
};

/** Glowing "What I'm working on" card. Whole card is a link when `link` is set. */
export default function HighlightCard({
  title,
  subtitle,
  description,
  link,
  icon,
}: {
  title: string;
  subtitle?: string | null;
  description?: string | null;
  link?: string | null;
  icon?: string | null;
}) {
  const Icon: LucideIcon = ICONS[icon || ""] ?? Sparkles;
  const href: string | null = safeHref(link);
  const external: boolean = Boolean(href && /^https?:/i.test(href));

  const body = (
    <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
      <span
        aria-hidden="true"
        className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-accent/30 bg-accent-soft text-accent shadow-[0_0_40px_rgba(255,197,61,0.25)] sm:h-20 sm:w-20"
      >
        <Icon size={30} strokeWidth={1.6} />
      </span>
      <div className="min-w-0">
        <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-accent-light/90">{subtitle}</p>}
        {description && <p className="mt-3 max-w-prose leading-relaxed text-ink-soft">{description}</p>}
        {href && (
          <span className="mt-4 inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wide text-ink transition-colors group-hover:text-accent">
            Learn more
            <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
          </span>
        )}
      </div>
    </div>
  );

  if (!href) return <div className="card-glow">{body}</div>;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="card-glow card-glow-hover group block">
        {body}
      </a>
    );
  }
  return (
    <Link href={href} className="card-glow card-glow-hover group block">
      {body}
    </Link>
  );
}
