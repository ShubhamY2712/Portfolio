import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Achievement, CredentialCard, WorkCard } from "@/lib/home";
import styles from "./HomeCards.module.css";

/** Credential card: diorama with a pinned plaque, name, role, dates, chips, round arrow. */
export function CredentialItem({ card }: { card: CredentialCard }) {
  return (
    <li className={styles.li}>
      <article className={styles.card}>
        <div className={styles.art}>
          {card.art && <img src={card.art} alt="" width={640} height={480} loading="lazy" decoding="async" />}
          <span className={styles.plaque}>{card.plaque}</span>
        </div>
        <div className={styles.copy}>
          <h3 className={styles.name}>
            <Link className={styles.link} href={card.href}>{card.name}</Link>
          </h3>
          <p className={styles.role}>{card.role}</p>
          <p className={styles.dates}>{card.dates}</p>
          <Chips items={card.chips} />
        </div>
        <span className={styles.go} aria-hidden="true"><ArrowRight size={18} /></span>
      </article>
    </li>
  );
}

/** Selected-work card: diorama, tag chips, name, one-line pitch, round arrow. */
export function WorkItem({ card }: { card: WorkCard }) {
  return (
    <li className={styles.li}>
      <article className={styles.card + " " + styles.work}>
        <div className={styles.art}>
          {card.art && <img src={card.art} alt="" width={800} height={600} loading="lazy" decoding="async" />}
        </div>
        <div className={styles.copy}>
          <Chips items={card.chips} first />
          <h3 className={styles.name}>
            <Link className={styles.link} href={card.href}>{card.name}</Link>
          </h3>
          <p className={styles.role}>{card.pitch}</p>
        </div>
        <span className={styles.go} aria-hidden="true"><ArrowRight size={18} /></span>
      </article>
    </li>
  );
}

/** Achievement: trophy art on a plinth, name, short facts. */
export function AchievementItem({ item }: { item: Achievement }) {
  return (
    <li className={styles.li}>
      <div className={styles.award}>
        <div className={styles.trophy}>
          {item.art ? (
            <img src={item.art} alt="" width={210} height={440} loading="lazy" decoding="async" />
          ) : (
            <span className={styles.plinth} aria-hidden="true" />
          )}
        </div>
        <h3 className={styles.awardName}>{item.name}</h3>
        <p className={styles.awardDetail}>{item.detail}</p>
      </div>
    </li>
  );
}

function Chips({ items, first }: { items: string[]; first?: boolean }) {
  return (
    <ul className={styles.tags + (first ? " " + styles.tagsFirst : "")}>
      {items.map((chip: string) => (
        <li key={chip}>{chip}</li>
      ))}
    </ul>
  );
}
