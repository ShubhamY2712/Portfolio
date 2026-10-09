"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, FileDown } from "lucide-react";
import { shortName } from "@/lib/content";

type NavLink = { href: string; label: string };

const LINKS: NavLink[] = [
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#projects", label: "Projects" },
  { href: "/#achievements", label: "Achievements" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar({
  name,
  resumeUrl,
}: {
  name: string;
  resumeUrl?: string | null;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const pathname: string = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const close = useCallback((): void => {
    setOpen(false);
  }, []);

  // Close the menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Subtle border/shadow once the page has scrolled.
  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While open: lock body scroll, focus first link, close on Escape,
  // and close if the viewport grows to desktop width.
  useEffect(() => {
    if (!open) return;
    const previousOverflow: string = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const mq: MediaQueryList = window.matchMedia("(min-width: 1024px)");
    const onResize = (e: MediaQueryListEvent): void => {
      if (e.matches) setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onResize);
    };
  }, [open]);

  // Keep Tab focus inside the open panel.
  const onPanelKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>): void => {
    if (e.key !== "Tab") return;
    const focusables: HTMLElement[] = Array.from(
      e.currentTarget.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")
    );
    const all: HTMLElement[] = toggleRef.current ? [toggleRef.current, ...focusables] : focusables;
    if (all.length === 0) return;
    const first: HTMLElement = all[0];
    const last: HTMLElement = all[all.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <header
      className={
        "sticky top-0 z-50 border-b transition-[border-color,box-shadow] duration-300 " +
        (scrolled || open ? "border-line" : "border-transparent")
      }
    >
      {/* Blur lives on its own layer: a backdrop-filter on <header> itself
          would trap the fixed-position menu backdrop inside the header. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-paper/85 backdrop-blur-md" />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:text-sm focus:text-ink focus:shadow-card"
      >
        Skip to content
      </a>

      <div className="max-w-content mx-auto flex h-16 items-center justify-between gap-4 px-5 sm:px-6">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-ink"
          aria-label={shortName(name || "Home") + " — home"}
        >
          {shortName(name) || "Home"}
          <span aria-hidden="true" className="text-accent">.</span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8 font-display text-[15px] text-ink-soft">
            {LINKS.map((link: NavLink) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="relative py-1 transition-colors hover:text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ResumeButton resumeUrl={resumeUrl} className="hidden sm:inline-flex" />
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v: boolean) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-ink transition-colors hover:bg-primary-soft lg:hidden"
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              aria-hidden="true"
              onClick={close}
              className="fixed inset-x-0 bottom-0 top-16 z-40 bg-black/60 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              key="panel"
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              onKeyDown={onPanelKeyDown}
              className="absolute inset-x-0 top-16 z-50 border-b border-line bg-paper shadow-card-hover lg:hidden"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <nav aria-label="Mobile" className="max-w-content mx-auto px-5 pb-6 pt-2 sm:px-6">
                <ul className="divide-y divide-line">
                  {LINKS.map((link: NavLink, i: number) => (
                    <li key={link.href}>
                      <Link
                        ref={i === 0 ? firstLinkRef : undefined}
                        href={link.href}
                        onClick={close}
                        className="flex items-center justify-between py-4 font-display text-xl font-medium text-ink"
                      >
                        {link.label}
                        <span aria-hidden="true" className="text-accent">&rarr;</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <ResumeButton resumeUrl={resumeUrl} className="mt-5 flex w-full sm:hidden" onClick={close} />
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function ResumeButton({
  resumeUrl,
  className = "",
  onClick,
}: {
  resumeUrl?: string | null;
  className?: string;
  onClick?: () => void;
}) {
  if (!resumeUrl) {
    return (
      <span
        aria-disabled="true"
        title="Resume not uploaded yet"
        className={"cursor-not-allowed items-center justify-center rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft " + className}
      >
        Resume
      </span>
    );
  }
  return (
    <a
      href={resumeUrl}
      download
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={"items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-paper transition duration-300 hover:bg-accent-light hover:shadow-[0_0_24px_rgba(255,197,61,0.35)] " + className}
    >
      <FileDown size={15} aria-hidden="true" /> Resume
    </a>
  );
}
