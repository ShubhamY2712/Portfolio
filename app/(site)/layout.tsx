import type { ReactNode } from "react";
import SiteHeader from "@/components/shell/SiteHeader";
import FooterBand from "@/components/shell/FooterBand";
import MobileDock from "@/components/shell/MobileDock";
import SmoothScroll from "@/components/shell/SmoothScroll";
import { createClient } from "@/lib/supabase/server";
import { safeHref } from "@/lib/content";
import { CONTACT_EMAIL } from "@/lib/site";

/** Shell for every public page. /admin and /login live outside this group and keep their own look. */
export default async function SiteLayout({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const { data } = await supabase.from("profile").select("linkedin, github, resume_url").eq("id", 1).single();
  const profile = data as { linkedin: string | null; github: string | null; resume_url: string | null } | null;

  const links = {
    linkedin: safeHref(profile?.linkedin),
    github: safeHref(profile?.github),
    resumeUrl: safeHref(profile?.resume_url),
  };

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader links={links} />
      {children}
      <FooterBand email={CONTACT_EMAIL} {...links} />
      <MobileDock />
      <SmoothScroll />
    </>
  );
}
