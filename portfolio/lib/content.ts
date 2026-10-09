// Shared helpers for content loaded from Supabase.

/**
 * `tech` and `bullets` are jsonb columns that should hold arrays. Older
 * admin saves stored them as a JSON *string* (e.g. "[\"a\",\"b\"]"), so this
 * accepts an array, a JSON-encoded string, or nothing, and always returns
 * a clean string[].
 */
export function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v: unknown): v is string => typeof v === "string" && v.trim() !== "");
  }
  if (typeof value === "string" && value.trim() !== "") {
    try {
      const parsed: unknown = JSON.parse(value);
      if (Array.isArray(parsed)) return toStringArray(parsed);
    } catch {
      // Not JSON; fall through.
    }
  }
  return [];
}

/** Returns a parsed URL only if it is a well-formed http(s) URL. */
export function safeUrl(value: string | null | undefined): URL | null {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

function hostIs(url: URL, domain: string): boolean {
  return url.hostname === domain || url.hostname.endsWith("." + domain);
}

/** Figma file/design/proto/board URL -> official embed URL, else null. */
export function figmaEmbedUrl(value: string | null | undefined): string | null {
  const url = safeUrl(value);
  if (!url || !hostIs(url, "figma.com")) return null;
  if (url.pathname.startsWith("/embed")) return url.toString();
  if (!/^\/(file|design|proto|board)\//.test(url.pathname)) return null;
  return "https://www.figma.com/embed?embed_host=share&url=" + encodeURIComponent(url.toString());
}

/** Loom share URL -> embed URL, else null. */
export function loomEmbedUrl(value: string | null | undefined): string | null {
  const url = safeUrl(value);
  if (!url || !hostIs(url, "loom.com")) return null;
  const match: RegExpMatchArray | null = url.pathname.match(/^\/(share|embed)\/([a-zA-Z0-9]+)/);
  if (!match) return null;
  return "https://www.loom.com/embed/" + match[2];
}

/** Turn a FormData value into a trimmed string or null (empty -> null). */
export function formText(formData: FormData, key: string): string | null {
  const value: FormDataEntryValue | null = formData.get(key);
  if (typeof value !== "string") return null;
  const trimmed: string = value.trim();
  return trimmed === "" ? null : trimmed;
}

/** Same as formText but only keeps valid http(s) URLs. */
export function formUrl(formData: FormData, key: string): string | null {
  const text: string | null = formText(formData, key);
  return safeUrl(text) ? text : null;
}

/** Short display name: first + last word. */
export function shortName(name: string): string {
  const parts: string[] = name.trim().split(/\s+/).filter(Boolean);
  return parts.length > 1 ? parts[0] + " " + parts[parts.length - 1] : name;
}

/** Initials for monogram/avatars. */
export function initials(name: string): string {
  const parts: string[] = shortName(name).split(" ").filter(Boolean);
  return parts.map((p: string) => p[0]?.toUpperCase() ?? "").join("").slice(0, 2) || "SY";
}

// ---------- Row types (mirror supabase/schema.sql + migration-002.sql) ----------

export type Profile = {
  id: number;
  name: string | null;
  tagline: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedin: string | null;
  github: string | null;
  summary: string | null;
  resume_url: string | null;
  photo_url: string | null;
  // Added in migration-002.sql (undefined until it is run).
  hero_intro?: string | null;
  hero_headline?: string | null;
  hero_highlight?: string | null;
  typing_phrases?: unknown;
  currently_text?: string | null;
  currently_url?: string | null;
  statement?: string | null;
};

export type Skill = { id: string; label: string; sort_order: number | null };

export type Project = {
  id: string;
  slug: string;
  name: string | null;
  tag: string | null;
  role: string | null;
  dates: string | null;
  tech: unknown;
  hook: string | null;
  summary: string | null;
  bullets: unknown;
  prd_link: string | null;
  github_link: string | null;
  // Added in migration-002.sql (undefined until it is run).
  figma_url?: string | null;
  loom_url?: string | null;
  eval_sheet_url?: string | null;
  cover_url?: string | null;
  cover_alt?: string | null;
  sort_order: number | null;
};

export type Achievement = { id: string; text: string | null; date: string | null; sort_order: number | null };

export type Certification = {
  id: string;
  text: string | null;
  org: string | null;
  date: string | null;
  status: string | null;
  sort_order: number | null;
};

export type ResearchPaper = {
  id: number;
  title: string | null;
  publication: string | null;
  date: string | null;
  pdf_link: string | null;
  note: string | null;
};

export type Teardown = {
  id: number;
  title: string | null;
  product_name: string | null;
  summary: string | null;
  placeholder: boolean | null;
};

export const HIGHLIGHT_ICONS = ["rocket", "chart", "book", "users", "award", "spark"] as const;
export type HighlightIcon = (typeof HIGHLIGHT_ICONS)[number];

export type Highlight = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  link: string | null;
  icon: string | null;
  sort_order: number | null;
};

/** Internal path ("/invai", "/#research") or a valid http(s) URL; else null. */
export function safeHref(value: string | null | undefined): string | null {
  if (!value) return null;
  const v: string = value.trim();
  if (v.startsWith("/") && !v.startsWith("//")) return v;
  return safeUrl(v) ? v : null;
}

/** First word of a name, for "Hello! I'm Shubham". */
export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || name;
}
