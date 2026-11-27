"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { BarChart3, Briefcase, ChevronRight, FileText, FlaskConical, GraduationCap, Lightbulb, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PaperDivider from "@/components/shell/PaperDivider";
import { SOON } from "@/components/shell/nav";
import { ASK, ASK_QUESTIONS } from "@/lib/home";
import type { AskQuestion } from "@/lib/home";
import styles from "./AskSection.module.css";

const ICONS: Record<AskQuestion["icon"], LucideIcon> = {
  briefcase: Briefcase,
  flask: FlaskConical,
  chart: BarChart3,
  cap: GraduationCap,
  bulb: Lightbulb,
  doc: FileText,
};

/**
 * Inline "Ask Shubham" section (UI only; the assistant ships in Phase 6, so the input and
 * the question cards are visible but inert). Phones show 3 cards plus "Show me more".
 * When 20% of it scrolls into view, the heading, mascot, note, notebook and cards settle in.
 */
export default function AskSection() {
  const [more, setMore] = useState<boolean>(false);
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el: HTMLDivElement | null = grid.current;
    if (!el) return;
    el.setAttribute("data-armed", "");
    const io = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (!entries.some((e: IntersectionObserverEntry) => e.isIntersecting)) return;
        el.setAttribute("data-in", "");
        io.disconnect();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="ask" className={styles.section} aria-labelledby="ask-title">
      <PaperDivider sheet="rgb(var(--c-paper-2))" shade="rgb(var(--shadow-ink))" />
      <div className={styles.body}>
        <div className={styles.collage} aria-hidden="true">
          <i className={styles.scrapBlue} />
          <i className={styles.scrapGrid} />
          <i className={styles.scrapRust} />
          <svg className={styles.leaf} viewBox="0 0 120 200">
            <path className={styles.leafBlade} d="M62,196 C30,170 8,120 18,70 C26,32 48,10 70,4 C86,30 104,74 100,118 C96,158 80,182 62,196 Z" />
            <path className={styles.leafVein} d="M64,192 C60,140 62,80 70,8 M63,150 C48,140 36,126 30,108 M64,116 C76,104 86,90 90,74 M65,84 C54,74 46,62 42,48" />
          </svg>
        </div>

        <div className={styles.container}>
          <div className={styles.grid} ref={grid}>
            <div className={styles.left}>
              <p className={styles.eyebrow}>{ASK.eyebrow}</p>
              <h2 id="ask-title" className={styles.title}>
                <span>{ASK.title.trim()}</span>
                <span className={styles.accent}>{ASK.accent}</span>
                <svg className={styles.spark} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.5c.7 5 2.5 7.5 7.5 9.5-5 2-6.8 4.5-7.5 9.5-.7-5-2.5-7.5-7.5-9.5 5-2 6.8-4.5 7.5-9.5Z" />
                </svg>
              </h2>
              <p className={styles.hand}>{ASK.hand}</p>
              <p className={styles.lead}>{ASK.lead}</p>

              <div className={styles.mascot}>
                <p className={styles.callout}>
                  {ASK.callout}
                  <svg className={styles.stickySpark} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.5c.7 5 2.5 7.5 7.5 9.5-5 2-6.8 4.5-7.5 9.5-.7-5-2.5-7.5-7.5-9.5 5-2 6.8-4.5 7.5-9.5Z" />
                  </svg>
                  <svg className={styles.calloutArrow} viewBox="0 0 90 64" aria-hidden="true">
                    <path d="M71,5 C62,27 42,45 11,55" />
                    <path d="M23,58 L11,55 L15,44" />
                  </svg>
                </p>
                <img className={styles.figure} src="/art/home/ask-mascot.webp" alt="" width={474} height={580} loading="lazy" decoding="async" />
              </div>

              <p className={styles.sticky}>
                {ASK.sticky}
                <svg className={styles.stickySpark} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.5c.7 5 2.5 7.5 7.5 9.5-5 2-6.8 4.5-7.5 9.5-.7-5-2.5-7.5-7.5-9.5 5-2 6.8-4.5 7.5-9.5Z" />
                </svg>
              </p>
            </div>

            <div className={styles.panel}>
              <div className={styles.notebook}>
                <span className={styles.holes} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <span className={styles.tape} aria-hidden="true" />
                <p className={styles.nbTitle}>{ASK.notebookTitle}</p>

                <form className={styles.composer} onSubmit={(e) => e.preventDefault()} aria-describedby="ask-soon">
                  <label className="sr-only" htmlFor="ask-input">{ASK.placeholder}</label>
                  <input id="ask-input" className={styles.input} type="text" placeholder={ASK.placeholder} disabled />
                  <span id="ask-soon" className={styles.soon}>{ASK.soon}</span>
                  <button className={styles.send} type="submit" aria-label="Send question" disabled>
                    <Send size={20} aria-hidden="true" />
                  </button>
                </form>

                <div className={styles.tryRow}>
                  <p className={styles.try}>{ASK.nudge}</p>
                  {!more && (
                    <button type="button" className={styles.more} onClick={() => setMore(true)}>
                      {ASK.more}
                    </button>
                  )}
                </div>

                <ul className={styles.cards} data-more={more ? "" : undefined}>
                  {ASK_QUESTIONS.map((q: AskQuestion, i: number) => {
                    const Icon: LucideIcon = ICONS[q.icon];
                    const tone = { "--q-bg": `var(--q${i + 1}-bg)`, "--q-ink": `var(--q${i + 1}-ink)` } as CSSProperties;
                    return (
                      <li key={q.text} className={styles.cardItem} style={{ ["--n" as string]: i }} data-extra={i >= 3 ? "" : undefined}>
                        <button type="button" className={styles.card} style={tone} aria-disabled="true" title={SOON}>
                          <span className={styles.cardIcon}><Icon size={20} aria-hidden="true" /></span>
                          <span className={styles.cardText}>{q.text}</span>
                          <ChevronRight className={styles.cardArrow} size={20} aria-hidden="true" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
