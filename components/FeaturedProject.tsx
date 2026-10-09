import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TiltCard } from "@/components/Interactive";

/**
 * Large "Featured project" block: title, description card, then a big
 * cover image (uploaded in /admin). With no image yet, a designed title
 * panel is shown instead of an empty box.
 */
export default function FeaturedProject({
  slug,
  name,
  tag,
  summary,
  tech,
  dates,
  coverUrl,
  coverAlt,
  reverse = false,
}: {
  slug: string;
  name: string;
  tag: string;
  summary: string;
  tech: string[];
  dates?: string | null;
  coverUrl?: string | null;
  coverAlt?: string | null;
  reverse?: boolean;
}) {
  const inProgress: boolean = /present/i.test(dates || "");
  const href: string = `/${slug}`;

  return (
    <article aria-labelledby={`feat-${slug}`} className={"grid gap-8 " + (reverse ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" : "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]") + " lg:items-center lg:gap-12"}>
      <div className={reverse ? "lg:order-2" : ""}>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <p className="eyebrow">Featured project</p>
          {inProgress && <span className="badge-progress">In progress</span>}
        </div>
        <h3 id={`feat-${slug}`} className="font-display text-display-sm font-bold text-ink sm:text-display-md">
          {name}
          {tag && <span className="mt-1 block text-lg font-medium text-ink-soft sm:text-xl">{tag}</span>}
        </h3>

        {summary && (
          <div className="mt-6 rounded-2xl border border-line bg-surface/80 p-5 backdrop-blur sm:p-6">
            <p className="leading-relaxed text-ink/85">{summary}</p>
          </div>
        )}

        {tech.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tech stack">
            {tech.slice(0, 6).map((t: string) => (
              <li key={t} className="tag">
                {t}
              </li>
            ))}
            {tech.length > 6 && <li className="tag">+{tech.length - 6}</li>}
          </ul>
        )}

        <Link href={href} className="btn-secondary group mt-6">
          Read the case study
          <ArrowUpRight
            size={16}
            aria-hidden="true"
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      <TiltCard>
      <Link
        href={href}
        aria-label={`${name} — open case study`}
        className="group relative block overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_0_60px_-20px_rgba(255,197,61,0.35)] transition duration-500 hover:border-accent/40"
      >
        <div className="aspect-[16/10] w-full">
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverUrl}
              alt={coverAlt || `${name} product preview`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition duration-700 ease-out motion-safe:group-hover:scale-[1.03]"
            />
          ) : (
            <div
              role="img"
              aria-label={`${name} title card`}
              className="relative flex h-full w-full flex-col justify-end overflow-hidden p-6 sm:p-10"
              style={{
                background:
                  "radial-gradient(80% 90% at 85% 10%, rgba(255,197,61,0.28), rgba(255,197,61,0) 60%), linear-gradient(135deg, #1A150C 0%, #0D0B07 100%)",
              }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                  maskImage: "radial-gradient(70% 70% at 70% 30%, black, transparent)",
                  WebkitMaskImage: "radial-gradient(70% 70% at 70% 30%, black, transparent)",
                }}
              />
              <p className="relative font-display text-4xl font-bold tracking-tight text-ink sm:text-6xl">{name}</p>
              {tag && <p className="relative mt-2 max-w-md text-sm text-accent-light/80 sm:text-base">{tag}</p>}
            </div>
          )}
        </div>
      </Link>
      </TiltCard>
    </article>
  );
}
