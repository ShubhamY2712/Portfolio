"use client";

import { useEffect, useState } from "react";
import { THEME_KEY } from "@/components/shell/ThemeScript";
import styles from "./ThemeSwitch.module.css";

type ViewTransitionDocument = Document & { startViewTransition?: (update: () => void) => unknown };

function isDarkNow(): boolean {
  const root: HTMLElement = document.documentElement;
  if (root.dataset.theme) return root.dataset.theme === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Day/night switch: a paper pill with two sky windows (sun | moon). Below 640px
 * it shrinks to a single window showing the current sky. Which window looks
 * active is pure CSS (it reads <html data-theme>), so nothing flashes before
 * hydration; only aria-checked waits for the client.
 */
export default function ThemeSwitch() {
  const [dark, setDark] = useState<boolean>(false);

  useEffect(() => {
    const media: MediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = (): void => setDark(isDarkNow());
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  function toggle(): void {
    const next: "light" | "dark" = isDarkNow() ? "light" : "dark";
    const apply = (): void => {
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        // Private mode or blocked storage: the switch still works for this visit.
      }
      setDark(next === "dark");
    };
    const doc: ViewTransitionDocument = document;
    const reduce: boolean = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (doc.startViewTransition && !reduce) doc.startViewTransition(apply);
    else apply();
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Use dark theme"
      className={styles.switch}
      onClick={toggle}
    >
      <svg className={styles.day} viewBox="0 0 72 50" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="sky-day" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7FB6E3" />
            <stop offset="1" stopColor="#CFE5F4" />
          </linearGradient>
        </defs>
        <rect width="72" height="50" fill="url(#sky-day)" />
        <g stroke="#F4B23E" strokeWidth="2.2" strokeLinecap="round">
          <path d="M30 8v4M30 30v4M17 21h4M39 21h4M21 12l2.6 2.6M36.4 27.4L39 30M21 30l2.6-2.6M36.4 14.6L39 12" />
        </g>
        <circle cx="30" cy="21" r="7" fill="#F7C548" />
        <path d="M4 44c0-5 4-8 8-7 1.5-4 7-5 10-1.5 3-1 7 1 7 5 3 0 5 2 5 3.5Z" fill="#FBF7EF" />
        <path d="M44 40c0-3 3-5 6-4 1-3 6-3 7.5 0 2.5-.5 4.5 1.5 4.5 4Z" fill="#FBF7EF" opacity=".9" />
      </svg>
      <svg className={styles.night} viewBox="0 0 72 50" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="sky-night" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1B2A55" />
            <stop offset="1" stopColor="#5B6E9E" />
          </linearGradient>
        </defs>
        <rect width="72" height="50" fill="url(#sky-night)" />
        <path d="M44 9a11 11 0 1 0 10 16A9 9 0 0 1 44 9Z" fill="#F4EEDF" />
        <g fill="#F4EEDF">
          <circle cx="14" cy="10" r="1.3" />
          <circle cx="24" cy="22" r="1" />
          <circle cx="10" cy="30" r="1.1" />
          <circle cx="60" cy="10" r="1" />
          <circle cx="30" cy="8" r=".8" />
        </g>
        <path d="M6 46c1-4 5-6 9-4 2-3 7-3 9 0 3 0 5 2 5 4Z" fill="#8C9AC0" opacity=".7" />
      </svg>
    </button>
  );
}
