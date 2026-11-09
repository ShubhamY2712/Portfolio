import { siGithub } from "simple-icons";

// Filled glyphs for the external links in the More sheet and the footer.
// GitHub = the official mark from simple-icons (CC0). simple-icons 16.35.0 has no
// LinkedIn icon, so the "in" letters, the page and the ID card are our own drawings.

/** GitHub mark, filled with the current text colour. */
export function GitHubGlyph({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={siGithub.path} />
    </svg>
  );
}

/** "in" letters for the LinkedIn tile (22-unit box: dot, stem and n). */
export function LinkedInGlyph({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="currentColor" aria-hidden="true">
      <circle cx="4.5" cy="4.5" r="2" />
      <rect x="2.75" y="8.25" width="3.5" height="10.5" rx=".3" />
      <path d="M9.25 8.25h3.35v1.55c.62-1.08 1.92-1.8 3.5-1.8 2.65 0 3.65 1.72 3.65 4.45v6.3h-3.5v-5.6c0-1.36-.42-2.2-1.66-2.2-1.32 0-1.99.92-1.99 2.32v5.48h-3.35z" />
    </svg>
  );
}

/** A sheet of paper with a folded top-right corner (resume). */
export function ResumeGlyph({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="currentColor" aria-hidden="true">
      <path d="M7 1.9h7.1l4.2 4.2v12.6a1.5 1.5 0 0 1-1.5 1.5H7a1.5 1.5 0 0 1-1.5-1.5V3.4A1.5 1.5 0 0 1 7 1.9Z" />
      <path d="M14.1 1.9v3.1a1.1 1.1 0 0 0 1.1 1.1h3.1Z" opacity=".55" />
    </svg>
  );
}

/** An ID card: rounded card with a photo square and two text lines cut out. */
export function CardGlyph({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="currentColor" fillRule="evenodd" aria-hidden="true">
      <path d="M3.5 4.5h15a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Zm1.5 3.5v6h5V8Zm7 1v1.6h6V9Zm0 3.2v1.6h4.5v-1.6Z" />
    </svg>
  );
}
