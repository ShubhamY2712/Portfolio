import Link from "next/link";
import VideoFacade from "@/components/home/VideoFacade";
import PaperDivider from "@/components/shell/PaperDivider";
import { INTRO } from "@/lib/home";
import styles from "./HomeIntro.module.css";

/** Intro sheet under the scene (style frame v14): its torn top edge overlaps the scene, which sinks beneath it on scroll. */
export default function HomeIntro() {
  return (
    <section className={styles.sheet} aria-label="Introduction">
      <PaperDivider sheet="rgb(var(--c-paper))" shade="rgb(var(--shadow-ink))" />
      <div className={styles.sheetBody}>
        {/* paper scraps in the margins, like the reference (tablets and up) */}
        <div className={styles.margin} aria-hidden="true">
          <span className={styles.patchTl} />
          <span className={styles.patchH1} />
          <span className={styles.decorGrid} />
          <svg className={styles.leaf} viewBox="0 0 200 260">
            <path d="M104,256 C100,196 94,128 74,26" />
            <path d="M96,206 C66,198 40,172 30,140 C60,142 86,168 96,206 Z" />
            <path d="M92,166 C120,152 142,124 148,92 C120,98 98,126 92,166 Z" />
            <path d="M84,120 C56,110 38,84 36,56 C62,64 80,90 84,120 Z" />
            <path d="M78,80 C98,64 110,42 108,14 C88,26 78,52 78,80 Z" />
          </svg>
          <svg className={styles.decorLoop} viewBox="0 0 150 200">
            <path d="M4,6 C40,70 90,70 120,60 C150,50 140,20 115,30 C85,42 95,110 140,196" />
          </svg>
        </div>
        <div className={styles.intro}>

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
              <span className={styles.askCap}>{INTRO.askCaption}</span>
              {/* hand-drawn arrow from the caption up to the mascot (anchored to the button's right edge, as on the reference) */}
              <svg className={styles.askArrow} viewBox="0 0 48 32" aria-hidden="true">
                <path d="M5,27 C17,25 29,17 37,7" />
                <path d="M29,9 L38,6 L39,15" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
