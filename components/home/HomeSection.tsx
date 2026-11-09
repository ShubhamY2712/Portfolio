import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import PaperDivider from "@/components/shell/PaperDivider";
import type { SectionCopy } from "@/lib/home";
import styles from "./HomeSection.module.css";

export type SectionTone = "pale" | "paper2" | "paper";

const BG: Record<SectionTone, string> = {
  pale: "var(--hs-pale)",
  paper2: "rgb(var(--c-paper-2))",
  paper: "rgb(var(--c-paper))",
};

/**
 * Home content section, laid out like the reference: torn edge, coloured sheet, then a
 * sticky heading column beside the grid from 1360px (heading on top below that).
 */
export default function HomeSection({
  id,
  copy,
  tone,
  action,
  children,
}: {
  id: string;
  copy: SectionCopy;
  tone: SectionTone;
  action?: ReactNode;
  children: ReactNode;
}) {
  const style = { "--hs-bg": BG[tone] } as CSSProperties;
  return (
    <section id={id} className={styles.hs} style={style} aria-labelledby={id + "-title"}>
      <PaperDivider sheet={BG[tone]} shade="rgb(var(--shadow-ink))" />
      <div className={styles.body}>
        <div className={styles.wrap}>
          <div className={styles.head}>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h2 id={id + "-title"} className={styles.h2}>
              {copy.title}
              <em>{copy.accent}</em>
            </h2>
            <p className={styles.sub}>{copy.sub}</p>
            {action}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

/** Paper pill link shown under a section heading (reference: "View all work →"). */
export function ViewAll({ href, label }: { href: string; label: string }) {
  return (
    <Link className={styles.all} href={href}>
      <span>{label}</span>
      <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}
