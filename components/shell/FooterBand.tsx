import Link from "next/link";
import { Fragment } from "react";
import type { CSSProperties, ReactNode } from "react";
import { CardGlyph, GitHubGlyph, ResumeGlyph } from "@/components/shell/BrandGlyphs";
import { siWhatsapp } from "simple-icons";
import PaperDivider from "@/components/shell/PaperDivider";
import { SITE_NAME, WHATSAPP_URL } from "@/lib/site";
import styles from "./FooterBand.module.css";

// Footer copy approved via picker on 7 Nov 2026 (subline and hand line updated 9 Nov 2026).
const VERBS: string[] = ["understand", "shape", "design", "build", "test", "ship"];
const SUBLINE: string = "From a “messy problem” to a “product people trust.”";
const SIGN_OFF: string = "Designed and built with a lot of cutting chai";
const HAND_LINE: string = "Finding the problem behind the problem.";

type HillLayer = "back" | "mid" | "front";

type Social = { href: string; label: string; icon: ReactNode; external: boolean };

/**
 * Shared "Let's connect" band at the foot of every public page: terracotta
 * paper with a diagonal hatch, a rotating verb (6 verbs, 15s), contact links
 * and an animated paper scene along the bottom.
 */
export default function FooterBand({
  email,
  linkedin,
  github,
  resumeUrl,
}: {
  email: string;
  linkedin: string | null;
  github: string | null;
  resumeUrl: string | null;
}) {
  const year: number = new Date().getFullYear();
  const socials: Social[] = [];
  if (linkedin) socials.push({ href: linkedin, label: "LinkedIn", icon: <span className={styles.in} aria-hidden="true">in</span>, external: true });
  if (github) socials.push({ href: github, label: "GitHub", icon: <GitHubGlyph size={20} />, external: true });
  socials.push({ href: WHATSAPP_URL, label: "WhatsApp", icon: <WhatsAppIcon size={18} />, external: true });
  if (resumeUrl) socials.push({ href: resumeUrl, label: "Resume", icon: <ResumeGlyph size={20} />, external: true });
  socials.push({ href: "/card", label: "Digital card", icon: <CardGlyph size={20} />, external: false });

  return (
    <footer className={styles.band} aria-labelledby="band-title">
      <PaperDivider
        className={styles.torn}
        sheet="var(--band-bg)"
        back="var(--band-torn-back)"
        mid="var(--band-torn-mid)"
        shade="var(--band-torn-shade)"
      />
      <div className={styles.body}>
        <div className={styles.inner}>
          <div className={styles.intro}>
            <p className={styles.eyebrow}>Let’s connect</p>
            <h2 id="band-title" className={styles.h}>
              <span className="sr-only">Let’s {VERBS.slice(0, -1).join(", ")} and {VERBS[VERBS.length - 1]} what people trust.</span>
              <span aria-hidden="true">
                Let’s{" "}
                <span className={styles.verbs}>
                  {VERBS.map((verb: string, i: number) => (
                    <em key={verb} style={{ "--i": i } as CSSProperties}>
                      {verb}
                    </em>
                  ))}
                </span>
                <br />
                <span className={styles.rest}>what people trust.</span>
              </span>
            </h2>
            <p className={styles.sub}>{SUBLINE}</p>
          </div>

          <div className={styles.contact}>
            {email && (
              <div>
                <span className={styles.label}>Email</span>
                <Link className={styles.email} href="/contact">
                  {email}
                </Link>
              </div>
            )}
            <div>
              <span className={styles.label}>Social</span>
              <ul className={styles.social}>
                {socials.map((s: Social) => (
                  <li key={s.label}>
                    {s.external ? (
                      <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label + " (opens in a new tab)"}>
                        {s.icon}
                      </a>
                    ) : (
                      <Link href={s.href} aria-label={s.label}>
                        {s.icon}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.bar}>
            <p className={styles.copy}>
              &copy; {year} {SITE_NAME}. {SIGN_OFF} <span aria-hidden="true">☕</span>
            </p>
            <p className={styles.hand}>{HAND_LINE}</p>
          </div>
        </div>

        {/* Footer scene: three paper hill layers drift sideways while a paper
            hot-air balloon floats across and sways. Each hill layer is two copies
            of one seamless tile; day and night files swap with the theme. */}
        <div className={styles.scene} aria-hidden="true">
          <HillTrack layer="back" />
          <HillTrack layer="mid" />
          <span className={styles.balloonWrap}>
            <span className={styles.balloon}>
              <img className="d" src="/art/footer/footer-balloon-day.webp" alt="" width={400} height={480} decoding="async" />
              <img className="n" src="/art/footer/footer-balloon-night.webp" alt="" width={400} height={480} decoding="async" />
            </span>
          </span>
          <HillTrack layer="front" />
        </div>
      </div>
    </footer>
  );
}

/** WhatsApp glyph from the simple-icons set (CC0), drawn in the current text colour. */
function WhatsAppIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={siWhatsapp.path} />
    </svg>
  );
}

/** One drifting hill layer: two copies of a seamless tile, day and night files. */
function HillTrack({ layer }: { layer: HillLayer }) {
  return (
    <span className={styles.track + " " + styles[layer]}>
      {[0, 1].map((i: number) => (
        <Fragment key={i}>
          <img className="d" src={`/art/footer/footer-hills-${layer}-day.webp`} alt="" decoding="async" />
          <img className="n" src={`/art/footer/footer-hills-${layer}-night.webp`} alt="" decoding="async" />
        </Fragment>
      ))}
    </span>
  );
}
