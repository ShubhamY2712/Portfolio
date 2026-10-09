import { DotGrid } from "@/components/Illustrations";
import ContactSection from "@/components/ContactSection";

export default function Footer({
  name,
  email,
  linkedin,
  github,
  resumeUrl,
  location,
  contactLine = "Open to AI Product Manager, Business Analyst and technical AI/ML internships and roles.",
}: {
  name: string;
  email: string;
  linkedin?: string | null;
  github?: string | null;
  resumeUrl?: string | null;
  location?: string | null;
  contactLine?: string;
}) {
  return (
    <footer id="contact" aria-labelledby="contact-title" className="relative isolate mt-10 overflow-hidden border-t border-line">
      <div
        aria-hidden="true"
        className="absolute bottom-[-18rem] left-1/2 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,197,61,0.14),transparent)]"
      />
      <DotGrid />
      <div className="max-w-content mx-auto px-5 py-20 sm:px-6 sm:py-28">
        <ContactSection
          email={email}
          linkedin={linkedin}
          github={github}
          resumeUrl={resumeUrl}
          contactLine={contactLine}
          location={location}
        />

        <div className="mt-16 flex flex-col items-center gap-2 border-t border-line pt-6 text-xs text-ink-soft sm:flex-row sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {name}. All rights reserved.
          </p>
          <a href="#main" className="hover:text-ink">
            Back to top &uarr;
          </a>
        </div>
      </div>
    </footer>
  );
}
