import Link from "next/link";
import VideoFacade from "@/components/home/VideoFacade";
import { INTRO } from "@/lib/home";
import styles from "./HomeIntro.module.css";

/** Intro column under the scene (style frame v14, approved copy 7 Nov 2026). */
export default function HomeIntro() {
  return (
    <div className={styles.intro}>
      <svg className={styles.decorLoop} viewBox="0 0 150 200" aria-hidden="true">
        <path d="M4,6 C40,70 90,70 120,60 C150,50 140,20 115,30 C85,42 95,110 140,196" />
      </svg>
      <div className={styles.decorGrid} aria-hidden="true" />

      <p className={styles.eyebrow}>{INTRO.eyebrow}</p>

      <figure className={styles.video} aria-label="Intro video">
        <VideoFacade videoId={null} />
      </figure>

      <h1 className={styles.h1}>
        <span className={styles.line}>{INTRO.h1[0]}</span>
        <span className={styles.line}>
          <span className={styles.spark}>
            {INTRO.h1[1]}
            <svg className={styles.dashes} viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5,13 L10,3" />
              <path d="M9,17 L18,11" />
            </svg>
          </span>
        </span>
        <span className={styles.line}>
          <span className={styles.u}>
            {INTRO.h1[2]}
            <svg className={styles.stroke} viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
              <path d="M2,8 C45,4 90,10 130,6 C160,4 182,6 198,5" />
            </svg>
          </span>
        </span>
      </h1>

      <p className={styles.tagline}>
        {INTRO.tagline[0]}
        <em>{INTRO.tagline[1]}</em>
        {INTRO.tagline[2]}
      </p>
      <p className={styles.summary}>{INTRO.summary}</p>

      <div className={styles.ctas}>
        <Link className={styles.btn + " " + styles.primary} href="/projects">
          {INTRO.workCta} <span className={styles.arr} aria-hidden="true">→</span>
        </Link>
        <div className={styles.ask}>
          <div className={styles.askRow}>
            {/* The assistant opens in Phase 6; until then the button jumps to the Ask section. */}
            <a className={styles.btn + " " + styles.ghost} href="#ask">
              <span aria-hidden="true">✦</span> {INTRO.askCta}
            </a>
            <img className={styles.askHead + " d"} src="/art/mascot/mascot-day.webp" alt="" width={640} height={848} />
            <img className={styles.askHead + " n"} src="/art/mascot/mascot-night.webp" alt="" width={640} height={848} />
          </div>
          <span className={styles.askCap}>
            {INTRO.askCaption}
            <svg viewBox="0 0 34 20" aria-hidden="true">
              <path d="M2,17 C12,17 22,13 30,4" />
              <path d="M23,4 L30,4 L29,11" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
