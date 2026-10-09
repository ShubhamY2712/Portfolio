import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Teardown } from "@/lib/content";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Product teardown",
};

export default async function TeardownPage() {
  const supabase = createClient();
  const [profileRes, teardownRes] = await Promise.all([
    supabase.from("profile").select("*").eq("id", 1).single(),
    supabase.from("teardown").select("*").eq("id", 1).single(),
  ]);
  const profile = profileRes.data as Profile | null;
  const teardown = teardownRes.data as Teardown | null;
  const isPlaceholder: boolean = teardown?.placeholder ?? true;

  return (
    <>
      <Navbar name={profile?.name || ""} resumeUrl={profile?.resume_url} />
      <main id="main">
        <article className="max-w-content mx-auto px-5 pb-10 pt-10 sm:px-6 sm:pt-14">
          <Link
            href="/"
            className="mb-10 inline-flex min-h-11 items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft size={14} aria-hidden="true" /> Back home
          </Link>

          <AnimatedSection ariaLabelledby="teardown-title">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <p className="eyebrow">Product teardown</p>
              {isPlaceholder && (
                <span className="badge-progress">In progress</span>
              )}
            </div>
            <h1 id="teardown-title" className="mb-6 font-display text-display-md font-bold text-ink sm:text-display-lg">
              {isPlaceholder ? "Coming soon" : teardown?.product_name}
            </h1>
            {isPlaceholder ? (
              <p className="max-w-prose text-lg leading-relaxed text-ink-soft">
                A product teardown is being written. Check back soon.
              </p>
            ) : (
              teardown?.summary && (
                <div className="max-w-prose space-y-5 text-lg leading-relaxed text-ink-soft">
                  {teardown.summary
                    .split(/\n{2,}/)
                    .map((para: string) => para.trim())
                    .filter(Boolean)
                    .map((para: string, i: number) => (
                      <p key={i}>{para}</p>
                    ))}
                </div>
              )
            )}
          </AnimatedSection>
        </article>
      </main>
      <Footer
        name={profile?.name || ""}
        email={profile?.email || ""}
        linkedin={profile?.linkedin}
        github={profile?.github}
        resumeUrl={profile?.resume_url}
        contactLine={profile?.statement || undefined}
      />
    </>
  );
}
