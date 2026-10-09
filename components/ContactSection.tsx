"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check, Copy, FileDown, Github, Linkedin, Mail, Moon, Send, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Magnetic } from "@/components/Interactive";
import { PaperPlane, Squiggle } from "@/components/Illustrations";

// Topics a visitor can pick; they pre-fill the email subject.
const TOPICS: string[] = [
  "AI Product Manager role",
  "Business Analyst role",
  "Full Stack / AI-ML role",
  "Project collaboration",
  "Just saying hi",
];

// Local time for the "where I am" card. Your location is Pune, India.
const TIME_ZONE: string = "Asia/Kolkata";

type Social = { href: string; label: string; sub: string; icon: LucideIcon; download?: boolean };

/**
 * Interactive contact block:
 *  - "Compose" card: pick a topic, add a name + message, and it opens the
 *    visitor's own email app with everything pre-filled (nothing is stored
 *    or sent by this site).
 *  - Copy-to-clipboard email, magnetic social tiles, and a live local clock.
 */
export default function ContactSection({
  email,
  linkedin,
  github,
  resumeUrl,
  contactLine,
  location,
}: {
  email: string;
  linkedin?: string | null;
  github?: string | null;
  resumeUrl?: string | null;
  contactLine: string;
  location?: string | null;
}) {
  const reduce: boolean | null = useReducedMotion();
  const [topic, setTopic] = useState<string>(TOPICS[0]);
  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [now, setNow] = useState<Date | null>(null);

  // Clock: start after mount so server and client HTML match.
  useEffect(() => {
    setNow(new Date());
    const id: ReturnType<typeof setInterval> = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const time: string = now
    ? new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: TIME_ZONE }).format(now)
    : "";
  const hour: number = now
    ? Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: TIME_ZONE }).format(now))
    : 12;
  const daytime: boolean = hour >= 7 && hour < 19;

  const socials: Social[] = [
    ...(linkedin ? [{ href: linkedin, label: "LinkedIn", sub: "Let's connect", icon: Linkedin }] : []),
    ...(github ? [{ href: github, label: "GitHub", sub: "See the code", icon: Github }] : []),
    ...(resumeUrl ? [{ href: resumeUrl, label: "Resume", sub: "Download PDF", icon: FileDown, download: true }] : []),
  ];

  const copyEmail = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = "mailto:" + email;
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const subject: string = `Hi Shubham, about: ${topic}`;
    const body: string = `Hi Shubham,\n\n${message.trim() || "I came across your portfolio and would like to talk."}\n\n${name.trim() ? "Thanks,\n" + name.trim() : ""}`;
    setSent(true);
    setTimeout(() => setSent(false), 2400);
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div>
      {/* Heading */}
      <div className="mb-14 flex flex-col items-center text-center">
        <PaperPlane className="mb-6 h-16 w-32 motion-safe:animate-float-slow" />
        <p className="eyebrow mb-3 flex items-center justify-center gap-3">
          <span aria-hidden="true" className="h-px w-6 bg-accent" />
          Contact
          <span aria-hidden="true" className="h-px w-6 bg-accent" />
        </p>
        <h2 id="contact-title" className="font-display text-display-md font-bold text-ink sm:text-display-lg">
          Let&apos;s <span className="text-accent">talk</span>
        </h2>
        <Squiggle className="mt-3 h-3 w-28 text-accent" />
        <p className="mt-5 max-w-md leading-relaxed text-ink-soft">{contactLine}</p>
      </div>

      <div className="grid gap-6 text-left lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* Compose card */}
        {email && (
          <form onSubmit={onSubmit} className="card-glow relative p-6 sm:p-8" aria-labelledby="compose-title">
            <h3 id="compose-title" className="mb-1 font-display text-xl font-semibold text-ink">
              Write me a note
            </h3>
            <p className="mb-6 text-sm text-ink-soft">Pick a topic, add a line, and it opens in your email app.</p>

            <fieldset className="mb-5">
              <legend className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-accent-light/80">
                What&apos;s it about?
              </legend>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((t: string) => {
                  const selected: boolean = t === topic;
                  return (
                    <label
                      key={t}
                      className={
                        "relative cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-200 " +
                        (selected
                          ? "border-accent bg-primary font-medium text-paper"
                          : "border-line bg-paper/60 text-ink-soft hover:border-accent/50 hover:text-ink")
                      }
                    >
                      <input
                        type="radio"
                        name="topic"
                        value={t}
                        checked={selected}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setTopic(e.target.value)}
                        className="sr-only"
                      />
                      {t}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="mb-4">
              <label htmlFor="contact-name" className="mb-1.5 block text-sm text-ink-soft">
                Your name <span className="text-ink-soft/60">(optional)</span>
              </label>
              <input
                id="contact-name"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                autoComplete="name"
                className="w-full rounded-xl border border-line bg-paper/70 px-4 py-3 text-ink placeholder:text-ink-soft/50 focus:border-accent/60 focus:outline-none"
                placeholder="Jane from Acme"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="contact-message" className="mb-1.5 block text-sm text-ink-soft">
                Message
              </label>
              <textarea
                id="contact-message"
                rows={4}
                value={message}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                className="w-full resize-none rounded-xl border border-line bg-paper/70 px-4 py-3 text-ink placeholder:text-ink-soft/50 focus:border-accent/60 focus:outline-none"
                placeholder="Hi Shubham, we're hiring for…"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Magnetic strength={0.2}>
                <button type="submit" className="btn-primary group relative overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    {sent ? (
                      <motion.span
                        key="sent"
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <Check size={16} aria-hidden="true" /> Opening your email…
                      </motion.span>
                    ) : (
                      <motion.span
                        key="send"
                        className="flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: reduce ? 0 : 24, y: reduce ? 0 : -12 }}
                      >
                        Send it
                        <Send
                          size={16}
                          aria-hidden="true"
                          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1"
                        />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </Magnetic>
              <p className="text-xs text-ink-soft">Nothing is stored on this site.</p>
            </div>
          </form>
        )}

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Email + copy */}
          {email && (
            <div className="card p-6">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-accent-light/80">Email</p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <a
                  href={"mailto:" + email}
                  className="group inline-flex min-w-0 items-center gap-2 font-display text-lg font-semibold text-ink transition-colors hover:text-accent"
                >
                  <Mail size={20} aria-hidden="true" className="shrink-0 text-accent" />
                  <span className="break-all">{email}</span>
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-accent/50 hover:text-ink"
                >
                  {copied ? <Check size={14} aria-hidden="true" className="text-accent" /> : <Copy size={14} aria-hidden="true" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="sr-only" aria-live="polite">
                {copied ? "Email address copied" : ""}
              </p>
            </div>
          )}

          {/* Socials */}
          {socials.length > 0 && (
            <ul className="grid grid-cols-3 gap-3 sm:gap-4">
              {socials.map((s: Social) => {
                const Icon: LucideIcon = s.icon;
                return (
                  <li key={s.label}>
                    <Magnetic strength={0.15} className="h-full">
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={s.download || undefined}
                        className="card group flex h-full flex-col justify-between gap-5 p-4 transition-colors duration-300 hover:border-accent/50 hover:bg-accent-soft/40 sm:gap-6 sm:p-5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/30 bg-accent-soft text-accent transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                            <Icon size={18} aria-hidden="true" />
                          </span>
                          <ArrowUpRight
                            size={18}
                            aria-hidden="true"
                            className="hidden text-ink-soft transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent sm:block"
                          />
                        </div>
                        <div>
                          <p className="font-display text-sm font-semibold text-ink sm:text-base">{s.label}</p>
                          <p className="hidden text-xs text-ink-soft sm:block">{s.sub}</p>
                        </div>
                      </a>
                    </Magnetic>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Local time */}
          {location && (
            <div className="card relative flex flex-1 items-center gap-4 overflow-hidden p-6">
              <span
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent-soft text-accent"
              >
                {daytime ? <Sun size={22} className="motion-safe:animate-spin-slow" /> : <Moon size={22} />}
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent-light/80">Based in</p>
                <p className="font-display text-lg font-semibold text-ink">{location}</p>
                <p className="text-sm text-ink-soft" aria-live="off">
                  {time ? `It's ${time} here (IST)` : " "}
                </p>
              </div>
              <svg
                aria-hidden="true"
                viewBox="0 0 120 60"
                className="pointer-events-none absolute -right-4 bottom-0 h-20 w-40 text-accent/10"
              >
                <path d="M0 60 L20 34 L34 46 L58 18 L78 40 L94 28 L120 60 Z" fill="currentColor" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
