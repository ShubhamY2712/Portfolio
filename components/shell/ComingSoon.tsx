import Link from "next/link";
import styles from "./ComingSoon.module.css";

/** Paper stub for pages built in later phases. Copy approved 7 Nov 2026. */
export default function ComingSoon({ title }: { title: string }) {
  return (
    <main id="main" className={styles.wrap}>
      <div className={styles.sheet}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.hand}>Still on the drawing board.</p>
        <p className={styles.line}>This page is being sketched right now.</p>
        <Link href="/" className={styles.btn}>
          Back home
        </Link>
      </div>
    </main>
  );
}
