import { ArrowUpRight, Figma, PlayCircle, Table2 } from "lucide-react";
import type { ReactNode } from "react";
import { figmaEmbedUrl, loomEmbedUrl, safeUrl } from "@/lib/content";

/**
 * Optional artifacts on a case-study page. Each slot renders only when its
 * URL is set in /admin. Figma and Loom are embedded only when the URL is
 * really on figma.com / loom.com; anything else falls back to a plain link.
 */
export default function EmbedSlots({
  projectName,
  figmaUrl,
  loomUrl,
  evalSheetUrl,
}: {
  projectName: string;
  figmaUrl?: string | null;
  loomUrl?: string | null;
  evalSheetUrl?: string | null;
}) {
  const figma: string | null = figmaEmbedUrl(figmaUrl);
  const loom: string | null = loomEmbedUrl(loomUrl);
  const figmaLink: URL | null = safeUrl(figmaUrl);
  const loomLink: URL | null = safeUrl(loomUrl);
  const evalLink: URL | null = safeUrl(evalSheetUrl);

  if (!figmaLink && !loomLink && !evalLink) return null;

  return (
    <div className="space-y-10">
      {loomLink && (
        <Slot icon={<PlayCircle size={18} aria-hidden="true" />} title="Walkthrough video" href={loomLink.toString()} linkLabel="Open in Loom">
          {loom ? (
            <Frame src={loom} title={projectName + " — walkthrough video (Loom)"} />
          ) : (
            <FallbackLink href={loomLink.toString()} label="Watch the walkthrough" />
          )}
        </Slot>
      )}

      {figmaLink && (
        <Slot icon={<Figma size={18} aria-hidden="true" />} title="Design mockups" href={figmaLink.toString()} linkLabel="Open in Figma">
          {figma ? (
            <Frame src={figma} title={projectName + " — design mockups (Figma)"} />
          ) : (
            <FallbackLink href={figmaLink.toString()} label="View the mockups" />
          )}
        </Slot>
      )}

      {evalLink && (
        <Slot icon={<Table2 size={18} aria-hidden="true" />} title="Evaluation sheet">
          <FallbackLink href={evalLink.toString()} label="Open the eval sheet" />
        </Slot>
      )}
    </div>
  );
}

function Slot({
  icon,
  title,
  href,
  linkLabel,
  children,
}: {
  icon: ReactNode;
  title: string;
  href?: string;
  linkLabel?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-4">
        <h3 className="flex items-center gap-2 text-sm font-medium text-ink">
          <span className="text-accent">{icon}</span>
          {title}
        </h3>
        {href && linkLabel && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            {linkLabel} <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        )}
      </div>
      {children}
    </section>
  );
}

function Frame({ src, title }: { src: string; title: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-primary-soft">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}

function FallbackLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="card-interactive group flex items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-ink"
    >
      {label}
      <ArrowUpRight
        size={16}
        aria-hidden="true"
        className="shrink-0 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </a>
  );
}
