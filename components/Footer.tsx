import { Mail, Github, Linkedin, FileDown } from "lucide-react";

export default function Footer({
  name,
  email,
  linkedin,
  github,
  resumeUrl,
  contactLine = "Open to AI Product Manager, Business Analyst and technical AI/ML internships and roles.",
}: {
  name: string;
  email: string;
  linkedin?: string | null;
  github?: string | null;
  resumeUrl?: string | null;
  contactLine?: string;
}) {
  const linkClass: string =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line bg-surface/60 px-5 py-2 text-sm text-ink transition-colors hover:border-accent/50 hover:text-accent-light";

  return (
    <footer id="contact" aria-labelledby="contact-title" className="relative isolate mt-10 overflow-hidden border-t border-line">
      <div
        aria-hidden="true"
        className="absolute bottom-[-18rem] left-1/2 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,197,61,0.14),transparent)]"
      />
      <div className="max-w-content mx-auto px-5 py-20 text-center sm:px-6 sm:py-28">
        <p className="eyebrow mb-3 flex items-center justify-center gap-3">
          <span aria-hidden="true" className="h-px w-6 bg-accent" />
          Contact
          <span aria-hidden="true" className="h-px w-6 bg-accent" />
        </p>
        <h2 id="contact-title" className="mb-4 font-display text-display-md font-bold text-ink sm:text-display-lg">
          Let&apos;s talk
        </h2>
        <p className="mx-auto mb-10 max-w-md leading-relaxed text-ink-soft">
          {contactLine}
        </p>

        {email && (
          <a
            href={"mailto:" + email}
            className="group mx-auto mb-8 inline-flex max-w-full items-center gap-3 font-display text-lg font-semibold text-ink transition-colors hover:text-accent sm:text-2xl"
          >
            <Mail size={22} aria-hidden="true" className="shrink-0 text-accent" />
            <span className="break-all underline decoration-accent/40 underline-offset-8 group-hover:decoration-accent">
              {email}
            </span>
          </a>
        )}

        <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
              <Linkedin size={16} aria-hidden="true" /> LinkedIn
            </a>
          )}
          {github && (
            <a href={github} target="_blank" rel="noopener noreferrer" className={linkClass}>
              <Github size={16} aria-hidden="true" /> GitHub
            </a>
          )}
          {resumeUrl && (
            <a href={resumeUrl} download target="_blank" rel="noopener noreferrer" className="btn-primary min-h-11">
              <FileDown size={16} aria-hidden="true" /> Download resume
            </a>
          )}
        </div>

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
