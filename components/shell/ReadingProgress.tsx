import styles from "./ReadingProgress.module.css";

/** Thin rust bar under the header that fills as the page is read (case studies). Pure CSS scroll timeline. */
export default function ReadingProgress() {
  return <span className={styles.bar} aria-hidden="true" />;
}
