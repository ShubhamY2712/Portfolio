/** Absolute base URL so Open Graph, sitemap and robots URLs resolve correctly. */
export function siteUrl(): URL {
  const explicit: string | undefined = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelProd: string | undefined = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const vercel: string | undefined = process.env.VERCEL_URL;
  const raw: string = explicit
    ? explicit
    : vercelProd
      ? "https://" + vercelProd
      : vercel
        ? "https://" + vercel
        : "http://localhost:3000";
  try {
    return new URL(raw);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const SITE_NAME: string = "Shubham Yawalkar";

// Footer contact details, set in code for v1 (chosen 7 Nov 2026).
export const CONTACT_EMAIL: string = "work.shubhamyawalkar@gmail.com";
export const WHATSAPP_URL: string = "https://wa.me/918369117513";
// AIPM resume shipped with the site (9 Nov 2026); a resume uploaded in /admin takes priority.
export const RESUME_URL: string = "/Shubham-Yawalkar-AIPM-Resume.pdf";
