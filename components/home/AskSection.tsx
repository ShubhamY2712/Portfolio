"use client";

import { useState } from "react";
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
 */
export default function AskSection() {
  const [more, setMore] = useState<boolean>(false);

  return (
    <section id="ask" className={styles.section} aria-labelledby="ask-title">
      <PaperDivider sheet="rgb(var(--c-paper-2))" shade="rgb(var(--shadow-ink))" />
      <div className={styles.body}>
        <div className={styles.collage} aria-hidden="true">
          <i className={styles.scrapBlue} />
          <i className={styles.scrapGrid} />
          <i className={styles.scrapRust} />
        </div>

        <div className={styles.container}>
          <div className={styles.grid}>
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
                  <svg className={styles.calloutArrow} viewBox="0 0 50 38" aria-hidden="true">
                    <path d="M44,3 C30,6 18,14 12,30" />
                    <path d="M6,24 L12,31 L19,26" />
                  </svg>
                </p>
                <img className={styles.figure + " d"} src="/art/mascot/mascot-day.webp" alt="" width={640} height={848} loading="lazy" decoding="async" />
                <img className={styles.figure + " n"} src="/art/mascot/mascot-night.webp" alt="" width={640} height={848} loading="lazy" decoding="async" />
              </div>

              <p className={styles.sticky}>{ASK.sticky}</p>
            </div>

            <div className={styles.panel}>
              <div className={styles.notebook}>
                <span className={styles.holes} aria-hidden="true" />
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
                      <li key={q.text} data-extra={i >= 3 ? "" : undefined}>
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
